import { useState, useRef } from 'react'
import './Finder.css'

const WA_NUMBER = '8801711992558'
const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)

/* ── SVG Icons ──────────────────────────────────── */
const Icon = {
  warning: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5L13.5 12.5H2.5L8 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 6.5v2.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  trend: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 11.5l4-4.5 3 3L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 4H14v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7.5V11M8 5.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  wa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  back: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ── Full flow tree ──────────────────────────────── */
const flow = {
  start: {
    q: 'আপনার ব্যবসার বর্তমান অবস্থা কী?',
    field: 'bizStatus',
    opts: [
      { label: 'নতুন ব্যবসা — শুরু করতে চাই',          val: 'new',     next: 'new_biz'      },
      { label: 'রানিং ব্যবসা — সেলস আরও বাড়াতে চাই',  val: 'running', next: 'running_biz'   },
    ]
  },
  new_biz: {
    q: 'প্রোডাক্ট সোর্সিং এবং ইনভেন্টরি কি প্রস্তুত?',
    field: 'sourcing',
    opts: [
      { label: 'হ্যাঁ — স্টক রেডি আছে',               val: 'yes', next: 'brand_check'      },
      { label: 'না — সোর্সিং প্রক্রিয়াধীন',           val: 'no',  next: 'brand_check'      },
    ]
  },
  running_biz: {
    q: 'বর্তমান সেলস চ্যানেল কীভাবে চলছে?',
    field: 'salesChannel',
    opts: [
      { label: 'শুধু Facebook পেজে বিক্রি করছি',       val: 'fb_only',      next: 'pain_point' },
      { label: 'ওয়েবসাইট বা ল্যান্ডিং পেজ আছে',       val: 'has_lp',       next: 'pain_point' },
      { label: 'মাল্টি-চ্যানেল — FB, Insta, ওয়েব',    val: 'multichannel', next: 'pain_point' },
    ]
  },
  pain_point: {
    q: 'গ্রোথের পথে আপনার সবচেয়ে বড় বাধা কোনটি?',
    field: 'barrier',
    opts: [
      { label: 'অ্যাডে খরচ হচ্ছে কিন্তু সেল আসছে না (Low ROAS)', val: 'low_roas',       next: 'tech_check' },
      { label: 'মেসেজ আসে অনেক কিন্তু কাস্টমার কেনে না',         val: 'conversion_drop', next: 'tech_check' },
      { label: 'ROI বা নিট লাভ ট্র্যাক করা যাচ্ছে না',          val: 'roi_tracking',    next: 'tech_check' },
      { label: 'মার্কেট অনেক কম্পিটিটিভ হয়ে গেছে',             val: 'competition',     next: 'tech_check' },
    ]
  },
  tech_check: {
    q: 'আপনার কি Pixel বা Conversion API (CAPI) সেটআপ আছে?',
    field: 'techStatus',
    opts: [
      { label: 'হ্যাঁ — ডাটা ট্র্যাকিং সেটআপ করা আছে', val: 'yes', next: 'roas_check' },
      { label: 'না বা জানি না (এটি কী?)',               val: 'no',  next: 'roas_check' },
    ]
  },
  roas_check: {
    q: 'আপনার বর্তমান গড় ROAS (Return on Ad Spend) কত?',
    field: 'currentRoas',
    opts: [
      { label: '২× এর কম — ব্রেক-ইভেন হচ্ছে না',         val: 'low',     next: 'creative_refresh' },
      { label: '২× – ৪× — মোটামুটি রেজাল্ট আসছে',         val: 'mid',     next: 'creative_refresh' },
      { label: '৫× এর বেশি — এখনই স্কেল করার সময়',       val: 'high',    next: 'creative_refresh' },
      { label: 'সঠিকভাবে জানা নেই',                       val: 'unknown', next: 'creative_refresh' },
    ]
  },
  creative_refresh: {
    q: 'বিজ্ঞাপনের ভিডিও বা ইমেজ কতদিন পর পর পরিবর্তন করেন?',
    field: 'creativeCycle',
    opts: [
      { label: 'একই কনটেন্ট অনেকদিন ধরে চলে',          val: 'stale',     next: 'brand_check' },
      { label: 'প্রতি মাসে নতুন কনটেন্ট ট্রাই করি',    val: 'monthly',   next: 'brand_check' },
      { label: 'সাপ্তাহিক নতুন ক্রিয়েটিভ টেস্ট করি',  val: 'weekly',    next: 'brand_check' },
      { label: 'রেগুলার পরিবর্তন করা হয় না',            val: 'irregular', next: 'brand_check' },
    ]
  },
  brand_check: {
    q: 'ব্র্যান্ডিং ও ভিজ্যুয়াল কনটেন্ট কি প্রফেশনালি তৈরি?',
    field: 'branding',
    opts: [
      { label: 'হ্যাঁ — লোগো ও ভিজ্যুয়াল আইডেন্টিটি রেডি', val: 'yes', next: 'customer_check' },
      { label: 'না — এখনো বেসিক লেভেলে আছি',               val: 'no',  next: 'customer_check' },
    ]
  },
  customer_check: {
    q: 'কাস্টমার ডাটাবেস আছে? (Email / WhatsApp লিস্ট)',
    field: 'hasDB',
    opts: [
      { label: 'হ্যাঁ — লিস্ট তৈরি আছে',              val: 'yes', next: 'marketing_status' },
      { label: 'না — এখনো তৈরি হয়নি',                 val: 'no',  next: 'marketing_status' },
    ]
  },
  marketing_status: {
    q: 'বিজ্ঞাপন এখন কিভাবে পরিচালনা করছেন?',
    field: 'marketing',
    opts: [
      { label: 'নিজে বুস্ট করছি',                      val: 'self',   next: 'budget_check' },
      { label: 'এজেন্সি বা ফ্রিল্যান্সার দিয়ে',        val: 'agency', next: 'budget_check' },
      { label: 'এখনো শুরু করিনি',                      val: 'none',   next: 'budget_check' },
    ]
  },
  budget_check: {
    q: 'মাসিক বিজ্ঞাপন বাজেট কতটুকু?',
    field: 'budget',
    opts: [
      { label: 'এখনো শুরু করিনি / ছোট বাজেটে টেস্ট করতে চাই', val: 'micro',  pkg: 'micro'  },
      { label: '১০,০০০ – ৩০,০০০ টাকা',                val: 'growth', pkg: 'growth' },
      { label: '৩০,০০০ টাকার বেশি — স্কেল করতে চাই',           val: 'brand',  pkg: 'brand'  },
    ]
  },
}

/* ── Package map ─────────────────────────────────── */
const pkgMap = {
  micro: {
    name: 'ছোট শুরু',
    price: 'ফ্রি থেকে শুরু',
    priceNote: 'শুধু অ্যাড খরচ দিন',
    tag: 'ঝুঁকিমুক্ত শুরু',
    key: 'micro',
  },
  growth: {
    name: 'মান্থলি কেয়ার',
    price: 'মাসিক',
    priceNote: 'ডেডিকেটেড গ্রোথ টিম',
    tag: 'সবচেয়ে জনপ্রিয়',
    key: 'growth',
  },
  brand: {
    name: 'ব্র্যান্ড কেয়ার',
    price: 'কাস্টম',
    priceNote: 'আপনার লক্ষ্য অনুযায়ী কৌশল',
    tag: 'ব্র্যান্ড বিল্ডিং',
    key: 'brand',
  },
}

/* ── Health score engine ─────────────────────────── */
const calcScore = (ans) => {
  let score = 40 // baseline
  if (ans.techStatus === 'yes')                                      score += 15
  if (ans.currentRoas === 'high')                                    score += 20
  else if (ans.currentRoas === 'mid')                                score += 10
  if (ans.creativeCycle === 'weekly')                                score += 10
  else if (ans.creativeCycle === 'monthly')                          score += 5
  if (ans.branding === 'yes')                                        score += 8
  if (ans.hasDB === 'yes')                                           score += 7
  if (ans.marketing === 'agency')                                    score += 5
  if (ans.salesChannel === 'multichannel')                           score += 10
  else if (ans.salesChannel === 'has_lp')                            score += 5
  return Math.min(score, 100)
}

const scoreLabel = (s) => {
  if (s >= 75) return 'শক্তিশালী অবস্থান'
  if (s >= 50) return 'গ্রোথের সুযোগ আছে'
  return 'অপ্টিমাইজেশন দরকার'
}

/* ── Advice per package ─────────────────────────── */
const getAdvice = (pkg, ans) => {
  if (pkg === 'micro') {
    if (ans.techStatus === 'no')
      return 'প্রথম কাজ হবে Pixel এবং CAPI সেটআপ। ট্র্যাকিং ছাড়া অ্যাড অপ্টিমাইজ করা অসম্ভব। কোনো চুক্তি নেই — ছোট বাজেটে শুরু করুন, ফলাফল দেখুন, তারপর সিদ্ধান্ত নিন।'
    return 'ঝুঁকিমুক্তভাবে শুরু করুন। ফ্রি অডিট দিয়ে বুঝুন কোথায় সুযোগ আছে, তারপর আপনার গতিতে এগিয়ে যান — কোনো চাপ নেই।'
  }
  if (pkg === 'growth') {
    if (ans.barrier === 'conversion_drop')
      return 'মেসেজ আসলেও কেনার হার কম — এটি ফানেলের মাঝের সমস্যা। মান্থলি কেয়ারে আনলিমিটেড ল্যান্ডিং পেজ + ক্রমাগত অপ্টিমাইজেশন দিয়ে এই লিক বন্ধ করা হবে।'
    return 'আনলিমিটেড ক্যাম্পেইন, ক্রিয়েটিভ এবং কনটেন্ট সাপোর্ট — প্রতি মাসে আপনার পাশে একটি ডেডিকেটেড টিম। ধারাবাহিক গ্রোথের জন্য এটিই সবচেয়ে কার্যকর পথ।'
  }
  if (pkg === 'brand') {
    if (ans.currentRoas === 'high')
      return 'আপনার পারফরম্যান্স ভালো — এখন ব্র্যান্ড পজিশনিং শক্তিশালী করার সময়। ব্র্যান্ড কেয়ারে আমরা আপনার ইউনিক অ্যাঙ্গেল খুঁজে বের করে বাজারে আলাদা পরিচিতি তৈরি করব।'
    return 'শুধু অ্যাড নয়, পুরো ব্র্যান্ড অভিজ্ঞতা তৈরি করুন। অডিট থেকে স্ট্র্যাটেজি, UX থেকে ক্রিয়েটিভ ক্যাম্পেইন — সবকিছু আপনার লক্ষ্য অনুযায়ী কাস্টম।'
  }
  return 'আপনার ব্যবসার নির্দিষ্ট লক্ষ্য ও বাজেট অনুযায়ী সম্পূর্ণ কাস্টম মার্কেটিং স্ট্র্যাটেজি তৈরি করা হবে।'
}

/* ── Insight engine ──────────────────────────────── */
const getInsights = (ans) => {
  const list = []

  // Creative fatigue
  if (ans.creativeCycle === 'stale' || ans.creativeCycle === 'irregular')
    list.push({
      label: 'ক্রিয়েটিভ ক্লান্তি (Ad Fatigue)',
      text: 'একই অ্যাড বারবার দেখলে CTR দ্রুত পড়ে যায়। প্রতি ১৫–৩০ দিনে নতুন হুক ও ভিডিও এঙ্গেল টেস্ট করলে কনভার্সন রেট ৩০% পর্যন্ত বাড়ানো সম্ভব।',
      icon: 'trend', bg: '#fef2f2', color: '#dc2626'
    })

  // ROAS & profitability
  if (ans.currentRoas === 'low' || ans.barrier === 'roi_tracking')
    list.push({
      label: 'প্রফিট মার্জিন অডিট দরকার',
      text: 'শুধু সেল নয়, ROI নিশ্চিত করতে আপনার প্রফিট মার্জিন অনুযায়ী Break-even ROAS ক্যালকুলেট করা জরুরি। আমরা আপনাকে সঠিক ড্যাশবোর্ড সেটআপে সাহায্য করতে পারি।',
      icon: 'check', bg: '#ecfdf5', color: '#10b981'
    })

  // Pixel/CAPI missing
  if (ans.techStatus === 'no')
    list.push({
      label: 'ট্র্যাকিং গ্যাপ — CAPI নেই',
      text: 'Pixel ও CAPI ছাড়া Facebook-এর AI বুঝতে পারছে না কোন কাস্টমার কেনে। এই সেটআপ করলে লার্নিং ফেজ দ্রুত শেষ হবে এবং CPA উল্লেখযোগ্যভাবে কমবে।',
      icon: 'info', bg: '#eff6ff', color: '#3b82f6'
    })

  // Conversion drop pain point
  if (ans.barrier === 'conversion_drop')
    list.push({
      label: 'ফানেল মিড-স্টেজ লিক',
      text: 'মেসেজ আসলেও কেনার হার কম — এটি Landing Page এর দুর্বলতা বা ফলো-আপ গ্যাপ। CRO অডিট এবং WhatsApp অটোমেশন দিয়ে এই লিক বন্ধ করা যায়।',
      icon: 'warning', bg: 'var(--amber-bg)', color: 'var(--amber)'
    })

  // Channel risk
  if (ans.salesChannel === 'fb_only')
    list.push({
      label: 'সিঙ্গেল চ্যানেল রিস্ক',
      text: 'শুধু Facebook-নির্ভর ব্যবসায় কনভার্সন রেট ৬০–৭০% কম থাকে। একটি ডেডিকেটেড ল্যান্ডিং পেজ যোগ করলে প্রতিটি লিড আরও মূল্যবান হয়।',
      icon: 'warning', bg: 'var(--amber-bg)', color: 'var(--amber)'
    })

  // Multichannel positive
  if (ans.salesChannel === 'multichannel')
    list.push({
      label: 'মাল্টি-চ্যানেল শক্তি',
      text: 'আপনার মাল্টি-চ্যানেল উপস্থিতি শক্তিশালী। Unified Pixel + Attribution সেটআপ করলে প্রতিটি চ্যানেলের ROI আলাদাভাবে ট্র্যাক করা যাবে।',
      icon: 'check', bg: 'var(--green-bg)', color: 'var(--green)'
    })

  // No customer DB
  if (ans.hasDB === 'no')
    list.push({
      label: 'রিটার্গেটিং অ্যাসেট নেই',
      text: 'কাস্টমার লিস্ট না থাকলে সবচেয়ে সস্তা অ্যাড (রিটার্গেটিং) চালানো সম্ভব না। এখনই WhatsApp বা Email লিড ক্যাপচার শুরু করুন।',
      icon: 'info', bg: '#eff6ff', color: '#3b82f6'
    })

  // Self-boost budget waste
  if (ans.marketing === 'self')
    list.push({
      label: 'বুস্ট = বাজেট অপচয়',
      text: 'Facebook Boost-এ ২০–৪০% বাজেট ভুল অডিয়েন্সে যায়। Ads Manager-এ প্রফেশনাল ক্যাম্পেইন সেটআপে ROI গড়ে ৩× বাড়ে।',
      icon: 'warning', bg: 'var(--amber-bg)', color: 'var(--amber)'
    })

  // High ROAS — scale signal
  if (ans.currentRoas === 'high')
    list.push({
      label: 'স্কেলিং সিগনাল',
      text: 'আপনার ROAS ইতোমধ্যে ৫×+ — এটি স্কেলিং করার সঠিক সময়। কিন্তু সতর্কতার সাথে না বাড়ালে ROAS দ্রুত পড়ে যাবে। Horizontal scaling strategy দরকার।',
      icon: 'trend', bg: 'var(--blue-light)', color: 'var(--blue)'
    })

  // Competition barrier
  if (ans.barrier === 'competition')
    list.push({
      label: 'কম্পিটিটিভ পজিশনিং',
      text: 'একই প্রোডাক্টে অনেক অ্যাড থাকলে Unique Angle দিয়ে দাঁড়াতে হবে। আপনার USP কে ক্রিয়েটিভে এবং অডিয়েন্স সেগমেন্টেশনে কাজে লাগানো এখন সবচেয়ে জরুরি।',
      icon: 'trend', bg: 'var(--blue-light)', color: 'var(--blue)'
    })

  return list.slice(0, 3)
}

/* ── Step counter ────────────────────────────────── */
const CORE = [
  'start', 'pain_point', 'tech_check', 'roas_check',
  'creative_refresh', 'brand_check', 'customer_check',
  'marketing_status', 'budget_check'
]
const TOTAL = CORE.length

const coreIdx = (id) => {
  const i = CORE.indexOf(id)
  return i >= 0 ? i : 0
}

/* ── Component ───────────────────────────────────── */
export default function Finder() {
  const [currentId, setCurrentId] = useState('start')
  const [history,   setHistory]   = useState([])
  const [answers,   setAnswers]   = useState({})
  const [selLabel,  setSelLabel]  = useState(null)
  const [phase,     setPhase]     = useState('quiz') // quiz | loading | result
  const [pkg,       setPkg]       = useState(null)
  const [visible,   setVisible]   = useState(true)
  const resultRef = useRef(null)

  const step    = flow[currentId]
  const idx     = coreIdx(currentId)
  const pct     = phase === 'result' ? 100 : Math.round((idx / (TOTAL - 1)) * 100)
  const stepNum = idx + 1

  const pick = (opt) => {
    if (selLabel) return
    setSelLabel(opt.label)
    const newAns = { ...answers, [step.field]: opt.val }
    setAnswers(newAns)

    setTimeout(() => {
      if (opt.pkg) {
        setPkg(pkgMap[opt.pkg])
        setPhase('loading')
        pixel('ViewContent', { content_name: pkgMap[opt.pkg].name })
        setTimeout(() => {
          setPhase('result')
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
        }, 2500)
      } else {
        setVisible(false)
        setTimeout(() => {
          setHistory(h => [...h, currentId])
          setCurrentId(opt.next)
          setSelLabel(null)
          setVisible(true)
        }, 180)
      }
    }, 260)
  }

  const goBack = () => {
    if (!history.length) return
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setCurrentId(prev)
    setSelLabel(null)
    setPhase('quiz')
    setVisible(true)
  }

  const reset = () => {
    setCurrentId('start')
    setHistory([])
    setAnswers({})
    setSelLabel(null)
    setPhase('quiz')
    setPkg(null)
    setVisible(true)
  }

  const insights = phase === 'result' ? getInsights(answers) : []
  const score    = phase === 'result' ? calcScore(answers) : 0
  const advice   = phase === 'result' && pkg ? getAdvice(pkg.key, answers) : ''

  return (
    <section id="finder" className="finder-section">
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০২</span>
          <span className="section-title-right">প্যাকেজ ফাইন্ডার</span>
        </div>

        <h2 className="finder-heading">আপনার জন্য কোন প্যাকেজ সঠিক?</h2>
        <p className="finder-sub">
          কয়েকটি প্রশ্নের উত্তর দিন — পাবেন একটি কাস্টম বিজনেস অডিট রিপোর্ট।
        </p>

        <div className="finder-card">

          {/* Progress */}
          <div className="finder-progress">
            <div className="finder-progress__fill" style={{ width: `${pct}%` }} />
          </div>

          {/* ── QUIZ ── */}
          {phase === 'quiz' && (
            <div
              className="finder-quiz"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateX(10px)',
                transition: 'opacity 0.17s ease, transform 0.17s ease'
              }}
            >
              <div className="finder-pips">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div
                    key={i}
                    className={`finder-pip${
                      i < stepNum - 1 ? ' finder-pip--done'
                      : i === stepNum - 1 ? ' finder-pip--current'
                      : ''
                    }`}
                  />
                ))}
              </div>

              <div className="finder-step-meta">
                <span className="finder-step-label">বিজনেস অডিট</span>
                <span className="finder-step-counter">{stepNum} / {TOTAL}</span>
              </div>

              <p className="finder-q">{step.q}</p>

              <div className="finder-opts">
                {step.opts.map((o, i) => (
                  <button
                    key={i}
                    className={`finder-opt${selLabel === o.label ? ' finder-opt--selected' : ''}`}
                    onClick={() => pick(o)}
                    disabled={!!selLabel}
                  >
                    <span className="finder-opt__key">
                      {String.fromCharCode(0x41 + i)}
                    </span>
                    <span className="finder-opt__text">{o.label}</span>
                    <span className="finder-opt__arrow">→</span>
                  </button>
                ))}
              </div>

              {history.length > 0 && (
                <button className="finder-back" onClick={goBack}>
                  {Icon.back} আগের প্রশ্নে ফিরুন
                </button>
              )}
            </div>
          )}

          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <div className="finder-loading">
              <div className="finder-loading__bar-track">
                <div className="finder-loading__bar" />
              </div>
              <h3 className="finder-loading__title">অডিট তৈরি হচ্ছে…</h3>
              <p className="finder-loading__sub">
                আপনার উত্তরের ভিত্তিতে বিজনেস হেলথ স্কোর ও কাস্টম রিপোর্ট প্রস্তুত হচ্ছে।
              </p>
              <div className="finder-loading__steps">
                {[
                  'বিজনেস প্রোফাইল বিশ্লেষণ',
                  'মার্কেট গ্যাপ ও ইনসাইট ক্যালকুলেট',
                  'সেরা প্যাকেজ নির্ধারণ সম্পন্ন',
                ].map((txt, i) => (
                  <div key={i} className={`finder-loading__step finder-loading__step--${i + 1}`}>
                    <span className="finder-loading__dot" />
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && pkg && (
            <div className="finder-result" ref={resultRef}>

              {/* Hero */}
              <div className="finder-result__hero">
                <div className="finder-result__live">
                  <span className="finder-result__live-dot" />
                  {pkg.tag}
                </div>
                <h3 className="finder-result__name">{pkg.name}</h3>
                <p className="finder-result__price">
                  <strong>{pkg.price}</strong>
                  {pkg.priceNote && <span> {pkg.priceNote}</span>}
                </p>

                {/* Health score */}
                <div className="finder-score">
                  <span className="finder-score__num">{score}</span>
                  <div className="finder-score__bar-wrap">
                    <div className="finder-score__bar-track">
                      <div className="finder-score__bar-fill" style={{ width: `${score}%` }} />
                    </div>
                    <span className="finder-score__label">{scoreLabel(score)}</span>
                  </div>
                </div>
              </div>

              {/* Insights */}
              {insights.length > 0 && (
                <div className="finder-insights">
                  <span className="finder-insights__label">আপনার বিজনেস ইনসাইট</span>
                  {insights.map((ins, i) => (
                    <div key={i} className="finder-insight">
                      <div
                        className="finder-insight__icon"
                        style={{ background: ins.bg, color: ins.color }}
                        aria-hidden="true"
                      >
                        {Icon[ins.icon]}
                      </div>
                      <div>
                        <div className="finder-insight__label">{ins.label}</div>
                        <p className="finder-insight__text">{ins.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Advice */}
              <div className="finder-advice">
                <div className="finder-advice__label">আমাদের রেকমেন্ডেশন</div>
                <p className="finder-advice__text">{advice}</p>
              </div>

              {/* CTAs */}
              <div className="finder-ctas">
                <button
                  className="finder-cta-primary"
                  onClick={() => {
                    pixel('InitiateCheckout', { content_name: pkg.name })
                    const scoreStr = `বিজনেস হেলথ স্কোর: ${score}/100 (${scoreLabel(score)})`
                    const insightStr = insights.map(ins => `• ${ins.label}`).join('\n')
                    const msg = `হ্যালো Digitalizen!\n\nআমি বিজনেস অডিট রিপোর্ট পেয়েছি।\n${scoreStr}\nসাজেস্টেড প্যাকেজ: ${pkg.name} (${pkg.price})\n\nমূল ইনসাইট:\n${insightStr}\n\nবিস্তারিত আলোচনা করতে চাই।`
                    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                >
                  {Icon.wa} WhatsApp-এ আলোচনা শুরু করুন
                </button>
                <button className="finder-cta-ghost" onClick={reset}>
                  আবার চেষ্টা করুন
                </button>
                <p className="finder-fine">কোনো বাধ্যবাধকতা নেই · পরামর্শ সম্পূর্ণ ফ্রি</p>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  )
}
