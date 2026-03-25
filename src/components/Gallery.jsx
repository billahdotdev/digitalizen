import { useState, useEffect, useRef } from 'react'
import './Gallery.css'

/* ─────────────────────────────────────────────
   DATA — Local Public Assets
───────────────────────────────────────────── */
const projects = [
  {
    id: 1,
    number: '001',
    title: 'FERTILE AGENCY',
    colorClass: 'brown',
    image: './one.jpg',
    url: '#',
  },
  {
    id: 2,
    number: '002',
    title: 'CAMILLE JUTEL',
    colorClass: 'blue',
    image: './one.jpg',
    url: '#',
  },
  {
    id: 3,
    number: '003',
    title: 'AMOURATROI',
    colorClass: 'gray',
    image: './one.jpg',
    url: '#',
  },
  {
    id: 4,
    number: '004',
    title: 'MARINE BENABOU',
    colorClass: 'dark',
    image: './one.jpg',
    url: '#',
  },
  {
    id: 5,
    number: '005',
    title: 'LCDO FESTIVAL',
    colorClass: 'orange',
    image: './one.jpg',
    url: '#',
  },
  {
    id: 6,
    number: '006',
    title: 'CREATIVE STUDIO',
    colorClass: 'purple',
    image: './one.jpg',
    url: '#',
  },
]

/* ─────────────────────────────────────────────
   PROJECT ITEM COMPONENT
───────────────────────────────────────────── */
function ProjectItem({ project, index }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const itemRef = useRef(null)

  // Minimal intersection observer for zero-jank scroll entrances
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0 }
    )

    if (itemRef.current) observer.observe(itemRef.current)
    return () => observer.disconnect()
  }, [])

  const handleAction = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    if (project.url) window.open(project.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      ref={itemRef}
      className={`gallery-item ${isVisible ? 'gallery-item--visible' : ''}`}
      style={{ '--stagger-delay': `${(index % 3) * 0.15}s` }}
    >
      <div className="gallery-item-header">
        <div className="gallery-item-number">
          <span
            className={`gallery-item-square gallery-item-square--${project.colorClass}`}
            aria-hidden="true"
          />
          {project.number}
        </div>
        <div className="gallery-item-line" aria-hidden="true" />
        <h3 className="gallery-item-title">{project.title}</h3>
      </div>

      <div
        className="gallery-item-image-wrapper"
        onClick={handleAction}
        onKeyDown={handleAction}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} project`}
      >
        <img
          src={project.image}
          alt={`Screenshot of ${project.title} landing page`}
          className={`gallery-item-image ${imageLoaded ? 'gallery-item-image--loaded' : ''}`}
          loading={index <= 1 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'auto'}
          onLoad={() => setImageLoaded(true)}
          draggable="false"
        />
        {!imageLoaded && <div className="gallery-item-skeleton" aria-hidden="true" />}
        
        <div className="gallery-item-overlay" aria-hidden="true">
          <div className="gallery-item-link-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   MAIN GALLERY COMPONENT
───────────────────────────────────────────── */
export default function Gallery() {
  return (
    <section className="gallery-section" id="gallery" aria-label="আমাদের কাজ — প্রজেক্ট গ্যালারি">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৮</span>
          <span className="section-title-right">গ্যালারি</span>
        </div>

        <h2 className="gallery-heading">আমাদের কাজ</h2>
        <p className="gallery-sub">
          প্রতিটি ল্যান্ডিং পেজ আলাদাভাবে কাস্টম ডিজাইন করা হয়েছে।
        </p>

        <div className="gallery-list" role="list">
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}