import React, { useEffect, useRef } from 'react';
import { IconWhatsApp, IconCheck } from './Icons.jsx';
import {
  trackBotLandingView,
  trackBotDemoStart,
  trackBotInquiry,
  trackPricingCTA,
  trackCTA,
} from '../utils/tracking.js';

const WA_BOT      = '8801311773040';
const TRY_MSG     = 'হ্যালো! আমি Digitalizen-এর AI সেলস মডারেটরের এর ব্যাপারে কথা বলতে চাই।';
const INQUIRY_MSG = 'হ্যালো! আমি এই রকম একটি AI সেলস মডারেটর চাই।';

const buildBotHref = (msg) =>
  `https://wa.me/${WA_BOT}?text=${encodeURIComponent(msg)}`;

/* ── Reality check ───────────────────────────────────────────────────── */
const REALITY_CHECK = [
  {
    val: 'মানুষ ক্লান্ত হয়, কিন্তু AI নিরলস',
    lbl: 'রাত তিনটায় মেসেজ আসলেও সেকেন্ডের মধ্যে রিপ্লাই যাবে। ক্লান্তি নেই, মেজাজ খারাপ নেই, ছুটিও নেই।',
  },
  {
    val: 'মানুষ ভুলে যায়, কিন্তু AI সবসময় নিখুঁত',
    lbl: 'আপনার ব্যবসার নিখুঁত তথ্য দিয়েই তৈরি এর নিজস্ব ব্রেন। তাই পণ্যের দাম, অফার কিংবা পলিসি সবসময় একই থাকবে।',
  },
  {
    val: 'মানুষ অজুহাত দেয়, কিন্তু AI শুধু সেল করে',
    lbl: 'কোনো বোনাস, তদারকি কিংবা অভিযোগ ছাড়াই আপনার ইনবক্স সামলাবে চব্বিশ ঘণ্টা।',
  },
];

/* ── Capabilities ────────────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    t: '২৪/৭ অটো রিপ্লাই; কখনো থামে না',
    d: 'ছুটি হোক বা মাঝরাত কাস্টমার মেসেজ করলেই রিপ্লাই যাবে। WhatsApp Business Cloud API আর কাস্টম-ট্রেইনড AI মিলে আপনার ব্র্যান্ড কোনোদিন অফলাইন থাকবে না।',
  },
  {
    t: 'মুড বুঝে বাংলায় কথা বলে, ভয়েস মেসেজও বোঝে',
    d: 'কাস্টমার ভয়েস নোট পাঠালেও বুঝবে, বাংলিশ লিখলেও আটকাবে না। Whisper ভয়েস ট্রান্সক্রিপশন আর Native Bangla NLU — যেভাবেই বলুক, জবাব দেবে।',
  },
  {
    t: 'হিউম্যান ইন দ্য লুপ বা মানুষের অংশগ্রহণ',

    d: 'AI সেলস মডারেটর সামলাতে না পারলে অথবা মানুষের প্রয়োজন হলে নিজেই আপনার কাছে চ্যাট পাঠিয়ে দেবে। আপনি চাইলে যেকোনো সময় কন্ট্রোল নিতে পারবেন, তখন এআই নিজে থেকেই সরে যাবে।',
  },
  {
    t: 'আপনার ব্র্যান্ডের সুরে কথা বলে',

    d: 'প্রোডাক্ট লিস্ট, দাম, কমন প্রশ্ন, রিফান্ড পলিসি সব আপনার ব্র্যান্ডের মতো করে সেট করা। অনেক সময় কাস্টমার বুঝতেই পারবে না যে সে একটা AI এর সাথে কথা বলছে।'
  },
  {

  t: 'আইফোনেও কোনো ডাটা মিস হয় না',

  d: 'আইফোন (iOS 18) আর ক্রোম ব্রাউজারের কড়া নিয়মের মধ্যেও কোনো কাস্টমারের তথ্য হারাবে না। সার্ভার-সাইড ট্র্যাকিং প্রযুক্তির কারণে ফেসবুক ও গুগল বিজ্ঞাপনের লাভের হিসাব একদম নিখুঁত আসবে।',

 },
  {
    t: 'আপনার ডেটা থাকবে আপনার দখলে',
    d: 'কোনো থার্ড-পার্টি SaaS নেই। নিজস্ব ক্লাউড সার্ভারে self-hosted কাস্টমারের সব তথ্য সম্পূর্ণ আপনার নিয়ন্ত্রণে।',
  },
];

/* ── Gallery ─────────────────────────────────────────────────────────── */
const GALLERY = [
  { id: '001', name: 'DhakaTeez',  status: 'Live', img: '/images/dhakateez.webp' },
  { id: '002', name: 'Auora',      status: 'Live', img: '/images/auora.webp'    },
  { id: '003', name: 'GARMENTIK',  status: 'Live', img: '/images/garmentik.webp'},
  { id: '004', name: 'Resto',      status: 'Live', img: '/images/resto.webp'    },
];

/* ── Founder ─────────────────────────────────────────────────────────── */
const FOUNDER = {

  initials: 'MB',
  role:     'Founder & Rainmaker',
  name:     'Masum Billah',
  imageSrc: '/images/masum.webp',
  bio:      'গত ৯ বছরেরও বেশি সময় ধরে ক্লায়েন্টদের Ads অপটিমাইজেশন থেকে শুরু করে পূর্ণাঙ্গ Server-side Infrastructure তৈরির কাজ করে আসছি। ডেভেলপার কমিউনিটিতে আমি billahdotdev নামে পরিচিত। আমার কাজ সম্পর্কে জানতে যেকোনো AI কে জিজ্ঞেস করুন  "billah.dev কে?" বা "billah.dev কী করে? অথবা যেকোনো কিছু!"',
  creds: [
    'AI & Automation, NINA-Korea',
    'Full Stack Dev, IAC-BUET',
    'Marketing, AMA-Philippines',
    'Web Mastery, University of Helsinki (Ongoing)',

  ],

};
/* ── How it works ────────────────────────────────────────────────────── */
const HOW = [
  { n: '01', t: 'AI মডারেটরের সাথে চ্যাট বাটনে ক্লিক করুন', d: 'WhatsApp খুলবে, আপনি মেসেজ দিলেই AI সঙ্গে সঙ্গে রিপ্লাই দেবে।' },
  { n: '02', t: 'স্মার্টনেস টেস্ট করুন',                  d: 'টেক্সট অথবা ভয়েস মেসেজ দিয়ে যা খুশি আলাপ করুন।' },
  { n: '03', t: 'উত্তর দেখুন, তারপর সিদ্ধান্ত নিন',       d: 'পারফরম্যান্স পছন্দ হলে আপনার ব্যবসার জন্য হুবহু এমন একটা AI মডারেটর অথবা যেকোনো ধরনের AI অ্যাসিস্ট্যান্ট বানিয়ে নিন।' },
];

/* ── Use cases ───────────────────────────────────────────────────────── */
const USE_CASES = [
  { tag: 'F-Commerce',   p: 'প্রোডাক্ট সাজেশন, অর্ডার নেওয়া, পেমেন্ট গাইড, ডেলিভারি ট্র্যাকিং' },
  { tag: 'Real Estate',  p: 'ফ্ল্যাট খালি কিনা, ভিজিট বুকিং, কাগজের তালিকা। চব্বিশ ঘণ্টা লিড কনভার্ট হচ্ছে।' },
  { tag: 'Coaching',     p: 'কোর্সের বিস্তারিত, ব্যাচের তথ্য, ফি, ডেমো ক্লাস বুকিং। শতভাগ অটোমেটেড।' },
  { tag: 'Service',      p: 'কোটেশন চাওয়া, অ্যাপয়েন্টমেন্ট বুকিং, সাধারণ প্রশ্নের জবাব। যেকোনো সার্ভিস/বিজনেসে ফিট।' },
];

/* ── Pricing ─────────────────────────────────────────────────────────── */
const PRICING_TIERS = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'Standard · BD',
    name:    'AI সেলস মডারেটর',
    unit:    '৳',
    amount:  '১০,০০০',
    period:  ' setup + ৳৫,০০০/মাস',
    value:   15000,
    features: [
      '২৪/৭ ইনস্ট্যান্ট রিপ্লাই — মানুষের সাহায্য ছাড়াই',
      'Click-to-WhatsApp অ্যাডের সাথে সরাসরি ইন্টিগ্রেশন',
      'প্রোডাক্ট ক্যাটালগ, অর্ডার ও বুকিং — বটের ভেতর থেকেই',
      'লিড ট্র্যাকিং ও কাস্টমার ডেটাবেজ অটোমেশন',
      'বাংলা ভয়েস নোট সাপোর্ট (Whisper STT)',
      'Self-hosted — আপনার ডেটা আপনার সার্ভারে',
    ],
    cta:    'AI সেলস মডারেটর চাই',
    waMsg:  'হ্যালো! AI সেলস মডারেটর নিয়ে কথা বলতে চাই।',
    source: 'tier_lead_reactor',
  },
  {
    variant: 'electric',
    badge:   'F-COMMERCE',
    serial:  '02',
    tag:     'Growth Pro · BD',
    name:    'AI সেলস মডারেটর — গ্রোথ',
    unit:    '৳',
    amount:  '২৫,০০০',
    period:  ' setup + ৳৮,০০০/মাস',
    value:   25000,
    features: [
      '২৪/৭ ইনস্ট্যান্ট রিপ্লাই — মানুষের সাহায্য ছাড়াই',
      'একাধিক WhatsApp নম্বর — একটা সিস্টেম থেকে কন্ট্রোল',
      'প্রোডাক্ট ক্যাটালগ, অর্ডার ও বুকিং — বটের ভেতর থেকেই',
      'লিড ট্র্যাকিং ও কাস্টমার ডেটাবেজ অটোমেশন',
      'প্রতি ৳১০০ অ্যাড স্পেন্ড কতটা কাজে লাগছে — সরাসরি ট্র্যাক',
      'কোন অ্যাড থেকে অর্ডার আসছে — অটো রিপোর্ট',
      'iOS / Android সব ডিভাইসের কাস্টমার ধরা পড়বে',
      'Self-hosted — আপনার ডেটা আপনার সার্ভারে',
    ],
    cta:    'গ্রোথ ভার্সন চাই',
    waMsg:  'হ্যালো! AI সেলস মডারেটর গ্রোথ ভার্সন নিয়ে কথা বলতে চাই।',
    source: 'tier_lead_reactor_capi',
  },
];
/* ════════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════════ */
export default function BotLanding() {
  const sentinelRef = useRef(false);

  useEffect(() => {
    if (sentinelRef.current) return;
    sentinelRef.current = true;
    trackBotLandingView();
    document.title = 'AI Sales Engine — Digitalizen';
  }, []);

  const handleDemo     = (source) => () => trackBotDemoStart(source);
  const handleInquiry  = (source) => () => {
    trackBotInquiry(source);
    trackCTA('Get bot for my business', source);
  };
  const handleTier     = (tier) => () => {
    trackPricingCTA(tier.name, tier.value);
    trackBotInquiry(tier.source);
  };

  return (
    <div className="bl-page">

      <a href="#bl-main" className="skip-link">Skip to content</a>

      {/* ─── Topbar ─────────────────────────────────────────────── */}
      <header className="bl-topbar">
        <a href="/" className="bl-logo" aria-label="Digitalizen — homepage">
          Digitalizen<em>.</em>
        </a>
        <span className="bl-topbar-tag">// AI সেলস মডারেটর</span>
      </header>

      <main id="bl-main" tabIndex={-1}>

        {/* ═══════════════════════════════════════════════════════════
            1 · HERO
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-hero" aria-labelledby="bl-hero-h">
          <div className="bl-hero-grid" aria-hidden />

          <div className="bl-hero-inner">
            <div className="bl-badge fade-up" style={{ '--d': '0ms' }}>
              <span className="bl-badge-dot" aria-hidden />
              24/7 লাইভ • বাংলায় ইনস্ট্যান্ট রিপ্লাই
            </div>

            <h1 id="bl-hero-h" className="bl-h1 fade-up" style={{ '--d': '90ms' }}>
              দেরিতে রিপ্লাই দিলে<br />
              <em>কাস্টমার</em> অন্য পেজ থেকে কিনে ফেলে।
            </h1>

            <p className="bl-hero-quote fade-up" style={{ '--d': '170ms' }}>
              AI সেলস মডারেটর, কাস্টমারের মেজাজ বুঝে বাংলায় রিপ্লাই দেয়।<br />
              বিশ্বাস হচ্ছে না? নিজেই চ্যাট করে দেখুন।
            </p>

            <div
              className="bl-chat-preview fade-up"
              style={{ '--d': '230ms' }}
              role="img"
              aria-label="বটের লাইভ চ্যাট প্রিভিউ — কাস্টমারের প্রশ্নের বাংলায় ইনস্ট্যান্ট উত্তর দিয়ে সেল ক্লোজ করছে"
            >
              <div className="bl-chat-head">
                <div className="bl-chat-head-icon" aria-hidden>
                  AI
                  <span className="bl-chat-head-dot" />
                </div>
                <div className="bl-chat-head-meta">
                  <strong>AI সেলস মডারেটর</strong>
                  <span><span className="bl-chat-live" aria-hidden /> অনলাইন · বাংলায় রিপ্লাই দিচ্ছে</span>
                </div>
              </div>

              <div className="bl-chat-body" aria-hidden>
                <div className="bl-chat-msg bl-chat-msg--user">
                  <span>২৪/৭ ডেলিভারি দেন?</span>
                  <span className="bl-chat-time">2:14 PM</span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--bot">
                  <span>হ্যাঁ দিই। ঢাকায় ৩ ঘণ্টায়, বাইরে পরদিন। Cash on Delivery আর bKash দুটোই চলে — এলাকাটা বলুন, কনফার্ম করে দিচ্ছি।</span>
                  <span className="bl-chat-time">2:14 PM ✓✓</span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--user">
                  <span>মিরপুর-১০</span>
                  <span className="bl-chat-time">2:15 PM</span>
                </div>
                <div className="bl-chat-msg bl-chat-msg--bot">
                  <span>মিরপুর-এ আজই ৩ ঘণ্টায় পাঠাচ্ছি। নাম আর ফোন নম্বর দিন — অর্ডার কনফার্ম করে দিচ্ছি।</span>
                  <span className="bl-chat-time">2:15 PM ✓✓</span>
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
              style={{ '--d': '350ms', textDecoration: 'none' }}
              href={buildBotHref(TRY_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemo('hero_primary')}
              aria-label="WhatsApp-এ AI bot try করুন"
            >
              <IconWhatsApp width={20} height={20} />
              AI সেলস মডারেটরের সাথে চ্যাট করুন!
            </a>

            <p className="bl-cta-fine fade-up" style={{ '--d': '410ms' }}>
              WhatsApp খুলবে · ২ সেকেন্ডে রিপ্লাই · কোনো signup নেই
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2 · REALITY CHECK
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// রিয়েলিটি চেক</div>
            <h2 className="bl-h2">
              আপনি যখন ঘুমান,<br />আপনার বিজনেস কি তখনো <em>ইনকাম করে?</em>
            </h2>

            <div className="bl-reality-band">
              {REALITY_CHECK.map((r) => (
                <div key={r.lbl} className="bl-reality-cell">
                  <div className="bl-reality-val">{r.val}</div>
                  <div className="bl-reality-lbl">{r.lbl}</div>
                </div>
              ))}
            </div>

            <div className="bl-warning" role="note">
              <span className="bl-warning-icon" aria-hidden>!</span>
              <p className="bl-warning-text">
                <strong>সতর্কবার্তা:</strong>{' '}
                আপনার কম্পিটিটর অলরেডি AI অ্যাডাপ্ট করে ফেলেছে।
                আপনি কি ম্যানুয়াল রিপ্লাইয়ের যুগে থেকে কাস্টমার হারাতে থাকবেন?
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3 · INDUSTRIAL STRENGTH
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ইন্ডাস্ট্রিয়াল স্ট্রেংথ</div>
            <h2 className="bl-h2">
              শুধু চ্যাট না।<br /><em>সম্পূর্ণ সেলস মেশিন।</em>
            </h2>
            <p className="bl-section-sub">
              সাধারণ বটের সাথে আমাদের এআই সেলস মডারেটরের আসল পার্থক্য হলো এর স্মার্টনেস। কারণ এর মস্তিষ্ক তৈরি হয়েছে আপনার ব্যবসার নিজস্ব ডেটা দিয়ে। এর প্রতিটা লেয়ার সেলফ-হোস্টেড হওয়ায় আপনার ডেটার সম্পূর্ণ নিয়ন্ত্রণ থাকবে একমাত্র আপনার হাতেই।
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

        {/* ═══════════════════════════════════════════════════════════
            4 · TRUST
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ট্রাস্ট · কে আছে পেছনে?</div>
            <h2 className="bl-h2">
              ৯+ বছরের অভিজ্ঞতা<br /><em>প্রমাণসহ</em>
            </h2>

            <div className="bl-trust-grid">

              <div className="bl-trust-col">
                <div className="bl-trust-col-h">// রিসেন্ট কাজ</div>
                <div className="bl-gallery">
                  {GALLERY.map((w, i) => (
                    <div
                      key={w.id}
                      className="work-card work-card--no-link"
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
                        <div
                          className="work-scan"
                          style={{ animationDelay: `${i * 0.6}s` }}
                          aria-hidden
                        />
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="bl-trust-col">
                <div className="bl-trust-col-h">// ফাউন্ডার</div>
                <article className="founder-card" aria-label={`Founder: ${FOUNDER.name}`}>
                  <header className="founder-head">
                    <div className="avatar avatar--photo" aria-hidden>
                      <img
                        src={FOUNDER.imageSrc}
                        alt={FOUNDER.name}
                        width={52}
                        height={52}
                        decoding="async"
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
                  <div style={{ padding: '18px 24px' }}>
                    <p className="founder-body" style={{ padding: 0, marginBottom: 14 }}>
                      {FOUNDER.bio}
                    </p>
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

        {/* ═══════════════════════════════════════════════════════════
            5 · HOW IT WORKS
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// লাইভ ডেমো · ৩ ধাপ</div>
            <h2 className="bl-h2">মাত্র ২ মিনিটে ডেমো টেস্ট করে এর পারফরম্যান্স দেখুন এবং নিজেই সিদ্ধান্ত নিন।</h2>

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
              href={buildBotHref(TRY_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemo('how_section')}
              style={{ textDecoration: 'none' }}
            >
              <IconWhatsApp width={18} height={18} />
              ঠিক আছে, ট্রাই করি
              <span aria-hidden>→</span>
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            6 · USE CASES
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// কাদের জন্য</div>
            <h2 className="bl-h2">
              আপনার বিজনেসেও<br /><em>fit করবে</em>
            </h2>

            <div className="bl-uc-grid">
              {USE_CASES.map((u) => (
                <article key={u.tag} className="bl-uc">
                  <span className="bl-uc-tag">{u.tag}</span>
                  <p className="bl-uc-p">{u.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            7 · PRICING
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// প্যাকেজ</div>
            <h2 className="bl-h2">
              দুটো প্যাকেজ —<br /><em>আপনার fit বেছে নিন</em>
            </h2>
            <p className="bl-section-sub">
              ৳৫,০০০/মাস থেকে শুরু · ৭–১৪ দিনে ডেলিভারি · কোনো hidden cost নেই।
              bKash, Nagad, ব্যাংক ট্রান্সফার সব accept।
            </p>

            <div className="bl-pricing-grid">
              {PRICING_TIERS.map((p) => (
                <article
                  key={p.name}
                  className={`pk-card pk-${p.variant}`}
                  aria-label={`${p.name} — ${p.unit}${p.amount}${p.period}`}
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
                  <ul className="pk-features">
                    {p.features.map((f) => (
                      <li key={f}>
                        <span className="pk-dot" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    className="pk-btn"
                    href={buildBotHref(p.waMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleTier(p)}
                    style={{ textDecoration: 'none' }}
                  >
                    <span>{p.cta}</span>
                    <span aria-hidden>→</span>
                  </a>
                </article>
              ))}
            </div>

            <p className="bl-pricing-note">
              বড় বিজনেস বা multi-channel দরকার?{' '}
              <a
                href={buildBotHref('হ্যালো! Sales Operator package নিয়ে কথা বলতে চাই।')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInquiry('tier_custom_inquiry')}
              >
                Sales Operator package নিয়ে কথা বলুন →
              </a>
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            8 · CLOSER
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-closer">
          <div className="bl-closer-card">
            <span className="bl-closer-tag">// পরবর্তী পদক্ষেপ</span>
            <h2 className="bl-closer-h">
              এবার আপনার বিজনেসে<br />
              এই লেভেলের <em>ইন্টেলিজেন্স</em>।
            </h2>
            <p className="bl-closer-sub">
              উপরের AI সেলস মডারেটরের পারফরম্যান্সে ইম্প্রেসড?
              আপনার ব্যবসার জন্যও ঠিক এমন একটা 'মানি মেকিং মেশিন' বানিয়ে দিতে পারি।
            </p>

            <div className="bl-cta-dual">
              <a
                className="bl-cta-try"
                href={buildBotHref(TRY_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleDemo('closer_try')}
              >
                <IconWhatsApp width={20} height={20} />
                <div className="bl-cta-body">
                  <div className="bl-cta-t">আগে AI সেলস মডারেটরের try করি</div>
                  <div className="bl-cta-s">২ মিনিট লাগবে · কোনো commitment নেই</div>
                </div>
              </a>

              <a
                className="bl-cta-inquire"
                href={buildBotHref(INQUIRY_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleInquiry('closer_inquiry')}
              >
                <IconWhatsApp width={20} height={20} />
                <div className="bl-cta-body">
                  <div className="bl-cta-t">আমার jonno AI সেলস মডারেটরের বুক করুন</div>
                  <div className="bl-cta-s">সরাসরি Masum এর সাথে কথা বলুন</div>
                </div>
                <span className="bl-cta-arrow" aria-hidden>→</span>
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
          <a href="/" className="bl-footer-link">Digitalizen ওয়েবসাইট →</a>
        </div>
      </footer>
    </div>
  );
}

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
      href={buildBotHref(TRY_MSG)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <IconWhatsApp width={18} height={18} />
      <span>AI সেলস মডারেটর ট্রাই করুন</span>
      <span className="bl-sticky-arrow" aria-hidden>→</span>
    </a>
  );
}
