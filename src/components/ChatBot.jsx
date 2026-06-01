import React, { useEffect } from 'react';
import { trackSectionView, trackChatbotOpen } from '../utils/tracking.js';
import { IconDoubleTick } from './Icons.jsx';
import { botHref, MSG } from '../utils/contact.js';

const BOT_HREF = botHref(MSG.BOT_TRY);

const PROOF_CHIPS = [
  { text: '২ সেকেন্ডে রেসপন্স' },
  { text: 'পুরো বাংলায় কথা বলে' },
  { text: 'লিড কোয়ালিফাই করে' },
];

const HOW_STEPS = [
  { n: '01', title: 'বাটনে ক্লিক করুন',           desc: 'WhatsApp খুলবে। Bot সরাসরি কথা শুরু করবে।' },
  { n: '02', title: 'যা ইচ্ছা প্রশ্ন করুন',         desc: 'সার্ভিস, প্রাইস, প্রসেস। Text বা voice note, যেভাবে comfortable।' },
  { n: '03', title: 'সলিউশন পান এবং ডিসাইড করুন', desc: 'পছন্দ হলে আপনার ব্যবসার জন্য একই bot বানিয়ে নিন।' },
];

export default function ChatBot() {
  useEffect(() => {
    const cleanup = trackSectionView('chatbot', { content_category: 'ai_demo' });
    return cleanup;
  }, []);

  return (
    <section className="section section--dark" id="chatbot" aria-labelledby="chatbot-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৪ · AI Sales Engine</div>

        <div className="chatbot-frame">
          <h2 id="chatbot-h2" className="section-h2 cb-h2">
            রিপ্লাই দিতে দেরি হলে<br />
            <em>কাস্টমার</em> অন্য পেজ থেকে কিনে ফেলে?
          </h2>

          <p className="cb-lede">
            AI সেলস মেশিন। কাস্টমারের মুড বুঝে বাংলায় রিপ্লাই দেয়।<br />
            বিশ্বাস হচ্ছে না? চ্যাট করে দেখুন।
          </p>

          {/* Pulsing avatar */}
          <div className="cb-avatar-wrap" aria-hidden>
            <div className="cb-splash-ring" />
            <div className="cb-splash-ring" />
            <div className="cb-avatar">D</div>
          </div>

          {/* Live chat preview, mirrors BotLanding hero */}
          <div
            className="bl-chat-preview"
            role="img"
            aria-label="বটের লাইভ চ্যাট প্রিভিউ। কাস্টমারের প্রশ্নের বাংলায় ইনস্ট্যান্ট উত্তর দিয়ে সেল ক্লোজ করছে।"
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
                <span>হ্যাঁ। ঢাকায় ৩ ঘণ্টায়, ঢাকার বাইরে পরদিন। Cash on Delivery এবং bKash দুটোই চলে। আপনার এরিয়াটা জানালে কনফার্ম করি।</span>
                <span className="bl-chat-time">2:14 PM<IconDoubleTick /></span>
              </div>
              <div className="bl-chat-msg bl-chat-msg--user">
                <span>মিরপুর ১০</span>
                <span className="bl-chat-time">2:15 PM</span>
              </div>
              <div className="bl-chat-msg bl-chat-msg--bot">
                <span>মিরপুর এ আজই ৩ ঘণ্টায় পৌঁছে দিচ্ছি। অর্ডার করতে নাম এবং ফোন নাম্বার দিন, আমি confirm করে দিচ্ছি।</span>
                <span className="bl-chat-time">2:15 PM<IconDoubleTick /></span>
              </div>
            </div>

            <div className="bl-chat-typing" aria-hidden>
              <span className="bl-chat-typing-dot" />
              <span className="bl-chat-typing-dot" />
              <span className="bl-chat-typing-dot" />
            </div>
          </div>

          {/* CTA button. Bot WhatsApp number. */}
          <a
            className="btn-primary cb-try-btn"
            href={BOT_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackChatbotOpen('chatbot_section')}
            aria-label="WhatsApp এ Digi AI Bot চালু করুন"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Bot ট্রাই করুন
          </a>

          {/* Proof chips */}
          <div className="cb-chips">
            {PROOF_CHIPS.map((p) => (
              <div key={p.text} className="cb-proof-chip">{p.text}</div>
            ))}
          </div>

          {/* How it works */}
          <div className="cb-how">
            <div className="cb-how-tag">// কীভাবে কাজ করে</div>
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

          <p className="cb-foot">Self hosted WhatsApp Bot · Digitalizen কাস্টম ট্রেইনড</p>
        </div>
      </div>
    </section>
  );
}
