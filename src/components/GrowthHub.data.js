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
  { id: 'mkt_1', domain: 'marketing',  iconKey: 'target',        q: 'আপনার টার্গেট অডিয়েন্স কতটা স্পষ্টভাবে সংজ্ঞায়িত?',       hint: 'সঠিক অডিয়েন্স ছাড়া বাজেট নষ্ট হয়।',              options: [{ value:0,label:'মোটেও স্পষ্ট নয়',sub:'কাকে টার্গেট করছি জানি না' },{ value:1,label:'একটু ধারণা আছে',sub:'বয়স-লিঙ্গ জানি, বিস্তারিত না' },{ value:3,label:'মোটামুটি স্পষ্ট',sub:'পেইন পয়েন্ট জানি, পার্সোনা নেই' },{ value:4,label:'সম্পূর্ণ স্পষ্ট',sub:'ডিটেইলড বায়ার পার্সোনা আছে' }] },
  { id: 'mkt_2', domain: 'marketing',  iconKey: 'barChart',      q: 'আপনার অ্যাড ক্যাম্পেইনের গড় ROAS কত?',                      hint: 'ROAS = বিক্রয় ÷ বিজ্ঞাপন খরচ',                    options: [{ value:0,label:'অ্যাড দিচ্ছি না',sub:'এখনো শুরু করিনি' },{ value:1,label:'১× এর নিচে',sub:'খরচের চেয়ে আয় কম' },{ value:2,label:'১×–২×',sub:'সামান্য লাভ, উন্নতির সুযোগ' },{ value:4,label:'৩× বা বেশি',sub:'প্রতি টাকায় ৩+ টাকা ফেরত' }] },
  { id: 'mkt_3', domain: 'marketing',  iconKey: 'refreshCw',     q: 'কনটেন্ট ও ক্রিয়েটিভ কতদিন পর পর রিফ্রেশ করেন?',           hint: 'পুরনো ক্রিয়েটিভে অ্যাড ফ্যাটিগ হয়।',             options: [{ value:0,label:'কখনো রিফ্রেশ করি না',sub:'একই কনটেন্ট বছরের পর বছর' },{ value:1,label:'মাসে একবার',sub:'খুব বিরল পরিবর্তন' },{ value:3,label:'সপ্তাহে একবার',sub:'নিয়মিত নতুন ক্রিয়েটিভ' },{ value:4,label:'ডেটা দেখে সর্বদা',sub:'A/B টেস্ট ও ক্রমাগত উন্নতি' }] },
  { id: 'mkt_4', domain: 'marketing',  iconKey: 'repeat2',       q: 'রিটার্গেটিং ক্যাম্পেইন চালান?',                              hint: 'পুরনো ভিজিটরদের ফিরিয়ে আনা নতুনের চেয়ে ৫× সস্তা।', options: [{ value:0,label:'না, জানি না কীভাবে',sub:'রিটার্গেটিং সম্পর্কে অজ্ঞ' },{ value:1,label:'না, পরিকল্পনা নেই',sub:'শুনেছি কিন্তু করিনি' },{ value:2,label:'মাঝে মাঝে',sub:'কখনো চালাই, সিস্টেম নেই' },{ value:4,label:'হ্যাঁ, নিয়মিত',sub:'ফুল ফানেল রিটার্গেটিং চলছে' }] },
  { id: 'mkt_5', domain: 'marketing',  iconKey: 'smartphone',    q: 'আপনার ল্যান্ডিং পেজের মোবাইল কনভার্সন কেমন?',               hint: 'বাংলাদেশে ৮৮%+ ট্রাফিক মোবাইলে।',                 options: [{ value:0,label:'ওয়েবসাইট/পেজ নেই',sub:'শুধু ফোনে অর্ডার নিই' },{ value:1,label:'পেজ আছে, কনভার্শন কম',sub:'মানুষ আসে কিন্তু কেনে না' },{ value:3,label:'ঠিকঠাক কাজ করছে',sub:'কনভার্শন হচ্ছে, উন্নতির সুযোগ' },{ value:4,label:'অপ্টিমাইজড পেজ আছে',sub:'A/B টেস্ট করি, হাই CVR' }] },
  { id: 'ops_1', domain: 'operations', iconKey: 'package',       q: 'অর্ডার ফুলফিলমেন্টে কত সময় লাগে?',                          hint: 'দ্রুত ডেলিভারি = বেশি পজিটিভ রিভিউ।',              options: [{ value:0,label:'৫+ দিন',sub:'ধীর ডেলিভারি, কাস্টমার অসন্তুষ্ট' },{ value:1,label:'৩–৪ দিন',sub:'গড়পড়তা, উন্নতির সুযোগ আছে' },{ value:3,label:'১–২ দিন',sub:'দ্রুত, কাস্টমার সন্তুষ্ট' },{ value:4,label:'২৪ ঘণ্টার মধ্যে',sub:'এক্সপ্রেস ডেলিভারি সুবিধা' }] },
  { id: 'ops_2', domain: 'operations', iconKey: 'cpu',           q: 'আপনার বিজনেসে কতটা অটোমেশন আছে?',                           hint: 'অটোমেশন সময় বাঁচায়, ভুল কমায়।',                  options: [{ value:0,label:'সব ম্যানুয়াল',sub:'প্রতিটি কাজ হাতে করি' },{ value:1,label:'সামান্য অটোমেশন',sub:'একটি-দুটি টুল ব্যবহার করি' },{ value:3,label:'বেশিরভাগ অটোমেটেড',sub:'CRM, ইনভেন্টরি ম্যানেজমেন্ট আছে' },{ value:4,label:'সম্পূর্ণ সিস্টেম',sub:'End-to-end অটোমেটেড ওয়ার্কফ্লো' }] },
  { id: 'ops_3', domain: 'operations', iconKey: 'heartHandshake',q: 'কাস্টমার রিটেনশন রেট কেমন?',                               hint: 'পুরনো কাস্টমার ধরে রাখা নতুন পাওয়ার চেয়ে ৫× সস্তা।', options: [{ value:0,label:'জানি না / ট্র্যাক নেই',sub:'রিটেনশনের ধারণা নেই' },{ value:1,label:'২০% এর নিচে',sub:'বেশিরভাগ একবারই কেনে' },{ value:3,label:'২০–৫০%',sub:'ভালো, আরো উন্নতি সম্ভব' },{ value:4,label:'৫০% এর বেশি',sub:'শক্তিশালী লয়্যাল কাস্টমার বেস' }] },
  { id: 'ops_4', domain: 'operations', iconKey: 'shieldCheck',   q: 'প্রোডাক্ট/সার্ভিস কোয়ালিটি কন্ট্রোল কীভাবে করেন?',         hint: 'কনসিস্টেন্ট কোয়ালিটি = ব্র্যান্ড ট্রাস্ট।',       options: [{ value:0,label:'কোনো চেকলিস্ট নেই',sub:'যা হয় হোক মনোভাব' },{ value:1,label:'মাঝে মাঝে চেক করি',sub:'অনিয়মিত কোয়ালিটি চেক' },{ value:3,label:'নিয়মিত চেকলিস্ট',sub:'স্ট্যান্ডার্ড প্রক্রিয়া আছে' },{ value:4,label:'SOP ডকুমেন্টেড',sub:'ডকুমেন্টেড কোয়ালিটি সিস্টেম' }] },
  { id: 'ops_5', domain: 'operations', iconKey: 'users',         q: 'টিম ম্যানেজমেন্ট কতটা কার্যকর?',                             hint: 'দক্ষ টিম = দ্রুত গ্রোথ।',                            options: [{ value:0,label:'একা সব করি',sub:'কোনো টিম নেই' },{ value:1,label:'টিম আছে, ম্যানেজ কঠিন',sub:'অদক্ষতা ও কনফিউশন সমস্যা' },{ value:3,label:'টিম ভালোই কাজ করছে',sub:'স্পষ্ট রোল বিভাজন আছে' },{ value:4,label:'হাই-পারফর্মিং টিম',sub:'KPI আছে, নিজে থেকে চলে' }] },
  { id: 'fin_1', domain: 'finance',    iconKey: 'trendingUp',    q: 'আপনার বর্তমান নেট প্রফিট মার্জিন কত?',                      hint: 'Revenue নয়, সত্যিকারের লাভ কতটা।',                  options: [{ value:0,label:'লোকসানে আছি',sub:'খরচ বেশি, আয় কম' },{ value:1,label:'০–১০%',sub:'সামান্য লাভ, রিস্ক বেশি' },{ value:3,label:'১০–৩০%',sub:'ভালো মার্জিন, স্কেলের সুযোগ' },{ value:4,label:'৩০% এর বেশি',sub:'চমৎকার, প্রিমিয়াম পজিশনিং' }] },
  { id: 'fin_2', domain: 'finance',    iconKey: 'calendarClock', q: 'ক্যাশফ্লো কতদিনের খরচ কভার করতে পারে?',                    hint: 'বিপদের সময় কত দিন টিকতে পারবেন।',                  options: [{ value:0,label:'১ সপ্তাহের কম',sub:'ক্রিটিকাল — তাৎক্ষণিক মনোযোগ' },{ value:1,label:'১–৪ সপ্তাহ',sub:'দুর্বল, চাপে পড়লে সমস্যা' },{ value:3,label:'১–৩ মাস',sub:'ঠিকঠাক, আরো বাড়ানো উচিত' },{ value:4,label:'৩ মাসের বেশি',sub:'শক্তিশালী, রিস্ক-রেজিলিয়েন্ট' }] },
  { id: 'fin_3', domain: 'finance',    iconKey: 'activity',      q: 'মাসিক রেভিনিউ গ্রোথ রেট কেমন?',                             hint: 'বিজনেস গ্রোথের সবচেয়ে সরাসরি সংকেত।',              options: [{ value:0,label:'নেগেটিভ (কমছে)',sub:'রেভিনিউ হ্রাস পাচ্ছে' },{ value:1,label:'ফ্ল্যাট (একই থাকছে)',sub:'স্থবির, কোনো বৃদ্ধি নেই' },{ value:3,label:'১–৫% মাসিক',sub:'স্বাস্থ্যকর বৃদ্ধি' },{ value:4,label:'৫%+ মাসিক',sub:'দ্রুত বর্ধনশীল, চমৎকার' }] },
  { id: 'fin_4', domain: 'finance',    iconKey: 'fileBarChart',  q: 'বিজনেসের ফিনান্সিয়াল ট্র্যাকিং কতটা নিয়মিত?',             hint: 'ডেটা ছাড়া সঠিক সিদ্ধান্ত অসম্ভব।',                 options: [{ value:0,label:'কোনো হিসাব রাখি না',sub:'সম্পূর্ণ ব্লাইন্ড ম্যানেজমেন্ট' },{ value:1,label:'মাঝে মাঝে হিসাব',sub:'বার্ষিক বা কখনো কখনো' },{ value:3,label:'মাসিক হিসাব করি',sub:'নিয়মিত P&L রিভিউ' },{ value:4,label:'সাপ্তাহিক ড্যাশবোর্ড',sub:'রিয়েল-টাইম ফিনান্সিয়াল ভিউ' }] },
  { id: 'fin_5', domain: 'finance',    iconKey: 'circlePercent', q: 'CAC (Customer Acquisition Cost) জানেন ও ট্র্যাক করেন?',     hint: 'এক জন নতুন কাস্টমার পেতে কত খরচ হচ্ছে।',           options: [{ value:0,label:'জানি না',sub:'CAC কী তাই জানি না' },{ value:1,label:'ধারণা আছে, ট্র্যাক নেই',sub:'মোটামুটি অনুমান করি' },{ value:3,label:'জানি এবং মনিটর করি',sub:'মাসিক CAC ট্র্যাক করি' },{ value:4,label:'LTV:CAC অপ্টিমাইজ করি',sub:'অ্যাডভান্সড ফিনান্সিয়াল মেট্রিক্স' }] },
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
