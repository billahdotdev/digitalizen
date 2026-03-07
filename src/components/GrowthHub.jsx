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
        <span className="score-ring__num" style={{ color }}>{disp}</span>
        <span className="score-ring__pct">%</span>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   BENGALI TEXT → CANVAS → PDF  (full ligature support)
   ──────────────────────────────────────────────────────────
   jsPDF has NO shaping engine — Bengali ligatures (যুক্তাক্ষর)
   require HarfBuzz GSUB/GPOS processing that jsPDF cannot do.
   Loading any TTF only renders isolated codepoints = broken glyphs.

   THE FIX: browser Canvas 2D uses the OS shaping pipeline
   (HarfBuzz via Pango/CoreText/DirectWrite). We render every
   Bengali string to an offscreen canvas → PNG → doc.addImage().
   English stays as real PDF vectors (searchable, sharp).
   Font: Noto Sans Bengali — loaded via @font-face in the browser.
══════════════════════════════════════════════════════════ */

/* ── 1. Load Noto Sans Bengali in the browser ────────────── */
let _bnReady = null
function ensureNotoSansBengali() {
  if (_bnReady) return _bnReady
  _bnReady = (async () => {
    if (!document.getElementById('__gh-noto-bn')) {
      const s = document.createElement('style')
      s.id = '__gh-noto-bn'
      s.textContent = `
        @font-face {
          font-family:'Noto Sans Bengali';
          font-weight:400;
          src:url('https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolLudU.woff2') format('woff2');
        }
        @font-face {
          font-family:'Noto Sans Bengali';
          font-weight:700;
          src:url('https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolJudU.woff2') format('woff2');
        }
      `
      document.head.appendChild(s)
    }
    try {
      await Promise.all([
        document.fonts.load('400 20px "Noto Sans Bengali"'),
        document.fonts.load('700 20px "Noto Sans Bengali"'),
      ])
    } catch (_) {}
    await new Promise(r => setTimeout(r, 400))
  })()
  return _bnReady
}

/* ── 2. Render Bengali string → canvas PNG ───────────────── */
const _MM2PX = 96 / 25.4   // px/mm @ 96dpi
const _PT2PX = 96 / 72     // px/pt
const _SC    = 3            // 3× retina scale

function bnRender(text, sizePt, maxWMm, colorHex = '#0B1220', weight = '400') {
  const t = String(text ?? '').trim()
  if (!t) return { dataUrl: null, wMm: 0, hMm: 0 }
  const canvas  = document.createElement('canvas')
  const ctx     = canvas.getContext('2d')
  const pxSize  = sizePt * _PT2PX * _SC
  const maxPxW  = maxWMm * _MM2PX * _SC
  const lineH   = pxSize * 1.65
  const font    = `${weight} ${pxSize}px "Noto Sans Bengali", serif`
  ctx.font = font
  const words = t.split(/\s+/)
  const lines = []; let cur = ''
  for (const w of words) {
    const trial = cur ? cur + ' ' + w : w
    if (ctx.measureText(trial).width > maxPxW && cur) { lines.push(cur); cur = w }
    else cur = trial
  }
  if (cur) lines.push(cur)
  const measW = Math.max(...lines.map(l => ctx.measureText(l).width))
  const padX = Math.ceil(pxSize * 0.06), padY = Math.ceil(pxSize * 0.22)
  canvas.width  = Math.ceil(Math.min(measW, maxPxW) + padX * 2)
  canvas.height = Math.ceil(lines.length * lineH + padY * 2)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = font; ctx.fillStyle = colorHex; ctx.textBaseline = 'top'
  lines.forEach((line, i) => ctx.fillText(line, padX, padY + i * lineH))
  return {
    dataUrl: canvas.toDataURL('image/png'),
    wMm: canvas.width  / (_SC * _MM2PX),
    hMm: canvas.height / (_SC * _MM2PX),
  }
}

/* ── 3. Embed Bengali PNG in PDF, return mm height used ──── */
function pdfBn(doc, text, xMm, yMm, sizePt, maxWMm, colorHex = '#0B1220', weight = '400') {
  const { dataUrl, wMm, hMm } = bnRender(text, sizePt, maxWMm, colorHex, weight)
  if (!dataUrl || hMm === 0) return 0
  doc.addImage(dataUrl, 'PNG', xMm, yMm, Math.min(wMm, maxWMm), hMm)
  return hMm
}

/* ══════════════════════════════════════════════════════════
   PDF GENERATOR  —  Digitalizen Brand System
   Brand: Primary #1F4BFF · Text #0B1220 · Muted #5A667A
          Border #E6EAF5  · Dark panel #12172B · Bg #F5F7FF
   Bengali → canvas PNG  ·  English → real PDF vectors
   URL: digitalizen.billah.dev
══════════════════════════════════════════════════════════ */
async function generatePDF(domainScores, overall, domainInsights, pkg, topActions) {

  await ensureNotoSansBengali()

  if (!window.jspdf) {
    await new Promise((res, rej) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = res
      s.onerror = () => rej(new Error('jsPDF CDN load failed'))
      document.head.appendChild(s)
    })
  }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210, mg = 14, cW = W - mg * 2
  const SITE = 'digitalizen.billah.dev'
  const band = getBand(overall)
  const date = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })
  let y = 0

  /* Primitives */
  const h2r = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)]
  const box  = (x,fy,w,h,hex) => { doc.setFillColor(...h2r(hex)); doc.rect(x,fy,w,h,'F') }
  const tc   = hex => doc.setTextColor(...h2r(hex))
  const en   = (sz, style='normal') => { doc.setFontSize(sz); doc.setFont('helvetica', style) }
  const bn   = (text, x, fy, sz, maxW, color='#0B1220', wt='400') =>
    pdfBn(doc, text, x, fy, sz, maxW, color, wt)
  const rule = fy => { doc.setDrawColor(...h2r('#E6EAF5')); doc.setLineWidth(0.25); doc.line(mg,fy,W-mg,fy) }
  const pc   = (fy, need) => { if (fy+need > 276) { doc.addPage(); box(0,0,W,2.5,'#1F4BFF'); return 12 } return fy }

  const domCfg = [
    { key:'marketing',  enLabel:'Marketing',  bnLabel:'\u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982',  col:'#1F4BFF', score: domainScores.marketing  },
    { key:'operations', enLabel:'Operations', bnLabel:'\u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09B8', col:'#7C3AED', score: domainScores.operations },
    { key:'finance',    enLabel:'Finance',    bnLabel:'\u09AB\u09BE\u0987\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8',  col:'#059669', score: domainScores.finance    },
  ]

  /* ① HEADER */
  box(0,0,W,68,'#12172B'); box(0,0,W,3,'#1F4BFF')
  en(22,'bold'); tc('#FFFFFF'); doc.text('DIGITALIZEN', mg, 21)
  en(6.5); tc('#5A667A'); doc.text('Growth Intelligence Platform', mg, 29)
  en(7,'bold'); tc('#1F4BFF'); doc.text('BUSINESS HEALTH REPORT', W-mg, 19, {align:'right'})
  en(6.5); tc('#5A667A')
  doc.text(date, W-mg, 27, {align:'right'})
  doc.text('Confidential \u00B7 Internal Use Only', W-mg, 34, {align:'right'})

  const [br,bg2,bb2] = h2r(band.color)
  en(40,'bold'); doc.setTextColor(br,bg2,bb2); doc.text(`${overall}%`, mg, 60)
  const numW = doc.getTextWidth(`${overall}%`)
  en(8,'bold'); tc('#FFFFFF'); doc.text('Overall Business Health Score', mg+numW+5, 52)
  en(9,'bold'); doc.setTextColor(br,bg2,bb2); doc.text(band.labelEn.toUpperCase(), mg+numW+5, 62)
  bn(band.label, mg+numW+5+doc.getTextWidth(band.labelEn.toUpperCase())+3, 56.5, 8, 35, '#FFFFFF')
  y = 76

  /* ② DOMAIN PERFORMANCE */
  en(6.5,'bold'); tc('#5A667A'); doc.text('DOMAIN PERFORMANCE', mg, y); y += 2; rule(y); y += 5
  for (const d of domCfg) {
    en(7.5,'bold'); tc('#0B1220'); doc.text(d.enLabel, mg, y+3)
    bn(d.bnLabel, mg+doc.getTextWidth(d.enLabel)+2, y+0.5, 7.5, 40, d.col)
    en(8,'bold'); doc.setTextColor(...h2r(d.col)); doc.text(`${d.score}%`, W-mg, y+3, {align:'right'})
    en(6); tc('#5A667A'); doc.text(getBand(d.score).labelEn, W-mg-14, y+3, {align:'right'})
    box(mg, y+5, cW, 3.5, '#E6EAF5')
    if (d.score > 0) box(mg, y+5, Math.max((d.score/100)*cW, 1.5), 3.5, d.col)
    y += 15
  }
  y += 4; rule(y); y += 8

  /* ③ TOP PRIORITY ACTIONS */
  en(6.5,'bold'); tc('#5A667A'); doc.text('TOP PRIORITY ACTIONS', mg, y); y += 2; rule(y); y += 5
  const urgColors = ['#DC2626','#D97706','#2563EB']
  const urgBgs    = ['#FEF2F2','#FFF7ED','#EFF6FF']
  const urgLabels = ['CRITICAL','HIGH PRIORITY','REVIEW']
  for (let i = 0; i < Math.min(topActions.length, 3); i++) {
    const a = topActions[i]
    y = pc(y, 28)
    const qR  = bnRender(String(a.q), 7.5, cW-14, '#0B1220', '400')
    const boxH = Math.max(22, 11 + qR.hMm + 2)
    box(mg, y, cW, boxH, urgBgs[i]); box(mg, y, 3.5, boxH, urgColors[i])
    en(5.5,'bold'); doc.setTextColor(...h2r(urgColors[i])); doc.text(urgLabels[i], mg+7, y+6)
    bn(String(a.q), mg+7, y+8.5, 7.5, cW-14, '#0B1220', '400')
    y += boxH + 3
  }
  y += 2; rule(y); y += 8

  /* ④ DOMAIN INSIGHTS */
  en(6.5,'bold'); tc('#5A667A'); doc.text('DOMAIN INSIGHTS & RECOMMENDATIONS', mg, y); y += 2; rule(y); y += 6
  for (const ins of domainInsights) {
    const d = domCfg.find(d => d.key === ins.domain); if (!d) continue
    y = pc(y, 44)
    box(mg, y, cW, 9, d.col)
    en(7.5,'bold'); tc('#FFFFFF'); doc.text(d.enLabel.toUpperCase(), mg+5, y+6.2)
    bn(d.bnLabel, mg+5+doc.getTextWidth(d.enLabel.toUpperCase())+2, y+1.5, 7, 30, '#FFFFFF')
    en(6.5); tc('#FFFFFF'); doc.text(`${d.score}% \u00B7 ${ins.band.labelEn}`, W-mg-4, y+6.2, {align:'right'})
    y += 12
    const titleH = bn(String(ins.title), mg+3, y, 9.5, cW-6, d.col, '700'); y += titleH + 1
    const detH   = bn(String(ins.detail), mg+3, y, 7, cW-6, '#5A667A', '400'); y += detH + 3
    for (let ai = 0; ai < ins.actions.length; ai++) {
      y = pc(y, 12)
      doc.setFillColor(...h2r(d.col)); doc.rect(mg+3, y-1.8, 2, 2, 'F')
      en(6.5,'bold'); doc.setTextColor(...h2r(d.col)); doc.text(`${ai+1}`, mg+2.3, y)
      const actH = bn(String(ins.actions[ai]), mg+9, y-3, 7, cW-13, '#0B1220', '400')
      y += Math.max(actH + 1, 5.5)
    }
    y += 7
  }

  /* ⑤ RECOMMENDED PACKAGE
     pkg.name / pkg.tagline / pkg.features are ALL Bengali text.
     Every field goes through pdfBn() → canvas → PNG.
     Nothing Bengali goes through doc.text() here.           */
  y = pc(y, 68)
  rule(y); y += 5
  en(6.5,'bold'); tc('#5A667A'); doc.text('RECOMMENDED PACKAGE', mg, y); y += 2; rule(y); y += 5

  const pkgH = 64
  box(mg, y, cW, pkgH, '#F5F7FF')
  box(mg, y,  4, pkgH, '#1F4BFF')

  /* Highlight badge — Bengali via canvas (e.g. 'সবচেয়ে জনপ্রিয়') */
  if (pkg.highlight) {
    box(W-mg-36, y+3, 34, 8, '#1F4BFF')
    bn(pkg.highlight, W-mg-35, y+3.5, 6.5, 32, '#FFFFFF', '700')
  }

  /* Package name — Bengali, bold, dark */
  const pkgNameH = bn(pkg.name, mg+8, y+4, 13, cW/2, '#0B1220', '700')

  /* Price — Bengali numerals + ৳ symbol, via canvas */
  const priceH = bn(pkg.price, W-mg-45, y+6, 13, 40, '#1F4BFF', '700')
  /* Price note — Bengali (e.g. 'প্রতি সপ্তাহ'), via canvas */
  bn(`/ ${pkg.priceNote}`, W-mg-45, y+6+priceH, 6.5, 40, '#5A667A', '400')

  /* Tagline — Bengali */
  const tagY    = y + 4 + pkgNameH + 3
  const pkgTagH = bn(pkg.tagline, mg+8, tagY, 8, cW-60, '#5A667A', '400')

  /* Features — Bengali, 2-column grid, square bullets */
  const featY   = tagY + pkgTagH + 5
  const colWHalf = (cW - 12) / 2
  pkg.features.forEach((f, fi) => {
    const col  = fi % 2 === 0 ? mg+8 : mg+8+colWHalf+6
    const rowY = featY + Math.floor(fi/2) * 11
    doc.setFillColor(...h2r('#1F4BFF')); doc.rect(col-0.5, rowY-1.8, 2, 2, 'F')
    bn(f, col+4, rowY-3, 7.5, colWHalf-8, '#0B1220', '400')
  })

  y += pkgH + 8

  /* ⑥ DIGITALIZEN CTA */
  y = pc(y, 70)
  const ctaH = 70
  box(mg, y, cW, ctaH, '#12172B'); box(mg, y, cW, 3, '#1F4BFF')
  const hdH  = bn('\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u0995\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09B8\u09CD\u09A4\u09B0\u09C7 \u09A8\u09BF\u09AF\u09BC\u09C7 \u09AF\u09BE\u09A8', mg+6, y+8, 12, cW-14, '#FFFFFF', '700')
  const subH = bn('Digitalizen \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u099F\u09C7\u0995\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0993 \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09BF\u09AD \u0989\u09AD\u09AF\u09BC \u09A6\u09BF\u0995 \u09A5\u09C7\u0995\u09C7\u0987 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u0995\u09B0\u09C7\u0964', mg+6, y+8+hdH+1, 7.5, cW-14, '#93C5FD')
  const benY = y+8+hdH+subH+4
  const bens = [
    {en:'Data-Driven Ads',   bn:'\u09A1\u09C7\u099F\u09BE-\u099A\u09BE\u09B2\u09BF\u09A4 \u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09AA\u09A8'},
    {en:'Creative Content',  bn:'\u09AA\u09CD\u09B0\u09AB\u09C7\u09B6\u09A8\u09BE\u09B2 \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09BF\u09AD'},
    {en:'Tech & Automation', bn:'\u099F\u09C7\u0995 \u0993 \u0985\u099F\u09CB\u09AE\u09C7\u09B6\u09A8'},
    {en:'Growth Strategy',   bn:'\u0995\u09BE\u09B8\u09CD\u099F\u09AE \u0997\u09CD\u09B0\u09CB\u09A5 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u09A8'},
  ]
  bens.forEach((b, bi) => {
    const col = bi%2===0 ? mg+6 : mg+6+cW/2
    const row = benY + Math.floor(bi/2)*11
    doc.setFillColor(...h2r('#1F4BFF')); doc.circle(col+1.5, row-1, 1.5, 'F')
    en(6.5,'bold'); tc('#FFFFFF'); doc.text(b.en, col+5, row)
    bn(b.bn, col+5, row+1.5, 6.5, cW/2-10, '#5A667A')
  })
  const btnY = y+ctaH-14
  box(mg+6, btnY, 74, 9, '#128C7E'); en(6.5,'bold'); tc('#FFFFFF')
  doc.text('+880 1711-992558  (WhatsApp)', mg+9, btnY+6)
  box(mg+84, btnY, 56, 9, '#1F4BFF'); doc.text(SITE, mg+87, btnY+6)

  /* ⑦ FOOTER — every page */
  const total = doc.getNumberOfPages()
  for (let p = 1; p <= total; p++) {
    doc.setPage(p)
    box(0,286,W,11,'#12172B'); box(0,294,W,3,'#1F4BFF')
    en(6); tc('#5A667A')
    doc.text(`${BRAND} \u00B7 GrowthHub Business Audit \u00B7 ${date} \u00B7 Page ${p} / ${total}`, mg, 293)
    en(6,'bold'); tc('#1F4BFF'); doc.text(SITE, W-mg, 293, {align:'right'})
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
