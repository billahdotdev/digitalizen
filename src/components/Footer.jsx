import { useState, useEffect, useRef, useCallback } from 'react'
import './Footer.css'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'

/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.
══════════════════════════════════════════════════ */

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

/* ══════════════════════════════════════════════════
   LEGAL MODAL CONTENT
══════════════════════════════════════════════════ */
const LEGAL = {
  privacy: {
    title: 'প্রাইভেসি পলিসি',
    sections: [
      {
        heading: 'তথ্য সংগ্রহ',
        body: 'আমরা কেবলমাত্র সেই তথ্য সংগ্রহ করি যা আমাদের সেবা প্রদানের জন্য প্রয়োজনীয়। এর মধ্যে আপনার নাম, ফোন নম্বর, ব্যবসার বিবরণ এবং যোগাযোগের তথ্য অন্তর্ভুক্ত। আমরা Meta Pixel এবং Conversion API ব্যবহার করে বিজ্ঞাপনের কার্যকারিতা পরিমাপ করি।',
      },
      {
        heading: 'তথ্য ব্যবহার',
        body: 'সংগৃহীত তথ্য কেবলমাত্র আপনার সেবা উন্নত করতে এবং কার্যকর পরামর্শ প্রদানের জন্য ব্যবহার করা হয়। আমরা কখনো আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।',
      },
      {
        heading: 'কুকি ও ট্র্যাকিং',
        body: 'আমরা Facebook Pixel, Conversion API এবং Google Analytics ব্যবহার করি। এগুলো আমাদের বিজ্ঞাপনের কার্যকারিতা মাপতে এবং আপনার অভিজ্ঞতা উন্নত করতে সাহায্য করে। আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকি নিষ্ক্রিয় করতে পারেন।',
      },
      {
        heading: 'যোগাযোগ',
        body: 'প্রাইভেসি সংক্রান্ত যেকোনো প্রশ্নের জন্য WhatsApp-এ আমাদের সাথে যোগাযোগ করুন: +880 17-1199-2558',
      },
    ],
  },
  terms: {
    title: 'শর্তাবলী',
    sections: [
      {
        heading: 'সেবার শর্ত',
        body: 'Digitalizen-এর সেবা ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। আমাদের সেবা কেবলমাত্র বৈধ ব্যবসায়িক উদ্দেশ্যে ব্যবহারযোগ্য। যেকোনো অবৈধ বা প্রতারণামূলক কার্যকলাপের জন্য আমরা দায়ী নই।',
      },
      {
        heading: 'পেমেন্ট ও বিলিং',
        body: 'মাসিক প্যাকেজের পেমেন্ট প্রতি মাসের শুরুতে পরিশোধ করতে হবে। বিজ্ঞাপন বাজেট সরাসরি Meta/Facebook অ্যাকাউন্টে পরিশোধিত হয়। সার্ভিস চার্জ এবং বিজ্ঞাপন বাজেট আলাদাভাবে বিবেচিত হয়।',
      },
      {
        heading: 'ফলাফলের নিশ্চয়তা',
        body: 'ডিজিটাল মার্কেটিংয়ের ফলাফল বিভিন্ন কারণের উপর নির্ভর করে। আমরা সর্বোচ্চ প্রচেষ্টা নিশ্চিত করি তবে নির্দিষ্ট ROAS বা বিক্রয়ের পরিমাণের নিশ্চয়তা দেওয়া সম্ভব নয়।',
      },
      {
        heading: 'চুক্তি বাতিল',
        body: '৩০ দিনের নোটিশ দিয়ে যেকোনো পক্ষ চুক্তি বাতিল করতে পারবে। চলমান ক্যাম্পেইনের ডেটা এবং ক্রিয়েটিভ সম্পদ ক্লায়েন্টের কাছে হস্তান্তর করা হবে।',
      },
    ],
  },
  refund: {
    title: 'রিফান্ড পলিসি',
    sections: [
      {
        heading: 'সার্ভিস চার্জ রিফান্ড',
        body: 'সার্ভিস শুরু হওয়ার ৭ দিনের মধ্যে যদি কোনো কাজ শুরু না হয়ে থাকে, সেক্ষেত্রে সম্পূর্ণ রিফান্ড প্রযোজ্য। একবার কাজ শুরু হলে সার্ভিস চার্জ ফেরতযোগ্য নয়।',
      },
      {
        heading: 'বিজ্ঞাপন বাজেট',
        body: 'Meta/Facebook-এ ব্যয় হওয়া বিজ্ঞাপন বাজেট রিফান্ডযোগ্য নয়, কারণ এটি সরাসরি প্ল্যাটফর্মে পরিশোধিত হয়। অব্যবহৃত বিজ্ঞাপন বাজেট Meta-র নিজস্ব পলিসি অনুযায়ী পরিচালিত হয়।',
      },
      {
        heading: 'বিশেষ পরিস্থিতি',
        body: 'প্রযুক্তিগত ত্রুটি বা আমাদের পক্ষ থেকে সেবা প্রদানে ব্যর্থতার ক্ষেত্রে সম্পূর্ণ বা আংশিক রিফান্ড বিবেচনা করা হবে। প্রতিটি ক্ষেত্রে আলোচনার মাধ্যমে সমাধান করা হয়।',
      },
      {
        heading: 'রিফান্ড প্রক্রিয়া',
        body: 'রিফান্ড অনুরোধ WhatsApp-এ পাঠান। অনুরোধ পর্যালোচনার পর ৫–৭ কার্যদিবসের মধ্যে প্রক্রিয়াকরণ সম্পন্ন হবে।',
      },
    ],
  },
}

/* ══════════════════════════════════════════════════
   LEGAL MODAL COMPONENT
══════════════════════════════════════════════════ */
function LegalModal({ modalKey, onClose }) {
  const content    = LEGAL[modalKey]
  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    // Prevent body scroll
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  // Close on backdrop click
  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!content) return null
  return (
    <div
      className="legal-overlay"
      ref={overlayRef}
      onClick={handleOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
    >
      <div className="legal-modal">
        <div className="legal-modal__header">
          <h2 className="legal-modal__title">{content.title}</h2>
          <button
            className="legal-modal__close"
            onClick={onClose}
            aria-label="বন্ধ করুন"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="legal-modal__body">
          {content.sections.map((s, i) => (
            <div key={i} className="legal-modal__section">
              <h3 className="legal-modal__section-title">{s.heading}</h3>
              <p className="legal-modal__section-text">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="legal-modal__footer">
          <button className="legal-modal__done" onClick={onClose}>বুঝলাম</button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   STATIC DATA
══════════════════════════════════════════════════ */
const socials = [
  {
    name: 'Facebook',
    url: 'https://facebook.com/digitalizen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/digitalizen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 1 0 12.324 6.162 6.162 0 0 1 0-12.324zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@digitalizen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1-.07z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/digitalizen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@digitalizen',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

const navLinks = [
  { label: 'প্যাকেজ ফাইন্ডার',    id: 'finder' },
  { label: 'প্রক্রিয়া',           id: 'process' },
  { label: 'প্যাকেজ',             id: 'packages' },
  { label: 'প্রুফ',               id: 'proof' },
  { label: 'আমাদের সম্পর্কে',     id: 'about' },
  { label: 'ফ্রি কনসালটেশন কল',   id: 'book-call' },
  { label: 'ফ্রি রিসোর্স',        id: 'resources' },
  { label: 'FAQ',                  id: 'faq' },
  { label: 'যোগাযোগ',             id: 'contact' },
]

/* ══════════════════════════════════════════════════
   FOOTER COMPONENT
══════════════════════════════════════════════════ */
export default function Footer() {
  const [modal, setModal] = useState(null)   // 'privacy' | 'terms' | 'refund' | null

  const footerFiredRef  = useRef(false)
  const enterTimeRef    = useRef(null)
  const footerRef       = useRef(null)
  const socialClicksRef = useRef(0)
  const navClicksRef    = useRef(0)

  /* ── Footer ViewContent + time-on-footer engagement ── */
  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !footerFiredRef.current) {
          footerFiredRef.current = true
          enterTimeRef.current   = Date.now()
          track('ViewContent', {
            content_name:     'Footer',
            content_category: 'Section',
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('footer', enterTimeRef, { social_clicks: socialClicksRef.current, nav_clicks: navClicksRef.current })

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  /* ── Handlers ── */
  const handleWa = useCallback(() => {
    track('Contact', {
      content_name:     'Footer WhatsApp',
      content_category: 'CTA',
    })
    window.open('https://wa.me/' + WA_NUMBER, '_blank')
  }, [])

  const handleSocial = useCallback((name) => {
    socialClicksRef.current += 1
    track('Contact', {
      content_name:     `${name} Footer`,
      content_category: 'Social Link',
      content_ids:      [`footer_social_${name.toLowerCase()}`],
    })
  }, [])

  const handleNav = useCallback((l) => {
    navClicksRef.current += 1
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event:          'footer_nav_click',
      nav_label:      l.label,
      nav_section_id: l.id,
    })
    go(l.id)
  }, [])

  const openModal = useCallback((key) => {
    setModal(key)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'legal_modal_open', legal_page: key })
  }, [])

  const closeModal = useCallback(() => setModal(null), [])

  return (
    <>
      <footer className="footer" role="contentinfo" ref={footerRef}>
        <div className="container">
          <div className="footer__main">

            {/* Brand */}
            <div className="footer__brand">
              <span className="footer__logo" aria-label="Digitalizen">
                digitalizen<span className="footer__logo-dot" aria-hidden="true" />
              </span>
              <p className="footer__tagline">
                সোশ্যাল মিডিয়াঅ্যাড এক্সপার্ট এজেন্সি<br />
                ০% ফেক প্রমিজ | ডেটা-ড্রিভেন স্ট্র্যাটেজি
              </p>

              {/* WhatsApp CTA */}
              <button
                className="footer__wa-btn"
                onClick={handleWa}
                aria-label="WhatsApp-এ যোগাযোগ করুন"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                WhatsApp: +880 17-1199-2558
              </button>

              {/* Social icons */}
              <ul className="footer__socials" aria-label="সোশ্যাল মিডিয়া লিংক">
                {socials.map(s => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      aria-label={s.name}
                      onClick={() => handleSocial(s.name)}
                    >
                      {s.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nav links */}
            <nav className="footer__nav" aria-label="ফুটার নেভিগেশন">
              <p className="footer__nav-title">কুইক লিংক</p>
              {navLinks.map(l => (
                <button
                  key={l.id}
                  className="footer__link"
                  onClick={() => handleNav(l)}
                >
                  {l.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Bottom bar */}
          <div className="footer__bottom">
            <span className="footer__copy">
              © {new Date().getFullYear()} Digitalizen. সর্বস্বত্ব সংরক্ষিত।
            </span>
            <div className="footer__legal">
              <button className="footer__legal-btn" onClick={() => openModal('privacy')}>
                প্রাইভেসি পলিসি
              </button>
              <span aria-hidden="true">·</span>
              <button className="footer__legal-btn" onClick={() => openModal('terms')}>
                শর্তাবলী
              </button>
              <span aria-hidden="true">·</span>
              <button className="footer__legal-btn" onClick={() => openModal('refund')}>
                রিফান্ড পলিসি
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal modals — rendered outside footer for correct stacking */}
      {modal && <LegalModal modalKey={modal} onClose={closeModal} />}
    </>
  )
}
