import React from 'react';
import { IconCheck, IconWhatsApp } from './Icons.jsx';

/* ── Data ─────────────────────────────────────────────────────── */
const SERVICES = [
  { label: 'সুপার-ফাস্ট ল্যান্ডিং পেজ', sub: 'sub-1s load · Vite + React · zero CLS'      },
  { label: '১০০% CAPI ট্র্যাকিং',       sub: 'Server-side · iOS-proof · GA4'               },
  { label: 'AI Automation (n8n)',        sub: 'Lead → Sheet · Telegram alert · 24/7'         },
  { label: 'Grafana Dashboard',          sub: 'Real-time ROAS · spend monitor'               },
  { label: 'AI Chatbot (Custom)',        sub: 'Lead qualify · 2s response · Bangla'          },
  { label: 'Meta Ads Management',        sub: 'Dhaka precision targeting · max ROAS'         },
];

const FOUNDER = {
  initials: 'MB',
  role:     'Founder & Rainmaker',
  name:     'Masum Billah',
  bio:      '৯+ বছর ধরে ব্র্যান্ডগুলোকে ডিজিটালে রেজাল্ট দিয়ে আসছি। Meta Ads থেকে শুরু করে পুরো Server-side Infrastructure — সব নিজেই করি।',
  creds:    [
    'AI & Automation, NINA-Korea',
    'Full Stack Dev, IAC-BUET Certified',
    'Marketing, AMA-Philippines',
    'Web Mastery — University of Helsinki',
  ],
};

const ROI = [
  { val: '৩x',   label: 'গড় ROAS'    },
  { val: '৫০+',  label: 'ক্লায়েন্ট' },
  { val: '২৪/৭', label: 'AI Active'  },
];

const WA_NUMBER  = '8801311773040';
const WA_MESSAGE = encodeURIComponent('হ্যালো! আমি ফ্রি অডিট বুক করতে চাই।');
const WA_HREF    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০১ — আমরা কী করি</div>
        <h2 id="services-h2" className="section-h2">
          বাংলাদেশের একমাত্র ওয়ান-টু-ওয়ান পার্সোনালাইজড<br />
          <em>Technical Marketing Agency</em>
        </h2>
        <p className="section-sub">
          সাধারণ এজেন্সি শুধু বুস্ট দেয়। আমরা পুরো ইনফ্রাস্ট্রাকচার বানাই 
          যেন আপনার বিজ্ঞাপনের প্রতিটি টাকা ট্র্যাক হয়, কাজ হয়।
        </p>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div key={s.label} className="service-card" style={{ '--i': i }}>
              <div className="service-tick" aria-hidden><IconCheck /></div>
              <div>
                <div className="service-label">{s.label}</div>
                <div className="service-sub">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <article className="founder-card" aria-label={`Founder: ${FOUNDER.name}`}>
          <header className="founder-head">
            <div className="avatar avatar--photo" aria-hidden>
              <img
                src="/images/masum.webp"
                alt={FOUNDER.name}
                width={52}
                height={52}
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <span className="avatar-fallback" style={{ display: 'none' }}>{FOUNDER.initials}</span>
            </div>
            <div>
              <div className="founder-role">{FOUNDER.role}</div>
              <div className="founder-name">{FOUNDER.name}</div>
            </div>
          </header>
          <div style={{ padding: '18px 24px' }}>
            <p className="founder-body" style={{ padding: 0, marginBottom: 14 }}>{FOUNDER.bio}</p>
            <div className="creds">
              {FOUNDER.creds.map((c) => <span key={c} className="cred">{c}</span>)}
            </div>
          </div>
        </article>

        <div className="roi-band" role="list" aria-label="ROI snapshot">
          {ROI.map((r) => (
            <div key={r.label} className="roi-cell" role="listitem">
              <div className="roi-val">{r.val}</div>
              <div className="roi-lbl">{r.label}</div>
            </div>
          ))}
        </div>

        <a
          className="btn-primary btn-full"
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', justifyContent: 'center', marginTop: 8 }}
        >
          <IconWhatsApp width={16} height={16} />
           ফ্রি অডিট বুক করুন
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
