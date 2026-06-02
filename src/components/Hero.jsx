import React, { useEffect, useRef } from 'react';
import { IconWhatsApp, IconBot, IconArrowDown } from './Icons.jsx';
import { trackCTA, trackSectionView, trackChatbotOpen } from '../utils/tracking.js';
import { generalHref, botHref, MSG } from '../utils/contact.js';

/* ── Data ─────────────────────────────────────────────────────── */
const PROOF = [
  { val: '৯',  em: '+',         label: 'বছরের অভিজ্ঞতা' },
  { val: '৩',  em: 'X',         label: 'গড় ROAS' },
  { val: '১',  em: 'সেকেন্ডে', label: 'পেজ লোড' },
];

const CONSULT_HREF = generalHref(MSG.AUDIT);
const BOT_HREF     = botHref(MSG.BOT_TRY);

export default function Hero() {
  const gridRef = useRef(null);

  useEffect(() => trackSectionView('top', { content_category: 'hero' }), []);

  /* Parallax grid. Desktop only. RAF throttled, no layout thrash. */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

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

  /* Open the bot WhatsApp directly, but also smooth scroll to the live
     preview section so users with the link blocked can still see it.   */
  const onBotClick = () => {
    trackCTA('AI Bot দেখুন', 'hero');
    trackChatbotOpen('hero_ai_moderator');
    setTimeout(() => {
      document.getElementById('chatbot')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  return (
    <section className="hero" id="top" aria-labelledby="hero-h1">
      <div className="hero-grid" ref={gridRef} aria-hidden="true" />
      <div className="hero-orb" aria-hidden="true" />

      <div className="hero-content">
        <div className="badge fade-up" style={{ '--d': '0ms' }}>
          <span className="badge-dot" aria-hidden />
           ২০২৬ সালের টেকনিক্যাল মার্কেটিং ইনফ্রাস্ট্রাকচার
        </div>

        <h1 id="hero-h1" className="hero-h1 fade-up" style={{ '--d': '80ms' }}>
          বিজ্ঞাপনে টাকা পোড়ানো বন্ধ করুন,<br />
          <em>Automated Revenue Engine</em><br />
           তৈরি করুন।
        </h1>

        <p className="hero-sub fade-up" style={{ '--d': '160ms' }}>
          ১ সেকেন্ডের দেরি মানেই ২০% কাস্টমার হারানো। 
          আমরা আপনার ব্যবসার জন্য এমন এক 'ডিজিটাল ব্রেইন' ইঞ্জিনিয়ার করি, 
          যা ২৪/৭ কাস্টমারের মুড বুঝে বাংলায় চ্যাট করে, ডেটা কালেক্ট করে, সেল করে !
        </p>

        <div className="hero-actions fade-up" style={{ '--d': '240ms' }}>
          <a
            className="btn-primary"
            href={CONSULT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA('ফ্রি কনসালটেশন', 'hero')}
            aria-label="WhatsApp এ ফ্রি কনসালটেশন বুক করুন"
          >
            <IconWhatsApp width={16} height={16} />
            ফ্রি রেভিনিউ অডিট বুক করুন
          </a>
          <a
            className="btn-ghost btn-ai-moderator"
            href={BOT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onBotClick}
            aria-label="AI মডারেটর লাইভ দেখুন, WhatsApp খুলবে"
          >
            <IconBot width={16} height={16} />
            AI মডারেটরের স্মার্টনেস টেস্ট করুন!
            <IconArrowDown width={12} height={12} />
          </a>
        </div>

        <div className="trust-strip fade-up" style={{ '--d': '320ms' }}>
          <span className="trust-dot" aria-hidden />
          কোনো বাধ্যবাধকতা নেই। আমরা শুধু সার্ভিস
          সেল করি না, ১০০% রেসপন্সিবিলিটি নিয়ে কাজ করি।
        </div>

        <div className="hero-proof fade-up" style={{ '--d': '400ms' }} role="list" aria-label="Key stats">
          {PROOF.map((p, i) => (
            <React.Fragment key={p.label}>
              {i > 0 && <div className="hero-proof-sep" aria-hidden />}
              <div className="hero-proof-item" role="listitem">
                <div className="hero-proof-val">
                  {p.val}<em>{p.em}</em>
                </div>
                <div className="hero-proof-lbl">{p.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
