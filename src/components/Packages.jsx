import React, { useEffect } from 'react';
import { trackPricingCTA, trackSectionView } from '../utils/tracking.js';

/* ── Data (Service Cards + Bottom Banner Integrated) ─────────────────── */
const PACKAGES = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'AI Sales Assistant',
    name:    'AI & WhatsApp Sales Bot',
    unit: '৳', amount: '১২,০০০', period: '/মাস থেকে শুরু',
    setupNote: '*সেটআপ চার্জ আলোচনা সাপেক্ষে',
    value: 12000,
    route: '/bot',
    features: [
      'মানুষের সাহায্য ছাড়াই ২৪/৭ কাস্টমারদের ইনস্ট্যান্ট রিপ্লাই ও গাইডেন্স।',
      'Click-to-WhatsApp বিজ্ঞাপনের সাথে সরাসরি ও নিরবচ্ছিন্ন ইন্টিগ্রেশন।',
      'চ্যাটবটের ভেতরেই প্রোডাক্ট ক্যাটালগ প্রদর্শন, অর্ডার এবং বুকিং সিস্টেম।',
      'কাস্টমার ডাটাবেজ অটোমেশন এবং লিড জেনারেশন ট্র্যাকিং সুবিধা।',
    ],
    cta: 'লাইভ বট try করুন →',
  },
  {
    variant: 'electric',
    badge:   'HIGH CONVERSION',
    serial:  '02',
    tag:     'Web Development',
    name:    'Super-Fast Landing Page & Website',
    unit: '৳', amount: '২৫,০০০', period: '/মাস থেকে শুরু',
    setupNote: '*সেটআপ চার্জ আলোচনা সাপেক্ষে',
    value: 25000,
    features: [
      'সুপার-ফাস্ট লোডিং স্পিড এবং ১০০% মোবাইল-রেসপন্সিভ ইউনিক ডিজাইন।',
      'আধুনিক UI/UX ফানেল যা কাস্টমারের ট্রাস্ট ও সেলস বহুগুণ বাড়িয়ে দেয়।',
      'প্রোডাক্ট অর্ডার ফর্ম, বিকাশ/নগদ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন সুবিধা।',
      'এসইও ফ্রেন্ডলি কোডিং এবং সিকিউরড সার্ভার সেটআপ সাপোর্ট।',
    ],
    cta: 'পোর্টফোলিও দেখুন',
  },
  {
    variant: 'obsidian',
    badge:   'BEST ROI',
    serial:  '03',
    tag:     'Data Tracking & Ads',
    name:    'Advanced Data Tracking & Paid Ads',
    unit: '৳', amount: '৩৫,০০০', period: '/মাস থেকে শুরু',
    setupNote: '*সেটআপ চার্জ আলোচনা সাপেক্ষে',
    value: 35000,
    features: [
      'Meta Pixel এবং Google Analytics (GA4) এর নিখুঁত ফুল সেটআপ।',
      'iOS 14+ আপডেটের জন্য অ্যাডভান্সড সার্ভার-সাইড ট্র্যাকিং (CAPI)।',
      'ফেসবুক, ইনস্টাগ্রাম ও গুগলে সঠিক অডিয়েন্স টার্গেটেড ডাটা-ড্রিভেন অ্যাডস।',
      'কম খরচে সর্বোচ্চ কোয়ালিটি লিড এবং কন্টিনিউয়াস A/B টেস্টিং।',
    ],
    cta: 'ক্যাম্পেইন শুরু করুন',
  },
];

export default function Packages() {
  useEffect(() => {
    trackSectionView('pricing', { content_category: 'pricing' });
  }, []);

  const go = (plan) => {
    trackPricingCTA(plan.name, plan.value || 0);
    if (plan.route) {
      window.location.assign(plan.route);
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" id="pricing" aria-labelledby="pricing-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৬ — প্যাকেজ ও সার্ভিস</div>
        <h2 id="pricing-h2" className="section-h2">
          আমাদের প্রিমিয়াম<br /><em>সার্ভিস ও প্ল্যান</em>
        </h2>
        <p className="section-sub">
          আমরা আপনার ব্যবসাকে অটোমেট করতে এবং সেলস বহুগুণ বাড়িয়ে দিতে ওয়ান-স্টপ সলিউশন প্রদান করি।
        </p>

        {/* --- Service & Pricing Grid --- */}
        <div className="pk-grid">
          {PACKAGES.map((p) => (
            <article
              key={p.name}
              className={`pk-card pk-${p.variant}`}
              aria-label={`${p.name} — ${p.amount}${p.period}`}
            >
              {p.badge && <div className="pk-badge">{p.badge}</div>}
              <div className="pk-serial-row">
                <span className="pk-serial">{p.serial}</span>
                <span className="pk-tag">{p.tag}</span>
              </div>
              <div className="pk-name" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '10px 0' }}>
                {p.name}
              </div>
              
              <div className="pk-price-row">
                {p.unit && <span className="pk-unit">{p.unit}</span>}
                <span className="pk-amount">{p.amount}</span>
                <span className="pk-period">{p.period}</span>
              </div>

              {/* Setup Charge Discussion Note */}
              {p.setupNote && (
                <div className="pk-setup-note" style={{ fontSize: '0.85rem', color: '#ffb703', marginTop: '5px', fontStyle: 'italic' }}>
                  {p.setupNote}
                </div>
              )}

              <ul className="pk-features" style={{ marginTop: '20px' }}>
                {p.features.map((f) => (
                  <li key={f}>
                    <span className="pk-dot" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              
              <button className="pk-btn" onClick={() => go(p)} style={{ marginTop: 'auto' }}>
                <span>{p.cta}</span>
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>

        {/* --- Bottom Banner / Closing Section --- */}
        <div className="bottom-banner">
          <h3 className="bottom-banner-title">
            "আপনার কি শুধু একটি ওয়েবসাইট দরকার, নাকি পুরো সেলস মেশিন?"
          </h3>
          <p className="bottom-banner-sub">
            আমরা শুধু অ্যাড রান করি না বা চ্যাটবট বানাই না; আমরা আপনার পুরো বিজনেসকে অটোমেট করি, যাতে আপনি ঘুমালেও আপনার ব্যবসা সচল থাকে।
          </p>
          <button 
            className="pk-btn bottom-banner-btn" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>ফ্রি কনসালটেশন বুক করুন</span>
            <span aria-hidden>→</span>
          </button>
        </div>

      </div>
    </section>
  );
}