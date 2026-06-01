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
    tag:       'চ্যাট টু ক্যাশ',
    name:      'মেসেজ সেলস সিস্টেম',
    unit: '৳', amount: '১৫,০০০', period: ' সেটআপ + ৳৫,০০০/মাস',
    setupNote: '*পেজ এবং ইনবক্স নির্ভর F Commerce ব্যবসার জন্য',
    value:     15000,
    bottomLine: 'ইনবক্সে ম্যানুয়াল কাজের দিন শেষ।',
    features: [
      'ইনস্ট্যান্ট রিপ্লাই, জিরো ডিলে। একটি লিডও মিস হবে না।',
      'অটো ডেটা এন্ট্রি। চ্যাট থেকেই কাস্টমারের ইনফো সেভ।',
      'ফ্রি রি টার্গেটিং। পুরোনো কাস্টমারদের ব্রডকাস্ট মেসেজ।',
      'WhatsApp API। অফিশিয়াল মেটা সার্টিফাইড প্রফেশনাল সেটআপ।',
    ],
    cta:       'অটোমেশন শুরু করুন',
    route:     '/bot',
    waInquiry: 'হ্যালো! মেসেজ সেলস সিস্টেম নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'electric',
    badge:     'BEST CONVERSION',
    serial:    '02',
    tag:       'হাইব্রিড ফানেল',
    name:      'সেলস ফানেল সিস্টেম',
    unit: '৳', amount: '২৫,০০০', period: ' সেটআপ + ৳৮,০০০/মাস',
    setupNote: '*ওয়েবসাইট এবং ইনবক্স, উভয় চ্যানেলের জন্য',
    value:     25000,
    bottomLine: 'ডাবল প্ল্যাটফর্ম, ডাবল কনভার্শন রেট।',
    features: [
      'AI সেলস রিপ। মানুষের মতো চ্যাট করে সেলস ক্লোজ।',
      'স্মার্ট ফলো আপ। যারা দাম শুনে চুপ, তাদের থেকে লস্ট সেলস রিকভারি।',
      'ওয়েব টু ইনবক্স। ওয়েবসাইটের ট্রাফিককে সরাসরি মেসেঞ্জারে কনভার্ট।',
      'ইনস্ট্যান্ট ট্রাস্ট। স্বয়ংক্রিয় অর্ডার কনফার্মেশন।',
    ],
    cta:       'ফানেল সেটআপ করুন',
    waInquiry: 'হ্যালো! সেলস ফানেল সিস্টেম নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'obsidian',
    badge:     'BEST ROI',
    serial:    '03',
    tag:       'ফুল স্ট্যাক ই কমার্স',
    name:      'সেলস অটোমেশন ইঞ্জিন',
    unit: '৳', amount: '৩৫,০০০', period: ' সেটআপ + ৳১২,০০০/মাস',
    setupNote: '*১০০% অটোমেটেড ওয়েবসাইট নির্ভর ব্র্যান্ডের জন্য',
    value:     35000,
    bottomLine: 'জিরো ফেক অর্ডার, ম্যাক্সিমাম প্রফিট মার্জিন।',
    features: [
      'অ্যান্টি ফেক COD। OTP ভেরিফিকেশনে ফেক অর্ডার এবং রিটার্ন লস বন্ধ।',
      'কার্ট রিকভারি। কার্টে ফেলে যাওয়া প্রোডাক্টের অটো AI রিমাইন্ডার।',
      'অমনিচ্যানেল বট। ওয়েব, মেসেঞ্জার এবং WhatsApp এ সেন্ট্রাল AI সাপোর্ট।',
      'অটো অ্যালার্ট। অর্ডার কনফার্মেশনে ব্র্যান্ডেড SMS এবং ইমেইল।',
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
