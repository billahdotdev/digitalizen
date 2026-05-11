import React, { useEffect, useRef } from 'react';
import { IconWhatsApp, IconCheck } from './Icons.jsx';
import {
  trackBotLandingView,
  trackBotDemoStart,
  trackBotInquiry,
  trackPricingCTA,
  trackCTA,
} from '../utils/tracking.js';

/* ═══════════════════════════════════════════════════════════════════════
   BOT LANDING — `/bot` route
   ─────────────────────────────────────────────────────────────────────
   FINAL · BUSINESS-PLAN-ALIGNED BUILD

   Aligns to the real infrastructure & service catalog:
     • WhatsApp Business Cloud API (live AI bot)
     • Whisper STT — Bangla voice handling
     • Chatwoot HITL handoff — agent takes over when bot can't
     • Dify Knowledge Base — custom-trained on client's biz
     • GTM Server Container — server-side Meta CAPI + Google CAPI
     • Self-hosted Oracle Cloud infra — data sovereignty
     • Two pricing tiers shown:
        — Lead Reactor       (৳15k setup + ৳5k/mo)
        — Lead Reactor + CAPI (৳25k setup + ৳8k/mo) · F-commerce focus

   FUNNEL — restrained · expensive feel · one CTA per section:
     1.  Hero          — killer hook + live demo CTA
     2.  Reality Check — pain amplification
     3.  Industrial    — 6 capability cards (real infra mapped)
     4.  Trust         — past work gallery + founder card
     5.  How it works  — 3-step demo guide + secondary CTA
     6.  Use cases     — 4 BD industries
     7.  Pricing tiers — Lead Reactor vs + CAPI (clear good/better)
     8.  Closer        — final dual CTA in one premium glass card

   META-AD TRACKING (auto-fires on the right interactions):
     • PageView          — Pixel init (index.html)
     • ViewContent       — on mount → trackBotLandingView()
     • Lead              — every WhatsApp deep-link → trackBotDemoStart(src)
     • InitiateCheckout  — pricing tier or "Get yours" → trackBotInquiry/trackPricingCTA
   ════════════════════════════════════════════════════════════════════ */

const WA_BOT      = '8801311773040';   // Live AI bot — Meta Cloud API
const TRY_MSG     = 'হ্যালো! আমি Digitalizen-এর AI Bot-এ কথা বলতে চাই।';
const INQUIRY_MSG = 'হ্যালো! এই AI বটের মতো একটা আমার ব্যবসার জন্য চাই।';

const buildBotHref = (msg) =>
  `https://wa.me/${WA_BOT}?text=${encodeURIComponent(msg)}`;

/* ── Reality check: 3 stark, contrasting statements ─────────────────── */
const REALITY_CHECK = [
  {
    val: 'মানুষ ক্লান্ত হয়,\ AI হয় না।',
    lbl: 'দিনরাত ২৪ ঘণ্টা একই এনার্জিতে সেলস ক্লোজ করে। কোনো ব্রেক নেই।',
  },
  {
    val: 'মানুষ ভুলে যায়, \n AI কখনো ভোলে না,',
    lbl: 'আপনার সেট করা ডেটা-ড্রিভেন রেসপন্স। কোনো অনুমান, কোনো ভুল নেই।',
  },
  {
    val: 'মানুষ অজুহাত দেয়,\n AI শুধু সেল ক্লোজ করে।',
    lbl: 'বোনাস বা ওভারটাইম ছাড়াই আপনার ইনবক্স সামলাবে এই নিখুঁত সেলস অপারেটর।',
},
];

/* ── Industrial Strength: aligned to real infrastructure ─────────────── */
const CAPABILITIES = [
  {
    t: '২৪/৭ অটো-রিপ্লাই ইঞ্জিন',
    d: 'যখন সবাই ঘুমায়, এআই তখন লিড ম্যাচিউর করে। ব্র্যান্ড কখনো অফলাইন হয় না — WhatsApp Business Cloud API + কাস্টম-ট্রেইনড AI।',
  },
  {
    t: 'বাংলায় Voice + Text — ১০০%',
    d: 'কাস্টমার voice note পাঠালেও বট বুঝে। English-Bangla mix সব handle। Native Bangla NLU + Whisper voice transcription।',
  },
  {
    t: 'Bot পারে না যে কাজ — আপনি নেন',
    d: 'বট সামলাতে না পারলে instant notification। Chatwoot dashboard থেকে নিজে take over — bot ঐ chat থেকে সরে যাবে।',
  },
  {
    t: 'আপনার Brand Voice — হুবহু',
    d: 'আপনার product, price list, FAQ, refund policy — সব আপনার tone-এ Knowledge Base-এ লোড। কাস্টমার বুঝবেই না সে বটের সাথে কথা বলছে।',
  },
  {
    t: 'iOS-এ data হারায় না',
    d: 'iOS 18 + Chrome restrictions থেকে event ভাঙে না। Server-side CAPI (Meta + Google) → অ্যাড ROAS measurable, optimization আরো নির্ভুল।',
  },
  {
    t: 'আপনার data — আপনার সার্ভারে',
    d: 'Oracle Cloud-এ self-hosted। কোনো third-party SaaS lock-in নেই। কেউ আপনার customer database কেড়ে নিতে পারবে না।',
  },
];

/* ── Gallery: past work proof (.webp images from /public/images/) ────── */
/* User will replace with originals — onError gracefully hides missing.  */
const GALLERY = [
  { id: '001', name: 'DhakaTeez',  status: 'Live', img: '/images/dhakateez.webp' },
  { id: '002', name: 'Auora',      status: 'Live', img: '/images/auora.webp'    },
  { id: '003', name: 'GARMENTIK',  status: 'Live', img: '/images/garmentik.webp'},
  { id: '004', name: 'Resto',      status: 'Live', img: '/images/resto.webp'    },
];

/* ── Founder & Rainmaker (matches Services.jsx data) ─────────────────── */
const FOUNDER = {
  initials: 'MB',
  role:     'Founder & Rainmaker',
  name:     'Masum Billah',
  imageSrc: '/images/masum.webp',
  bio:      'BUET alumnus। ৯+ বছর ধরে BD-র ব্র্যান্ডগুলোকে ডিজিটালে রেজাল্ট দিয়ে আসছি। Meta Ads থেকে শুরু করে পুরো Server-side Infrastructure — সব নিজেই করি।',
  creds: [
    'AI & Automation, NINA-Korea',
    'Full Stack Dev, IAC-BUET Certified',
    'Marketing, AMA-Philippines',
    'Web Mastery — University of Helsinki',
  ],
};

/* ── How it works: 3-step demo guide ─────────────────────────────────── */
const HOW = [
  { n: '01', t: 'বাটনে ক্লিক করুন',           d: 'WhatsApp খুলবে — bot সরাসরি কথা শুরু করবে।' },
  { n: '02', t: 'যা ইচ্ছা প্রশ্ন করুন',       d: 'সার্ভিস, প্রাইস, প্রসেস — text বা voice note, যেভাবে comfortable।' },
  { n: '03', t: 'সলিউশন পান + ডিসাইড করুন',  d: 'পছন্দ হলে আপনার ব্যবসার জন্য একই bot বানিয়ে নিন।' },
];

/* ── Use cases: industry resonance (BD-specific) ─────────────────────── */
const USE_CASES = [
  { tag: 'F-Commerce',  p: 'অর্ডার নেওয়া, পেমেন্ট গাইড, ডেলিভারি ট্র্যাকিং — Facebook DM থেকে WhatsApp-এ shift।' },
  { tag: 'Real Estate', p: 'Property availability, viewing booking, document checklist — ২৪/৭ leads convert।' },
  { tag: 'Coaching',    p: 'Course details, batch info, fees, demo class booking — ১০০% automated।' },
  { tag: 'Service',     p: 'Quote request, appointment booking, FAQ — যেকোনো service business।' },
];

/* ── Pricing tiers: maps to real catalog (Lead Reactor + + CAPI) ─────── */
const PRICING_TIERS = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'Standard · BD',
    name:    'Lead Reactor',
    unit:    '৳',
    amount:  '১৫,০০০',
    period:  ' setup + ৳৫,০০০/মাস',
    value:   15000,
    features: [
      'WhatsApp AI auto-reply',
      'Chatwoot HITL handoff',
      'Bangla NLU + Voice (Whisper)',
      'Custom-trained on your business',
      'Self-hosted Oracle infrastructure',
      'ফ্রি ল্যান্ডিং পেজ',
    ],
    cta:    'Lead Reactor চাই',
    waMsg:  'হ্যালো! Lead Reactor package নিয়ে কথা বলতে চাই।',
    source: 'tier_lead_reactor',
  },
  {
    variant: 'electric',
    badge:   'F-COMMERCE',
    serial:  '02',
    tag:     'CAPI Pro · BD',
    name:    'Lead Reactor + CAPI',
    unit:    '৳',
    amount:  '২৫,০০০',
    period:  ' setup + ৳৮,০০০/মাস',
    value:   25000,
    features: [
      'Lead Reactor সবকিছু',
      '+ Meta CAPI (server-side)',
      '+ Google Ads server-side conversions',
      '+ GTM Server Container',
      '+ iOS 18-proof event tracking',
      'Target: ৳২০k+/মাস ad spend',
    ],
    cta:    '+ CAPI version চাই',
    waMsg:  'হ্যালো! Lead Reactor + CAPI নিয়ে কথা বলতে চাই।',
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

  const handleDemo = (source) => () => trackBotDemoStart(source);

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

      {/* Skip-to-content for keyboard / screen-reader users */}
      <a href="#bl-main" className="skip-link">Skip to content</a>

      {/* ─── Topbar ─────────────────────────────────────────────── */}
      <header className="bl-topbar">
        <a href="/" className="bl-logo" aria-label="Digitalizen — homepage">
          Digitalizen<em>.</em>
        </a>
        <span className="bl-topbar-tag">// WhatsApp AI সেলস মেশিন </span>
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
              24/7 লাইভ • WhatsApp • বাংলায় ইনস্ট্যান্ট রিপ্লাই
            </div>

            <h1 id="bl-hero-h" className="bl-h1 fade-up" style={{ '--d': '90ms' }}>
              রিপ্লাই দিতে দেরি হলে<br />
              <em>কাস্টমার</em> অন্য পেজ থেকে কিনে ফেলে?
            </h1>

            <p className="bl-hero-quote fade-up" style={{ '--d': '170ms' }}>
              AI সেলস মেশিন! কাস্টমারের মুড বুঝে বাংলায় রিপ্লাই দেয়। <br />
              বিশ্বাস হচ্ছে না? চ্যাট করে দেখুন!
            </p>

            <div className="bl-avatar-wrap fade-up" style={{ '--d': '230ms' }}>
              <span className="cb-splash-ring" aria-hidden />
              <span className="cb-splash-ring" aria-hidden />
              <div className="bl-avatar">AI</div>
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
              AI অ্যাসিস্ট্যান্ট। ট্রাই করুন!
            </a>

            <p className="bl-cta-fine fade-up" style={{ '--d': '410ms' }}>
              WhatsApp খুলবে · কোনো signup নেই · সম্পূর্ণ ফ্রি
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2 · REALITY CHECK — pain amplification
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// রিয়েলিটি চেক</div>
            <h2 className="bl-h2">
              আপনি যখন ঘুমান,<br />আপনার বিজনেস কি তখন <em>ইনকাম করে?</em>
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
                আপনার কম্পিটিটর অলরেডি এআই অ্যাডাপ্ট করেছে।
                আপনি কি ম্যানুয়াল রিপ্লাইয়ের যুগে পড়ে কাস্টমার হারাবেন?
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3 · INDUSTRIAL STRENGTH — capability proof (real infra)
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ইন্ডাস্ট্রিয়াল স্ট্রেংথ</div>
            <h2 className="bl-h2">
              শুধু চ্যাট না।<br /><em>সম্পূর্ণ সেলস মেশিন।</em>
            </h2>
            <p className="bl-section-sub">
              যে কারণে আমাদের AI Engine সাধারণ বট থেকে আলাদা।
              প্রতিটা layer self-hosted — আপনার data, আপনার control।
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
            4 · TRUST — past work gallery + founder card
            Reuses .work-card + .founder-card from app.css.
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section bl-section--alt">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// ট্রাস্ট · কে আছে পেছনে</div>
            <h2 className="bl-h2">
              ৯+ বছর experience<br /><em>প্রমাণসহ</em>
            </h2>

            <div className="bl-trust-grid">

              {/* ── Gallery: 4 past work thumbs (re-uses .work-* classes) ── */}
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

              {/* ── Founder card (re-uses .founder-card classes) ── */}
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
            5 · HOW IT WORKS — demo invitation
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// লাইভ ডেমো · ৩ ধাপ</div>
            <h2 className="bl-h2">২ মিনিটে demo</h2>

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
            6 · USE CASES — industry resonance
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
            7 · PRICING TIERS — Lead Reactor vs + CAPI
            Reuses .pk-card classes; tier click → trackPricingCTA
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-section">
          <div className="bl-section-inner">
            <div className="bl-section-tag">// প্যাকেজ</div>
            <h2 className="bl-h2">
              দুটো প্যাকেজ —<br /><em>আপনার fit বেছে নিন</em>
            </h2>
            <p className="bl-section-sub">
              ৭-১৪ দিনে ডেলিভারি। কোনো hidden cost নেই।
              আপফ্রন্ট সব বলি — bKash, Nagad, ব্যাংক ট্রান্সফার সব accept।
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
              বড় bagged business / multi-channel দরকার?{' '}
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
            8 · CLOSER — final dual CTA in premium glass card
            ═════════════════════════════════════════════════════════ */}
        <section className="bl-closer">
          <div className="bl-closer-card">
            <span className="bl-closer-tag">// পরবর্তী পদক্ষেপ</span>
            <h2 className="bl-closer-h">
              এবার আপনার বিজনেসে<br />
              এই লেভেলের <em>ইন্টেলিজেন্স</em>।
            </h2>
            <p className="bl-closer-sub">
              উপরের বটের পারফরম্যান্সে ইমপ্রেসড?
              আপনার ব্যবসার জন্যও এমন 'মানি মেকিং মেশিন' বানিয়ে দিতে পারি।
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
                  <div className="bl-cta-t">আগে Bot try করি</div>
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
                  <div className="bl-cta-t">আমার এআই ইঞ্জিন বুক করুন</div>
                  <div className="bl-cta-s">সরাসরি Masum-এর সাথে কথা বলুন</div>
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

      {/* ─── Sticky CTA bar — appears after hero scroll-out ─────── */}
      <StickyBotCta onClick={handleDemo('sticky_bar')} />

      {/* ─── Footer ─────────────────────────────────────────────── */}
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

/* ════════════════════════════════════════════════════════════════════════
   StickyBotCta — mobile-only persistent demo button.
   Appears when user has scrolled past the hero CTA, hides near footer
   so it never blocks the final dual-CTA in the closer.
════════════════════════════════════════════════════════════════════════ */
function StickyBotCta({ onClick }) {
  const [visible, setVisible] = React.useState(false);
  const ticking = React.useRef(false);

  React.useEffect(() => {
    const evaluate = () => {
      const y     = window.scrollY;
      const winH  = window.innerHeight;
      const docH  = document.documentElement.scrollHeight;
      const past  = y > winH * 0.7;          // past hero
      const near  = y + winH > docH - 240;   // near footer
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
      <span>WatsApp ChatBot ট্রাই করুন</span>
      <span className="bl-sticky-arrow" aria-hidden>→</span>
    </a>
  );
}
