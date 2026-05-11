import React, { useEffect, useRef } from 'react';
import { IconWhatsApp } from './Icons.jsx';
import { trackCTA, trackSectionView } from '../utils/tracking.js';

/* ── Data ─────────────────────────────────────────────────────── */
const PROOF = [
  { val: '৫০', em: '+', label: 'ক্লায়েন্ট'     },
  { val: '৯',  em: '+', label: 'বছরের\nঅভিজ্ঞতা' },
  { val: '৩',  em: 'x', label: 'গড় ROAS'        },
  { val: '১',  em: 's', label: 'পেজ লোড'         },
];

const WA_NUMBER  = '8801311773040';
const WA_MESSAGE = encodeURIComponent('হ্যালো! আমি ফ্রি অডিট বুক করতে চাই।');
const WA_HREF    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function Hero() {
  const gridRef = useRef(null);

  useEffect(() => trackSectionView('top', { content_category: 'hero' }), []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    /* Skip parallax on touch devices entirely — battery + jank cost
       outweighs decorative value on phones. matchMedia returns true
       on tablets/phones so they get static grid.                   */
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    /* RAF throttle: read clientX/Y eagerly, write transform once
       per animation frame. Prevents layout-thrashing on rapid moves. */
    let rafId = null;
    let nextX = 0, nextY = 0;

    const apply = () => {
      el.style.transform = `translate(${nextX}px, ${nextY}px)`;
      rafId = null;
    };
    const onMove = (e) => {
      nextX = (e.clientX / window.innerWidth  - 0.5) * 14;
      nextY = (e.clientY / window.innerHeight - 0.5) * 14;
      if (rafId === null) rafId = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="top" aria-labelledby="hero-h1">
      <div className="hero-grid" ref={gridRef} aria-hidden="true" />
      <div className="hero-orb" aria-hidden="true" />

      <div className="hero-content">
        <div className="badge fade-up" style={{ '--d': '0ms' }}>
          <span className="badge-dot" aria-hidden />
          ঢাকা থেকে · AI-Powered · Server-side Infra
        </div>

        <h1 id="hero-h1" className="hero-h1 fade-up" style={{ '--d': '80ms' }}>
          আমরা অ্যাড চালাই না।
          <br />
          <em>সেলস মেশিন</em>
          <br />
          তৈরি করি।
        </h1>

        <p className="hero-sub fade-up" style={{ '--d': '160ms' }}>
          বেশিরভাগ এজেন্সি শুধু বুস্ট দেয়। আমরা পুরো ডিজিটাল
          ইনফ্রাস্ট্রাকচার বানাই — যাতে প্রতিটি টাকার হিসাব থাকে।
        </p>

        <div className="hero-actions fade-up" style={{ '--d': '240ms' }}>
          <a
            className="btn-primary"
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('ফ্রি অডিট', 'hero')}
            aria-label="WhatsApp-এ ফ্রি অডিট বুক করুন"
            style={{ textDecoration: 'none' }}
          >
            <IconWhatsApp width={16} height={16} />
            ফ্রি অডিট বুক করুন
          </a>
          <button
            className="btn-ghost"
            onClick={() => { trackCTA('AI Bot দেখুন', 'hero'); scrollTo('chatbot'); }}
          >
            🤖 AI Bot লাইভ দেখুন ↓
          </button>
        </div>

        <div className="trust-strip fade-up" style={{ '--d': '320ms' }}>
          <span className="trust-dot" aria-hidden />
          কোনো লক-ইন নেই — রেজাল্ট দেখে সিদ্ধান্ত নিন
        </div>

        {/* Proof stats bar */}
        <div className="hero-proof fade-up" style={{ '--d': '400ms' }} role="list" aria-label="Key stats">
          {PROOF.map((p, i) => (
            <React.Fragment key={p.label}>
              {i > 0 && <div className="hero-proof-sep" aria-hidden />}
              <div className="hero-proof-item" role="listitem">
                <div className="hero-proof-val">
                  {p.val}<em>{p.em}</em>
                </div>
                <div className="hero-proof-lbl">{p.label.replace('\n', ' ')}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
