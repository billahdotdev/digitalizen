import { useState, useEffect, useRef, useCallback } from 'react'
import './Contact.css'
import { track, pushEngagement, WA_NUMBER } from '../analytics.js'

/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.
══════════════════════════════════════════════════ */


/* ── Social channels (data-driven, easier to update) ── */
const CHANNELS = [
  {
    label:   'WhatsApp',
    value:   '+880 17119925588',
    note:    'সকাল ৯টা – রাত ১০টা',
    bg:      '#dcfce7',
    href:    `https://wa.me/${WA_NUMBER}`,
    trackLabel: 'WhatsApp Direct',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#16a34a" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label:   'Facebook',
    value:   '@digitalizen',
    note:    'পেজে মেসেজ করুন',
    bg:      '#eff6ff',
    href:    'https://facebook.com/digitalizen',
    trackLabel: 'Facebook Click',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1d4ed8" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label:   'Instagram',
    value:   '@digitalizen',
    note:    'ডিএম করুন',
    bg:      '#fdf4ff',
    href:    'https://instagram.com/digitalizen',
    trackLabel: 'Instagram Click',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#9333ea" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label:   'TikTok',
    value:   '@digitalizen',
    note:    'ভিডিও দেখুন',
    bg:      '#f0f0f0',
    href:    'https://tiktok.com/@digitalizen',
    trackLabel: 'TikTok Click',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#010101" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label:   'LinkedIn',
    value:   'Digitalizen',
    note:    'কানেক্ট করুন',
    bg:      '#e8f0fe',
    href:    'https://linkedin.com/company/digitalizen',
    trackLabel: 'LinkedIn Click',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a66c2" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Contact() {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [sent,    setSent]    = useState(false)
  const [errors,  setErrors]  = useState({})       // inline validation

  const sectionRef          = useRef(null)
  const enterTimeRef        = useRef(null)
  const sectionFiredRef     = useRef(false)
  const formStartFiredRef   = useRef(false)
  const fieldsFilled        = useRef(0)
  const socialClicksRef     = useRef(0)

  /* ── Section ViewContent + time-on-section ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sectionFiredRef.current) {
          sectionFiredRef.current = true
          enterTimeRef.current    = Date.now()
          track('ViewContent', {
            content_name:     'Contact Section',
            content_category: 'Section',
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('contact', enterTimeRef, { social_clicks: socialClicksRef.current })

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  /* ── Fire InitiateCheckout on first field touch ── */
  const onFormStart = useCallback(() => {
    if (formStartFiredRef.current) return
    formStartFiredRef.current = true
    track('InitiateCheckout', {
      content_name:     'Contact Form Start',
      content_category: 'Form',
      currency:         'BDT',
      value:            0,
    })
  }, [])

  /* ── Field handlers ── */
  const handleName = useCallback((e) => {
    if (!name && e.target.value) fieldsFilled.current += 1
    setName(e.target.value)
    if (errors.name) setErrors(ev => ({ ...ev, name: null }))
    onFormStart()
  }, [name, errors.name, onFormStart])

  const handlePhone = useCallback((e) => {
    if (!phone && e.target.value) fieldsFilled.current += 1
    setPhone(e.target.value)
    if (errors.phone) setErrors(ev => ({ ...ev, phone: null }))
    onFormStart()
  }, [phone, errors.phone, onFormStart])

  const handleMessage = useCallback((e) => {
    if (!message && e.target.value) fieldsFilled.current += 1
    setMessage(e.target.value)
    if (errors.message) setErrors(ev => ({ ...ev, message: null }))
    onFormStart()
  }, [message, errors.message, onFormStart])

  /* ── Inline validation ── */
  const validate = () => {
    const e = {}
    if (!name.trim())    e.name    = 'নাম দিন'
    if (!phone.trim())   e.phone   = 'ফোন নম্বর দিন'
    if (!message.trim()) e.message = 'মেসেজ লিখুন'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── Send ── */
  const handleSend = useCallback(() => {
    if (!validate()) return
    track('Contact', {
      content_name:        'Contact Form Submit',
      content_category:    'Form',
      form_fields_filled:  fieldsFilled.current,
    })
    // Also fire Lead — contact form submission is a qualified lead signal
    track('Lead', {
      content_name:     'Contact Form Lead',
      content_category: 'Form',
      currency:         'BDT',
      value:            0,
    })
    const msg = [
      `হ্যালো Digitalizen!`,
      name    ? `নাম: ${name}`       : null,
      phone   ? `মোবাইল: ${phone}`   : null,
      message ? `মেসেজ: ${message}`  : null,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setName(''); setPhone(''); setMessage('')
      formStartFiredRef.current = false
      fieldsFilled.current = 0
    }, 4000)
  }, [name, phone, message])

  /* ── Social link click ── */
  const handleSocialClick = useCallback((channel) => {
    socialClicksRef.current += 1
    track('Contact', {
      content_name:     `Contact: ${channel.trackLabel}`,
      content_category: 'Social Link',
      content_ids:      [`contact_${channel.label.toLowerCase()}`],
    })
  }, [])

  return (
    <section id="contact" className="contact-section" aria-label="যোগাযোগ" ref={sectionRef}>
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৯</span>
          <span className="section-title-right">যোগাযোগ</span>
        </div>

        <h2 className="contact-heading">আমাদের সাথে যোগাযোগ করুন</h2>
        <p className="contact-sub">প্রশ্ন আছে? আমরা আছি আপনার পাশে।</p>

        <div className="contact-grid">

          {/* ── Contact info ── */}
          <div className="contact-info">
            <div className="contact-info-card">
              {CHANNELS.map((ch, i) => (
                <div key={i} className="contact-method">
                  <div className="method-icon" style={{ background: ch.bg }}>
                    {ch.icon}
                  </div>
                  <div>
                    <p className="method-label">{ch.label}</p>
                    {ch.href ? (
                      <a
                        href={ch.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="method-value method-link"
                        onClick={() => handleSocialClick(ch)}
                      >
                        {ch.value}
                      </a>
                    ) : (
                      <p className="method-value">{ch.value}</p>
                    )}
                    <p className="method-note">{ch.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Response-time trust badge */}
            <div className="contact-trust">
              <span className="contact-trust__dot" aria-hidden="true" />
              গড়ে ১৫ মিনিটের মধ্যে রিপ্লাই
            </div>
          </div>

          {/* ── Quick form ── */}
          <div className="contact-form-card">
            <h3 className="form-card-title">দ্রুত মেসেজ পাঠান</h3>
            <div className="contact-form-fields">

              <div className="form-group">
                <label className="form-label" htmlFor="ct-name">নাম</label>
                <input
                  id="ct-name"
                  type="text"
                  className={`form-input${errors.name ? ' form-input--error' : ''}`}
                  placeholder="আপনার নাম"
                  value={name}
                  onChange={handleName}
                  autoComplete="name"
                  aria-describedby={errors.name ? 'ct-name-err' : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span id="ct-name-err" className="form-error" role="alert">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ct-phone">ফোন নম্বর</label>
                <input
                  id="ct-phone"
                  type="tel"
                  className={`form-input${errors.phone ? ' form-input--error' : ''}`}
                  placeholder="০১৭XXXXXXXX"
                  value={phone}
                  onChange={handlePhone}
                  autoComplete="tel"
                  aria-describedby={errors.phone ? 'ct-phone-err' : undefined}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && (
                  <span id="ct-phone-err" className="form-error" role="alert">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ct-message">মেসেজ</label>
                <textarea
                  id="ct-message"
                  className={`form-input form-textarea${errors.message ? ' form-input--error' : ''}`}
                  placeholder="আপনার প্রশ্ন বা মেসেজ লিখুন..."
                  value={message}
                  onChange={handleMessage}
                  rows={3}
                  aria-describedby={errors.message ? 'ct-msg-err' : undefined}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <span id="ct-msg-err" className="form-error" role="alert">{errors.message}</span>
                )}
              </div>

              <button
                className={`contact-send-btn${sent ? ' contact-send-btn--sent' : ''}`}
                onClick={handleSend}
                type="button"
                disabled={sent}
              >
                {sent ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    WhatsApp খুলছে...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp-এ মেসেজ পাঠান
                  </>
                )}
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
