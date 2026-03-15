import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './FreeResources.css'
import { track, pushEngagement } from '../lib/analytics.js'

/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.
══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   EBOOK CONFIG
   ─────────────────────────────────────────────────────────────*/
const EBOOK_FILENAME       = 'onlineMonline.pdf'
const EBOOK_PATH           = '/ebook/' + EBOOK_FILENAME
const EBOOK_FORM_ACTION    = 'https://docs.google.com/forms/d/e/1FAIpQLSc4az9GfiP2YaonvtjY_ACnkNes7XxnMuPih2520KbT4JC87A/formResponse'
const EBOOK_ENTRY_NAME     = 'entry.1987000516'
const EBOOK_ENTRY_WHATSAPP = 'entry.1290851570'

/* ─────────────────────────────────────────────────────────────
   NEWSLETTER CONFIG
   ─────────────────────────────────────────────────────────────*/
const EMAIL_FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLScJH2QNcyqI1Lw1NFM5NqCNPWj4hGi9KMsOU1gnJ4X_ijvieA/formResponse'
const EMAIL_ENTRY_EMAIL = 'entry.105565819'

/* ─────────────────────────────────────────────────────────────
   SESSION STORAGE HELPERS
   ─────────────────────────────────────────────────────────────*/
const TOKEN_KEY = 'dz_ebook_v1'
const NL_KEY    = 'dz_nl_v1'

function ssSet(key, value) {
  try { sessionStorage.setItem(key, value) } catch { /* storage unavailable */ }
}
function ssGet(key) {
  try { return sessionStorage.getItem(key) } catch { return null }
}

/* ─────────────────────────────────────────────────────────────
   SILENT GOOGLE FORM SUBMISSION
   ─────────────────────────────────────────────────────────────*/
function submitToGoogleForm(action, fields) {
  const formData = new FormData()
  Object.entries(fields).forEach(([name, value]) => {
    formData.append(name, value)
  })
  return fetch(action, {
    method: 'POST',
    mode: 'no-cors',
    body: formData,
  })
}

/* ─────────────────────────────────────────────────────────────
   TRIGGER DOWNLOAD
   ─────────────────────────────────────────────────────────────*/
function triggerDownload() {
  if (ssGet(TOKEN_KEY) !== '1') return

  // Fire ViewContent for the actual file download action
  track('ViewContent', {
    content_name:     'Ebook Downloaded',
    content_category: 'Download',
    content_ids:      ['ebook_meta_ads_playbook_2025'],
    value:            0,
    currency:         'BDT',
  })

  const a = document.createElement('a')
  if (typeof a.download !== 'undefined') {
    a.href          = EBOOK_PATH
    a.download      = EBOOK_FILENAME
    a.style.cssText = 'display:none;'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { try { document.body.removeChild(a) } catch { /* already removed */ } }, 100)
  } else {
    window.open(EBOOK_PATH, '_blank', 'noopener,noreferrer')
  }
}

/* ═══════════════════════════════════════════════════════════════
   EBOOK MODAL
═══════════════════════════════════════════════════════════════ */
function EbookModal({ modal, onClose, onSuccess, submittedName }) {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const nameRef    = useRef(null)
  const overlayRef = useRef(null)

  // Track time-on-form for CAPI quality signal
  const formOpenTimeRef = useRef(null)

  useEffect(() => {
    if (modal === 'form') {
      formOpenTimeRef.current = Date.now()
      document.body.style.overflow = 'hidden'
      setTimeout(() => nameRef.current?.focus(), 60)
      // ViewContent when form modal opens — user saw the lead form
      track('ViewContent', {
        content_name:     'Ebook Lead Form Opened',
        content_category: 'Modal',
        content_ids:      ['ebook_lead_form'],
      })
    } else if (modal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modal])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const isPhone = v => /^[0-9+\-\s]{7,15}$/.test(v.trim())

  const validate = () => {
    const e = {}
    if (!name.trim())    e.name  = 'নাম লিখুন'
    if (!isPhone(phone)) e.phone = 'সঠিক নম্বর লিখুন'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)

    const timeOnForm = formOpenTimeRef.current
      ? Math.round((Date.now() - formOpenTimeRef.current) / 1000)
      : 0

    // CompleteRegistration — primary CAPI lead event for ebook
    track('CompleteRegistration', {
      content_name:         'Ebook Lead Form Submitted',
      content_category:     'Lead',
      content_ids:          ['ebook_meta_ads_playbook_2025'],
      currency:             'BDT',
      value:                0,
      time_on_form_seconds: timeOnForm,
    })

    try {
      await submitToGoogleForm(EBOOK_FORM_ACTION, {
        [EBOOK_ENTRY_NAME]:      name.trim(),
        [EBOOK_ENTRY_WHATSAPP]:  phone.trim(),
      })
    } catch { /* form submission failed silently */ }
    ssSet(TOKEN_KEY, '1')
    setLoading(false)
    onSuccess(name.trim())
  }

  if (!modal) return null

  return (
    <div
      className="eb-overlay"
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label={modal === 'form' ? 'ইবুক ডাউনলোড ফর্ম' : 'ডাউনলোড প্রস্তুত'}
    >
      <div className={`eb-modal eb-modal--${modal}`}>
        <button className="eb-modal-close" onClick={onClose} aria-label="বন্ধ করুন">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {modal === 'form' && (
          <>
            <div className="eb-modal-icon">📘</div>
            <h3 className="eb-modal-title">ফ্রি ইবুক পেতে তথ্য দিন</h3>
            <p className="eb-modal-sub">মাত্র ২টি তথ্য দিন — তারপর ডাউনলোড বাটন পাবেন।</p>

            <div className="eb-field">
              <label className="eb-label" htmlFor="eb-name">আপনার নাম <span aria-hidden="true">*</span></label>
              <input
                ref={nameRef}
                id="eb-name"
                type="text"
                className={'eb-input' + (errors.name ? ' eb-input--err' : '')}
                placeholder="যেমন: মাসুম বিল্লাহ"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
                autoComplete="name"
                disabled={loading}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className="eb-err" role="alert">{errors.name}</span>}
            </div>

            <div className="eb-field">
              <label className="eb-label" htmlFor="eb-phone">WhatsApp নম্বর <span aria-hidden="true">*</span></label>
              <input
                id="eb-phone"
                type="tel"
                className={'eb-input' + (errors.phone ? ' eb-input--err' : '')}
                placeholder="+880 1XXXXXXXXX"
                value={phone}
                onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
                onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
                autoComplete="tel"
                disabled={loading}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <span className="eb-err" role="alert">{errors.phone}</span>}
            </div>

            <button
              className={'eb-submit-btn' + (loading ? ' eb-submit-btn--loading' : '')}
              onClick={handleSubmit}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="eb-spinner" aria-label="প্রক্রিয়া চলছে...">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                    <path d="M12 2v14m0 0l-4-4m4 4l4-4M3 18h18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  ফ্রি ইবুক: অনলাইন বিজনেস ব্লুপ্রিন্ট
                </>
              )}
            </button>

            <p className="eb-fine">🔒 আমরা স্প্যাম করি না। আপনার তথ্য সুরক্ষিত।</p>
          </>
        )}

        {modal === 'thanks' && (
          <div className="eb-thanks" aria-live="polite">
            <div className="eb-thanks-burst" aria-hidden="true">🎉</div>
            <h3 className="eb-thanks-title">
              {submittedName ? `ধন্যবাদ, ${submittedName.split(' ')[0]}!` : 'ধন্যবাদ!'}
            </h3>
            <p className="eb-thanks-sub">আপনার ইবুক প্রস্তুত। নিচের বাটনে ক্লিক করুন।</p>

            <div className="eb-thanks-highlights">
              {['১৬০ পেজের বাংলা গাইড', 'রিয়েল ক্যাম্পেইন টেমপ্লেট', 'বাজেট বরাদ্দ কৌশল'].map(item => (
                <div className="eb-highlight-pill" key={item}>
                  <span className="eb-highlight-tick">✓</span> {item}
                </div>
              ))}
            </div>

            <button className="eb-download-btn" onClick={triggerDownload}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                <path d="M12 2v14m0 0l-4-4m4 4l4-4M3 18h18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              PDF ডাউনলোড শুরু করুন
            </button>

            <p className="eb-fine" style={{marginTop: 12}}>
              ডাউনলোড না হলে ব্রাউজার পপ-আপ ব্লকার বন্ধ করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EBOOK SECTION
═══════════════════════════════════════════════════════════════ */
function EbookSection() {
  const [unlocked,      setUnlocked]   = useState(() => ssGet(TOKEN_KEY) === '1')
  const [modal,         setModal]      = useState(null)
  const [submittedName, setSubmitted]  = useState('')

  const sectionRef   = useRef(null)
  const firedRef     = useRef(false)
  const enterTimeRef = useRef(null)

  // Section ViewContent + time-on-section
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current   = true
          enterTimeRef.current = Date.now()
          track('ViewContent', {
            content_name:     'Ebook Section',
            content_category: 'Section',
            content_ids:      ['ebook_meta_ads_playbook_2025'],
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('ebook', enterTimeRef)

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  const handleClose = useCallback(() => setModal(null), [])

  const openModal = useCallback(() => {
    if (unlocked) {
      setModal('thanks')
    } else {
      // Lead — user clicked the CTA with intent to get the ebook
      track('Lead', {
        content_name:     'Ebook Download Intent',
        content_category: 'CTA',
        content_ids:      ['ebook_meta_ads_playbook_2025'],
        currency:         'BDT',
        value:            0,
      })
      setModal('form')
    }
  }, [unlocked])

  const handleSuccess = useCallback((name) => {
    setSubmitted(name)
    setUnlocked(true)
    setModal('thanks')
  }, [])

  return (
    <>
      <div className="res-ebook-wrap" ref={sectionRef}>
        <div className="res-book">
          <div className="res-book-deco res-book-deco--1" aria-hidden="true" />
          <div className="res-book-deco res-book-deco--2" aria-hidden="true" />

          <div className="res-book-inner">
            <div className="res-book-layout">
              <div className="res-cover" aria-hidden="true">
                <img
                  src="/ebook/cover.jpg"
                  alt=""
                  width={80}
                  height={110}
                  loading="eager"
                  style={{
                    display: 'block',
                    width: '80px',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '3px 6px 6px 3px',
                    filter: 'drop-shadow(4px 6px 16px rgba(0,0,0,0.35))',
                  }}
                />
              </div>

              <div className="res-book-content">
                <span className="res-badge">ফ্রি ইবুক</span>
                <h3 className="res-title">মেটা অ্যাডস প্লেবুক ২০২৫</h3>
                <p className="res-sub">১৬০ পেজের বাংলা গাইড — শূন্য থেকে স্কেল পর্যন্ত সব কিছু।</p>

                <ul className="res-features">
                  {[
                    'টেস্ট থেকে স্কেল — স্টেপ-বাই-স্টেপ',
                    'রিয়েল ক্যাম্পেইন টেমপ্লেট',
                    'বাজেট বরাদ্দ কৌশল',
                  ].map(f => (
                    <li key={f}><span className="feat-tick" aria-hidden="true">✓</span>{f}</li>
                  ))}
                </ul>

                <button className="btn-get-ebook" onClick={openModal}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>
                    <path d="M12 2v14m0 0l-4-4m4 4l4-4M3 18h18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {unlocked ? 'আবার ডাউনলোড করুন' : 'ফ্রি ইবুক পান'}
                </button>

                <p className="res-fine">🔒 সম্পূর্ণ বিনামূল্যে। কোনো শর্ত নেই।</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EbookModal
        modal={modal}
        onClose={handleClose}
        onSuccess={handleSuccess}
        submittedName={submittedName}
      />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WEEKLY NEWSLETTER SECTION
═══════════════════════════════════════════════════════════════ */
function WeeklyTipsSection() {
  const [email,      setEmail]      = useState('')
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [done,       setDone]       = useState(() => !!ssGet(NL_KEY))
  const [savedEmail, setSavedEmail] = useState(() => ssGet(NL_KEY) || '')
  const inputRef = useRef(null)

  const sectionRef      = useRef(null)
  const firedRef        = useRef(false)
  const enterTimeRef    = useRef(null)
  const formStartFired  = useRef(false)
  const formOpenTime    = useRef(null)

  // Section ViewContent + time-on-section
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current   = true
          enterTimeRef.current = Date.now()
          track('ViewContent', {
            content_name:     'Newsletter Section',
            content_category: 'Section',
            content_ids:      ['newsletter_marketing_lab'],
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('newsletter', enterTimeRef)

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  // Fire InitiateCheckout on first keystroke in the email field
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value)
    setError('')
    if (!formStartFired.current && e.target.value) {
      formStartFired.current = true
      formOpenTime.current   = Date.now()
      track('InitiateCheckout', {
        content_name:     'Newsletter Form Start',
        content_category: 'Form',
        content_ids:      ['newsletter_marketing_lab'],
        currency:         'BDT',
        value:            0,
      })
    }
  }, [])

  const handleSubscribe = async () => {
    if (!isEmail(email)) {
      setError('সঠিক ইমেইল ঠিকানা লিখুন')
      inputRef.current?.focus()
      return
    }
    setError('')
    setLoading(true)

    const timeOnForm = formOpenTime.current
      ? Math.round((Date.now() - formOpenTime.current) / 1000)
      : 0

    // Lead — user clicked subscribe
    track('Lead', {
      content_name:         'Newsletter Subscribe Intent',
      content_category:     'Lead',
      content_ids:          ['newsletter_marketing_lab'],
      currency:             'BDT',
      value:                0,
      time_on_form_seconds: timeOnForm,
    })

    try {
      await submitToGoogleForm(EMAIL_FORM_ACTION, { [EMAIL_ENTRY_EMAIL]: email.trim() })
    } catch { /* form submission failed silently */ }

    // CompleteRegistration — confirmed subscription
    track('CompleteRegistration', {
      content_name:     'Newsletter Subscribed',
      content_category: 'Lead Complete',
      content_ids:      ['newsletter_marketing_lab'],
      currency:         'BDT',
      value:            0,
    })

    ssSet(NL_KEY, email.trim())
    setSavedEmail(email.trim())
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="weekly-card weekly-card--done" aria-live="assertive" role="status" ref={sectionRef}>
        <div className="weekly-ty-burst" aria-hidden="true">🎉</div>
        <h4 className="weekly-ty-title">সাবস্ক্রাইব সফল হয়েছে!</h4>
        {savedEmail && (
          <p className="weekly-ty-email">
            <span className="ty-email-addr">{savedEmail}</span>
          </p>
        )}
        <p className="weekly-ty-promise">আপনার ইনবক্সে যা আসছে:</p>
        <ul className="weekly-ty-list" aria-label="সাপ্তাহিক বিষয়বস্তু">
          <li><span aria-hidden="true">💡</span>মেটা অ্যাডস টিপস ও কৌশল</li>
          <li><span aria-hidden="true">📊</span>সাপ্তাহিক পারফরম্যান্স ইনসাইট</li>
          <li><span aria-hidden="true">🚀</span>উইনিং ক্যাম্পেইন কেস স্টাডি</li>
          <li><span aria-hidden="true">🎁</span>এক্সক্লুসিভ রিসোর্স ও টেমপ্লেট</li>
        </ul>
        <div className="weekly-ty-footer">
          <span aria-hidden="true">🔒</span>&nbsp;আমরা স্প্যাম করি না। ভালো না লাগলে যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন।
        </div>
      </div>
    )
  }

  return (
    <div className="weekly-card" ref={sectionRef}>
      <div className="weekly-header">
        <h3 className="weekly-title">📬মার্কেটিং ল্যাব</h3>
        <p className="weekly-sub">আপনার বিজনেসের গ্রোথ নিশ্চিত করতে সোশ্যাল মিডিয়া অ্যাড ইনসাইট ও কেস স্টাডি সরাসরি আপনার ইনবক্সে।</p>
      </div>
      <div className="weekly-form" role="form" aria-label="নিউজলেটার সাবস্ক্রাইব">
        <div className="email-row">
          <div className="email-field-wrap">
            <input
              ref={inputRef}
              id="nl-email"
              type="email"
              className={'nl-input' + (error ? ' nl-input--err' : '')}
              placeholder="আপনার ইমেইল লিখুন"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSubscribe()}
              aria-label="ইমেইল ঠিকানা"
              aria-invalid={!!error}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          <button
            className={'nl-btn' + (loading ? ' nl-btn--loading' : '')}
            onClick={handleSubscribe}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="nl-spinner" aria-label="সাবমিট হচ্ছে"><span /><span /><span /></span>
            ) : <>যোগ দিন <span aria-hidden="true">→</span></>}
          </button>
        </div>
        {error && <p className="nl-error" role="alert">{error}</p>}
        <p className="nl-fine">
          <span aria-hidden="true">🔒</span>&nbsp;স্প্যাম নেই। এক ক্লিকে আনসাবস্ক্রাইব।&nbsp;•&nbsp;শুধু মার্কেটিং টিপস অ্যান্ড ট্রিকস।
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE VIEW TRACKER — fires once on mount
═══════════════════════════════════════════════════════════════ */
function PageViewTracker() {
  useEffect(() => {
    track('ViewContent', {
      content_name:     'Free Resources Page',
      content_category: 'Page',
      content_ids:      ['free_resources_page'],
    })
  }, [])
  return null
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT — Standalone Landing Page
═══════════════════════════════════════════════════════════════ */
export default function FreeResources() {
  return (
    <>
      {/* Page-level ViewContent — fires once on mount */}
      <PageViewTracker />

      {/* ── Minimal top bar with back link ── */}
      <header className="fr-topbar">
        <div className="container">
          <Link to="/" className="fr-back-link" aria-label="মূল সাইটে ফিরুন">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            More About Digitalizen
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="fr-hero">
        <div className="container">
          <span className="fr-hero-badge">🎁 ১০০% ফ্রি</span>
          <h1 className="fr-hero-title">মেটা অ্যাডস প্লেবুক ২০২৫</h1>
          <p className="fr-hero-sub">
            ১৬০ পেজের বাংলা গাইড — Facebook ও Instagram Ads দিয়ে<br />
            কীভাবে আপনার বিজনেস স্কেল করবেন, সব কিছু এক জায়গায়।
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <main>
        <section id="resources" className="resources-section">
          <div className="container">
            <EbookSection />
            <WeeklyTipsSection />
          </div>
        </section>
      </main>

      {/* ── Minimal footer ── */}
      <footer className="fr-footer">
        <div className="container">
          <p>© 2026 <a href="https://digitalizen.billah.dev">Digitalizen</a> — Dhaka, Bangladesh</p>
        </div>
      </footer>
    </>
  )
}
