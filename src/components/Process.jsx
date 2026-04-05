import { useState, useEffect, useRef, useCallback } from 'react'
import './Process.css'
import { track, WA_NUMBER } from '../lib/analytics.js'
import { CS_META, CS_TABLE, CS_PROCESS } from '../lib/caseStudyData.js'

/* ══════════════════════════════════════════════════
   ICONS — zero-dep inline SVG
══════════════════════════════════════════════════ */
const Icon = {
  arrowR: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowD: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  ),
  wa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
  check: (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  play: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  expand: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  ),
  prev: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  next: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
}

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const STATS = [
  { num: '৩০০%', label: 'সেলস বৃদ্ধি' },
  { num: '৫০%',  label: 'বাজেট সাশ্রয়' },
  { num: '৪.৮×', label: 'ROAS' },
  { num: '১২%+', label: 'Conv. Rate' },
]

const PILLARS = [
  {
    id: '01',
    tag: 'The Conversion Engine',
    titleBn: 'ল্যান্ডিং পেজ',
    titleEn: 'Landing Page',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    before: {
      era: 'Manual Era', hook: 'ক্লিক করল, কিন্তু কিনল না।',
      body: 'পেজ লোড ৬ সেকেন্ড। ডিজাইন হিজিবিজি, CTA অস্পষ্ট — ১০ জনের মধ্যে ৮ জন বেরিয়ে যেত।',
      stat: '২%', statLabel: 'কনভার্সন রেট',
      img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'পুরনো স্লো ওয়েবসাইট',
    },
    after: {
      era: 'Modern Era', hook: 'লোড হওয়ার আগেই কাস্টমার মুগ্ধ।',
      body: 'Vite + React দিয়ে ০.৮ সেকেন্ডে লোড। সাইকোলজিক্যাল ট্রিগার + মোবাইল-ফার্স্ট UX।',
      stat: '১২%+', statLabel: 'কনভার্সন রেট',
      img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'আধুনিক ফাস্ট ল্যান্ডিং পেজ',
    },
    insight: 'প্রতি ১ সেকেন্ড দেরিতে কনভার্সন ৭% কমে।',
    video: {
      src: 'https://www.loom.com/embed/YOUR_LOOM_VIDEO_ID',
      thumb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=75&auto=format&fit=crop',
      label: 'পুরো ট্রান্সফরমেশন দেখুন', duration: '৩ মিনিট ২২ সেকেন্ড',
    },
    cta: 'আমার ল্যান্ডিং পেজ অডিট করতে চাই',
  },
  {
    id: '02',
    tag: 'The Brain of Ads',
    titleBn: 'CAPI ট্র্যাকিং',
    titleEn: 'Server-Side Tracking',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    before: {
      era: 'Pixel Era', hook: 'আপনার ডাটার অর্ধেক উবে যাচ্ছিল।',
      body: 'iOS ১৪ + অ্যাড-ব্লকারে ৫০% কনভার্সন ডাটা গায়েব। অ্যালগরিদম অন্ধের মতো অপ্টিমাইজ করছিল।',
      stat: '৫০%', statLabel: 'ডাটা গায়েব',
      img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'ডাটা ট্র্যাকিং গ্যাপ',
    },
    after: {
      era: 'Server-Side Era', hook: 'এখন প্রতিটি ক্লিক ধরা পড়ে।',
      body: 'Server-Side CAPI সরাসরি Meta-তে পাঠায়। অ্যাড-ব্লকার বা iOS — কিছুই আর ডাটা লুকাতে পারে না।',
      stat: '১০০%', statLabel: 'Data Match Quality',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'পরিপূর্ণ ডাটা ড্যাশবোর্ড',
    },
    insight: 'ভুল ডাটায় অ্যাড চালানো মানে অন্ধকারে তীর ছোঁড়া।',
    cta: 'CAPI সেটআপ নিয়ে কথা বলতে চাই',
  },
  {
    id: '03',
    tag: 'The Precision Targeting',
    titleBn: 'মার্কেটিং ক্যাম্পেইন',
    titleEn: 'Precision Campaign',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    before: {
      era: 'Spray & Pray', hook: '"বুস্ট করলেই বিক্রি হবে" — লাখ টাকা গেছে।',
      body: 'ভুল অডিয়েন্সে অ্যাড মানে বাজেট পোড়ানো। ROAS ছিল মাত্র ব্রেক-ইভেনে।',
      stat: '১.৫×', statLabel: 'ROAS — ব্রেক-ইভেন',
      img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'অগোছালো ক্যাম্পেইন',
    },
    after: {
      era: 'Hyper-Local Era', hook: 'শুধু কিনতে-রেডি মানুষের কাছে পৌঁছাই।',
      body: 'CAPI ডাটায় Look-alike ও Retargeting। ঢাকার নির্দিষ্ট পাড়া, নির্দিষ্ট আয়ের মানুষ।',
      stat: '৪.৮×', statLabel: 'ROAS — স্কেলেবল প্রফিট',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'প্রিসিশন টার্গেটিং ড্যাশবোর্ড',
    },
    insight: 'একই বাজেটে ৩ গুণ বেশি লিড — শুধু সঠিক অডিয়েন্সের জন্য।',
    cta: 'আমার ক্যাম্পেইন রিভিউ করতে চাই',
  },
  {
    id: '04',
    tag: 'The 24/7 Salesman',
    titleBn: 'মেসেজ অটোমেশন',
    titleEn: 'AI Automation',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    before: {
      era: 'Manual Reply', hook: 'রাত ২টায় মেসেজ — সকাল পর্যন্ত চুপ।',
      body: 'ম্যানুয়াল রিপ্লাইয়ে ৪৫ মিনিট। কাস্টমার বিরক্ত হয়ে কম্পিটিটরের কাছে চলে যেত।',
      stat: '৪৫ মিনিট+', statLabel: 'গড় রেসপন্স টাইম',
      img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'ম্যানুয়াল মেসেজিং',
    },
    after: {
      era: 'AI Chatbot Era', hook: 'AI ঘুমায় না — আপনার হয়ে ২৪/৭ বিক্রি করে।',
      body: '২ সেকেন্ডে নাম ধরে রিপ্লাই। প্রশ্নের জবাব, সাজেশন, অর্ডার কনফার্মেশন — সবই চ্যাটেই।',
      stat: '২ সেকেন্ড', statLabel: 'গড় রেসপন্স টাইম',
      img: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'AI চ্যাটবট ইন্টারফেস',
    },
    insight: 'প্রতি রাতে ৩–৫টি লিড হারিয়ে যায় — AI সেগুলো ধরে রাখে।',
    cta: 'AI অটোমেশন সেটআপ করতে চাই',
  },
]

const GALLERY = [
  { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', caption: 'ক্যাম্পেইন ড্যাশবোর্ড' },
  { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', caption: 'ROAS রিপোর্ট' },
  { src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80', caption: 'অডিয়েন্স ইনসাইট' },
  { src: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80', caption: 'কনভার্সন ট্র্যাকিং' },
  { src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', caption: 'A/B টেস্ট রেজাল্ট' },
]

/* ══════════════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════════ */
function ProofGallery() {
  const [active, setActive] = useState(null)
  const [fading, setFading] = useState(false)
  const touchX              = useRef(null)

  const nav = useCallback((dir) => {
    if (active === null) return
    setFading(true)
    setTimeout(() => {
      setActive(p => (p + dir + GALLERY.length) % GALLERY.length)
      setFading(false)
    }, 160)
  }, [active])

  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    if (active === null) return
    const fn = (e) => {
      if (e.key === 'ArrowLeft')  nav(-1)
      if (e.key === 'ArrowRight') nav(1)
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [active, nav, close])

  const cur = active !== null ? GALLERY[active] : null

  return (
    <div className="pg-gallery" aria-label="ক্যাম্পেইন স্ক্রিনশট">
      <ul className="pg-strip">
        {GALLERY.map((item, i) => (
          <li key={i}>
            <button
              className={`pg-thumb${active === i ? ' pg-thumb--on' : ''}`}
              onClick={() => active === i ? close() : setActive(i)}
              aria-pressed={active === i}
              aria-label={`${item.caption} — ${active === i ? 'বন্ধ' : 'দেখুন'}`}
            >
              <div className="pg-thumb-img">
                <img src={item.src} alt="" loading="lazy" decoding="async" aria-hidden="true" />
                <div className="pg-expand" aria-hidden="true">{Icon.expand}</div>
              </div>
              <span className="pg-thumb-cap">{item.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Expanded viewer */}
      <div
        className={`pg-viewer${cur ? ' pg-viewer--open' : ''}`}
        aria-live="polite"
        onTouchStart={e => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (!touchX.current) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) nav(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        {cur && (
          <div className="pg-viewer-inner">
            <img key={active} src={cur.src} alt={cur.caption} className={fading ? 'pg-img--fade' : ''} />
            <button className="pg-nav pg-nav--l" onClick={() => nav(-1)} aria-label="আগের ছবি">{Icon.prev}</button>
            <button className="pg-nav pg-nav--r" onClick={() => nav(1)}  aria-label="পরের ছবি">{Icon.next}</button>
            <button className="pg-close"         onClick={close}          aria-label="বন্ধ করুন">✕</button>
            <div className="pg-viewer-bar">
              <span>{cur.caption}</span>
              <span className="pg-counter">{active + 1} / {GALLERY.length}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   PILLAR PANEL — shown when tab is active
══════════════════════════════════════════════════ */
function PillarPanel({ pillar, onCta }) {
  const [videoOn, setVideoOn] = useState(false)

  /* Reset video when pillar changes */
  useEffect(() => { setVideoOn(false) }, [pillar.id])

  return (
    <div className="cs-panel" role="tabpanel" id={`tab-panel-${pillar.id}`} aria-labelledby={`tab-${pillar.id}`}>

      {/* Before / After compare */}
      <div className="cs-compare">
        {/* Before */}
        <div className="cs-card cs-card--before">
          <span className="cs-era cs-era--before">{pillar.before.era}</span>
          <div className="cs-card-img">
            <img src={pillar.before.img} alt={pillar.before.imgAlt} loading="lazy" decoding="async" />
            <span className="cs-badge cs-badge--before" aria-hidden="true">আগে</span>
          </div>
          <div className="cs-card-body">
            <p className="cs-hook cs-hook--before">{pillar.before.hook}</p>
            <p className="cs-copy">{pillar.before.body}</p>
            <div className="cs-stat cs-stat--bad">
              <strong>{pillar.before.stat}</strong>
              <span>{pillar.before.statLabel}</span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="cs-arrow" aria-hidden="true">
          <span className="cs-arr-h">{Icon.arrowR}</span>
          <span className="cs-arr-v">{Icon.arrowD}</span>
        </div>

        {/* After */}
        <div className="cs-card cs-card--after">
          <span className="cs-era cs-era--after">{pillar.after.era}</span>
          <div className="cs-card-img">
            <img src={pillar.after.img} alt={pillar.after.imgAlt} loading="lazy" decoding="async" />
            <span className="cs-badge cs-badge--after" aria-hidden="true">এখন</span>
          </div>
          <div className="cs-card-body">
            <p className="cs-hook cs-hook--after">{pillar.after.hook}</p>
            <p className="cs-copy">{pillar.after.body}</p>
            <div className="cs-stat cs-stat--good">
              <strong>{pillar.after.stat}</strong>
              <span>{pillar.after.statLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video — pillar 01 only */}
      {pillar.video && (
        <div className="cs-video">
          {!videoOn ? (
            <button
              className="cs-video-thumb"
              onClick={() => setVideoOn(true)}
              aria-label={`ভিডিও চালান — ${pillar.video.label}`}
            >
              <img src={pillar.video.thumb} alt={pillar.video.label} loading="lazy" decoding="async" />
              <div className="cs-video-overlay">
                <div className="cs-play-ring" aria-hidden="true">{Icon.play}</div>
                <span className="cs-video-label">{pillar.video.label}</span>
                <span className="cs-video-dur">{pillar.video.duration}</span>
              </div>
            </button>
          ) : (
            <div className="cs-video-frame">
              <iframe
                src={`${pillar.video.src}?autoplay=1`}
                title={pillar.video.label}
                allow="autoplay; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}

      {/* Insight */}
      <div className="cs-insight" role="note">
        <div className="cs-insight-bar" aria-hidden="true" />
        <p className="cs-insight-text">"{pillar.insight}"</p>
      </div>

      {/* WhatsApp CTA */}
      <button
        className="cs-pillar-cta"
        onClick={() => onCta(pillar)}
        aria-label={`WhatsApp-এ — ${pillar.cta}`}
      >
        {Icon.wa}
        <span>{pillar.cta}</span>
        {Icon.arrowR}
      </button>
      <p className="cs-pillar-fine">কোনো বাধ্যবাধকতা নেই · পরামর্শ বিনামূল্যে</p>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════ */
export default function Process() {
  const sectionRef  = useRef(null)
  const firedRef    = useRef(false)
  const [entered, setEntered]   = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const tabListRef  = useRef(null)

  /* IO — enter detection */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current = true
        setEntered(true)
        track('ViewContent', { content_name: 'Case Study Section', content_category: 'Section' }, 'case_study')
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'section_view', section: 'case_study' })
      }
    }, { threshold: 0.07 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Track tab changes */
  const handleTab = useCallback((i) => {
    setActiveTab(i)
    track('ViewContent', { content_name: `Pillar Tab: ${PILLARS[i].titleBn}`, content_category: 'Tab' }, 'case_study')
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'tab_view', tab_label: PILLARS[i].titleEn })
  }, [])

  /* Keyboard nav on tab list */
  const handleTabKey = useCallback((e, i) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (i + 1) % PILLARS.length
      handleTab(next)
      tabListRef.current?.querySelectorAll('[role="tab"]')[next]?.focus()
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (i - 1 + PILLARS.length) % PILLARS.length
      handleTab(prev)
      tabListRef.current?.querySelectorAll('[role="tab"]')[prev]?.focus()
    }
  }, [handleTab])

  const handlePillarCta = useCallback((pillar) => {
    const msg = `হ্যালো Digitalizen, আমি "${pillar.titleBn}" সম্পর্কে জানতে চাই।`
    const event_id = `cs_cta_${Date.now()}`
    window.fbq?.('track', 'Lead', { content_name: pillar.titleBn, currency: 'BDT' }, { eventID: event_id })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'cta_click', cta_location: 'pillar', pillar: pillar.titleEn, meta_event_id: event_id })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer')
  }, [])

  const handleFinalCta = useCallback(() => {
    const event_id = `cs_final_${Date.now()}`
    window.fbq?.('track', 'Lead', { content_name: 'Case Study Final CTA', currency: 'BDT', value: 0 }, { eventID: event_id })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'cta_click', cta_location: 'case_study_final', cta_label: 'free_roadmap', meta_event_id: event_id })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো Digitalizen, আমি ফ্রি রোডম্যাপ চাই।')}`, '_blank', 'noreferrer')
  }, [])

  return (
    <section
      id="case-study"
      ref={sectionRef}
      className={`cs${entered ? ' cs--entered' : ''}`}
      aria-label="কেস স্টাডি — রিয়েল ট্রান্সফরমেশন"
    >
      {/* Cross-hatch texture */}
      <div className="cs-texture" aria-hidden="true" />

      <div className="container">

        {/* ── Section header ── */}
        <div className="row-header cs-r cs-r--1">
          <span className="section-num">০০২</span>
          <span className="section-title-right">রিয়েল কেস স্টাডি</span>
        </div>

        {/* ══ HOOK ══ */}
        <div className="cs-hook cs-r cs-r--2">
          <p className="cs-tag-mono" aria-hidden="true">{CS_META.tag}</p>

          <h2 className="cs-headline">
            মার্কেটিং বাজেট{' '}
            <span className="cs-hl cs-hl--green">৫০% সাশ্রয়,</span>
            <br />
            সেলস <span className="cs-hl cs-hl--blue">৩০০% বৃদ্ধি।</span>
          </h2>

          <p className="cs-subhead">{CS_META.subhead}</p>

          {/* Stats chips */}
          <div className="cs-stats" role="list" aria-label="মূল ফলাফল">
            {STATS.map((s, i) => (
              <div key={i} className="cs-stat-chip" role="listitem">
                <span className="cs-stat-num">{s.num}</span>
                <span className="cs-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CAMPAIGN PROOF ══ */}
        <div className="cs-proof cs-r cs-r--3">
          <div className="cs-rule" role="separator" aria-hidden="true">
            <span>ক্যাম্পেইন প্রমাণ</span>
          </div>

          <div className="cs-proof-meta">
            <div>
              <p className="cs-proof-label">Ads Manager থেকে সরাসরি</p>
              <div className="cs-proof-pills" aria-label="প্রমাণের ধরন">
                {['ক্যাম্পেইন ড্যাশবোর্ড','ROAS রিপোর্ট','অডিয়েন্স ইনসাইট','কনভার্সন ট্র্যাকিং','A/B টেস্ট'].map((p, i) => (
                  <span key={i} className="cs-proof-pill">
                    <span className="cs-pill-dot" aria-hidden="true" />{p}
                  </span>
                ))}
              </div>
            </div>
            <span className="cs-live" aria-label="চলমান ডাটা">
              <span className="cs-live-dot" aria-hidden="true" />
              Real Results
            </span>
          </div>

          <ProofGallery />
        </div>

        {/* ══ TAB-DRIVEN 4-PILLAR STORY ══ */}
        <div className="cs-story cs-r cs-r--4">
          <div className="cs-rule" role="separator" aria-hidden="true">
            <span>৪-লেয়ার ট্রান্সফরমেশন</span>
          </div>

          {/* Tab list — horizontal scroll, thumb-friendly */}
          <div
            className="cs-tabs"
            role="tablist"
            aria-label="ট্রান্সফরমেশন পিলার"
            ref={tabListRef}
          >
            {/* Active indicator bar */}
            <div
              className="cs-tab-indicator"
              style={{ '--tab-i': activeTab, '--tab-count': PILLARS.length }}
              aria-hidden="true"
            />
            {PILLARS.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={activeTab === i}
                aria-controls={`tab-panel-${p.id}`}
                className={`cs-tab${activeTab === i ? ' cs-tab--active' : ''}`}
                onClick={() => handleTab(i)}
                onKeyDown={e => handleTabKey(e, i)}
                tabIndex={activeTab === i ? 0 : -1}
              >
                <span className="cs-tab-num" aria-hidden="true">{p.id}</span>
                <span className="cs-tab-label">{p.titleBn}</span>
                <span className="cs-tab-en" aria-hidden="true">{p.titleEn}</span>
              </button>
            ))}
          </div>

          {/* Panel */}
          <PillarPanel pillar={PILLARS[activeTab]} onCta={handlePillarCta} />
        </div>

        {/* ══ MONEY TABLE ══ */}
        <div className="cs-table-section cs-r cs-r--5">
          <div className="cs-rule" role="separator" aria-hidden="true">
            <span>সংখ্যায় তুলনা</span>
          </div>
          <p className="cs-table-eyebrow">আগে বনাম পরে — রিয়েল ক্লায়েন্ট ডাটা</p>

          <div className="cs-table-wrap" role="region" aria-label="ফলাফল তুলনা সারণি" tabIndex={0}>
            <table className="cs-table">
              <thead>
                <tr>
                  {CS_TABLE.cols.map((c, i) => <th key={i} scope="col">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {CS_TABLE.rows.map((r, i) => (
                  <tr key={i} className={r.highlight ? 'cs-row--hi' : ''}>
                    <td>{r.metric}</td>
                    <td className="cs-td--before">{r.before}</td>
                    <td className="cs-td--after">{r.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ 4-STEP BLUEPRINT ══ */}
        <div className="cs-blueprint cs-r cs-r--6">
          <div className="cs-rule" role="separator" aria-hidden="true">
            <span>আমাদের প্রসেস</span>
          </div>
          <p className="cs-blueprint-intro">
            কোনো জাদু নেই — শুধু একটা সিস্টেম্যাটিক <strong>৪-স্টেপ প্রসেস।</strong>
          </p>

          <ol className="cs-steps">
            {CS_PROCESS.map((step, i) => (
              <li key={i} className="cs-step">
                <div className="cs-step-num" aria-hidden="true">{step.num}</div>
                <div className="cs-step-body">
                  <div className="cs-step-head">
                    <strong className="cs-step-title">{step.title}</strong>
                    <span className="cs-step-sub">{step.sub}</span>
                  </div>
                  <p className="cs-step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ══ FINAL CTA — distinct diagonal dark panel ══ */}
        <div className="cs-final-cta cs-r cs-r--7">
          {/* Grid texture inside dark panel */}
          <div className="cs-cta-texture" aria-hidden="true" />
          {/* Pulsing ring decorative */}
          <div className="cs-cta-ring" aria-hidden="true">
            <div className="cs-ring cs-ring--1" />
            <div className="cs-ring cs-ring--2" />
            <div className="cs-ring cs-ring--3" />
          </div>

          <div className="cs-cta-content">
            <p className="cs-cta-tag">// এখনই শুরু করুন</p>
            <h2 className="cs-cta-q">
              আপনার ব্যবসাও কি ভুল ডাটা আর
              <br />ব্যাকডেটেড সিস্টেমে আটকে আছে?
            </h2>
            <p className="cs-cta-body">
              আমরা আপনার বিজনেসের জন্য একটি কাস্টম{' '}
              <strong>AI ও ডাটা-ড্রিভেন রোডম্যাপ</strong> তৈরি করে দেব — একদম ফ্রি।
            </p>

            <button
              type="button"
              className="cs-cta-btn"
              onClick={handleFinalCta}
              aria-label="WhatsApp-এ ফ্রি রোডম্যাপ নিন"
            >
              {Icon.wa}
              <span>গেট মাই ফ্রি রোডম্যাপ — আজই সংগ্রহ করুন</span>
              {Icon.arrowR}
            </button>

            <p className="cs-cta-trust">সম্পূর্ণ বিনামূল্যে · কোনো কমিটমেন্ট নেই · ২৪ ঘণ্টার মধ্যে রেসপন্স</p>
          </div>
        </div>

      </div>
    </section>
  )
}
