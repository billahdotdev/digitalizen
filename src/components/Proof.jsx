import { useState } from 'react'
import './Proof.css'

/* ══════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════ */
const Icon = {
  trend: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 11.5l4-4.5 3 3L14 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 4h3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trendDown: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M2 4.5l4 4.5 3-3L14 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 12h3v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pixel: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  api: (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path d="M3 5h10M3 8h7M3 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    </svg>
  ),
  quote: (
    <svg width="16" height="13" viewBox="0 0 20 16" fill="none">
      <path d="M1 7.5C1 4.46 3.46 2 6.5 2c1.5 0 2.5.5 2.5.5S7.5 4 7.5 6.5c0 1.93 1.57 3.5 3.5 3.5v4C5.25 14 1 10.64 1 7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M11 7.5c0-3.04 2.46-5.5 5.5-5.5 1.5 0 2.5.5 2.5.5S17.5 4 17.5 6.5c0 1.93 1.57 3.5 3.5 3.5v4C15.25 14 11 10.64 11 7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  ),
  chevron: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  link: (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
      <path d="M6 3H3a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M9 2h3v3M12 2L7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  fb: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  google: (
    <svg width="11" height="11" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  tiktok: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
    </svg>
  ),
}

/* ══════════════════════════════════════════════════
   CHARTS
══════════════════════════════════════════════════ */

function Sparkline({ data, color = '#1F4BFF', width = 72, height = 28 }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const id = `sp-${Math.random().toString(36).slice(2)}`
  const lastPt = pts[pts.length - 1].split(',')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${pts.join(' ')} ${width},${height}`} fill={`url(#${id})`}/>
      <polyline points={pts.join(' ')} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2.5" fill={color}/>
    </svg>
  )
}

function BarChart({ before, after, label, color = '#1F4BFF', unit = '' }) {
  const maxVal = Math.max(before, after) * 1.2
  const bH = Math.round((before / maxVal) * 52)
  const aH = Math.round((after / maxVal) * 52)
  const fmt = v => `${v}${unit}`
  const afterColor = after < before ? '#16a34a' : color
  return (
    <div className="proof-chart-bar">
      <div className="proof-chart-bar__cols">
        <div className="proof-chart-bar__col">
          <div className="proof-chart-bar__fill proof-chart-bar__fill--muted" style={{ height: bH }}/>
          <span className="proof-chart-bar__val">{fmt(before)}</span>
          <span className="proof-chart-bar__lbl">Before</span>
        </div>
        <div className="proof-chart-bar__col">
          <div className="proof-chart-bar__fill" style={{ height: aH, background: afterColor }}/>
          <span className="proof-chart-bar__val" style={{ color: afterColor }}>{fmt(after)}</span>
          <span className="proof-chart-bar__lbl">After</span>
        </div>
      </div>
      <span className="proof-chart-bar__title">{label}</span>
    </div>
  )
}

function FunnelChart({ steps }) {
  const max = steps[0].val
  return (
    <div className="proof-funnel">
      <span className="proof-funnel__title">Conversion Funnel</span>
      {steps.map((s, i) => {
        const w = Math.round((s.val / max) * 100)
        return (
          <div key={i} className="proof-funnel__step">
            <span className="proof-funnel__label">{s.label}</span>
            <div className="proof-funnel__track">
              <div className="proof-funnel__fill" style={{ width: `${w}%`, opacity: 1 - i * 0.12 }}/>
            </div>
            <span className="proof-funnel__val">{s.val.toLocaleString()}</span>
          </div>
        )
      })}
    </div>
  )
}

function WeeklyChart({ weeks, data, color = '#1F4BFF', label }) {
  const W = 220, H = 54
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = H - ((v - min) / range) * (H - 8) - 4
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const id = `wc-${Math.random().toString(36).slice(2)}`
  return (
    <div className="proof-weekly">
      <div className="proof-weekly__head">
        <span className="proof-weekly__title">{label}</span>
        <span className="proof-weekly__peak" style={{ color }}>{Math.max(...data).toLocaleString()}</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} fill="none" preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <polygon points={`0,${H} ${pts.join(' ')} ${W},${H}`} fill={`url(#${id})`}/>
        <polyline points={pts.join(' ')} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="proof-weekly__labels">
        {weeks.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   SVG MOCK SCREENSHOTS
══════════════════════════════════════════════════ */

function ScreenshotMeta({ roas = '4.2×', spend = '৳৫০,০০০', orders = '54', cpc = '৳12.4' }) {
  return (
    <svg className="proof-screenshot" viewBox="0 0 320 158" fill="none" aria-label="Meta Ads Manager">
      <rect width="320" height="158" fill="#f0f2f5" rx="6"/>
      <rect width="320" height="28" fill="#1877f2" rx="6"/>
      <rect y="22" width="320" height="6" fill="#1877f2"/>
      <circle cx="14" cy="14" r="5" fill="white" fillOpacity=".3"/>
      <rect x="24" y="9" width="60" height="10" rx="3" fill="white" fillOpacity=".3"/>
      <rect x="240" y="9" width="32" height="10" rx="3" fill="white" fillOpacity=".25"/>
      <rect x="278" y="9" width="32" height="10" rx="3" fill="white" fillOpacity=".18"/>
      {[
        { x: 8,   label: 'ROAS',   val: roas,   c: '#1877f2' },
        { x: 86,  label: 'Spend',  val: spend,  c: '#444' },
        { x: 164, label: 'Orders', val: orders, c: '#16a34a' },
        { x: 242, label: 'CPC',    val: cpc,    c: '#444' },
      ].map((k, i) => (
        <g key={i}>
          <rect x={k.x} y="35" width="70" height="34" rx="4" fill="white" stroke="#e4e6eb" strokeWidth=".6"/>
          <text x={k.x + 6} y="47" fontSize="6.5" fill="#90959d" fontFamily="monospace">{k.label}</text>
          <text x={k.x + 6} y="61" fontSize="10" fontWeight="bold" fill={k.c} fontFamily="monospace">{k.val}</text>
        </g>
      ))}
      <rect x="8" y="77" width="196" height="52" rx="4" fill="white" stroke="#e4e6eb" strokeWidth=".6"/>
      <text x="14" y="88" fontSize="6.5" fill="#90959d" fontFamily="monospace">ROAS over time</text>
      <polyline points="14,120 44,114 74,107 104,99 134,91 164,84 196,80" stroke="#1877f2" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <polygon points="14,128 44,114 74,107 104,99 134,91 164,84 196,80 196,128" fill="#1877f2" fillOpacity=".08"/>
      <rect x="212" y="77" width="100" height="52" rx="4" fill="white" stroke="#e4e6eb" strokeWidth=".6"/>
      <rect x="212" y="77" width="100" height="13" fill="#f7f8fa" rx="4"/>
      <text x="218" y="87" fontSize="6" fill="#90959d" fontFamily="monospace">Top Ad Sets</text>
      <text x="278" y="87" fontSize="6" fill="#90959d" fontFamily="monospace">ROAS</text>
      {[['Retarget','5.1×'],['Lookalike','4.6×'],['Broad','3.2×']].map(([n,v],i) => (
        <g key={i}>
          <text x="218" y={100+i*11} fontSize="6.5" fill="#1c1e21" fontFamily="monospace">{n}</text>
          <text x="278" y={100+i*11} fontSize="6.5" fill="#16a34a" fontWeight="bold" fontFamily="monospace">{v}</text>
        </g>
      ))}
      <rect y="146" width="320" height="12" fill="white" rx="0"/>
      <text x="10" y="155" fontSize="5.5" fill="#90959d" fontFamily="monospace">Meta Ads Manager · Campaign Results · Last 30 days</text>
    </svg>
  )
}

function ScreenshotGoogle({ ctr = '4.8%', cpc = '৳8.2', conv = '142', roas = '3.6×' }) {
  return (
    <svg className="proof-screenshot" viewBox="0 0 320 158" fill="none" aria-label="Google Ads">
      <rect width="320" height="158" fill="#f8f9fa" rx="6"/>
      <rect width="320" height="26" fill="white" rx="6"/>
      <rect y="20" width="320" height="6" fill="white"/>
      <rect y="26" width="320" height="1" fill="#e8eaed"/>
      <circle cx="14" cy="13" r="7" fill="#4285f4"/>
      <text x="10.5" y="17" fontSize="9" fill="white" fontWeight="bold" fontFamily="Arial">G</text>
      <rect x="26" y="7" width="50" height="11" rx="2" fill="#e8eaed"/>
      <rect x="82" y="7" width="36" height="11" rx="2" fill="#e8eaed"/>
      {[
        { x: 8,   label: 'CTR',   val: ctr,  c: '#4285f4' },
        { x: 86,  label: 'CPC',   val: cpc,  c: '#555' },
        { x: 164, label: 'Conv.', val: conv, c: '#34a853' },
        { x: 242, label: 'ROAS',  val: roas, c: '#4285f4' },
      ].map((k, i) => (
        <g key={i}>
          <rect x={k.x} y="33" width="70" height="32" rx="4" fill="white" stroke="#e8eaed" strokeWidth=".7"/>
          <text x={k.x+6} y="44" fontSize="6.5" fill="#80868b" fontFamily="monospace">{k.label}</text>
          <text x={k.x+6} y="58" fontSize="10" fontWeight="bold" fill={k.c} fontFamily="monospace">{k.val}</text>
        </g>
      ))}
      <rect x="8" y="73" width="178" height="56" rx="4" fill="white" stroke="#e8eaed" strokeWidth=".7"/>
      <text x="14" y="84" fontSize="6.5" fill="#80868b" fontFamily="monospace">Clicks &amp; Conversions</text>
      {[{x:18,h:28,c:'#4285f4'},{x:46,h:24,c:'#4285f4'},{x:74,h:34,c:'#4285f4'},{x:102,h:38,c:'#34a853'},{x:130,h:44,c:'#34a853'},{x:155,h:48,c:'#34a853'}].map((b,i)=>(
        <g key={i}>
          <rect x={b.x} y={122-b.h} width="14" height={b.h} rx="2" fill={b.c} fillOpacity=".82"/>
        </g>
      ))}
      <rect x="194" y="73" width="118" height="56" rx="4" fill="white" stroke="#e8eaed" strokeWidth=".7"/>
      <rect x="194" y="73" width="118" height="12" fill="#f8f9fa" rx="4"/>
      <text x="200" y="82" fontSize="6" fill="#80868b" fontFamily="monospace">Top Keywords</text>
      {[['food delivery','5.2%'],['order now','4.8%'],['fast food bd','3.9%']].map(([kw,ctrV],i)=>(
        <g key={i}>
          <text x="200" y={95+i*12} fontSize="6.5" fill="#202124" fontFamily="monospace">{kw}</text>
          <text x="282" y={95+i*12} fontSize="6.5" fill="#34a853" fontWeight="bold" fontFamily="monospace">{ctrV}</text>
        </g>
      ))}
      <rect y="146" width="320" height="12" fill="white"/>
      <text x="10" y="155" fontSize="5.5" fill="#80868b" fontFamily="monospace">Google Ads · Campaign Manager · All Campaigns</text>
    </svg>
  )
}

function ScreenshotTikTok({ views = '284K', ctr = '6.2%', cpa = '৳45', conv = '312' }) {
  return (
    <svg className="proof-screenshot" viewBox="0 0 320 158" fill="none" aria-label="TikTok Ads Manager">
      <rect width="320" height="158" fill="#010101" rx="6"/>
      <rect width="320" height="28" fill="#161823" rx="6"/>
      <rect y="22" width="320" height="6" fill="#161823"/>
      <text x="10" y="18" fontSize="10" fontWeight="bold" fill="white" fontFamily="monospace">TikTok</text>
      <text x="57" y="18" fontSize="10" fontWeight="bold" fill="#fe2c55" fontFamily="monospace"> for</text>
      <text x="81" y="18" fontSize="10" fontWeight="bold" fill="white" fontFamily="monospace"> Business</text>
      <rect x="252" y="8" width="30" height="11" rx="3" fill="#fe2c55"/>
      <text x="256" y="17" fontSize="6.5" fill="white" fontFamily="monospace">+ Create</text>
      {[
        { x: 8,   label: 'Views',  val: views, c: '#fe2c55' },
        { x: 86,  label: 'CTR',    val: ctr,   c: '#25f4ee' },
        { x: 164, label: 'CPA',    val: cpa,   c: '#aaa' },
        { x: 242, label: 'Conv.',  val: conv,  c: '#25f4ee' },
      ].map((k, i) => (
        <g key={i}>
          <rect x={k.x} y="35" width="70" height="34" rx="4" fill="#161823" stroke="#2a2a3a" strokeWidth=".8"/>
          <text x={k.x+6} y="47" fontSize="6.5" fill="#888" fontFamily="monospace">{k.label}</text>
          <text x={k.x+6} y="61" fontSize="10" fontWeight="bold" fill={k.c} fontFamily="monospace">{k.val}</text>
        </g>
      ))}
      <rect x="8" y="77" width="196" height="52" rx="4" fill="#161823" stroke="#2a2a3a" strokeWidth=".8"/>
      <text x="14" y="88" fontSize="6.5" fill="#888" fontFamily="monospace">Video Views + CTR</text>
      <polyline points="14,122 42,116 70,108 98,97 126,86 154,82 190,78" stroke="#fe2c55" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <polyline points="14,128 42,125 70,122 98,116 126,110 154,105 190,100" stroke="#25f4ee" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeDasharray="3 2"/>
      <polygon points="14,130 42,116 70,108 98,97 126,86 154,82 190,78 196,130" fill="#fe2c55" fillOpacity=".07"/>
      <text x="155" y="87" fontSize="5" fill="#fe2c55" fontFamily="monospace">Views</text>
      <text x="155" y="96" fontSize="5" fill="#25f4ee" fontFamily="monospace">CTR</text>
      <rect x="212" y="77" width="100" height="52" rx="4" fill="#161823" stroke="#2a2a3a" strokeWidth=".8"/>
      <rect x="212" y="77" width="100" height="13" fill="#1e2030" rx="4"/>
      <text x="218" y="87" fontSize="6" fill="#888" fontFamily="monospace">Ad Set Performance</text>
      {[['Interest A','7.1%'],['Retarget','8.4%'],['Broad','4.2%']].map(([n,v],i)=>(
        <g key={i}>
          <text x="218" y={101+i*11} fontSize="6.5" fill="#ddd" fontFamily="monospace">{n}</text>
          <text x="278" y={101+i*11} fontSize="6.5" fill="#fe2c55" fontWeight="bold" fontFamily="monospace">{v}</text>
        </g>
      ))}
      <rect y="146" width="320" height="12" fill="#161823"/>
      <text x="10" y="155" fontSize="5.5" fill="#555" fontFamily="monospace">TikTok Ads Manager · Ad Group Results · Last 28 days</text>
    </svg>
  )
}

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const proofs = [
  {
    id: 'fashion',
    client: 'ফ্যাশন ব্র্যান্ড',
    sector: 'E-Commerce · Fashion',
    platform: 'meta',
    platformLabel: 'Meta Ads',
    headline: 'মাইক্রো টেস্ট থেকে দেশজুড়ে স্কেল — ৬ সপ্তাহে',
    kpi: '৪.২×', kpiSub: 'ROAS',
    change: '+৩২০%', changeLabel: 'মাসিক অর্ডার', isDown: false,
    budget: '৳৫০,০০০ / মাস',
    sparkColor: '#1877f2',
    sparkData: [1.2, 2.1, 2.8, 3.5, 4.2],
    barCharts: [
      { before: 1.2, after: 4.2, label: 'ROAS', unit: '×' },
      { before: 100, after: 62,  label: 'CPC Index' },
    ],
    funnel: [
      { label: 'Reach', val: 420000 },
      { label: 'Clicks', val: 18400 },
      { label: 'Add to Cart', val: 3200 },
      { label: 'Purchase', val: 1080 },
    ],
    weeklyData: [12, 18, 24, 32, 38, 48, 54],
    weeklyWeeks: ['W1','W2','W3','W4','W5','W6','W7'],
    weeklyLabel: 'Weekly Orders', weeklyColor: '#1877f2',
    before: 'ছোট বাজেটে মাইক্রো টেস্ট দিয়ে শুরু, কিন্তু স্কেল করার পথ অস্পষ্ট ছিল।',
    challenge: 'বাজেট অপচয় না করে দ্রুত স্কেল করা এবং সঠিক অডিয়েন্স খুঁজে বের করা।',
    solution: 'সাপ্তাহিক ক্রিয়েটিভ A/B টেস্ট + Lookalike অডিয়েন্স লেয়ারিং + বাজেট অটোমেশন।',
    result: '৪.২× ROAS অর্জন, প্রতি মাসে ৫০+ অর্ডার, CPC ৩৮% কমেছে।',
    apiNote: 'Facebook Marketing API — automated campaign reporting',
    pixelEvents: ['ViewContent', 'AddToCart', 'Purchase'],
    apiLink: 'https://developers.facebook.com/docs/marketing-api/',
    testimonial: 'এত দ্রুত স্কেল হবে ভাবিনি — ৬ সপ্তাহেই পুরো বাজেট জায়গামতো।',
    Screenshot: () => <ScreenshotMeta/>,
  },
  {
    id: 'food',
    client: 'ফুড ডেলিভারি',
    sector: 'Food & Beverage · Local',
    platform: 'google',
    platformLabel: 'Google Ads',
    headline: 'CTR দ্বিগুণ, CPC ৪৫% কমেছে — সাপ্তাহিক টেস্টে',
    kpi: '+৩২০%', kpiSub: 'Order Growth',
    change: '-৪৫%', changeLabel: 'Cost Per Click', isDown: true,
    budget: '৳২০,০০০ / সপ্তাহ',
    sparkColor: '#34a853',
    sparkData: [0.8, 1.4, 2.0, 2.6, 3.2],
    barCharts: [
      { before: 2.1, after: 4.8, label: 'CTR (%)', unit: '%' },
      { before: 100, after: 55,  label: 'CPC Index' },
    ],
    funnel: [
      { label: 'Impressions', val: 680000 },
      { label: 'Clicks', val: 32600 },
      { label: 'Landing Page', val: 18200 },
      { label: 'Order', val: 4280 },
    ],
    weeklyData: [38, 45, 62, 88, 105, 122, 142],
    weeklyWeeks: ['W1','W2','W3','W4','W5','W6','W7'],
    weeklyLabel: 'Weekly Conversions', weeklyColor: '#34a853',
    before: 'সীমিত অর্ডার, একই ক্রিয়েটিভ মাসের পর মাস চলছিল।',
    challenge: 'প্রতিযোগিতামূলক মার্কেটে মনোযোগ আকর্ষণ করা এবং CPC কমানো।',
    solution: 'সাপ্তাহিক ক্রিয়েটিভ রিফ্রেশ + Google Smart Bidding + GTM/GA4 ট্র্যাকিং।',
    result: 'CTR ২× বৃদ্ধি, CPC ৪৫% হ্রাস, মাসিক অর্ডার ৩২০% বেড়েছে।',
    apiNote: 'Google Ads API — keyword-level bid optimization',
    pixelEvents: ['page_view', 'purchase', 'add_to_cart'],
    apiLink: 'https://developers.google.com/google-ads/api/docs/start',
    testimonial: 'ক্রিয়েটিভ টেস্টের পর অর্ডার আকাশচুম্বী — এটা আমাদের টার্নিং পয়েন্ট।',
    Screenshot: () => <ScreenshotGoogle/>,
  },
  {
    id: 'course',
    client: 'অনলাইন কোর্স',
    sector: 'EdTech · Online Learning',
    platform: 'meta',
    platformLabel: 'Meta Ads',
    headline: 'স্মার্ট রিটার্গেটিংয়ে CPA ৬০% কমেছে',
    kpi: '-৬০%', kpiSub: 'Cost Per Acquisition',
    change: '+১৮০%', changeLabel: 'এনরোলমেন্ট', isDown: true,
    budget: '৳৩০,০০০ / মাস',
    sparkColor: '#7c3aed',
    sparkData: [100, 82, 65, 50, 40],
    barCharts: [
      { before: 100, after: 40, label: 'CPA Index' },
      { before: 45,  after: 126, label: 'Monthly Enrollments' },
    ],
    funnel: [
      { label: 'Reach', val: 310000 },
      { label: 'Clicks', val: 14200 },
      { label: 'Lead Form', val: 3800 },
      { label: 'Registration', val: 1260 },
    ],
    weeklyData: [18, 22, 28, 36, 44, 56, 72],
    weeklyWeeks: ['W1','W2','W3','W4','W5','W6','W7'],
    weeklyLabel: 'Weekly Enrollments', weeklyColor: '#7c3aed',
    before: 'CPA অনেক বেশি, সীমিত বাজেটে বেশি এনরোলমেন্ট দরকার ছিল।',
    challenge: 'উচ্চ-মানের লিড আনা এবং একই বাজেটে এনরোলমেন্ট বাড়ানো।',
    solution: 'Lookalike Audience + মাল্টি-স্টেজ রিটার্গেটিং + Pixel CompleteRegistration ট্র্যাকিং।',
    result: 'CPA ৬০% কমেছে, এনরোলমেন্ট ১৮০% বেড়েছে, লিড কোয়ালিটি উল্লেখযোগ্যভাবে উন্নত।',
    apiNote: 'Meta Pixel + Custom Conversion API — funnel tracking',
    pixelEvents: ['Lead', 'CompleteRegistration', 'Purchase'],
    apiLink: 'https://developers.facebook.com/docs/meta-pixel/',
    testimonial: 'রিটার্গেটিং সেটআপের পর আমাদের সবচেয়ে ভালো স্টুডেন্টরা এসেছে।',
    Screenshot: () => <ScreenshotMeta roas="2.8×" spend="৳৩০,০০০" orders="126" cpc="৳18"/>,
  },
  {
    id: 'lifestyle',
    client: 'লাইফস্টাইল ব্র্যান্ড',
    sector: 'D2C · Lifestyle',
    platform: 'tiktok',
    platformLabel: 'TikTok Ads',
    headline: 'ভাইরাল ক্রিয়েটিভে ২৮৪K ভিউ, CPA মাত্র ৳৪৫',
    kpi: '৬.২%', kpiSub: 'Click-Through Rate',
    change: '+৩১২%', changeLabel: 'মাসিক বিক্রি', isDown: false,
    budget: '৳৪০,০০০ / মাস',
    sparkColor: '#fe2c55',
    sparkData: [0.9, 1.8, 3.2, 4.8, 6.2],
    barCharts: [
      { before: 1.4, after: 6.2, label: 'CTR (%)', unit: '%' },
      { before: 180, after: 45,  label: 'CPA (৳)' },
    ],
    funnel: [
      { label: 'Video Views', val: 284000 },
      { label: 'Profile Visits', val: 42000 },
      { label: 'Clicks', val: 17600 },
      { label: 'Purchase', val: 3120 },
    ],
    weeklyData: [24, 40, 68, 110, 158, 220, 312],
    weeklyWeeks: ['W1','W2','W3','W4','W5','W6','W7'],
    weeklyLabel: 'Weekly Sales', weeklyColor: '#fe2c55',
    before: 'Instagram-নির্ভর ক্যাম্পেইন, TikTok অডিয়েন্সে কোনো উপস্থিতি ছিল না।',
    challenge: 'Gen-Z অডিয়েন্সে পৌঁছানো এবং কম খরচে ভাইরাল ক্রিয়েটিভ তৈরি করা।',
    solution: 'Short-form UGC ভিডিও + TikTok Spark Ads + Interest + Behavioral targeting।',
    result: 'CTR ৬.২%, CPA মাত্র ৳৪৫, ২৮৪K ভিউ, মাসিক বিক্রি ৩১২% বৃদ্ধি।',
    apiNote: 'TikTok Marketing API — automated creative rotation',
    pixelEvents: ['ViewContent', 'AddToCart', 'Purchase'],
    apiLink: 'https://ads.tiktok.com/marketing_api/docs',
    testimonial: 'TikTok-এ আসার পর আমাদের ব্র্যান্ড রাতারাতি পরিচিত হয়ে গেছে।',
    Screenshot: () => <ScreenshotTikTok/>,
  },
]

/* ══════════════════════════════════════════════════
   FLOW STEP
══════════════════════════════════════════════════ */
function FlowStep({ label, text, index }) {
  return (
    <div className="proof-step">
      <div className="proof-step__num">{index}</div>
      <div className="proof-step__body">
        <span className="proof-step__label">{label}</span>
        <p className="proof-step__text">{text}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   CARD — 3-level expand
  level 0 → collapsed header only
  level 1 → + metrics + screenshot + bar charts  (tap 1)
  level 2 → + weekly chart + funnel + flow + tech + quote (tap 2)
  tap 3   → back to 0
══════════════════════════════════════════════════ */
const PLATFORM = {
  meta:   { bg: '#e8f0fe', color: '#1877f2', Icon: () => Icon.fb     },
  google: { bg: '#fef9e7', color: '#d97706', Icon: () => Icon.google  },
  tiktok: { bg: '#fce8ef', color: '#fe2c55', Icon: () => Icon.tiktok  },
}

function ProofCard({ p, index }) {
  const [level, setLevel] = useState(0)
  const advance = () => setLevel(l => (l + 1) % 3)
  const ps = PLATFORM[p.platform]

  const btnLabel = level === 0 ? 'বিস্তারিত দেখুন'
    : level === 1 ? 'সম্পূর্ণ কেস স্টাডি'
    : 'বন্ধ করুন'

  return (
    <article className={`proof-card proof-card--l${level}`}>

      {/* ── ALWAYS: compact header (tappable) ── */}
      <button className="proof-collapsed" onClick={advance} aria-expanded={level > 0}>
        <div className="proof-collapsed__left">
          <div className="proof-collapsed__top">
            <span className="proof-index">০{index + 1}</span>
            <span className="proof-client">{p.client}</span>
            <span className="proof-platform-badge" style={{ background: ps.bg, color: ps.color }}>
              <ps.Icon/>
              {p.platformLabel}
            </span>
          </div>
          <p className="proof-headline">{p.headline}</p>
        </div>
        <div className="proof-collapsed__right">
          <span className="proof-kpi">{p.kpi}</span>
          <span className="proof-kpi-sub">{p.kpiSub}</span>
          <Sparkline data={p.sparkData} color={p.sparkColor}/>
        </div>
        <span className={`proof-toggle__chevron${level > 0 ? ' proof-toggle__chevron--open' : ''}`} aria-hidden="true">
          {Icon.chevron}
        </span>
      </button>

      {/* ── LEVEL 1 ── */}
      {level >= 1 && (
        <div className="proof-l1">

          <div className="proof-metrics">
            <div className="proof-metric">
              <span className="proof-metric__val proof-metric__val--change" style={{ color: p.isDown ? '#16a34a' : '#1F4BFF' }}>
                {p.isDown ? Icon.trendDown : Icon.trend}
                {p.change}
              </span>
              <span className="proof-metric__label">{p.changeLabel}</span>
            </div>
            <div className="proof-metric-divider"/>
            <div className="proof-metric">
              <span className="proof-metric__val">{p.budget}</span>
              <span className="proof-metric__label">অ্যাড বাজেট</span>
            </div>
            <div className="proof-metric-divider"/>
            <div className="proof-metric">
              <div className="proof-pixel-events">
                {p.pixelEvents.slice(0, 2).map(ev => (
                  <span key={ev} className="proof-event-chip">{ev}</span>
                ))}
              </div>
              <span className="proof-metric__label">Tracked Events</span>
            </div>
          </div>

          <div className="proof-screenshot-wrap">
            <p.Screenshot/>
          </div>

          <div className="proof-barcharts">
            {p.barCharts.map((bc, i) => (
              <BarChart key={i} before={bc.before} after={bc.after} label={bc.label} color={p.sparkColor} unit={bc.unit || ''}/>
            ))}
          </div>

        </div>
      )}

      {/* ── LEVEL 2 ── */}
      {level >= 2 && (
        <div className="proof-l2 proof-body">

          <div className="proof-charts-row">
            <WeeklyChart weeks={p.weeklyWeeks} data={p.weeklyData} color={p.weeklyColor} label={p.weeklyLabel}/>
            <FunnelChart steps={p.funnel}/>
          </div>

          <div className="proof-flow">
            <span className="proof-flow__label">কেস স্টাডি ফ্লো</span>
            <div className="proof-steps">
              <FlowStep label="Before"    text={p.before}    index="১"/>
              <FlowStep label="Challenge" text={p.challenge} index="২"/>
              <FlowStep label="Solution"  text={p.solution}  index="৩"/>
              <FlowStep label="Result"    text={p.result}    index="৪"/>
            </div>
          </div>

          <div className="proof-tech">
            <div className="proof-tech__row">
              <span className="proof-tech__icon">{Icon.api}</span>
              <div>
                <span className="proof-tech__label">API Integration</span>
                <p className="proof-tech__note">{p.apiNote}</p>
              </div>
              <a href={p.apiLink} target="_blank" rel="noopener noreferrer" className="proof-tech__link">{Icon.link}</a>
            </div>
            <div className="proof-tech__row">
              <span className="proof-tech__icon">{Icon.pixel}</span>
              <div>
                <span className="proof-tech__label">Pixel / Tracking Events</span>
                <div className="proof-tech__chips">
                  {p.pixelEvents.map(ev => (
                    <span key={ev} className="proof-event-chip proof-event-chip--lg">{ev}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {p.testimonial && (
            <blockquote className="proof-testimonial">
              <span className="proof-testimonial__icon">{Icon.quote}</span>
              <p className="proof-testimonial__text">{p.testimonial}</p>
              <cite className="proof-testimonial__cite">— {p.client} ক্লায়েন্ট</cite>
            </blockquote>
          )}

        </div>
      )}

      {/* ── Toggle ── */}
      <button className="proof-toggle" onClick={advance}>
        <span>{btnLabel}</span>
        <span className={`proof-toggle__chevron${level > 0 ? ' proof-toggle__chevron--open' : ''}`} aria-hidden="true">
          {Icon.chevron}
        </span>
      </button>

    </article>
  )
}

/* ══════════════════════════════════════════════════
   SECTION
══════════════════════════════════════════════════ */
export default function Proof() {
  return (
    <section id="proof" className="proof-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৪</span>
          <span className="section-title-right">প্রুফ</span>
        </div>
        <h2 className="proof-heading">কেস স্টাডি ও ফলাফল</h2>
        <p className="proof-note">
          রিয়েল ক্যাম্পেইন ডেটা — API, Pixel এবং Ads Manager থেকে যাচাইকৃত।
        </p>
        <div className="proof-list">
          {proofs.map((p, i) => (
            <ProofCard key={p.id} p={p} index={i}/>
          ))}
        </div>
      </div>
    </section>
  )
}
