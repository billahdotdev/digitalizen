import { useState } from 'react'
import { Link } from 'react-router-dom'
import './FreeResources.css'
import { track } from '../lib/analytics.js'

const EBOOK_FILENAME       = 'one.pdf'
const EBOOK_PATH           = '/eBook/' + EBOOK_FILENAME
const EBOOK_COVER          = '/eBook/cover.png'
const EBOOK_FORM_ACTION    = 'https://docs.google.com/forms/d/e/1FAIpQLSc4az9GfiP2YaonvtjY_ACnkNes7XxnMuPih2520KbT4JC87A/formResponse'
const EBOOK_ENTRY_NAME     = 'entry.1987000516'
const EBOOK_ENTRY_WHATSAPP = 'entry.1290851570'
const TOKEN_KEY            = 'dz_ebook_2026_v1'
const AUDIT_URL            = 'https://digitaligen.billah.dev/audit'

// BD mobile: 01[3-9] + 8 digits  (GP, Robi, BL, Teletalk, Airtel)
const BD_PHONE_RE = /^01[3-9]\d{8}$/

const lsSet = (k, v) => { try { localStorage.setItem(k, v) } catch { /* noop */ } }
const lsGet = k      => { try { return localStorage.getItem(k) } catch { return null } }

function validateName(v) {
  const words = v.trim().split(/\s+/)
  if (words.length < 2 || words.some(w => w.length < 2))
    return 'প্রথম নাম + শেষ নাম, প্লিজ'
  return null
}

function validatePhone(v) {
  const digits = v.replace(/\s|-/g, '')
  if (!BD_PHONE_RE.test(digits))
    return 'দয়া করে সঠিক নম্বর দিন'
  return null
}

export default function FreeResources() {
  const [form,    setForm]    = useState({ name: '', phone: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [unlocked, setUnlocked] = useState(() => lsGet(TOKEN_KEY) === '1')

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // clear error on edit
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nameErr  = validateName(form.name)
    const phoneErr = validatePhone(form.phone)
    if (nameErr || phoneErr) {
      setErrors({ name: nameErr, phone: phoneErr })
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append(EBOOK_ENTRY_NAME,     form.name.trim())
      fd.append(EBOOK_ENTRY_WHATSAPP, form.phone.replace(/\s|-/g, ''))
      await fetch(EBOOK_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd })
    } catch {
      /* no-cors always rejects — that's expected, carry on */
    } finally {
      track('Lead', { content_name: 'Ebook Download' })
      lsSet(TOKEN_KEY, '1')
      setUnlocked(true)
      setLoading(false)

      const a = document.createElement('a')
      a.href = EBOOK_PATH
      a.download = EBOOK_FILENAME
      a.click()
    }
  }

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

      {/* ── Main Two-Column Grid ── */}
      <div className="container fr-main-grid">

        {/* Left: Value Prop */}
        <section className="fr-hero-content" aria-label="Resource overview">
          <div className="fr-badge-2026">NEW ERA 2026</div>
          <div className="fr-tag">{"// EXCLUSIVE RESOURCE"}</div>

          <h1 className="fr-hero-text">
            মার্কেটিং এ<br/>
            <span className="text-glow">বিপ্লব আনুন।</span>
          </h1>

          <p className="fr-hero-sub">
            শুধুমাত্র ২০২৬ সালের জন্য আপডেটেড মেটা অ্যাডস স্ট্র্যাটেজি।
            এআই এবং অটোমেশন ব্যবহার করে কস্ট কমিয়ে সেলস বাড়ানো সম্ভব।
          </p>

          {/* Book preview with real cover */}
          <div className="fr-ebook-preview">
            <div className="fr-ebook-mock">
              <img
                src={EBOOK_COVER}
                alt="Meta Ads Strategy 2026 ebook cover"
                className="fr-ebook-cover-img"
                width="80"
                height="110"
                loading="eager"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
              {/* Fallback text shows if image 404s via CSS sibling trick */}
              <span className="fr-ebook-cover-fallback" aria-hidden="true">
                META ADS<br/>2026<br/>GUIDE
              </span>
            </div>
            <div className="fr-ebook-stats">
              <span>১২০০+</span>
              সফলভাবে ডাউনলোড করা হয়েছে
            </div>
          </div>

          <div className="fr-trust-bar" aria-label="Trust indicators">
            <span>Verified Strategy</span>
            <span aria-hidden="true">•</span>
            <span>Bangla Language</span>
            <span aria-hidden="true">•</span>
            <span>Zero BS</span>
          </div>
        </section>

        {/* Right: Lead Gen / Success */}
        <section className="fr-form-side" aria-label="Access form">
          <div className="fr-form-wrapper">
            {unlocked ? (
              /* ── Already unlocked: skip form ── */
              <div className="fr-success-box">
                <div className="fr-success-icon" aria-hidden="true">✓</div>
                <h3 className="fr-success-title">আপনার কপি রেডি!</h3>
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
              /* ── Form: first visit ── */
              <>
                <div className="fr-form-header">
                  <div className="fr-tag">{"// GET ACCESS"}</div>
                  <h2>এক্সেস নিন</h2>
                  <p>নিচের ফর্মটি পূরণ করে ইবুকটি বুঝে নিন</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>

                  <div className={`fr-ghost-field${errors.name ? ' is-err' : ''}`}>
                    <span className="fr-num" aria-hidden="true">01</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleInput}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'err-name' : undefined}
                    />
                    <label className="fr-floating-label">
                      আপনার পূর্ণ নাম
                      <span className="fr-required" aria-label="required">*</span>
                    </label>
                    <div className="fr-bar" aria-hidden="true" />
                    {errors.name && (
                      <span id="err-name" className="fr-err-msg" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className={`fr-ghost-field${errors.phone ? ' is-err' : ''}`}>
                    <span className="fr-num" aria-hidden="true">02</span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="numeric"
                      maxLength={11}
                      value={form.phone}
                      onChange={handleInput}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-hint err-phone"
                      placeholder=" "
                    />
                    <label className="fr-floating-label">
                      WhatsApp নম্বর
                      <span className="fr-required" aria-label="required">*</span>
                    </label>
                    <div className="fr-bar" aria-hidden="true" />
                    <span id="phone-hint" className="fr-hint">GP · Robi · BL · Teletalk · Airtel — 11 digits</span>
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
      <section className="fr-audit-section" aria-label="Audit CTA">
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
