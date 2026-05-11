import React, { useEffect } from 'react';
import { trackSectionView, trackChatbotOpen } from '../utils/tracking.js';

/*
 * ─── WHATSAPP BOT CONFIG ────────────────────────────────────────────────────
 * Opens a wa.me deep-link to your self-hosted bot number.
 * Any real bot backend (Meta Cloud API or unofficial) works here —
 * no changes to this component needed once the backend is live.
 * ────────────────────────────────────────────────────────────────────────────
 */
const WA_NUMBER  = '8801311773040';
const WA_MESSAGE = encodeURIComponent('হ্যালো! আমি Digitalizen-এর AI Bot-এ কথা বলতে চাই।');
const WA_HREF    = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

const PROOF_CHIPS = [
  { icon: '⚡', text: '২ সেকেন্ডে রেসপন্স' },
  { icon: '🇧🇩', text: 'পুরো বাংলায় কথা বলে' },
  { icon: '🎯', text: 'লিড কোয়ালিফাই করে' },
];

const HOW_STEPS = [
  { n: '01', title: 'বাটনে ক্লিক করুন',  desc: 'WhatsApp-এ Digi AI-র সাথে সরাসরি চ্যাট শুরু হয়।' },
  { n: '02', title: 'আপনার সমস্যা বলুন', desc: 'Meta Ads, ওয়েবসাইট, লিড — যা জানতে চান লিখুন।' },
  { n: '03', title: 'রিয়েল সলিউশন পান', desc: '২৪/৭ তাৎক্ষণিক উত্তর। পছন্দ হলে আপনার ব্র্যান্ডে নিয়ে নিন।' },
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

        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          gap: 'clamp(24px, 4vw, 40px)',
        }}>
          <h2 id="chatbot-h2" className="section-h2" style={{ marginBottom: 0 }}>
            আপনার কাস্টমার<br />
            <em>সেল ক্লোজ করুক</em><br />
            AI দিয়ে — ২৪/৭
          </h2>

          <p style={{
            fontSize: 'clamp(13px, 2.5vw, 15px)',
            color: 'var(--muted)', maxWidth: 480,
            lineHeight: 1.82, margin: 0,
          }}>
            রাত ৩টায় কাস্টমার এলেও সেল হয়।
            আমাদের WhatsApp AI Bot এখনই ট্রাই করুন —
            তারপর আপনার ব্র্যান্ডের জন্য বানিয়ে নিন।
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

          {/* Live status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px',
            border: '1px solid var(--border-a)',
            background: 'var(--accent-soft)',
            fontSize: 10, fontFamily: 'var(--mono)',
            color: 'var(--accent)', letterSpacing: '.1em', textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)',
              display: 'inline-block', flexShrink: 0,
            }} aria-hidden />
            Live · WhatsApp-এ সাথে সাথে উত্তর দেবে
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
            {/* WhatsApp SVG inline */}
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Bot ট্রাই করুন
          </a>

          <p style={{ fontSize: 10, color: 'var(--muted-2)', fontFamily: 'var(--mono)', margin: 0 }}>
            WhatsApp খুলবে · কোনো অ্যাপ বা লগইন লাগবে না
          </p>

          {/* Proof chips */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(148px, 1fr))',
            gap: 10, width: '100%', maxWidth: 520,
          }}>
            {PROOF_CHIPS.map((p) => (
              <div key={p.text} className="cb-proof-chip">
                <span style={{ fontSize: 16, flexShrink: 0 }}>{p.icon}</span>
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
