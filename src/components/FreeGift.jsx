import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FreeGift.css'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import SEO from '../seo/SEO'

/* ══════════════════════════════════════════════════
   FreeGift — /free-gift route
   একটি exclusive gift/offer পেজ।
   Content, form action, ও gift details নিচে
   CONFIG section-এ update করুন।
══════════════════════════════════════════════════ */

/* ── CONFIG — এখানে সব কিছু change করুন ── */
const CONFIG = {
  gift: {
    title:    'ফ্রি ডিজিটাল মার্কেটিং গাইড',
    subtitle: 'বাংলাদেশের স্টার্টআপের জন্য',
    desc:     'Meta Ads, Google Ads ও SEO দিয়ে কীভাবে ৩x ROAS পাবেন, step-by-step গাইড। সম্পূর্ণ বিনামূল্যে।',
    badge:    '১০০% ফ্রি',
    items: [
      'Meta Ads শুরু করার সম্পূর্ণ চেকলিস্ট',
      'Google Ads বাজেট পরিকল্পনা টেমপ্লেট',
      'SEO কীওয়ার্ড রিসার্চ গাইড (বাংলা)',
      'Facebook Pixel ও CAPI সেটআপ গাইড',
    ],
  },
  form: {
    namePlaceholder:  'আপনার নাম',
    phonePlaceholder: '০১XXXXXXXXX',
    btnLabel:         'WhatsApp-এ গিফট পাঠান',
  },
}

/* ── Icons ── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const GiftIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
)

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function FreeGift() {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [errors,  setErrors]  = useState({})
  const [sent,    setSent]    = useState(false)
  const [entered, setEntered] = useState(false)

  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)

  /* ── Intersection observer → analytics + stagger ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        setEntered(true)
        track('ViewContent', {
          content_name:     'FreeGift Page',
          content_category: 'Gift',
        }, 'gift')
        io.unobserve(el)
      }
    }, { threshold: 0.1 })
    io.observe(el)

    const push    = () => pushEngagement('free_gift', enterTimeRef)
    const onVis   = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  /* ── Validation ── */
  const validate = useCallback(() => {
    const e = {}
    if (!name.trim())  e.name  = 'নাম দিন'
    if (!phone.trim()) e.phone = 'ফোন নম্বর দিন'
    else if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'সঠিক বাংলাদেশ নম্বর দিন'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [name, phone])

  /* ── Submit → WhatsApp ── */
  const handleSubmit = useCallback(() => {
    if (!validate()) return

    track('Lead', {
      content_name:     'FreeGift Claim',
      content_category: 'Gift',
      currency:         'BDT',
      value:            0,
    }, 'gift')

    const msg = [
      `হ্যালো Digitalizen,`,
      `ফ্রি গাইডটি পেতে চাই।`,
      `নাম: ${name}`,
      `ফোন: ${phone}`,
    ].join('\n')

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
  }, [name, phone, validate])

  return (
    <div
      className={`fg-page${entered ? ' fg-page--entered' : ''}`}
      ref={sectionRef}
    >
      <SEO page="free-gift" />
      {/* ── Nav back ── */}
      <div className="fg-topbar">
        <Link to="/" className="fg-back" aria-label="হোমপেজে ফিরুন">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          ফিরে যান
        </Link>
        <span className="fg-topbar-brand">digitalizen<span className="fg-dot" aria-hidden="true" /></span>
      </div>

      <div className="fg-container">

        {/* ── Badge ── */}
        <div className="fg-badge" aria-label={CONFIG.gift.badge}>
          <span className="fg-badge-dot" aria-hidden="true" />
          {CONFIG.gift.badge}
        </div>

        {/* ── Icon ── */}
        <div className="fg-icon-wrap" aria-hidden="true">
          <GiftIcon />
        </div>

        {/* ── Heading ── */}
        <h1 className="fg-title">{CONFIG.gift.title}</h1>
        <p className="fg-subtitle">{CONFIG.gift.subtitle}</p>
        <p className="fg-desc">{CONFIG.gift.desc}</p>

        {/* ── Gift items ── */}
        <ul className="fg-items" aria-label="গিফটে কী কী আছে">
          {CONFIG.gift.items.map((item, i) => (
            <li key={i} className="fg-item">
              <span className="fg-item-check" aria-hidden="true"><CheckIcon /></span>
              {item}
            </li>
          ))}
        </ul>

        {/* ── Form ── */}
        {!sent ? (
          <div className="fg-form" role="form" aria-label="ফ্রি গিফট ক্লেইম করুন">

            <div className="fg-field">
              <label className="fg-label" htmlFor="fg-name">নাম</label>
              <input
                id="fg-name"
                type="text"
                className={`fg-input${errors.name ? ' fg-input--error' : ''}`}
                placeholder={CONFIG.form.namePlaceholder}
                value={name}
                onChange={e => { setName(e.target.value); if (errors.name) setErrors(v => ({ ...v, name: null })) }}
                autoComplete="name"
                aria-describedby={errors.name ? 'fg-name-err' : undefined}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span id="fg-name-err" className="fg-error" role="alert">{errors.name}</span>}
            </div>

            <div className="fg-field">
              <label className="fg-label" htmlFor="fg-phone">WhatsApp নম্বর</label>
              <input
                id="fg-phone"
                type="tel"
                className={`fg-input${errors.phone ? ' fg-input--error' : ''}`}
                placeholder={CONFIG.form.phonePlaceholder}
                value={phone}
                onChange={e => { setPhone(e.target.value); if (errors.phone) setErrors(v => ({ ...v, phone: null })) }}
                autoComplete="tel"
                aria-describedby={errors.phone ? 'fg-phone-err' : undefined}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <span id="fg-phone-err" className="fg-error" role="alert">{errors.phone}</span>}
            </div>

            <button
              className="fg-btn"
              onClick={handleSubmit}
              type="button"
            >
              <WaIcon />
              {CONFIG.form.btnLabel}
            </button>

            <p className="fg-privacy">
              আপনার তথ্য সম্পূর্ণ নিরাপদ। কোনো spam নেই।
            </p>
          </div>
        ) : (
          <div className="fg-success" role="status" aria-live="polite">
            <div className="fg-success-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="fg-success-title">WhatsApp খুলছে...</h2>
            <p className="fg-success-desc">
              শীঘ্রই আপনার গাইড পাঠানো হবে।<br />
              সাধারণত ১৫ মিনিটের মধ্যে রিপ্লাই আসে।
            </p>
            <Link to="/" className="fg-home-link">← হোমপেজে ফিরুন</Link>
          </div>
        )}

      </div>
    </div>
  )
}
