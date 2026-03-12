import { useState, useEffect, useRef, useCallback } from 'react'
import './Gallery.css'

/* ─────────────────────────────────────────────
   DATA — swap img + url for real content
───────────────────────────────────────────── */
const sites = [
  {
    id: 1,
    title: 'ফ্যাশন বুটিক',
    tag: 'ই-কমার্স',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
  {
    id: 2,
    title: 'রেস্টুরেন্ট প্রো',
    tag: 'ফুড',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
  {
    id: 3,
    title: 'কোচিং সেন্টার',
    tag: 'এডটেক',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
  {
    id: 4,
    title: 'রিয়েল এস্টেট',
    tag: 'প্রপার্টি',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
  {
    id: 5,
    title: 'বিউটি সালোন',
    tag: 'বিউটি',
    img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
  {
    id: 6,
    title: 'ফিটনেস ক্লাব',
    tag: 'হেলথ',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=100&fit=crop&auto=format',
    url: 'https://digitalizen.agency',
  },
]

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */
function GCard({ site, index, total }) {
  const [ready, setReady] = useState(false)

  return (
    <div
      className={`gc ${ready ? 'gc--ready' : ''}`}
      data-index={index}
    >
      <div className="gc__skeleton" aria-hidden="true" />

      <img
        className="gc__img"
        src={site.img}
        alt={site.title}
        loading={index <= 1 ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={index === 0 ? 'high' : 'auto'}
        onLoad={() => setReady(true)}
        draggable="false"
      />

      <div className="gc__grad" aria-hidden="true" />

      {/* Tag — top right, minimal */}
      <span className="gc__tag" aria-label={site.tag}>{site.tag}</span>

      {/* Bottom: just title + arrow */}
      <div className="gc__info">
        <h2 className="gc__title">{site.title}</h2>

        <a
          className="gc__arrow"
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.title} — লাইভ সাইট খুলুন`}
          onClick={e => e.stopPropagation()}
        >
          {/* Northeast arrow */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   OVERLAY
───────────────────────────────────────────── */
function GalleryOverlay({ onClose }) {
  const scrollRef = useRef(null)
  const [active, setActive]   = useState(0)
  const [scrolled, setScrolled] = useState(false)

  /* Lock body scroll */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  /* Escape closes */
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  /* Track visible card */
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const cards = el.querySelectorAll('.gc')
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = Number(e.target.dataset.index)
            setActive(idx)
            if (idx > 0) setScrolled(true)
          }
        })
      },
      { root: el, threshold: 0.55 }
    )
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [])

  const goTo = useCallback(idx => {
    scrollRef.current
      ?.querySelectorAll('.gc')
      ?.[idx]
      ?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="go" role="dialog" aria-modal="true" aria-label="গ্যালারি">

      {/* Close */}
      <button
        className="go__close"
        onClick={onClose}
        aria-label="গ্যালারি বন্ধ করুন"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        ফিরে যান
      </button>

      {/* Counter */}
      <div className="go__counter" aria-live="polite">
        <span className="go__counter-cur">{String(active + 1).padStart(2, '0')}</span>
        <span className="go__counter-sep">/</span>
        <span className="go__counter-total">{String(sites.length).padStart(2, '0')}</span>
      </div>

      {/* Dot nav */}
      <nav className="go__dots" aria-label="কার্ড নেভিগেশন">
        {sites.map((s, i) => (
          <button
            key={s.id}
            className={`go__dot ${active === i ? 'go__dot--active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`${s.title}`}
            aria-current={active === i ? 'true' : undefined}
          >
            <span className="go__dot-pip" />
          </button>
        ))}
      </nav>

      {/* Scroll hint */}
      <div className={`go__hint ${scrolled ? 'go__hint--gone' : ''}`} aria-hidden="true">
        <div className="go__hint-line" />
        <div className="go__hint-dot" />
      </div>

      {/* Cards */}
      <div className="go__scroll" ref={scrollRef}>
        {sites.map((site, i) => (
          <GCard key={site.id} site={site} index={i} total={sites.length} />
        ))}
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────
   SECTION (place in MainLayout after Resources)
───────────────────────────────────────────── */
export default function Gallery() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section className="gallery-section" id="gallery">
        <div className="container">

          {/* ── Header — matches site-wide pattern ── */}
          <div className="row-header">
            <span className="section-num">০০৮</span>
            <span className="section-title-right">গ্যালারি</span>
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--text)',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}>
            আমাদের কাজ
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            marginBottom: '28px',
            lineHeight: 1.6,
          }}>
            প্রতিটি ল্যান্ডিং পেজ আলাদাভাবে কাস্টম ডিজাইন করা হয়েছে।
          </p>

          <button
            className="btn-primary"
            onClick={() => setOpen(true)}
            style={{ width: '100%' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            গ্যালারি দেখুন — {sites.length}টি প্রজেক্ট
          </button>

        </div>
      </section>

      {open && <GalleryOverlay onClose={() => setOpen(false)} />}
    </>
  )
}
