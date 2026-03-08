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
  AUDIT_DOMAINS, AUDIT_QUESTIONS, JOURNEY_MODES, NEW_BIZ_QUESTIONS,
  calculateScores, getBand,
  getDomainInsights, getTopPriorityActions,
  recommendPackage,
  getResultMessage, DISCOUNT_COUPON,
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
   BENGALI TEXT → CANVAS → PDF
   jsPDF has no text-shaping engine. Bengali goes through
   the browser HarfBuzz pipeline via offscreen canvas → PNG.
   English stays as real searchable PDF vectors.
══════════════════════════════════════════════════════════ */

let _bnReady = null
function ensureNotoSansBengali() {
  if (_bnReady) return _bnReady
  _bnReady = (async () => {
    if (!document.getElementById('__gh-noto-bn')) {
      const s = document.createElement('style')
      s.id = '__gh-noto-bn'
      s.textContent = `
        @font-face { font-family:'Noto Sans Bengali'; font-weight:400;
          src:url('https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolLudU.woff2') format('woff2'); }
        @font-face { font-family:'Noto Sans Bengali'; font-weight:700;
          src:url('https://fonts.gstatic.com/s/notosansbengali/v20/Cn-SJsCGWQxOjaGwMQ6fIiMywrNJIky6nvd8BjzVMvJx2mcSPVFpVEqE-6KmsolJudU.woff2') format('woff2'); }
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

const _MM2PX = 96 / 25.4, _PT2PX = 96 / 72, _SC = 3

function bnRender(text, sizePt, maxWMm, colorHex, weight) {
  colorHex = colorHex || '#0B1220'; weight = weight || '400'
  const t = String(text != null ? text : '').trim()
  if (!t) return { dataUrl: null, wMm: 0, hMm: 0 }
  const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
  const pxSize = sizePt * _PT2PX * _SC
  const maxPxW = maxWMm * _MM2PX * _SC
  const lineH  = pxSize * 1.55
  const font   = weight + ' ' + pxSize + 'px "Noto Sans Bengali", sans-serif'
  ctx.font = font
  const words = t.split(/\s+/), lines = []; let cur = ''
  for (let wi = 0; wi < words.length; wi++) {
    const trial = cur ? cur + ' ' + words[wi] : words[wi]
    if (ctx.measureText(trial).width > maxPxW && cur) { lines.push(cur); cur = words[wi] }
    else cur = trial
  }
  if (cur) lines.push(cur)
  if (!lines.length) return { dataUrl: null, wMm: 0, hMm: 0 }
  const measW = Math.max.apply(null, lines.map(function(l) { return ctx.measureText(l).width }))
  const padX  = Math.ceil(pxSize * 0.04), padY = Math.ceil(pxSize * 0.16)
  canvas.width  = Math.ceil(Math.min(measW, maxPxW) + padX * 2)
  canvas.height = Math.ceil(lines.length * lineH + padY * 2)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = font; ctx.fillStyle = colorHex; ctx.textBaseline = 'top'
  for (let li = 0; li < lines.length; li++) ctx.fillText(lines[li], padX, padY + li * lineH)
  return {
    dataUrl: canvas.toDataURL('image/png'),
    wMm: canvas.width  / (_SC * _MM2PX),
    hMm: canvas.height / (_SC * _MM2PX),
  }
}

function pdfBn(doc, text, xMm, yMm, sizePt, maxWMm, colorHex, weight) {
  const r = bnRender(text, sizePt, maxWMm, colorHex || '#0B1220', weight || '400')
  if (!r.dataUrl || r.hMm === 0) return 0
  doc.addImage(r.dataUrl, 'PNG', xMm, yMm, Math.min(r.wMm, maxWMm), r.hMm)
  return r.hMm
}

/* ══════════════════════════════════════════════════════════
   PDF GENERATOR v8 — Web Report Style
   ──────────────────────────────────────────────────────────
   Every section is a faithful PDF translation of the web UI:

   PAGE BG     #F5F7FF   (--bg in CSS)
   TEXT        #0B1220   MUTED    #5A667A
   BORDER      #E6EAF5   WHITE    #FFFFFF
   BLUE        #1F4BFF   DARK     #12172B
   Mkt         #1F4BFF   Ops      #7C3AED   Fin  #059669

   ① Cover header — dark brand bar + .gh-result-hero zone
      Score ring (arc poly), band pill, domain bars
   ② Priority actions — .gh-priority cards
      Left border, coloured bg, rounded num badge, tag pills
   ③ Recommended package — .gh-rec-pkg
      Blue border, popular banner, left/right split, green ✓
   ④ Domain insights — InsightCard + .gh-action-block
      Domain-colour left border, bg header, week pill actions
   ⑤ Connect CTA — .gh-wa-section dark panel
   ⑥ Footer — dark bar, 3 columns, every page
══════════════════════════════════════════════════════════ */
async function generatePDF(domainScores, overall, domainInsights, pkg, topActions) {

  await ensureNotoSansBengali()

  if (!window.jspdf) {
    await new Promise(function(res, rej) {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      s.onload = res
      s.onerror = function() { rej(new Error('jsPDF load failed')) }
      document.head.appendChild(s)
    })
  }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  /* ── Layout constants ── */
  const W       = 210
  const mg      = 14          // page margin
  const cW      = W - mg * 2  // 182 mm content width
  const BODY_END = 275        // footer starts at 284; leave breathing room

  const SITE    = 'digitalizen.billah.dev'
  const EMAIL   = 'digitalizen@billah.dev'
  const TAGLINE = 'Your Digital Growth Partner'
  const band    = getBand(overall)
  const date    = new Date().toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' })
  let y = 0

  /* ── CSS design tokens → PDF ── */
  const C = {
    blue:   '#1F4BFF',  // --blue
    dark:   '#12172B',  // dark panel
    text:   '#0B1220',  // --text
    muted:  '#5A667A',  // --muted
    bg:     '#F5F7FF',  // --bg (page/card background)
    white:  '#FFFFFF',
    border: '#E6EAF5',  // --border
    mkt: '#1F4BFF', mktL: '#EEF2FF',
    ops: '#7C3AED', opsL: '#F3F0FF',
    fin: '#059669', finL: '#ECFDF5',
    green: '#059669', greenL: '#ECFDF5',
    // Urgency
    crit: '#DC2626', critBg: '#FEF2F2',
    high: '#D97706', highBg: '#FFFBEB',
    rev:  '#2563EB', revBg:  '#EFF6FF',
  }

  /* ── Low-level helpers ── */
  const h2r = function(h) {
    h = h.replace('#','')
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
  }
  const box = function(x, fy, w, h, hex) {
    doc.setFillColor.apply(doc, h2r(hex)); doc.rect(x, fy, w, h, 'F')
  }
  const strokedBox = function(x, fy, w, h, fill, stroke, lw) {
    box(x, fy, w, h, fill)
    doc.setDrawColor.apply(doc, h2r(stroke || C.border)); doc.setLineWidth(lw || 0.25)
    doc.rect(x, fy, w, h)
  }
  const tc = function(hex)      { doc.setTextColor.apply(doc, h2r(hex)) }
  const dc = function(hex, lw)  { doc.setDrawColor.apply(doc, h2r(hex)); doc.setLineWidth(lw || 0.25) }
  const en = function(sz, st)   { doc.setFontSize(sz); doc.setFont('helvetica', st || 'normal') }
  const bn = function(text, x, fy, sz, maxW, color, wt) {
    return pdfBn(doc, text, x, fy, sz, maxW, color || C.text, wt || '400')
  }
  // Rounded fill rect helper (used for badges)
  const roundBox = function(x, fy, w, h, fill) {
    doc.setFillColor.apply(doc, h2r(fill))
    doc.roundedRect(x, fy, w, h, 1.5, 1.5, 'F')
  }
  // Pill: fill + optional stroke
  const pill = function(x, fy, w, h, fill, stroke, lw) {
    const r = h / 2
    doc.setFillColor.apply(doc, h2r(fill))
    doc.roundedRect(x, fy, w, h, r, r, 'F')
    if (stroke) {
      doc.setDrawColor.apply(doc, h2r(stroke)); doc.setLineWidth(lw || 0.25)
      doc.roundedRect(x, fy, w, h, r, r)
    }
  }

  /* ── Section label — mirrors .gh-section-lbl ── */
  // "UPPERCASE 6pt 800-weight muted" — purely English, use en()
  const sLbl = function(labelEn, fy) {
    en(5.5, 'bold'); tc(C.muted)
    doc.text(labelEn.toUpperCase(), mg, fy)
    return fy + 5.5
  }

  /* ── Page guard + continuation header ── */
  const newPage = function() {
    doc.addPage()
    // Mirrors dark brand bar
    box(0, 0, W, 10, C.dark)
    box(0, 9.5, W, 0.5, C.blue)
    en(6, 'bold'); tc(C.white)
    doc.text('DIGITALIZEN  \u00B7  ' + TAGLINE, mg, 6.5)
    en(5); tc(C.muted)
    doc.text('Business Health Report', W - mg, 6.5, { align: 'right' })
    return 16
  }
  const guard = function(fy, need) { return (fy + need > BODY_END) ? newPage() : fy }

  /* ── Domain config ── */
  const domCfg = [
    { key:'marketing',  en:'Marketing',  bn:'\u09AE\u09BE\u09B0\u09CD\u0995\u09C7\u099F\u09BF\u0982', col:C.mkt, light:C.mktL, score:domainScores.marketing  },
    { key:'operations', en:'Operations', bn:'\u0985\u09AA\u09BE\u09B0\u09C7\u09B6\u09A8\u09B8',       col:C.ops, light:C.opsL, score:domainScores.operations },
    { key:'finance',    en:'Finance',    bn:'\u09AB\u09BE\u0987\u09A8\u09BE\u09A8\u09CD\u09B8',        col:C.fin, light:C.finL, score:domainScores.finance    },
  ]

  /* ════════════════════════════════════════════════════════
     ①  COVER — dark brand bar + hero zone
     Faithful translation of:
       .hub-card dark top + .gh-result-hero
  ════════════════════════════════════════════════════════ */

  /* Brand bar */
  box(0, 0, W, 13, C.dark)
  box(0, 12.5, W, 0.5, C.blue)
  en(8, 'bold'); tc(C.white)
  doc.text('DIGITALIZEN', mg, 8.5)
  const brandW = doc.getTextWidth('DIGITALIZEN')
  en(6); tc('#4A6090')
  doc.text('  |  ' + TAGLINE, mg + brandW, 8.5)
  en(6, 'bold'); tc(C.blue)
  doc.text('BUSINESS HEALTH REPORT', W - mg, 8.5, { align: 'right' })
  y = 13

  /* Hero bg — mirrors .gh-result-hero { background:var(--bg) } */
  const HERO_H = 82
  box(0, y, W, HERO_H, C.bg)

  /* Kicker — .gh-result-hero__kicker */
  en(5.5, 'bold'); tc(C.muted)
  doc.text('\u2605  BUSINESS HEALTH SCORE', mg, y + 9)

  /* ── Score ring (left side of hero) ── */
  // Mirrors ScoreRing component: SVG circle track + coloured arc
  const ringCX = mg + 20, ringCY = y + 46, ringR = 17, ringThick = 4
  const bandRGB = h2r(band.color)

  // Track (grey ring)
  doc.setDrawColor.apply(doc, h2r(C.border))
  doc.setLineWidth(ringThick)
  doc.circle(ringCX, ringCY, ringR)

  // Coloured arc (poly-line segments)
  const pct    = overall / 100
  const steps  = Math.max(6, Math.round(pct * 60))
  const aStart = -Math.PI / 2
  const aEnd   = aStart + pct * 2 * Math.PI
  doc.setDrawColor(bandRGB[0], bandRGB[1], bandRGB[2])
  doc.setLineWidth(ringThick)
  for (let si = 0; si < steps; si++) {
    const a1 = aStart + (si / steps) * (aEnd - aStart)
    const a2 = aStart + ((si + 1) / steps) * (aEnd - aStart)
    doc.line(
      ringCX + ringR * Math.cos(a1), ringCY + ringR * Math.sin(a1),
      ringCX + ringR * Math.cos(a2), ringCY + ringR * Math.sin(a2)
    )
  }

  // Score number inside ring — .score-ring__value
  en(14, 'bold'); doc.setTextColor(bandRGB[0], bandRGB[1], bandRGB[2])
  doc.text(String(overall), ringCX, ringCY + 2.5, { align: 'center' })
  en(5.5, 'bold'); tc(C.muted)
  doc.text('%', ringCX + doc.getTextWidth(String(overall)) * 0.5 + 1.5, ringCY - 2)

  /* ── Meta block right of ring — .gh-result-hero__meta ── */
  const metaX = mg + 45

  // Band badge — .gh-band-badge
  const pillTxt = band.labelEn.toUpperCase()
  en(5.5, 'bold'); doc.setTextColor(bandRGB[0], bandRGB[1], bandRGB[2])
  const pillW = doc.getTextWidth(pillTxt) + 10
  pill(metaX, y + 16, pillW, 7, band.bg, band.color, 0.35)
  doc.text(pillTxt, metaX + pillW / 2, y + 21.2, { align: 'center' })

  // Bengali band label — canvas rendered
  bn(band.label, metaX + pillW + 3, y + 15, 8, 40, band.color, '700')

  // Score description — .gh-result-hero__desc
  const descMap = [
    [0,  30, '\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u09C7 \u0997\u09C1\u09B0\u09C1\u09A4\u09CD\u09AC\u09AA\u09C2\u09B0\u09CD\u09A3 \u09AA\u09B0\u09BF\u09AC\u09B0\u09CD\u09A4\u09A8 \u09A6\u09B0\u0995\u09BE\u09B0\u0964'],
    [30, 50, '\u09AD\u09BE\u09B2\u09CB \u09AB\u09BE\u0989\u09A8\u09CD\u09A1\u09C7\u09B6\u09A8 \u0986\u099B\u09C7\u002C \u0997\u09CD\u09AF\u09BE\u09AA\u0997\u09C1\u09B2\u09CB \u09AC\u09A8\u09CD\u09A7 \u0995\u09B0\u09A4\u09C7 \u09B9\u09AC\u09C7\u0964'],
    [50, 70, '\u0997\u09A1\u09BC \u09AE\u09BE\u09A8\u09C7\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u0964 \u0989\u09A8\u09CD\u09A8\u09A4\u09BF\u09B0 \u09B8\u09CD\u09AA\u09B7\u09CD\u099F \u09B8\u09C1\u09AF\u09CB\u0997 \u0986\u099B\u09C7\u0964'],
    [70, 85, '\u09B6\u0995\u09CD\u09A4\u09BF\u09B6\u09BE\u09B2\u09C0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u0021 \u09B8\u09CD\u0995\u09C7\u09B2 \u0995\u09B0\u09BE\u09B0 \u09B8\u09A0\u09BF\u0995 \u09B8\u09AE\u09AF\u09BC\u0964'],
    [85, 101,'\u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3\u0021 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8 \u098F\u09B2\u09BF\u099F \u09B2\u09C7\u09AD\u09C7\u09B2\u09C7 \u0986\u099B\u09C7\u0964'],
  ]
  const descTxt = descMap.find(function(m){ return overall > m[0] && overall <= m[1] })[2]
  bn(descTxt, metaX, y + 27, 7, W - mg - metaX - 2, C.muted)

  /* ── Domain bars — .gh-ds ── */
  // Three rows below the ring. Laid out under the meta text.
  // barStartY is low enough to clear the ring bottom (ringCY + ringR)
  const barStartY = y + 54
  for (let di = 0; di < domCfg.length; di++) {
    const d   = domCfg[di]
    const bY  = barStartY + di * 9

    // Label
    en(6, 'bold'); tc(C.text)
    doc.text(d.en, mg, bY + 3.5)
    en(6, 'bold'); doc.setTextColor.apply(doc, h2r(d.col))
    doc.text(d.score + '%', W - mg, bY + 3.5, { align: 'right' })

    // Track + fill — .gh-ds__track / .gh-ds__fill
    const trackX = mg + 22, trackW = cW - 28, trackY = bY + 5.5
    box(trackX, trackY, trackW, 2.5, C.border)
    if (d.score > 0) {
      box(trackX, trackY, Math.max((d.score / 100) * trackW, 2), 2.5, d.col)
    }
  }

  // Hero bottom border
  y = 13 + HERO_H
  dc(C.border, 0.25); doc.line(0, y, W, y)

  /* Meta strip (date + confidential) */
  box(0, y, W, 7, C.white)
  dc(C.border, 0.25); doc.line(0, y + 7, W, y + 7)
  en(5.5); tc(C.muted)
  doc.text(date, mg, y + 5)
  doc.text('Confidential  \u00B7  Internal Use Only', W - mg, y + 5, { align: 'right' })
  y += 7

  // Progress bar — mirrors .gh-master-prog__fill gradient
  box(0, y, W, 2, C.blue)
  y += 8

  /* ════════════════════════════════════════════════════════
     ②  TOP PRIORITY ACTIONS
     Mirrors .gh-priority cards exactly:
     — coloured bg, 3mm left accent border
     — rounded square number badge (bg = urgency colour)
     — question text (Bengali canvas)
     — domain pill + "X% improvement" pill
  ════════════════════════════════════════════════════════ */
  y = sLbl('TOP PRIORITY ACTIONS', y)
  y += 2

  const PRIO_COLS = [C.crit, C.high, C.rev]
  const PRIO_BGS  = ['#FEF2F2', '#FFFBEB', '#EFF6FF']

  for (let i = 0; i < Math.min(topActions.length, 3); i++) {
    const a   = topActions[i]
    const pC  = PRIO_COLS[i]
    const pBg = PRIO_BGS[i]
    const d   = domCfg.find(function(x){ return x.key === a.domain }) || domCfg[0]

    // Pre-measure Bengali question text
    const qR      = bnRender(String(a.q), 8, cW - 22, C.text, '400')
    // Tags row = 5.5mm tall
    const cardH   = Math.max(26, 8 + qR.hMm + 4 + 5.5 + 6)

    y = guard(y, cardH + 3)

    // Card bg + left border — .gh-priority
    box(mg, y, cW, cardH, pBg)
    box(mg, y, 3, cardH, pC)
    dc(C.border, 0.2); doc.rect(mg, y, cW, cardH)

    // Number badge — .gh-priority__num (22×22px, border-radius:6px)
    const numX = mg + 3 + 4, numCY = y + cardH / 2
    roundBox(numX - 3.5, numCY - 3.5, 7, 7, pC)
    en(6, 'bold'); tc(C.white)
    doc.text(String(i + 1), numX, numCY + 1.2, { align: 'center' })

    // Question text — .gh-priority__q
    const textX = mg + 3 + 12
    bn(String(a.q), textX, y + 8, 8, cW - 22, C.text, '400')

    // Tags — .gh-priority__tags
    const tagY  = y + 8 + qR.hMm + 2
    const dpW   = doc.getTextWidth(d.en) + 8
    pill(textX, tagY, dpW, 5.5, d.light)
    en(5.5, 'bold'); doc.setTextColor.apply(doc, h2r(d.col))
    doc.text(d.en, textX + dpW / 2, tagY + 4.1, { align: 'center' })

    const gapPct = Math.round(((a.gap || 0) / 4) * 100)
    const gapStr = gapPct + '% improvement'
    en(5.5, 'bold'); tc(C.muted)
    const gapW   = doc.getTextWidth(gapStr) + 8
    pill(textX + dpW + 4, tagY, gapW, 5.5, C.bg, C.border, 0.2)
    doc.text(gapStr, textX + dpW + 4 + gapW / 2, tagY + 4.1, { align: 'center' })

    y += cardH + 3
  }

  y += 7

  /* ════════════════════════════════════════════════════════
     ③  RECOMMENDED PACKAGE
     Mirrors .gh-rec-pkg:
     — border:1.5px solid var(--blue), border-radius
     — Blue "Most popular" banner at top
     — Left: name + tagline | Right: price
     — Feature grid: green filled circles + text
  ════════════════════════════════════════════════════════ */
  y = guard(y, 68)
  y = sLbl('RECOMMENDED PACKAGE', y)
  y += 2

  /* Pre-measure all heights accurately */
  const pkgNameR = bnRender(pkg.name,    11,  cW * 0.54, C.text,  '700')
  const pkgTagR  = bnRender(pkg.tagline,  7.5, cW * 0.54, C.muted, '400')
  const priceR   = bnRender(pkg.price,   12,  52, C.blue, '700')
  const priceNtR = bnRender('/ ' + pkg.priceNote, 6.5, 52, C.muted, '400')
  const halfW    = (cW - 16) / 2

  // Measure each feature individually for accurate row heights
  const featR = pkg.features.map(function(f) {
    return f ? bnRender(f, 7, halfW - 12, C.muted, '400') : { hMm: 0 }
  })
  let featGridH = 0
  for (let row = 0; row < Math.ceil(pkg.features.length / 2); row++) {
    const lH = featR[row * 2]     ? Math.max(featR[row * 2].hMm,     6) : 0
    const rH = featR[row * 2 + 1] ? Math.max(featR[row * 2 + 1].hMm, 6) : 0
    featGridH += Math.max(lH, rH) + 3
  }

  const topH     = Math.max(pkgNameR.hMm + 3 + pkgTagR.hMm, priceR.hMm + 2 + priceNtR.hMm)
  const bannerH  = pkg.popular ? 7 : 0
  const pkgCardH = bannerH + 8 + topH + 7 + featGridH + 6

  /* Blue border — .gh-rec-pkg (border:1.5px solid var(--blue)) */
  doc.setDrawColor.apply(doc, h2r(C.blue)); doc.setLineWidth(0.5)
  doc.rect(mg, y, cW, pkgCardH)
  /* White fill inside the border */
  box(mg + 0.5, y + 0.5, cW - 1, pkgCardH - 1, C.white)

  /* Popular banner — .gh-rec-pkg__banner */
  if (pkg.popular) {
    box(mg + 0.5, y + 0.5, cW - 1, bannerH, C.blue)
    en(5.5, 'bold'); tc(C.white)
    doc.text('\u2605  MOST POPULAR', mg + 7, y + 5.2)
  }

  const bodyY = y + bannerH + 8

  /* Package name + tagline — .gh-rec-pkg__info */
  bn(pkg.name,    mg + 7, bodyY,                  11,  cW * 0.54, C.text,  '700')
  bn(pkg.tagline, mg + 7, bodyY + pkgNameR.hMm + 3, 7.5, cW * 0.54, C.muted, '400')

  /* Price — .gh-rec-pkg__price (right column, blue) */
  const priceX = W - mg - 58
  bn(pkg.price,            priceX, bodyY,                    12,  52, C.blue, '700')
  bn('/ ' + pkg.priceNote, priceX, bodyY + priceR.hMm + 2,   6.5, 52, C.muted,'400')

  /* Divider between top and features */
  const featY0 = bodyY + topH + 6
  dc(C.border, 0.25); doc.line(mg + 7, featY0 - 2, W - mg - 4, featY0 - 2)

  /* Feature grid — .gh-rec-pkg__feats (CheckCircle2 = green dot) */
  let featCurY = featY0
  for (let row = 0; row < Math.ceil(pkg.features.length / 2); row++) {
    const lI   = row * 2, rI = row * 2 + 1
    const lH   = featR[lI]  ? Math.max(featR[lI].hMm,  6) : 0
    const rH   = featR[rI]  ? Math.max(featR[rI].hMm,  6) : 0
    const rowH = Math.max(lH, rH)
    for (let col = 0; col < 2; col++) {
      const fi = col === 0 ? lI : rI
      if (!pkg.features[fi]) continue
      const fx = mg + 7 + col * (halfW + 8)
      // Green filled circle — CheckCircle2 equivalent
      doc.setFillColor.apply(doc, h2r(C.green))
      doc.circle(fx + 1.5, featCurY + rowH / 2, 1.8, 'F')
      bn(pkg.features[fi], fx + 5.5, featCurY, 7, halfW - 12, C.muted, '400')
    }
    featCurY += rowH + 3
  }

  y += pkgCardH + 9

  /* ════════════════════════════════════════════════════════
     ④  DOMAIN INSIGHTS & ACTION PLAN
     Combines InsightCard + gh-action-block visual language:

     Per domain:
     ┌─────────────────────────────────────────────┐
     │▌ MARKETING  [score pill] [urgency pill]      │  ← bg tinted header
     ├─────────────────────────────────────────────┤
     │  [title — domain colour, bold]               │
     │  ─────────────────────────────────           │
     │  detail text (muted)                         │
     │                                              │
     │  NEXT STEPS                                  │
     │  [সপ্তাহ 1] action text…                    │
     │  [সপ্তাহ 2] action text…                    │
     └─────────────────────────────────────────────┘
     Left 3mm accent = domain colour
  ════════════════════════════════════════════════════════ */
  y = guard(y, 55)
  y = sLbl('DOMAIN INSIGHTS & ACTION PLAN', y)
  y += 2

  for (let ii = 0; ii < domainInsights.length; ii++) {
    const ins = domainInsights[ii]
    const d   = domCfg.find(function(x){ return x.key === ins.domain })
    if (!d) continue

    // Pre-render everything before drawing (needed for height)
    const titleR   = bnRender(String(ins.title),  9,   cW - 18, d.col,  '700')
    const detailR  = bnRender(String(ins.detail),  7.5, cW - 16, C.muted,'400')
    const nextLblR = bnRender('\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA', 6, 28, C.muted, '700')
    const actR = []
    for (let ai = 0; ai < ins.actions.length; ai++) {
      actR.push(bnRender(String(ins.actions[ai]), 7.5, cW - 32, C.text, '400'))
    }
    const actTH  = actR.reduce(function(s, r) { return s + Math.max(r.hMm, 6) + 4 }, 0)
    const HDR_H  = 10
    const BODY_H = 5 + titleR.hMm + 4 + 0.25 + 4 + detailR.hMm + 4
                 + nextLblR.hMm + 3 + actTH + 5
    const CARD_H = HDR_H + BODY_H

    y = guard(y, Math.min(CARD_H, 75))

    // Card shell — white fill, border, left domain accent
    strokedBox(mg, y, cW, CARD_H, C.white, C.border, 0.25)
    box(mg, y, 3, CARD_H, d.col)   // left accent — .gh-action-block border-left:3px

    // Header strip — .gh-action-block__hdr { background:var(--bg) }
    box(mg + 3, y, cW - 3, HDR_H, C.bg)
    dc(C.border, 0.25); doc.line(mg, y + HDR_H, mg + cW, y + HDR_H)

    // Domain label EN
    en(7, 'bold'); doc.setTextColor.apply(doc, h2r(d.col))
    doc.text(d.en.toUpperCase(), mg + 7, y + 7)
    const domLblW = doc.getTextWidth(d.en.toUpperCase()) + 3

    // Domain BN (canvas)
    bn(d.bn, mg + 7 + domLblW, y + 2.5, 7, 28, d.col)

    // Score badge pill — .gh-action-block__sc
    const scTxt = d.score + '%'
    en(5.5, 'bold'); doc.setTextColor.apply(doc, h2r(d.col))
    const scW = doc.getTextWidth(scTxt) + 7
    pill(W - mg - scW - 2, y + 2.5, scW, 5, d.light)
    doc.text(scTxt, W - mg - 2 - scW / 2, y + 6.2, { align: 'center' })

    // Urgency pill — .gh-insight__urgency
    const urgCols  = { high: C.crit,    medium: C.high,  low: C.green }
    const urgBgs   = { high: '#FEF2F2', medium: '#FFFBEB', low: '#ECFDF5' }
    const urgLabels= { high: 'URGENT',  medium: 'REVIEW', low: 'GOOD' }
    if (ins.urgency && urgCols[ins.urgency]) {
      const uC  = urgCols[ins.urgency]
      const uBg = urgBgs[ins.urgency]
      const uTx = urgLabels[ins.urgency]
      en(5, 'bold'); doc.setTextColor.apply(doc, h2r(uC))
      const uW = doc.getTextWidth(uTx) + 6
      pill(W - mg - scW - uW - 5, y + 2.5, uW, 5, uBg)
      doc.text(uTx, W - mg - scW - 5 - uW / 2, y + 6.2, { align: 'center' })
    }

    y += HDR_H

    const cx = mg + 7
    let cy = y + 5

    // Title — .gh-insight__title (domain colour, 800-weight)
    cy += bn(String(ins.title), cx, cy, 9, cW - 18, d.col, '700')
    cy += 4

    // Thin divider — .gh-insight__body border-top
    dc(C.border, 0.2); doc.line(cx, cy, W - mg - 4, cy)
    cy += 4

    // Detail — .gh-insight__detail
    cy += bn(String(ins.detail), cx, cy, 7.5, cW - 16, C.muted, '400')
    cy += 4

    // "Next steps" label — .gh-insight__acts-label
    cy += bn('\u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09AA\u09A6\u0995\u09CD\u09B7\u09C7\u09AA', cx, cy, 6, 28, C.muted, '700')
    cy += 3

    // Action items — .gh-action-item with week pill
    for (let ai = 0; ai < ins.actions.length; ai++) {
      cy = guard(cy, 12)
      const rowH = Math.max(actR[ai].hMm, 6)

      // Week pill — .gh-action-item__wk (colorLight bg, domain colour text)
      const wkTxt = 'Week ' + (ai + 1)
      en(5.5, 'bold'); doc.setTextColor.apply(doc, h2r(d.col))
      const wkW = doc.getTextWidth(wkTxt) + 7
      roundBox(cx, cy + (rowH - 5) / 2, wkW, 5, d.light)
      doc.text(wkTxt, cx + wkW / 2, cy + (rowH - 5) / 2 + 3.8, { align: 'center' })

      // Action text — .gh-action-item__txt
      bn(String(ins.actions[ai]), cx + wkW + 3, cy, 7.5, cW - 32, C.text, '400')
      cy += rowH + 4
    }

    y = cy + 8
  }

  /* ════════════════════════════════════════════════════════
     ⑤  CONNECT CTA
     Mirrors .gh-wa-section dark panel.
  ════════════════════════════════════════════════════════ */
  const ctaHR = bnRender('\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u0995\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09B8\u09CD\u09A4\u09B0\u09C7 \u09A8\u09BF\u09AF\u09BC\u09C7 \u09AF\u09BE\u09A8', 12, cW - 16, C.white, '700')
  const ctaSR = bnRender('Digitalizen \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u099F\u09C7\u0995\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0993 \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09BF\u09AD \u0989\u09AD\u09AF\u09BC \u09A6\u09BF\u0995 \u09A5\u09C7\u0995\u09C7\u0987 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u0995\u09B0\u09C7\u0964', 7.5, cW - 16, '#7A9CC8', '400')
  const ctaCardH = 8 + ctaHR.hMm + 3 + ctaSR.hMm + 10 + 10
  y = guard(y, ctaCardH + 4)

  box(mg, y, cW, ctaCardH, C.dark)
  box(mg, y, cW, 2.5, C.blue)   // top accent stripe

  let ctaCY = y + 8
  ctaCY += bn('\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09BF\u099C\u09A8\u09C7\u09B8\u0995\u09C7 \u09AA\u09B0\u09AC\u09B0\u09CD\u09A4\u09C0 \u09B8\u09CD\u09A4\u09B0\u09C7 \u09A8\u09BF\u09AF\u09BC\u09C7 \u09AF\u09BE\u09A8', mg + 8, ctaCY, 12, cW - 16, C.white, '700')
  ctaCY += 3
  ctaCY += bn('Digitalizen \u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B8\u09BE\u09B0 \u099F\u09C7\u0995\u09A8\u09BF\u0995\u09CD\u09AF\u09BE\u09B2 \u0993 \u0995\u09CD\u09B0\u09BF\u09AF\u09BC\u09C7\u099F\u09BF\u09AD \u0989\u09AD\u09AF\u09BC \u09A6\u09BF\u0995 \u09A5\u09C7\u0995\u09C7\u0987 \u09B8\u09B9\u09BE\u09AF\u09BC\u09A4\u09BE \u0995\u09B0\u09C7\u0964', mg + 8, ctaCY, 7.5, cW - 16, '#7A9CC8', '400')
  ctaCY += 10

  // WhatsApp button — .gh-wa-primary
  box(mg + 8, ctaCY, 82, 9, '#25D366')
  en(6.5, 'bold'); tc(C.white)
  doc.text('+880 1711-992558  (WhatsApp)', mg + 11, ctaCY + 6.3)

  // Website button — .gh-pdf-btn (dark bg)
  box(mg + 96, ctaCY, 72, 9, C.dark)
  dc(C.blue, 0.4); doc.rect(mg + 96, ctaCY, 72, 9)
  doc.text(SITE, mg + 99, ctaCY + 6.3)

  y += ctaCardH + 6

  /* ════════════════════════════════════════════════════════
     ⑥  FOOTER — stamped on every page
     Mirrors the dark bottom of hub-card.
     3 columns: brand | email/site | page number.
  ════════════════════════════════════════════════════════ */
  const PAGES = doc.getNumberOfPages()
  for (let p = 1; p <= PAGES; p++) {
    doc.setPage(p)
    const fY = 284
    box(0, fY,     W, 13, C.dark)
    box(0, fY,     W, 1,  C.blue)      // top accent
    box(0, fY + 12,W, 1,  C.blue)      // bottom accent

    en(6, 'bold'); tc(C.white)
    doc.text('DIGITALIZEN', mg, fY + 6)
    en(4.5); tc('#4A6090')
    doc.text(TAGLINE, mg, fY + 10)

    en(5); tc(C.muted)
    doc.text(EMAIL, W / 2, fY + 5.5, { align: 'center' })
    dc('#2A3A5C', 0.2); doc.line(W / 2 - 24, fY + 7, W / 2 + 24, fY + 7)
    en(4.5); tc('#3A4F70')
    doc.text(SITE + '  \u00B7  ' + date, W / 2, fY + 10.5, { align: 'center' })

    en(5.5, 'bold'); tc(C.white)
    doc.text(p + ' / ' + PAGES, W - mg, fY + 6, { align: 'right' })
    en(4.5); tc(C.muted)
    doc.text('Confidential', W - mg, fY + 10, { align: 'right' })
  }

  doc.save(`Digitalizen_Business_Health_Report_${new Date().getFullYear()}.pdf`)
}






/* ══════════════════════════════════════════════════════════
   PHASE 1 — ENTRY (Gamified + Journey Mode)
══════════════════════════════════════════════════════════ */
function PhaseEntry({ onStart }) {
  const [journey, setJourney] = useState(null)

  const handleStart = () => {
    if (!journey) return
    onStart(journey)
  }

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
        একটি প্রফেশনাল বিজনেস হেলথ রিপোর্ট পান।
      </p>

      {/* Journey mode selector */}
      <div style={{ width:'100%', maxWidth:380, position:'relative', zIndex:1, marginBottom:20, animation:'ghFadeUp 0.4s 0.13s ease both' }}>
        <p style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--muted)', marginBottom:10, textAlign:'center', letterSpacing:'0.05em', textTransform:'uppercase' }}>
          আপনি কোন ধাপে আছেন?
        </p>
        <div className="gh-journey-select">
          {[
            { key:'existing', emoji:'📊', title:'বিজনেস চলছে', sub:'ইতিমধ্যে বিক্রি শুরু হয়েছে' },
            { key:'new',      emoji:'🌱', title:'নতুন শুরু',   sub:'ব্যবসা শুরু করতে চাই' },
          ].map(j => (
            <button
              key={j.key}
              className={`gh-journey-card${journey === j.key ? ' active' : ''}`}
              onClick={() => setJourney(j.key)}
              type="button"
            >
              <div className="gh-journey-card__check" aria-hidden="true">
                <CheckCircle2 size={11} strokeWidth={3} />
              </div>
              <span className="gh-journey-card__emoji">{j.emoji}</span>
              <span className="gh-journey-card__title">{j.title}</span>
              <span className="gh-journey-card__sub">{j.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="gh-entry__cta"
        onClick={handleStart}
        disabled={!journey}
        style={{ opacity: journey ? 1 : 0.45, pointerEvents: journey ? 'auto' : 'none' }}
      >
        {journey === 'new' ? 'আমার রোডম্যাপ তৈরি করুন' : journey === 'existing' ? 'আমার ফ্রি অডিট শুরু করুন' : 'উপরে বেছে নিন →'}
        {journey && <ArrowRight size={16} strokeWidth={2.5} />}
      </button>
      <p className="gh-entry__note">
        <Clock size={11} strokeWidth={2} />
        মাত্র ৩ মিনিট
        <span className="gh-entry__dot" />
        {journey === 'new' ? '৫টি প্রশ্ন' : '১৫টি প্রশ্ন'}
        <span className="gh-entry__dot" />
        কাস্টম রিপোর্ট
      </p>
      <div className="gh-entry__stats">
        {[
          { n:'৩,৬০০+', l:'ক্লায়েন্ট' },
          { n:'৯+',     l:'বছর অভিজ্ঞতা' },
          { n:'৩৪০%',  l:'গড় ROAS' },
          { n:'৮০%',   l:'বাজেট বাঁচানো' },
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
   PHASE 2 — AUDIT (enhanced with milestones + gamification)
══════════════════════════════════════════════════════════ */
function PhaseAudit({ state, onAnswer, onBack, journeyMode }) {
  const { currentQ } = state
  const questions    = journeyMode === 'new' ? NEW_BIZ_QUESTIONS : AUDIT_QUESTIONS
  const question     = questions[currentQ]
  const domain       = AUDIT_DOMAINS.find(d => d.key === question.domain)
  const [picked, setPicked]         = useState(null)
  const [exiting, setExiting]       = useState(false)
  const [showMilestone, setMilestone] = useState(null)
  const prevQ = useRef(currentQ)

  const total = questions.length

  useEffect(() => {
    if (prevQ.current !== currentQ) { setPicked(null); prevQ.current = currentQ }
  }, [currentQ])

  // Milestone detection
  const MILESTONES = journeyMode === 'new'
    ? { 2: { emoji:'✅', text:'দারুণ! প্রায় অর্ধেক হয়ে গেছে' } }
    : {
        4:  { emoji:'🎯', text:'মার্কেটিং বিভাগ শেষ!', sub:'অপারেশনস শুরু হচ্ছে' },
        9:  { emoji:'⚡', text:'অপারেশনস বিভাগ শেষ!', sub:'শেষ বিভাগ — ফাইন্যান্স' },
        12: { emoji:'🏁', text:'প্রায় শেষ! মাত্র ৩টি বাকি' },
      }

  const handlePick = useCallback((opt, idx) => {
    if (picked !== null) return
    setPicked(idx)

    // Check for milestone after this answer
    const nextQ = currentQ + 1
    if (MILESTONES[nextQ]) {
      setMilestone(MILESTONES[nextQ])
      setTimeout(() => setMilestone(null), 2000)
    }

    setExiting(true)
    setTimeout(() => { setExiting(false); onAnswer(question.id, opt.value) }, 400)
  }, [picked, question.id, onAnswer, currentQ])

  const domQs  = journeyMode === 'new' ? questions : AUDIT_QUESTIONS.filter(q => q.domain === question.domain)
  const domIdx = domQs.findIndex(q => q.id === question.id)
  const domNum = journeyMode === 'new' ? 1 : ['marketing','operations','finance'].indexOf(question.domain) + 1
  const domTotal = journeyMode === 'new' ? 1 : 3

  const progressPct = Math.round(((currentQ) / total) * 100)

  return (
    <div className={`gh-audit gh-step${exiting ? ' exiting' : ''}`} key={`q${currentQ}`}>

      {/* Milestone celebration strip */}
      {showMilestone && (
        <div className="gh-milestone">
          <span className="gh-milestone__icon">{showMilestone.emoji}</span>
          <div>
            <div className="gh-milestone__text">{showMilestone.text}</div>
            {showMilestone.sub && <div className="gh-milestone__sub">{showMilestone.sub}</div>}
          </div>
        </div>
      )}

      {/* Domain band */}
      <div className="gh-domain-band" style={{ '--dc': domain.color, '--dl': domain.colorLight }}>
        <div className="gh-domain-band__left">
          <div className="gh-domain-band__icon">
            <DomainIcon domain={domain.key} size={15} color={domain.color} />
          </div>
          <div>
            <div className="gh-domain-band__cat">{domain.label}</div>
            <div className="gh-domain-band__sub">
              {journeyMode === 'new' ? `প্রশ্ন ${currentQ+1}/${total}` : `বিভাগ ${domNum}/${domTotal} · প্রশ্ন ${domIdx+1}/${domQs.length}`}
            </div>
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
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
          <div className="gh-q-icon" style={{ '--dc': domain.color, '--dl': domain.colorLight, marginBottom:0, width:38, height:38 }}>
            <QIcon iconKey={question.iconKey} size={19} color={domain.color} strokeWidth={1.75} />
          </div>
          <div className="gh-q-counter">
            <span className="gh-q-counter__num">{currentQ+1}</span>
            <span style={{ opacity:0.4 }}>/</span>
            {total}
            <span style={{ width:4 }} />
            <span style={{ fontSize:'0.6rem', color:'var(--muted2)', fontWeight:500 }}>{progressPct}% সম্পন্ন</span>
          </div>
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
   PHASE 3 — ANALYZING (enhanced with progress fill)
══════════════════════════════════════════════════════════ */
function PhaseAnalyzing({ onDone, journeyMode }) {
  const [step, setStep] = useState(0)
  const isNew = journeyMode === 'new'
  const steps = isNew ? [
    { text: 'বিজনেস ক্যাটাগরি বিশ্লেষণ করা হচ্ছে…', Icon: Target    },
    { text: 'মার্কেট অপরচুনিটি স্ক্যান হচ্ছে…',      Icon: TrendingUp },
    { text: 'কাস্টম লঞ্চ রোডম্যাপ তৈরি হচ্ছে…',      Icon: Sparkles  },
  ] : [
    { text: 'মার্কেটিং পারফরম্যান্স বিশ্লেষণ করা হচ্ছে…', Icon: Megaphone  },
    { text: 'অপারেশনাল দক্ষতা মূল্যায়ন করা হচ্ছে…',      Icon: Settings   },
    { text: 'ফিনান্সিয়াল স্বাস্থ্য পরীক্ষা করা হচ্ছে…',  Icon: DollarSign },
    { text: 'কাস্টম গ্রোথ রোডম্যাপ তৈরি হচ্ছে…',          Icon: Sparkles   },
  ]

  const progressPct = Math.round((step / steps.length) * 100)

  useEffect(() => {
    const ts = steps.map((_, i) => setTimeout(() => setStep(i+1), (i+1)*750))
    setTimeout(onDone, steps.length * 750 + 600)
    return () => ts.forEach(clearTimeout)
  }, [])

  return (
    <div className="gh-analyzing gh-step" aria-live="polite">
      <div className="gh-orbit" aria-hidden="true">
        <div className="gh-orbit__ring gh-orbit__ring--1" />
        <div className="gh-orbit__ring gh-orbit__ring--2" />
        <div className="gh-orbit__core">D</div>
      </div>
      <h3 className="gh-analyzing__title">
        {isNew ? 'আপনার লঞ্চ রোডম্যাপ তৈরি হচ্ছে' : 'আপনার রিপোর্ট প্রস্তুত হচ্ছে'}
      </h3>
      <p className="gh-analyzing__sub">উত্তরের ভিত্তিতে ব্যক্তিগতকৃত বিশ্লেষণ তৈরি হচ্ছে</p>

      {/* Progress track */}
      <div className="gh-analyzing__progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemax={100}>
        <div className="gh-analyzing__progress-fill" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="gh-an-steps" style={{ marginTop: 20 }}>
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
  const { answers, journeyMode } = state
  const isNew = journeyMode === 'new'
  const questions = isNew ? NEW_BIZ_QUESTIONS : AUDIT_QUESTIONS
  const { domainScores, overall } = calculateScores(answers, questions)
  const overallBand    = getBand(overall)
  const domainInsights = getDomainInsights(domainScores)
  const topActions     = getTopPriorityActions(answers, questions)
  const pkg            = recommendPackage(overall)
  const resultMsg      = getResultMessage(overall, isNew)
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

      {/* New biz welcome banner */}
      {isNew && (
        <div className="gh-newbiz-banner">
          <span className="gh-newbiz-banner__icon">🚀</span>
          <div>
            <div className="gh-newbiz-banner__title">আপনার লঞ্চ রেডিনেস স্কোর</div>
            <div className="gh-newbiz-banner__sub">আইডিয়া থাকাই যথেষ্ট নয় — প্রফেশনাল গাইডেন্স ছাড়া বাজেটের ৮০% নষ্ট হওয়ার ঝুঁকি ১০০%। নিচে আপনার রিপোর্ট দেখুন।</div>
          </div>
        </div>
      )}

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
      <div className={`gh-result-hero${vis ? ' animate-in' : ''}`} style={{ '--bc': overallBand.color, '--bb': overallBand.bg }}>
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
              {isNew ? (
                overall<=40 ? 'ভিত্তি দুর্বল। একা শুরু করলে বাজেটের ৮০% নষ্ট হওয়ার ঝুঁকি আছে।' :
                overall<=70 ? 'সঠিক পথে আছেন। প্রফেশনাল টাচ পেলে প্রথম মাসেই বিক্রি সম্ভব।' :
                'লঞ্চের জন্য প্রস্তুত! সঠিক এক্সপার্টের সাথে স্কেল করুন।'
              ) : (
                overall<=40 ? 'বিজ্ঞাপনে টাকা অপচয় হচ্ছে। অবিলম্বে প্রফেশনাল অডিট দরকার।' :
                overall<=70 ? 'সারভাইভাল মোডে আছেন। গ্রোথ ফানেল ছাড়া স্কেলিং সম্ভব না।' :
                overall<=85 ? 'শক্তিশালী বিজনেস! মাল্টি-চ্যানেল এক্সপ্যানশনের সময়।' :
                'অসাধারণ! মার্কেট লিডার হওয়ার পথে আছেন।'
              )}
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

      {/* ── Expert Verdict (Psychological Trigger) ──────── */}
      <div className="gh-expert-verdict" style={{ '--vc': resultMsg.urgencyColor, '--vbg': resultMsg.urgencyBg }}>
        <div className="gh-expert-verdict__icon" aria-hidden="true">
          {overall <= 40 ? <AlertTriangle size={18} strokeWidth={2} /> : overall <= 70 ? <TrendingUp size={18} strokeWidth={2} /> : <Award size={18} strokeWidth={2} />}
        </div>
        <div className="gh-expert-verdict__body">
          <p className="gh-expert-verdict__label">
            <span className="gh-expert-verdict__badge">বিশেষজ্ঞ মতামত</span>
            {resultMsg.risk && <span className="gh-expert-verdict__risk" style={{ color: resultMsg.urgencyColor, background: resultMsg.urgencyBg }}>{resultMsg.risk}</span>}
          </p>
          <p className="gh-expert-verdict__headline">{resultMsg.headline}</p>
          <p className="gh-expert-verdict__text">{resultMsg.body}</p>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent(resultMsg.cta + ' — স্কোর: ' + overall + '%')}`}
            target="_blank" rel="noopener noreferrer"
            className="gh-expert-verdict__cta"
            onClick={() => PIXEL.pkgInquiry('Expert CTA', overall)}>
            <WaIcon size={13} />
            {resultMsg.cta}
            <ArrowRight size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {/* ── Discount Coupon (PDF Hook) ───────────────────── */}
      <div className="gh-coupon" role="note" aria-label="বিশেষ ছাড়">
        <div className="gh-coupon__left">
          <p className="gh-coupon__tag">অডিট সম্পন্নকারীদের জন্য বিশেষ অফার</p>
          <p className="gh-coupon__discount">{DISCOUNT_COUPON.discount}</p>
          <p className="gh-coupon__validity">মেয়াদ: {DISCOUNT_COUPON.validity}</p>
        </div>
        <div className="gh-coupon__divider" aria-hidden="true">
          <div className="gh-coupon__notch gh-coupon__notch--top" />
          <div className="gh-coupon__line" />
          <div className="gh-coupon__notch gh-coupon__notch--bot" />
        </div>
        <div className="gh-coupon__right">
          <p className="gh-coupon__code-lbl">কুপন কোড</p>
          <p className="gh-coupon__code">{DISCOUNT_COUPON.code}</p>
          <p className="gh-coupon__use">WhatsApp-এ কথা বলার সময় ব্যবহার করুন</p>
        </div>
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
  const total = state.journeyMode === 'new'
    ? (typeof NEW_BIZ_QUESTIONS !== 'undefined' ? NEW_BIZ_QUESTIONS.length : 5)
    : AUDIT_QUESTIONS.length

  /* Section view pixel — fires once on mount */
  useEffect(() => { PIXEL.sectionView() }, [])

  /* Audit complete pixel — fires once when result phase begins */
  useEffect(() => {
    if (state.phase === 'result' && !firedLead.current) {
      const questions = state.journeyMode === 'new' ? NEW_BIZ_QUESTIONS : AUDIT_QUESTIONS
      const { overall } = calculateScores(state.answers, questions)
      const band = getBand(overall)
      PIXEL.auditComplete(overall, band.labelEn)
      firedLead.current = true
    }
  }, [state.phase])

  const handleStart = (journeyMode) => {
    PIXEL.auditStart()
    setState(s => ({ ...s, phase: 'audit', currentQ: 0, journeyMode }))
  }

  const handleAnswer = (qId, val) => {
    const ans  = { ...state.answers, [qId]: val }
    const next = state.currentQ + 1
    const questions = state.journeyMode === 'new' ? NEW_BIZ_QUESTIONS : AUDIT_QUESTIONS

    /* Domain-completion pixels (existing journey only) */
    if (state.journeyMode !== 'new') {
      if (next === 5  && !firedDomain.current.Marketing)  { PIXEL.domainDone('Marketing');  firedDomain.current.Marketing  = true }
      if (next === 10 && !firedDomain.current.Operations) { PIXEL.domainDone('Operations'); firedDomain.current.Operations = true }
    }

    setState(s => next >= questions.length
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
          {state.phase === 'audit'     && <PhaseAudit    state={state} onAnswer={handleAnswer} onBack={handleBack} journeyMode={state.journeyMode} />}
          {state.phase === 'analyzing' && <PhaseAnalyzing onDone={() => setState(s => ({ ...s, phase: 'result' }))} journeyMode={state.journeyMode} />}
          {state.phase === 'result'    && <PhaseResult   state={state} onRestart={handleRestart} />}
        </div>
      </div>
    </section>
  )
}
