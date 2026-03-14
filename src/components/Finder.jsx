import { useState, useRef, useEffect, useCallback } from 'react'
import './Finder.css'
import { track, pushEngagement, WA_NUMBER } from '../analytics.js'


/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.
══════════════════════════════════════════════════ */

/* ── SVG Icons ──────────────────────────────────── */
const Icon = {
  warning: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5L13.5 12.5H2.5L8 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 6.5v2.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7.5V11M8 5.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  trend: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 11.5l4-4.5 3 3L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 4H14v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

/* ══════════════════════════════════════════════════
   13-QUESTION WEIGHTED BUSINESS AUDIT
══════════════════════════════════════════════════ */
const questions = [
  /* Q1 – Business stage: strong signal for all 3 dims */
  { id: 1, q: 'আপনার ব্যবসা এখন কোন অবস্থায় আছে?', hint: 'বর্তমান পরিস্থিতির সাথে যেটা সবচেয়ে মিলে সেটি বেছে নিন', opts: [
    { label: 'একদম নতুন শুরু করছি',                        scores: { foundation: 3 } },
    { label: 'চলছে কিন্তু এখনো ঠিকমতো জমেনি',              scores: { foundation: 2, growth: 1 } },
    { label: 'ব্যবসা চলছে কিন্তু সেল বাড়ছে না',            scores: { growth: 3 } },
    { label: 'মোটামুটি চলছে, এখন বড় করা দরকার',           scores: { growth: 2, authority: 1 } },
    { label: 'পরিচিত ব্র্যান্ড, এখন বড় স্কেলে যেতে চাই',  scores: { authority: 3 } },
  ] },
  /* Q2 – Business type: light signal, context only */
  { id: 2, q: 'আপনি কী ধরণের ব্যবসা করছেন?', hint: 'এটি জানলে আপনার জন্য সঠিক প্ল্যান দেওয়া সহজ হবে', opts: [
    { label: 'লোকাল সার্ভিস (এলাকা ভিত্তিক)', scores: { foundation: 1 } },
    { label: 'অনলাইন শপ / ই-কমার্স',          scores: { growth: 1 } },
    { label: 'প্রোডাক্ট ব্র্যান্ড',             scores: { growth: 1, authority: 1 } },
    { label: 'পার্সোনাল ব্র্যান্ড (নিজের নামে)', scores: { authority: 1 } },
    { label: 'অন্যান্য',                        scores: { foundation: 1 } },
  ] },
  /* Q3 – Online presence: strong foundation/growth signal */
  { id: 3, q: 'অনলাইনে আপনার ব্যবসার অবস্থা কী?', hint: 'সঠিক উত্তর দিন, তাহলেই আমরা সেরা সমাধান দিতে পারব', opts: [
    { label: 'অনলাইনে এখনো নামিনি',                              scores: { foundation: 3 } },
    { label: 'শুধু একটা ফেসবুক পেজ আছে',                        scores: { foundation: 2 } },
    { label: 'মাঝে মাঝে পোস্ট করি',                             scores: { growth: 1 } },
    { label: 'নিয়মিত পোস্ট করি',                                scores: { growth: 3 } },
    { label: 'অ্যাড দিই কিন্তু রেজাল্ট ভালো না',                scores: { growth: 2, authority: 1 } },
  ] },
  /* Q4 – Landing page quality: triggers landingPageWarning */
  { id: 4, q: 'আপনার কি কাস্টম ও হাই-স্পিড ল্যান্ডিং পেজ আছে?', hint: 'কমন ওয়ার্ডপ্রেস সাইট স্লো হয়, যা আপনার সেল অনেক কমিয়ে দেয়', opts: [
    { label: 'হ্যাঁ, কাস্টম কোড করা সুপার-ফাস্ট পেজ আছে',    scores: { authority: 2 } },
    { label: 'সাধারণ ওয়ার্ডপ্রেস বা টেম্পলেটে বানানো',        scores: { growth: 1 },     landingPageWarning: 'weak' },
    { label: 'না, শুধু ফেসবুক পেজ দিয়েই কাজ চালাই',           scores: { growth: 1 },     landingPageWarning: 'none' },
    { label: 'না, তবে প্রফেশনাল ল্যান্ডিং পেজ দরকার',         scores: { foundation: 2 }, landingPageWarning: 'none' },
  ] },
  /* Q5 – Marketer can design/code: triggers techGap */
  { id: 5, q: 'আপনার বর্তমান মার্কেটার কি ল্যান্ডিং পেজ এডিট বা ডিজাইন করতে পারেন?', hint: 'নতুন প্রোডাক্ট বা উৎসবের অফার দিতে দ্রুত পেজ ডিজাইন পরিবর্তন করা জরুরি', opts: [
    { label: 'না, এডিট করার জন্য আলাদা ডেভেলপার খুঁজতে হয়',   scores: { growth: 1 },     techGap: true },
    { label: 'হ্যাঁ, তিনি নিজেই ডিজাইন ও কোডিং সামলাতে পারেন', scores: { authority: 2 } },
    { label: 'মাঝে মাঝে পারেন, তবে অনেক সময় লেগে যায়',        scores: { growth: 1 },     techGap: true },
    { label: 'আমি আসলে কোনো টেকনিক্যাল সাপোর্ট পাই না',       scores: { foundation: 1 }, techGap: true },
  ] },
  /* Q6 – Seasonal campaign redesign: also techGap */
  { id: 6, q: 'উৎসব বা ক্যাম্পেইনের সময় আপনার ল্যান্ডিং পেজ কি আপডেট করা হয়?', hint: 'ঈদ বা পূজার মতো উৎসবে কাস্টম ডিজাইন আপনার ব্র্যান্ড ভ্যালু বাড়ায়', opts: [
    { label: 'না, সবসময় একই ডিজাইন থাকে',                          scores: { growth: 1 }, techGap: true },
    { label: 'হ্যাঁ, অফার অনুযায়ী ডিজাইন পরিবর্তন করি',            scores: { authority: 2 } },
    { label: 'ইচ্ছে থাকলেও টেকনিক্যাল সাপোর্টের অভাবে পারি না',   scores: { growth: 2 }, techGap: true },
  ] },
  /* Q7 – Pixel/CAPI: trackingWarning or kpiWarning */
  { id: 7, q: 'পেজে কি অ্যাডভান্সড ট্র্যাকিং (Pixel, CAPI) সেটআপ করা আছে?', hint: 'ডেভেলপমেন্ট নলেজ ছাড়া সঠিক সার্ভার-সাইড ট্র্যাকিং সেটআপ করা সম্ভব নয়', opts: [
    { label: 'হ্যাঁ, ব্রাউজার পিক্সেল এবং সার্ভার API (CAPI) দুটোই আছে', scores: { authority: 2 }, trackingOk: true },
    { label: 'শুধু পিক্সেল আছে, কিন্তু সব ডাটা ঠিকমতো ট্র্যাক হয় না', scores: { growth: 1 },     kpiWarning: true },
    { label: 'না, ট্র্যাকিং এর টেকনিক্যাল বিষয়গুলো করা নেই',        scores: { growth: 1 },     trackingWarning: true },
    { label: 'ঠিক জানি না আমার পেজ ডাটা ট্র্যাক করছে কি না',         scores: { foundation: 1 }, trackingWarning: true },
  ] },
  /* Q8 – KPI measurement: kpiWarning if not tracking ROAS */
  { id: 8, q: 'মার্কেটিংয়ের সাফল্য বা KPI কীভাবে মাপেন?', hint: 'সঠিক ROAS হিসাব না রাখলে বিজ্ঞাপনের বাজেট অপচয় হয়', opts: [
    { label: 'আমি ROAS এবং প্রফিট নিয়মিত ট্র্যাক করি',                  scores: { authority: 2 } },
    { label: 'শুধু ফেসবুক অ্যাড ম্যানেজারের রিপোর্ট দেখি',              scores: { growth: 1 },     kpiWarning: true },
    { label: 'লাইক, কমেন্ট আর মেসেজ সংখ্যা দেখে বুঝি',                 scores: { foundation: 1 }, kpiWarning: true },
    { label: 'হিসাব ওভাবে দেখা হয় না',                                   scores: { foundation: 1 }, kpiWarning: true },
  ] },
  /* Q9 – Who manages marketing */
  { id: 9, q: 'মার্কেটিং এখন কীভাবে সামলাচ্ছেন?', hint: 'এটি জানলে বুঝতে পারব কোথায় উন্নতি করা দরকার', opts: [
    { label: 'নিজেই বুস্ট করি বা পরিচিত কেউ করে দেয়',  scores: { foundation: 2 } },
    { label: 'নিজেই অ্যাড ম্যানেজার চালাই',              scores: { growth: 1 } },
    { label: 'ফ্রিল্যান্সার বা এজেন্সি দিয়ে করাচ্ছি',   scores: { growth: 2 } },
    { label: 'প্রফেশনাল টিমের সাপোর্ট দরকার',            scores: { authority: 2 } },
  ] },
  /* Q10 – Biggest problem right now */
  { id: 10, q: 'এই মুহূর্তে সবচেয়ে বড় সমস্যা কী?', hint: 'সমস্যা জানলেই সমাধানের পথ পাওয়া যাবে', opts: [
    { label: 'কাস্টমার পাচ্ছি না',              scores: { growth: 3 } },
    { label: 'পোস্ট করি কিন্তু সেল আসে না',    scores: { growth: 3 } },
    { label: 'অ্যাড চালাই কিন্তু লাভ হচ্ছে না', scores: { growth: 2 } },
    { label: 'ব্র্যান্ড হিসেবে পরিচিতি নেই',    scores: { authority: 2 } },
  ] },
  /* Q11 – Content creation */
  { id: 11, q: 'আপনার কন্টেন্ট (ভিডিও/ছবি) কে তৈরি করে?', hint: 'ভালো কন্টেন্ট ছাড়া এখন সেল আসা কঠিন', opts: [
    { label: 'নিজেই করি',               scores: { foundation: 1 } },
    { label: 'আমার ছোট টিম আছে',        scores: { growth: 1 } },
    { label: 'প্রফেশনাল সাপোর্ট দরকার', scores: { growth: 2 } },
  ] },
  /* Q12 – 6-month goal: sets budgetSignal context */
  { id: 12, q: 'আগামী ৬ মাসের মধ্যে আপনার লক্ষ্য কী?', hint: 'লক্ষ্য পরিষ্কার থাকলে সাফল্য দ্রুত আসবে', opts: [
    { label: 'কোনোমতে ব্যবসা টিকিয়ে রাখা',       scores: { foundation: 2 }, budgetSignal: 'care_plus' },
    { label: 'বাজারে শক্ত অবস্থান তৈরি করা',      scores: { growth: 2 },     budgetSignal: 'monthly_care' },
    { label: 'মার্কেট লিডার বা বড় ব্র্যান্ড হওয়া', scores: { authority: 3 }, budgetSignal: 'brand_care' },
  ] },
  /* Q13 – Direct service request: STRONGEST budgetSignal, overrides Q12 */
  { id: 13, q: 'আপনি আমাদের থেকে কী ধরণের সাহায্য চান?', hint: 'আমরা আপনার পাশে থাকতে চাই', opts: [
    { label: 'বেসিক গাইডলাইন ও অডিট',            scores: { foundation: 1 }, budgetSignal: 'care_plus' },
    { label: 'নিয়মিত গ্রোথ ও অ্যাড ম্যানেজমেন্ট', scores: { growth: 3 },     budgetSignal: 'monthly_care' },
    { label: 'ফুল ব্র্যান্ডিং ও কাস্টম টেক সাপোর্ট', scores: { authority: 3 }, budgetSignal: 'brand_care' },
  ] },
]

const TOTAL = questions.length

const PACKAGES = {
  care_plus:    { variant: 'basic',   name: 'Care+',        price: '০ টাকা সার্ভিস চার্জ', priceNote: 'শুধু অ্যাড বাজেট', tag: 'আর্লি স্টেজ',    waLabel: 'CarePlus' },
  monthly_care: { variant: 'popular', name: 'Monthly Care', price: '১০,০০০ টাকা থেকে শুরু', priceNote: 'মাসিক',           tag: 'গ্রোথ স্টেজ',    waLabel: 'MonthlyCare' },
  brand_care:   { variant: 'premium', name: 'Brand Care',   price: '৩০,০০০ টাকা থেকে শুরু', priceNote: 'মাসিক',           tag: 'অথরিটি স্টেজ',   waLabel: 'BrandCare' },
}

const MAX_POSSIBLE = { foundation: 18, growth: 25, authority: 25 }

const normalizeScore = (f, g, a) => {
  const total = f + g + a
  if (total === 0) return 0
  const max = MAX_POSSIBLE.foundation + MAX_POSSIBLE.growth + MAX_POSSIBLE.authority
  return Math.round((total / max) * 100)
}

/* decidePackage — Q13 is the direct service request and always sets lastBudgetSignal.
   If any budgetSignal was given we honour it exactly. Score dominance only fires when
   neither Q12 nor Q13 carried a budgetSignal (edge-case: user somehow skipped both). */
const decidePackage = (f, g, a, lastBudgetSignal) => {
  if (lastBudgetSignal) return lastBudgetSignal
  // Fallback: pure score dominance
  const dom = f >= g && f >= a ? 'foundation' : g >= a ? 'growth' : 'authority'
  return dom === 'foundation' ? 'care_plus' : dom === 'growth' ? 'monthly_care' : 'brand_care'
}

/* scoreLabel — derived from pkgKey so the bar label always matches the recommendation.
   The numeric score is a business-health %, not a stage classifier on its own. */
const scoreLabel = (pkgKey) =>
  pkgKey === 'care_plus' ? 'আর্লি স্টেজ' : pkgKey === 'monthly_care' ? 'গ্রোথ স্টেজ' : 'অথরিটি লেভেল'

const getDiagnosis = (pkgKey) => ({
  care_plus: {
    stage: 'আপনার ব্যবসা এখন একদম শুরুর দিকে আছে।',
    insight: 'শুরুতেই টেকনিক্যাল সাপোর্ট না থাকলে আপনি অহেতুক বাজে ডিজাইন বা স্লো পেজের পেছনে টাকা নষ্ট করবেন।',
    advice: 'আমাদের Care+ এ আমরা আপনার বেসিক টেকনিক্যাল চেকআপ করে দেব। আপনার প্রথম ল্যান্ডিং পেজটি যাতে হাই-কনভার্টিং হয়, সেই পরামর্শ আমরাই দেব।',
  },
  monthly_care: {
    stage: 'আপনার ব্যবসা এখন বড় হওয়ার (Growth) পথে।',
    insight: 'আপনার এমন একটি টিম দরকার যারা শুধু অ্যাড চালাবে না, বরং সিজনাল অফার বা নতুন প্রোডাক্টের জন্য মুহূর্তেই ল্যান্ডিং পেজ ডিজাইন করে দিতে পারবে।',
    advice: 'Monthly Care প্যাকেজে Digitalizen আপনার পার্সোনাল টেক-টিম হিসেবে কাজ করবে। নতুন প্রোডাক্ট লঞ্চ বা উৎসবের অফার—আমরাই আপনার ল্যান্ডিং পেজ রি-ডিজাইন এবং পিক্সেল সেটআপ করে দেব। আপনাকে আর আলাদা করে ডেভেলপার খুঁজতে হবে না।',
  },
  brand_care: {
    stage: 'আপনার ব্যবসা এখন মার্কেট লিডার হওয়ার জন্য তৈরি।',
    insight: 'এই পর্যায়ে আপনার কাস্টম ব্র্যান্ড আইডেন্টিটি এবং ডাইনামিক সেলস ফানেল থাকা বাধ্যতামূলক। সাধারণ ওয়ার্ডপ্রেস সাইট আপনার স্কেলিং আটকে দিচ্ছে।',
    advice: 'Brand Care-এ আমরা আপনার জন্য আনলিমিটেড ল্যান্ডিং পেজ সাপোর্ট রাখব। উৎসবের ধরণ বা প্রোডাক্টের বৈশিষ্ট্য অনুযায়ী আমরা নিয়মিত পেজ রি-ডিজাইন করব। প্রোগ্রামিং এবং মার্কেটিং-এর এই কম্বিনেশন আপনার ব্র্যান্ডকে সবার থেকে এগিয়ে রাখবে।',
  },
}[pkgKey])

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Finder() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers,  setAnswers]  = useState([])
  const [selIdx,   setSelIdx]   = useState(null)
  const [phase,    setPhase]    = useState('quiz')
  const [visible,  setVisible]  = useState(true)
  const [result,   setResult]   = useState(null)

  const resultRef      = useRef(null)
  const sectionRef     = useRef(null)
  const enterTimeRef   = useRef(null)
  const sectionFiredRef = useRef(false)
  const quizStartTime  = useRef(null)   // when user answered Q1
  const dropOffQRef    = useRef(null)   // last question reached before abandon

  const q   = questions[currentQ]
  const pct = phase === 'result' ? 100 : Math.round((currentQ / TOTAL) * 100)

  /* ── Section ViewContent + time-on-section + drop-off tracking ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sectionFiredRef.current) {
          sectionFiredRef.current = true
          enterTimeRef.current    = Date.now()
          track('ViewContent', {
            content_name:     'Finder Section',
            content_category: 'Section',
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('finder', enterTimeRef, { quiz_drop_off_question: dropOffQRef.current })

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  /* ── Keyboard: press A–E to select option ── */
  useEffect(() => {
    if (phase !== 'quiz') return
    const onKey = (e) => {
      if (selIdx !== null) return
      const idx = e.key.toUpperCase().charCodeAt(0) - 65  // A=0, B=1 …
      if (idx >= 0 && idx < q.opts.length) pick(idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, selIdx, currentQ, q]) // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setCurrentQ(0); setAnswers([]); setSelIdx(null)
    setPhase('quiz'); setVisible(true); setResult(null)
    quizStartTime.current  = null
    dropOffQRef.current    = null
    track('ViewContent', {
      content_name:     'Finder Quiz Restart',
      content_category: 'Quiz',
    })
  }, [])

  const pick = useCallback((optIdx) => {
    if (selIdx !== null) return
    setSelIdx(optIdx)

    const opt         = q.opts[optIdx]
    const newAnswers  = [...answers, opt]
    dropOffQRef.current = currentQ + 1   // update last-reached question

    // Fire quiz start on Q1
    if (currentQ === 0 && !quizStartTime.current) {
      quizStartTime.current = Date.now()
      track('InitiateCheckout', {
        content_name:     'Finder Quiz Start',
        content_category: 'Quiz',
        currency:         'BDT',
        value:            0,
      })
    }

    // Per-question tracking — gives funnel drop-off visibility
    track('ViewContent', {
      content_name:      `Finder Q${q.id}: ${opt.label}`,
      content_category:  'Quiz Answer',
      content_ids:       [`finder_q${q.id}`],
      quiz_question:     q.id,
      quiz_answer_index: optIdx + 1,
      quiz_progress_pct: Math.round(((currentQ + 1) / TOTAL) * 100),
    })

    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        if (currentQ < TOTAL - 1) {
          setAnswers(newAnswers); setCurrentQ(currentQ + 1)
          setSelIdx(null); setVisible(true)
        } else {
          setAnswers(newAnswers); setPhase('loading'); setVisible(true)
          setTimeout(() => {
            const res = computeResult(newAnswers)
            setResult(res)
            setPhase('result')
            // Fire Lead on quiz completion — this is a high-intent signal
            const timeSpent = quizStartTime.current
              ? Math.round((Date.now() - quizStartTime.current) / 1000)
              : 0
            track('Lead', {
              content_name:         `Finder Result: ${res.pkg.name}`,
              content_category:     'Quiz Complete',
              content_ids:          [`finder_pkg_${res.pkgKey}`],
              currency:             'BDT',
              value:                0,
              quiz_score:           res.score,
              quiz_package:         res.pkg.waLabel,
              quiz_time_seconds:    timeSpent,
              tracking_warning:     res.trackingWarning,
              kpi_warning:          res.kpiWarning,
              tech_gap:             res.techGap,
            })
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
          }, 3000)
        }
      }, 170)
    }, 400)
  }, [selIdx, currentQ, answers, q])

  const goBack = useCallback(() => {
    if (currentQ === 0) return
    setVisible(false)
    setTimeout(() => {
      setAnswers(answers.slice(0, -1)); setCurrentQ(currentQ - 1)
      setSelIdx(null); setVisible(true)
    }, 170)
  }, [currentQ, answers])

  const computeResult = (all) => {
    let f = 0, g = 0, a = 0
    let trackingWarning = false, kpiWarning = false, landingPageWarning = null, techGap = false
    let lastBudgetSignal = null
    all.forEach((opt) => {
      f += opt.scores?.foundation || 0
      g += opt.scores?.growth     || 0
      a += opt.scores?.authority  || 0
      if (opt.trackingWarning)    trackingWarning    = true
      if (opt.kpiWarning)         kpiWarning         = true
      if (opt.landingPageWarning) landingPageWarning = opt.landingPageWarning
      if (opt.techGap)            techGap            = true
      if (opt.budgetSignal)       lastBudgetSignal   = opt.budgetSignal
    })
    const score  = normalizeScore(f, g, a)
    const pkgKey = decidePackage(f, g, a, lastBudgetSignal)
    return { score, pkgKey, pkg: PACKAGES[pkgKey], diag: getDiagnosis(pkgKey), trackingWarning, kpiWarning, landingPageWarning, techGap }
  }

  const buildWaMsg = () => {
    if (!result) return ''
    const stage = scoreLabel(result.pkgKey).replace(/\s/g, '')
    const bs    = answers.find(a => a.budgetSignal)?.budgetSignal || 'unknown'
    const bMap  = { care_plus: 'Under10k', monthly_care: '10kTo30k', brand_care: 'Over30k', unknown: 'Unknown' }
    return `HelloDigitalizenAuditReportScore${result.score}Stage${stage}Budget${bMap[bs]}Package${result.pkg.waLabel}`
  }

  const handleCtaPrimary = useCallback(() => {
    track('InitiateCheckout', {
      content_name:     `Finder CTA: ${result.pkg.name}`,
      content_category: 'CTA',
      content_ids:      [`finder_pkg_${result.pkgKey}`],
      currency:         'BDT',
      value:            0,
      quiz_score:       result.score,
      quiz_package:     result.pkg.waLabel,
    })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg())}`, '_blank')
  }, [result])

  const handleUpsell = useCallback(() => {
    track('AddToCart', {
      content_name:     'Monthly Care Upsell',
      content_category: 'Upsell',
      content_ids:      ['finder_pkg_monthly_care'],
      currency:         'BDT',
      value:            0,
    })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো Digitalizen! আমি Monthly Care প্ল্যান সম্পর্কে জানতে চাই।')}`, '_blank')
  }, [])

  const warnings = result ? [
    /* W1 – No pixel/CAPI at all: red, critical */
    result.trackingWarning && {
      color: 'red', icon: 'warning',
      title: 'পিক্সেল ও CAPI ট্র্যাকিং মিসিং!',
      text:  'সঠিক ট্র্যাকিং ছাড়া ফেসবুকের অ্যালগরিদম বুঝতে পারে না আপনার আসল কাস্টমার কারা। এতে বিজ্ঞাপনের টাকা নষ্ট হয়।',
    },
    /* W2 – Pixel only / no ROAS tracking: amber, data gap */
    result.kpiWarning && {
      color: 'amber', icon: 'info',
      title: 'সঠিক ডাটা ট্র্যাকিং নেই',
      text:  'ROAS এবং প্রফিট ট্র্যাক না করলে আপনি বুঝতে পারবেন না মার্কেটিং থেকে আসলে কত লাভ হচ্ছে।',
    },
    /* W3 – No dev/design support: amber, Digitalizen USP hook */
    result.techGap && {
      color: 'amber', icon: 'warning',
      title: 'আপনার কি সিজনাল ডিজাইন সাপোর্ট আছে?',
      text:  'মার্কেটিং টিম যদি ল্যান্ডিং পেজ এডিট করতে না পারে, তবে ক্যাম্পেইনের গতি কমে যায়। Digitalizen-এর বিশেষত্ব: আমরা যেহেতু নিজেই প্রোগ্রামিং বুঝি, তাই যেকোনো উৎসব বা অফারে আপনার পেজ আমরাই ইনস্ট্যান্ট আপডেট করে দেই।',
    },
    /* W4 – Landing page issue: title & text differ by 'none' vs 'weak' */
    result.landingPageWarning && {
      color: 'amber', icon: 'warning',
      title: result.landingPageWarning === 'none'
        ? 'ল্যান্ডিং পেজ নেই!'
        : 'ল্যান্ডিং পেজ স্লো ও দুর্বল',
      text: result.landingPageWarning === 'none'
        ? 'ল্যান্ডিং পেজ ছাড়া অ্যাডের ট্রাফিক কোথাও যাচ্ছে না। শুধু ফেসবুক ইনবক্সে পাঠানো কনভার্সন অনেক কমিয়ে দেয়। একটি কাস্টম হাই-স্পিড পেজ আপনার সেল ২–৩ গুণ বাড়াতে পারে।'
        : 'WordPress বা টেম্পলেট পেজ লোড হতে দেরি হয় — গবেষণা বলছে ১ সেকেন্ড দেরিতে ৭% কনভার্সন কমে। কাস্টম কোড করা পেজ আপনার অ্যাড বাজেটের সর্বোচ্চ ব্যবহার নিশ্চিত করে।',
    },
  ].filter(Boolean) : []

  /* ─── RENDER ─── */
  return (
    <section id="finder" className="finder-section" ref={sectionRef}>
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০১</span>
          <span className="section-title-right">প্যাকেজ ফাইন্ডার</span>
        </div>

        <h2 className="finder-heading">আপনার ব্যবসার জন্য সঠিক প্ল্যান কোনটি?</h2>
        <p className="finder-sub">
          ১৩টি প্রশ্নে আপনার বিজনেসের বর্তমান অবস্থা এবং টেকনিক্যাল গ্যাপ জেনে নিন।
        </p>

        <div className="finder-card">

          {/* ── QUIZ ── */}
          {phase === 'quiz' && (
            <div className="finder-quiz" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(12px)', transition: 'opacity 0.17s ease, transform 0.17s ease' }}>
              <div className="finder-pips">
                {questions.map((_, i) => (
                  <div key={i} className={`finder-pip${i < currentQ ? ' finder-pip--done' : i === currentQ ? ' finder-pip--current' : ''}`} />
                ))}
              </div>

              <div className="finder-step-meta">
                <span className="finder-step-label">বিজনেস ও টেক অডিট</span>
                <span className="finder-step-counter">প্রশ্ন {bn(currentQ + 1)} / {bn(TOTAL)}</span>
              </div>

              <p className="finder-q">{q.q}</p>
              {q.hint && <p className="finder-hint">{q.hint}</p>}

              {/* Keyboard hint — only on desktop */}
              <p className="finder-keyboard-hint" aria-hidden="true">
                কীবোর্ড শর্টকাট: A, B, C… চাপুন
              </p>

              <div className="finder-opts">
                {q.opts.map((o, i) => (
                  <button
                    key={i}
                    className={`finder-opt${selIdx === i ? ' finder-opt--selected' : ''}`}
                    onClick={() => pick(i)}
                    disabled={selIdx !== null}
                    aria-label={`বিকল্প ${String.fromCharCode(0x41 + i)}: ${o.label}`}
                  >
                    <span className="finder-opt__key">{String.fromCharCode(0x41 + i)}</span>
                    <span className="finder-opt__text">{o.label}</span>
                    <span className="finder-opt__arrow">→</span>
                  </button>
                ))}
              </div>

              {currentQ > 0 && (
                <button className="finder-back" onClick={goBack}>{Icon.back} আগের প্রশ্নে ফিরুন</button>
              )}
            </div>
          )}

          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <div className="finder-loading">
              <div className="finder-loading__congrats">
                <div className="finder-loading__badge">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="14" r="14" fill="rgba(31,75,255,0.1)"/>
                    <path d="M8 14l4 4 8-8" stroke="#1F4BFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="finder-loading__check-path"/>
                  </svg>
                </div>
                <div>
                  <h3 className="finder-loading__title">আপনার ডাটা ও ট্র্যাকিং অডিট করা হচ্ছে...</h3>
                  <p className="finder-loading__sub">আমরা আপনার তথ্যগুলো যাচাই করছি, একটু অপেক্ষা করুন।</p>
                </div>
              </div>

              <div className="finder-loading__bar-track">
                <div className="finder-loading__bar" />
              </div>

              <div className="finder-loading__steps">
                {[
                  { txt: 'আপনার পেজের ডিজাইন ও ইউজার এক্সপেরিয়েন্স অডিট করা হচ্ছে...', delay: 1 },
                  { txt: 'অফার অনুযায়ী পেজ রি-ডিজাইন করার সুবিধা যাচাই করা হচ্ছে...', delay: 2 },
                  { txt: 'আপনার বিজনেসের জন্য একটি ফুল-স্ট্যাক গ্রোথ প্ল্যান তৈরি হচ্ছে...', delay: 3 },
                ].map((s, i) => (
                  <div key={i} className={`finder-loading__step finder-loading__step--${i + 1}`}>
                    <span className="finder-loading__step-icon" aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {s.txt}
                  </div>
                ))}
              </div>

              <div className="finder-loading__footer">
                <span className="finder-loading__footer-dot" /><span className="finder-loading__footer-dot" /><span className="finder-loading__footer-dot" />
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && result && (
            <div className="finder-result" ref={resultRef}>

              <div className={`finder-result__hero finder-result__hero--${result.pkg.variant}`}>
                {result.pkg.variant === 'premium' && <div className="finder-result__gold-strip" aria-hidden="true" />}
                <div className="finder-result__live">
                  <span className={`finder-result__live-dot finder-result__live-dot--${result.pkg.variant}`} />
                  {result.pkg.tag}
                </div>
                <h3 className="finder-result__name">{result.pkg.name}</h3>
                <p className="finder-result__price">
                  <strong>{result.pkg.price}</strong>
                  {result.pkg.priceNote && <span> · {result.pkg.priceNote}</span>}
                </p>
                <div className={`finder-score finder-score--${result.pkg.variant}`}>
                  <span className="finder-score__num">{result.score}</span>
                  <div className="finder-score__bar-wrap">
                    <div className="finder-score__bar-track">
                      <div className={`finder-score__bar-fill finder-score__bar-fill--${result.pkg.variant}`} style={{ width: `${result.score}%` }} />
                    </div>
                    <span className="finder-score__label">{scoreLabel(result.pkgKey)}</span>
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="finder-warnings">
                  {warnings.map((w, i) => (
                    <div key={i} className={`finder-warning finder-warning--${w.color}`}>
                      <div className={`finder-warning__icon finder-warning__icon--${w.color}`}>{Icon[w.icon]}</div>
                      <div>
                        <div className="finder-warning__title">{w.title}</div>
                        <p className="finder-warning__text">{w.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="finder-insights">
                <span className="finder-insights__label">আপনার ব্যবসার ইনসাইট</span>
                <div className="finder-insight">
                  <div className="finder-insight__icon" style={{ background: '#EEF1FC', color: '#1F4BFF' }}>{Icon.trend}</div>
                  <div>
                    <div className="finder-insight__label">ব্যবসার অবস্থান</div>
                    <p className="finder-insight__text">{result.diag.stage}</p>
                  </div>
                </div>
                <div className="finder-insight">
                  <div className="finder-insight__icon" style={{ background: '#FEF3C7', color: '#D97706' }}>{Icon.info}</div>
                  <div>
                    <div className="finder-insight__label">ডিজিটাল স্ট্রাটেজি ও ডিজাইন অডিট রিপোর্ট</div>
                    <p className="finder-insight__text">{result.diag.insight}</p>
                  </div>
                </div>
              </div>

              <div className={`finder-advice finder-advice--${result.pkg.variant}`}>
                <div className="finder-advice__label">আমাদের পরামর্শ</div>
                <p className="finder-advice__text">{result.diag.advice}</p>
              </div>

              {result.pkgKey === 'care_plus' && (
                <div className="finder-upsell">
                  <div className="finder-upsell__label">Monthly Care এ গেলে যা পাবেন</div>
                  <p className="finder-upsell__text">আনলিমিটেড ক্যাম্পেইন, কনটেন্ট স্ট্রাটেজি, Meta Pixel সেটআপ এবং ডেডিকেটেড গ্রোথ টিমের সাথে আপনার ব্যবসা অনেক দ্রুত এগিয়ে যাবে।</p>
                  <button className="finder-upsell__btn" onClick={handleUpsell}>
                    Monthly Care সম্পর্কে জানুন
                  </button>
                </div>
              )}

              <div className="finder-ctas">
                <button className={`finder-cta-primary finder-cta-primary--${result.pkg.variant}`} onClick={handleCtaPrimary}>
                  {Icon.wa} WhatsApp-এ আলাপ শুরু করি
                </button>
                <button className="finder-cta-ghost" onClick={reset}>আবার চেকআপ করুন</button>
                <p className="finder-fine">কোনো বাধ্যবাধকতা নেই, পরামর্শ একদম ফ্রি</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const bn = (n) => String(n).split('').map(d => '০১২৩৪৫৬৭৮৯'[+d] ?? d).join('')
