import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { InlineWidget, useCalendlyEventListener } from 'react-calendly'
import './Booking.css'

/* ─── CONFIG — change these to your own links ─── */
const CALENDLY_URL     = 'https://calendly.com/billahdotdev/30min'
const WA_URL           = 'https://wa.me/8801711992558'
const DIGITALIZEN_FB   = 'https://www.facebook.com/digitalizen'
/* ─────────────────────────────────────────────── */

const SERVICES = [
  { icon: '📣', label: 'Facebook Ads', color: '#1877F2' },
  { icon: '🎯', label: 'Meta Strategy', color: '#E91E63' },
  { icon: '📊', label: 'Analytics Review', color: '#22c55e' },
  { icon: '🚀', label: 'Campaign Launch', color: '#f59e0b' },
]

const FAQS = [
  {
    q: 'মিটিং কতক্ষণ হবে?',
    a: 'সাধারণত ৩০ মিনিট। তবে আপনার প্রজেক্টের জটিলতা অনুযায়ী সময় বাড়তে পারে।',
  },
  {
    q: 'মিটিং কোথায় হবে?',
    a: 'Google Meet বা Zoom-এ। বুকিং কনফার্ম হলে লিংক ইমেইলে পাঠানো হবে।',
  },
  {
    q: 'রিশিডিউল করা যাবে?',
    a: 'হ্যাঁ, অবশ্যই। কনফার্মেশন ইমেইলে রিশিডিউল লিংক থাকবে।',
  },
]

export default function Booking() {
  const [booked, setBooked]     = useState(false)
  const [openFaq, setOpenFaq]   = useState(null)
  const widgetRef               = useRef(null)

  useCalendlyEventListener({
    onEventScheduled: () => setBooked(true),
  })

  const scrollToWidget = () => {
    widgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bk-page">

      {/* ── Topbar ── */}
      <header className="bk-topbar">
        <Link to="/" className="bk-logo">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          digitalizen
        </Link>
        <span className="bk-topbar-chip">
          <span className="bk-chip-dot" />
          ফ্রি কনসালটেশন
        </span>
      </header>

      {/* ── Hero ── */}
      <section className="bk-hero">
        <div className="bk-hero-grid" aria-hidden="true" />
        <div className="bk-hero-circle bk-hero-circle--1" aria-hidden="true" />
        <div className="bk-hero-circle bk-hero-circle--2" aria-hidden="true" />

        <div className="bk-hero-inner">
          <div className="bk-hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            FREE CONSULTATION
          </div>

          <h1 className="bk-hero-title">
            আপনার ব্যবসার জন্য<br />
            সেরা অ্যাড স্ট্র্যাটেজি<br />
            <span className="bk-hero-highlight">একটি কলেই তৈরি করি</span>
          </h1>

          <p className="bk-hero-sub">
            বাজেট যাই হোক, সঠিক কৌশলে <strong>ROI বাড়ানো সম্ভব।</strong>{' '}
            ৩০ মিনিটের ফ্রি কলে আপনার ব্যবসার জন্য কাস্টম প্ল্যান বানাই।
          </p>

          <div className="bk-hero-services">
            {SERVICES.map(({ icon, label, color }) => (
              <span key={label} className="bk-service-pill" style={{ '--pill-accent': color }}>
                <span>{icon}</span> {label}
              </span>
            ))}
          </div>

          <button className="bk-hero-cta" onClick={scrollToWidget}>
            এখনই বুক করুন — ফ্রি!
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Main content ── */}
      <main className="bk-main">

        {/* Success banner */}
        {booked && (
          <div className="bk-success" role="alert">
            <span className="bk-success-icon">🎉</span>
            <div>
              <strong>মিটিং কনফার্ম হয়েছে!</strong>
              <p>কনফার্মেশন ও মিটিং লিংক আপনার ইমেইলে পাঠানো হয়েছে।</p>
            </div>
          </div>
        )}

        {/* ── Trust row ── */}
        <div className="bk-trust-row">
          {[
            { icon: '⚡', text: 'ইনস্ট্যান্ট কনফার্মেশন' },
            { icon: '🔒', text: 'কোনো ক্রেডিট কার্ড নেই' },
            { icon: '🎯', text: '১০০% কাস্টমাইজড প্ল্যান' },
            { icon: '✅', text: 'ক্যানসেল যেকোনো সময়' },
          ].map(({ icon, text }) => (
            <div className="bk-trust-item" key={text}>
              <span className="bk-trust-icon">{icon}</span>
              <span className="bk-trust-text">{text}</span>
            </div>
          ))}
        </div>

        {/* ── Section header ── */}
        <div className="bk-section-header" ref={widgetRef}>
          <span className="bk-section-label">STEP 01</span>
          <h2 className="bk-section-title">আপনার সুবিধামতো সময় বেছে নিন</h2>
          <p className="bk-section-sub">নিচের ক্যালেন্ডার থেকে আপনার পছন্দের দিন ও সময় সিলেক্ট করুন</p>
        </div>

        {/* ── Calendly widget ── */}
        <div className="bk-calendly-wrap">
          <InlineWidget
            url={CALENDLY_URL}
            styles={{ height: '700px', minWidth: '100%' }}
            pageSettings={{
              backgroundColor: 'ffffff',
              hideEventTypeDetails: false,
              hideLandingPageDetails: false,
              primaryColor: '1F4BFF',
              textColor: '0B1220',
            }}
          />
        </div>

        {/* ── FAQ ── */}
        <div className="bk-section-header bk-section-header--faq">
          <span className="bk-section-label">FAQ</span>
          <h2 className="bk-section-title">সাধারণ প্রশ্নোত্তর</h2>
        </div>

        <div className="bk-faq">
          {FAQS.map(({ q, a }, i) => (
            <div
              key={i}
              className={'bk-faq-item' + (openFaq === i ? ' bk-faq-item--open' : '')}
            >
              <button
                className="bk-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
              >
                <span>{q}</span>
                <svg
                  className="bk-faq-arrow"
                  width="16" height="16" viewBox="0 0 24 24" fill="none"
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {openFaq === i && <p className="bk-faq-a">{a}</p>}
            </div>
          ))}
        </div>

        {/* ── WhatsApp fallback ── */}
        <div className="bk-alt">
          <p className="bk-alt-text">ক্যালেন্ডার ব্যবহার করতে সমস্যা হচ্ছে?</p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="bk-wa-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            সরাসরি WhatsApp-এ মেসেজ করুন
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{marginLeft:'auto'}}>
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="bk-footer">
        <div className="bk-footer-inner">
          <div className="bk-footer-row">
            <span className="bk-footer-brand">digitalizen</span>
            <div className="bk-footer-links">
              <a href={DIGITALIZEN_FB} target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
          <p className="bk-footer-meta">Meta Ads Expert · Social Media and Digital Marketing Agency</p>
          <p className="bk-footer-copy">© 2026 Digitalizen. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
