import React, { useEffect } from 'react';
import { trackPricingCTA, trackSectionView } from '../utils/tracking.js';

/* ── Data (previously in src/data/content.js) ─────────────────── */
const PACKAGES = [
  {
    variant: 'frosted',
    serial:  '01',
    tag:     'ফ্রি শুরু',
    name:    'মাইক্রো টেস্ট',
    unit: '', amount: 'ফ্রি', period: ' · একবার',
    value: 0,
    features: [
      'ফ্রি বিজনেস অডিট',
      'গ্রোথ রোডম্যাপ ২০২৬',
      'হাই-কনভার্টিং অ্যাড স্ট্র্যাটেজি',
      'কনটেন্ট আইডিয়া',
    ],
    cta: 'শুরু করুন',
  },
  {
    variant: 'electric',
    badge:   'BEST ROI',
    serial:  '02',
    tag:     'মার্কেটিং + ওয়েব',
    name:    'মান্থলি কেয়ার',
    unit: '৳', amount: '১০,০০০', period: '/মাস',
    value: 10000,
    features: [
      'AI সেলস ফানেল অটোমেশন',
      'ফ্রি আল্ট্রা-ফাস্ট ল্যান্ডিং পেজ',
      'CAPI + Pixel সেটআপ',
      'আনলিমিটেড অ্যাড ম্যানেজমেন্ট',
      'n8n Lead Automation',
    ],
    cta: 'প্রফিট আনলক করুন',
  },
  {
    variant: 'obsidian',
    serial:  '03',
    tag:     'মার্কেটে ডমিন্যান্স',
    name:    'ব্র্যান্ড কেয়ার',
    unit: '৳', amount: '৩০,০০০', period: '/মাস',
    value: 30000,
    features: [
      'Advanced Funnel + AI Chatbot',
      'Grafana Dashboard + Real-time Monitor',
      'AI Dominance · AEO · GEO',
      'CAPI + GA4 + TikTok Premium',
      'প্রিমিয়াম ব্র্যান্ড আইডেন্টিটি',
    ],
    cta: 'Authority হন',
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
        <div className="section-tag">// ০০৬ — প্যাকেজ</div>
        <h2 id="pricing-h2" className="section-h2">
          আপনার জন্য<br /><em>সঠিক প্ল্যান</em>
        </h2>
        <p className="section-sub">শুরু থেকে পূর্ণ মার্কেট ডমিন্যান্স পর্যন্ত।</p>

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
              <div className="pk-name">{p.name}</div>
              <div className="pk-price-row">
                {p.unit && <span className="pk-unit">{p.unit}</span>}
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
              <button className="pk-btn" onClick={() => go(p)}>
                <span>{p.cta}</span>
                <span aria-hidden>→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
