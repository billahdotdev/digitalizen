/* =====================================================
   CASE STUDY — Data Layer v2
   Single source of truth.
   Images: Unsplash free (replace with real screenshots).
   Video: Loom embed (replace src with real URL).
   ===================================================== */

export const CS_META = {
  tag: '//  Case Study — Dhaka E-Commerce',
  headline: 'মার্কেটিং বাজেট ৫০% সাশ্রয়,\nসেলস ৩০০% বৃদ্ধি।',
  subhead:
    'Vite + React সুপার-ফাস্ট ল্যান্ডিং পেজ, সার্ভার-সাইড CAPI ট্র্যাকিং, হাইপারলোকাল ক্যাম্পেইন আর AI মেসেজ অটোমেশন — একসাথে কাজ করে কীভাবে একটি ব্র্যান্ড পুরোপুরি বদলে গেল।',
}

/* ── 4-Chapter Transformations ──
   before.img / after.img → Unsplash placeholder. Replace later.
   video.src             → Loom embed URL. Replace later.
   ── */
export const CS_PILLARS = [
  {
    id: '01',
    label: 'The Conversion Engine',
    title: 'ল্যান্ডিং পেজ',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    before: {
      era: 'Manual Era',
      hook: 'ক্লিক করল, কিন্তু কিনল না।',
      text: 'ওয়েবসাইট লোড হতে ৬ সেকেন্ড লাগত। ডিজাইন ছিল হিজিবিজি, CTA ছিল অস্পষ্ট। ১০ জনের মধ্যে ৮ জন পেজ লোড হওয়ার আগেই বেরিয়ে যেত — সম্ভাব্য কাস্টমার চিরতরে হারিয়ে যেত।',
      stat: '২%',
      statLabel: 'Conversion Rate',
      img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'পুরনো স্লো ওয়েবসাইটের উদাহরণ',
    },
    after: {
      era: 'Modern Era',
      hook: 'লোড হওয়ার আগেই কাস্টমার মুগ্ধ।',
      text: 'Vite ও React দিয়ে পেজ লোড হয় ০.৮ সেকেন্ডে। সাইকোলজিক্যাল ট্রিগার আর মোবাইল-ফার্স্ট UX — কাস্টমার স্ক্রোল করতে করতে কিনে ফেলে।',
      stat: '১২%+',
      statLabel: 'Conversion Rate',
      img: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'আধুনিক দ্রুত ল্যান্ডিং পেজ',
    },
    video: {
      show: true,
      /* ← Replace with your real Loom embed URL */
      src: 'https://www.loom.com/embed/YOUR_LOOM_VIDEO_ID',
      thumb: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=75&auto=format&fit=crop',
      thumbAlt: 'ট্রান্সফরমেশন কেস স্টাডি ভিডিও',
      label: 'পুরো ট্রান্সফরমেশন দেখুন',
      duration: '৩ মিনিট ২২ সেকেন্ড',
    },
  },
  {
    id: '02',
    label: 'The Brain of Ads',
    title: 'CAPI ট্র্যাকিং',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
    before: {
      era: 'Pixel Era',
      hook: 'আপনার অ্যাড ডাটার অর্ধেক প্রতিদিন উবে যাচ্ছিল।',
      text: 'iOS ১৪ আপডেট আর অ্যাড-ব্লকার মিলে প্রায় ৫০% কনভার্সন ডাটা হারিয়ে ফেলছিল। ফেসবুক অ্যালগরিদম অন্ধের মতো অপ্টিমাইজ করছিল — আর আপনার বাজেট ড্রেনে যাচ্ছিল।',
      stat: '৫০%',
      statLabel: 'ডাটা হারিয়ে যাচ্ছিল প্রতিদিন',
      img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'ডাটা ট্র্যাকিং গ্যাপ',
    },
    after: {
      era: 'Server-Side Era',
      hook: 'এখন প্রতিটি ক্লিক, প্রতিটি কনভার্সন ধরা পড়ে।',
      text: 'Server-Side CAPI সরাসরি Meta-তে পাঠায়। অ্যাড-ব্লকার, iOS প্রাইভেসি — কিছুই আর ডাটা লুকাতে পারে না। অ্যালগরিদম এখন সঠিক ক্রেতাকে নিখুঁতভাবে চেনে।',
      stat: '১০০%',
      statLabel: 'Data Match Quality',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'পরিপূর্ণ ডাটা ট্র্যাকিং ড্যাশবোর্ড',
    },
    video: { show: false },
  },
  {
    id: '03',
    label: 'The Precision Targeting',
    title: 'মার্কেটিং ক্যাম্পেইন',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    before: {
      era: 'Spray & Pray',
      hook: '"বুস্ট করলেই বিক্রি হবে" — এই ভুলে লাখ টাকা গেছে।',
      text: 'যাকে-তাকে অ্যাড দেখানো মানে বাজেট পোড়ানো। ভুল অডিয়েন্স, উচ্চ CPC, নিম্নমানের লিড — ROAS ছিল মাত্র ব্রেক-ইভেন পয়েন্টে। মুনাফা শূন্য।',
      stat: '১.৫×',
      statLabel: 'ROAS — শুধু ব্রেক-ইভেন',
      img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'অগোছালো মার্কেটিং ক্যাম্পেইন',
    },
    after: {
      era: 'Hyper-Local Era',
      hook: 'এখন শুধু কিনতে-রেডি মানুষের কাছে পৌঁছাই।',
      text: 'CAPI-র নিখুঁত ডাটা দিয়ে Look-alike ও Retargeting। ঢাকার নির্দিষ্ট পাড়া, নির্দিষ্ট আয়ের মানুষ — পাঠাও-এর মতো হাইপার-লোকাল প্রিসিশন। কম খরচে বেশি বিক্রি।',
      stat: '৪.৮×',
      statLabel: 'ROAS — Scalable Profit',
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'প্রিসিশন টার্গেটিং অ্যানালিটিক্স ড্যাশবোর্ড',
    },
    video: { show: false },
  },
  {
    id: '04',
    label: 'The 24/7 Salesman',
    title: 'মেসেজ অটোমেশন',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    before: {
      era: 'Manual Reply',
      hook: 'রাত ২টায় মেসেজ — সকাল পর্যন্ত চুপ।',
      text: 'কাস্টমার প্রশ্ন করে ঘুমিয়ে গেল, আপনিও ঘুমিয়ে গেলেন। সকালে উঠে দেখলেন সে কম্পিটিটরের কাছ থেকে কিনে ফেলেছে। প্রতি রাতে এভাবে কত লিড হারিয়েছেন?',
      stat: '৪৫ মিনিট+',
      statLabel: 'গড় রেসপন্স টাইম',
      img: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'ম্যানুয়াল মেসেজিং সিস্টেম',
    },
    after: {
      era: 'AI Chatbot Era',
      hook: 'AI ঘুমায় না — আপনার হয়ে ২৪/৭ বিক্রি করে।',
      text: 'AI চ্যাটবট ২ সেকেন্ডে নাম ধরে রিপ্লাই করে। প্রশ্নের জবাব, প্রোডাক্ট সাজেশন, অর্ডার কনফার্মেশন — সবই চ্যাটেই। আপনি ঘুমাচ্ছেন, AI বিক্রি করছে।',
      stat: '২ সেকেন্ড',
      statLabel: 'গড় রেসপন্স টাইম',
      img: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=800&q=75&auto=format&fit=crop',
      imgAlt: 'AI চ্যাটবট ইন্টারফেস',
    },
    video: { show: false },
  },
]

/* ── Before vs After — Money Table ── */
export const CS_TABLE = {
  cols: ['মেট্রিক', 'আগে (পুরনো পদ্ধতি)', 'পরে (আমাদের সিস্টেম)'],
  rows: [
    { metric: 'ডাটা ট্র্যাকিং',      before: '৫০% ডাটা গায়েব',           after: '১০০% নিখুঁত সার্ভার ডাটা',         highlight: true },
    { metric: 'রেসপন্স টাইম',         before: '৪৫ মিনিট+',                 after: 'মাত্র ২ সেকেন্ড',                   highlight: false },
    { metric: 'অ্যাড ROI (ROAS)',      before: '১.৫× (Break-even)',          after: '৪.৮× (Scalable Profit)',             highlight: true },
    { metric: 'কনভার্সন রেট',         before: '২%',                         after: '১২%+',                               highlight: false },
    { metric: 'অপারেশনাল এফোর্ট',    before: '৩ জন ফুল-টাইম স্টাফ',      after: '১০০% অটোমেটেড (০ স্টাফ)',           highlight: true },
  ],
}

/* ── 4-Step Process ── */
export const CS_PROCESS = [
  { num: '01', title: 'গভীর অডিট',          sub: 'Deep Audit',          text: 'আপনার বর্তমান ল্যান্ডিং পেজ, ট্র্যাকিং আর ক্যাম্পেইনের প্রতিটি লুপহোল খুঁজে বের করা।' },
  { num: '02', title: 'সিস্টেম আর্কিটেকচার', sub: 'System Architecture', text: 'Vite + React দিয়ে হাই-কনভার্টিং ল্যান্ডিং পেজ এবং সার্ভার-সাইড CAPI ইন্টিগ্রেশন।' },
  { num: '03', title: 'AI ইমপ্লিমেন্টেশন',  sub: 'AI Implementation',   text: 'চ্যাটবট ও অটো-ফলোআপ সেটআপ যাতে কোনো লিড বা কাস্টমার হাতছাড়া না হয়।' },
  { num: '04', title: 'স্কেলিং ও গ্রোথ',    sub: 'Scaling & Growth',    text: 'নিখুঁত ডাটা ব্যবহার করে প্রফিটেবল ক্যাম্পেইন স্কেল করে সরাসরি রেভিনিউ জেনারেট করা।' },
]

/* ── CTA ── */
export const CS_CTA = {
  question: 'আপনার ব্যবসাও কি ভুল ডাটা আর ব্যাকডেটেড ম্যানুয়াল সিস্টেমে আটকে আছে?',
  body:     'আমরা আপনার বিজনেসের জন্য একটি কাস্টম AI ও ডাটা-ড্রিভেন রোডম্যাপ তৈরি করে দেব — একদম ফ্রি।',
  btnLabel: 'গেট মাই ফ্রি রোডম্যাপ — আজই সংগ্রহ করুন',
  waText:   'হ্যালো Digitalizen, আমি ফ্রি রোডম্যাপ চাই।',
}
