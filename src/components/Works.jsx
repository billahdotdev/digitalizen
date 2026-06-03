import React from 'react';
import { IconWhatsApp, IconExternal, IconGithub } from './Icons.jsx';
import { generalHref, MSG, PROJECT_LINKS } from '../utils/contact.js';
import { trackLivePreview, trackCTA } from '../utils/tracking.js';

/* ── Data ─────────────────────────────────────────────────────── */
const WORKS = [
  { id: '001', name: 'DhakaTeez',  status: 'Live', delay: 0,   img: '/images/dhakateez.webp', live: PROJECT_LINKS.dhakateez },
  { id: '002', name: 'Auora',      status: 'Live', delay: 0.6, img: '/images/auora.webp',     live: PROJECT_LINKS.auora     },
  { id: '003', name: 'GARMENTIK',  status: 'Live', delay: 1.2, img: '/images/garmentik.webp', live: PROJECT_LINKS.garmentik },
  { id: '004', name: 'Resto',      status: 'Live', delay: 1.8, img: '/images/resto.webp',     live: PROJECT_LINKS.resto     },
];

const CONTACT_HREF = generalHref(MSG.CONSULT);

export default function Works() {
  return (
    <section className="section" id="works" aria-labelledby="works-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৩ ইঞ্জিনিয়ারড গ্রোথ ইনফ্রাস্ট্রাকচার</div>
        <h2 id="works-h2" className="section-h2">
          ল্যান্ডিং পেজ<br /><em>আপনার ২৪/৭ সেলস ইঞ্জিন</em>
        </h2>
        <p className="section-sub">
          ১ সেকেন্ড দেরি মানে ২০% কনভার্সন হারানো।<br />
          আমাদের প্রতিটি পেজ ১ সেকেন্ডে লোড হয়।
        </p>

        <div className="works-grid">
          {WORKS.map((w) => (
            <article
              key={w.id}
              className="work-card"
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
                <div className="work-scan" style={{ animationDelay: `${w.delay}s` }} aria-hidden />
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

              {/* Sharp corner Live Preview button per design system. */}
              <a
                className="work-live-btn"
                href={w.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackLivePreview(w.name)}
                aria-label={`${w.name}, Live Preview দেখুন GitHub এ`}
              >
                <IconGithub />
                <span>Live Preview</span>
                <IconExternal />
              </a>
            </article>
          ))}

          <div className="work-cta-card">
            <div>
              <div className="work-cta-label">// NEXT</div>
              <div className="work-cta-h">
                আপনার<br />পরবর্তী<br /><em>প্রজেক্ট?</em>
              </div>
            </div>
            <a
              className="gl-ask-btn"
              href={CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTA('আজই শুরু করি', 'works')}
            >
              <IconWhatsApp width={15} height={15} />
              আজই শুরু করি
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
