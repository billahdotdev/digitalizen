import React, { useState, useRef, useEffect } from 'react';
import { IconBolt, IconWhatsApp, IconWarn } from './Icons.jsx';
import { trackSpeedTestRun, trackSpeedTestResult, trackCTA } from '../utils/tracking.js';
import { WA } from '../utils/contact.js';

/* ════════════════════════════════════════════════════════════════════════
   SpeedTest. Google Lighthouse audit inline.
   When the API fails, the fallback offers two WhatsApp paths.
     • AI Bot (instant)      → BOT  number
     • Masum directly        → GENERAL number
   ════════════════════════════════════════════════════════════════════ */

const PSI_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY  = import.meta.env.VITE_PSI_API_KEY || '';
const TIMEOUT  = 60_000;

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const normalizeUrl = (raw) => {
  const s = raw.trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
};

const isValidUrl = (s) => {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch { return false; }
};

const buildPsiUrl = (target, strategy) => {
  const params = new URLSearchParams();
  params.set('url', target);
  params.set('strategy', strategy);
  CATEGORIES.forEach((c) => params.append('category', c));
  if (API_KEY) params.set('key', API_KEY);
  return `${PSI_BASE}?${params.toString()}`;
};

const buildWaHref = (number, msg) =>
  `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

const num = (v) => (typeof v === 'number' ? v : (v?.value ?? 0));

const grade = (v, goodMax, okMax) =>
  v == null ? '' : v <= goodMax ? 'good' : v <= okMax ? 'ok' : 'bad';

export default function SpeedTest() {
  const [url,     setUrl]     = useState('');
  const [running, setRunning] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [phase,   setPhase]   = useState('');
  const abortRef = useRef(null);
  const lockRef  = useRef(false);

  useEffect(() => () => abortRef.current?.abort(), []);

  const fetchStrategy = async (target, strategy, signal) => {
    const res = await fetch(buildPsiUrl(target, strategy), { signal });
    if (res.status === 429) {
      const e = new Error('quota'); e.kind = 'quota'; throw e;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg  = body?.error?.message || '';
      const e    = new Error(msg || 'psi_error');
      if (msg.toLowerCase().includes('unable to fetch') ||
          msg.toLowerCase().includes('could not fetch')) {
        e.kind = 'unreachable';
      } else if (msg.toLowerCase().includes('quota') || res.status === 403) {
        e.kind = 'quota';
      } else {
        e.kind = 'unknown';
      }
      throw e;
    }
    return res.json();
  };

  const parse = (data) => {
    const lr     = data?.lighthouseResult ?? {};
    const cats   = lr.categories ?? {};
    const audits = lr.audits     ?? {};
    const scoreFor = (k) =>
      cats[k]?.score == null ? null : Math.round(cats[k].score * 100);
    return {
      scores: {
        performance:   scoreFor('performance'),
        accessibility: scoreFor('accessibility'),
        bestPractices: scoreFor('best-practices'),
        seo:           scoreFor('seo'),
      },
      lcp: num(audits['largest-contentful-paint']?.numericValue) / 1000,
      tbt: Math.round(num(audits['total-blocking-time']?.numericValue)),
      cls: +num(audits['cumulative-layout-shift']?.numericValue).toFixed(3),
      fcp: num(audits['first-contentful-paint']?.numericValue) / 1000,
      si:  num(audits['speed-index']?.numericValue) / 1000,
      opportunities: [
        'render-blocking-resources',
        'unused-javascript',
        'unused-css-rules',
        'uses-optimized-images',
        'uses-webp-images',
        'uses-text-compression',
        'efficient-animated-content',
        'uses-long-cache-ttl',
        'modern-image-formats',
        'unminified-css',
        'unminified-javascript',
      ]
        .map((k) => audits[k])
        .filter((a) => a && (a.score ?? 1) < 0.9 && a.details?.type !== 'manual')
        .sort((a, b) =>
          (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0)
        )
        .slice(0, 5)
        .map((a) => ({
          title:   a.title,
          savings: a.details?.overallSavingsMs
            ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s সাশ্রয়`
            : null,
        })),
    };
  };

  const handleError = (e) => {
    if (e.name === 'AbortError') return;
    if (e.kind === 'quota') {
      setError('এই মুহূর্তে automated test চালানো যাচ্ছে না।');
    } else if (e.kind === 'unreachable') {
      setError('এই URL Google reach করতে পারলো না। সাইট live এবং publicly accessible কিনা দেখুন।');
    } else if (e.message === 'timeout') {
      setError('Test ৬০ সেকেন্ডের বেশি সময় নিচ্ছে।');
    } else {
      setError('স্বয়ংক্রিয় বিশ্লেষণ ব্যর্থ হয়েছে।');
    }
  };

  const run = async () => {
    const target = normalizeUrl(url);
    if (!target || running || lockRef.current) return;
    if (!isValidUrl(target)) {
      setError('সঠিক URL দিন। যেমন, https://yoursite.com.bd');
      return;
    }

    lockRef.current = true;
    setRunning(true);
    setResult(null);
    setError('');
    trackSpeedTestRun(target);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(() => {
      ctrl.abort();
      handleError(new Error('timeout'));
    }, TIMEOUT);

    try {
      setPhase('mobile');
      const [mobRaw, deskRaw] = await Promise.all([
        fetchStrategy(target, 'mobile', ctrl.signal),
        (async () => { setPhase('desktop'); return fetchStrategy(target, 'desktop', ctrl.signal); })(),
      ]);
      setPhase('parsing');
      const mobile  = parse(mobRaw);
      const desktop = parse(deskRaw);
      setResult({ mobile, desktop, url: target });
      trackSpeedTestResult(mobile.scores.performance ?? 0);
    } catch (e) {
      handleError(e);
    } finally {
      clearTimeout(timer);
      abortRef.current = null;
      setRunning(false);
      setPhase('');
      lockRef.current = false;
    }
  };

  const onKey = (e) => { if (e.key === 'Enter') run(); };

  const testedUrl = url.trim() || 'আমার সাইট';
  const botMsg    = `হ্যালো! ${testedUrl} এর speed test করতে চাই কিন্তু automated tool কাজ করছে না। AI অ্যাসিস্ট্যান্ট এর সাথে কথা বলতে চাই।`;
  const humanMsg  = `হ্যালো Masum! ${testedUrl} এর performance audit দরকার। সরাসরি কথা বলতে চাই।`;

  return (
    <section className="section" id="speed" aria-labelledby="speed-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৫ · আপনার সাইট কেমন?</div>
        <h2 id="speed-h2" className="section-h2">
          আপনার পেজ<br /><em>কত দ্রুত?</em>
        </h2>
        <p className="section-sub">
          URL দিন। Google Lighthouse দিয়ে real audit হবে।<br />
          Performance, Accessibility, Best Practices, SEO, চারটাই।
        </p>

        <div className="speed-card">
          <div className="speed-url-row">
            <input
              className="speed-input"
              type="url"
              inputMode="url"
              placeholder="https://yoursite.com.bd"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(''); }}
              onKeyDown={onKey}
              aria-label="Website URL to analyze"
              disabled={running}
              autoComplete="url"
              spellCheck="false"
            />
            <button
              className="speed-run-btn"
              onClick={run}
              disabled={running || !url.trim()}
              aria-busy={running}
            >
              <IconBolt />
              {!running && 'Analyze'}
              {running && phase === 'mobile'  && 'Mobile…'}
              {running && phase === 'desktop' && 'Desktop…'}
              {running && phase === 'parsing' && 'Parsing…'}
            </button>
          </div>

          {/* Error state, converts failure into contact opportunity. */}
          {error && (
            <div role="alert" className="speed-error">
              <div className="speed-error-head">
                <span className="speed-error-icon" aria-hidden><IconWarn /></span>
                <div>
                  <div className="speed-error-title">{error}</div>
                  <div className="speed-error-sub">
                    আপনার সাইটের performance audit আমরা manually করে দিচ্ছি। এক্ষুনি কথা বলুন।
                  </div>
                </div>
              </div>

              <div className="speed-error-actions">
                <a
                  href={buildWaHref(WA.BOT, botMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('SpeedTest fallback, bot', 'speed_error')}
                  className="speed-err-bot"
                >
                  <IconWhatsApp width={18} height={18} />
                  <div>
                    <div className="speed-err-t">AI Bot এ কথা বলুন</div>
                    <div className="speed-err-s">২৪/৭ · ২ সেকেন্ডে reply</div>
                  </div>
                </a>

                <a
                  href={buildWaHref(WA.GENERAL, humanMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('SpeedTest fallback, human', 'speed_error')}
                  className="speed-err-human"
                >
                  <IconWhatsApp width={18} height={18} className="accent" />
                  <div>
                    <div className="speed-err-t">সরাসরি মাসুম কে জানান</div>
                    <div className="speed-err-s muted">Manual audit · personal touch</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {running && (
            <div className="speed-loading" aria-live="polite">
              <div className="speed-spinner" aria-hidden />
              <div className="speed-loading-track">
                <div className="speed-loading-bar" />
              </div>
              <span>
                {phase === 'mobile'  && 'Mobile audit চলছে। Google Lighthouse'}
                {phase === 'desktop' && 'Desktop audit চলছে। প্রায় শেষ'}
                {phase === 'parsing' && 'Results parse করছি'}
              </span>
            </div>
          )}

          {result && (
            <div className="speed-results" aria-live="polite">
              <div className="speed-section-tag">// Lighthouse Scores · Mobile</div>
              <div className="speed-scores">
                <ScoreCircle label="Performance"    score={result.mobile.scores.performance} />
                <ScoreCircle label="Accessibility"  score={result.mobile.scores.accessibility} />
                <ScoreCircle label="Best Practices" score={result.mobile.scores.bestPractices} />
                <ScoreCircle label="SEO"            score={result.mobile.scores.seo} />
              </div>

              <div className="speed-section-tag">// Core Web Vitals · Mobile</div>
              <div className="speed-metrics">
                <Metric label="LCP" sub="Largest Content" val={`${result.mobile.lcp.toFixed(1)}s`} cls={grade(result.mobile.lcp, 2.5, 4)} />
                <Metric label="TBT" sub="Blocking Time"   val={`${result.mobile.tbt}ms`}           cls={grade(result.mobile.tbt, 200, 600)} />
                <Metric label="CLS" sub="Layout Shift"    val={`${result.mobile.cls}`}             cls={grade(result.mobile.cls, 0.1, 0.25)} />
              </div>

              <div className="speed-mini-row">
                <MiniMetric label="FCP"         val={`${result.mobile.fcp.toFixed(1)}s`} cls={grade(result.mobile.fcp, 1.8, 3)} />
                <MiniMetric label="Speed Index" val={`${result.mobile.si.toFixed(1)}s`}  cls={grade(result.mobile.si, 3.4, 5.8)} />
              </div>

              <Bar label="Mobile Performance"  pct={result.mobile.scores.performance ?? 0} />
              <Bar label="Desktop Performance" pct={result.desktop.scores.performance ?? 0} />

              {result.mobile.opportunities.length > 0 && (
                <div className="speed-insights">
                  <div className="insight-title">// কী উন্নতি করলে কনভার্সন বাড়বে</div>
                  {result.mobile.opportunities.map((op, i) => (
                    <div key={i} className="insight-item">
                      <div
                        className="insight-dot"
                        style={{ background: i === 0 ? '#ef4444' : i === 1 ? '#f59e0b' : 'var(--muted)' }}
                        aria-hidden
                      />
                      <span>
                        {op.title}
                        {op.savings && (
                          <span className="insight-saving">({op.savings})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="speed-cta-band">
                <p className="speed-cta-msg">
                  {(result.mobile.scores.performance ?? 0) < 90
                    ? <><strong>আমরা এই স্কোর ৯০+ করতে পারি।</strong> ফ্রি অডিটে roadmap পান।</>
                    : <><strong>Performance score ভালো।</strong> CAPI ট্র্যাকিং এবং conversion এর জন্য audit নিন।</>}
                </p>
                <button
                  className="speed-cta-btn"
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  ফ্রি অডিট বুক করুন
                </button>
              </div>
            </div>
          )}

          <p className="speed-note">
            * Powered by Google Lighthouse · real audit data
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Sub components ────────────────────────── */
function ScoreCircle({ label, score }) {
  const value = score == null ? null : score;
  const color =
    value == null ? 'var(--muted)' :
    value >= 90   ? '#22c55e' :
    value >= 50   ? '#f59e0b' :
                    '#ef4444';
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = ((value ?? 0) / 100) * circ;
  return (
    <div className="score-circle-wrap">
      <div className="score-circle-svg">
        <svg width={64} height={64} viewBox="0 0 64 64" aria-hidden>
          <circle cx={32} cy={32} r={r} fill="none" stroke="var(--muted-3, rgba(255,255,255,.08))" strokeWidth={4} />
          <circle
            cx={32} cy={32} r={r} fill="none"
            stroke={color} strokeWidth={4}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s var(--ease, ease-out)' }}
          />
        </svg>
        <div className="score-circle-val" style={{ color }}>{value ?? '·'}</div>
      </div>
      <div className="score-circle-lbl">{label}</div>
    </div>
  );
}

function Metric({ val, cls: clsName, label, sub }) {
  return (
    <div className="metric-cell">
      <span className={`metric-val ${clsName}`}>{val}</span>
      <div className="metric-label">{label}</div>
      <span className="metric-sub">{sub}</span>
    </div>
  );
}

function MiniMetric({ label, val, cls: clsName }) {
  return (
    <div className="mini-metric">
      <span className="mini-metric-lbl">{label}</span>
      <span className={`metric-val ${clsName} mini-metric-val`}>{val}</span>
    </div>
  );
}

function Bar({ label, pct }) {
  const safePct = Number.isFinite(pct) ? pct : 0;
  const fill  = safePct >= 90 ? 'fill-good' : safePct >= 50 ? 'fill-ok' : 'fill-bad';
  const color = safePct >= 90 ? 'color-good' : safePct >= 50 ? 'color-ok' : 'color-bad';
  return (
    <div className="speed-bar-wrap">
      <div className="speed-bar-label">
        <span>{label}</span>
        <span className={color}>{safePct}/100</span>
      </div>
      <div className="speed-bar-bg">
        <div className={`speed-bar-fill ${fill}`} style={{ width: `${safePct}%` }} />
      </div>
    </div>
  );
}
