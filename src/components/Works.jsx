import React from 'react';
import { IconWhatsApp } from './Icons.jsx';

/* ── Data ─────────────────────────────────────────────────────── */
const WORKS = [
  { id: '001', name: 'DhakaTeez',  status: 'Live', delay: 0,   img: '/images/dhakateez.webp',  url: null },
  { id: '002', name: 'Auora',      status: 'Live', delay: 0.6, img: '/images/auora.webp',       url: null },
  { id: '003', name: 'GARMENTIK',  status: 'Live', delay: 1.2, img: '/images/garmentik.webp',   url: null },
  { id: '004', name: 'Resto',      status: 'Live', delay: 1.8, img: '/images/resto.webp',       url: null },
];

export default function Works() {
  return (
    <section className="section" id="works" aria-labelledby="works-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৩ — আমাদের কাজ</div>
        <h2 id="works-h2" className="section-h2">
          ল্যান্ডিং পেজ<br /><em>যেগুলো বিক্রি করে</em>
        </h2>
        <p className="section-sub">
          ১ সেকেন্ড দেরি = ২০% কনভার্সন হারানো।
          আমাদের প্রতিটি পেজ sub-1s লোড হয়।
        </p>

        <div className="works-grid">
          {WORKS.map((w) => {
            const CardEl    = w.url ? 'a' : 'div';
            const cardProps = w.url
              ? { href: w.url, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <CardEl
                key={w.id}
                className={`work-card${w.url ? '' : ' work-card--no-link'}`}
                aria-label={`${w.name}, ${w.status}`}
                {...cardProps}
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
              </CardEl>
            );
          })}

          <div className="work-cta-card">
            <div>
              <div className="work-cta-label">// NEXT</div>
              <div className="work-cta-h">
                আপনার<br />পরবর্তী<br /><em>প্রজেক্ট?</em>
              </div>
            </div>
            <button
              className="gl-ask-btn"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <IconWhatsApp width={15} height={15} />
              আজই শুরু করি
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
