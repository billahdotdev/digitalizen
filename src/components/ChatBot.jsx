import React, { useEffect } from 'react';
import { trackSectionView, trackChatbotOpen } from '../utils/tracking.js';

/* ── Config ──────────────────────────────────────────────────────────── */
const WA_NUMBER  = '8801311773040';
const WA_MESSAGE = encodeURIComponent('হ্যালো! আমি Digitalizen-এর AI Bot-এ কথা বলতে চাই।');
const WA_HREF    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

/* ── WhatsApp double-tick (read-receipt blue) ────────────────────────── */
const DoubleTick = () => (
  <svg
    viewBox="0 0 18 11"
    width="16" height="11"
    aria-hidden="true"
    style={{ color: '#53BDEB', verticalAlign: 'middle', marginInlineStart: 4, flexShrink: 0 }}
  >
    <path d="M11.5 1 L5.7 9.5 L2 6"  fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16   1 L10.2 9.5 L6.5 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Proof chips — no emoji ──────────────────────────────────────────── */
const PROOF_CHIPS = [
  { text: '২ সেকেন্ডে রেসপন্স' },
  { text: 'পুরো বাংলায় কথা বলে' },
  { text: 'লিড কোয়ালিফাই করে' },
];

/* ── How it works — aligned to BotLanding HOW ───────────────────────── */
const HOW_STEPS = [
  { n: '01', title: 'বাটনে ক্লিক করুন',          desc: 'WhatsApp খুলবে — bot সরাসরি কথা শুরু করবে।' },
  { n: '02', title: 'যা ইচ্ছা প্রশ্ন করুন',      desc: 'সার্ভিস, প্রাইস, প্রসেস — text বা voice note, যেভাবে comfortable।' },
  { n: '03', title: 'সলিউশন পান + ডিসাইড করুন', desc: 'পছন্দ হলে আপনার ব্যবসার জন্য একই bot বানিয়ে নিন।' },
];

export default function ChatBot() {
  useEffect(() => {
    const cleanup = trackSectionView('chatbot', { content_category: 'ai_demo' });
    return cleanup;
  }, []);

  return (
    <section className="section section--dark" id="chatbot" aria-labelledby="chatbot-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৪ — AI Sales Engine</div>

        <div className="chatbot-frame">

          {/* Heading */}
          <h2 id="chatbot-h2" className="section-h2" style={{ marginBottom: 0 }}>
            রিপ্লাই দিতে দেরি হলে<br />
            <em>কাস্টমার</em> অন্য পেজ থেকে কিনে ফেলে?
          </h2>

          <p style={{
            fontSize: 'clamp(13px, 2.5vw, 15px)',
            color: 'var(--muted)', maxWidth: 480,
            lineHeight: 1.82, margin: 0,
          }}>
            AI সেলস মেশিন! কাস্টমারের মুড বুঝে বাংলায় রিপ্লাই দেয়।
            বিশ্বাস হচ্ছে না? চ্যাট করে দেখুন!
          </p>

          {/* Pulsing avatar */}
          <div style={{ position: 'relative', width: 90, height: 90 }}>
            <div className="cb-splash-ring" />
            <div className="cb-splash-ring" />
            <div style={{
              position: 'relative', zIndex: 1,
              width: 90, height: 90, borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '2px solid var(--border-a2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 34, fontWeight: 800,
              color: 'var(--accent)', fontFamily: 'var(--mono)',
            }}>D</div>
          </div>

          

          {/* Live chat preview — mirrors BotLanding hero */}
          <div
            className="bl-chat-preview"
            role="img"
            aria-label="বটের লাইভ চ্যাট প্রিভিউ — কাস্টমারের প্রশ্নের বাংলায় ইনস্ট্যান্ট উত্তর দিয়ে সেল ক্লোজ করছে"
            style={{ width: '100%', maxWidth: 480 }}
          >
            <div className="bl-chat-head">
              <div className="bl-chat-head-icon" aria-hidden>
                AI
                <span className="bl-chat-head-dot" />
              </div>
              <div className="bl-chat-head-meta">
                <strong>Digitalizen AI</strong>
                <span><span className="bl-chat-live" aria-hidden /> অনলাইন · বাংলায় রিপ্লাই দিচ্ছে</span>
              </div>
            </div>

            <div className="bl-chat-body" aria-hidden>
              <div className="bl-chat-msg bl-chat-msg--user">
                <span>২৪/৭ ডেলিভারি দেন?</span>
                <span className="bl-chat-time">2:14 PM</span>
              </div>
              <div className="bl-chat-msg bl-chat-msg--bot">
                <span>হ্যাঁ। ঢাকায় ৩ ঘণ্টায়, ঢাকার বাইরে পরদিন। Cash on Delivery + bKash দুটোই চলে। আপনার এরিয়াটা জানালে কনফার্ম করি।</span>
                <span className="bl-chat-time">2:14 PM<DoubleTick /></span>
              </div>
              <div className="bl-chat-msg bl-chat-msg--user">
                <span>মিরপুর-১০</span>
                <span className="bl-chat-time">2:15 PM</span>
              </div>
              <div className="bl-chat-msg bl-chat-msg--bot">
                <span>মিরপুর-এ আজই ৩ ঘণ্টায় পৌঁছে দিচ্ছি। অর্ডার করতে নাম + ফোন নাম্বার দিন, আমি confirm করে দিচ্ছি।</span>
                <span className="bl-chat-time">2:15 PM<DoubleTick /></span>
              </div>
            </div>

            <div className="bl-chat-typing" aria-hidden>
              <span className="bl-chat-typing-dot" />
              <span className="bl-chat-typing-dot" />
              <span className="bl-chat-typing-dot" />
            </div>
          </div>

          {/* CTA button */}
          <a
            className="btn-primary cb-try-btn"
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackChatbotOpen('chatbot_section')}
            aria-label="WhatsApp-এ Digi AI Bot চালু করুন"
            style={{
              fontSize: 'clamp(15px, 4vw, 17px)',
              padding: 'clamp(16px, 3vw, 20px) clamp(36px, 8vw, 64px)',
              letterSpacing: '.05em', minHeight: 60,
              display: 'inline-flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              textDecoration: 'none',
            }}
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Bot ট্রাই করুন
          </a>

          {/* Proof chips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))',
            gap: 10, width: '100%', maxWidth: 520,
          }}>
            {PROOF_CHIPS.map((p) => (
              <div key={p.text} className="cb-proof-chip">
                {p.text}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{
            width: '100%', maxWidth: 520,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            padding: '4px 20px',
            textAlign: 'left',
          }}>
            <div style={{
              fontSize: 9, color: 'var(--accent)', fontFamily: 'var(--mono)',
              letterSpacing: '.14em', textTransform: 'uppercase',
              fontWeight: 700, padding: '14px 0 8px',
            }}>// কীভাবে কাজ করে</div>

            {HOW_STEPS.map((s) => (
              <div key={s.n} className="cb-how-item">
                <div className="cb-how-num">{s.n}</div>
                <div>
                  <div className="cb-how-title">{s.title}</div>
                  <div className="cb-how-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--mono)', margin: 0 }}>
            Self-hosted WhatsApp Bot · Digitalizen কাস্টম ট্রেইনড
          </p>

        </div>
      </div>
    </section>
  );
}
