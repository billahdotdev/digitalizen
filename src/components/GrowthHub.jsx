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
        {/* Wrap together so % sits naturally on baseline next to the number */}
        <span className="score-ring__value" style={{ color }}>
          {disp}<span className="score-ring__pct">%</span>
        </span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BENGALI FONT LOADER
   ──────────────────────────────────────────────────────────
   WHY PREVIOUS ATTEMPTS FAILED:
   jsPDF's font parser ONLY handles raw TTF/OTF binary.
   woff2 is a Brotli-compressed format — jsPDF has no decoder
   for it, so every character renders as a broken glyph box.

   THE FIX:
   1. Call Google Fonts CSS API with an IE8 User-Agent string.
      Modern UA → woff2. Old UA → raw TTF URLs in the CSS.
   2. Parse out the first TTF URL from that CSS response.
   3. Fetch that URL and encode as base64 for jsPDF.
   4. Register with .ttf extension so jsPDF parses correctly.
   Multiple CDN fallbacks ensure it works if Google is blocked.
══════════════════════════════════════════════════════════ */
let _bnFontB64 = null   // null = not tried | false = failed | string = ready

async function loadBengaliFont() {
  if (_bnFontB64 !== null) return _bnFontB64

  // Convert ArrayBuffer → base64 without stack overflow
  const bufToB64 = (buf) => {
    const bytes = new Uint8Array(buf)
    let s = ''
    for (let i = 0; i < bytes.length; i += 8192)
      s += String.fromCharCode(...bytes.subarray(i, Math.min(i + 8192, bytes.length)))
    return btoa(s)
  }

  // ── Strategy 1: Google Fonts CSS API with legacy UA → TTF ──
  try {
    const cssResp = await fetch(
      'https://fonts.googleapis.com/css?family=Hind+Siliguri:400&subset=bengali',
      { headers: { 'User-Agent': 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0)' } }
    )
    if (cssResp.ok) {
      const css = await cssResp.text()
      // Extract all src URLs — old-format response gives .ttf directly
      const matches = [...css.matchAll(/url\(([^)'"]+\.(?:ttf|otf))\)/gi)]
      for (const m of matches) {
        try {
          const fr = await fetch(m[1])
          if (fr.ok) {
            _bnFontB64 = bufToB64(await fr.arrayBuffer())
            return _bnFontB64
          }
        } catch (_) {}
      }
    }
  } catch (_) {}

  // ── Strategy 2: Raw TTF from CDN mirrors ──
  const RAW_TTF = [
    'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/hindsiliguri/HindSiliguri-Regular.ttf',
    'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@main/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf',
    'https://raw.githubusercontent.com/google/fonts/main/ofl/hindsiliguri/HindSiliguri-Regular.ttf',
  ]
  for (const url of RAW_TTF) {
    try {
      const r = await fetch(url)
      if (r.ok) {
        _bnFontB64 = bufToB64(await r.arrayBuffer())
        return _bnFontB64
      }
    } catch (_) {}
  }

  _bnFontB64 = false
  return false
}

/* ══════════════════════════════════════════════════════════
   PDF GENERATOR — Digitalizen Brand System v3
   ──────────────────────────────────────────────────────────
   Brand colours (from official brand guide):
     Primary Blue  #1F4BFF   Background    #F5F7FF
     Text          #0B1220   Muted/Sub     #5A667A
     Border        #E6EAF5   Dark Panel    #12172B
   Square bullets (not ✓) per brand guide.
   URL: digitalizen.billah.dev
══════════════════════════════════════════════════════════ */
async function generatePDF(domainScores, overall, domainInsights, pkg, topActions) {

  /* ── 1. Load jsPDF ── */
  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = res
      s.onerror = () => rej(new Error('jsPDF CDN load failed — check your network'))
      document.head.appendChild(s)
    })
  }

  /* ── 2. Load Bengali font ── */
  const bnB64 = await loadBengaliFont()

  /* ── 3. Create document ── */
  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  /* ── 4. Register Bengali TTF ── */
  let bnOK = false
  if (bnB64) {
    try {
      // MUST use .ttf extension — jsPDF identifies format by file extension
      doc.addFileToVFS('HindSiliguri.ttf', bnB64)
      doc.addFont('HindSiliguri.ttf', 'HindSiliguri', 'normal')
      // Sanity-check: switching to the font should not throw
      doc.setFont('HindSiliguri', 'normal')
      doc.setFont('helvetica', 'normal') // reset to safe default
      bnOK = true
    } catch (e) {
      console.warn('[PDF] Bengali font registration failed:', e.message)
    }
  }

  /* ── 5. Layout constants — brand spacing ── */
  const W = 210, mg = 14, cW = W - mg * 2
  let y = 0

  /* ── 6. Primitive helpers ── */
  const h2r = (hex) => [
    parseInt(hex.slice(1,3),16),
    parseInt(hex.slice(3,5),16),
    parseInt(hex.slice(5,7),16),
  ]
  const rgb   = (hex) => { const [r,g,b] = h2r(hex); return {r,g,b} }
  const setFill = (hex) => { const {r,g,b} = rgb(hex); doc.setFillColor(r,g,b) }
  const setTxt  = (hex) => { const {r,g,b} = rgb(hex); doc.setTextColor(r,g,b) }
  const setDrw  = (hex, lw=0.25) => { const {r,g,b} = rgb(hex); doc.setDrawColor(r,g,b); doc.setLineWidth(lw) }

  // Filled rectangle
  const box = (x,fy,w,h,hex) => { setFill(hex); doc.rect(x,fy,w,h,'F') }

  // Thin horizontal rule
  const rule = (fy, hex='#E6EAF5') => { setDrw(hex); doc.line(mg, fy, W-mg, fy) }

  // Page overflow guard — returns adjusted y
  const guard = (fy, need) => {
    if (fy + need > 275) {
      doc.addPage()
      // Restore top accent stripe on new page
      box(0, 0, W, 2.5, '#1F4BFF')
      return 12
    }
    return fy
  }

  // Font helpers — en() for latin, bn() for Bengali
  const en = (sz, style='normal') => { doc.setFontSize(sz); doc.setFont('helvetica', style) }
  const bn = (sz) => { doc.setFontSize(sz); doc.setFont(bnOK ? 'HindSiliguri' : 'helvetica', 'normal') }

  // Wrapping Bengali text block — returns number of lines rendered
  const bnBlock = (text, x, fy, maxW, sz=7) => {
    bn(sz)
    const lines = doc.splitTextToSize(String(text), maxW)
    doc.text(lines, x, fy)
    return lines.length
  }

  /* Shared data */
  const band = getBand(overall)
  const date = new Date().toLocaleDateString('en-GB', {year:'numeric',month:'long',day:'numeric'})
  const SITE = 'digitalizen.billah.dev'

  const domCfg = [
    { key:'marketing',  labelEn:'Marketing',  labelBn:'মার্কেটিং',  col:'#1F4BFF', score: domainScores.marketing  },
    { key:'operations', labelEn:'Operations', labelBn:'অপারেশনস', col:'#7C3AED', score: domainScores.operations },
    { key:'finance',    labelEn:'Finance',    labelBn:'ফাইন্যান্স',  col:'#059669', score: domainScores.finance    },
  ]

  /* ════════════════════════════════════════════════════
     ① COVER HEADER  —  dark panel #12172B
  ════════════════════════════════════════════════════ */
  box(0, 0, W, 68, '#12172B')   // dark panel
  box(0, 0, W,  3, '#1F4BFF')   // primary blue top stripe

  // Brand wordmark
  en(21,'bold'); setTxt('#FFFFFF')
  doc.text('DIGITALIZEN', mg, 21)
  en(6.5,'normal'); setTxt('#5A667A')
  doc.text('Growth Intelligence Platform', mg, 29)

  // Report label (right)
  en(7,'bold'); setTxt('#1F4BFF')
  doc.text('BUSINESS HEALTH REPORT', W-mg, 18, {align:'right'})
  en(6.5,'normal'); setTxt('#5A667A')
  doc.text(date, W-mg, 26, {align:'right'})
  doc.text('Confidential \u00B7 Internal Use Only', W-mg, 33, {align:'right'})

  // Big score
  const bandRGB = rgb(band.color)
  en(40,'bold'); doc.setTextColor(bandRGB.r, bandRGB.g, bandRGB.b)
  doc.text(`${overall}%`, mg, 60)

  // Score labels to the right of the number
  const numW = doc.getTextWidth(`${overall}%`)
  en(8,'bold'); setTxt('#FFFFFF')
  doc.text('Overall Business Health Score', mg + numW + 6, 53)
  en(9,'bold'); doc.setTextColor(bandRGB.r, bandRGB.g, bandRGB.b)
  doc.text(band.labelEn.toUpperCase(), mg + numW + 6, 63)
  bn(9); setTxt('#FFFFFF')
  // Bengali band label — render right of the English label
  const enLabelW = doc.getStringUnitWidth(band.labelEn.toUpperCase()) * 9 / doc.internal.scaleFactor
  doc.text(band.label, mg + numW + 6 + enLabelW + 4, 63)

  y = 76

  /* ════════════════════════════════════════════════════
     ② DOMAIN PERFORMANCE BARS
  ════════════════════════════════════════════════════ */
  en(6.5,'bold'); setTxt('#5A667A')
  doc.text('DOMAIN PERFORMANCE', mg, y); y += 2
  rule(y); y += 5

  domCfg.forEach(d => {
    const dRGB = rgb(d.col)

    // Labels
    en(7.5,'bold'); setTxt('#0B1220')
    doc.text(d.labelEn, mg, y + 3)
    bn(7); doc.setTextColor(dRGB.r, dRGB.g, dRGB.b)
    doc.text(d.labelBn, mg + doc.getTextWidth(d.labelEn) + 3, y + 3)

    // Score badge (right)
    en(8,'bold'); doc.setTextColor(dRGB.r, dRGB.g, dRGB.b)
    doc.text(`${d.score}%`, W-mg, y+3, {align:'right'})
    en(6,'normal'); setTxt('#5A667A')
    doc.text(getBand(d.score).labelEn, W-mg-14, y+3, {align:'right'})

    // Bar track + fill
    box(mg, y+5, cW, 3.5, '#E6EAF5')
    if (d.score > 0) box(mg, y+5, Math.max((d.score/100)*cW, 1.5), 3.5, d.col)

    y += 14
  })

  y += 4; rule(y); y += 8

  /* ════════════════════════════════════════════════════
     ③ TOP PRIORITY ACTIONS
  ════════════════════════════════════════════════════ */
  en(6.5,'bold'); setTxt('#5A667A')
  doc.text('TOP PRIORITY ACTIONS', mg, y); y += 2
  rule(y); y += 5

  const urgColors = ['#DC2626','#D97706','#2563EB']
  const urgBgs    = ['#FEF2F2','#FFF7ED','#EFF6FF']
  const urgLabels = ['CRITICAL','HIGH PRIORITY','REVIEW']

  topActions.slice(0,3).forEach((a,i) => {
    // Pre-calculate height so we can draw box first
    bn(7)
    const qLines = doc.splitTextToSize(String(a.q), cW - 14)
    const boxH   = Math.max(22, 13 + qLines.length * 4.5)
    y = guard(y, boxH + 3)

    box(mg, y, cW, boxH, urgBgs[i])
    // Left accent bar (brand style: thin coloured strip)
    box(mg, y, 3.5, boxH, urgColors[i])

    const uRGB = rgb(urgColors[i])
    en(5.5,'bold'); doc.setTextColor(uRGB.r, uRGB.g, uRGB.b)
    doc.text(urgLabels[i], mg+7, y+6)

    setTxt('#0B1220'); bn(7)
    doc.text(qLines, mg+7, y+12)
    y += boxH + 3
  })

  y += 2; rule(y); y += 8

  /* ════════════════════════════════════════════════════
     ④ DOMAIN INSIGHTS & RECOMMENDATIONS
  ════════════════════════════════════════════════════ */
  en(6.5,'bold'); setTxt('#5A667A')
  doc.text('DOMAIN INSIGHTS & RECOMMENDATIONS', mg, y); y += 2
  rule(y); y += 6

  domainInsights.forEach(ins => {
    const d = domCfg.find(d => d.key === ins.domain)
    if (!d) return
    const dRGB = rgb(d.col)

    y = guard(y, 42)

    // Domain header strip — solid colour
    box(mg, y, cW, 9, d.col)
    en(7.5,'bold'); setTxt('#FFFFFF')
    doc.text(d.labelEn.toUpperCase(), mg+5, y+6.2)
    bn(7); setTxt('#FFFFFF')
    // Bengali label right of English
    doc.text(d.labelBn, mg+5+doc.getTextWidth(d.labelEn.toUpperCase())+3, y+6.2)
    en(7,'normal'); setTxt('#FFFFFF')
    doc.text(`${d.score}% \u00B7 ${ins.band.labelEn}`, W-mg-4, y+6.2, {align:'right'})
    y += 13

    // Insight title (Bengali) — domain colour
    bn(8); doc.setTextColor(dRGB.r, dRGB.g, dRGB.b)
    const titleLines = doc.splitTextToSize(String(ins.title), cW-6)
    doc.text(titleLines, mg+3, y)
    y += titleLines.length * 5 + 2

    // Detail text (Bengali) — muted
    bn(6.5); setTxt('#5A667A')
    const detLines = doc.splitTextToSize(String(ins.detail), cW-6)
    doc.text(detLines, mg+3, y)
    y += detLines.length * 4 + 4

    // Action items — square bullet (brand guide: square not checkmark)
    ins.actions.forEach((act, ai) => {
      y = guard(y, 10)
      // Square bullet in domain colour
      doc.setFillColor(dRGB.r, dRGB.g, dRGB.b)
      doc.rect(mg+3, y-2.2, 1.8, 1.8, 'F')
      // Number label
      en(6.5,'bold'); doc.setTextColor(dRGB.r, dRGB.g, dRGB.b)
      doc.text(`${ai+1}`, mg+2, y)
      // Action text (Bengali)
      bn(6.5); setTxt('#0B1220')
      const actLines = doc.splitTextToSize(String(act), cW-14)
      doc.text(actLines, mg+9, y)
      y += actLines.length * 4 + 2
    })
    y += 7
  })

  /* ════════════════════════════════════════════════════
     ⑤ RECOMMENDED PACKAGE
  ════════════════════════════════════════════════════ */
  y = guard(y, 54)
  rule(y); y += 5
  en(6.5,'bold'); setTxt('#5A667A')
  doc.text('RECOMMENDED PACKAGE', mg, y); y += 2
  rule(y); y += 5

  // Card with left blue accent bar — brand background #F5F7FF
  const pkgCardH = 46
  box(mg, y, cW, pkgCardH, '#F5F7FF')
  box(mg, y,  4, pkgCardH, '#1F4BFF')

  en(10,'bold'); setTxt('#0B1220')
  doc.text(pkg.name, mg+8, y+9)
  en(11,'bold'); setTxt('#1F4BFF')
  doc.text(pkg.price, W-mg-4, y+9, {align:'right'})

  en(6.5,'normal'); setTxt('#5A667A')
  const tagLines = doc.splitTextToSize(pkg.tagline, cW/2)
  doc.text(tagLines, mg+8, y+16)

  // Features in 2-column grid with square bullets
  pkg.features.forEach((f, fi) => {
    const col = fi%2===0 ? mg+8 : mg+8+(cW/2)+4
    const row = y + 26 + Math.floor(fi/2)*7
    setFill('#1F4BFF'); doc.rect(col-0.5, row-2, 1.8, 1.8, 'F')
    en(6.5,'normal'); setTxt('#0B1220')
    doc.text(f, col+3, row)
  })
  y += pkgCardH + 7

  /* ════════════════════════════════════════════════════
     ⑥ GROW WITH DIGITALIZEN — CTA DARK PANEL
  ════════════════════════════════════════════════════ */
  y = guard(y, 62)

  const ctaH = 62
  box(mg, y, cW, ctaH, '#12172B')
  box(mg, y, cW,   3,  '#1F4BFF')

  // Headline (Bengali) — white
  bn(10); setTxt('#FFFFFF')
  const ctaHdLines = doc.splitTextToSize(
    'আপনার বিজনেসকে পরবর্তী স্তরে নিয়ে যান', cW-12
  )
  doc.text(ctaHdLines, mg+6, y+12)

  // Subheadline (Bengali) — primary blue
  bn(7.5); setTxt('#93C5FD')
  const ctaSubLines = doc.splitTextToSize(
    'Digitalizen আপনার ব্যবসার টেকনিক্যাল ও ক্রিয়েটিভ উভয় দিক থেকেই সহায়তা করে।',
    cW-12
  )
  doc.text(ctaSubLines, mg+6, y+20)

  // 4 benefit items — 2×2 grid
  const benefits = [
    { en:'Data-Driven Ads',   bn:'ডেটা-চালিত বিজ্ঞাপন' },
    { en:'Creative Content',  bn:'প্রফেশনাল ক্রিয়েটিভ' },
    { en:'Tech & Automation', bn:'টেক ও অটোমেশন' },
    { en:'Growth Strategy',   bn:'কাস্টম গ্রোথ প্ল্যান' },
  ]
  const halfW = cW/2
  benefits.forEach((b, bi) => {
    const col = bi%2===0 ? mg+6 : mg+6+halfW
    const row = y + 33 + Math.floor(bi/2)*10
    // Square bullet — primary blue (brand style)
    setFill('#1F4BFF'); doc.rect(col, row-2.2, 2, 2, 'F')
    en(6.5,'bold'); setTxt('#FFFFFF')
    doc.text(b.en, col+4, row)
    bn(6); setTxt('#5A667A')
    doc.text(b.bn, col+4, row+5)
  })

  // CTA buttons row
  const btnY = y + ctaH - 13
  // WhatsApp — green
  box(mg+6, btnY, 74, 8, '#128C7E')
  en(6.5,'bold'); setTxt('#FFFFFF')
  doc.text('+880 1711-992558  (WhatsApp)', mg+9, btnY+5.5)
  // Web — primary blue
  box(mg+84, btnY, 56, 8, '#1F4BFF')
  en(6.5,'bold'); setTxt('#FFFFFF')
  doc.text(SITE, mg+87, btnY+5.5)

  y += ctaH + 8

  /* ════════════════════════════════════════════════════
     ⑦ FOOTER — repeated on every page
  ════════════════════════════════════════════════════ */
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    box(0, 286, W, 11, '#12172B')
    box(0, 294, W,  3, '#1F4BFF')
    en(6,'normal'); setTxt('#5A667A')
    doc.text(
      `${BRAND} \u00B7 GrowthHub Business Audit \u00B7 ${date} \u00B7 Page ${p} / ${totalPages}`,
      mg, 292
    )
    en(6,'bold'); setTxt('#1F4BFF')
    doc.text(SITE, W-mg, 292, {align:'right'})
  }

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
