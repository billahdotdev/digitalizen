import React, { useState, useRef, useEffect } from 'react';
import { IconBolt, IconWhatsApp } from './Icons.jsx';
import { trackSpeedTestRun, trackSpeedTestResult, trackCTA } from '../utils/tracking.js';

/* ════════════════════════════════════════════════════════════════════════
   SpeedTest — Google Lighthouse-powered audit (inline)
   ────────────────────────────────────────────────────────────────────
   Runs the SAME audit you'd get at pagespeed.web.dev, but right here.
   Uses Google PageSpeed Insights API v5 — real Lighthouse engine.

   ── API KEY (optional but RECOMMENDED for production) ──────────────
   Without key  →  ~25 req/IP/day (anonymous quota — hits 429 fast)
   With key     →  400 req/100s (effectively unlimited for our use)

   See .env file at project root for setup instructions.

   ── Failure mode strategy ──────────────────────────────────────────
   When the API fails (quota, unreachable URL, timeout, network), we
   DON'T send the user to an external fallback. Instead we convert
   the frustration into a high-intent lead by surfacing two direct
   WhatsApp contacts:
     • AI Bot (instant, 24/7)            → 8801311773040
     • Masum directly (manual audit)     → 8801711992558
   The URL the user was trying to test is included in the pre-filled
   message so whoever answers has full context.
   ──────────────────────────────────────────────────────────────────── */

const PSI_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const API_KEY  = import.meta.env.VITE_PSI_API_KEY || '';
const TIMEOUT  = 60_000;  // 60s — PSI can be slow on uncached first-run audits

const WA_BOT   = '8801311773040';   // Live AI bot — Meta Cloud API
const WA_HUMAN = '8801711992558';   // Masum direct

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
  CATEGORIES.forEach(c => params.append('category', c));
  if (API_KEY) params.set('key', API_KEY);
  return `${PSI_BASE}?${params.toString()}`;
};

const buildWaHref = (number, msg) =>
  `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;

const num = (v) => (typeof v === 'number' ? v : (v?.value ?? 0));

// Color-coded class based on a threshold (good < ok < bad)
const grade = (v, goodMax, okMax) =>
  v == null ? '' : v <= goodMax ? 'good' : v <= okMax ? 'ok' : 'bad';

export default function SpeedTest() {
  const [url,     setUrl]     = useState('');
  const [running, setRunning] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState('');
  const [phase,   setPhase]   = useState('');  // mobile | desktop | parsing
  const abortRef = useRef(null);
  const lockRef  = useRef(false);

  // Cancel any in-flight request if user unmounts mid-audit
  useEffect(() => () => abortRef.current?.abort(), []);

  const fetchStrategy = async (target, strategy, signal) => {
    const res = await fetch(buildPsiUrl(target, strategy), { signal });

    if (res.status === 429) {
      const e = new Error('quota');
      e.kind = 'quota';
      throw e;
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

  // Parse a PSI response — handles missing fields gracefully
  const parse = (data) => {
    const lr     = data?.lighthouseResult ?? {};
    const cats   = lr.categories ?? {};
    const audits = lr.audits     ?? {};

    const scoreFor = (k) =>
      cats[k]?.score == null ? null : Math.round(cats[k].score * 100);

    return {
      scores: {
        performance:    scoreFor('performance'),
        accessibility:  scoreFor('accessibility'),
        bestPractices:  scoreFor('best-practices'),
        seo:            scoreFor('seo'),
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
        .map(k => audits[k])
        .filter(a => a && (a.score ?? 1) < 0.9 && a.details?.type !== 'manual')
        .sort((a, b) =>
          (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0)
        )
        .slice(0, 5)
        .map(a => ({
          title:   a.title,
          savings: a.details?.overallSavingsMs
            ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s সাশ্রয়`
            : null,
        })),
    };
  };

  const handleError = (e) => {
    if (e.name === 'AbortError') return;  // user-initiated cancel
    if (e.kind === 'quota') {
      setError('এই মুহূর্তে automated test চালানো যাচ্ছে না।');
    } else if (e.kind === 'unreachable') {
      setError('এই URL Google reach করতে পারলো না — সাইট live ও publicly accessible কিনা দেখুন।');
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
      setError('সঠিক URL দিন। যেমন: https://yoursite.com.bd');
      return;
    }

    lockRef.current = true;
    setRunning(true);
    setResult(null);
    setError('');
    trackSpeedTestRun(target);

    const ctrl  = new AbortController();
    abortRef.current = ctrl;
    const timer = setTimeout(() => {
      ctrl.abort();
      const e = new Error('timeout');
      handleError(e);
    }, TIMEOUT);

    try {
      setPhase('mobile');
      const [mobRaw, deskRaw] = await Promise.all([
        fetchStrategy(target, 'mobile',  ctrl.signal),
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

  // Pre-filled WhatsApp messages for error fallback — URL-aware
  const testedUrl = url.trim() || 'আমার সাইট';
  const botMsg    = `হ্যালো! ${testedUrl} এর speed test করতে চাই কিন্তু automated tool কাজ করছে না। AI Bot-এ কথা বলতে চাই।`;
  const humanMsg  = `হ্যালো Masum! ${testedUrl} এর performance audit দরকার। সরাসরি কথা বলতে চাই।`;

  return (
    <section className="section" id="speed" aria-labelledby="speed-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৫ — আপনার সাইট কেমন?</div>
        <h2 id="speed-h2" className="section-h2">
          আপনার পেজ<br /><em>কত দ্রুত?</em>
        </h2>
        <p className="section-sub">
          URL দিন — Google Lighthouse দিয়ে real audit হবে।
          Performance, Accessibility, Best Practices, SEO — চারটাই।
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

          {/* Error state — converts failure into a contact opportunity */}
          {error && (
            <div role="alert" style={{
              padding: '18px 20px',
              background: 'rgba(239,68,68,.06)',
              border: '1px solid rgba(239,68,68,.22)',
              borderLeft: '3px solid #ef4444',
              marginBottom: 16,
            }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                marginBottom: 14,
              }}>
                <span aria-hidden style={{ color: '#ef4444', fontWeight: 800, lineHeight: 1.4, fontSize: 14 }}>⚠</span>
                <div>
                  <div style={{ color: 'var(--text)', fontSize: 13, fontWeight: 700, lineHeight: 1.5, marginBottom: 4 }}>
                    {error}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.7, fontFamily: 'var(--sans)' }}>
                    আপনার সাইটের performance audit আমরা manually করে দিচ্ছি — এক্ষুনি কথা বলুন।
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 8,
              }}>
                <a
                  href={buildWaHref(WA_BOT, botMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('SpeedTest fallback · bot', 'speed_error')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: 'var(--accent)', color: '#060d1a',
                    textDecoration: 'none',
                    boxShadow: '0 1px 0 rgba(255,255,255,.18) inset, 0 4px 14px rgba(80,200,120,.28)',
                    transition: 'transform .2s, box-shadow .2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <IconWhatsApp width={18} height={18} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.3, marginBottom: 2 }}>
                      AI Bot-এ কথা বলুন
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: '.04em', opacity: .72 }}>
                      ২৪/৭ · ২ সেকেন্ডে reply
                    </div>
                  </div>
                </a>

                <a
                  href={buildWaHref(WA_HUMAN, humanMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTA('SpeedTest fallback · human', 'speed_error')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    background: 'transparent', color: 'var(--text)',
                    border: '1px solid var(--border-a)',
                    textDecoration: 'none',
                    transition: 'background .2s, border-color .2s, transform .2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent-soft)';
                    e.currentTarget.style.borderColor = 'var(--border-a2)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-a)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <IconWhatsApp width={18} height={18} style={{ color: 'var(--accent)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3, marginBottom: 2 }}>
                      Masum-কে সরাসরি
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: '.04em', color: 'var(--muted)' }}>
                      Manual audit · personal touch
                    </div>
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
                {phase === 'mobile'  && 'Mobile audit চলছে… (Google Lighthouse)'}
                {phase === 'desktop' && 'Desktop audit চলছে… প্রায় শেষ'}
                {phase === 'parsing' && 'Results parse করছি…'}
              </span>
            </div>
          )}

          {result && (
            <div className="speed-results" aria-live="polite">

              {/* All 4 Lighthouse category scores — Mobile */}
              <div style={{
                fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--mono)',
                letterSpacing: '.14em', textTransform: 'uppercase',
                fontWeight: 700, marginBottom: 10,
              }}>
                // Lighthouse Scores · Mobile
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 8, marginBottom: 24,
              }}>
                <ScoreCircle label="Performance" score={result.mobile.scores.performance} />
                <ScoreCircle label="Accessibility" score={result.mobile.scores.accessibility} />
                <ScoreCircle label="Best Practices" score={result.mobile.scores.bestPractices} />
                <ScoreCircle label="SEO" score={result.mobile.scores.seo} />
              </div>

              {/* Core Web Vitals */}
              <div style={{
                fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--mono)',
                letterSpacing: '.14em', textTransform: 'uppercase',
                fontWeight: 700, marginBottom: 10,
              }}>
                // Core Web Vitals · Mobile
              </div>
              <div className="speed-metrics" style={{ marginBottom: 16 }}>
                <Metric label="LCP" sub="Largest Content" val={`${result.mobile.lcp.toFixed(1)}s`} cls={grade(result.mobile.lcp, 2.5, 4)} />
                <Metric label="TBT" sub="Blocking Time"   val={`${result.mobile.tbt}ms`}           cls={grade(result.mobile.tbt, 200, 600)} />
                <Metric label="CLS" sub="Layout Shift"    val={`${result.mobile.cls}`}             cls={grade(result.mobile.cls, 0.1, 0.25)} />
              </div>

              {/* Supplementary timings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                <MiniMetric label="FCP" val={`${result.mobile.fcp.toFixed(1)}s`} cls={grade(result.mobile.fcp, 1.8, 3)} />
                <MiniMetric label="Speed Index" val={`${result.mobile.si.toFixed(1)}s`} cls={grade(result.mobile.si, 3.4, 5.8)} />
              </div>

              {/* Mobile vs Desktop performance comparison */}
              <Bar label="Mobile Performance"  pct={result.mobile.scores.performance ?? 0} />
              <Bar label="Desktop Performance" pct={result.desktop.scores.performance ?? 0} />

              {/* Top opportunities */}
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
                          <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 10, marginLeft: 6 }}>
                            ({op.savings})
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Conversion CTA (success path) */}
              <div style={{
                marginTop: 20, padding: '16px 18px',
                background: 'var(--accent-soft)',
                border: '1px solid var(--border-a)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 12,
              }}>
                <p style={{ fontSize: 12.5, color: 'var(--muted)', fontFamily: 'var(--mono)', lineHeight: 1.65, margin: 0, flex: '1 1 200px' }}>
                  {(result.mobile.scores.performance ?? 0) < 90
                    ? <><strong style={{ color: 'var(--text)' }}>আমরা এই স্কোর ৯০+ করতে পারি।</strong> ফ্রি অডিটে roadmap পান।</>
                    : <><strong style={{ color: 'var(--text)' }}>Performance score ভালো।</strong> CAPI ট্র্যাকিং ও conversion-এর জন্য audit নিন।</>}
                </p>
                <button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    background: 'var(--accent)', color: '#060d1a',
                    padding: '10px 18px', fontSize: 11, fontWeight: 700,
                    border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                    minHeight: 38, fontFamily: 'var(--sans)', letterSpacing: '.04em',
                  }}
                >
                  ফ্রি অডিট বুক করুন →
                </button>
              </div>
            </div>
          )}

          <p style={{
            fontSize: 10, color: 'var(--muted-2)', textAlign: 'center',
            marginTop: 14, fontFamily: 'var(--mono)', lineHeight: 1.5,
          }}>
            * Powered by Google Lighthouse · real audit data
          </p>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── Sub-components ────────────────────────── */

function ScoreCircle({ label, score }) {
  const value = score == null ? null : score;
  const color =
    value == null   ? 'var(--muted)' :
    value >= 90     ? '#22c55e' :
    value >= 50     ? '#f59e0b' :
                      '#ef4444';

  const r = 26;
  const circ = 2 * Math.PI * r;
  const dash = ((value ?? 0) / 100) * circ;

  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      padding: '14px 10px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <svg
          width={64} height={64} viewBox="0 0 64 64"
          style={{ transform: 'rotate(-90deg)', display: 'block' }}
          aria-hidden
        >
          <circle cx={32} cy={32} r={r} fill="none" stroke="var(--muted-3, rgba(255,255,255,.08))" strokeWidth={4} />
          <circle
            cx={32} cy={32} r={r} fill="none"
            stroke={color} strokeWidth={4}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s var(--ease, ease-out)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 17, fontWeight: 800, color,
          fontFamily: 'var(--mono)', lineHeight: 1,
        }}>
          {value ?? '—'}
        </div>
      </div>
      <div style={{
        fontSize: 9, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        fontFamily: 'var(--mono)', textAlign: 'center', lineHeight: 1.3,
      }}>
        {label}
      </div>
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
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)',
      padding: '12px 14px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{
        fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--mono)',
        textTransform: 'uppercase', letterSpacing: '.06em',
      }}>{label}</span>
      <span className={`metric-val ${clsName}`} style={{ fontSize: 16, marginBottom: 0 }}>{val}</span>
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
