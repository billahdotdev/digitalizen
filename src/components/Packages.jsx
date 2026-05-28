import React, { useEffect } from 'react';
import { trackPricingCTA, trackSectionView } from '../utils/tracking.js';

/* ── Data (Service Cards + Bottom Banner Integrated) ─────────────────── */
const PACKAGES = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'AI & WhatsApp Bot',
    name:    'AI & WhatsApp Chatbot Development',
    unit: '', amount: '২৪/৭ সাপোর্ট', period: ' · অটোমেটেড সেলস',
    value: 0,
    features: [
      'মানুষের সাহায্য ছাড়াই ২৪/৭ ইনস্ট্যান্ট রিপ্লাই।',
      'Click-to-WhatsApp বিজ্ঞাপনের সরাসরি ইন্টিগ্রেশন।',
      'বটের ভেতরেই ক্যাটালগ, অর্ডার এবং বুকিং সিস্টেম।',
      'শর্ট ডেসক্রিপশন: ইন্টেলিজেন্ট চ্যাটবট সলিউশন।',
    ],
    cta: 'ডেমো দেখুন 🚀',
  },
  {
    variant: 'electric',
    badge:   'BEST ROI',
    serial:  '02',
    tag:     'Web Development',
    name:    'Super-Fast Web & Landing Page',
    unit: '৳', amount: '১০,০০০', period: '/মাস',
    setupNote: '*সেটআপ চার্জ আলোচনা সাপেক্ষে (আপনার রিকোয়ারমেন্ট অনুযায়ী)',
    value: 10000,
    features: [
      'সুপার-ফাস্ট লোডিং স্পিড এবং মোবাইল-ফ্রেন্ডলি ডিজাইন।',
      'আধুনিক UX/UI যা কাস্টমারের বিশ্বাস বাড়ায়।',
      'Oracle ক্লাউড বা সিকিউরড সার্ভারে লাইফটাইম হোস্টিং সাপোর্ট।',
      'শর্ট ডেসক্রিপশন: হাই-কনভার্টিং এবং সুপার-ফাস্ট ওয়েবসাইট।',
    ],
    cta: 'পোর্টফোলিও দেখুন 🌐',
  },
  {
    variant: 'obsidian',
    serial:  '03',
    tag:     'Data Tracking & Paid Ads',
    name:    'Advance Data Tracking & Paid Ads',
    unit: '৳', amount: '৩০,০০০', period: '/মাস',
    setupNote: '*সেটআপ চার্জ আলোচনা সাপেক্ষে (কাস্টম ট্র্যাকিং ও ফানেল)',
    value: 30000,
    features: [
      'Facebook Pixel এবং Google Analytics (GA4) ফুল সেটআপ।',
      'iOS 14+ এর জন্য অ্যাডভান্সড সার্ভার-সাইড ট্র্যাকিং (CAPI)।',
      'ফেসবুক, ইনস্টাগ্রাম এবং গুগলে সঠিক অডিয়েন্স টার্গেটেড অ্যাড।',
      'কম খরচে (Low CPA) বেশি লিড ও ডাটা-ড্রিভেন A/B টেস্টিং।',
    ],
    cta: 'ক্যাম্পেইন শুরু করুন 🎯',
  },
];

export default function Packages() {
  useEffect(() => trackSectionView('pricing', { content_category: 'pricing' }), []);

  const go = (plan) => {
    trackPricingCTA(plan.name, plan.value || 0);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="section" id="pricing" aria-labelledby="pricing-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৬ — প্যাকেজ ও সার্ভিস</div>
        <h2 id="pricing-h2" className="section-h2">
          আমাদের প্রিমিয়াম<br /><em>সার্ভিস ও প্ল্যান</em>
        </h2>
        <p className="section-sub">আমরা আপনার ব্যবসাকে অটোমেট করতে এবং সেলস বহুগুণ বাড়িয়ে দিতে ওয়ান-স্টপ সリューション প্রদান করি।</p>

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
        <div className="bottom-banner" style={{ marginTop: '60px', padding: '40px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '15px', color: '#fff' }}>
            "আপনার কি শুধু একটি ওয়েবসাইট দরকার, নাকি পুরো সেলস মেশিন?"
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#ccc', maxWidth: '800px', margin: '0 auto 25px auto', lineHeight: '1.6' }}>
            আমরা শুধু অ্যাড রান করি না বা চ্যাটবট বানাই না; আমরা আপনার পুরো বিজনেসকে অটোমেট করি, যাতে আপনি ঘুমালেও আপনার ব্যবসা সচল থাকে।
          </p>
          <button 
            className="pk-btn" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '12px 30px', fontSize: '1.1rem', margin: '0 auto' }}
          >
            📞 ফ্রি কনসালটেশন বুক করুন
          </button>
        </div>

      </div>
    </section>
  );
}