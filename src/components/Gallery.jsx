import { useState, useEffect, useCallback } from 'react'
import './Gallery.css'

/* ─────────────────────────────────────
   DATA  — replace screenshotUrl with
   actual screenshots (import or /public)
   and subdomainUrl with your live pages
───────────────────────────────────── */
const landingPages = [
  {
    id: 1,
    title: 'ফ্যাশন বুটিক',
    description: 'আধুনিক পোশাক ব্র্যান্ডের জন্য হাই-কনভার্টিং ল্যান্ডিং পেজ।',
    tag: 'ই-কমার্স',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Fashion+Boutique',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 2,
    title: 'রেস্টুরেন্ট প্রো',
    description: 'অনলাইন অর্ডার ও রিজার্ভেশন সহ রেস্টুরেন্ট পেজ।',
    tag: 'ফুড',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Restaurant+Pro',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 3,
    title: 'কোচিং সেন্টার',
    description: 'লিড জেনারেশন ফোকাসড শিক্ষামূলক ল্যান্ডিং পেজ।',
    tag: 'এডটেক',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Coaching+Center',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 4,
    title: 'রিয়েল এস্টেট',
    description: 'প্রপার্টি শোকেস ও এজেন্ট কনটাক্ট পেজ।',
    tag: 'রিয়েল এস্টেট',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Real+Estate',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 5,
    title: 'বিউটি সালোন',
    description: 'অ্যাপয়েন্টমেন্ট বুকিং সহ সালোন ল্যান্ডিং পেজ।',
    tag: 'বিউটি',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Beauty+Salon',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 6,
    title: 'ফিটনেস ক্লাব',
    description: 'মেম্বারশিপ সাইনআপ ও ক্লাস শিডিউল পেজ।',
    tag: 'হেলথ',
    screenshotUrl: 'https://placehold.co/800x600/EEF1FC/1F4BFF?text=Fitness+Club',
    subdomainUrl: 'https://digitalizen.agency',
  },
]

/* ─────────────────────────────────────
   CARD
───────────────────────────────────── */
function SiteCard({ page, onOpen }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <article
      className="gallery-card"
      onClick={() => onOpen(page)}
      role="button"
      tabIndex={0}
      aria-label={`${page.title} — লাইভ প্রিভিউ দেখুন`}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onOpen(page)}
    >
      <div className="gallery-card__thumb">
        {/* Skeleton */}
        <div className={`gallery-card__skeleton ${imgLoaded ? 'gallery-card__skeleton--hidden' : ''}`} />

        {/* Screenshot */}
        <img
          className="gallery-card__img"
          src={page.screenshotUrl}
          alt={page.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Tag */}
        <span className="gallery-card__tag">{page.tag}</span>

        {/* Hover overlay */}
        <div className="gallery-card__overlay" aria-hidden="true">
          <div className="gallery-card__overlay-circle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>
      </div>

      <div className="gallery-card__body">
        <h3 className="gallery-card__title">{page.title}</h3>
        <p className="gallery-card__desc">{page.description}</p>
        <span className="gallery-card__cta">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          লাইভ দেখুন
        </span>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────
   MODAL — full-screen website viewer
───────────────────────────────────── */
function GalleryModal({ page, onClose }) {
  const [loaded, setLoaded] = useState(false)

  // Escape to close
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <div
      className="gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${page.title} ফুলস্ক্রিন প্রিভিউ`}
    >
      {/* Top bar */}
      <div className="gallery-modal__bar">
        <button
          className="gallery-modal__close"
          onClick={onClose}
          aria-label="বন্ধ করুন"
        >
          ✕
        </button>

        <div className="gallery-modal__url-bar">
          <span className="gallery-modal__url-dot" />
          <span className="gallery-modal__url-text">{page.subdomainUrl}</span>
        </div>

        <a
          className="gallery-modal__ext-btn"
          href={page.subdomainUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="নতুন ট্যাবে খুলুন"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          খুলুন
        </a>
      </div>

      {/* Iframe */}
      <div className="gallery-modal__frame">
        {/* Loading spinner */}
        <div className={`gallery-modal__loading ${loaded ? 'gallery-modal__loading--hidden' : ''}`}>
          <div className="gallery-modal__spinner" />
          <span className="gallery-modal__loading-label">লোড হচ্ছে...</span>
        </div>

        <iframe
          className="gallery-modal__iframe"
          src={page.subdomainUrl}
          title={page.title}
          onLoad={() => setLoaded(true)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────
   PAGE
───────────────────────────────────── */
export default function Gallery() {
  const [activeSite, setActiveSite] = useState(null)

  const handleOpen = useCallback(page => setActiveSite(page), [])
  const handleClose = useCallback(() => setActiveSite(null), [])

  return (
    <>
      <div className="gallery-page">
        {/* Hero */}
        <div className="gallery-hero">
          <div className="container">
            <span className="section-label" style={{ justifyContent: 'center' }}>
              আমাদের কাজ
            </span>
            <h1 className="gallery-hero__title">
              Digitalizen <span>গ্যালারি</span>
            </h1>
            <p className="gallery-hero__sub">
              আমাদের তৈরি প্রিমিয়াম ল্যান্ডিং পেজগুলো দেখুন — যেকোনো কার্ডে ক্লিক করলে লাইভ সাইট লোড হবে।
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="container">
          <div className="gallery-grid">
            {landingPages.map(page => (
              <SiteCard key={page.id} page={page} onOpen={handleOpen} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {activeSite && (
        <GalleryModal page={activeSite} onClose={handleClose} />
      )}
    </>
  )
}
