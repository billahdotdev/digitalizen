import { useState } from 'react'
import './Gallery.css'

/* ─────────────────────────────────────
   DATA — replace screenshotUrl with
   real screenshots from /public/
   and subdomainUrl with live pages
───────────────────────────────────── */
const landingPages = [
  {
    id: 1,
    title: 'ফ্যাশন বুটিক',
    tag: 'ই-কমার্স',
    screenshotUrl: '../images/imagee.png',
    subdomainUrl: 'https://billahdotdev.github.io/Velore/',
  },
  {
    id: 2,
    title: 'রেস্টুরেন্ট',
    tag: 'ফুড',
    screenshotUrl: 'https://placehold.co/600x800/EEF1FC/1438CC?text=Restaurant',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 3,
    title: 'কোচিং সেন্টার',
    tag: 'এডটেক',
    screenshotUrl: 'https://placehold.co/600x800/E8EEFF/1F4BFF?text=Coaching',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 4,
    title: 'রিয়েল এস্টেট',
    tag: 'প্রপার্টি',
    screenshotUrl: 'https://placehold.co/600x800/EEF1FC/1438CC?text=Real+Estate',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 5,
    title: 'বিউটি সালোন',
    tag: 'বিউটি',
    screenshotUrl: 'https://placehold.co/600x800/E8EEFF/1F4BFF?text=Beauty',
    subdomainUrl: 'https://digitalizen.agency',
  },
  {
    id: 6,
    title: 'ফিটনেস ক্লাব',
    tag: 'হেলথ',
    screenshotUrl: 'https://placehold.co/600x800/EEF1FC/1438CC?text=Fitness',
    subdomainUrl: 'https://digitalizen.agency',
  },
]

function SiteCard({ page }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <a
      className="gallery-card"
      href={page.subdomainUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${page.title} — নতুন ট্যাবে খুলুন`}
    >
      {/* Skeleton */}
      <div className={`gallery-card__skeleton ${imgLoaded ? 'gallery-card__skeleton--gone' : ''}`} />

      {/* Screenshot */}
      <img
        className="gallery-card__img"
        src={page.screenshotUrl}
        alt={page.title}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
      />

      {/* Shine sweep */}
      <div className="gallery-card__shine" aria-hidden="true" />

      {/* Tag (hides on hover / always hidden on touch) */}
      <span className="gallery-card__tag">{page.tag}</span>

      {/* Footer label */}
      <div className="gallery-card__foot" aria-hidden="true">
        <span className="gallery-card__foot-name">{page.title}</span>
        <span className="gallery-card__foot-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function Gallery() {
  return (
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
            যেকোনো কার্ডে ট্যাপ করুন — লাইভ সাইট খুলবে।
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container">
        <div className="gallery-grid">
          {landingPages.map(page => (
            <SiteCard key={page.id} page={page} />
          ))}
        </div>
      </div>
    </div>
  )
}
