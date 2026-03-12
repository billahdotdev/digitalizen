import { useState, useEffect, useRef, useCallback } from 'react'
import './Gallery.css'

/* ─────────────────────────────────────
   DATA
   screenshotUrl → real screenshot path
   subdomainUrl  → live hosted page URL
───────────────────────────────────── */
const landingPages = [
  {
    id: 1,
    title: 'ফ্যাশন বুটিক',
    tag: 'ই-কমার্স',
    screenshotUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 2,
    title: 'রেস্টুরেন্ট প্রো',
    tag: 'ফুড & ডাইনিং',
    screenshotUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 3,
    title: 'কোচিং সেন্টার',
    tag: 'এডটেক',
    screenshotUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 4,
    title: 'রিয়েল এস্টেট',
    tag: 'প্রপার্টি',
    screenshotUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 5,
    title: 'বিউটি সালোন',
    tag: 'বিউটি & ওয়েলনেস',
    screenshotUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 6,
    title: 'ফিটনেস ক্লাব',
    tag: 'হেলথ & ফিটনেস',
    screenshotUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=100&fit=crop',
    subdomainUrl: 'https://digitalizen.agency',
  },
]

/* ─────────────────────────────────────
   SINGLE CARD
───────────────────────────────────── */
function SiteCard({ page, index, isActive }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <a
      className={`gallery-card ${loaded ? 'gallery-card--loaded' : ''}`}
      href={page.subdomainUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${page.title} — নতুন ট্যাবে খুলুন`}
      data-index={index}
    >
      {/* Skeleton */}
      <div className="gallery-card__skeleton" aria-hidden="true" />

      {/* Full-bleed image */}
      <img
        className="gallery-card__img"
        src={page.screenshotUrl}
        alt={page.title}
        loading={index <= 1 ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={index === 0 ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
      />

      {/* Gradient */}
      <div className="gallery-card__grad" aria-hidden="true" />

      {/* Info */}
      <div className="gallery-card__info">
        <div className="gallery-card__text">
          <p className="gallery-card__tag">{page.tag}</p>
          <h2 className="gallery-card__title">{page.title}</h2>
        </div>

        <div className="gallery-card__btn" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </div>
      </div>
    </a>
  )
}

/* ─────────────────────────────────────
   GALLERY PAGE
───────────────────────────────────── */
export default function Gallery() {
  const wrapRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  /* Track which card is in view via IntersectionObserver */
  useEffect(() => {
    const cards = wrapRef.current?.querySelectorAll('.gallery-card')
    if (!cards?.length) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            setActiveIndex(idx)
            if (idx > 0) setScrolled(true)
          }
        })
      },
      { root: wrapRef.current, threshold: 0.6 }
    )

    cards.forEach(c => observer.observe(c))
    return () => observer.disconnect()
  }, [])

  /* Dot click → scroll to card */
  const goTo = useCallback(idx => {
    const card = wrapRef.current?.querySelectorAll('.gallery-card')[idx]
    card?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* Scroll container */}
      <div
        ref={wrapRef}
        className="gallery-wrap"
        style={{ marginTop: 'var(--nav-h)', height: 'calc(100dvh - var(--nav-h))' }}
      >
        {landingPages.map((page, i) => (
          <SiteCard
            key={page.id}
            page={page}
            index={i}
            isActive={activeIndex === i}
          />
        ))}
      </div>

      {/* Progress dots */}
      <nav className="gallery-dots" aria-label="গ্যালারি নেভিগেশন">
        {landingPages.map((_, i) => (
          <button
            key={i}
            className={`gallery-dot ${activeIndex === i ? 'gallery-dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`কার্ড ${i + 1}`}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'auto',
            }}
          >
            <span className={`gallery-dot ${activeIndex === i ? 'gallery-dot--active' : ''}`} />
          </button>
        ))}
      </nav>

      {/* Counter */}
      <div className="gallery-counter" aria-live="polite">
        <span className="gallery-counter__current">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span> / {String(landingPages.length).padStart(2, '0')}</span>
      </div>

      {/* Scroll hint — hides after first scroll */}
      <div className={`gallery-scroll-hint ${scrolled ? 'gallery-scroll-hint--hidden' : ''}`} aria-hidden="true">
        <div className="gallery-scroll-hint__line" />
        <div className="gallery-scroll-hint__dot" />
      </div>
    </>
  )
}
