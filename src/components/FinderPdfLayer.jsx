/**
 * FinderPdfLayer.jsx — Digitalizen Brand PDF Template v2026.8
 *
 * Architecture: Discrete A4 Pages — Block Card Layout
 * Each .fpl-a4-page is captured separately by generatePdf.js.
 * Each section is a standalone bordered card — zero mid-content splits.
 *
 * Dynamic page count:
 *   micro_test + monthly_care → 3 pages
 *   brand_care                → 4 pages (features + sprint split)
 *
 * Design: Industrial Editorial — B&W-safe, zero border-radius.
 * Narrative: Problem → Diagnosis → Solution → Features → Sprint → Table
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

/* ── Section block wrapper ────────────────────── */
function SectionCard({ header, children, variant }) {
  return (
    <div className={`fpl-card${variant ? ` fpl-card--${variant}` : ''}`}>
      {header}
      <div className="fpl-card-body">
        {children}
      </div>
    </div>
  )
}

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

/* ── Page strip — pages 2+ ───────────────────── */
function PageStrip({ pkgName, page, total }) {
  return (
    <div className="fpl-page-strip">
      <div className="fpl-page-strip__brand">DIGITALIZEN</div>
      <div className="fpl-page-strip__meta">
        <div className="fpl-page-strip__pkg">{pkgName}</div>
        <div className="fpl-page-strip__pg">{page} / {total}</div>
      </div>
    </div>
  )
}

/* ── Shared Footer ───────────────────────────── */
function PageFooter() {
  return (
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
        <span className="fpl-footer-val">https://digitalizen.billah.dev</span>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
──────────────────────────────────────────────────*/
export default function FinderPdfLayer({ id, result, leadName }) {
  if (!result) return null

  const pkg       = result.pkg
  const score     = result.score
  const label     = scoreLabel(result.pkgKey)
  const date      = today()
  const isBrand   = result.pkgKey === 'brand_care'
  const TOTAL_PG  = isBrand ? '4' : '3'

  /* Feature split — brand_care gets single column on its own page */
  const featLeft  = isBrand ? pkg.features : pkg.features.slice(0, Math.ceil(pkg.features.length / 2))
  const featRight = isBrand ? []           : pkg.features.slice(Math.ceil(pkg.features.length / 2))

  /* Sprint steps */
  const sprintSteps = pkg.sprint30 || pkg.plan30 || []

  /* Path A = brand-new business (stage_early tag present in answers).
     Operational warnings are meaningless when you have nothing yet. */
  const isPathA = result.pkgKey === 'micro_test' &&
    Array.isArray(result._answers) &&
    result._answers.some(a => a.tags?.includes('stage_early'))

  const isNewBiz = isPathA ||
    result.crossRuleApplied?.name === 'absolute_beginner'

  /* Problems — severity drives left-border weight */
  const problems = isNewBiz ? [] : [
    result.trackingWarning               && { key: 'tracking', label: 'Pixel + CAPI সেটআপ নেই → অ্যাড বাজেট লিক হচ্ছে',  severity: 'critical' },
    result.kpiWarning                    && { key: 'kpi',      label: 'ROAS ট্র্যাক হচ্ছে না → লাভ-লোকসান অস্পষ্ট',      severity: 'high'     },
    result.techGap                       && { key: 'tech',     label: 'Legacy Tech → সিজনাল ক্যাম্পেইনে দেরি হচ্ছে',     severity: 'high'     },
    result.landingPageWarning === 'none' && { key: 'lp-none',  label: 'ডেডিকেটেড ল্যান্ডিং পেজ নেই → কনভার্সন কম',    severity: 'medium'   },
    result.landingPageWarning === 'weak' && { key: 'lp-weak',  label: 'পেজ স্পিড দুর্বল → ভিজিটর হারিয়ে যাচ্ছে',      severity: 'medium'   },
  ].filter(Boolean)

  /* Hero warning chips */
  const warnings = isNewBiz ? [] : [
    result.trackingWarning               && { key: 'tracking', label: 'Pixel + CAPI নেই',       type: 'red'   },
    result.kpiWarning                    && { key: 'kpi',      label: 'ROAS ট্র্যাক হচ্ছে না',  type: 'amber' },
    result.techGap                       && { key: 'tech',     label: 'Legacy Tech দেখা গেছে',  type: 'amber' },
    result.landingPageWarning === 'none' && { key: 'lp-none',  label: 'ল্যান্ডিং পেজ নেই',     type: 'amber' },
    result.landingPageWarning === 'weak' && { key: 'lp-weak',  label: 'পেজ স্পিড দুর্বল',       type: 'amber' },
  ].filter(Boolean)

  /* Section counter */
  let sectionCount = 0
  const nextNum = () => String(++sectionCount).padStart(2, '0')

  return (
    <div id={id} className="fpl-root" aria-hidden="true">

      {/* ══════════════════════════════════════════════
          PAGE 1: Cover — Header + Identity + Hero + Problem
      ══════════════════════════════════════════════ */}
      <div className="fpl-a4-page fpl-a4-page--cover">

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

        {/* ══ IDENTITY BAND ══════════════════════════ */}
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
          <div className="fpl-score-panel">
            <div className="fpl-score-number">{score}</div>
            <div className="fpl-score-denom">/ 100</div>
            <div className="fpl-score-bar-track">
              <div className="fpl-score-bar-fill" style={{ width: `${score}%` }} />
            </div>
            <div className="fpl-score-label">{label}</div>
            <div className="fpl-score-sub">টেক হেলথ স্কোর</div>
          </div>

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

        {/* ══ 01 · THE PROBLEM ══════════════════════ */}
        {problems.length > 0 && (
          <div className="fpl-cards-area">
            <SectionCard
              variant="problem"
              header={
                <SectionHeader
                  num={nextNum()}
                  title="THE PROBLEM — অডিটে চিহ্নিত সমস্যা"
                  variant="problem"
                />
              }
            >
              <div className="fpl-problem-grid">
                {problems.map(p => (
                  <ProblemItem key={p.key} label={p.label} severity={p.severity} />
                ))}
              </div>
              <p className="fpl-problem-note">
                উপরের সমস্যাগুলো আপনার উত্তরের উপর ভিত্তি করে চিহ্নিত। এগুলো সমাধান না করলে অ্যাড বাজেট বাড়ালেও ফলাফল আসবে না।
              </p>
            </SectionCard>
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2: Diagnosis + Solution + Features
          (brand_care: Diagnosis + Solution only — features on pg 3)
      ══════════════════════════════════════════════ */}
      <div className="fpl-a4-page">
        <PageStrip pkgName={pkg.name} page="2" total={TOTAL_PG} />

        <div className="fpl-cards-area">

          {/* ══ DIAGNOSIS ═════════════════════════ */}
          <SectionCard
            header={<SectionHeader num={nextNum()} title="DIAGNOSIS — প্রফেশনাল অ্যানালাইসিস" />}
          >
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
          </SectionCard>

          {/* ══ SOLUTION ══════════════════════════ */}
          <SectionCard
            variant="solution"
            header={<SectionHeader num={nextNum()} title="SOLUTION — আমাদের পরামর্শ" />}
          >
            <div className="fpl-advice-box">
              <span className="fpl-advice-quote">{'"'}</span>
              <p className="fpl-advice-text">{result.diag.advice}</p>
            </div>
          </SectionCard>

          {/* ══ FEATURES — omitted for brand_care (moved to pg 3) ══ */}
          {!isBrand && (
            <SectionCard
              header={<SectionHeader num={nextNum()} title="WHAT YOU GET — এই প্ল্যানে যা পাচ্ছেন" />}
            >
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
            </SectionCard>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 3:
          brand_care  → Features + Sprint
          others      → Sprint + Table + Action + Footer
      ══════════════════════════════════════════════ */}
      <div className="fpl-a4-page">
        <PageStrip pkgName={pkg.name} page="3" total={TOTAL_PG} />

        <div className="fpl-cards-area" style={{ flex: 1 }}>

          {/* brand_care: Features card (all 8, single column) */}
          {isBrand && (
            <SectionCard
              header={<SectionHeader num={nextNum()} title="WHAT YOU GET — এই প্ল্যানে যা পাচ্ছেন" />}
            >
              <div className="fpl-feat-grid fpl-feat-grid--single">
                <ul className="fpl-feat-col">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="fpl-feat-item">
                      <span className="fpl-feat-tick">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionCard>
          )}

          {/* Sprint */}
          <SectionCard
            header={<SectionHeader num={nextNum()} title="30-DAY SPRINT — ৩০-দিনের লঞ্চ স্প্রিন্ট" />}
          >
            <ol className="fpl-roadmap">
              {sprintSteps.map((step, i) => (
                <li key={i} className="fpl-roadmap-item">
                  <div className="fpl-roadmap-num">0{i + 1}</div>
                  <div className="fpl-roadmap-connector" aria-hidden="true" />
                  <p className="fpl-roadmap-text">{step}</p>
                </li>
              ))}
            </ol>
          </SectionCard>

          {/* Table — only on page 3 for non-brand packages */}
          {!isBrand && (
            <SectionCard
              variant="table"
              header={<SectionHeader num={nextNum()} title="TECH COMPARISON — Vite + React vs Legacy" />}
            >
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
            </SectionCard>
          )}

        </div>

        {/* Action Strip + Footer only on last page when non-brand */}
        {!isBrand && (
          <>
            <div className="fpl-action-strip">
              <div className="fpl-action-label">NEXT STEP</div>
              <div className="fpl-action-body">
                <div className="fpl-action-left">
                  <div className="fpl-action-headline">এখনই কথা বলুন — পরামর্শ ফ্রি।</div>
                  <div className="fpl-action-sub">কোনো চুক্তি নেই · কোনো বাধ্যবাধকতা নেই · শুধু ফলাফল</div>
                </div>
                <div className="fpl-action-contact">
                  <div className="fpl-action-wa-label">WhatsApp</div>
                  <div className="fpl-action-wa-num">+{WA_NUMBER}</div>
                </div>
              </div>
            </div>
            <PageFooter />
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 4 (brand_care only):
          Tech Comparison + Action Strip + Footer
      ══════════════════════════════════════════════ */}
      {isBrand && (
        <div className="fpl-a4-page">
          <PageStrip pkgName={pkg.name} page="4" total={TOTAL_PG} />

          <div className="fpl-cards-area" style={{ flex: 1 }}>
            <SectionCard
              variant="table"
              header={<SectionHeader num={nextNum()} title="TECH COMPARISON — Vite + React vs Legacy" />}
            >
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
                    ['AEO / GEO Ready',  'হ্যাঁ, নেটিভ',   'প্লাগইন / না'],
                  ].map(([metric, good, bad], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'fpl-tr-alt' : ''}>
                      <td className="fpl-td-metric">{metric}</td>
                      <td className="fpl-td-good">{good}</td>
                      <td className="fpl-td-bad">{bad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </SectionCard>
          </div>

          <div className="fpl-action-strip">
            <div className="fpl-action-label">NEXT STEP</div>
            <div className="fpl-action-body">
              <div className="fpl-action-left">
                <div className="fpl-action-headline">এখনই কথা বলুন — পরামর্শ ফ্রি।</div>
                <div className="fpl-action-sub">কোনো চুক্তি নেই · কোনো বাধ্যবাধকতা নেই · শুধু ফলাফল</div>
              </div>
              <div className="fpl-action-contact">
                <div className="fpl-action-wa-label">WhatsApp</div>
                <div className="fpl-action-wa-num">+{WA_NUMBER}</div>
              </div>
            </div>
          </div>
          <PageFooter />
        </div>
      )}

    </div>
  )
}
