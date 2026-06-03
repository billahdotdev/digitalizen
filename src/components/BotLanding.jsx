import React, { useEffect, useRef } from 'react';
import {
  IconWhatsApp,
  IconCheck,
  IconArrow,
  IconExternal,
  IconGithub,
  IconDoubleTick,
} from './Icons.jsx';
import {
  trackBotLandingView,
  trackBotDemoStart,
  trackBotInquiry,
  trackPricingCTA,
  trackCTA,
  trackLivePreview,
} from '../utils/tracking.js';
import { generalHref, botHref, MSG, PROJECT_LINKS } from '../utils/contact.js';

/* ═══════════════════════════════════════════════════════════════════════
   BOT LANDING — `/bot` route. Meta ad destination.
   FUNNEL, demo first conversion objective.
     1.  Hero          → live bot demo CTA
     2.  Reality Check → pain amplification
     3.  Capabilities  → 6 proofs
     4.  Trust         → past work gallery + founder card + Live Preview
     5.  How it works  → 3 step demo guide + mid CTA
     6.  Who it's for  → 3 use case tiers
     7.  Pricing       → 3 tiers, each with try bot + inquiry CTAs
     8.  Closer        → final dual CTA
   ════════════════════════════════════════════════════════════════════ */

const TRY_HREF     = botHref(MSG.BOT_TRY);
const INQUIRY_HREF = generalHref(MSG.BOT_INQUIRY);

/* ── Reality check ───────────────────────────────────────────────────── */
const REALITY_CHECK = [
  {
    val: 'আপনার টিম ঘুমালে কি আপনার ব্যবসাও থেমে যায়?',
    lbl: 'মানুষের বিরতি প্রয়োজন, কিন্তু এই এআই ইঞ্জিন ২৪/৭ ক্লান্তিহীনভাবে কাস্টমারের সাথে বাংলায় কথা বলে সেলস মেশিন সচল রাখে।',
  },
  {
    val: 'ভুল ইনকোয়ারি আর ডেটা লস কি আপনার প্রফিট কমিয়ে দিচ্ছে?',
    lbl: 'মানুষ ভুলে যায়, কিন্তু এআই প্রতিটি কাস্টমার ডেটা নির্ভুলভাবে ট্র্যাক করে এবং আপনার সেট করা লজিক অনুযায়ী নিখুঁত রিপ্লাই দেয়।',
  },
  {
    val: 'অজুহাতমুক্ত ইনবক্স; যেখানে শুধুই অটোমেটেড সেলস।',
    lbl: 'বোনাস বা ছুটির ঝামেলা ছাড়াই এই স্মার্ট সেলস অপারেটর ২ সেকেন্ডে রিপ্লাই দিয়ে আপনার ব্যবসাকে দেয় ইঞ্জিনিয়ারড গ্রোথ।',
  },
];

/* ── Capabilities ────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    t: 'টিম বিশ্রামে থাকলেও সেলস মেশিন জাগ্রত',
    d: 'রাত ৩টা কিংবা ছুটির দুপুর—আপনার সেলস টিম যখন ঘুমে, আপনার এআই ইঞ্জিন তখন কাস্টমারের মুড বুঝে ডিল ক্লোজ করে প্রফিট লিক হওয়া বন্ধ করছে। [২৯৮, ৩০২]',
  },
  {
    t: 'বাংলায় কথা বলে, মানুষের আবেগ বোঝে',
    d: 'শুধু টেক্সট নয়, ভয়েস নোট আর বাংলিশ—সবই বুঝবে এই ডিজিটাল ব্রেইন। মানুষের মতো সাবলীল বাংলায় কথা বলে কাস্টমারের সাথে "Attunement" বা হারমোনি তৈরি করে। [৩০২, ১০১১]',
  },
  {
    t: 'জটিল ডিল? এক ক্লিকে হাল ধরুন আপনি',
    d: 'সাধারণ কাজ বট করবে, কিন্তু হাই-টিকিট বা জটিল প্রশ্নে বট আপনাকে ইনস্ট্যান্ট এলার্ট দেবে। এক ক্লিকে আপনি চ্যাটে ঢুকে ডিল ফাইনাল করবেন। [৩০৬, ১০১৩]',
  },
  {
    t: 'আপনার ব্যবসার হুবহু ডিজিটাল ক্লোন',
    d: 'দাম থেকে শুরু করে রিটার্ন পলিসি—আপনার ব্যবসার প্রতিটি লজিক বটকে শেখানো। কাস্টমার মনে করবে সে আপনার ব্র্যান্ডের সেরা এক্সপার্টের সাথেই কথা বলছে। [৩০৫, ৪৭৩]',
  },
  {
    t: 'আইফোন ইউজারদের ডেটা লিক বন্ধ',
    d: 'আইওএস ১৪+ এর পর ট্র্যাকিং ব্লাইন্ডনেস ব্যবসার প্রফিট কমিয়ে দিচ্ছে। আমাদের সার্ভার-সাইড ইঞ্জিন আইফোন কাস্টমারদেরও নির্ভুলভাবে ট্র্যাক করে ROAS নিশ্চিত করে। [৩০৮, ৪৭১]',
  },
  {
    t: 'ডিজিটাল দাসত্ব নয়, পূর্ণ মালিকানা',
    d: 'মাসিক সাবস্ক্রিপশনের ঝামেলা নেই। আপনার নিজস্ব ওরাকল ক্লাউড সার্ভারে চলবে আপনার কাস্টমার ডেটাবেজ। আপনার সম্পদ শুধুই আপনার থাকবে। [৪৬৮, ৪৭০]',
  },
];

/* ── Gallery (Trust section) — each tile gets a Live Preview button ── */
const GALLERY = [
  { id: '001', name: 'DhakaTeez',  status: 'Live', img: '/images/dhakateez.webp', live: PROJECT_LINKS.dhakateez },
  { id: '002', name: 'Auora',      status: 'Live', img: '/images/auora.webp',     live: PROJECT_LINKS.auora     },
  { id: '003', name: 'GARMENTIK',  status: 'Live', img: '/images/garmentik.webp', live: PROJECT_LINKS.garmentik },
  { id: '004', name: 'Resto',      status: 'Live', img: '/images/resto.webp',     live: PROJECT_LINKS.resto     },
];

/* ── Founder ─────────────────────────────────────────────────────────── */
const FOUNDER = {
  initials: 'MB',
  role:     'MarTech Architect & Growth Engineer',
  name:     'Masum Billah',
  imageSrc: '/images/masum.webp',
  bio:      '৯+ বছর ধরে হাই-গ্রোথ ব্র্যান্ডের "বাজেট লিক" বন্ধ করে তাদের জন্য প্রেডিক্টেবল রেভিনিউ ইঞ্জিন আর্কিটেক্ট করছি। আমি কেবল বিজ্ঞাপন দিই না; সার্ভার-সাইড ট্র্যাকিং থেকে বাংলায় কথা বলা AI বট—পুরো গ্রোথ ইনফ্রাস্ট্রাকচার একা হাতে ইঞ্জিনিয়ার করি যাতে আপনার স্কেলিং হয় টেকনিক্যাল জটলামুক্ত এবং টেনশন-ফ্রি।',
  creds: [
    'AI and Automation, NINA Korea',
    'Full Stack Dev, IAC BUET Certified',
    'Marketing, AMA Philippines',
    'Web Mastery, University of Helsinki',
  ],
};

/* ── How it works ────────────────────────────────────────────────────── */
const HOW = [
  { 
    n: '01', 
    t: 'ফিউচারিস্টিক ডেমো শুরু করুন', 
    d: 'বাটনে ক্লিক করলেই হোটসঅ্যাপে আপনার জন্য একটি লাইভ সেশন শুরু হবে। কোনো ফর্ম ফিলাপের ঝামেলা নেই, সরাসরি অ্যাকশনে যান।' 
  },
  { 
    n: '02', 
    t: 'এআই-এর বুদ্ধিমত্তা পরীক্ষা করুন', 
    d: 'সার্ভিস, স্ট্র্যাটেজি বা ভয়েস নোট—যেকোনো কিছু বাংলায় জিজ্ঞেস করুন। দেখুন কীভাবে এই ডিজিটাল ব্রেইন ২ সেকেন্ডে আপনার মুড বুঝে রেসপন্স দেয়।' 
  },
  { 
    n: '03', 
    t: 'আপনার গ্রোথ ইঞ্জিন আর্কিটেক্ট করুন', 
    d: 'ডেমো পছন্দ হলে আপনার ব্র্যান্ডের জন্য এই একই প্রিডিক্টেবল সেলস ইনফ্রাস্ট্রাকচার বুঝে নিন। বিজ্ঞাপন থেকে আসা প্রতিটি লিড এখন হবে একটি ক্লোজড ডিল।' 
  },
];

/* ── Who it's for — maps 1 to 1 with the three packages ───────────── */
const WHO_FOR = [
  {
    serial: '01',
    tag:    'চ্যাট টু ক্যাশ',
    title:  'শুধু পেজ এবং ইনবক্সে ব্যবসা করেন?',
    body:   'ওয়েবসাইট নেই, Facebook পেজ এবং WhatsApp ই আপনার স্টোর। ইনবক্সে ম্যানুয়ালি রিপ্লাই দিতে দিতে ক্লান্ত, লিড মিস হচ্ছে। এই tier আপনার জন্য।',
  },
  {
    serial: '02',
    tag:    'হাইব্রিড ফানেল',
    title:  'ওয়েবসাইট আছে, ইনবক্স থেকেও সেলস করেন?',
    body:   'ওয়েবসাইটের ট্রাফিক ইনবক্সে হারিয়ে যাচ্ছে, দাম শুনে কাস্টমার চুপ হয়ে যাচ্ছে। দুটো চ্যানেলকে একসাথে সেলস মেশিনে রূপান্তর করতে এই tier।',
  },
  {
    serial: '03',
    tag:    'ফুল স্ট্যাক ই কমার্স',
    title:  'ই কমার্স সাইট, ফেক অর্ডার এবং কার্ট ড্রপ সমস্যায়?',
    body:   'ফেক COD অর্ডার, অ্যাবানডনড কার্ট এবং ম্যানুয়াল কনফার্মেশনে প্রতিদিন হাজার টাকা লস হচ্ছে। জিরো ম্যানুয়াল কাজে ১০০% অটোমেশন চাইলে এই tier।',
  },
];

/* ── Pricing tiers — all 3 packages ─────────────────────────────────── */
const PRICING_TIERS = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'চ্যাট-টু-ক্যাশ · ডিজিটাল ইনবক্স ইনফ্রাস্ট্রাকচার',
    name:    'কাস্টমার একুইজিশন ইঞ্জিন',
    unit:    '৳',
    amount:  '১৫,০০০',
    period:  ' setup + ৳৫,০০০/মাস',
    setupNote: '*ইনবক্স-নির্ভর ব্যবসার গ্রোথ ইনফ্রাস্ট্রাকচার',
    value:   15000,
    features: [
      '১ সেকেন্ড দেরিতে ২০% সেল হারানো বন্ধ করতে জিরো-ডিলে রিপ্লাই।',
      'ম্যানুয়াল কাজের দিন শেষ; চ্যাট থেকেই অটোমেটেড কাস্টমার সিআরএম।',
      'ফ্রি রি-টার্গেটিং; পুরোনো কাস্টমারদের ইনবক্সে ফেরানোর অটো ফানেল।',
      'অফিশিয়াল হোয়াটসঅ্যাপ API; প্রফেশনাল ব্র্যান্ড স্ট্যাটাস ও ডেলিভারি।',
      'বাংলা Voice Note সাপোর্ট; কাস্টমার যেভাবে চায়, বট সেভাবেই রেডি।',
      'ডিজিটাল মালিকানা; অন্যের সফটওয়্যারে ভাড়া নয়, আপনার নিজস্ব সিস্টেম।',
    ],
    bottomLine: 'আপনার ইনবক্সকে বানান একটি ২৪/৭ সেলস মেশিন।',
    cta:    'এই ইঞ্জিন চাই',
    waMsg:  'হ্যালো! কাস্টমার একুইজিশন ইঞ্জিন নিয়ে কথা বলতে চাই।',
    source: 'tier_message_sales',
  },
  {
    variant: 'electric',
    badge:   'BEST CONVERSION',
    serial:  '02',
    tag:     'হাইব্রিড ফানেল · ওয়েব টু ইনবক্স আর্কিটেকচার',
    name:    'প্রেডিক্টেবল রেভিনিউ সিস্টেম',
    unit:    '৳',
    amount:  '২৫,০০০',
    period:  ' setup + ৳৮,০০০/মাস',
    setupNote: '*ওয়েবসাইট ও ইনবক্স—উভয় চ্যানেলের ওমনিচ্যানেল সলিউশন',
    value:   25000,
    features: [
      'এআই সেলস রিপ; কাস্টমারের মুড বুঝে বাংলায় চ্যাট ও সেল ক্লোজ করে।',
      'স্মার্ট অটো-ফলোআপ; দাম শুনে হারিয়ে যাওয়া কাস্টমার থেকে প্রফিট রিকভারি।',
      'ওয়েব টু ইনবক্স; ট্রাফিককে সরাসরি হাই-কনভার্টিং চ্যাটে রূপান্তর।',
      'ইনস্ট্যান্ট ট্রাস্ট; অটোমেটেড অর্ডার কনফার্মেশনে কাস্টমার লয়ালটি বৃদ্ধি।',
      'আইফোন ইউজার ট্র্যাকিং; সার্ভার-সাইড CAPI-তে প্রতিটা টাকার হিসাব।',
      'লাইভ গ্রাফানা ড্যাশবোর্ড; আপনার ব্যবসার সব ডেটা এক নজরে, রিয়েল-টাইম।',
    ],
    bottomLine: 'স্কেলিং হবে এখন টেকনিক্যাল জটলামুক্ত এবং প্রেডিক্টেবল।',
    cta:    'সিস্টেমটি আনলক করুন',
    waMsg:  'হ্যালো! প্রেডিক্টেবল রেভিনিউ সিস্টেম নিয়ে কথা বলতে চাই।',
    source: 'tier_sales_funnel',
  },
  {
    variant: 'obsidian',
    badge:   'BEST ROI',
    serial:  '03',
    tag:     'ফুল-স্ট্যাক এন্টারপ্রাইজ ইনফ্রাস্ট্রাকচার',
    name:    'গ্রোথ অটোমেশন ইঞ্জিন',
    unit:    '৳',
    amount:  '৩৫,০০০',
    period:  ' setup + ৳১২,০০০/মাস',
    setupNote: '*১০০% অটোমেটেড ওয়েবসাইট নির্ভর ব্র্যান্ডের জন্য',
    value:   35000,
    features: [
      'অ্যান্টি-ফেক COD; ওটিপি ভেরিফিকেশনে রিটার্ন লস ও ফেক অর্ডার বন্ধ।',
      'কার্ট রিকভারি আর্কিটেকচার; ফেলে যাওয়া প্রোডাক্টের পেছনে এআই ফলোআপ।',
      'ওমনিচ্যানেল এআই বট; ওয়েব, মেসেঞ্জার ও হোয়াটসঅ্যাপে একীভূত সাপোর্ট।',
      'ব্র্যান্ডেড স্মার্ট অ্যালার্ট; প্রফেশনাল SMS ও ইমেইল নোটিফিকেশন।',
      'ফুল-স্ট্যাক ট্র্যাকিং; Google ও Meta উভয় অ্যাডের সার্ভার-সাইড ইঞ্জিনিয়ারিং।',
      'জিরো মিডলওয়্যার কস্ট; আপনার নিজস্ব ওরাকল সার্ভারে সম্পূর্ণ মালিকানা।',
    ],
    bottomLine: 'বাজেট লিক বন্ধ করুন; আপনার ব্র্যান্ডকে দিন ইঞ্জিনিয়ারড গ্রোথ।',
    cta:    'পুরো ইনফ্রাস্ট্রাকচার চাই',
    waMsg:  'হ্যালো! গ্রোথ অটোমেশন ইঞ্জিন নিয়ে কথা বলতে চাই।',
    source: 'tier_sales_engine',
  },
];

/* ════════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function BotLanding() {
  const sentinelRef = useRef(false);

  useEffect(() => {
    if (sentinelRef.current) return;
    sentinelRef.current = true;
    trackBotLandingView();
    document.title = 'AI Sales Engine, Digitalizen';
  }, []);

  const handleDemo    = (source) => () => trackBotDemoStart(source);
  const handleInquiry = (source) => () => {
    trackBotInquiry(source);
    trackCTA('Get bot for my business', source);
  };
  const handleTier = (tier) => () => {
    trackPricingCTA(tier.name, tier.value);
    trackBotInquiry(tier.source);
  };

  return (
    <div className="bl-page">
      <a href="#bl-main" className="skip-link">Skip to content</a>

      {/* ─── Topbar ─────────────────────────────────────────────── */}
      <header className="bl-topbar">
        <a href="/" className="bl-logo" aria-label="Digitalizen, homepage">
          Digitalizen<em>.</em>
        </a>
        <span className="bl-topbar-tag">// AI সেলস অটোমেশন ইঞ্জিন</span>
      </header>

      <main id="bl-main" tabIndex={-1}>

        {/* 1 · HERO ─────────────────────────────────────────────── */}
        <section className="bl-hero" aria-labelledby="bl-hero-h">
          <div className="bl-hero-grid" aria-hidden />

          <div className="bl-hero-inner">
            <div className="bl-badge fade-up" style={{ '--d': '0ms' }}>
              <span className="bl-badge-dot" aria-hidden />
              AI মডারেটর·24/7 বাংলায় ইনস্ট্যান্ট রিপ্লাই
            </div>

            <h1 id="bl-hero-h" className="bl-h1 fade-up" style={{ '--d': '90ms' }}>
              রিপ্লাই দিতে দেরি হলে<br />
              <em>কাস্টমার</em> অন্য পেজ থেকে কিনে ফেলে?
            </h1>

            <p className="bl-hero-quote fade-up" style={{ '--d': '170ms' }}>
              আপনার দরকার "AI মডারেটর"। কাস্টমারের মুড বুঝে বাংলায় রিপ্লাই দেয়।<br />
              বিশ্বাস হচ্ছে না? চ্যাট করে দেখুন।
            </p>

            <div
              className="bl-chat-preview fade-up"
              style={{ '--d': '230ms' }}
              role="img"
              aria-label="বটের লাইভ চ্যাট প্রিভিউ। কাস্টমারের প্রশ্নের বাংলায় ইনস্ট্যান্ট উত্তর দিয়ে সেল ক্লোজ করছে।"
            >
              <div className="bl-chat-head">
                <div className="bl-chat-head-icon" aria-hidden>
                  Digi
                  <span className="bl-chat-head-dot" />
                </div>
                <div className="bl-chat-head-meta">
                  <strong>ডিজিটালাইজেন এর বানানো AI মডারেটর</strong>
                  <span><span className="bl-chat-live" aria-hidden /> অনলাইন · বাংলায় রিপ্লাই দিচ্ছে</span>
                </div>
              </div>

              <div className="bl-chat-body" aria-hidden>
                <div className="bl-chat-msg bl-chat-msg--user">
                  <span>২৪/৭ ডেলিভারি দেন?</span>
                  <span className="bl-chat-time">2:14 PM</span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--bot">
                  <span>হ্যাঁ। ঢাকায় ৩ ঘণ্টায়, ঢাকার বাইরে পরদিন। Cash on Delivery এবং bKash দুটোই চলে। আপনার এরিয়াটা জানালে কনফার্ম করি।</span>
                  <span className="bl-chat-time">2:14 PM<IconDoubleTick /></span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--user">
                  <span>মিরপুর ১০</span>
                  <span className="bl-chat-time">2:15 PM</span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--bot">
                  <span>মিরপুর এ আজই ৩ ঘণ্টায় পৌঁছে দিচ্ছি। অর্ডার করতে নাম এবং ফোন নাম্বার দিন, আমি confirm করে দিচ্ছি।</span>
                  <span className="bl-chat-time">2:15 PM<IconDoubleTick /></span>
                </div>
              </div>

              <div className="bl-chat-typing" aria-hidden>
                <span className="bl-chat-typing-dot" />
                <span className="bl-chat-typing-dot" />
                <span className="bl-chat-typing-dot" />
              </div>
            </div>

            <a
              className="btn-primary cb-try-btn bl-cta-primary fade-up"
              style={{ '--d': '350ms' }}
              href={TRY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemo('hero_primary')}
              aria-label="WhatsApp এ AI bot try করুন"
            >
              <IconWhatsApp width={20} height={20} />
              AI অ্যাসিস্ট্যান্টের সাথে চ্যাট করে দেখুন!
            </a>

            <p className="bl-cta-fine fade-up" style={{ '--d': '410ms' }}>
              WhatsApp খুলবে · ২ সেকেন্ডে রিপ্লাই · কোনো শর্ত নেই
            </p>
          </div>
        </section>

        {/* 2 · REALITY CHECK ────────────────────────────────────── */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// রিয়েলিটি চেক</div>
            <h2 className="bl-h2">
              আপনি যখন ঘুমান,<br />আপনার বিজনেস কি তখনও <em>ইনকাম করে?</em>
            </h2>

            <div className="bl-reality-band">
              {REALITY_CHECK.map((r) => (
                <div key={r.val} className="bl-reality-cell">
                  <div className="bl-reality-val">{r.val}</div>
                  <div className="bl-reality-lbl">{r.lbl}</div>
                </div>
              ))}
            </div>

            <div className="bl-warning" role="note">
              <span className="bl-warning-icon" aria-hidden>!</span>
              <p className="bl-warning-text">
                <strong>সতর্কবার্তা,</strong>{' '}
                কম্পিটিটর অলরেডি এআই অ্যাডাপ্ট করেছে।
                আপনি কি ম্যানুয়াল রিপ্লাইয়ের যুগে পড়ে কাস্টমার হারাবেন?
              </p>
            </div>
          </div>
        </section>

        {/* 3 · CAPABILITIES ─────────────────────────────────────── */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ইন্ডাস্ট্রিয়াল স্ট্রেংথ</div>
            <h2 className="bl-h2">
              শুধু একটা চ্যাটবট না।<br /><em>সম্পূর্ণ সেলস মেশিন।</em>
            </h2>
            <p className="bl-section-sub">
              যে কারণে আমাদের "AI মডারেটর" সাধারণ বট থেকে আলাদা।<br />
              কাস্টমার বুঝবেই না সে বটের সাথে কথা বলছে।
            </p>

            <div className="bl-cap-grid">
              {CAPABILITIES.map((c, i) => (
                <article key={c.t} className="bl-cap" style={{ '--i': i }}>
                  <span className="bl-cap-tick" aria-hidden>
                    <IconCheck />
                  </span>
                  <div>
                    <div className="bl-cap-t">{c.t}</div>
                  </div>
                  <p className="bl-cap-d">{c.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 4 · TRUST + GALLERY (with Live Preview) ─────────────── */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ট্রাস্ট · কে আছে পেছনে</div>
            <h2 className="bl-h2">
              ৯+ বছরের অভিজ্ঞতা<br /><em>0% মিথ্যা প্রতিশ্রুতি</em>
            </h2>

            <div className="bl-trust-grid">
              <div className="bl-trust-col">
                <div className="bl-trust-col-h">// রিসেন্ট কাজের কিছু নমুনা</div>
                <div className="bl-gallery">
                  {GALLERY.map((w, i) => (
                    <article
                      key={w.id}
                      className="work-card work-card--bl"
                      aria-label={`${w.name}, ${w.status}`}
                    >
                      <div className="work-thumb">
                        <img
                          src={w.img}
                          alt={`${w.name} landing page screenshot`}
                          className="work-thumb-img"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="work-scanlines" aria-hidden />
                        <div className="work-scan" style={{ animationDelay: `${i * 0.6}s` }} aria-hidden />
                        <div className="work-corner work-corner--tl" aria-hidden />
                        <div className="work-corner work-corner--br" aria-hidden />
                        <span className="work-thumb-label">{w.name}</span>
                      </div>
                      <div className="work-meta">
                        <div>
                          <span className="work-id">{w.id}</span>
                          <div className="work-name">{w.name}</div>
                        </div>
                        <div className="work-status">
                          <span className="work-pulse" aria-hidden />
                          {w.status}
                        </div>
                      </div>

                      {/* Sharp corner Live Preview button. */}
                      <a
                        className="work-live-btn"
                        href={w.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackLivePreview(w.name)}
                        aria-label={`${w.name}, Live Preview দেখুন GitHub এ`}
                      >
                        <IconGithub />
                        <span>Live Preview</span>
                        <IconExternal />
                      </a>
                    </article>
                  ))}
                </div>
              </div>

              <div className="bl-trust-col">
                <div className="bl-trust-col-h">// ফাউন্ডার</div>
                <article className="founder-card" aria-label={`Founder, ${FOUNDER.name}`}>
                  <header className="founder-head">
                    <div className="avatar avatar--photo" aria-hidden>
                      <img
                        src={FOUNDER.imageSrc}
                        alt={FOUNDER.name}
                        width={52}
                        height={52}
                        decoding="async"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <span className="avatar-fallback" style={{ display: 'none' }}>
                        {FOUNDER.initials}
                      </span>
                    </div>
                    <div>
                      <div className="founder-role">{FOUNDER.role}</div>
                      <div className="founder-name">{FOUNDER.name}</div>
                    </div>
                  </header>
                  <div className="founder-inner">
                    <p className="founder-body">{FOUNDER.bio}</p>
                    <div className="creds">
                      {FOUNDER.creds.map((c) => (
                        <span key={c} className="cred">{c}</span>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* 5 · HOW IT WORKS ─────────────────────────────────────── */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">//আপনার গ্রোথ ইঞ্জিনের লাইভ প্রিভিউ</div>
            <h2 className="bl-h2">২ মিনিটে পরীক্ষা করুন আপনার এআই মডারেটরকে</h2>

            <ol className="bl-how" aria-label="Demo steps">
              {HOW.map((s) => (
                <li key={s.n} className="bl-how-item">
                  <span className="bl-how-n">{s.n}</span>
                  <div>
                    <div className="bl-how-t">{s.t}</div>
                    <p className="bl-how-d">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>

            <a
              className="btn-primary bl-cta-mid"
              href={TRY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemo('how_section')}
            >
              <IconWhatsApp width={18} height={18} />
              ঠিক আছে, ট্রাই করি
              <IconArrow />
            </a>
          </div>
        </section>

        {/* 6 · WHO IT'S FOR ─────────────────────────────────────── */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// কাদের জন্য</div>
            <h2 className="bl-h2">
              আপনার বিজনেস মডেল<br /><em>কোনটা?</em>
            </h2>

            <div className="bl-uc-grid">
              {WHO_FOR.map((u) => (
                <article key={u.serial} className="bl-uc">
                  <span className="bl-uc-tag">{u.serial} · {u.tag}</span>
                  <div className="bl-cap-t bl-uc-title">{u.title}</div>
                  <p className="bl-uc-p">{u.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 7 · PRICING ──────────────────────────────────────────── */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// অটোমেশন প্যাকেজ</div>
            <h2 className="bl-h2">
              আপনার বিজনেস মডেল<br /><em>অনুযায়ী প্ল্যান বেছে নিন</em>
            </h2>
            <p className="bl-section-sub">
              ৳১৫,০০০ setup থেকে শুরু · ৭ থেকে ১৪ দিনে ডেলিভারি · কোনো hidden cost নেই।<br />
              bKash, Nagad, ব্যাংক ট্রান্সফার, সব accept।
            </p>

            <div className="bl-pricing-grid">
              {PRICING_TIERS.map((p) => (
                <article
                  key={p.name}
                  className={`pk-card pk-${p.variant}`}
                  aria-label={`${p.name}, ${p.unit}${p.amount}${p.period}`}
                >
                  {p.badge && <div className="pk-badge">{p.badge}</div>}
                  <div className="pk-serial-row">
                    <span className="pk-serial">{p.serial}</span>
                    <span className="pk-tag">{p.tag}</span>
                  </div>
                  <div className="pk-name">{p.name}</div>
                  <div className="pk-price-row">
                    <span className="pk-unit">{p.unit}</span>
                    <span className="pk-amount">{p.amount}</span>
                    <span className="pk-period">{p.period}</span>
                  </div>
                  {p.setupNote && (
                    <div className="pk-setup-note">{p.setupNote}</div>
                  )}
                  <ul className="pk-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="pk-dot" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.bottomLine && (
                    <p className="pk-bottom-line">{p.bottomLine}</p>
                  )}

                  {/* Primary, inquiry → GENERAL */}
                  <a
                    className="pk-btn"
                    href={generalHref(p.waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleTier(p)}
                  >
                    <span>{p.cta}</span>
                    <IconArrow />
                  </a>

                  {/* Secondary, try live bot → BOT, with pulsing border */}
                  <a
                    className="bl-tier-try pulse-border"
                    href={TRY_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDemo(`tier_try_${p.source}`)}
                  >
                    <IconWhatsApp width={15} height={15} />
                    <span>আগে Bot try করুন</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 8 · CLOSER ───────────────────────────────────────────── */}
        <section className="bl-closer">
          <div className="bl-closer-card">
            <span className="bl-closer-tag">// পরবর্তী পদক্ষেপ</span>
            <h2 className="bl-closer-h">
              এবার আপনার বিজনেসে<br />
              এই লেভেলের <em>ইন্টেলিজেন্স</em>।
            </h2>
            <p className="bl-closer-sub">
              উপরের বটের পারফরম্যান্সে ইমপ্রেসড?<br />
              আপনার ব্যবসার জন্যও এমন সেলস মেশিন বানিয়ে দিতে পারি।
            </p>

            <div className="bl-cta-dual">
              <a
                className="bl-cta-try"
                href={TRY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDemo('closer_try')}
              >
                <IconWhatsApp width={20} height={20} />
                <div className="bl-cta-body">
                  <div className="bl-cta-t">আগে Bot try করি</div>
                  <div className="bl-cta-s">২ মিনিট লাগবে · কোনো commitment নেই</div>
                </div>
              </a>

              <a
                className="bl-cta-inquire"
                href={INQUIRY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInquiry('closer_inquiry')}
              >
                <IconWhatsApp width={20} height={20} />
                <div className="bl-cta-body">
                  <div className="bl-cta-t">আমার AI ইঞ্জিন বুক করুন</div>
                  <div className="bl-cta-s">সরাসরি Masum এর সাথে কথা বলুন</div>
                </div>
                <IconArrow />
              </a>
            </div>

            <p className="bl-closer-trust">
              <span className="bl-live-dot" aria-hidden />
              24/7 অনলাইন · ২ সেকেন্ডে রিপ্লাই
            </p>
          </div>
        </section>

      </main>

      <StickyBotCta onClick={handleDemo('sticky_bar')} />

      <footer className="bl-footer">
        <div className="bl-footer-inner">
          <span>© 2026 Digitalizen · Dhaka, Manila</span>
          <span className="bl-footer-sep" aria-hidden>·</span>
          <a href="/" className="bl-footer-link">Digitalizen ওয়েবসাইট</a>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   StickyBotCta. Mobile first persistent demo button.
═══════════════════════════════════════════════════════════════════════ */
function StickyBotCta({ onClick }) {
  const [visible, setVisible] = React.useState(false);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const evaluate = () => {
      const y    = window.scrollY;
      const winH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const past = y > winH * 0.7;
      const near = y + winH > docH - 240;
      setVisible(past && !near);
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(evaluate);
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    evaluate();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      className={`bl-sticky${visible ? ' bl-sticky--on' : ''}`}
      href={TRY_HREF}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <IconWhatsApp width={18} height={18} />
      <span>WhatsApp ChatBot ট্রাই করুন</span>
      <IconArrow />
    </a>
  );
}
