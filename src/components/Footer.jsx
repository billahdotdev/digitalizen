import React, { useState, useEffect, useCallback } from 'react';

/* ── Data (previously in src/data/content.js) ─────────────────── */
const BRAND = {
  name:     'digitalizen',
  tagline:  'আপনার ডিজিটাল গ্রোথ পার্টনার।',
  city:     'Dhaka, Bangladesh',
  whatsapp: '8801311773040',
};

const FOOTER_NAV = [
  {
    title: '// নেভিগেশন',
    links: [
      { label: 'হোম',          id: 'top'      },
      { label: 'সার্ভিস',      id: 'services' },
      { label: 'আমাদের কাজ',   id: 'works'    },
      { label: 'প্যাকেজ',      id: 'pricing'  },
      { label: 'যোগাযোগ',      id: 'contact'  },
    ],
  },
  {
    title: '// সার্ভিস',
    links: [
      { label: 'Meta Ads + CAPI',   id: 'services' },
      { label: 'n8n Automation',    id: 'services' },
      { label: 'Landing Page',      id: 'works'    },
      { label: 'Grafana Dashboard', id: 'chatbot'  },
      { label: 'AI Chatbot',        id: 'chatbot'  },
    ],
  },
];

/* ── Social SVG icons ─────────────────────────────────────────── */
const SocialIcons = {
  Facebook: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  ),
  Instagram: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  LinkedIn: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  WhatsApp: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  YouTube: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58a2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#060d1a"/>
    </svg>
  ),
};

const SOCIALS = [
  { name: 'Facebook',  href: 'https://facebook.com/digitalizen.bd',      Icon: SocialIcons.Facebook  },
  { name: 'Instagram', href: 'https://instagram.com/digitalizen.bd',     Icon: SocialIcons.Instagram },
  { name: 'LinkedIn',  href: 'https://linkedin.com/company/digitalizen', Icon: SocialIcons.LinkedIn  },
  { name: 'WhatsApp',  href: `https://wa.me/${BRAND.whatsapp}`,          Icon: SocialIcons.WhatsApp  },
  { name: 'YouTube',   href: 'https://youtube.com/@digitalizen',         Icon: SocialIcons.YouTube   },
];

/* ── Legal modal content ──────────────────────────────────────── */
const LEGAL = {
  প্রাইভেসি: {
    title: 'প্রাইভেসি পলিসি',
    body: `আপনার গোপনীয়তা আমাদের কাছে অত্যন্ত গুরুত্বপূর্ণ।

আমরা যা সংগ্রহ করি:
• আপনার নাম, ফোন নম্বর ও ব্র্যান্ডের নাম — শুধুমাত্র যোগাযোগের জন্য।
• ওয়েবসাইট ব্যবহারের তথ্য (Google Analytics ও Meta Pixel) — বিজ্ঞাপন অপ্টিমাইজেশনের জন্য।

আমরা যা করি না:
• আপনার তথ্য তৃতীয় পক্ষের কাছে বিক্রি করি না।
• আপনার অনুমতি ছাড়া মার্কেটিং বার্তা পাঠাই না।

ডেটা সুরক্ষা:
• আপনার ফোন নম্বর SHA-256 হ্যাশিং দিয়ে সুরক্ষিত রাখা হয়।
• সকল যোগাযোগ HTTPS-এ এনক্রিপ্টেড।

আপনার অধিকার:
যেকোনো সময় আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন। আমাদের WhatsApp-এ মেসেজ করুন।

শেষ আপডেট: জানুয়ারি ২০২৬`,
  },
  টার্মস: {
    title: 'সেবার শর্তাবলী',
    body: `Digitalizen-এর সেবা ব্যবহার করে আপনি নিচের শর্তগুলো মেনে নিচ্ছেন:

সেবার সুযোগ:
• আমরা Digital Marketing, Landing Page Development, AI Automation ও CAPI সেটআপ সেবা প্রদান করি।
• প্রতিটি প্রজেক্টের স্কোপ আলাদা চুক্তিতে নির্ধারিত হয়।

পেমেন্ট:
• সেবার মূল্য অগ্রিম বা কিস্তিতে পরিশোধযোগ্য।
• পেমেন্ট পদ্ধতি: বিকাশ, নগদ, ব্যাংক ট্রান্সফার।

মেধাস্বত্ব:
• আমাদের তৈরি করা ডিজাইন ও কোড সম্পূর্ণ পেমেন্টের পরে আপনার সম্পত্তি হবে।

দায়বদ্ধতা:
• আমরা সর্বোচ্চ চেষ্টা করি, তবে বিজ্ঞাপনের ফলাফল বাজারের উপর নির্ভরশীল।
• নির্দিষ্ট ROI গ্যারান্টি দেওয়া সম্ভব নয়।

শেষ আপডেট: জানুয়ারি ২০২৬`,
  },
  রিফান্ড: {
    title: 'রিফান্ড পলিসি',
    body: `আমরা আপনার সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিই।

রিফান্ডের যোগ্যতা:
• সেবা শুরুর ৭ দিনের মধ্যে আবেদন করলে সম্পূর্ণ রিফান্ড পাবেন।
• কাজ শুরু হওয়ার পরে আংশিক রিফান্ড বিবেচনা করা হবে।

রিফান্ড পাওয়া যাবে না:
• সম্পূর্ণ ডেলিভারি হওয়ার পরে।
• ক্লায়েন্টের তথ্য/সম্পদের অভাবে কাজ বিলম্বিত হলে।
• তৃতীয় পক্ষের টুল (Meta Ads বাজেট, হোস্টিং) এর খরচ।

রিফান্ড প্রক্রিয়া:
১. WhatsApp-এ যোগাযোগ করুন।
২. ৩ কার্যদিবসের মধ্যে আবেদন পর্যালোচনা করা হবে।
৩. অনুমোদনের পরে ৫-৭ কার্যদিবসে রিফান্ড।

যোগাযোগ: +880 1311-883040

শেষ আপডেট: জানুয়ারি ২০২৬`,
  },
};

/* ── Modal ────────────────────────────────────────────────────── */
function LegalModal({ type, onClose }) {
  const content = LEGAL[type];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="legal-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="legal-modal">
        <button
          className="legal-modal-x"
          onClick={onClose}
          aria-label="মডেল বন্ধ করুন"
        >
          ❌
        </button>

        <div className="legal-modal-tag">// Digitalizen</div>
        <h2 id="legal-modal-title" className="legal-modal-title">{content.title}</h2>

        <div className="legal-modal-body">
          {content.body.split('\n').map((line, i) =>
            line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
          )}
        </div>

        <button className="legal-modal-close-btn" onClick={onClose}>
          বুঝেছি ✓
        </button>
      </div>
    </div>
  );
}

/* ── Footer ───────────────────────────────────────────────────── */
export default function Footer() {
  const [modal, setModal] = useState(null);
  const closeModal = useCallback(() => setModal(null), []);

  const go = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer className="footer" aria-label="Footer">
        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand column */}
            <div className="footer-brand-col">
              <div className="footer-logo">{BRAND.name}<em>.</em></div>
              <p className="footer-tagline">{BRAND.tagline}<br />{BRAND.city}।</p>
              <div className="footer-accent-line" aria-hidden />

              <div className="footer-socials" aria-label="Social media links">
                {SOCIALS.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                    aria-label={`Digitalizen on ${name}`}
                    title={name}
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {FOOTER_NAV.map((col) => (
              <nav key={col.title} aria-label={col.title.replace(/\W/g, '')}>
                <div className="footer-col-title">{col.title}</div>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <button className="footer-link" onClick={() => go(l.id)}>
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">© 2026 Digitalizen. সর্বস্বত্ব সংরক্ষিত।</div>
            <div className="footer-legal">
              {['প্রাইভেসি', 'টার্মস', 'রিফান্ড'].map(l => (
                <button
                  key={l}
                  className="footer-legal-btn"
                  onClick={() => setModal(l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {modal && <LegalModal type={modal} onClose={closeModal} />}
    </>
  );
}
