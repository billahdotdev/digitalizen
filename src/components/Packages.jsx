import React, { useEffect } from 'react';
import { IconWhatsApp, IconArrow } from './Icons.jsx';
import { generalHref, botHref, MSG } from '../utils/contact.js';
import {
  trackPricingCTA,
  trackSectionView,
  trackBotDemoStart,
  trackCTA,
} from '../utils/tracking.js';

/* Try the live bot (always goes to BOT number). */
const TRY_HREF = botHref(MSG.BOT_TRY);

/* ── Data: 3 Automation Tiers ─────────────────────────────────────────── */
const PACKAGES = [
  {
    variant:   'frosted',
    serial:    '01',
    tag:       'লিড লস বন্ধ করুন',
    name:      'মেসেজ সেলস সিস্টেম',
    unit: '৳', amount: '১৫,০০০', period: ' সেটআপ + ৳১০,০০০/মাস',
    setupNote: '*পেজ এবং ইনবক্স নির্ভর F Commerce ব্যবসার জন্য',
    value:     15000,
    bottomLine: '১ সেকেন্ডের দেরি মানে ২০% কাস্টমার হারানো।',
    features: [
      '১ সেকেন্ডে AI রিপ্লাই; কাস্টমারকে অন্য কোথাও যাওয়ার সুযোগই দেবেন না',
      'অ্যাড-টু-হোয়াটসঅ্যাপ অপারেশন ও প্রতিটি ক্লিকের নিখুঁত ট্র্যাকিং',
      'অটো ডাটা এন্ট্রি; কোনো ম্যানুয়াল কাজ ছাড়াই গুগল শিটে লিড সেভ',
      'অফিশিয়াল মেটা API; কোনো থার্ড-পার্টি সাবস্ক্রিপশন ফি লাগবে না',
    ],
    cta:       'অটোমেশন শুরু করুন',
    route:     '/bot',
    waInquiry: 'হ্যালো! মেসেজ সেলস সিস্টেম নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'electric',
    badge:     'BEST CONVERSION',
    serial:    '02',
    tag:       'iOS-Proof সেলস ফানেল',
    name:      'সেলস ফানেল সিস্টেম',
    unit: '৳', amount: '২৫,০০০', period: ' সেটআপ + ৳২০,০০০/মাস',
    setupNote: '*ওয়েবসাইট এবং ইনবক্স, উভয় চ্যানেলের জন্য',
    value:     25000,
    bottomLine: 'যারা দাম শুনে চলে যায়, তাদের থেকে সেল ফিরিয়ে আনুন।',
    features: [
      'মুড-সেন্সিটিভ AI সেলস-রিপ; মানুষের মতো আবেগ বুঝে চ্যাট ক্লোজ করবে',
      'iOS-Proof ট্র্যাকিং; iPhone ইউজারদের প্রতিটি কেনাকাটার হিসাব রাখুন',
      'স্মার্ট ফলো-আপ ইঞ্জিন; যারা চুপ হয়ে যায় তাদের কনভার্ট করার মেশিন',
      'হাই-কনভার্শন সেলস ফানেল ও ১ সেকেন্ড লোডিং SPA ল্যান্ডিং পেজ',

    ],
    cta:       'ফানেল সেটআপ করুন',
    waInquiry: 'হ্যালো! সেলস ফানেল সিস্টেম নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'obsidian',
    badge:     'BEST ROI',
    serial:    '03',
    tag:       'জিরো রিটার্ন লস',
    name:      'সেলস অটোমেশন ইঞ্জিন',
    unit: '৳', amount: '৩৫,০০০', period: ' সেটআপ + ৳৩০,০০০/মাস',
    setupNote: '*১০০% অটোমেটেড ওয়েবসাইট নির্ভর ব্র্যান্ডের জন্য',
    value:     35000,
    bottomLine: 'ফেক অর্ডার এবং রিটার্ন লস আপনার মুনাফা আর নষ্ট করবে না।',
    features: [
      'অ্যান্টি-ফেক COD সিকিউরিটি; OTP ভেরিফিকেশনে রিটার্ন লস বন্ধ',
      'পরিত্যক্ত কার্ট রিকভারি; হারিয়ে যাওয়া চেকআউট থেকে অটো রেভিনিউ',
      'অমনিচ্যানেল AI ইঞ্জিন; FB, WA ও ওয়েবসাইট চলবে এক সেন্ট্রাল ব্রেইনে',
      'রিয়েল-টাইম প্রফিট ড্যাশবোর্ড ও পুরো সেলস ইঞ্জিন স্केলিং সাপোর্ট',
    ],
    cta:       'সেলস ইঞ্জিন আনলক করুন',
    waInquiry: 'হ্যালো! সেলস অটোমেশন ইঞ্জিন নিয়ে কথা বলতে চাই।',
  },
];

const BOTTOM_BANNER_HREF = generalHref(MSG.CONSULT);

export default function Packages() {
  useEffect(() => {
    trackSectionView('pricing', { content_category: 'pricing' });
  }, []);

  /* Primary CTA. Either routes to /bot showcase, or opens a general
     consultancy WhatsApp chat for that specific plan.              */
  const go = (plan) => {
    trackPricingCTA(plan.name, plan.value || 0);
    if (plan.route) {
      window.location.assign(plan.route);
      return;
    }
    const href = generalHref(plan.waInquiry);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const tryBot = (planName) => trackBotDemoStart(`pkg_card_${planName}`);

  return (
    <section className="section" id="pricing" aria-labelledby="pricing-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৬ · অটোমেশন প্যাকেজ</div>
        <h2 id="pricing-h2" className="section-h2">
          আপনার ব্যবসার মডেল<br /><em>অনুযায়ী প্ল্যান বেছে নিন</em>
        </h2>
        <p className="section-sub">
          শুধু চ্যাটবট না। আমরা আপনার পুরো সেলস প্রসেসটাকে অটোমেট করি,<br />
          যাতে আপনি ঘুমালেও ব্যবসা সচল থাকে।
        </p>

        <div className="pk-grid">
          {PACKAGES.map((p) => (
            <article
              key={p.name}
              className={`pk-card pk-${p.variant}`}
              aria-label={`${p.name}, ${p.amount}${p.period}`}
            >
              {p.badge && <div className="pk-badge">{p.badge}</div>}

              <div className="pk-serial-row">
                <span className="pk-serial">{p.serial}</span>
                <span className="pk-tag">{p.tag}</span>
              </div>

              <div className="pk-name">{p.name}</div>

              <div className="pk-price-row">
                {p.unit && <span className="pk-unit">{p.unit}</span>}
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

              {/* Primary CTA. Consultancy inquiry per plan. */}
              <button className="pk-btn" onClick={() => go(p)}>
                <span>{p.cta}</span>
                <IconArrow />
              </button>

              {/* Secondary CTA. Bot Try button.
                  Pulsing animation + AI moderator style side border.   */}
              <a
                className="bl-tier-try pulse-border"
                href={TRY_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => tryBot(p.name)}
              >
                <IconWhatsApp width={15} height={15} />
                <span>আগে Bot try করুন</span>
              </a>
            </article>
          ))}
        </div>

        {/* Bottom banner. Goes to GENERAL contact. */}
        <div className="bottom-banner">
          <h3 className="bottom-banner-title">
            "আপনার কি শুধু একটি চ্যাটবট দরকার,<br />নাকি পুরো সেলস অটোমেশন ইঞ্জিন?"
          </h3>
          <p className="bottom-banner-sub">
            আমরা মার্কেটিং সাইকোলজি এবং অত্যাধুনিক টেকনোলজি একসাথে মিলিয়ে এমন কাস্টমাইজড সলিউশন<br />
            তৈরি করি, যা আপনার ব্যবসার প্রতিটি লিকেজ বন্ধ করে রেভিনিউ বাড়াতে বাধ্য।
          </p>
          <a
            className="pk-btn bottom-banner-btn"
            href={BOTTOM_BANNER_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('ফ্রি কনসালটেশন', 'pricing_bottom')}
          >
            <span>ফ্রি কনসালটেশন বুক করুন</span>
            <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}
