import { useState, useCallback, useEffect, useRef } from 'react'
import { track, pushEngagement } from '../analytics.js'
import './About.css'

/* ── SVG Icons ─────────────────────────────────── */
const Icons = {
  data: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
  eye:  (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  link: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
  expand: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>),
  prev: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  next: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  github: (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>),
  globe: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>),
  shield: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>),
  check: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  progress: (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
}

const values = [
  { icon: Icons.data, title: 'ডেটা-ড্রিভেন', desc: 'প্রতিটি সিদ্ধান্ত ডেটার উপর ভিত্তি করে, অনুমানের উপর নয়।' },
  { icon: Icons.eye,  title: 'স্বচ্ছতা',     desc: 'প্রতিটি টাকা কোথায় যাচ্ছে তা আপনি সবসময় দেখতে পাবেন।' },
  { icon: Icons.link, title: 'পার্টনারশিপ',  desc: 'আমরা ভেন্ডর নই — আপনার ডিজিটাল গ্রোথ পার্টনার।' },
]

const screenshots = [
  { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', caption: 'ক্যাম্পেইন ড্যাশবোর্ড', overlay: 'Campaign Overview' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', caption: 'ROAS রিপোর্ট', overlay: 'ROAS Analytics' },
  { src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', caption: 'অডিয়েন্স ইনসাইট', overlay: 'Audience Insights' },
  { src: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80', caption: 'কনভার্সন ট্র্যাকিং', overlay: 'Conversion Tracking' },
  { src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', caption: 'A/B টেস্ট রেজাল্ট', overlay: 'A/B Test Results' },
]

export default function About() {
  const [active,   setActive]   = useState(null)
  const [fading,   setFading]   = useState(false)
  const [entered,  setEntered]  = useState(false)

  const sectionRef       = useRef(null)
  const enterTimeRef     = useRef(null)
  const firedRef         = useRef(false)
  const touchStartX      = useRef(null)
  const galleryOpenedRef = useRef(0)
  const founderClickRef  = useRef(0)

  /* ── Section IO + stagger ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        setEntered(true)
        track('ViewContent', { content_name: 'About Section', content_category: 'Section' }, 'about')
        io.unobserve(el)
      }
    }, { threshold: 0.15 })
    io.observe(el)

    const push = () => pushEngagement('about', enterTimeRef, {
      gallery_images_opened: galleryOpenedRef.current,
      founder_link_clicks:   founderClickRef.current,
    })
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  /* ── Keyboard lightbox navigation ── */
  useEffect(() => {
    if (active === null) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleThumb = useCallback((i) => {
    if (active === null) {
      setActive(i)
      galleryOpenedRef.current += 1
      track('ViewContent', { content_name: `Gallery: ${screenshots[i].caption}`, content_category: 'Gallery', content_ids: [`gallery_${i + 1}`], gallery_index: i + 1 }, 'about')
    } else if (active === i) {
      setActive(null)
    } else {
      setFading(true)
      setTimeout(() => {
        setActive(i)
        setFading(false)
        track('ViewContent', { content_name: `Gallery: ${screenshots[i].caption}`, content_category: 'Gallery', content_ids: [`gallery_${i + 1}`], gallery_index: i + 1 }, 'about')
      }, 200)
    }
  }, [active])

  const navigate = useCallback((dir) => {
    if (active === null) return
    setFading(true)
    setTimeout(() => {
      setActive((prev) => {
        const next = (prev + dir + screenshots.length) % screenshots.length
        track('ViewContent', { content_name: `Gallery: ${screenshots[next].caption}`, content_category: 'Gallery Navigate', content_ids: [`gallery_${next + 1}`], gallery_index: next + 1 }, 'about')
        return next
      })
      setFading(false)
    }, 200)
  }, [active])

  const close = useCallback(() => setActive(null), [])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) navigate(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  const handleFounderLink = useCallback((label) => {
    founderClickRef.current += 1
    track('ViewContent', { content_name: `Founder Link: ${label}`, content_category: 'Founder', content_ids: ['founder_link'] }, 'about')
  }, [])

  const current = active !== null ? screenshots[active] : null

  return (
    <section
      id="about"
      className={`about-section${entered ? ' about-section--entered' : ''}`}
      aria-label="আমাদের সম্পর্কে"
      ref={sectionRef}
    >
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৫</span>
          <span className="section-title-right">আমাদের সম্পর্কে</span>
        </div>

        {/* ── Main copy ── */}
        <div className="about-main">
          <div className="about-badge">
            <span className="about-badge-dot" aria-hidden="true" />
            বাংলাদেশের ফুল-স্ট্যাক মার্কেটিং এজেন্সি
          </div>

          <h2 className="about-heading">
            আমরা শুধু অ্যাড চালাই না!<br />
            <span className="about-blue">আপনার টোটাল ডিজিটাল মার্কেটিং কভার করি</span>
          </h2>

          <p className="about-desc">
            Digitalizen একটি রেজাল্ট-ফোকাসড পারফরম্যান্স মার্কেটিং এজেন্সি। আমরা সোশ্যাল মিডিয়া অ্যাডসের মাধ্যমে সত্যিকারের স্কেলেবল গ্রোথ দিতে কাজ করি।
          </p>
          <p className="about-desc">
            আমাদের সহজ মেথড: টেস্ট করো, ডেটা দেখো, স্কেল করো। আমরা বিশ্বাস করি আপনার ইনভেস্ট করা প্রতিটি টাকার প্রপার রিটার্ন থাকা উচিত।
          </p>

          <div className="about-stats">
            <div className="about-stat"><span className="about-stat__num">৯+</span><span className="about-stat__label">বছরের অভিজ্ঞতা</span></div>
            <div className="about-stat"><span className="about-stat__num">২৩,০০০+</span><span className="about-stat__label">সফল ক্যাম্পেইন</span></div>
            <div className="about-stat"><span className="about-stat__num">৩,৬০০+</span><span className="about-stat__label">সন্তুষ্ট ক্লায়েন্ট</span></div>
          </div>
        </div>

        {/* ── Values ── */}
        <div className="about-values" aria-label="আমাদের মূল্যবোধ">
          {values.map((v, i) => (
            <div key={i} className="value-card">
              <div className="value-icon" aria-hidden="true">{v.icon}</div>
              <div>
                <h3 className="value-title">{v.title}</h3>
                <p className="value-desc">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Screenshot Gallery ── */}
        <div className="about-screenshots" aria-label="ক্যাম্পেইন স্ক্রিনশট">
          <div className="screenshots-header">
            <p className="screenshots-label">Ads Manager থেকে সরাসরি</p>
            <span className="screenshots-live">
              <span className="screenshots-live-dot" aria-hidden="true" />
              Real Results
            </span>
          </div>
          <p className="screenshots-sub">আমাদের ক্লায়েন্টদের চলমান ক্যাম্পেইনের সত্যিকারের ডেটা। কোনো এডিটিং নেই।</p>

          <div className="screenshots-outer">
            <div className="screenshots-strip" role="list">
              {screenshots.map((s, i) => (
                <button
                  key={i}
                  className={`sc-thumb${active === i ? ' sc-thumb--active' : ''}`}
                  onClick={() => handleThumb(i)}
                  aria-label={`${s.caption} — ${active === i ? 'বন্ধ করুন' : 'দেখুন'}`}
                  role="listitem"
                >
                  <div className="sc-thumb-wrap">
                    <img src={s.src} alt={s.caption} className="sc-thumb-img" loading="lazy" />
                    <div className="sc-thumb-icon" aria-hidden="true">{Icons.expand}</div>
                  </div>
                  <span className="sc-thumb-caption">{s.caption}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`sc-expanded${active !== null ? ' sc-expanded--open' : ''}`}
            aria-live="polite"
            aria-label={current ? current.caption : undefined}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {current && (
              <div className="sc-expanded-inner">
                <img
                  key={active}
                  src={current.src}
                  alt={current.caption}
                  className={`sc-expanded-img${fading ? ' sc-expanded-img--fade' : ''}`}
                />
                <button className="sc-nav sc-nav--prev" onClick={() => navigate(-1)} aria-label="আগের ছবি">{Icons.prev}</button>
                <button className="sc-nav sc-nav--next" onClick={() => navigate(1)}  aria-label="পরের ছবি">{Icons.next}</button>
                <button className="sc-close" onClick={close} aria-label="বন্ধ করুন">✕</button>
                <div className="sc-expanded-bar">
                  <span className="sc-expanded-caption">{current.caption}</span>
                  <span className="sc-expanded-counter">{active + 1} / {screenshots.length}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Founder ── */}
        <div className="founder-section" aria-label="ফাউন্ডার">
          <div className="founder-glow-wrap">
            <div className="founder-card">
              <div className="founder-img-wrap">
                <img
                  src="https://avatars.githubusercontent.com/u/112099343?v=4"
                  alt="ফাউন্ডার — Masum Billah (billahdotdev)"
                  className="founder-img"
                />
              </div>

              <div className="founder-info">
                <div className="founder-badge">ফাউন্ডার ও রেইনমেকার</div>
                <h3 className="founder-name">Masum Billah</h3>
                <p className="founder-bio">
                  ৯+ বছরের অভিজ্ঞতা, ০% ফেক প্রমিজ। সোশ্যাল মিডিয়া অ্যাডস আর ডেটা-ড্রিভেন স্ট্র্যাটেজিতে আপনার বিজনেসের রিয়েল গ্রোথ নিশ্চিত করি।
                </p>

                {/* ── EEAT Credential Chips — trust signals for users & AI crawlers ── */}
                <div className="founder-credentials" aria-label="সার্টিফিকেশন ও যোগ্যতা">
                  <span className="founder-cred founder-cred--ai" title="ML & AI Specialist — NINA, Korea">
                    {Icons.shield}&nbsp;ML &amp; AI Specialist
                    <span className="founder-cred-sub">NINA, Korea</span>
                  </span>
                  <span className="founder-cred founder-cred--dev" title="Full Stack Web Developer — BUET & IAC">
                    {Icons.check}&nbsp;Full Stack Web Dev
                    <span className="founder-cred-sub">BUET &amp; IAC</span>
                  </span>
                  <span className="founder-cred founder-cred--mktg" title="Marketing Expert — AMA Philippines, Google & Meta">
                    {Icons.check}&nbsp;Marketing Expert
                    <span className="founder-cred-sub">AMA · Google · Meta</span>
                  </span>
                  <span className="founder-cred founder-cred--web" title="Web Mastery in Progress — University of Helsinki">
                    {Icons.progress}&nbsp;Web Mastery
                    <span className="founder-cred-sub">University of Helsinki · in progress</span>
                  </span>
                </div>

                <div className="founder-links">
                  <a
                    href="https://github.com/billahdotdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-link founder-link--x"
                    aria-label="GitHub প্রোফাইল"
                    onClick={() => handleFounderLink('GitHub')}
                  >
                    {Icons.github} billahdotdev
                  </a>
                  <a
                    href="https://billah.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="founder-link founder-link--web"
                    aria-label="ব্যক্তিগত ওয়েবসাইট"
                    onClick={() => handleFounderLink('billah.dev')}
                  >
                    {Icons.globe} billah.dev
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
