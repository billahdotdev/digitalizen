import { useState, useRef, useEffect, useCallback } from 'react'
import './Resources.css'
import { track, pushEngagement } from '../analytics.js'

/* ─────────────────────────────────────────────────────────────
   META PIXEL HELPER
   ─────────────────────────────────────────────────────────────*/
/* ─────────────────────────────────────────────────────────────
   EBOOK CONFIG
   ─────────────────────────────────────────────────────────────
   1. PDF   → /public/ebook/onlineMonline.pdf
   2. Cover → /public/ebook/cover.png
   3. EBOOK_FORM_ACTION    → your Google Form's /formResponse URL
   4. EBOOK_ENTRY_NAME     → entry.XXXXXXXXX  (Name field)
   5. EBOOK_ENTRY_WHATSAPP → entry.XXXXXXXXX  (WhatsApp field)
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
   — ebook token : TOKEN_KEY → '1'
   — newsletter  : NL_KEY   → the subscriber's email address
     (storing the email lets the thank-you screen display it
      even after a re-render or component remount)
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
   — Uses the anchor `download` attribute (works in all modern
     desktop browsers).
   — Falls back to window.open only when `download` is not
     supported (iOS Safari, very old browsers) — NOT on every
     click, which would open two tabs unnecessarily.
   ─────────────────────────────────────────────────────────────*/
function triggerDownload() {
  if (ssGet(TOKEN_KEY) !== '1') return
  track('Purchase', { content_name: 'Ebook Downloaded', value: 0, currency: 'BDT' })

  const a = document.createElement('a')
  if (typeof a.download !== 'undefined') {
    // Modern browsers: trigger a real file download
    a.href     = EBOOK_PATH
    a.download = EBOOK_FILENAME
    a.style.cssText = 'display:none;'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => { try { document.body.removeChild(a) } catch { /* already removed */ } }, 100)
  } else {
    // Fallback (iOS Safari etc.): open PDF in a new tab
    window.open(EBOOK_PATH, '_blank', 'noopener,noreferrer')
  }
}

/* ═══════════════════════════════════════════════════════════════
   EBOOK MODAL
   modal prop: 'form' | 'thanks' | null
═══════════════════════════════════════════════════════════════ */
function EbookModal({ modal, onClose, onSuccess, submittedName }) {
  const [name, setName]       = useState('')
  const [phone, setPhone]     = useState('')
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const nameRef    = useRef(null)
  const overlayRef = useRef(null)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden'
      if (modal === 'form') setTimeout(() => nameRef.current?.focus(), 60)
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [modal])

  // Close on Escape.
  // onClose is wrapped in useCallback in the parent so this effect
  // only re-subscribes when the handler identity genuinely changes.
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
    track('CompleteRegistration', { content_name: 'Ebook Lead Form Submitted' })
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
        {/* Close button */}
        <button className="eb-modal-close" onClick={onClose} aria-label="বন্ধ করুন">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ── FORM MODAL ── */}
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

        {/* ── THANKS MODAL ── */}
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
   EBOOK SECTION — Book cover card + CTA button
═══════════════════════════════════════════════════════════════ */
function EbookSection() {
  const [unlocked, setUnlocked]       = useState(() => ssGet(TOKEN_KEY) === '1')
  const [modal, setModal]             = useState(null)   // null | 'form' | 'thanks'
  const [submittedName, setSubmitted] = useState('')

  // Stable reference → EbookModal's Escape listener won't re-subscribe on every render
  const handleClose = useCallback(() => setModal(null), [])

  const openModal = () => {
    if (unlocked) {
      setModal('thanks')
    } else {
      track('Lead', { content_name: 'Ebook Download Intent' })
      setModal('form')
    }
  }

  const handleSuccess = (name) => {
    setSubmitted(name)
    setUnlocked(true)
    setModal('thanks')
  }

  return (
    <>
      <div className="res-ebook-wrap">
        <div className="res-book">
          <div className="res-book-deco res-book-deco--1" aria-hidden="true" />
          <div className="res-book-deco res-book-deco--2" aria-hidden="true" />

          <div className="res-book-inner">
            <div className="res-book-layout">
              {/* Real book cover image — shown on screens ≥ 480px via CSS */}
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

              {/* Content */}
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
  // done  → true if already subscribed this session
  // savedEmail → the address stored in sessionStorage (survives re-renders)
  const [done,       setDone]       = useState(() => !!ssGet(NL_KEY))
  const [savedEmail, setSavedEmail] = useState(() => ssGet(NL_KEY) || '')
  const inputRef = useRef(null)

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleSubscribe = async () => {
    if (!isEmail(email)) {
      setError('সঠিক ইমেইল ঠিকানা লিখুন')
      inputRef.current?.focus()
      return
    }
    setError('')
    setLoading(true)
    track('Lead', { content_name: 'Newsletter Subscribe' })
    try {
      await submitToGoogleForm(EMAIL_FORM_ACTION, { [EMAIL_ENTRY_EMAIL]: email.trim() })
    } catch { /* form submission failed silently */ }
    track('CompleteRegistration', { content_name: 'Newsletter Subscribed' })
    // Persist the email so the thank-you screen can display it after remounts
    ssSet(NL_KEY, email.trim())
    setSavedEmail(email.trim())
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="weekly-card weekly-card--done" aria-live="assertive" role="status">
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
          <span aria-hidden="true">🔒</span>&nbsp;আমরা স্প্যাম করি না। ভালো না লাগলে যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন।
        </div>
      </div>
    )
  }

  return (
    <div className="weekly-card">
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
              onChange={e => { setEmail(e.target.value); setError('') }}
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
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function Resources() {
  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        track('ViewContent', { content_name: 'Resources Section', content_category: 'Section' }, 'res')
        io.unobserve(el)
      }
    }, { threshold: 0.2 })
    io.observe(el)
    const push = () => pushEngagement('resources', enterTimeRef)
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('beforeunload', push) }
  }, [])

  return (
    <section id="resources" className="resources-section" ref={sectionRef}>
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৭</span>
          <span className="section-title-right">সম্পূর্ণ বিনামূল্যে। কোনো শর্ত নেই।</span>
        </div>
        <EbookSection />
        <WeeklyTipsSection />
      </div>
    </section>
  )
}
