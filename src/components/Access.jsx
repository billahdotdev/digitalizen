import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Access.css'

const FB_PROFILE_URL = 'https://www.facebook.com/billahdotdev.me'
const DIGITALIZEN_FB_PROFILE_URL = 'https://www.facebook.com/digitalizen'
const WA_URL         = 'https://wa.me/8801711992558'
const AGENCY_FB_NAME = 'Masum Billah'

/* ─────────────────────────────────────────────────
   STEPS — logical UX order:
   01 Copy name → 02 Go to FB (opens new tab) →
   03 Page Settings → 04 Assign Role → 05 Notify
───────────────────────────────────────────────── */
const STEPS = [
  {
    num: '০১',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'নাম কপি করুন',
    desc: 'অ্যাক্সেস দেওয়ার সময় সহজে খুঁজে পেতে নামটি কপি করে রাখুন, পরে কাজে লাগবে।',
    copyName: true,
  },
  {
    num: '০২',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'ফ্রেন্ড রিকোয়েস্ট পাঠান',
    desc: 'নিচের বাটনে ক্লিক করে আমাদের প্রোফাইলে ফ্রেন্ড রিকোয়েস্ট দিন। এতে অ্যাক্সেস দেওয়ার সময় প্রোফাইলটি সহজে খুঁজে পাবেন।',
    fbCta: true,
  },
  {
    num: '০৩',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'পেজ অ্যাক্সেস অপশনে যান',
    bullets: [
      'প্রোফাইলে থাকলে পেজে সুইচ করুন।',
      'পেজের Settings (না পেলে Settings & Privacy) এ গিয়ে উপরে সার্চ বারে Page Access লিখে সার্চ করুন এবং',
      'Page Access (চাবি) অপশনটিতে ক্লিক করুন।',
    ],
  },
  {
    num: '০৪',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'অ্যাক্সেস কনফার্ম করুন',
    bullets: [
      'প্রথম Add New',
      'Next',
      'সার্চ বক্সে প্রথমেই কপি করা নামটি পেস্ট করুন। আমাদের প্রোফাইলটি সিলেক্ট করে',
      'Full Control অন করুন এবং',
      'Give Access বাটনে ক্লিক করে ইনভাইটেশনটি পাঠিয়ে দিন।',
    ],
    note: 'পেজ এর সেটিং, পোস্ট এডিটিং বা আলাদা হেল্প না লাগলে ফুল কন্ট্রোল দিতে হবে না।',
  },
  {
    num: '০৫',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'আমাদেরকে জানান',
    desc: 'অ্যাক্সেস দেওয়া হয়ে গেলে বা কোনো সমস্যা হলে সরাসরি আমাদের WhatsApp এ একটি মেসেজ দিন।',
    waCta: true,
  },
]

export default function Access() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText(AGENCY_FB_NAME).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="ac-page">

      {/* ── Topbar ── */}
      <header className="ac-topbar">
        <Link to="/" className="ac-logo">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          digitalizen
        </Link>
        <span className="ac-topbar-chip">
          <span className="ac-chip-dot" />
          Facebook Page Access
        </span>
      </header>

      {/* ════ HERO — blue gradient bar ════ */}
      <section className="ac-hero" aria-label="Welcome">
        {/* decorative grid */}
        <div className="ac-hero-grid" aria-hidden="true" />
        {/* decorative circles */}
        <div className="ac-hero-circle ac-hero-circle--1" aria-hidden="true" />
        <div className="ac-hero-circle ac-hero-circle--2" aria-hidden="true" />

        <div className="ac-hero-inner">
          <div className="ac-hero-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Meta Ads Partner
          </div>

          <h1 className="ac-hero-title">
            আপনার বিজ্ঞাপন ব্যবস্থাপনায়<br />
            যুক্ত হতে পেরে আনন্দিত। ধন্যবাদ!
          </h1>
          <p className="ac-hero-sub">
            ভালো কনটেন্ট এবং সঠিক বাজেট থাকলে,{' '}
            <strong>DIGITALIZEN</strong>{' '}
            সেরা রেজাল্ট নিশ্চিত করে।
          </p>

          {/* trust pills */}
          <div className="ac-hero-pills" aria-hidden="true">
            <span>🛡️ পেজ নিরাপদ</span>
            <span>🔒 নো পাসওয়ার্ড</span>
            <span>⚡ দ্রুত কাজ শুরু</span>
          </div>
        </div>
      </section>

      {/* ════ FLOW ════ */}
      <main className="ac-main">
        <div className="ac-flow-header">
          <span className="ac-flow-label">স্টেপ বাই স্টেপ</span>
          <h2 className="ac-flow-title">কীভাবে Page Access দেবেন?</h2>
        </div>

        <ol className="ac-steps" aria-label="Access দেওয়ার ধাপসমূহ">
          {STEPS.map(({ num, icon, title, desc, bullets, note, copyName, fbCta, waCta }, i) => (
            <li key={num} className="ac-step">

              {/* Spine */}
              <div className="ac-step-spine" aria-hidden="true">
                <div className="ac-badge">{num}</div>
                {i < STEPS.length - 1 && <div className="ac-spine-line" />}
              </div>

              {/* Card */}
              <div className={'ac-card' + (copyName ? ' ac-card--highlight' : '')}>
                <div className="ac-card-icon">{icon}</div>
                <div className="ac-card-body">
                  <h3 className="ac-card-title">{title}</h3>

                  {/* plain description */}
                  {desc && <p className="ac-card-desc">{desc}</p>}

                  {/* bullet list (steps 03, 04) */}
                  {bullets && (
                    <ul className="ac-card-bullets">
                      {bullets.map((b, bi) => (
                        <li key={bi}>
                          <span className="ac-bullet-dot" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* asterisk note (step 04) */}
                  {note && <p className="ac-card-note">*{note}</p>}

                  {/* Step 01 — copy name widget */}
                  {copyName && (
                    <div className="ac-copy-block">
                      <div className="ac-copy-name-display">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,color:'#1F4BFF'}}>
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" fill="currentColor"/>
                        </svg>
                        <span className="ac-copy-nametext">{AGENCY_FB_NAME}</span>
                      </div>
                      <button
                        className={'ac-copy-btn' + (copied ? ' ac-copy-btn--done' : '')}
                        onClick={handleCopy}
                        aria-live="polite"
                        aria-label={copied ? 'কপি হয়েছে' : 'নাম কপি করুন'}
                      >
                        {copied ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            কপি হয়েছে!
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            নাম কপি করুন
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Step 02 — FB profile button */}
                  {fbCta && (
                    <a
                      href={FB_PROFILE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ac-fb-goto"
                    >
                      <span className="ac-fb-goto-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                        </svg>
                      </span>
                      <span className="ac-fb-goto-label">
                        <span className="ac-fb-goto-main">Facebook Profile-এ যান</span>
                        <span className="ac-fb-goto-hint">নতুন ট্যাবে খুলবে</span>
                      </span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginLeft:'auto',flexShrink:0}}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}

                  {/* Step 05 — WhatsApp button */}
                  {waCta && (
                    <a
                      href={WA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ac-wa-goto"
                    >
                      <span className="ac-wa-goto-icon">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </span>
                      <span className="ac-wa-goto-label">
                        <span className="ac-wa-goto-main">WhatsApp-এ মেসেজ করুন</span>
                        <span className="ac-wa-goto-hint">নতুন ট্যাবে খুলবে</span>
                      </span>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginLeft:'auto',flexShrink:0}}>
                        <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

            </li>
          ))}
        </ol>
      </main>

      {/* ── Footer ── */}
      <footer className="ac-footer">
        <div className="ac-footer-inner">
          <div className="ac-footer-row">
            <span className="ac-footer-brand">digitalizen</span>
            <div className="ac-footer-links">
              <a href={DIGITALIZEN_FB_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
          <p className="ac-footer-meta">Meta Ads Expert · Social Media and Digital Marketing Agency</p>
          <p className="ac-footer-copy">© 2026 Digitalizen. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
