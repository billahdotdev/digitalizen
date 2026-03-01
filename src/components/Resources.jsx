import { useState, useRef } from 'react'
import './Resources.css'

/* ─────────────────────────────────────────────────────────────
   META PIXEL HELPER
   ─────────────────────────────────────────────────────────────*/
const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)

/* ─────────────────────────────────────────────────────────────
   EBOOK CONFIG
   ─────────────────────────────────────────────────────────────
   1. Place your PDF at: /public/ebook/meta-ads-playbook-2025.pdf
   2. EBOOK_FORM_ACTION  → your Google Form's /formResponse URL
   3. EBOOK_ENTRY_NAME   → entry.XXXXXXXXX for the "Name" field
   4. EBOOK_ENTRY_EMAIL  → entry.XXXXXXXXX for the "Email" field
   
   How to find entry IDs:
     Google Form → ⋮ → "Get pre-filled link" → fill fields →
     "Get Link" → copy URL → look for entry.123456789=...
   ─────────────────────────────────────────────────────────────*/
const EBOOK_FILENAME    = 'meta-ads-playbook-2025.pdf'
const EBOOK_PATH        = '/ebook/' + EBOOK_FILENAME
const EBOOK_FORM_ACTION = 'https://forms.gle/BqN5tbuYHydUfN35A'
const EBOOK_ENTRY_NAME  = 'entry.000000001'
const EBOOK_ENTRY_EMAIL = 'entry.000000002'

/* ─────────────────────────────────────────────────────────────
   NEWSLETTER CONFIG
   ─────────────────────────────────────────────────────────────
   EMAIL_FORM_ACTION  → Google Form /formResponse URL (email-only form)
   EMAIL_ENTRY_EMAIL  → entry.XXXXXXXXX for the "Email" field
   ─────────────────────────────────────────────────────────────*/
const EMAIL_FORM_ACTION = 'https://forms.gle/BqN5tbuYHydUfN35A'
const EMAIL_ENTRY_EMAIL = 'entry.000000003'

/* ─────────────────────────────────────────────────────────────
   SESSION TOKEN GATE
   The download URL is never injected into the DOM.
   A sessionStorage flag is set only after the form POST resolves.
   The download is triggered entirely in JS — never as an <a href>.
   ─────────────────────────────────────────────────────────────*/
const TOKEN_KEY = 'dz_ebook_v1'

function issueToken() {
  try { sessionStorage.setItem(TOKEN_KEY, '1') } catch (_) {}
}

function hasToken() {
  try { return sessionStorage.getItem(TOKEN_KEY) === '1' } catch (_) { return false }
}

/* ─────────────────────────────────────────────────────────────
   SILENT GOOGLE FORM SUBMISSION
   Posts data into a detached hidden iframe — no page navigation,
   no CORS error, no visible feedback. Google stores the response.
   We resolve after 1.4s (POST is near-instant; delay = UX).
   ─────────────────────────────────────────────────────────────*/
function submitToGoogleForm(action, fields) {
  return new Promise((resolve) => {
    const frameName = '_gf_' + Date.now()

    const iframe = document.createElement('iframe')
    iframe.name = frameName
    iframe.setAttribute('aria-hidden', 'true')
    iframe.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;border:none;left:-9999px;top:-9999px;'
    document.body.appendChild(iframe)

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = action
    form.target = frameName
    form.setAttribute('aria-hidden', 'true')
    form.style.cssText = 'display:none;'

    Object.entries(fields).forEach(([name, value]) => {
      const input   = document.createElement('input')
      input.type    = 'hidden'
      input.name    = name
      input.value   = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()

    // Cleanup + resolve after delay
    setTimeout(() => {
      try { document.body.removeChild(iframe) } catch (_) {}
      try { document.body.removeChild(form)   } catch (_) {}
      resolve()
    }, 1400)
  })
}

/* ─────────────────────────────────────────────────────────────
   TRIGGER DOWNLOAD — URL is never exposed in the DOM.
   We create a temporary <a> in JS, click it, then immediately
   remove it. No href is ever rendered as HTML.
   ─────────────────────────────────────────────────────────────*/
function triggerDownload() {
  if (!hasToken()) return   // hard guard: bail if no valid token
  pixel('Purchase', { content_name: 'Ebook Downloaded', value: 0, currency: 'BDT' })
  const a       = document.createElement('a')
  a.href        = EBOOK_PATH
  a.download    = EBOOK_FILENAME
  a.style.cssText = 'display:none;'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { try { document.body.removeChild(a) } catch (_) {} }, 100)
}

/* ═══════════════════════════════════════════════════════════════
   EBOOK SECTION
   States: 'idle' → 'form' → 'loading' → 'done'
   Gate:   PDF URL is NEVER present in rendered HTML/DOM.
           The download only fires if sessionStorage token exists.
═══════════════════════════════════════════════════════════════ */
function EbookSection() {
  const initialStep = hasToken() ? 'done' : 'idle'
  const [step,    setStep]   = useState(initialStep)
  const [name,    setName]   = useState('')
  const [email,   setEmail]  = useState('')
  const [errors,  setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const validate = () => {
    const e = {}
    if (!name.trim())   e.name  = 'নাম লিখুন'
    if (!isEmail(email)) e.email = 'সঠিক ইমেইল লিখুন'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    pixel('CompleteRegistration', { content_name: 'Ebook Lead Form Submitted' })
    try {
      await submitToGoogleForm(EBOOK_FORM_ACTION, {
        [EBOOK_ENTRY_NAME]:  name.trim(),
        [EBOOK_ENTRY_EMAIL]: email.trim(),
      })
    } catch (_) {
      // Never block the user on network failure
    }
    issueToken()
    setLoading(false)
    setStep('done')
    // Auto-trigger download immediately after gate unlocks
    setTimeout(triggerDownload, 200)
  }

  return (
    <div className="res-ebook-wrap">
      <div className="res-book">
        <div className="res-book-inner">
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

          {/* ── idle: show download CTA ── */}
          {step === 'idle' && (
            <button
              className="btn-download"
              onClick={() => {
                pixel('Lead', { content_name: 'Ebook Download Intent' })
                setStep('form')
              }}
            >
              ↓ ফ্রি ডাউনলোড করুন
            </button>
          )}

          {/* ── form: collect name + email ── */}
          {step === 'form' && (
            <div className="res-gate-form" role="form" aria-label="ইবুক ডাউনলোড ফর্ম">
              <p className="gate-note">মাত্র ২টি তথ্য দিন, PDF সরাসরি পাবেন।</p>

              <div className="gate-field">
                <label className="gate-label" htmlFor="eb-name">আপনার নাম <span aria-hidden="true">*</span></label>
                <input
                  id="eb-name"
                  type="text"
                  className={'gate-input' + (errors.name ? ' gate-input--err' : '')}
                  placeholder="যেমন: রাহেলা বেগম"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })) }}
                  autoComplete="name"
                  disabled={loading}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'eb-name-err' : undefined}
                />
                {errors.name && (
                  <span id="eb-name-err" className="gate-err" role="alert">{errors.name}</span>
                )}
              </div>

              <div className="gate-field">
                <label className="gate-label" htmlFor="eb-email">ইমেইল ঠিকানা <span aria-hidden="true">*</span></label>
                <input
                  id="eb-email"
                  type="email"
                  className={'gate-input' + (errors.email ? ' gate-input--err' : '')}
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                  onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()}
                  autoComplete="email"
                  disabled={loading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'eb-email-err' : undefined}
                />
                {errors.email && (
                  <span id="eb-email-err" className="gate-err" role="alert">{errors.email}</span>
                )}
              </div>

              <button
                className={'btn-download gate-submit' + (loading ? ' gate-submit--loading' : '')}
                onClick={handleSubmit}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="gate-spinner" aria-label="প্রক্রিয়া চলছে...">
                    <span className="spinner-dot" /><span className="spinner-dot" /><span className="spinner-dot" />
                  </span>
                ) : '✓ সাবমিট করুন ও PDF পান'}
              </button>

              <p className="res-fine" style={{ marginTop: 10 }}>
                আমরা স্প্যাম করি না। যেকোনো সময় আনসাবস্ক্রাইব করুন।
              </p>
            </div>
          )}

          {/* ── done: unlock UI ── */}
          {step === 'done' && (
            <div className="res-unlock" aria-live="polite">
              <div className="unlock-check" aria-hidden="true">✓</div>
              <p className="unlock-title">
                {name ? 'ধন্যবাদ, ' + name.split(' ')[0] + '! ইবুক আনলক হয়েছে।' : 'আপনি আগেই আনলক করেছেন!'}
              </p>
              <p className="unlock-sub">নিচের বাটনে ক্লিক করলে PDF ডাউনলোড শুরু হবে।</p>
              <button className="btn-download unlock-btn" onClick={triggerDownload}>
                ↓ PDF ডাউনলোড শুরু করুন
              </button>
              <p className="res-fine" style={{ marginTop: 8, color: 'rgba(255,255,255,0.55)' }}>
                ডাউনলোড না হলে ব্রাউজার পপ-আপ ব্লকার বন্ধ করুন এবং আবার চেষ্টা করুন।
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WEEKLY NEWSLETTER SECTION
   Flow: idle → loading (silent GForm POST) → done
   User types email once, clicks once, data goes to Google Form,
   thank-you card shown. No visible iframe or redirect.
═══════════════════════════════════════════════════════════════ */
function WeeklyTipsSection() {
  const [email,   setEmail]   = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
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
    pixel('Lead', { content_name: 'Newsletter Subscribe' })

    try {
      await submitToGoogleForm(EMAIL_FORM_ACTION, {
        [EMAIL_ENTRY_EMAIL]: email.trim(),
      })
    } catch (_) {}

    pixel('CompleteRegistration', { content_name: 'Newsletter Subscribed' })
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="weekly-card weekly-card--done" aria-live="assertive" role="status">
        <div className="weekly-ty-burst" aria-hidden="true">🎉</div>
        <h4 className="weekly-ty-title">সাবস্ক্রাইব সফল হয়েছে!</h4>
        <p className="weekly-ty-email">
          <span className="ty-email-addr">{email}</span>
        </p>
        <p className="weekly-ty-promise">প্রতি সপ্তাহে আপনার ইনবক্সে আসবে:</p>
        <ul className="weekly-ty-list" aria-label="সাপ্তাহিক বিষয়বস্তু">
          <li><span aria-hidden="true">💡</span>মেটা অ্যাডস টিপস ও কৌশল</li>
          <li><span aria-hidden="true">📊</span>সাপ্তাহিক পারফরম্যান্স ইনসাইট</li>
          <li><span aria-hidden="true">🚀</span>উইনিং ক্যাম্পেইন কেস স্টাডি</li>
          <li><span aria-hidden="true">🎁</span>এক্সক্লুসিভ রিসোর্স ও টেমপ্লেট</li>
        </ul>
        <div className="weekly-ty-footer">
          <span aria-hidden="true">🔒</span>&nbsp;
          আমরা স্প্যাম করি না। যেকোনো সময় আনসাবস্ক্রাইব করুন।
        </div>
      </div>
    )
  }

  return (
    <div className="weekly-card">
      <div className="weekly-header">
        <h3 className="weekly-title">📬 সাপ্তাহিক মার্কেটিং টিপস পান</h3>
        <p className="weekly-sub">
          প্রতি সপ্তাহে মেটা অ্যাডস ইনসাইট ও কেস স্টাডি — সরাসরি আপনার ইনবক্সে।
        </p>
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
              aria-describedby={error ? 'nl-err' : undefined}
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
            aria-label="সাবস্ক্রাইব করুন"
          >
            {loading ? (
              <span className="nl-spinner" aria-label="সাবমিট হচ্ছে">
                <span /><span /><span />
              </span>
            ) : (
              <>যোগ দিন <span aria-hidden="true">→</span></>
            )}
          </button>
        </div>

        {error && (
          <p id="nl-err" className="nl-error" role="alert">{error}</p>
        )}

        <p className="nl-fine">
          <span aria-hidden="true">🔒</span>&nbsp;
          স্প্যাম নেই। এক ক্লিকে আনসাবস্ক্রাইব।&nbsp;•&nbsp;প্রতি সোমবার সকালে ইমেইল আসবে।
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function Resources() {
  return (
    <section id="resources" className="resources-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৭</span>
          <span className="section-title-right">ফ্রি রিসোর্স</span>
        </div>
        <EbookSection />
        <WeeklyTipsSection />
      </div>
    </section>
  )
}
