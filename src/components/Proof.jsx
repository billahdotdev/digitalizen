import { useState, useEffect, useRef, useCallback } from 'react'
import './Proof.css'

function useSpringHeight(open, ref) {
  const [h, setH] = useState(0)
  const raf = useRef(null)
  const s = useRef({ pos: 0, vel: 0 })
  const tgt = useCallback(() => (!open ? 0 : ref.current?.scrollHeight ?? 0), [open, ref])

  useEffect(() => {
    const tick = () => {
      const t = tgt(), { pos, vel } = s.current
      const a = -280 * (pos - t) - 28 * vel
      const nv = vel + a / 60, np = pos + nv / 60
      const ok = Math.abs(np - t) < 0.4 && Math.abs(nv) < 0.4
      s.current = ok ? { pos: t, vel: 0 } : { pos: np, vel: nv }
      setH(Math.max(0, s.current.pos))
      if (!ok) raf.current = requestAnimationFrame(tick)
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [open, tgt])

  useEffect(() => {
    if (!open || !ref.current) return
    const ro = new ResizeObserver(() => {
      const v = ref.current?.scrollHeight ?? 0
      s.current = { pos: v, vel: 0 }; setH(v)
    })
    ro.observe(ref.current); return () => ro.disconnect()
  }, [open, ref])

  return h
}

const GoogleLogoHero = () => (
  <svg viewBox="0 0 44 44" className="pg-logo-svg" aria-hidden="true">
    <circle cx="22" cy="22" r="22" fill="#fff"/>
    <path d="M33.2 22.3c0-.7-.06-1.4-.18-2.07H22v3.92h6.32c-.27 1.36-1.1 2.52-2.34 3.3v2.74h3.79c2.22-2.04 3.44-5.05 3.44-7.89z" fill="#4285F4"/>
    <path d="M22 34c3.18 0 5.85-.95 7.8-2.58l-3.8-2.94c-1.05.71-2.4 1.12-4 1.12-3.07 0-5.67-2.07-6.6-4.86H11.5v3.02A11.98 11.98 0 0022 34z" fill="#34A853"/>
    <path d="M15.4 24.74A7.15 7.15 0 0115.04 22c0-.96.17-1.9.36-2.74V16.2h-3.9A12 12 0 0010 22c0 1.93.47 3.77 1.5 5.36l3.9-2.62z" fill="#FBBC05"/>
    <path d="M22 14.9c1.74 0 3.3.6 4.53 1.77l3.4-3.4C27.85 11.34 25.18 10 22 10a12 12 0 00-10.5 6.2l3.9 2.94c.93-2.8 3.53-4.24 6.6-4.24z" fill="#EA4335"/>
  </svg>
)
const MetaLogoHero = () => (
  <svg viewBox="0 0 44 44" className="pg-logo-svg" aria-hidden="true">
    <circle cx="22" cy="22" r="22" fill="#1877F2"/>
    <path d="M24.6 23.5h3l.57-3.7H24.6v-2.1c0-1.02.5-2 2.1-2h1.62V12.4s-1.47-.25-2.87-.25c-2.93 0-4.85 1.78-4.85 5v2.65H17.5v3.7h3.1V33h4z" fill="#fff"/>
  </svg>
)
const TikTokLogoHero = () => (
  <svg viewBox="0 0 44 44" className="pg-logo-svg" aria-hidden="true">
    <circle cx="22" cy="22" r="22" fill="#010101"/>
    <path d="M25 10.5h3.3a5.6 5.6 0 003.8 5.2v3.3a8.9 8.9 0 01-5.3-1.7v7.5A6.2 6.2 0 1121 18.3v3.4a2.8 2.8 0 102.4 2.75V10.5z" fill="#69C9D0"/>
    <path d="M23.5 10.5h3.3a5.6 5.6 0 003.8 5.2v3.3a8.9 8.9 0 01-5.3-1.7v7.5A6.2 6.2 0 1119.5 18.3v3.4a2.8 2.8 0 102.4 2.75V10.5z" fill="#fff"/>
    <path d="M23.5 10.5h3.3a5.6 5.6 0 003.8 5.2v3.3a8.9 8.9 0 01-5.3-1.7v7.5A6.2 6.2 0 1119.5 18.3v3.4a2.8 2.8 0 102.4 2.75V10.5z" fill="#EE1D52" opacity="0.35"/>
  </svg>
)

const I = {
  chevron: (<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  up:      (<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 9L6 3l4 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  down:    (<svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 3l4 6 4-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  link:    (<svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M9 2h3v3M12 2L7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  api:     (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M3 8h7M3 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.4"/></svg>),
  pixel:   (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/></svg>),
  fb:      (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>),
  google:  (<svg width="11" height="11" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>),
  tiktok:  (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>),
}

function Sparkline({ data, color = '#1F4BFF', w = 72, h = 28 }) {
  if (!data?.length) return null
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - mn) / rng) * (h - 4) - 2
    return x.toFixed(1) + ',' + y.toFixed(1)
  })
  const gid = 'sp' + Math.random().toString(36).slice(2)
  const last = pts[pts.length - 1].split(',')
  return (
    <svg width={w} height={h} viewBox={'0 0 ' + w + ' ' + h} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={'0,' + h + ' ' + pts.join(' ') + ' ' + w + ',' + h} fill={'url(#' + gid + ')'}/>
      <polyline points={pts.join(' ')} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="2.8" fill={color}/>
    </svg>
  )
}

function BarChart({ before, after, label, color, unit }) {
  unit = unit || ''
  const mx = Math.max(before, after) * 1.25
  const bH = Math.round((before / mx) * 56)
  const aH = Math.round((after / mx) * 56)
  const ac = after < before ? '#16a34a' : color
  return (
    <div className="pc-bar">
      <div className="pc-bar__cols">
        <div className="pc-bar__col">
          <div className="pc-bar__fill pc-bar__fill--muted" style={{ height: bH }}/>
          <span className="pc-bar__val">{before}{unit}</span>
          <span className="pc-bar__lbl">Before</span>
        </div>
        <div className="pc-bar__col">
          <div className="pc-bar__fill" style={{ height: aH, background: ac }}/>
          <span className="pc-bar__val" style={{ color: ac }}>{after}{unit}</span>
          <span className="pc-bar__lbl">After</span>
        </div>
      </div>
      <span className="pc-bar__title">{label}</span>
    </div>
  )
}

function AreaTrend({ data, weeks, color, label }) {
  const W = 220, H = 58
  const mn = Math.min(...data), mx = Math.max(...data), rng = mx - mn || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - mn) / rng) * (H - 8) - 4
    return x.toFixed(1) + ',' + y.toFixed(1)
  })
  const gid = 'at' + Math.random().toString(36).slice(2)
  return (
    <div className="pc-trend">
      <div className="pc-trend__head">
        <span className="pc-trend__label">{label}</span>
        <span className="pc-trend__peak" style={{ color }}>{Math.max(...data).toLocaleString()}</span>
      </div>
      <svg width="100%" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" fill="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={'0,' + H + ' ' + pts.join(' ') + ' ' + W + ',' + H} fill={'url(#' + gid + ')'}/>
        <polyline points={pts.join(' ')} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {weeks && (
        <div className="pc-trend__weeks">
          {weeks.map((w, i) => <span key={i}>{w}</span>)}
        </div>
      )}
    </div>
  )
}

function Funnel({ steps, color }) {
  const max = steps[0].val
  return (
    <div className="pc-funnel">
      <span className="pc-funnel__title">Conversion Funnel</span>
      {steps.map((s, i) => (
        <div key={i} className="pc-funnel__row">
          <span className="pc-funnel__lbl">{s.label}</span>
          <div className="pc-funnel__track">
            <div className="pc-funnel__fill" style={{
              width: Math.round((s.val / max) * 100) + '%',
              background: color,
              opacity: 1 - i * 0.16
            }}/>
          </div>
          <span className="pc-funnel__val">{s.val.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

const proofs = [
  {
    id: 'fashion', client: 'ফ্যাশন ব্র্যান্ড', sector: 'E-Commerce · Fashion',
    platform: 'meta', platformLabel: 'Meta Ads',
    color: '#1877f2', colorBg: '#e7f0fd',
    headline: 'মাইক্রো টেস্ট থেকে দেশজুড়ে স্কেল — ৬ সপ্তাহে',
    imgSrc: './neo1.png', imgAlt: 'Meta Ads Manager dashboard — Fashion Brand',
    kpi: '৪.২×', kpiSub: 'ROAS',
    sparkData: [1.2,2.1,2.8,3.5,4.2],
    metrics: [
      { val: '+৩২০%', label: 'মাসিক অর্ডার', dir: 1  },
      { val: '৳৫০K',  label: 'মাসিক বাজেট', dir: 0  },
      { val: '−৩৮%',  label: 'CPC হ্রাস',    dir: -1 },
    ],
    barCharts: [
      { before: 1.2, after: 4.2, label: 'ROAS', unit: '×' },
      { before: 100, after: 62,  label: 'CPC Index' },
    ],
    pixelEvents: ['ViewContent','AddToCart','Purchase'],
    apiNote: 'Facebook Marketing API — automated campaign reporting',
    apiLink: 'https://developers.facebook.com/docs/marketing-api/',
    before: 'ছোট বাজেটে মাইক্রো টেস্ট দিয়ে শুরু, স্কেল করার পথ অস্পষ্ট ছিল।',
    challenge: 'বাজেট অপচয় না করে দ্রুত স্কেল ও সঠিক অডিয়েন্স খুঁজে বের করা।',
    solution: 'সাপ্তাহিক A/B টেস্ট + Lookalike লেয়ারিং + বাজেট অটোমেশন।',
    result: '৪.২× ROAS, ৫০+ অর্ডার/মাস, CPC ৩৮% হ্রাস।',
    testimonial: 'এত দ্রুত স্কেল হবে ভাবিনি — ৬ সপ্তাহেই পুরো বাজেট জায়গামতো।',
    trendData: [12,18,24,32,38,48,54], trendWeeks: ['W1','W2','W3','W4','W5','W6','W7'], trendLabel: 'Weekly Orders',
    funnel: [{label:'Reach',val:420000},{label:'Clicks',val:18400},{label:'Add to Cart',val:3200},{label:'Purchase',val:1080}],
  },
  {
    id: 'food', client: 'ফুড ডেলিভারি', sector: 'Food & Beverage · Local',
    platform: 'google', platformLabel: 'Google Ads',
    color: '#34a853', colorBg: '#eaf7ed',
    headline: 'CTR দ্বিগুণ, CPC ৪৫% কমেছে — সাপ্তাহিক টেস্টে',
    imgSrc: './neo2.png', imgAlt: 'Google Ads dashboard — Food Delivery campaign',
    kpi: '+৩২০%', kpiSub: 'Order Growth',
    sparkData: [0.8,1.4,2.0,2.6,3.2],
    metrics: [
      { val: '২×',    label: 'CTR বৃদ্ধি',        dir: 1  },
      { val: '৳২০K',  label: 'সাপ্তাহিক বাজেট', dir: 0  },
      { val: '−৪৫%',  label: 'CPC হ্রাস',         dir: -1 },
    ],
    barCharts: [
      { before: 2.1, after: 4.8, label: 'CTR (%)', unit: '%' },
      { before: 100, after: 55,  label: 'CPC Index' },
    ],
    pixelEvents: ['page_view','purchase','add_to_cart'],
    apiNote: 'Google Ads API — keyword-level bid optimization',
    apiLink: 'https://developers.google.com/google-ads/api/docs/start',
    before: 'সীমিত অর্ডার, একই ক্রিয়েটিভ মাসের পর মাস চলছিল।',
    challenge: 'প্রতিযোগিতামূলক মার্কেটে মনোযোগ আকর্ষণ ও CPC কমানো।',
    solution: 'সাপ্তাহিক ক্রিয়েটিভ রিফ্রেশ + Smart Bidding + GTM/GA4।',
    result: 'CTR ২×, CPC ৪৫% হ্রাস, মাসিক অর্ডার ৩২০% বেড়েছে।',
    testimonial: 'ক্রিয়েটিভ টেস্টের পর অর্ডার আকাশচুম্বী — এটা আমাদের টার্নিং পয়েন্ট।',
    trendData: [38,45,62,88,105,122,142], trendWeeks: ['W1','W2','W3','W4','W5','W6','W7'], trendLabel: 'Weekly Conversions',
    funnel: [{label:'Impressions',val:680000},{label:'Clicks',val:32600},{label:'Landing',val:18200},{label:'Order',val:4280}],
  },
  {
    id: 'course', client: 'অনলাইন কোর্স', sector: 'EdTech · Online Learning',
    platform: 'meta', platformLabel: 'Meta Ads',
    color: '#7c3aed', colorBg: '#f3eeff',
    headline: 'স্মার্ট রিটার্গেটিংয়ে CPA ৬০% কমেছে',
    imgSrc: './neo3.png', imgAlt: 'Meta Ads — Online Course retargeting dashboard',
    kpi: '−৬০%', kpiSub: 'Cost Per Acquisition',
    sparkData: [100,82,65,50,40],
    metrics: [
      { val: '+১৮০%', label: 'এনরোলমেন্ট',   dir: 1  },
      { val: '৳৩০K',  label: 'মাসিক বাজেট', dir: 0  },
      { val: '−৬০%',  label: 'CPA হ্রাস',    dir: -1 },
    ],
    barCharts: [
      { before: 100, after: 40,  label: 'CPA Index' },
      { before: 45,  after: 126, label: 'Enrollments' },
    ],
    pixelEvents: ['Lead','CompleteRegistration','Purchase'],
    apiNote: 'Meta Pixel + Custom Conversion API — funnel tracking',
    apiLink: 'https://developers.facebook.com/docs/meta-pixel/',
    before: 'CPA অনেক বেশি, সীমিত বাজেটে বেশি এনরোলমেন্ট দরকার ছিল।',
    challenge: 'উচ্চ-মানের লিড আনা ও একই বাজেটে এনরোলমেন্ট বাড়ানো।',
    solution: 'Lookalike + মাল্টি-স্টেজ রিটার্গেটিং + Pixel CompleteRegistration।',
    result: 'CPA ৬০% কমেছে, এনরোলমেন্ট ১৮০% বেড়েছে।',
    testimonial: 'রিটার্গেটিং সেটআপের পর আমাদের সবচেয়ে ভালো স্টুডেন্টরা এসেছে।',
    trendData: [18,22,28,36,44,56,72], trendWeeks: ['W1','W2','W3','W4','W5','W6','W7'], trendLabel: 'Weekly Enrollments',
    funnel: [{label:'Reach',val:310000},{label:'Clicks',val:14200},{label:'Lead Form',val:3800},{label:'Registration',val:1260}],
  },
  {
    id: 'lifestyle', client: 'লাইফস্টাইল ব্র্যান্ড', sector: 'D2C · Lifestyle',
    platform: 'tiktok', platformLabel: 'TikTok Ads',
    color: '#fe2c55', colorBg: '#fff0f3',
    headline: 'ভাইরাল ক্রিয়েটিভে ২৮৪K ভিউ, CPA মাত্র ৳৪৫',
    imgSrc: './neo3.png', imgAlt: 'TikTok Ads Manager — Lifestyle Brand viral campaign',
    kpi: '৬.২%', kpiSub: 'Click-Through Rate',
    sparkData: [0.9,1.8,3.2,4.8,6.2],
    metrics: [
      { val: '+৩১২%', label: 'মাসিক বিক্রি',  dir: 1  },
      { val: '৳৪০K',  label: 'মাসিক বাজেট', dir: 0  },
      { val: '৳৪৫',   label: 'CPA মাত্র',    dir: -1 },
    ],
    barCharts: [
      { before: 1.4, after: 6.2, label: 'CTR (%)', unit: '%' },
      { before: 180, after: 45,  label: 'CPA (৳)' },
    ],
    pixelEvents: ['ViewContent','AddToCart','Purchase'],
    apiNote: 'TikTok Marketing API — automated creative rotation',
    apiLink: 'https://ads.tiktok.com/marketing_api/docs',
    before: 'Instagram-নির্ভর, TikTok-এ কোনো উপস্থিতি ছিল না।',
    challenge: 'Gen-Z অডিয়েন্সে পৌঁছানো ও কম খরচে ভাইরাল ক্রিয়েটিভ তৈরি।',
    solution: 'Short-form UGC + Spark Ads + Interest + Behavioral targeting।',
    result: 'CTR ৬.২%, CPA ৳৪৫, ২৮৪K ভিউ, বিক্রি ৩১২% বৃদ্ধি।',
    testimonial: 'TikTok-এ আসার পর আমাদের ব্র্যান্ড রাতারাতি পরিচিত হয়ে গেছে।',
    trendData: [24,40,68,110,158,220,312], trendWeeks: ['W1','W2','W3','W4','W5','W6','W7'], trendLabel: 'Weekly Sales',
    funnel: [{label:'Video Views',val:284000},{label:'Profile Visits',val:42000},{label:'Clicks',val:17600},{label:'Purchase',val:3120}],
  },
]

const PM = {
  meta:   { Icon: () => I.fb,     bg: '#e7f0fd', c: '#1877f2' },
  google: { Icon: () => I.google, bg: '#fef9e7', c: '#d97706' },
  tiktok: { Icon: () => I.tiktok, bg: '#fce8ef', c: '#fe2c55' },
}

function HeroImage({ src, alt, platformLabel, headline, color }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="pc-hero">
      {!loaded && <div className="pc-hero__shimmer" style={{ '--sa': color }}/>}
      <img src={src} alt={alt} className="pc-hero__img"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        loading="lazy" decoding="async"/>
      <div className="pc-hero__grad" style={{
        background: 'linear-gradient(to top,' + color + 'ee 0%,' + color + '99 32%,' + color + '22 60%,transparent 82%)'
      }}/>
      <div className="pc-hero__text">
        <span className="pc-hero__tag">{platformLabel}</span>
        <p className="pc-hero__hl">{headline}</p>
      </div>
    </div>
  )
}

function ProofCard({ p, idx }) {
  const [lv, setLv] = useState(0)
  const pm = PM[p.platform]
  const toggle     = () => setLv(v => v === 0 ? 1 : 0)
  const toggleDeep = () => setLv(v => v === 1 ? 2 : 1)

  return (
    <article className={'pc-card' + (lv > 0 ? ' pc-card--open' : '')}>

      <button className="pc-header" onClick={toggle} aria-expanded={lv > 0}>
        <span className="pc-header__num" style={{ color: p.color, background: p.color + '14' }}>০{idx+1}</span>
        <div className="pc-header__body">
          <div className="pc-header__top">
            <span className="pc-header__client">{p.client}</span>
            <span className="pc-badge" style={{ background: pm.bg, color: pm.c }}>
              <pm.Icon/>{p.platformLabel}
            </span>
            <span className="pc-header__sector">{p.sector}</span>
          </div>
          <p className="pc-header__hl">{p.headline}</p>
        </div>
        <div className="pc-header__kpi">
          <span className="pc-kpi" style={{ color: p.color }}>{p.kpi}</span>
          <span className="pc-kpi-sub">{p.kpiSub}</span>
          <Sparkline data={p.sparkData} color={p.color}/>
        </div>
        <span className={'pc-chevron' + (lv > 0 ? ' pc-chevron--open' : '')} aria-hidden="true">{I.chevron}</span>
      </button>

      {lv >= 1 && (
        <div className="pc-body">
          <HeroImage src={p.imgSrc} alt={p.imgAlt} platformLabel={p.platformLabel} headline={p.headline} color={p.color}/>

          <div className="pc-metrics">
            {p.metrics.map((m, i) => (
              <div key={i} className="pc-metric">
                <div className="pc-metric__bar" style={{ background: p.color }}/>
                <span className="pc-metric__val" style={{ color: m.dir===1 ? p.color : m.dir===-1 ? '#16a34a' : 'var(--text)' }}>
                  {m.dir===1 && <span className="pc-metric__arr">{I.up}</span>}
                  {m.dir===-1 && <span className="pc-metric__arr">{I.down}</span>}
                  {m.val}
                </span>
                <span className="pc-metric__label">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="pc-barcharts">
            {p.barCharts.map((bc, i) => (
              <BarChart key={i} before={bc.before} after={bc.after} label={bc.label} unit={bc.unit} color={p.color}/>
            ))}
          </div>

          <div className="pc-chips-row">
            <span className="pc-chips-label">{I.pixel} Tracked Events</span>
            <div className="pc-chips">
              {p.pixelEvents.map(ev => (
                <span key={ev} className="pc-chip" style={{ background: p.color+'10', color: p.color, borderColor: p.color+'30' }}>{ev}</span>
              ))}
            </div>
          </div>

          <button className="pc-expand-btn" onClick={toggleDeep} style={{ '--c': p.color }}>
            <span>{lv===1 ? 'সম্পূর্ণ কেস স্টাডি দেখুন' : 'সংক্ষিপ্ত করুন'}</span>
            <span className={'pc-chevron' + (lv===2 ? ' pc-chevron--open' : '')} aria-hidden="true">{I.chevron}</span>
          </button>
        </div>
      )}

      {lv >= 2 && (
        <div className="pc-deep">
          <div className="pc-deep__grid">
            <div className="pc-story">
              <p className="pc-story__title">কেস স্টাডি ফ্লো</p>
              <div className="pc-story__steps">
                {[
                  { n:'১', tag:'Before',    txt: p.before    },
                  { n:'২', tag:'Challenge', txt: p.challenge },
                  { n:'৩', tag:'Solution',  txt: p.solution  },
                  { n:'৪', tag:'Result',    txt: p.result    },
                ].map(({ n, tag, txt }) => (
                  <div key={n} className="pc-story__step">
                    <div className="pc-story__dot" style={{ background: p.color }}>{n}</div>
                    <div className="pc-story__content">
                      <span className="pc-story__tag" style={{ color: p.color }}>{tag}</span>
                      <p className="pc-story__txt">{txt}</p>
                    </div>
                  </div>
                ))}
              </div>
              <a href={p.apiLink} target="_blank" rel="noopener noreferrer" className="pc-api" style={{ '--c': p.color }}>
                <span className="pc-api__icon" style={{ background: p.color+'14', color: p.color }}>{I.api}</span>
                <div className="pc-api__body">
                  <span className="pc-api__label">API Integration</span>
                  <span className="pc-api__note">{p.apiNote}</span>
                </div>
                <span className="pc-api__link">{I.link}</span>
              </a>
            </div>
            <div className="pc-charts-col">
              <AreaTrend data={p.trendData} weeks={p.trendWeeks} color={p.color} label={p.trendLabel}/>
              <Funnel steps={p.funnel} color={p.color}/>
            </div>
          </div>
          {p.testimonial && (
            <div className="pc-quote" style={{ borderLeftColor: p.color }}>
              <span className="pc-quote__mark" style={{ color: p.color }}>&#10077;</span>
              <p className="pc-quote__text">{p.testimonial}</p>
              <span className="pc-quote__cite">&#8212; {p.client} ক্লায়েন্ট</span>
            </div>
          )}
        </div>
      )}

    </article>
  )
}

const GATE_PLATFORMS = [
  { id: 'google', Logo: GoogleLogoHero, name: 'Google Ads', stat: '4.8% CTR'  },
  { id: 'meta',   Logo: MetaLogoHero,   name: 'Meta Ads',   stat: '4.2× ROAS' },
  { id: 'tiktok', Logo: TikTokLogoHero, name: 'TikTok Ads', stat: '6.2% CTR'  },
]

export default function ProofGate() {
  const [open, setOpen] = useState(false)
  const [vis,  setVis]  = useState(false)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const springH    = useSpringHeight(open, contentRef)

  useEffect(() => {
    if (open) { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t) }
    setVis(false)
  }, [open])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting && e.intersectionRatio === 0) setOpen(false) },
      { threshold: 0 }
    )
    io.observe(el); return () => io.disconnect()
  }, [])

  const toggle = useCallback(() => setOpen(o => !o), [])

  return (
    <section ref={sectionRef} id="proof" className="pg-section">
      <div className="container">
        <div className={'pg-card' + (open ? ' pg-card--open' : '')}>
          <button className="pg-trigger" onClick={toggle} aria-expanded={open} aria-controls="pg-body">
            <div className="pg-trigger__copy">
              <div className="pg-eyebrow"><span className="pg-pulse" aria-hidden="true"/>Case Studies</div>
              <h2 className="pg-heading">কেস স্টাডি ও ফলাফল</h2>
              <p className="pg-sub">{proofs.length}টি রিয়েল ক্যাম্পেইন · API-যাচাইকৃত ডেটা</p>
            </div>
            <div className="pg-logos" role="list" aria-label="Ad platforms">
              {GATE_PLATFORMS.map(({ id, Logo, name, stat }) => (
                <div key={id} className={'pg-logo-item pg-logo-item--' + id} role="listitem">
                  <Logo/><span className="pg-logo-name">{name}</span><span className="pg-logo-stat">{stat}</span>
                </div>
              ))}
            </div>
            <div className={'pg-chevron' + (open ? ' pg-chevron--open' : '')} aria-hidden="true">{I.chevron}</div>
          </button>
          <div id="pg-body" className="pg-body" style={{ height: springH, overflow: 'hidden' }} aria-hidden={!open}>
            <div ref={contentRef} className={'pg-inner' + (vis ? ' pg-inner--visible' : '')}>
              <div className="pg-section-head">
                <div className="row-header">
                  <span className="section-num">০০৪</span>
                  <span className="section-title-right">প্রুফ</span>
                </div>
                <p className="proof-note">রিয়েল ক্যাম্পেইন ডেটা — API, Pixel এবং Ads Manager থেকে যাচাইকৃত।</p>
              </div>
              <div className="pc-list">
                {proofs.map((p, i) => <ProofCard key={p.id} p={p} idx={i}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
