import React from 'react';
import { IconCheck, IconWhatsApp } from './Icons.jsx';

/* ── Data ─────────────────────────────────────────────────────── */
const SERVICES = [
  { label: '১ সেকেন্ডে লোড হবে পেজ',     sub: 'Vite + React · zero CLS'                    },
  { label: 'প্রতিটা টাকার ট্র্যাকিং',        sub: 'iOS-proof · Server-side · GA4'              },
  { label: 'লিড এলেই সাথে সাথে alert',    sub: 'Auto-flow · ২৪/৭'                            },
  { label: 'Real-time রেজাল্ট Dashboard',  sub: 'খরচ ও বিক্রির হিসাব live'                    },
  { label: 'বাংলায় কথা বলা AI Bot',        sub: '২ সেকেন্ডে reply · custom-trained'           },
  { label: 'Meta অ্যাড ম্যানেজমেন্ট',     sub: 'ঢাকা precision targeting · max ROAS'         },
];

const FOUNDER = {
  initials: 'MB',
  role:     'Founder & Rainmaker',
  name:     'Masum Billah',
  bio:      '৯+ বছর ধরে সাধারণ ব্যবসাগুলোকে ব্র্যান্ডে রূপ দিচ্ছি। অ্যাড, ওয়েবসাইট, AI বট, ট্র্যাকিং — পুরো সেলস ইঞ্জিনটা একা হাতে গড়ি, যাতে আপনাকে ১০ জনের সাথে কথা বলতে না হয়।',
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
          <em>Brand Engineering Studio</em>
        </h2>
        <p className="section-sub">
          সাধারণ এজেন্সি অ্যাড চালায়। আমরা সাধারণ ব্যবসাকে ব্র্যান্ডে engineer করি —
          যেখানে কাস্টমার নিজেই আসে, প্রতিটা টাকার হিসাব থাকে।
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
