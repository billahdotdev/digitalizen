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
    name:      'ইনবক্স ক্লোজার ইঞ্জিন',
    unit: '৳', amount: '১৫,০০০', period: ' সেটআপ + ৳৫,০০০/মাস',
    setupNote: '*পেজ ও ইনবক্স-নির্ভর F-Commerce ব্যবসার জন্য',
    value:     15000,
    bottomLine: '১ সেকেন্ডের দেরি মানে ২০% কাস্টমার হারানো। [৫৭০]',
    features: [
      '১ সেকেন্ডে হাই-স্পিড রিপ্লাই — কাস্টমার অন্য পেজে যাওয়ার সুযোগই পাবে না। [৫৭০]',
      'অটোমেটেড ডাটা এন্ট্রি — ম্যানুয়াল ডাটা এন্ট্রির ক্লান্তি আর ভুল থেকে চিরমুক্তি। [৫১৮]',
      'স্মার্ট রি-টার্গেটিং — পুরনো কাস্টমারদের থেকে বিনা খরচে আবার সেল বের করে আনা। [৭]',
      'অফিশিয়াল মেটা ইনফ্রাস্ট্রাকচার — থার্ড-পার্টি অ্যাপের ঝামেলা ও বাড়তি খরচ ০%। [৬৪৪]',
    ],
    cta:       'অটোমেশন শুরু করুন',
    route:     '/bot',
    waInquiry: 'হ্যালো! ইনবক্স ক্লোজার ইঞ্জিন নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'electric',
    badge:     'BEST ROI',
    serial:    '02',
    tag:       'হারানো প্রফিট পুনরুদ্ধার',
    name:      'রেভিনিউ রিকভারি সিস্টেম',
    unit: '৳', amount: '২৫,০০০', period: ' সেটআপ + ৳৮,০০০/মাস',
    setupNote: '*ওয়েবসাইট এবং ইনবক্স—উভয় চ্যানেলের জন্য',
    value:     25000,
    bottomLine: 'যারা দাম শুনে চলে যায়, তাদের থেকে সেল ফিরিয়ে আনুন। [১৫৬৮]',
    features: [
      'মুড-সেন্সিটিভ AI সেলস-রিপ — মানুষের মতো আবেগ বুঝে চ্যাট ক্লোজ করার ক্ষমতা। [৩৭৬]',
      'স্মার্ট ফলো-আপ ইঞ্জিন — যারা দাম শুনে চুপ হয়ে যায়, তাদের কনভার্ট করার মেশিন। [১৫৬৮]',
      'ওয়েব-টু-ইনবক্স ফানেল — সাইটের ট্রাফিককে সরাসরি বিশ্বস্ত চ্যাটে রূপান্তর। [৩১৩]',
      'ইনস্ট্যান্ট ট্রাস্ট বিল্ডার — অর্ডার হওয়া মাত্রই অটো-কনফার্মেশনে কাস্টমারের ভরসা জয়। [৫০৭]',
    ],
    cta:       'হারানো প্রফিট ফিরিয়ে আনুন',
    waInquiry: 'হ্যালো! রেভিনিউ রিকভারি সিস্টেম নিয়ে কথা বলতে চাই।',
  },
  {
    variant:   'obsidian',
    badge:     'ENTERPRISE SECURITY',
    serial:    '03',
    tag:       'জিরো রিটার্ন লস',
    name:      'প্রফিট সিকিউরিটি ইঞ্জিন',
    unit: '৳', amount: '৩৫,০০০', period: ' সেটআপ + ৳১২,০০০/মাস',
    setupNote: '*১০০% অটোমেটেড ওয়েবসাইট-নির্ভর ব্র্যান্ডের জন্য',
    value:     35000,
    bottomLine: 'ফেক অর্ডার এবং রিটার্ন লস আপনার মুনাফা আর নষ্ট করবে না। [৫২০]',
    features: [
      'অ্যান্টি-ফেক COD সিকিউরিটি — OTP ভেরিফিকেশনে রিটার্ন লস অর্ধেক কমিয়ে আনা। [৫২০]',
      'পরিত্যক্ত কার্ট রিকভারি — হারিয়ে যাওয়া চেকআউট থেকে অটোমেটেড রেভিনিউ জেনারেট। [৭৪৫]',
      'অমনিচ্যানেল AI ইকোসিস্টেম — FB, WA ও ওয়েবসাইট; সব কাস্টমার এক সেন্ট্রাল ইঞ্জিনে। [৫০৪]',
      'স্মার্ট ব্র্যান্ডেড অ্যালার্ট — SMS ও ইমেইল আপডেটে কাস্টমারকে প্রিমিয়াম ফিল দেওয়া। [৫০৯]',
    ],
    cta:       'বিজনেসের লস বন্ধ করুন',
    waInquiry: 'হ্যালো! প্রফিট সিকিউরিটি ইঞ্জিন নিয়ে কথা বলতে চাই।',
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
