/**
 * FinderPdfLayer.jsx — Digitalizen Brand PDF Template v2026.3
 *
 * Design: Industrial Editorial — B&W-safe, zero border-radius.
 * Narrative: Problem → Diagnosis → Solution → Features → Sprint → Table
 * New: Identity band, numbered section headers, Action strip CTA.
 */

import './FinderPdfLayer.css'
import { WA_NUMBER } from '../lib/analytics.js'

/* ── Helpers ─────────────────────────────────── */
const today = () =>
  new Date().toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

const scoreLabel = (pkgKey) =>
  pkgKey === 'micro_test'   ? 'শুরুর পর্যায়' :
  pkgKey === 'monthly_care' ? 'গ্রোথ রেডি'   : 'স্কেল রেডি'

const priceDisplay = (pkg, pkgKey) =>
  pkgKey === 'micro_test' ? 'FREE' : `৳${pkg.price}`

/* ── Section header ───────────────────────────── */
function SectionHeader({ num, title, variant }) {
  return (
    <div className="fpl-section-header">
      <div className="fpl-section-num">{num}</div>
      <div className={`fpl-section-title${variant ? ` fpl-section-title--${variant}` : ''}`}>
        {title}
      </div>
    </div>
  )
}

/* ── Problem item ─────────────────────────────── */
function ProblemItem({ label, severity }) {
  return (
    <div className={`fpl-problem-item fpl-problem-item--${severity}`}>
      <span className="fpl-problem-dot" />
      <span className="fpl-problem-text">{label}</span>
    </div>
  )
}

/* ── Warning chip ─────────────────────────────── */
function WarningChip({ label, type }) {
  return (
    <div className={`fpl-warn-chip fpl-warn-chip--${type}`}>
      <span className="fpl-warn-dot" />
      {label}
    </div>
  )
}

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────*/
export default function FinderPdfLayer({ id, result, leadName }) {
  if (!result) return null

  const pkg   = result.pkg
  const score = result.score
  const label = scoreLabel(result.pkgKey)
  const date  = today()

  /* Feature split */
  const half     = Math.ceil(pkg.features.length / 2)
  const featLeft  = pkg.features.slice(0, half)
  const featRight = pkg.features.slice(half)

  /* Sprint steps */
  const sprintSteps = pkg.sprint30 || pkg.plan30 || []

  /* Problems — severity drives left-border weight in B&W */
  const problems = [
    result.trackingWarning             && { key: 'tracking', label: 'Pixel + CAPI সেটআপ নেই → অ্যাড বাজেট লিক হচ্ছে',      severity: 'critical' },
    result.kpiWarning                  && { key: 'kpi',      label: 'ROAS ট্র্যাক হচ্ছে না → লাভ-লোকসান অস্পষ্ট',          severity: 'high'     },
    result.techGap                     && { key: 'tech',     label: 'Legacy Tech → সিজনাল ক্যাম্পেইনে দেরি হচ্ছে',         severity: 'high'     },
    result.landingPageWarning === 'none' && { key: 'lp-none', label: 'ডেডিকেটেড ল্যান্ডিং পেজ নেই → কনভার্সন কম',        severity: 'medium'   },
    result.landingPageWarning === 'weak' && { key: 'lp-weak', label: 'পেজ স্পিড দুর্বল → ভিজিটর হারিয়ে যাচ্ছে',          severity: 'medium'   },
  ].filter(Boolean)

  /* Hero warning chips */
  const warnings = [
    result.trackingWarning             && { key: 'tracking', label: 'Pixel + CAPI নেই',          type: 'red'   },
    result.kpiWarning                  && { key: 'kpi',      label: 'ROAS ট্র্যক হচ্ছে না',      type: 'amber' },
    result.techGap                     && { key: 'tech',     label: 'Legacy Tech দেখা গেছে',      type: 'amber' },
    result.landingPageWarning === 'none' && { key: 'lp-none', label: 'ল্যান্ডিং পেজ নেই',       type: 'amber' },
    result.landingPageWarning === 'weak' && { key: 'lp-weak', label: 'পেজ স্পিড দুর্বল',         type: 'amber' },
  ].filter(Boolean)

  /* Section counter */
  let sectionCount = 0
  const nextNum = () => String(++sectionCount).padStart(2, '0')

  return (
    <div id={id} className="fpl-root" aria-hidden="true">

      {/* ══ HEADER ════════════════════════════════ */}
      <header className="fpl-header">
        <div className="fpl-header-left">
          <div className="fpl-brand-wordmark">DIGITALIZEN</div>
          <div className="fpl-brand-tagline">Your Digital Growth Partner · Bangladesh</div>
        </div>
        <div className="fpl-header-right">
          <div className="fpl-report-badge">২০২৬ Business Roadmap</div>
          <div className="fpl-report-date">{date}</div>
        </div>
      </header>

      {/* ══ IDENTITY BAND ══════════════════════════
          "This report was prepared for [Name]"
          The personalisation moment — makes it feel
          like a bespoke consultant report, not a PDF.
      ══════════════════════════════════════════════ */}
      <div className="fpl-identity">
        <div className="fpl-identity-for">
          <div className="fpl-identity-label">Prepared for</div>
          <div className="fpl-identity-value">
            {leadName || 'আপনার বিজনেস'}
          </div>
        </div>
        <div className="fpl-identity-meta">
          <div className="fpl-identity-type">প্রস্তাবিত প্ল্যান</div>
          <div className="fpl-identity-pkg">{pkg.name}</div>
        </div>
      </div>

      {/* ══ HERO — Score + Package ═════════════════ */}
      <section className="fpl-hero">

        {/* Score: editorial stat — large number is the story */}
        <div className="fpl-score-panel">
          <div className="fpl-score-number">{score}</div>
          <div className="fpl-score-denom">/ 100</div>
          <div className="fpl-score-bar-track">
            <div className="fpl-score-bar-fill" style={{ width: `${score}%` }} />
          </div>
          <div className="fpl-score-label">{label}</div>
          <div className="fpl-score-sub">টেক হেলথ স্কোর</div>
        </div>

        {/* Package identity */}
        <div className="fpl-pkg-panel">
          <div className="fpl-pkg-eyebrow">প্রস্তাবিত সমাধান</div>
          <div className="fpl-pkg-name">{pkg.name}</div>
          <div className="fpl-pkg-price-row">
            <span className="fpl-pkg-price">{priceDisplay(pkg, result.pkgKey)}</span>
            {pkg.priceNote && (
              <span className="fpl-pkg-period">· {pkg.priceNote}</span>
            )}
          </div>

          {leadName && (
            <div className="fpl-biz-chip">
              <span className="fpl-biz-pulse" />
              {pkg.tag}
            </div>
          )}

          {warnings.length > 0 && (
            <div className="fpl-warn-row">
              {warnings.map(w => (
                <WarningChip key={w.key} label={w.label} type={w.type} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══ 01 · THE PROBLEM ══════════════════════
          Agitate before you solve.
          B&W: border-left weight = severity.
      ══════════════════════════════════════════════ */}
      {problems.length > 0 && (
        <section className="fpl-section fpl-problem-section">
          <SectionHeader
            num={nextNum()}
            title="THE PROBLEM — অডিটে চিহ্নিত সমস্যা"
            variant="problem"
          />
          <div className="fpl-section-body fpl-section-body--full">
            <div className="fpl-problem-grid">
              {problems.map(p => (
                <ProblemItem key={p.key} label={p.label} severity={p.severity} />
              ))}
            </div>
            <p className="fpl-problem-note">
              উপরের সমস্যাগুলো আপনার ১৪টি উত্তরের উপর ভিত্তি করে চিহ্নিত। এগুলো সমাধান না করলে অ্যাড বাজেট বাড়ালেও ফলাফল আসবে না।
            </p>
          </div>
        </section>
      )}

      {/* ══ 02 · DIAGNOSIS ════════════════════════ */}
      <section className="fpl-section">
        <SectionHeader num={nextNum()} title="DIAGNOSIS — প্রফেশনাল অ্যানালাইসিস" />
        <div className="fpl-section-body fpl-section-body--full">
          <div className="fpl-diag-grid">
            <div className="fpl-diag-col">
              <div className="fpl-diag-head">
                <span className="fpl-diag-icon">↗</span>
                এখন কোথায় আছেন
              </div>
              <p className="fpl-diag-body">{result.diag.stage}</p>
            </div>
            <div className="fpl-diag-col">
              <div className="fpl-diag-head">
                <span className="fpl-diag-icon">!</span>
                আমরা কী দেখলাম
              </div>
              <p className="fpl-diag-body">{result.diag.insight}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 03 · SOLUTION ═════════════════════════ */}
      <section className="fpl-section fpl-advice-section">
        <SectionHeader num={nextNum()} title="SOLUTION — আমাদের পরামর্শ" />
        <div className="fpl-section-body fpl-section-body--full">
          <div className="fpl-advice-box">
            <span className="fpl-advice-quote">"</span>
            <p className="fpl-advice-text">{result.diag.advice}</p>
          </div>
        </div>
      </section>

      {/* ══ 04 · WHAT YOU GET ═════════════════════ */}
      <section className="fpl-section">
        <SectionHeader num={nextNum()} title="WHAT YOU GET — এই প্ল্যানে যা পাচ্ছেন" />
        <div className="fpl-section-body fpl-section-body--full">
          <div className="fpl-feat-grid">
            <ul className="fpl-feat-col">
              {featLeft.map((f, i) => (
                <li key={i} className="fpl-feat-item">
                  <span className="fpl-feat-tick">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <ul className="fpl-feat-col">
              {featRight.map((f, i) => (
                <li key={i} className="fpl-feat-item">
                  <span className="fpl-feat-tick">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══ 05 · 30-DAY SPRINT ════════════════════ */}
      <section className="fpl-section">
        <SectionHeader num={nextNum()} title="30-DAY SPRINT — ৩০-দিনের লঞ্চ স্প্রিন্ট" />
        <div className="fpl-section-body fpl-section-body--full">
          <ol className="fpl-roadmap">
            {sprintSteps.map((step, i) => (
              <li key={i} className="fpl-roadmap-item">
                <div className="fpl-roadmap-num">0{i + 1}</div>
                <div className="fpl-roadmap-connector" aria-hidden="true" />
                <p className="fpl-roadmap-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ══ 06 · TECH COMPARISON ══════════════════ */}
      <section className="fpl-section fpl-table-section">
        <SectionHeader num={nextNum()} title="TECH COMPARISON — Vite + React vs Legacy" />
        <div className="fpl-section-body fpl-section-body--full">
          <table className="fpl-table">
            <thead>
              <tr>
                <th className="fpl-th-metric">মেট্রিক</th>
                <th className="fpl-th-good">✓ Vite + React (আমরা বানাই)</th>
                <th className="fpl-th-bad">✗ WordPress / থিম</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['পেজ লোড স্পিড',    '< ১ সেকেন্ড',     '৩–৬ সেকেন্ড'],
                ['Core Web Vitals',  'পাস (Green ✓)',    'প্রায়ই ফেল ✗'],
                ['সিজনাল আপডেট',    'মিনিটে লাইভ',     'ডেভেলপার দরকার'],
                ['CAPI Integration', 'নেটিভ সাপোর্ট',   'প্লাগইন নির্ভর'],
                ['Mobile Score',     '৯৫+ / ১০০',       '৫০–৭০ / ১০০'],
              ].map(([metric, good, bad], i) => (
                <tr key={i} className={i % 2 === 0 ? 'fpl-tr-alt' : ''}>
                  <td className="fpl-td-metric">{metric}</td>
                  <td className="fpl-td-good">{good}</td>
                  <td className="fpl-td-bad">{bad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ══ ACTION STRIP — "The door before the door"
          Placed above the footer — not buried inside it.
          B&W: blue bg → ~35% gray, white text → readable.
          The vertical "NEXT STEP" tab creates visual weight
          that draws the eye before the footer ends the page.
      ══════════════════════════════════════════════ */}
      <div className="fpl-action-strip">
        <div className="fpl-action-label">NEXT STEP</div>
        <div className="fpl-action-body">
          <div className="fpl-action-left">
            <div className="fpl-action-headline">
              এখনই কথা বলুন — পরামর্শ ফ্রি।
            </div>
            <div className="fpl-action-sub">
              কোনো চুক্তি নেই · কোনো বাধ্যবাধকতা নেই · শুধু ফলাফল
            </div>
          </div>
          <div className="fpl-action-contact">
            <div className="fpl-action-wa-label">WhatsApp</div>
            <div className="fpl-action-wa-num">+{WA_NUMBER}</div>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ════════════════════════════════ */}
      <footer className="fpl-footer">
        <div className="fpl-footer-contact">
          <span className="fpl-footer-label">WhatsApp</span>
          <span className="fpl-footer-val">wa.me/{WA_NUMBER}</span>
        </div>

        <div className="fpl-footer-brand">
          <div className="fpl-footer-wordmark">DIGITALIZEN</div>
          <div className="fpl-footer-copy">© 2026 · All rights reserved</div>
        </div>

        <div className="fpl-footer-web">
          <span className="fpl-footer-label">Website</span>
          <span className="fpl-footer-val">digitalizen.com.bd</span>
        </div>
      </footer>

    </div>
  )
}
