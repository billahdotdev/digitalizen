import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FreeResources.css'
import { track, pushEngagement } from '../lib/analytics.js'

/* ── Constants ───────────────────────────────────────── */
const EBOOK_FILENAME       = 'onlineMonline.pdf'
const EBOOK_PATH           = '/eBook/' + EBOOK_FILENAME
const EBOOK_COVER          = '/eBook/cover.png'
const EBOOK_FORM_ACTION    = 'https://docs.google.com/forms/d/e/1FAIpQLSc4az9GfiP2YaonvtjY_ACnkNes7XxnMuPih2520KbT4JC87A/formResponse'
const EBOOK_ENTRY_NAME     = 'entry.1987000516'
const EBOOK_ENTRY_WHATSAPP = 'entry.1290851570'
const TOKEN_KEY            = 'dz_ebook_2026_v1'
const AUDIT_URL            = 'https://digitaligen.billah.dev/audit'

/* BD mobile: 01[3-9] + 8 digits (GP, Robi, BL, Teletalk, Airtel) */
const BD_PHONE_RE = /^01[3-9]\d{8}$/

/* ── Local event-ID factory (keeps Meta Pixel + GTM CAPI in sync) ──
   analytics.js intentionally keeps makeEventId private — this thin
   duplicate is the correct pattern for per-call dedup IDs.           */
const makeEventId = (section = 'web', name = 'Event') =>
  `${section}_${name}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

/* ── Storage helpers ─────────────────────────────────── */
const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch { /* quota */ } }
const lsGet = k      => { try { return localStorage.getItem(k) } catch { return null } }

/* ── SHA-256 via Web Crypto (zero-dependency) ────────── */
const sha256 = async (str) => {
  if (!str || !window.crypto?.subtle) return ''
  const buf = await window.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(str.trim().toLowerCase())
  )
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/* ── Validators ──────────────────────────────────────── */
function validateName(v) {
  const words = v.trim().split(/\s+/)
  if (words.length < 2 || words.some(w => w.length < 2))
    return 'প্রথম নাম + শেষ নাম, প্লিজ'
  return null
}

function validatePhone(v) {
  if (!BD_PHONE_RE.test(v.replace(/\s|-/g, '')))
    return 'দয়া করে সঠিক নম্বর দিন'
  return null
}

/* ══════════════════════════════════════════════════════
   COMPONENT
   ====================================================== */
export default function FreeResources() {
  const [form,     setForm]     = useState({ name: '', phone: '' })
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [unlocked, setUnlocked] = useState(() => lsGet(TOKEN_KEY) === '1')

  /* Tracking refs — mutations don't need re-renders */
  const enterTimeRef    = useRef(Date.now())
  const hasInitiatedRef = useRef(false)
  const scrollDepthRef  = useRef(0)
  const auditSeenRef    = useRef(false)

  /* ── 1. ViewContent on mount ─────────────────────── */
  useEffect(() => {
    track('ViewContent', {
      content_name:     'Meta Ads Strategy 2026 Ebook',
      content_category: 'Free Resource',
      content_ids:      ['ebook_meta_2026'],
      currency:         'BDT',
      value:            0,
    }, 'vc')
  }, [])

  /* ── 2. Scroll depth milestones (25 / 50 / 75 / 100) */
  useEffect(() => {
    const MILESTONES = [25, 50, 75, 100]
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return
      const pct = Math.round((window.scrollY / total) * 100)
      MILESTONES.forEach(m => {
        if (pct >= m && scrollDepthRef.current < m) {
          scrollDepthRef.current = m
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event:        'scroll_depth',
            page_path:    '/free-resources',
            scroll_depth: m,
          })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── 3. Audit section impression (IntersectionObserver) */
  const auditRef = useCallback((node) => {
    if (!node) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !auditSeenRef.current) {
          auditSeenRef.current = true
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event:        'section_impression',
            section_name: 'audit_cta',
            page_path:    '/free-resources',
          })
        }
      },
      { threshold: 0.4 }
    )
    io.observe(node)
  }, [])

  /* ── 4. Section engagement + form abandonment on leave */
  useEffect(() => {
    const handleLeave = () => {
      pushEngagement('free_resources', enterTimeRef, {
        scroll_depth_pct: scrollDepthRef.current,
        form_unlocked:    unlocked,
      })
      if (!unlocked && (form.name || form.phone)) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event:          'form_abandon',
          form_name:      'ebook_lead',
          fields_touched: [form.name && 'name', form.phone && 'phone'].filter(Boolean),
        })
      }
    }
    window.addEventListener('beforeunload', handleLeave)
    const onHide = () => { if (document.visibilityState === 'hidden') handleLeave() }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      handleLeave()
      window.removeEventListener('beforeunload', handleLeave)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [unlocked, form.name, form.phone])

  /* ── Input handler ───────────────────────────────── */
  const handleInput = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  /* ── First-touch → InitiateCheckout (fires once) ─── */
  const handleFirstFocus = () => {
    if (hasInitiatedRef.current) return
    hasInitiatedRef.current = true
    track('InitiateCheckout', {
      content_name:     'Meta Ads Strategy 2026 Ebook',
      content_category: 'Free Resource',
      currency:         'BDT',
      value:            0,
    }, 'ic')
  }

  /* ── Submit ──────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const nameErr  = validateName(form.name)
    const phoneErr = validatePhone(form.phone)
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, phone: phoneErr })
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event:        'form_validation_error',
        form_name:    'ebook_lead',
        error_fields: [nameErr && 'name', phoneErr && 'phone'].filter(Boolean),
      })
      return
    }

    setLoading(true)

    /* ── Ghost Backend: Google Forms POST ── */
    try {
      const fd = new FormData()
      fd.append(EBOOK_ENTRY_NAME,     form.name.trim())
      fd.append(EBOOK_ENTRY_WHATSAPP, form.phone.replace(/\s|-/g, ''))
      await fetch(EBOOK_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd })
    } catch {
      /* no-cors always rejects — intentional. Data still lands in Sheet. */
    }

    /* ── Hash PII for advanced matching (GDPR/PDPA safe) ── */
    const nameParts = form.name.trim().split(/\s+/)
    const normPhone = form.phone.replace(/\s|-/g, '')

    const [hashedPhone, hashedFn, hashedLn] = await Promise.all([
      sha256(normPhone),
      sha256(nameParts[0]?.toLowerCase() ?? ''),
      sha256(nameParts.slice(1).join(' ').toLowerCase()),
    ])

    /* ── Meta Pixel: Lead with dedup eventID ── */
    const leadEventId = makeEventId('lead', 'Lead')
    window.fbq?.('track', 'Lead', {
      content_name:     'Meta Ads Strategy 2026 Ebook',
      content_category: 'Free Resource',
      currency:         'BDT',
      value:            0,
      event_source_url: window.location.href,
    }, { eventID: leadEventId })

    /* ── TikTok: identify with hashed phone + SubmitForm ── */
    window.ttq?.identify({ phone_number: hashedPhone })
    window.ttq?.track('SubmitForm', {
      content_name: 'Meta Ads Strategy 2026 Ebook',
      content_id:   'ebook_meta_2026',
      currency:     'BDT',
      value:        0,
    })

    /* ── GTM dataLayer → GA4 + server-side CAPI ── */
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event:                 'meta_lead',
      meta_event_name:       'Lead',
      meta_event_id:         leadEventId,
      meta_event_source_url: window.location.href,
      content_name:          'Meta Ads Strategy 2026 Ebook',
      currency:              'BDT',
      value:                 0,
      user_data: {
        ph: hashedPhone,
        fn: hashedFn,
        ln: hashedLn,
      },
    })

    /* ── Unlock + trigger download ── */
    lsSet(TOKEN_KEY, '1')
    setUnlocked(true)
    setLoading(false)

    const a = document.createElement('a')
    a.href     = EBOOK_PATH
    a.download = EBOOK_FILENAME
    a.click()
  }

  /* ── Audit CTA click ─────────────────────────────── */
  const handleAuditClick = () => {
    track('Contact', {
      content_name:     'Free Business Audit',
      content_category: 'Audit CTA',
    }, 'cta')
  }

  /* ══════════════════════════════════════════════════
     RENDER
     ====================================================== */
  return (
    <main className="fr-page">
      <div className="fr-grid-overlay" aria-hidden="true" />

      {/* ── Top Bar ── */}
      <header className="fr-topbar">
        <div className="container fr-topbar-inner">
          <Link to="/" className="fr-back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
            </svg>
            <span>BACK TO HOME</span>
          </Link>
          <span className="fr-topbar-badge">FREE RESOURCE</span>
        </div>
      </header>

      {/* ── Main Grid ── */}
      <div className="container fr-main-grid">

        {/* Left: Value Prop */}
        <section className="fr-hero-content" aria-label="Resource overview">
          <div className="fr-badge-2026">NEW ERA 2026</div>
          <div className="fr-tag">{"// EXCLUSIVE RESOURCE"}</div>

          <h1 className="fr-hero-text">
            মনলাইন vs অনলাইন:<br/>
            <span className="text-glow">বিজনেস ব্লুপ্রিন্ট ২০২৬</span>
          </h1>

          <p className="fr-hero-sub">
            ২০২৬ সালে এসে এই মনলাইন পদ্ধতিতে টিকে থাকা অসম্ভব।
            এই গাইডে আমি আপনাদের শেখাবো কীভাবে মনলাইন থেকে বেরিয়ে এসে একটি প্রফেশনাল অনলাইন ব্র্যান্ড গড়বেন।
          </p>

          <div className="fr-ebook-preview" role="img" aria-label="ইবুক প্রিভিউ — ১২০০+ ডাউনলোড">
            <div className="fr-ebook-mock">
              <img
                src={EBOOK_COVER}
                alt="মনলাইন vs অনলাইন বিজনেস ব্লুপ্রিন্ট ২০২৬ ইবুক কভার"
                className="fr-ebook-cover-img"
                width="80"
                height="110"
                loading="eager"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              <span className="fr-ebook-cover-fallback" aria-hidden="true">
                মনলাইন<br/>vs<br/>অনলাইন
              </span>
            </div>
            <div className="fr-ebook-stats">
              <span>১২০০+</span>
              সফলভাবে ডাউনলোড করা হয়েছে
            </div>
          </div>

          <div className="fr-trust-bar" aria-label="বিশ্বাসযোগ্যতার সূচক">
            <span>✓ Verified Strategy</span>
            <span aria-hidden="true">•</span>
            <span>✓ Bangla Language</span>
            <span aria-hidden="true">•</span>
            <span>✓ Zero BS</span>
          </div>
        </section>

        {/* Right: Lead Gen / Success */}
        <section className="fr-form-side" aria-label="Access form">
          <div className="fr-form-wrapper">
            {unlocked ? (
              /* ── Returning user ── */
              <div className="fr-success-box" role="status">
                <div className="fr-success-icon" aria-hidden="true">✓</div>
                <h2 className="fr-success-title">আপনার কপি রেডি!</h2>
                <p className="fr-success-sub">
                  আপনি আগেই এক্সেস নিয়েছেন। ডাউনলোড শুরু না হলে নিচের বাটনে চাপ দিন।
                </p>
                <a href={EBOOK_PATH} download className="fr-industrial-btn">
                  <span className="fr-btn-label">ডাউনলোড করুন</span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                </a>
              </div>
            ) : (
              /* ── First visit ── */
              <>
                <div className="fr-form-header">
                  <div className="fr-tag">{"// GET ACCESS"}</div>
                  <h2>এক্সেস নিন</h2>
                  <p>নাম এবং WhatsApp নাম্বার দিয়ে ইবুকটি বুঝে নিন</p>
                </div>

                <form onSubmit={handleSubmit} noValidate aria-label="ইবুক এক্সেস ফর্ম">

                  <div className={`fr-ghost-field${errors.name ? ' is-err' : ''}`}>
                    <span className="fr-num" aria-hidden="true">01</span>
                    <input
                      id="fr-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleInput}
                      onFocus={handleFirstFocus}
                      placeholder=" "
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'err-name' : 'name-hint'}
                    />
                    <label className="fr-floating-label" htmlFor="fr-name">
                      আপনার পূর্ণ নাম
                      <span className="fr-required" aria-label="required"> *</span>
                    </label>
                    <div className="fr-bar" aria-hidden="true" />
                    {!errors.name && (
                      <span id="name-hint" className="fr-hint">প্রথম নাম ও শেষ নাম</span>
                    )}
                    {errors.name && (
                      <span id="err-name" className="fr-err-msg" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={`fr-ghost-field${errors.phone ? ' is-err' : ''}`}>
                    <span className="fr-num" aria-hidden="true">02</span>
                    <input
                      id="fr-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={11}
                      value={form.phone}
                      onChange={handleInput}
                      onFocus={handleFirstFocus}
                      placeholder=" "
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'err-phone' : 'phone-hint'}
                    />
                    <label className="fr-floating-label" htmlFor="fr-phone">
                      WhatsApp নম্বর
                      <span className="fr-required" aria-label="required"> *</span>
                    </label>
                    <div className="fr-bar" aria-hidden="true" />
                    {!errors.phone && (
                      <span id="phone-hint" className="fr-hint">
                        GP · Robi · BL · Teletalk · Airtel — 11 digits
                      </span>
                    )}
                    {errors.phone && (
                      <span id="err-phone" className="fr-err-msg" role="alert">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="fr-industrial-btn"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    <span className="fr-btn-label">
                      {loading ? 'প্রসেসিং...' : 'গেট ফ্রি এক্সেস'}
                    </span>
                    {loading ? (
                      <span className="fr-btn-spinner" aria-hidden="true" />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    )}
                  </button>

                </form>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ── Audit CTA ── */}
      <section
        className="fr-audit-section"
        aria-label="ফ্রি বিজনেস অডিট"
        ref={auditRef}
      >
        <div className="container fr-audit-inner">
          <div className="fr-audit-tag">{"[ STRATEGIC GAP ANALYSIS ]"}</div>
          <h2 className="fr-audit-title">আপনার কি বড় লক্ষ্য আছে?</h2>
          <p className="fr-audit-sub">
            শুধুমাত্র ইবুক যথেষ্ট নয়। আপনার বিজনেসের জন্য স্পেসিফিক টেকনিক্যাল
            গ্যাপগুলো খুঁজে বের করুন আমাদের এক্সপার্ট অডিটের মাধ্যমে।
          </p>
          <a
            href={AUDIT_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="fr-audit-btn"
            onClick={handleAuditClick}
          >
            ফ্রি বিজনেস অডিট বুক করুন
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="3" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
