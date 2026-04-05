import { useState, useEffect, useRef, useCallback } from 'react'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import { CS_CTA } from '../lib/caseStudyData.js'
import './SocialProof.css'

/* ══════════════════════════════════════════════════
   ICONS — zero-dep inline SVG
══════════════════════════════════════════════════ */
const Icon = {
  github: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  globe: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  wa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  check: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

/* ── Services offered ── */
const SERVICES = [
  { label: 'সুপার-ফাস্ট ল্যান্ডিং পেজ', sub: 'Vite + React · sub-1s load' },
  { label: '১০০% CAPI ট্র্যাকিং',        sub: 'Server-side · zero data loss' },
  { label: 'হাইপার-লোকাল ক্যাম্পেইন',   sub: 'Dhaka precision targeting' },
  { label: 'AI মেসেজ অটোমেশন',           sub: '2s response · 24/7 active' },
]

/* ── Credentials ── */
const CREDS = [
  { cls: 'sp-cred--ai',   label: 'AI & Automation',  sub: 'NINA · Korea' },
  { cls: 'sp-cred--mktg', label: 'Marketing Expert',  sub: 'AMA · Philippines' },
  { cls: 'sp-cred--dev',  label: 'Full Stack Dev',    sub: 'BUET & IAC' },
  { cls: 'sp-cred--web',  label: 'Web Mastery',       sub: 'Univ. Helsinki' },
]

/* ── ROI proof for light CTA band ── */
const ROI = [
  { val: '৩০০', unit: '%', label: 'বিক্রি বাড়ে' },
  { val: '৫০',  unit: '%', label: 'বাজেট সাশ্রয়' },
  { val: '৪.৮', unit: '×', label: 'ROAS' },
]

/* ══════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════ */
export default function SocialProof() {
  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        setEntered(true)
        track('ViewContent', { content_name: 'About Section', content_category: 'Section' }, 'social_proof')
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'section_view', section: 'about' })
      }
    }, { threshold: 0.1 })
    io.observe(el)

    const push = () => pushEngagement('social_proof', enterTimeRef, {})
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', push)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', push)
    }
  }, [])

  const handleCta = useCallback(() => {
    const event_id = `sp_cta_${Date.now()}`
    window.fbq?.('track', 'Lead', { content_name: 'About CTA', currency: 'BDT', value: 0 }, { eventID: event_id })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'cta_click', cta_location: 'about', cta_label: 'free_roadmap', meta_event_id: event_id })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(CS_CTA.waText)}`, '_blank', 'noreferrer')
  }, [])

  const handleFounderLink = useCallback((label) => {
    track('ViewContent', { content_name: `Founder: ${label}`, content_category: 'Founder' }, 'social_proof')
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'founder_link_click', link_label: label })
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`sp${entered ? ' sp--entered' : ''}`}
      aria-label="আমাদের সম্পর্কে"
    >
      <div className="container">

        {/* ── Header ── */}
        <div className="row-header sp-r sp-r--1">
          <span className="section-num">০০১</span>
          <span className="section-title-right">আমরা কে এবং কী করি</span>
        </div>

        {/* ══ INTRO ══ */}
        <div className="sp-intro sp-r sp-r--2">
          <div className="sp-badge">
            <span className="sp-badge-pulse" aria-hidden="true" />
            বাংলাদেশের পারফরম্যান্স মার্কেটিং এজেন্সি
          </div>

          <h2 className="sp-heading">
            আমরা শুধু অ্যাড চালাই না,
            <br />
            <span className="sp-heading-em">একটি কমপ্লিট সেলস মেশিন</span>{' '}
            তৈরি করি।
          </h2>

          <p className="sp-desc">
            <strong>Digitalizen</strong>-এর পার্থক্য হলো — সুপার-ফাস্ট{' '}
            <strong>ল্যান্ডিং পেজ</strong>, ১০০% নিখুঁত <strong>CAPI ডাটা</strong>,
            হাইপার-লোকাল <strong>ক্যাম্পেইন</strong>, আর <strong>AI অটোমেশন</strong>{' '}
            যা রাত ২টায়ও বিক্রি করে। এই চারটি একসাথে।
          </p>

          {/* Service pills */}
          <ul className="sp-services" aria-label="আমাদের সার্ভিস">
            {SERVICES.map((s, i) => (
              <li key={i} className="sp-service">
                <span className="sp-service-tick" aria-hidden="true">{Icon.check}</span>
                <span className="sp-service-label">{s.label}</span>
                <span className="sp-service-sub">{s.sub}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ══ FOUNDER CARD — horizontal split ══ */}
        <div className="sp-founder-card sp-r sp-r--3" aria-label="ফাউন্ডার">

          {/* Portrait column */}
          <div className="sp-portrait-col">
            <div className="sp-portrait-frame">
              <img
                src="https://avatars.githubusercontent.com/u/112099343?s=294&v=4"
                alt="Masum Billah — Digitalizen Founder"
                width="120" height="120"
                loading="lazy" decoding="async"
              />
              {/* Glass shine — decorative */}
              <div className="sp-portrait-shine" aria-hidden="true" />
            </div>
            <div className="sp-avail" aria-label="প্রজেক্ট গ্রহণ করছি">
              <span className="sp-avail-dot" aria-hidden="true" />
              <span>২টি প্রজেক্ট নিচ্ছি</span>
            </div>
          </div>

          {/* Info column */}
          <div className="sp-founder-info">
            <span className="sp-founder-tag">ফাউন্ডার ও রেইনমেকার</span>
            <h3 className="sp-founder-name">Masum Billah</h3>
            <p className="sp-founder-bio">
              ৯+ বছরের অভিজ্ঞতা। ০% ফেক প্রমিস। React ল্যান্ডিং পেজ,
              CAPI ট্র্যাকিং, AI অটোমেশন — আপনার সত্যিকারের গ্রোথের জন্য।
            </p>

            {/* Glassmorphism credential badges */}
            <div className="sp-creds" aria-label="সার্টিফিকেশন">
              {CREDS.map(c => (
                <span key={c.label} className={`sp-cred ${c.cls}`} title={c.sub}>
                  <strong className="sp-cred-label">{c.label}</strong>
                  <span className="sp-cred-sub">{c.sub}</span>
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="sp-founder-links">
              <a
                href="https://github.com/billahdotdev"
                target="_blank" rel="noopener noreferrer"
                className="sp-founder-link"
                aria-label="GitHub প্রোফাইল"
                onClick={() => handleFounderLink('GitHub')}
              >
                {Icon.github} billahdotdev
              </a>
              <a
                href="https://billah.dev"
                target="_blank" rel="noopener noreferrer"
                className="sp-founder-link"
                aria-label="ব্যক্তিগত ওয়েবসাইট"
                onClick={() => handleFounderLink('billah.dev')}
              >
                {Icon.globe} billah.dev
              </a>
            </div>
          </div>
        </div>

        {/* ══ LIGHT CTA BAND ══
            Deliberately NOT dark. Warm white + blue-bordered
            numbers. Visually opposite to Process dark panel.
        ══ */}
        <div className="sp-cta-band sp-r sp-r--4" aria-label="ফ্রি রোডম্যাপ">

          {/* Decorative accent corners */}
          <div className="sp-band-corner sp-band-corner--tl" aria-hidden="true" />
          <div className="sp-band-corner sp-band-corner--br" aria-hidden="true" />

          {/* Big outlined ROI numbers — the visual hook */}
          <div className="sp-roi-row" aria-label="প্রমাণিত ফলাফল">
            {ROI.map((r, i) => (
              <div key={i} className="sp-roi">
                <span className="sp-roi-val" aria-label={`${r.val}${r.unit} ${r.label}`}>
                  {r.val}<span className="sp-roi-unit" aria-hidden="true">{r.unit}</span>
                </span>
                <span className="sp-roi-label" aria-hidden="true">{r.label}</span>
              </div>
            ))}
          </div>

          <hr className="sp-band-hr" aria-hidden="true" />

          <h2 className="sp-cta-q">{CS_CTA.question}</h2>
          <p className="sp-cta-body">{CS_CTA.body}</p>

          <button
            type="button"
            className="sp-cta-btn"
            onClick={handleCta}
            aria-label={`WhatsApp-এ যোগাযোগ করুন — ${CS_CTA.btnLabel}`}
          >
            {Icon.wa}
            <span>{CS_CTA.btnLabel}</span>
            {Icon.arrow}
          </button>

          <p className="sp-cta-trust">
            সম্পূর্ণ বিনামূল্যে · কোনো কমিটমেন্ট নেই · ২৪ ঘণ্টার মধ্যে রেসপন্স
          </p>
        </div>

      </div>
    </section>
  )
}
