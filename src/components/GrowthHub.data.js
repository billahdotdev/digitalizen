/* ══════════════════════════════════════════════════════════
   GrowthHub.data.js  —  Business Audit Engine v3
   ══════════════════════════════════════════════════════════ */

export const WA    = '8801711992558'
export const BRAND = 'Digitalizen'

/* ─── Meta Pixel ──────────────────────────────────────────
   Centralised pixel helper. All fbq calls flow through here
   so nothing breaks if the pixel hasn't loaded yet.
─────────────────────────────────────────────────────────── */
export function pixel(event, params = {}) {
  try { window.fbq?.('track', event, params) } catch (_) {}
}

/* Named pixel events — import & call these from the component */
export const PIXEL = {
  /** User scrolls the section into view */
  sectionView:   ()                     => pixel('ViewContent',       { content_name: 'GrowthHub Audit', content_category: 'Lead Gen' }),
  /** User clicks "Start Audit" */
  auditStart:    ()                     => pixel('CustomizeProduct',   { content_name: 'GrowthHub Audit Started' }),
  /** Domain completed (Marketing = 5, Operations = 10) */
  domainDone:    (domainName)           => pixel('AddToCart',          { content_name: `GrowthHub ${domainName} Complete`, content_category: 'Audit Progress' }),
  /** All 15 questions answered — primary Lead event */
  auditComplete: (overall, bandEn)      => pixel('Lead',              { content_name: 'GrowthHub Audit Completed', value: overall, currency: 'BDT', status: bandEn }),
  /** WhatsApp full-report button clicked */
  waReportClick: (overall)              => pixel('Contact',            { content_name: 'GrowthHub WA Full Report', value: overall, currency: 'BDT' }),
  /** WhatsApp package-inquiry button clicked */
  pkgInquiry:    (pkgName, overall)     => pixel('InitiateCheckout',   { content_name: pkgName, content_category: 'Package Inquiry', value: overall, currency: 'BDT' }),
  /** PDF downloaded */
  pdfDownload:   (overall)              => pixel('Lead',              { content_name: 'GrowthHub PDF Download', content_category: 'PDF Export', value: overall, currency: 'BDT' }),
}

/* ─── Domains ─────────────────────────────────────────── */
export const AUDIT_DOMAINS = [
  { key: 'marketing',  label: 'মার্কেটিং',  labelEn: 'Marketing',  color: '#1F4BFF', colorLight: '#EEF2FF', colorMid: '#6385FF', desc: 'অ্যাডস, কনটেন্ট, ব্র্যান্ড ভিজিবিলিটি' },
  { key: 'operations', label: 'অপারেশনস', labelEn: 'Operations', color: '#7C3AED', colorLight: '#F3EFFE', colorMid: '#A78BFA', desc: 'প্রোডাক্ট, ডেলিভারি, টিম' },
  { key: 'finance',    label: 'ফাইন্যান্স',  labelEn: 'Finance',    color: '#059669', colorLight: '#ECFDF5', colorMid: '#34D399', desc: 'ক্যাশফ্লো, প্রফিট, ইনভেস্টমেন্ট' },
]

/* ─── Questions ───────────────────────────────────────── */
export const AUDIT_QUESTIONS = [

  /* ── মার্কেটিং (১–৫) ─────────────────────────────────── */
  {
    id: 'mkt_1', domain: 'marketing', iconKey: 'target',
    q: 'আপনার বিজনেসের টার্গেট কাস্টমার কারা — এটা কি পরিষ্কারভাবে জানেন?',
    hint: 'সঠিক মানুষকে না চিনলে বিজ্ঞাপনের টাকা জলে যায়।',
    options: [
      { value:0, label:'মোটেও না', sub:'কাকে বিক্রি করছি তা পরিষ্কার না' },
      { value:1, label:'একটু ধারণা আছে', sub:'বয়স ও এলাকা জানি, বাকিটা না' },
      { value:3, label:'মোটামুটি জানি', sub:'সমস্যা ও চাহিদা বুঝি, তবে পুরোপুরি না' },
      { value:4, label:'পুরোপুরি পরিষ্কার', sub:'বিস্তারিত কাস্টমার প্রোফাইল তৈরি আছে' },
    ],
  },
  {
    id: 'mkt_2', domain: 'marketing', iconKey: 'barChart',
    q: 'বিজ্ঞাপনে ১ টাকা খরচ করলে গড়ে কত টাকা বিক্রি আসে? (ROAS)',
    hint: 'ROAS = মোট বিক্রয় ÷ বিজ্ঞাপন খরচ। ৩× মানে ভালো।',
    options: [
      { value:0, label:'অ্যাড দিই না', sub:'এখনো পেইড মার্কেটিং শুরু করিনি' },
      { value:1, label:'১ টাকার কম ফেরত', sub:'খরচের চেয়ে আয় কম' },
      { value:2, label:'১–২ টাকা ফেরত', sub:'সামান্য লাভ, তবে উন্নতির জায়গা আছে' },
      { value:4, label:'৩ টাকা বা বেশি', sub:'বিজ্ঞাপন ভালো কাজ করছে' },
    ],
  },
  {
    id: 'mkt_3', domain: 'marketing', iconKey: 'refreshCw',
    q: 'বিজ্ঞাপনের ছবি, ভিডিও বা কপি কতদিন পর পর বদলান?',
    hint: 'একই ক্রিয়েটিভ বেশিদিন চললে মানুষ দেখেও এড়িয়ে যায়।',
    options: [
      { value:0, label:'প্রায় কখনোই না', sub:'একই কনটেন্ট মাসের পর মাস চলছে' },
      { value:1, label:'মাসে একবার', sub:'খুব কম পরিবর্তন করি' },
      { value:3, label:'সপ্তাহে একবার', sub:'নিয়মিত নতুন কনটেন্ট দিই' },
      { value:4, label:'ডেটা দেখে যখন দরকার', sub:'পারফরম্যান্স অনুযায়ী A/B টেস্ট করি' },
    ],
  },
  {
    id: 'mkt_4', domain: 'marketing', iconKey: 'repeat2',
    q: 'যারা পেজ দেখেছে বা কার্টে যোগ করেছে তাদের কি রিটার্গেট করেন?',
    hint: 'আগ্রহী মানুষদের আবার দেখানো নতুন মানুষের চেয়ে ৫ গুণ সস্তা।',
    options: [
      { value:0, label:'না, জানিই না', sub:'রিটার্গেটিং কীভাবে করে বুঝি না' },
      { value:1, label:'না, করিনি', sub:'জানি, কিন্তু শুরু হয়নি' },
      { value:2, label:'মাঝে মাঝে', sub:'কখনো করি, কিন্তু নিয়মিত না' },
      { value:4, label:'হ্যাঁ, নিয়মিত', sub:'ফানেলের প্রতিটি ধাপে রিটার্গেট চলে' },
    ],
  },
  {
    id: 'mkt_5', domain: 'marketing', iconKey: 'smartphone',
    q: 'মোবাইলে আপনার ল্যান্ডিং পেজ বা ওয়েবসাইট দেখলে কাস্টমার কি কেনে?',
    hint: 'বাংলাদেশে ৯০% এর বেশি মানুষ মোবাইলে ব্রাউজ করেন।',
    options: [
      { value:0, label:'পেজই নেই', sub:'শুধু কল বা ইনবক্সে অর্ডার নিই' },
      { value:1, label:'পেজ আছে কিন্তু বিক্রি কম', sub:'মানুষ আসছে কিন্তু কিনছে না' },
      { value:3, label:'মোটামুটি ঠিকঠাক', sub:'বিক্রি হচ্ছে, তবে আরো ভালো হতে পারে' },
      { value:4, label:'পেজ অপ্টিমাইজড', sub:'নিয়মিত টেস্ট করি, কনভার্সন ভালো' },
    ],
  },

  /* ── অপারেশনস (৬–১০) ────────────────────────────────── */
  {
    id: 'ops_1', domain: 'operations', iconKey: 'package',
    q: 'অর্ডার পাওয়ার পর কাস্টমারের হাতে পৌঁছাতে সাধারণত কতদিন লাগে?',
    hint: 'দ্রুত ডেলিভারি মানে বেশি পজিটিভ রিভিউ ও রিপিট অর্ডার।',
    options: [
      { value:0, label:'৫ দিনের বেশি', sub:'ডেলিভারি ধীর, কাস্টমার অসন্তুষ্ট হয়' },
      { value:1, label:'৩–৪ দিন', sub:'গড়পড়তা, উন্নতির সুযোগ আছে' },
      { value:3, label:'১–২ দিন', sub:'দ্রুত, কাস্টমার সাধারণত খুশি' },
      { value:4, label:'২৪ ঘণ্টার মধ্যে', sub:'এক্সপ্রেস ডেলিভারি দিতে পারি' },
    ],
  },
  {
    id: 'ops_2', domain: 'operations', iconKey: 'cpu',
    q: 'অর্ডার নেওয়া, ইনভেন্টরি ট্র্যাক করা বা কাস্টমারকে আপডেট দেওয়া কতটা অটোমেটিক?',
    hint: 'অটোমেশন সময় বাঁচায়, ভুল কমায় এবং স্কেল করতে সাহায্য করে।',
    options: [
      { value:0, label:'সব হাতেকলমে করি', sub:'প্রতিটি কাজ ম্যানুয়ালি করতে হয়' },
      { value:1, label:'দুয়েকটা টুল ব্যবহার করি', sub:'সামান্য অটোমেশন আছে' },
      { value:3, label:'বেশিরভাগ কাজ অটোমেটিক', sub:'CRM বা ইনভেন্টরি সফটওয়্যার চলছে' },
      { value:4, label:'পুরো সিস্টেম অটোমেটেড', sub:'শুরু থেকে শেষ পর্যন্ত ওয়ার্কফ্লো আছে' },
    ],
  },
  {
    id: 'ops_3', domain: 'operations', iconKey: 'heartHandshake',
    q: 'একবার কেনার পর কতজন কাস্টমার আবার ফিরে আসেন?',
    hint: 'পুরোনো কাস্টমার ধরে রাখা নতুন আনার চেয়ে ৫ গুণ সস্তা।',
    options: [
      { value:0, label:'ট্র্যাক করি না', sub:'কতজন ফেরে তা জানি না' },
      { value:1, label:'২০% এর কম', sub:'বেশিরভাগই একবার কিনে চলে যায়' },
      { value:3, label:'২০–৫০%', sub:'ভালো রিটেনশন, আরো উন্নতি সম্ভব' },
      { value:4, label:'৫০% এর বেশি', sub:'নিয়মিত কাস্টমার বেস শক্তিশালী' },
    ],
  },
  {
    id: 'ops_4', domain: 'operations', iconKey: 'shieldCheck',
    q: 'প্রতিটি প্রোডাক্ট বা সার্ভিসের মান ঠিক আছে কিনা কীভাবে নিশ্চিত করেন?',
    hint: 'একই মান বারবার দিতে পারলেই ব্র্যান্ডের ওপর ভরসা তৈরি হয়।',
    options: [
      { value:0, label:'আলাদা কোনো পদ্ধতি নেই', sub:'যা হয় হোক মনোভাবে চলছে' },
      { value:1, label:'মাঝে মাঝে দেখি', sub:'অনিয়মিত, কোনো নির্দিষ্ট নিয়ম নেই' },
      { value:3, label:'নিয়মিত চেকলিস্ট আছে', sub:'একটি স্ট্যান্ডার্ড প্রক্রিয়া মেনে চলি' },
      { value:4, label:'লিখিত SOP ও কোয়ালিটি সিস্টেম', sub:'ডকুমেন্টেড নিয়মে কোয়ালিটি কন্ট্রোল হয়' },
    ],
  },
  {
    id: 'ops_5', domain: 'operations', iconKey: 'users',
    q: 'আপনার টিম কি নিজে থেকে কাজ করতে পারে, নাকি সব সিদ্ধান্তের জন্য আপনাকে ডাকতে হয়?',
    hint: 'ভালো টিম মানে আপনি বিজনেসে কাজ না করে বিজনেসের জন্য কাজ করতে পারবেন।',
    options: [
      { value:0, label:'একাই সব করি', sub:'টিম নেই, সব নিজে করতে হয়' },
      { value:1, label:'টিম আছে কিন্তু ম্যানেজ কঠিন', sub:'বিভ্রান্তি ও অদক্ষতা সমস্যা' },
      { value:3, label:'টিম বেশিরভাগ সময় নিজে চলে', sub:'রোল পরিষ্কার, কাজ ভালোই হয়' },
      { value:4, label:'টিম সম্পূর্ণ স্বনির্ভর', sub:'KPI আছে, আমাকে না ডাকলেও চলে' },
    ],
  },

  /* ── ফাইন্যান্স (১১–১৫) ─────────────────────────────── */
  {
    id: 'fin_1', domain: 'finance', iconKey: 'trendingUp',
    q: 'সব খরচ বাদ দিলে মাসে বিজনেস থেকে কতটুকু লাভ থাকে?',
    hint: 'রেভিনিউ বড় মানে লাভ বেশি — এটা সত্যি না। নেট প্রফিটই আসল।',
    options: [
      { value:0, label:'লোকসান হচ্ছে', sub:'খরচ আয়ের চেয়ে বেশি' },
      { value:1, label:'০–১০% লাভ', sub:'সামান্য আয় থাকে, ঝুঁকি বেশি' },
      { value:3, label:'১০–৩০% লাভ', sub:'ভালো মার্জিন, বাড়ার সুযোগ আছে' },
      { value:4, label:'৩০% এর বেশি লাভ', sub:'চমৎকার, প্রিমিয়াম পজিশনিং আছে' },
    ],
  },
  {
    id: 'fin_2', domain: 'finance', iconKey: 'calendarClock',
    q: 'হঠাৎ আয় বন্ধ হয়ে গেলে এখনকার টাকায় কতদিন বিজনেস চালু রাখতে পারবেন?',
    hint: 'জরুরি পরিস্থিতিতে টিকে থাকার সক্ষমতাই প্রকৃত আর্থিক স্বাস্থ্যের পরিচয়।',
    options: [
      { value:0, label:'এক সপ্তাহেরও কম', sub:'খুবই ঝুঁকিপূর্ণ অবস্থা' },
      { value:1, label:'১ সপ্তাহ থেকে ১ মাস', sub:'দুর্বল, চাপ পড়লে সমস্যায় পড়ব' },
      { value:3, label:'১–৩ মাস', sub:'মোটামুটি ঠিক আছে, আরো বাড়ানো উচিত' },
      { value:4, label:'৩ মাসের বেশি', sub:'শক্তিশালী, যেকোনো পরিস্থিতিতে টিকতে পারব' },
    ],
  },
  {
    id: 'fin_3', domain: 'finance', iconKey: 'activity',
    q: 'গত ৬ মাসে আপনার মাসিক বিক্রির পরিমাণ কীভাবে বদলেছে?',
    hint: 'মাসিক গ্রোথ রেটই বলে দেয় বিজনেস কোন দিকে যাচ্ছে।',
    options: [
      { value:0, label:'কমছে', sub:'বিক্রি আগের চেয়ে কমে যাচ্ছে' },
      { value:1, label:'একই আছে', sub:'বাড়ছেও না, কমছেও না' },
      { value:3, label:'মাসে ১–৫% বাড়ছে', sub:'ধীরে হলেও স্বাস্থ্যকর বৃদ্ধি' },
      { value:4, label:'মাসে ৫% এর বেশি বাড়ছে', sub:'দ্রুত বিক্রি বাড়ছে, চমৎকার' },
    ],
  },
  {
    id: 'fin_4', domain: 'finance', iconKey: 'fileBarChart',
    q: 'কতটা নিয়মিত আয়-ব্যয়ের হিসাব রাখেন এবং দেখেন?',
    hint: 'হিসাব না রাখলে কোথায় টাকা যাচ্ছে বোঝা যায় না।',
    options: [
      { value:0, label:'মোটেই রাখি না', sub:'সম্পূর্ণ অনুমান করে চলি' },
      { value:1, label:'মাঝে মাঝে', sub:'বছরে একবার বা দুবার দেখি' },
      { value:3, label:'প্রতি মাসে', sub:'মাসশেষে P&L দেখি' },
      { value:4, label:'প্রতি সপ্তাহে', sub:'রিয়েল-টাইম ড্যাশবোর্ড বা ট্র্যাকার আছে' },
    ],
  },
  {
    id: 'fin_5', domain: 'finance', iconKey: 'circlePercent',
    q: 'একজন নতুন কাস্টমার পেতে আপনার মোট কত টাকা খরচ হয় — জানেন?',
    hint: 'এই খরচটা না জানলে লাভজনক মার্কেটিং করা সম্ভব না।',
    options: [
      { value:0, label:'একদমই জানি না', sub:'কখনো হিসাব করিনি' },
      { value:1, label:'মোটামুটি আন্দাজ করি', sub:'সঠিক সংখ্যা জানি না' },
      { value:3, label:'জানি এবং মাসে মাসে দেখি', sub:'CAC ট্র্যাক করি' },
      { value:4, label:'জানি এবং কাস্টমারের আজীবন মূল্যের সাথে তুলনা করি', sub:'LTV:CAC অপ্টিমাইজ করি' },
    ],
  },
]

/* ─── Score bands ─────────────────────────────────────── */
export const SCORE_BANDS = {
  critical: { min: 0,  max: 30,  label: 'ক্রিটিকাল',  labelEn: 'Critical',   color: '#DC2626', bg: '#FEF2F2', ring: '#FCA5A5' },
  weak:     { min: 31, max: 50,  label: 'দুর্বল',      labelEn: 'Developing', color: '#D97706', bg: '#FFFBEB', ring: '#FCD34D' },
  average:  { min: 51, max: 70,  label: 'উন্নয়নশীল',  labelEn: 'Growing',    color: '#2563EB', bg: '#EFF6FF', ring: '#93C5FD' },
  strong:   { min: 71, max: 85,  label: 'শক্তিশালী',  labelEn: 'Strong',     color: '#059669', bg: '#ECFDF5', ring: '#6EE7B7' },
  elite:    { min: 86, max: 100, label: 'এলিট',        labelEn: 'Elite',      color: '#7C3AED', bg: '#F5F3FF', ring: '#C4B5FD' },
}

export function getBand(pct) {
  return Object.values(SCORE_BANDS).find(b => pct >= b.min && pct <= b.max) || SCORE_BANDS.critical
}
export function getBandKey(pct) {
  if (pct <= 30) return 'critical'; if (pct <= 50) return 'weak'
  if (pct <= 70) return 'average';  if (pct <= 85) return 'strong'; return 'elite'
}

/* ─── Scoring engine ─────────────────────────────────── */
export function calculateScores(answers) {
  const domains = ['marketing', 'operations', 'finance']
  const domainScores = {}
  domains.forEach(d => {
    const qs = AUDIT_QUESTIONS.filter(q => q.domain === d)
    const earned = qs.reduce((acc, q) => acc + (answers[q.id] ?? 0), 0)
    domainScores[d] = Math.round((earned / (qs.length * 4)) * 100)
  })
  const overall = Math.round((domainScores.marketing + domainScores.operations + domainScores.finance) / 3)
  return { domainScores, overall }
}

/* ─── Domain insights ────────────────────────────────── */
const DOMAIN_INSIGHTS = {
  marketing: {
    critical: { title: 'মার্কেটিং ফাউন্ডেশন তৈরি করুন এখনই',         detail: 'আপনার মার্কেটিং কার্যক্রম এখনো প্রাথমিক পর্যায়ে। টার্গেট অডিয়েন্স ডিফাইন করা, ব্যাসিক অ্যাড সেটআপ এবং ট্র্যাকিং পিক্সেল ইনস্টল — এই তিনটি পদক্ষেপ সবার আগে দরকার।', actions: ['বায়ার পার্সোনা তৈরি করুন (বয়স, পেশা, সমস্যা, স্বপ্ন)', 'ফেসবুক পিক্সেল ও গুগল ট্যাগ ইনস্টল করুন', 'মাইক্রো টেস্ট দিয়ে ছোট বাজেটে শুরু করুন'], urgency: 'high' },
    weak:     { title: 'A/B টেস্টিং দিয়ে ROAS বাড়ান',               detail: 'মার্কেটিং শুরু হয়েছে কিন্তু রিটার্ন যথেষ্ট নয়। সিস্টেমেটিক A/B টেস্টিং ও ক্রিয়েটিভ রিফ্রেশ ছাড়া উন্নতি হবে না।',                                                          actions: ['সাপ্তাহিক A/B টেস্ট শুরু করুন (হুক, ক্রিয়েটিভ, CTA)', 'লুকঅ্যালাইক অডিয়েন্স তৈরি করুন ক্রেতাদের ডেটা থেকে', 'রিটার্গেটিং ফানেল সেটআপ করুন'], urgency: 'medium' },
    average:  { title: 'স্কেলের আগে ক্রিয়েটিভ পাইপলাইন শক্ত করুন',   detail: 'মার্কেটিং চলছে, কিন্তু স্কেল করতে কনসিস্টেন্ট উইনার ক্রিয়েটিভ লাগবে। ক্রিয়েটিভ ফ্যাটিগ এখন আপনার সবচেয়ে বড় চ্যালেঞ্জ।',                                         actions: ['মাসিক ক্রিয়েটিভ ক্যালেন্ডার তৈরি করুন', 'উইনিং ক্রিয়েটিভের প্যাটার্ন বিশ্লেষণ করুন', 'ভিডিও কনটেন্টে ইনভেস্ট করুন (CTR ২–৩× বেশি)'], urgency: 'low' },
    strong:   { title: 'মাল্টি-চ্যানেল এক্সপ্যানশন করার সময়',         detail: 'মার্কেটিং শক্তিশালী। এখন নতুন চ্যানেল এক্সপ্লোর করে রিস্ক ডাইভার্সিফাই করুন।',                                                                                       actions: ['TikTok বা YouTube Shorts-এ এক্সপ্যান্ড করুন', 'ইমেইল/SMS মার্কেটিং শুরু করুন রিটেনশনের জন্য', 'ইনফ্লুয়েন্সার পার্টনারশিপ এক্সপ্লোর করুন'], urgency: 'low' },
    elite:    { title: 'মার্কেট লিডার — ব্র্যান্ড মোট বিল্ড করুন',    detail: 'মার্কেটিং এলিট লেভেলে। লয়্যালটি প্রোগ্রাম ও কমিউনিটি বিল্ডিং শুরু করুন।',                                                                                        actions: ['লয়্যালটি প্রোগ্রাম ও রেফারেল সিস্টেম তৈরি করুন', 'ব্র্যান্ড কনটেন্ট মিডিয়া বিল্ড করুন', 'কমিউনিটি মার্কেটিং শুরু করুন'], urgency: 'low' },
  },
  operations: {
    critical: { title: 'অপারেশনাল ক্যাওস বিজনেস ধ্বংস করবে',          detail: 'কোনো সিস্টেম ছাড়া বিজনেস চালানো মানে প্রতিদিন আগুন নেভানো। ডেলিভারি সমস্যা রেপুটেশন নষ্ট করে।',                                                                        actions: ['অর্ডার ম্যানেজমেন্টের জন্য সিম্পল Trello/স্প্রেডশিট শুরু করুন', 'ডেলিভারি SLA নির্ধারণ করুন এবং মেনে চলুন', 'প্রথম ৩টি গুরুত্বপূর্ণ প্রক্রিয়া ডকুমেন্ট করুন'], urgency: 'high' },
    weak:     { title: 'টুলস ও অটোমেশনে ইনভেস্ট করুন',               detail: 'ম্যানুয়াল কাজ আপনার স্কেল করার ক্ষমতা সীমিত করছে। সঠিক টুলসে ছোট ইনভেস্টমেন্ট অনেক সময় ও অর্থ বাঁচাবে।',                                                            actions: ['WhatsApp Business অটো-রিপ্লাই সেটআপ করুন', 'ইনভেন্টরি ম্যানেজমেন্ট সফটওয়্যার শুরু করুন', 'কাস্টমার ফিডব্যাক সিস্টেম তৈরি করুন'], urgency: 'medium' },
    average:  { title: 'কাস্টমার এক্সপেরিয়েন্স আপগ্রেড করুন',         detail: 'অপারেশন চলছে, কিন্তু কাস্টমার ডিলাইট তৈরি হচ্ছে না। প্রতিটি টাচপয়েন্টে WOW অনুভূতি তৈরি করুন।',                                                                   actions: ['অর্ডার কনফার্মেশন ও আপডেট অটোমেট করুন', 'পোস্ট-পার্চেজ ফলো-আপ সিস্টেম তৈরি করুন', 'রিটার্ন ও রিফান্ড পলিসি স্পষ্ট করুন'], urgency: 'low' },
    strong:   { title: 'স্কেলেবল সিস্টেম — এখন টিম স্কেল করুন',       detail: 'অপারেশন শক্তিশালী। আপনার সিস্টেম এখন অন্যরাও চালাতে পারবে। টিম এক্সপ্যান্ড করুন।',                                                                                actions: ['SOP ডকুমেন্টেশন তৈরি করুন নতুন টিম মেম্বারের জন্য', 'KPI ড্যাশবোর্ড তৈরি করুন', 'টিম ম্যানেজার হায়ার করুন'], urgency: 'low' },
    elite:    { title: 'অপারেশনাল এক্সেলেন্স — নতুন ভার্টিকাল',       detail: 'অপারেশন সিস্টেম এলিট পর্যায়ে। নতুন প্রোডাক্ট লাইন বা মার্কেট এক্সপ্লোর করুন।',                                                                                     actions: ['নতুন প্রোডাক্ট ক্যাটাগরি টেস্ট করুন', 'ফ্র্যাঞ্চাইজ মডেল বিবেচনা করুন', 'B2B চ্যানেল এক্সপ্লোর করুন'], urgency: 'low' },
  },
  finance: {
    critical: { title: 'ফিনান্সিয়াল ফাউন্ডেশন জরুরি ভিত্তিতে দরকার', detail: 'ফিনান্সিয়াল ভিজিবিলিটি ছাড়া বিজনেস মানে চোখ বন্ধ করে গাড়ি চালানো। এই অবস্থায় মার্কেটিং বাড়ানো লোকসান বাড়াবে।',                                              actions: ['আজই সাপ্তাহিক আয়-ব্যয়ের হিসাব শুরু করুন', 'ব্রেক-ইভেন পয়েন্ট ক্যালকুলেট করুন', 'রিজার্ভ ফান্ড বিল্ড করুন (৩০ দিনের খরচ)'], urgency: 'high' },
    weak:     { title: 'প্রফিটেবিলিটি ইন্টেলিজেন্স বাড়ান',           detail: 'আয় হচ্ছে কিন্তু লাভ কম। প্রতিটি প্রোডাক্ট ও চ্যানেলের প্রফিটেবিলিটি ক্যালকুলেট করুন।',                                                                               actions: ['প্রতিটি প্রোডাক্টের মার্জিন ক্যালকুলেট করুন', 'CAC vs LTV বিশ্লেষণ শুরু করুন', 'অলাভজনক প্রোডাক্ট বন্ধ করুন'], urgency: 'medium' },
    average:  { title: 'ক্যাশফ্লো ম্যানেজমেন্ট উন্নত করুন',           detail: 'ফিনান্স ঠিকঠাক চলছে, কিন্তু ক্যাশফ্লো সমস্যা স্কেলিং আটকাতে পারে। ৩ মাসের রিজার্ভ তৈরি করুন।',                                                                      actions: ['৩ মাসের ক্যাশফ্লো ফোরকাস্ট তৈরি করুন', 'আর্লি পেমেন্ট ডিসকাউন্ট অফার করুন', 'বড় বিনিয়োগের আগে ROI ক্যালকুলেশন করুন'], urgency: 'low' },
    strong:   { title: 'গ্রোথ ফাইন্যান্সিং স্ট্র্যাটেজি তৈরি করুন',   detail: 'ফিনান্সিয়াল পজিশন শক্তিশালী। এখন স্মার্ট উপায়ে মার্কেটিং, টিম, বা প্রযুক্তিতে ইনভেস্ট করুন।',                                                                      actions: ['মার্কেটিং বাজেট ১৫–২০% বাড়ান', 'টেকনোলজি ও অটোমেশনে ইনভেস্ট করুন', 'ট্যাক্স প্ল্যানিং শুরু করুন'], urgency: 'low' },
    elite:    { title: 'এক্সপ্যানশন ও ইনভেস্টমেন্টের সময়',           detail: 'ফিনান্সিয়াল পারফরম্যান্স এলিট পর্যায়ে। নতুন ভেঞ্চার বা ইনভেস্টমেন্টের কথা ভাবুন।',                                                                                   actions: ['নতুন মার্কেট বা প্রোডাক্টে ইনভেস্ট করুন', 'ইনভেস্টর বা পার্টনারশিপ বিবেচনা করুন', 'ওয়েলথ ম্যানেজমেন্ট শুরু করুন'], urgency: 'low' },
  },
}

export function getDomainInsights(domainScores) {
  return Object.entries(domainScores).map(([domain, score]) => {
    const bandKey = getBandKey(score)
    const domainMeta = AUDIT_DOMAINS.find(d => d.key === domain)
    return { domain, score, band: getBand(score), domainMeta, ...DOMAIN_INSIGHTS[domain][bandKey] }
  })
}

export function getTopPriorityActions(answers) {
  return [...AUDIT_QUESTIONS]
    .map(q => ({ ...q, score: answers[q.id] ?? 0, gap: 4 - (answers[q.id] ?? 0) }))
    .sort((a, b) => b.gap - a.gap).slice(0, 3)
}

/* ─── Packages ────────────────────────────────────────── */
export const PACKAGES = [
  { key: 'micro',   name: 'মাইক্রো টেস্ট',              price: '৳১,৪৫০',           priceNote: 'একবার',       priceNum: 1450,  tagline: 'রিস্ক-ফ্রি ৭ দিনে প্রমাণ করুন।',                  features: ['৩টি কাস্টম অ্যাড ভেরিয়েন্ট', '৭ দিন ক্যাম্পেইন রান', 'পারফরম্যান্স রিপোর্ট', 'WhatsApp সাপোর্ট'],                waName: 'মাইক্রো টেস্ট (৳১,৪৫০)',           forScoreRange: [0,  50],  highlight: 'দ্রুত শুরু' },
  { key: 'weekly',  name: 'সাপ্তাহিক অপ্টিমাইজেশন', price: '৳১০,০০০–৳২০,০০০', priceNote: 'প্রতি সপ্তাহ', priceNum: 10000, tagline: 'চলমান A/B টেস্ট + সাপ্তাহিক ক্রিয়েটিভ।', features: ['সাপ্তাহিক A/B টেস্ট', '১টি নতুন ক্রিয়েটিভ/সপ্তাহ', 'বাজেট অপ্টিমাইজেশন', 'সাপ্তাহিক রিপোর্ট'],         waName: 'সাপ্তাহিক অপ্টিমাইজেশন', popular: true, forScoreRange: [51, 75], highlight: 'সবচেয়ে জনপ্রিয়' },
  { key: 'monthly', name: 'মান্থলি ম্যানেজমেন্ট',      price: '৳৩০,০০০+',          priceNote: 'প্রতি মাস',    priceNum: 30000, tagline: 'ফুল-ফানেল ম্যানেজমেন্ট — স্কেলের জন্য।',          features: ['ফুল ফানেল ক্যাম্পেইন', 'আনলিমিটেড ক্রিয়েটিভ', 'মাসিক স্ট্র্যাটেজি কল', 'প্রায়রিটি সাপোর্ট'],                 waName: 'মান্থলি ম্যানেজমেন্ট (৳৩০,০০০+)', forScoreRange: [76, 100], highlight: 'সর্বোচ্চ ফলাফল' },
]

export function recommendPackage(overallScore) {
  return PACKAGES.find(p => overallScore >= p.forScoreRange[0] && overallScore <= p.forScoreRange[1]) || PACKAGES[1]
}

/* ─── WhatsApp message ───────────────────────────────── */
export function buildWaMessage(domainScores, overall, pkg, domainInsights) {
  const band   = getBand(overall)
  const bar    = pct => '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10)) + ` ${pct}%`
  const grade  = s => s <= 30 ? 'F' : s <= 50 ? 'D' : s <= 70 ? 'C' : s <= 85 ? 'B' : 'A'
  const date   = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })

  /* Top weak domain */
  const weakest = Object.entries(domainScores).sort(([,a],[,b]) => a - b)[0]
  const weakMeta = AUDIT_DOMAINS.find(d => d.key === weakest[0])

  return [
    `হ্যালো Digitalizen!`,
    ``,
    `GrowthHub Business Audit সম্পন্ন করেছি।`,
    `তারিখ: ${date}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ` বিজনেস হেলথ রিপোর্ট`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `সামগ্রিক স্কোর: ${overall}% [${band.labelEn}]`,
    ``,
    `মার্কেটিং  [${grade(domainScores.marketing)}]`,
    `${bar(domainScores.marketing)}`,
    ``,
    `অপারেশনস  [${grade(domainScores.operations)}]`,
    `${bar(domainScores.operations)}`,
    ``,
    `ফাইন্যান্স  [${grade(domainScores.finance)}]`,
    `${bar(domainScores.finance)}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ` সবচেয়ে দুর্বল এলাকা: ${weakMeta?.label} (${weakest[1]}%)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `প্রস্তাবিত প্যাকেজ: ${pkg?.waName}`,
    `মূল্য: ${pkg?.price} / ${pkg?.priceNote}`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `এই রিপোর্টের ভিত্তিতে একটি কাস্টম গ্রোথ প্ল্যান নিয়ে আলোচনা করতে চাই। কখন কথা বলা যাবে?`,
  ].join('\n')
}

export const INIT_STATE = { phase: 'entry', currentQ: 0, answers: {} }
