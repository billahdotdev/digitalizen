import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Target, BarChart2, RefreshCw, Repeat2, Smartphone,
  Package, Cpu, Heart, ShieldCheck, Users,
  TrendingUp, CalendarClock, Activity, FileBarChart, CirclePercent,
  ChevronDown, ArrowRight, RotateCcw, Download, MessageCircle,
  Megaphone, Settings, DollarSign, CheckCircle2, AlertTriangle,
  Zap, Star, Sparkles, Clock, Award, TrendingDown, Minus,
} from 'lucide-react'
import './GrowthHub.css'
import {
  WA, PIXEL, BRAND,
  AUDIT_DOMAINS, AUDIT_QUESTIONS,
  calculateScores, getBand,
  getDomainInsights, getTopPriorityActions,
  recommendPackage,
  INIT_STATE,
} from './GrowthHub.data.js'

/* ── Icon registry ───────────────────────────────────────── */
const ICON_MAP = {
  target: Target, barChart: BarChart2, refreshCw: RefreshCw, repeat2: Repeat2,
  smartphone: Smartphone, package: Package, cpu: Cpu,
  heartHandshake: Heart, shieldCheck: ShieldCheck, users: Users,
  trendingUp: TrendingUp, calendarClock: CalendarClock, activity: Activity,
  fileBarChart: FileBarChart, circlePercent: CirclePercent,
}
const QIcon = ({ iconKey, size = 20, ...p }) => {
  const I = ICON_MAP[iconKey] || Target
  return <I size={size} {...p} />
}
const DomainIcon = ({ domain, size = 18, color, sw = 1.75 }) => {
  if (domain === 'marketing')  return <Megaphone  size={size} color={color} strokeWidth={sw} />
  if (domain === 'operations') return <Settings   size={size} color={color} strokeWidth={sw} />
  return <DollarSign size={size} color={color} strokeWidth={sw} />
}

/* WhatsApp SVG icon */
const WaIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ── Score ring ──────────────────────────────────────────── */
function ScoreRing({ pct, size = 92, stroke = 8, color, animated = true }) {
  const [disp, setDisp] = useState(0)
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const off  = circ - (disp / 100) * circ

  useEffect(() => {
    if (!animated) { setDisp(pct); return }
    let start = null
    const dur = 1200
    const ease = t => 1 - Math.pow(1 - t, 3)
    const tick = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / dur, 1)
      setDisp(Math.round(ease(p) * pct))
      if (p < 1) requestAnimationFrame(tick)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [pct, animated])

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.04s linear' }} />
      </svg>
      <div className="score-ring__inner">
        {/* Number and % in one element so sizing and baseline are natural */}
        <span className="score-ring__label" style={{ color }}>
          <span className="score-ring__num">{disp}</span><span className="score-ring__pct">%</span>
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BENGALI FONT LOADER
   ──────────────────────────────────────────────────────────
   jsPDF only supports TTF/OTF — woff/woff2 do NOT work.
   We fetch Noto Sans Bengali TTF (fully supports Bengali Unicode)
   from a CDN that has CORS headers, convert to base64, and
   register with jsPDF. Cache in module-level variable.
══════════════════════════════════════════════════════════ */
let _bnFontB64 = null   // null = not loaded yet, false = failed, string = ready

async function loadBengaliFont() {
  if (_bnFontB64 !== null) return _bnFontB64

  // Noto Sans Bengali — complete Unicode Bengali TTF, CORS-enabled CDN
  // jsDelivr mirrors the @fontsource package which bundles the actual TTF binary
  // jsPDF ONLY parses TTF/OTF binary — woff2 silently fails.
  // We fetch the Google Fonts CSS with a legacy UA to get TTF URLs,
  // then fetch the actual TTF binary.
  // Primary strategy: ask Google Fonts API for TTF via old UA, parse the URL, fetch it.
  try {
    // Using a non-modern UA forces Google Fonts to return TTF format
    const cssResp = await fetch(
      'https://fonts.googleapis.com/css?family=Hind+Siliguri:400&subset=bengali',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0)' } }
    )
    if (cssResp.ok) {
      const css = await cssResp.text()
      // Extract the TTF/OTF URL from the CSS
      const match = css.match(/url\(([^)]+\.(ttf|otf))\)/)
      if (match) {
        const ttfResp = await fetch(match[1])
        if (ttfResp.ok) {
          const buf   = await ttfResp.arrayBuffer()
          const bytes = new Uint8Array(buf)
          let b64 = ''
          for (let i = 0; i < bytes.length; i += 8192)
            b64 += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.length)))
          _bnFontB64 = btoa(b64)
          return _bnFontB64
        }
      }
    }
  } catch (_) { /* fall through to direct CDN */ }

  // Fallback: direct TTF from a known public CDN
  // This is a raw .ttf file (not woff2) from GitHub/jsDelivr raw file hosting
  const FALLBACK_TTF_URLS = [
    'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf',
    'https://rawcdn.githack.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Regular.ttf',
  ]

  for (const url of FALLBACK_TTF_URLS) {
    try {
      const resp = await fetch(url)
      if (!resp.ok) continue
      const buf   = await resp.arrayBuffer()
      const bytes = new Uint8Array(buf)
      // Chunked btoa — avoids stack overflow on large buffers
      let b64 = ''
      for (let i = 0; i < bytes.length; i += 8192)
        b64 += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.length)))
      _bnFontB64 = btoa(b64)
      return _bnFontB64
    } catch (_) { /* try next */ }
  }

  _bnFontB64 = false
  return false
}

/* ══════════════════════════════════════════════════════════
   BRANDED PDF GENERATOR
   All Bengali text is rendered through the registered font.
   English headings use Helvetica for sharpness.
══════════════════════════════════════════════════════════ */
async function generatePDF(domainScores, overall, domainInsights, pkg, topActions) {

  /* 1. Load jsPDF from CDN if not already present */
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = resolve
      s.onerror = () => reject(new Error('jsPDF CDN load failed'))
      document.head.appendChild(s)
    })
  }

  /* 2. Load Bengali font */
  const bnFontB64 = await loadBengaliFont()

  /* 3. Create document */
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  /* 4. Register Bengali font — MUST use .ttf extension for jsPDF to parse correctly */
  let bnRegistered = false
  if (bnFontB64) {
    try {
      doc.addFileToVFS('NotoSansBengali.ttf', bnFontB64)
      doc.addFont('NotoSansBengali.ttf', 'NotoSansBengali', 'normal')
      // Quick sanity-check: switching to it should not throw
      doc.setFont('NotoSansBengali', 'normal')
      doc.setFont('helvetica', 'normal') // switch back
      bnRegistered = true
    } catch (e) {
      console.warn('Bengali font registration failed, using transliteration fallback:', e.message)
      bnRegistered = false
    }
  }

  /* ── Layout constants ── */
  const W = 210, mg = 14, cW = W - mg * 2
  let y = 0

  /* ── Helpers ── */
  const h2r = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)]
  const fill = (x, fy, w, h, hex) => { const [r,g,b]=h2r(hex); doc.setFillColor(r,g,b); doc.rect(x,fy,w,h,'F') }
  const txt  = hex => { const [r,g,b]=h2r(hex); doc.setTextColor(r,g,b) }
  const hln  = (fy, hex='#E2E8F0') => { const [r,g,b]=h2r(hex); doc.setDrawColor(r,g,b); doc.setLineWidth(0.25); doc.line(mg, fy, W-mg, fy) }
  const pc   = (fy, needed) => {
    if (fy + needed > 272) {
      doc.addPage()
      fill(0, 0, W, 3, '#1F4BFF')
      return 14
    }
    return fy
  }

  // Bengali font — falls back to helvetica if not registered
  const setBn = (sz) => {
    doc.setFontSize(sz)
    doc.setFont(bnRegistered ? 'NotoSansBengali' : 'helvetica', 'normal')
  }
  const setEn = (sz, style = 'normal') => {
    doc.setFontSize(sz)
    doc.setFont('helvetica', style)
  }

  // Safe text render: handles line wrapping for Bengali
  const bnText = (text, x, fy, maxW) => {
    setBn(7)
    const lines = doc.splitTextToSize(String(text), maxW || cW)
    doc.text(lines, x, fy)
    return lines.length
  }

  const band = getBand(overall)
  const date = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })

  /* ═══════════════════════════════════════════════
     PAGE 1 HEADER
  ═══════════════════════════════════════════════ */
  fill(0, 0, W, 62, '#0A1628')
  fill(0, 0, W, 3,  '#1F4BFF')

  // Brand name
  setEn(22, 'bold'); txt('#FFFFFF')
  doc.text('DIGITALIZEN', mg, 22)
  setEn(7.5); txt('#4B7BFF')
  doc.text('Growth Intelligence Platform', mg, 29)

  // Report type
  setEn(7.5, 'bold'); txt('#4B7BFF')
  doc.text('BUSINESS HEALTH REPORT', W-mg, 18, { align:'right' })
  setEn(7); txt('#64748B')
  doc.text(date, W-mg, 25, { align:'right' })
  doc.text('Confidential  \u00b7  Internal Use Only', W-mg, 31, { align:'right' })

  // Big score number
  const [br,bg_,bb] = h2r(band.color)
  setEn(48, 'bold'); doc.setTextColor(br, bg_, bb)
  doc.text(`${overall}%`, mg, 54)

  // Band label + description (right side)
  setEn(9, 'bold'); txt('#FFFFFF')
  doc.text('Overall Business Health Score', mg + 40, 44)
  setEn(9, 'bold'); doc.setTextColor(br, bg_, bb)
  doc.text(`${band.labelEn.toUpperCase()}`, mg + 40, 52)
  setBn(8); doc.setTextColor(br, bg_, bb)
  doc.text(band.label, mg + 40 + doc.getTextWidth(`${band.labelEn.toUpperCase()}`) + 4, 52)

  y = 72

  /* ═══════════════════════════════════════════════
     DOMAIN PERFORMANCE
  ═══════════════════════════════════════════════ */
  setEn(7.5, 'bold'); txt('#94A3B8')
  doc.text('DOMAIN PERFORMANCE', mg, y); y += 3; hln(y); y += 5

  const domCfg = [
    { key:'marketing',  labelEn:'Marketing',  labelBn:'মার্কেটিং',  color:'#1F4BFF', score: domainScores.marketing  },
    { key:'operations', labelEn:'Operations', labelBn:'অপারেশনস', color:'#7C3AED', score: domainScores.operations },
    { key:'finance',    labelEn:'Finance',    labelBn:'ফাইন্যান্স',  color:'#059669', score: domainScores.finance    },
  ]

  domCfg.forEach(d => {
    const [cr,cg,cb] = h2r(d.color)
    // Label
    setEn(7.5, 'bold'); txt('#1E293B')
    doc.text(d.labelEn, mg, y + 3.5)
    // Bengali label
    setBn(6.5); doc.setTextColor(cr, cg, cb)
    doc.text(d.labelBn, mg + doc.getTextWidth(d.labelEn) + 3, y + 3.5)
    // Score
    setEn(8, 'bold'); doc.setTextColor(cr, cg, cb)
    doc.text(`${d.score}%`, W - mg, y + 3.5, { align:'right' })
    // Band label
    setEn(6); txt('#94A3B8')
    doc.text(getBand(d.score).labelEn, W - mg - 18, y + 3.5, { align:'right' })
    // Progress bar
    fill(mg, y + 5, cW, 4, '#EEF2FF')
    if (d.score > 0) fill(mg, y + 5, Math.max((d.score / 100) * cW, 1), 4, d.color)
    y += 14
  })

  y += 4; hln(y); y += 8

  /* ═══════════════════════════════════════════════
     TOP 3 PRIORITY ACTIONS
  ═══════════════════════════════════════════════ */
  setEn(7.5, 'bold'); txt('#94A3B8')
  doc.text('TOP PRIORITY ACTIONS', mg, y); y += 3; hln(y); y += 5

  const urgColors = ['#DC2626', '#D97706', '#2563EB']
  const urgBgs    = ['#FEF2F2', '#FFFBEB', '#EFF6FF']
  const urgLabels = ['CRITICAL', 'HIGH PRIORITY', 'REVIEW']

  topActions.slice(0, 3).forEach((a, i) => {
    y = pc(y, 24)
    const boxH = 22
    fill(mg, y, cW, boxH, urgBgs[i])
    fill(mg, y, 4, boxH, urgColors[i])
    const [ur,ug,ub] = h2r(urgColors[i])
    setEn(5.5, 'bold'); doc.setTextColor(ur, ug, ub)
    doc.text(urgLabels[i], mg + 7, y + 5)
    // Question text in Bengali
    setBn(7); txt('#1E293B')
    const lines = doc.splitTextToSize(String(a.q), cW - 14)
    doc.text(lines, mg + 7, y + 11)
    y += boxH + 3
  })

  y += 2; hln(y); y += 8

  /* ═══════════════════════════════════════════════
     DOMAIN INSIGHTS & RECOMMENDATIONS
  ═══════════════════════════════════════════════ */
  setEn(7.5, 'bold'); txt('#94A3B8')
  doc.text('DOMAIN INSIGHTS & RECOMMENDATIONS', mg, y); y += 3; hln(y); y += 6

  domainInsights.forEach(ins => {
    const d = domCfg.find(d => d.key === ins.domain)
    if (!d) return
    const [cr,cg,cb] = h2r(d.color)

    y = pc(y, 38)

    // Domain header bar
    fill(mg, y, cW, 9, d.color)
    setEn(7.5, 'bold'); txt('#FFFFFF')
    doc.text(d.labelEn.toUpperCase(), mg + 4, y + 6)
    setBn(7); txt('#FFFFFF')
    doc.text(d.labelBn, mg + 4 + doc.getTextWidth(d.labelEn.toUpperCase()) + 3, y + 6)
    setEn(7); txt('#FFFFFF')
    doc.text(`${d.score}%  \u00b7  ${ins.band.labelEn}`, W - mg - 4, y + 6, { align:'right' })
    y += 13

    // Insight title (Bengali)
    doc.setTextColor(cr, cg, cb)
    setBn(8)
    const titleLines = doc.splitTextToSize(String(ins.title), cW - 4)
    doc.text(titleLines, mg + 2, y)
    y += titleLines.length * 5 + 2

    // Detail text (Bengali)
    txt('#475569'); setBn(6.5)
    const detailLines = doc.splitTextToSize(String(ins.detail), cW - 4)
    doc.text(detailLines, mg + 2, y)
    y += detailLines.length * 4 + 3

    // Action items
    ins.actions.forEach((act, ai) => {
      y = pc(y, 10)
      // Bullet
      doc.setTextColor(cr, cg, cb)
      setEn(7, 'bold')
      doc.text(`${ai + 1}.`, mg + 5, y)
      // Action text (Bengali)
      txt('#1E293B'); setBn(6.5)
      const actLines = doc.splitTextToSize(String(act), cW - 16)
      doc.text(actLines, mg + 10, y)
      y += actLines.length * 4 + 2
    })

    y += 6
  })

  /* ═══════════════════════════════════════════════
     RECOMMENDED PACKAGE
  ═══════════════════════════════════════════════ */
  y = pc(y, 50)
  hln(y); y += 6

  setEn(7.5, 'bold'); txt('#94A3B8')
  doc.text('RECOMMENDED PACKAGE', mg, y); y += 3; hln(y); y += 5

  // Package card
  fill(mg, y, cW, 46, '#EEF2FF')
  fill(mg, y, cW, 8, '#1F4BFF')

  setEn(8, 'bold'); txt('#FFFFFF')
  doc.text('BEST FIT FOR YOUR SCORE', mg + 4, y + 5.5)
  setEn(8); txt('#FFFFFF')
  doc.text(pkg.price, W - mg - 4, y + 5.5, { align:'right' })
  y += 11

  setEn(11, 'bold'); txt('#1E293B')
  doc.text(pkg.name, mg + 4, y + 5)
  setEn(7); txt('#64748B')
  doc.text(pkg.tagline, mg + 4, y + 12)
  y += 17

  const half = cW / 2
  pkg.features.forEach((f, fi) => {
    const col = fi % 2 === 0 ? mg + 4 : mg + half + 4
    const row = y + Math.floor(fi / 2) * 7
    setEn(6.5, 'bold'); txt('#059669')
    doc.text('+', col, row)
    setEn(6.5); txt('#1E293B')
    doc.text(f, col + 5, row)
  })
  y += Math.ceil(pkg.features.length / 2) * 7 + 4

  /* ═══════════════════════════════════════════════
     GROW WITH DIGITALIZEN CTA SECTION
  ═══════════════════════════════════════════════ */
  y = pc(y, 55)
  y += 6; hln(y); y += 6

  // CTA background
  fill(mg, y, cW, 52, '#0A1628')
  fill(mg, y, cW, 3,  '#1F4BFF')

  // Headline
  setEn(11, 'bold'); txt('#FFFFFF')
  doc.text('Ready to grow your business?', mg + 6, y + 12)

  // Sub-headline in Bengali
  setBn(8); txt('#93C5FD')
  const ctaSubLines = doc.splitTextToSize(
    'আপনার বিজনেসকে পরবর্তী স্তরে নিয়ে যেতে Digitalizen-এর বিশেষজ্ঞ দল সর্বদা প্রস্তুত।',
    cW - 12
  )
  doc.text(ctaSubLines, mg + 6, y + 20)

  // Two benefit columns
  const benefits = [
    { en: 'Data-Driven Ads',    bn: 'ডেটা-চালিত বিজ্ঞাপন কৌশল' },
    { en: 'Creative Content',   bn: 'প্রফেশনাল ক্রিয়েটিভ কনটেন্ট' },
    { en: 'Tech & Automation',  bn: 'টেক ও অটোমেশন সেটআপ' },
    { en: 'Growth Strategy',    bn: 'কাস্টম গ্রোথ রোডম্যাপ' },
  ]
  const bY = y + 28
  benefits.forEach((b, bi) => {
    const col = bi % 2 === 0 ? mg + 6 : mg + half + 4
    const row = bY + Math.floor(bi / 2) * 9
    // Dot
    const [dr,dg,db] = h2r('#1F4BFF')
    doc.setFillColor(dr,dg,db)
    doc.circle(col + 1.5, row - 1.5, 1.5, 'F')
    // English label
    setEn(7, 'bold'); txt('#FFFFFF')
    doc.text(b.en, col + 5, row)
    // Bengali sub-label
    setBn(6); txt('#94A3B8')
    doc.text(b.bn, col + 5, row + 5)
  })

  // WhatsApp CTA button (drawn as filled rect)
  const btnY = y + 47
  fill(mg + 6, btnY, 56, 8, '#25D366')
  fill(mg + 6 + 59, btnY, 62, 8, '#1F4BFF')

  setEn(7, 'bold'); txt('#FFFFFF')
  doc.text('WhatsApp: +880 1711-992558', mg + 9, btnY + 5.5)
  doc.text('digitalizen.com/contact', mg + 68, btnY + 5.5)

  y += 55

  /* ═══════════════════════════════════════════════
     FOOTER (last page)
  ═══════════════════════════════════════════════ */
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    const fY = 286
    fill(0, fY - 2, W, 14, '#0A1628')
    fill(0, 295, W, 2, '#1F4BFF')
    setEn(6.5); txt('#475569')
    doc.text(
      `Generated by ${BRAND} \u00b7 GrowthHub Business Audit \u00b7 ${date} \u00b7 Page ${p}/${totalPages}`,
      mg, fY + 5
    )
    setEn(6.5, 'bold'); txt('#4B7BFF')
    doc.text('digitalizen.com', W - mg, fY + 5, { align:'right' })
  }

  /* ── Save ── */
  doc.save(`Digitalizen_Business_Health_Report_${new Date().getFullYear()}.pdf`)
}

/* ══════════════════════════════════════════════════════════
   PHASE 1 — ENTRY
══════════════════════════════════════════════════════════ */
function PhaseEntry({ onStart }) {
  return (
    <div className="gh-entry gh-step">
      <div className="gh-entry__glow"   aria-hidden="true" />
      <div className="gh-entry__grid"   aria-hidden="true" />
      <div className="gh-entry__badge">
        <span className="gh-live-dot" aria-hidden="true" />
        ফ্রি · ৩ মিনিটের বিজনেস অডিট
      </div>
      <h2 className="gh-entry__title">
        আপনার বিজনেসের<br />
        <span className="gh-entry__accent">সত্যিকারের অবস্থান</span><br />
        কোথায়?
      </h2>
      <p className="gh-entry__desc">
        মার্কেটিং, অপারেশনস এবং ফাইন্যান্স — তিনটি বিভাগে<br />
        ১৫টি প্রশ্নে একটি প্রফেশনাল বিজনেস হেলথ রিপোর্ট পান।
      </p>
      <div className="gh-entry__domains">
        {AUDIT_DOMAINS.map((d, i) => (
          <div key={d.key} className="gh-domain-pill" style={{ '--c': d.color, '--cl': d.colorLight, animationDelay: `${i*80}ms` }}>
            <DomainIcon domain={d.key} size={13} color={d.color} />
            <span>{d.label}</span>
          </div>
        ))}
      </div>
      <button className="gh-entry__cta" onClick={onStart}>
        আমার ফ্রি অডিট শুরু করুন
        <ArrowRight size={16} strokeWidth={2.5} />
      </button>
      <p className="gh-entry__note">
        <Clock size={11} strokeWidth={2} />
        মাত্র ৩ মিনিট
        <span className="gh-entry__dot" />
        ১৫টি প্রশ্ন
        <span className="gh-entry__dot" />
        কাস্টম রিপোর্ট
      </p>
      <div className="gh-entry__stats">
        {[
          { n:'৩,৬০০+', l:'ক্লায়েন্ট' },
          { n:'৯+',     l:'বছর' },
          { n:'৩৪০%',  l:'গড় ROAS' },
          { n:'২৩,০০০+', l:'ক্যাম্পেইন' },
        ].map(s => (
          <div key={s.l} className="gh-stat">
            <span className="gh-stat__n">{s.n}</span>
            <span className="gh-stat__l">{s.l}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PHASE 2 — AUDIT
══════════════════════════════════════════════════════════ */
function PhaseAudit({ state, onAnswer, onBack }) {
  const { currentQ } = state
  const question = AUDIT_QUESTIONS[currentQ]
  const domain   = AUDIT_DOMAINS.find(d => d.key === question.domain)
  const [picked, setPicked]   = useState(null)
  const [exiting, setExiting] = useState(false)
  const prevQ = useRef(currentQ)

  useEffect(() => {
    if (prevQ.current !== currentQ) { setPicked(null); prevQ.current = currentQ }
  }, [currentQ])

  const handlePick = useCallback((opt, idx) => {
    if (picked !== null) return
    setPicked(idx)
    setExiting(true)
    setTimeout(() => { setExiting(false); onAnswer(question.id, opt.value) }, 390)
  }, [picked, question.id, onAnswer])

  const domQs  = AUDIT_QUESTIONS.filter(q => q.domain === question.domain)
  const domIdx = domQs.findIndex(q => q.id === question.id)
  const domNum = ['marketing','operations','finance'].indexOf(question.domain) + 1

  return (
    <div className={`gh-audit gh-step${exiting ? ' exiting' : ''}`} key={`q${currentQ}`}>
      {/* Domain band */}
      <div className="gh-domain-band" style={{ '--dc': domain.color, '--dl': domain.colorLight }}>
        <div className="gh-domain-band__left">
          <div className="gh-domain-band__icon">
            <DomainIcon domain={domain.key} size={15} color={domain.color} />
          </div>
          <div>
            <div className="gh-domain-band__cat">{domain.label}</div>
            <div className="gh-domain-band__sub">বিভাগ {domNum}/৩ · প্রশ্ন {domIdx+1}/{domQs.length}</div>
          </div>
        </div>
        <div className="gh-domain-band__dots" aria-hidden="true">
          {domQs.map((q, i) => (
            <div key={q.id}
              className={`gh-ddot${i<domIdx?' done':i===domIdx?' active':''}`}
              style={{ '--dc': domain.color }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="gh-q-body">
        <div className="gh-q-icon" style={{ '--dc': domain.color, '--dl': domain.colorLight }}>
          <QIcon iconKey={question.iconKey} size={22} color={domain.color} strokeWidth={1.75} />
        </div>
        <h3 className="gh-q-text">{question.q}</h3>
        {question.hint && (
          <div className="gh-q-hint">
            <Zap size={11} color="#D97706" strokeWidth={2.5} aria-hidden="true" />
            {question.hint}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="gh-options" role="listbox" aria-label="উত্তর বেছে নিন">
        {question.options.map((opt, i) => (
          <button key={i} role="option"
            className={`gh-opt${picked===i?' selected':''}${picked!==null&&picked!==i?' dimmed':''}`}
            onClick={() => handlePick(opt, i)}
            aria-selected={picked === i}
            style={{ '--dc': domain.color, '--dl': domain.colorLight, animationDelay: `${i*50}ms` }}>
            <div className="gh-opt__letter" aria-hidden="true">{String.fromCharCode(65+i)}</div>
            <div className="gh-opt__body">
              <span className="gh-opt__label">{opt.label}</span>
              {opt.sub && <span className="gh-opt__sub">{opt.sub}</span>}
            </div>
            {picked===i && <CheckCircle2 size={16} className="gh-opt__check" strokeWidth={2.5} color={domain.color} aria-hidden="true" />}
            <span className="gh-opt__ripple" aria-hidden="true" />
          </button>
        ))}
      </div>

      {currentQ > 0 && (
        <button className="gh-back" onClick={onBack} aria-label="আগের প্রশ্নে ফিরুন">
          <ArrowRight size={12} style={{ transform:'rotate(180deg)' }} strokeWidth={2.5} aria-hidden="true" />
          আগের প্রশ্ন
        </button>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   PHASE 3 — ANALYZING
══════════════════════════════════════════════════════════ */
function PhaseAnalyzing({ onDone }) {
  const [step, setStep] = useState(0)
  const steps = [
    { text: 'মার্কেটিং পারফরম্যান্স বিশ্লেষণ করা হচ্ছে…', Icon: Megaphone  },
    { text: 'অপারেশনাল দক্ষতা মূল্যায়ন করা হচ্ছে…',      Icon: Settings   },
    { text: 'ফিনান্সিয়াল স্বাস্থ্য পরীক্ষা করা হচ্ছে…',  Icon: DollarSign },
    { text: 'কাস্টম গ্রোথ রোডম্যাপ তৈরি হচ্ছে…',          Icon: Sparkles   },
  ]
  useEffect(() => {
    const ts = steps.map((_, i) => setTimeout(() => setStep(i+1), (i+1)*720))
    setTimeout(onDone, steps.length * 720 + 500)
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div className="gh-analyzing gh-step" aria-live="polite">
      <div className="gh-orbit" aria-hidden="true">
        <div className="gh-orbit__ring gh-orbit__ring--1" />
        <div className="gh-orbit__ring gh-orbit__ring--2" />
        <div className="gh-orbit__core">D</div>
      </div>
      <h3 className="gh-analyzing__title">আপনার রিপোর্ট প্রস্তুত হচ্ছে</h3>
      <p className="gh-analyzing__sub">উত্তরের ভিত্তিতে ব্যক্তিগতকৃত বিশ্লেষণ তৈরি হচ্ছে</p>
      <div className="gh-an-steps">
        {steps.map((s, i) => (
          <div key={i} className={`gh-an-step${i<step?' done':i===step?' active':''}`}>
            <span className="gh-an-step__icon" aria-hidden="true"><s.Icon size={14} strokeWidth={1.75} /></span>
            <span className="gh-an-step__text">{s.text}</span>
            {i < step && <CheckCircle2 size={14} strokeWidth={2.5} color="#059669" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Insight accordion card ──────────────────────────────── */
function InsightCard({ insight, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const d = insight.domainMeta
  return (
    <div className={`gh-insight${open?' open':''}`} style={{ '--dc': d.color, '--dl': d.colorLight }}>
      <button className="gh-insight__hdr" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <div className="gh-insight__hdr-left">
          <span className="gh-insight__dom-badge">
            <DomainIcon domain={d.key} size={11} color={d.color} />
            <span style={{ color: d.color }}>{d.label}</span>
          </span>
          <span className={`gh-insight__urgency u-${insight.urgency}`}>
            {insight.urgency==='high'   && <><AlertTriangle size={10} strokeWidth={2.5} aria-hidden="true" /> জরুরি</>}
            {insight.urgency==='medium' && <><Zap size={10} strokeWidth={2.5} aria-hidden="true" /> মনোযোগ দিন</>}
            {insight.urgency==='low'    && <><CheckCircle2 size={10} strokeWidth={2.5} aria-hidden="true" /> ভালো</>}
          </span>
        </div>
        <ChevronDown size={14} className={`gh-insight__chevron${open?' open':''}`} strokeWidth={2} aria-hidden="true" />
      </button>
      <div className="gh-insight__title-row" onClick={() => setOpen(o => !o)} style={{ cursor:'pointer' }}>
        <h4 className="gh-insight__title">{insight.title}</h4>
        <span className="gh-insight__score" style={{ color: d.color, background: d.colorLight }}>{insight.score}%</span>
      </div>
      {open && (
        <div className="gh-insight__body">
          <p className="gh-insight__detail">{insight.detail}</p>
          <p className="gh-insight__acts-label">পরবর্তী পদক্ষেপ</p>
          {insight.actions.map((a, i) => (
            <div key={i} className="gh-insight__action">
              <span className="gh-insight__act-n">{i+1}</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   GOOGLE FORMS LEAD SUBMIT
   Replace these two constants with your actual Google Form data:
   1. GFORM_URL  — your form's action URL
   2. GFORM_FIELD — the entry.XXXXXXXXX field name for the phone field
══════════════════════════════════════════════════════════ */
const GFORM_URL   = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
const GFORM_PHONE = 'entry.XXXXXXXXX'   // phone field
const GFORM_SCORE = 'entry.YYYYYYYYY'   // overall score field (optional, add if present)
const GFORM_BAND  = 'entry.ZZZZZZZZZ'   // band label field (optional)

async function submitToGoogleForm(phone, overall, band) {
  /* Google Forms uses no-cors mode — we can't read the response,
     but the data lands in your Sheet. Silent fail is intentional. */
  const body = new URLSearchParams()
  body.append(GFORM_PHONE, phone)
  if (GFORM_SCORE !== 'entry.YYYYYYYYY') body.append(GFORM_SCORE, String(overall))
  if (GFORM_BAND  !== 'entry.ZZZZZZZZZ') body.append(GFORM_BAND,  band)
  try {
    await fetch(GFORM_URL, { method: 'POST', mode: 'no-cors', body })
  } catch (_) { /* network error — PDF still generates */ }
}

/* ══════════════════════════════════════════════════════════
   PHASE 4 — RESULT
══════════════════════════════════════════════════════════ */
function PhaseResult({ state, onRestart }) {
  const { answers } = state
  const { domainScores, overall } = calculateScores(answers)
  const overallBand    = getBand(overall)
  const domainInsights = getDomainInsights(domainScores)
  const topActions     = getTopPriorityActions(answers)
  const pkg            = recommendPackage(overall)
  const pkgMsg = `হ্যালো Digitalizen! আমার বিজনেস অডিট স্কোর ${overall}% (${overallBand.label})। ${pkg.waName} প্যাকেজ নিয়ে কথা বলতে চাই।`

  /* ── All state at top ─────────────────────────────────── */
  const [tab,      setTab]      = useState('overview')
  const [vis,      setVis]      = useState(false)
  const [showModal,setShowModal]= useState(false)
  const [phone,    setPhone]    = useState('')
  const [phoneErr, setPhoneErr] = useState('')
  const [uiStep,   setUiStep]   = useState('input') // 'input' | 'submitting' | 'generating' | 'done' | 'error'
  const [alreadyLead] = useState(() => {
    /* If they've submitted before, remember their number */
    try { return localStorage.getItem('gh_lead_phone') || '' } catch (_) { return '' }
  })

  /* ── Effects ──────────────────────────────────────────── */
  useEffect(() => { const t = setTimeout(() => setVis(true), 200); return () => clearTimeout(t) }, [])

  useEffect(() => {
    /* Persist score so the result page survives a refresh */
    try {
      localStorage.setItem('gh_last_score', JSON.stringify({
        overall, domainScores, band: overallBand.label, ts: Date.now(),
      }))
    } catch (_) {}
  }, [overall])

  useEffect(() => {
    /* Escape closes the modal (but not while generating) */
    if (!showModal) return
    const fn = e => {
      if (e.key === 'Escape' && uiStep !== 'submitting' && uiStep !== 'generating')
        closeModal()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [showModal, uiStep])

  /* ── Helpers ──────────────────────────────────────────── */
  const closeModal = () => {
    setShowModal(false)
    setPhone('')
    setPhoneErr('')
    setUiStep('input')
  }

  const openModal = () => {
    if (alreadyLead) {
      /* Number already captured — skip straight to PDF */
      runPdfFlow(alreadyLead)
    } else {
      setShowModal(true)
    }
  }

  const validatePhone = p => {
    const c = p.replace(/[\s\-()+]/g, '')
    if (!c) return 'নম্বরটি লিখুন'
    if (!/^(\+?880|0)?1[3-9]\d{8}$/.test(c))
      return 'সঠিক বাংলাদেশি নম্বর দিন · যেমন ০১৭XXXXXXXX'
    return ''
  }

  const handlePhoneChange = e => {
    setPhone(e.target.value)
    if (phoneErr) setPhoneErr('')
  }

  /* Master PDF flow: Google Form → PDF download */
  const runPdfFlow = async (phoneNumber) => {
    setUiStep('submitting')
    /* Step 1: Post to Google Forms */
    await submitToGoogleForm(phoneNumber, overall, overallBand.label)
    /* Save to localStorage so we skip modal on future visits */
    try { localStorage.setItem('gh_lead_phone', phoneNumber) } catch (_) {}
    PIXEL.pdfDownload(overall)
    /* Step 2: Generate PDF */
    setUiStep('generating')
    try {
      await generatePDF(domainScores, overall, domainInsights, pkg, topActions)
      setUiStep('done')
    } catch (err) {
      console.error('PDF generation failed:', err)
      setUiStep('error')
    }
  }

  const handleSubmit = async () => {
    const err = validatePhone(phone)
    if (err) { setPhoneErr(err); return }
    await runPdfFlow(phone)
  }

  /* ── Tab config ───────────────────────────────────────── */
  const TABS    = [
    { k:'overview', l:'ওভারভিউ', I: Award    },
    { k:'insights', l:'ইনসাইট',  I: Sparkles },
    { k:'actions',  l:'অ্যাকশন', I: Zap      },
  ]
  const uColors = ['#DC2626','#D97706','#2563EB']
  const uBgs    = ['#FEF2F2','#FFFBEB','#EFF6FF']

  /* ── Progress steps shown during loading ─────────────── */
  const LOAD_STEPS = [
    { label: 'নম্বর যাচাই হয়েছে',         done: true },
    { label: 'Google Sheet-এ সেভ হচ্ছে',   done: uiStep === 'generating' || uiStep === 'done' },
    { label: 'বাংলা ফন্ট লোড হচ্ছে',       done: uiStep === 'done' },
    { label: 'PDF তৈরি হচ্ছে',             done: uiStep === 'done', active: uiStep === 'generating' },
  ]

  return (
    <div className="gh-result gh-step">

      {/* ╔══════════════════════════════════════════════════╗
          ║         LEAD-LOCKED PDF MODAL                    ║
          ╚══════════════════════════════════════════════════╝ */}
      {showModal && (
        <div
          className="gh-pdf-overlay"
          role="dialog" aria-modal="true" aria-label="রিপোর্ট ডাউনলোড"
          onClick={e => {
            if (e.target === e.currentTarget && uiStep === 'input') closeModal()
          }}
        >
          <div className="gh-pdf-modal">

            {/* ── STEP: input ───────────────────────────── */}
            {uiStep === 'input' && (
              <>
                <button className="gh-pdf-modal__x" onClick={closeModal} aria-label="বন্ধ করুন">
                  ✕
                </button>

                {/* Header */}
                <div className="gh-pdf-modal__hd">
                  <div className="gh-pdf-modal__hd-icon">
                    <Download size={24} strokeWidth={2} />
                  </div>
                  <h3 className="gh-pdf-modal__title">আপনার রিপোর্টটি প্রস্তুত!</h3>
                  <p className="gh-pdf-modal__sub">
                    ডাউনলোড করতে আপনার WhatsApp নম্বরটি দিন।<br />
                    <span className="gh-pdf-modal__sub-muted">আমরা এখনই যোগাযোগ করব।</span>
                  </p>
                </div>

                {/* Score pill row */}
                <div className="gh-pdf-modal__scores">
                  <div className="gh-pdf-modal__overall-pill"
                    style={{ color: overallBand.color, background: overallBand.bg, borderColor: overallBand.color + '40' }}>
                    <span className="gh-pdf-modal__overall-num">{overall}%</span>
                    <span className="gh-pdf-modal__overall-band">{overallBand.label}</span>
                  </div>
                  <div className="gh-pdf-modal__domain-pills">
                    {AUDIT_DOMAINS.map(d => (
                      <span key={d.key} className="gh-pdf-modal__dpill"
                        style={{ color: d.color, background: d.colorLight }}>
                        <DomainIcon domain={d.key} size={9} color={d.color} />
                        {d.label.slice(0,4)} {domainScores[d.key]}%
                      </span>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div className="gh-pdf-modal__warn">
                  <AlertTriangle size={13} strokeWidth={2.5} style={{flexShrink:0, marginTop:1}} />
                  <p>
                    <strong>সতর্কতা:</strong> সঠিক WhatsApp নম্বর না দিলে রিপোর্ট জেনারেট হবে না এবং আপনি ডাউনলোড করতে পারবেন না।
                  </p>
                </div>

                {/* Input */}
                <div className={`gh-pdf-modal__field${phoneErr ? ' err' : ''}`}>
                  <label className="gh-pdf-modal__label">
                    WhatsApp নম্বর <span className="gh-pdf-modal__req">*</span>
                  </label>
                  <div className="gh-pdf-modal__input-row">
                    <span className="gh-pdf-modal__flag">🇧🇩 +880</span>
                    <input
                      type="tel"
                      className="gh-pdf-modal__input"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={handlePhoneChange}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                      autoFocus
                      maxLength={14}
                      inputMode="tel"
                    />
                  </div>
                  {phoneErr
                    ? <span className="gh-pdf-modal__err-txt">⚠ {phoneErr}</span>
                    : <span className="gh-pdf-modal__hint">যেমন: 01711234567 অথবা ০১৭XXXXXXXX</span>
                  }
                </div>

                {/* Submit button */}
                <button className="gh-pdf-modal__cta" onClick={handleSubmit}>
                  <Download size={15} strokeWidth={2.5} />
                  নম্বর নিশ্চিত করে রিপোর্ট ডাউনলোড করুন
                </button>
                <p className="gh-pdf-modal__privacy">
                  🔒 আপনার নম্বর নিরাপদ · কোনো স্প্যাম নেই
                </p>
              </>
            )}

            {/* ── STEP: submitting / generating ─────────── */}
            {(uiStep === 'submitting' || uiStep === 'generating') && (
              <div className="gh-pdf-modal__loading">
                <div className="gh-pdf-modal__spinner" />
                <p className="gh-pdf-modal__loading-title">ধন্যবাদ!</p>
                <p className="gh-pdf-modal__loading-sub">
                  আপনার রিপোর্টটি তৈরি হচ্ছে, একটু অপেক্ষা করুন…
                </p>
                <div className="gh-pdf-modal__steps">
                  {LOAD_STEPS.map((s, i) => (
                    <div key={i} className={`gh-pdf-modal__step${s.done ? ' done' : s.active ? ' active' : ''}`}>
                      <span className="gh-pdf-modal__step-dot">
                        {s.done ? '✓' : s.active ? '⟳' : '○'}
                      </span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STEP: done ────────────────────────────── */}
            {uiStep === 'done' && (
              <div className="gh-pdf-modal__done">
                <div className="gh-pdf-modal__done-icon">✅</div>
                <h3 className="gh-pdf-modal__done-title">ডাউনলোড শুরু হয়েছে!</h3>
                <p className="gh-pdf-modal__done-sub">
                  আপনার ব্র্যান্ডেড বিজনেস হেলথ রিপোর্টটি<br />সেভ হয়ে গেছে।
                </p>
                <div className="gh-pdf-modal__done-actions">
                  <button className="gh-pdf-modal__cta gh-pdf-modal__cta--outline"
                    onClick={() => runPdfFlow(alreadyLead || phone)}>
                    <Download size={14} strokeWidth={2.5} />
                    আবার ডাউনলোড করুন
                  </button>
                  <button className="gh-pdf-modal__cta" onClick={closeModal}>
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP: error ───────────────────────────── */}
            {uiStep === 'error' && (
              <div className="gh-pdf-modal__done">
                <div className="gh-pdf-modal__done-icon">⚠️</div>
                <h3 className="gh-pdf-modal__done-title">কিছু একটা সমস্যা হয়েছে</h3>
                <p className="gh-pdf-modal__done-sub">
                  PDF তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
                </p>
                <button className="gh-pdf-modal__cta" style={{marginTop:16}}
                  onClick={() => setUiStep('input')}>
                  আবার চেষ্টা করুন
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── Score hero ──────────────────────────────────── */}
      <div className="gh-result-hero" style={{ '--bc': overallBand.color, '--bb': overallBand.bg }}>
        <div className="gh-result-hero__bg" aria-hidden="true" />
        <p className="gh-result-hero__kicker">
          <Star size={11} strokeWidth={2.5} aria-hidden="true" /> বিজনেস হেলথ স্কোর
        </p>
        <div className="gh-result-hero__row">
          <ScoreRing pct={vis ? overall : 0} size={92} stroke={8} color={overallBand.color} />
          <div className="gh-result-hero__meta">
            <div className="gh-band-badge" style={{ color: overallBand.color, background: overallBand.bg }}>
              {overallBand.label}
            </div>
            <p className="gh-result-hero__desc">
              {overall<=30 && 'আপনার বিজনেসে গুরুত্বপূর্ণ পরিবর্তন দরকার।'}
              {overall>30&&overall<=50 && 'ভালো ফাউন্ডেশন আছে, গ্যাপগুলো বন্ধ করতে হবে।'}
              {overall>50&&overall<=70 && 'গড় মানের বিজনেস। উন্নতির স্পষ্ট সুযোগ আছে।'}
              {overall>70&&overall<=85 && 'শক্তিশালী বিজনেস! স্কেল করার সঠিক সময়।'}
              {overall>85 && 'অসাধারণ! আপনার বিজনেস এলিট লেভেলে আছে।'}
            </p>
          </div>
        </div>
        <div className="gh-result-hero__domains">
          {AUDIT_DOMAINS.map(d => {
            const score = domainScores[d.key]
            return (
              <div key={d.key} className="gh-ds">
                <div className="gh-ds__top">
                  <DomainIcon domain={d.key} size={12} color={d.color} />
                  <span className="gh-ds__lbl">{d.label}</span>
                  <span className="gh-ds__pct" style={{ color: d.color }}>{score}%</span>
                </div>
                <div className="gh-ds__track">
                  <div className="gh-ds__fill" style={{
                    width: vis ? `${score}%` : '0%',
                    background: `linear-gradient(90deg, ${d.color}, ${d.colorMid})`,
                    transition: 'width 1.1s cubic-bezier(0.34,1.56,0.64,1) 0.4s',
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Action strip ────────────────────────────────── */}
      <div className="gh-result-actions">
        <button className="gh-pdf-btn" onClick={openModal}>
          <Download size={14} strokeWidth={2.5} aria-hidden="true" />
          পুরো রিপোর্ট ডাউনলোড করুন (ফ্রি)
          {alreadyLead && <span className="gh-pdf-btn__badge">✓ নম্বর সেভ</span>}
        </button>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent(pkgMsg)}`}
          target="_blank" rel="noopener noreferrer"
          className="gh-wa-consult-btn"
          onClick={() => PIXEL.pkgInquiry(pkg.name, overall)}
        >
          <WaIcon size={14} />
          পরামর্শ নিন
        </a>
      </div>

      {/* ── Tabs ────────────────────────────────────────── */}
      <div className="gh-tabs" role="tablist">
        {TABS.map(t => (
          <button key={t.k} role="tab" aria-selected={tab===t.k}
            className={`gh-tab${tab===t.k?' active':''}`}
            onClick={() => setTab(t.k)}>
            <t.I size={12} strokeWidth={2} aria-hidden="true" />
            {t.l}
          </button>
        ))}
      </div>

      {/* ── TAB: OVERVIEW ───────────────────────────────── */}
      {tab==='overview' && (
        <div className="gh-tab-pane gh-step" role="tabpanel">
          <p className="gh-section-lbl">সবচেয়ে গুরুত্বপূর্ণ ৩টি উন্নতির জায়গা</p>
          <div className="gh-priorities">
            {topActions.slice(0,3).map((a, i) => {
              const d = AUDIT_DOMAINS.find(d => d.key === a.domain)
              return (
                <div key={i} className="gh-priority" style={{ borderLeftColor: uColors[i], background: uBgs[i] }}>
                  <div className="gh-priority__num" style={{ background: uColors[i] }}>{i+1}</div>
                  <div className="gh-priority__body">
                    <div className="gh-priority__hdr">
                      <QIcon iconKey={a.iconKey} size={13} color={d.color} strokeWidth={1.75} aria-hidden="true" />
                      <span className="gh-priority__q">{a.q}</span>
                    </div>
                    <div className="gh-priority__tags">
                      <span className="gh-priority__dom" style={{ color: d.color, background: d.colorLight }}>
                        <DomainIcon domain={d.key} size={10} color={d.color} aria-hidden="true" />
                        {d.label}
                      </span>
                      <span className="gh-priority__gap">{Math.round((a.gap/4)*100)}% উন্নতির সুযোগ</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="gh-section-lbl" style={{ marginTop: 16 }}>প্রস্তাবিত প্যাকেজ</p>
          <div className="gh-rec-pkg">
            {pkg.popular && (
              <div className="gh-rec-pkg__banner">
                <Star size={11} strokeWidth={2.5} aria-hidden="true" /> সবচেয়ে জনপ্রিয়
              </div>
            )}
            <div className="gh-rec-pkg__body">
              <div className="gh-rec-pkg__info">
                <h4 className="gh-rec-pkg__name">{pkg.name}</h4>
                <p className="gh-rec-pkg__tag">{pkg.tagline}</p>
                <ul className="gh-rec-pkg__feats">
                  {pkg.features.map(f => (
                    <li key={f}><CheckCircle2 size={12} strokeWidth={2.5} color="#059669" aria-hidden="true" />{f}</li>
                  ))}
                </ul>
              </div>
              <div className="gh-rec-pkg__price-col">
                <span className="gh-rec-pkg__price">{pkg.price}</span>
                {pkg.priceNote && <span className="gh-rec-pkg__note">{pkg.priceNote}</span>}
                <span className="gh-rec-pkg__hl">{pkg.highlight}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: INSIGHTS ───────────────────────────────── */}
      {tab==='insights' && (
        <div className="gh-tab-pane gh-step" role="tabpanel">
          <p className="gh-section-lbl">ডোমেইন-ওয়াইজ বিশ্লেষণ</p>
          <div className="gh-insights-list">
            {domainInsights.map((ins, i) => (
              <InsightCard key={ins.domain} insight={ins} defaultOpen={i===0} />
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ACTIONS ────────────────────────────────── */}
      {tab==='actions' && (
        <div className="gh-tab-pane gh-step" role="tabpanel">
          <p className="gh-section-lbl">৩০-দিনের গ্রোথ অ্যাকশন প্ল্যান</p>
          {domainInsights.map(ins => {
            const d = ins.domainMeta
            return (
              <div key={ins.domain} className="gh-action-block">
                <div className="gh-action-block__hdr" style={{ borderLeftColor: d.color }}>
                  <DomainIcon domain={d.key} size={13} color={d.color} aria-hidden="true" />
                  <span style={{ color: d.color }}>{d.label}</span>
                  <span className="gh-action-block__sc" style={{ color: d.color, background: d.colorLight }}>
                    {ins.score}%
                  </span>
                </div>
                {ins.actions.map((a, i) => (
                  <div key={i} className="gh-action-item">
                    <div className="gh-action-item__wk" style={{ color: d.color, background: d.colorLight }}>সপ্তাহ {i+1}</div>
                    <span className="gh-action-item__txt">{a}</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Bottom WA consult strip ──────────────────────── */}
      <div className="gh-wa-section">
        <p className="gh-wa-section__lbl">
          <MessageCircle size={12} strokeWidth={2} aria-hidden="true" />
          কাস্টম গ্রোথ স্ট্র্যাটেজি পান
        </p>
        <a href={`https://wa.me/${WA}?text=${encodeURIComponent(pkgMsg)}`}
          target="_blank" rel="noopener noreferrer"
          className="gh-wa-secondary"
          onClick={() => PIXEL.pkgInquiry(pkg.name, overall)}>
          <WaIcon size={13} />
          {pkg.name} নিয়ে আলোচনা করুন
        </a>
      </div>

      <button className="gh-result__restart" onClick={onRestart}>
        <RotateCcw size={12} strokeWidth={2} aria-hidden="true" />
        নতুন অডিট শুরু করুন
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   ROOT COMPONENT
══════════════════════════════════════════════════════════ */
export default function GrowthHub() {
  const [state, setState] = useState(INIT_STATE)
  const firedLead       = useRef(false)
  const firedDomain     = useRef({})
  const total           = AUDIT_QUESTIONS.length

  /* Section view pixel — fires once on mount */
  useEffect(() => { PIXEL.sectionView() }, [])

  /* Audit complete pixel — fires once when result phase begins */
  useEffect(() => {
    if (state.phase === 'result' && !firedLead.current) {
      const { overall } = calculateScores(state.answers)
      const band = getBand(overall)
      PIXEL.auditComplete(overall, band.labelEn)
      firedLead.current = true
    }
  }, [state.phase])

  const handleStart = () => {
    PIXEL.auditStart()
    setState(s => ({ ...s, phase: 'audit', currentQ: 0 }))
  }

  const handleAnswer = (qId, val) => {
    const ans  = { ...state.answers, [qId]: val }
    const next = state.currentQ + 1

    /* Domain-completion pixels */
    if (next === 5  && !firedDomain.current.Marketing)  { PIXEL.domainDone('Marketing');  firedDomain.current.Marketing  = true }
    if (next === 10 && !firedDomain.current.Operations) { PIXEL.domainDone('Operations'); firedDomain.current.Operations = true }

    setState(s => next >= total
      ? { ...s, answers: ans, phase: 'analyzing' }
      : { ...s, answers: ans, currentQ: next }
    )
  }

  const handleBack = () => {
    if (state.currentQ > 0) setState(s => ({ ...s, currentQ: s.currentQ - 1 }))
  }

  const handleRestart = () => {
    setState(INIT_STATE)
    firedLead.current  = false
    firedDomain.current = {}
  }

  const prog = state.phase==='entry'     ? 0
             : state.phase==='audit'     ? Math.round((state.currentQ / total) * 93)
             : state.phase==='analyzing' ? 97
             : 100

  return (
    <section id="growth-hub" className="hub-section" aria-label="গ্রোথ হাব অডিট">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০২</span>
          <span className="section-title-right">গ্রোথ হাব</span>
        </div>
        <h2 className="hub-heading">আপনার বিজনেস হেলথ অডিট</h2>
        <p className="hub-sub">মার্কেটিং · অপারেশনস · ফাইন্যান্স — তিনটি বিভাগে গভীর বিশ্লেষণ।</p>

        <div className="hub-card">
          {state.phase !== 'entry' && (
            <div className="gh-master-prog" role="progressbar" aria-valuenow={prog} aria-valuemin={0} aria-valuemax={100}>
              <div className="gh-master-prog__fill" style={{ width: `${prog}%` }} />
            </div>
          )}

          {state.phase === 'audit' && (
            <div className="gh-topbar">
              <div className="gh-topbar__dots" aria-hidden="true">
                {Array.from({ length: total }).map((_, i) => (
                  <div key={i} className={`audit-dot${i < state.currentQ ? ' done' : i === state.currentQ ? ' active' : ''}`} />
                ))}
              </div>
              <span className="gh-topbar__cnt">
                {state.currentQ+1}<span className="gh-topbar__sep">/</span>{total}
              </span>
              <button className="gh-topbar__rst" onClick={handleRestart} aria-label="অডিট রিস্টার্ট করুন">
                <RotateCcw size={12} strokeWidth={2} />
              </button>
            </div>
          )}

          {state.phase === 'entry'     && <PhaseEntry    onStart={handleStart} />}
          {state.phase === 'audit'     && <PhaseAudit    state={state} onAnswer={handleAnswer} onBack={handleBack} />}
          {state.phase === 'analyzing' && <PhaseAnalyzing onDone={() => setState(s => ({ ...s, phase: 'result' }))} />}
          {state.phase === 'result'    && <PhaseResult   state={state} onRestart={handleRestart} />}
        </div>
      </div>
    </section>
  )
}
