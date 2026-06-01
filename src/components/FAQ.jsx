import React, { useState } from 'react';

/* ── Data ─────────────────────────────────────────────────────────────
   13 questions covering pricing, ROI timeline, contract terms, iOS
   tracking, payment, security, ownership, hiring path, bot training,
   integrations, support, scale, ongoing maintenance.                  */
const FAQS = [
  {
    q: 'শুরু করতে কত টাকা লাগবে?',
    a: 'একদম ফ্রিতে শুরু করতে পারেন মাইক্রো টেস্ট দিয়ে। মান্থলি কেয়ার শুরু হয় মাত্র ৳১২,০০০ থেকে। কোনো আপফ্রন্ট নেই।',
  },
  {
    q: 'ফলাফল পেতে কতদিন লাগে?',
    a: 'প্রথম ৭ দিনে প্রাথমিক ডেটা দেখা যায়। ৪ থেকে ৬ সপ্তাহে ROAS সর্বোচ্চ পর্যায়ে পৌঁছায়।',
  },
  {
    q: 'চুক্তি বা লক ইন আছে কি?',
    a: 'না। কোনো দীর্ঘমেয়াদি চুক্তি নেই। রেজাল্ট দেখে সন্তুষ্ট হলে চালিয়ে যাবেন, না হলে যাবেন।',
  },
  {
    q: 'iPhone ইউজাররা কেন track হয় না? ঠিক করতে পারেন?',
    a: 'iOS ১৪+ আপডেটের পর সাধারণ ট্র্যাকিং কাজ করে না। তাই বেশিরভাগ এজেন্সির ক্যাম্পেইনে ডেটা হারিয়ে যায়। আমরা Server side ট্র্যাকিং engineer করি যা iPhone এও কাজ করে। ফলাফল, কাস্টমার data হারায় না, অ্যাড targeting আরও নিখুঁত হয়।',
  },
  {
    q: 'বিকাশ বা নগদে পেমেন্ট হয় কি?',
    a: 'হ্যাঁ। বিকাশ, নগদ, ব্যাংক ট্রান্সফার, সব পদ্ধতিতে পেমেন্ট করা যায়। বড় প্রজেক্টে ৩ কিস্তিতে দেওয়ার সুযোগ আছে।',
  },
  {
    q: 'AI বট কোন কোন ভাষায় কথা বলতে পারে?',
    a: 'বট পুরো বাংলায় কথা বলে। Banglish, English, voice note, সব বোঝে। আপনার product, প্রাইস, FAQ, return পলিসি, সব বটকে শেখানো থাকে যাতে কাস্টমার বুঝবেই না সে বটের সাথে কথা বলছে।',
  },
  {
    q: 'আমার ডেটা কি নিরাপদ থাকবে?',
    a: 'হ্যাঁ। আপনার ফোন নম্বর SHA 256 হ্যাশিং দিয়ে সুরক্ষিত রাখা হয়। সকল যোগাযোগ HTTPS এ এনক্রিপ্টেড। আপনার কাস্টমার ডেটাবেজ থাকে আপনার নিজস্ব system এ, তৃতীয় পক্ষের কাছে বিক্রি হয় না।',
  },
  {
    q: 'বট দিনে কতজন কাস্টমারকে handle করতে পারে?',
    a: 'WhatsApp Business API এ সীমা নেই। দিনে হাজার হাজার কথোপকথন সামলাতে পারে। আপনার বিজনেস স্কেল করলেও বটকে আবার সেটআপ করতে হবে না।',
  },
  {
    q: 'বট না বুঝলে কী হবে?',
    a: 'জটিল প্রশ্ন এলে বট আপনাকে notify করে। আপনি এক ক্লিকে চ্যাটে ঢুকে কথা বলতে পারবেন, বট তখন সরে যাবে। কথা শেষ হলে আবার বট দায়িত্ব নেয়।',
  },
  {
    q: 'বর্তমান ওয়েবসাইট এবং পেজের সাথে integrate করা যাবে?',
    a: 'হ্যাঁ। Shopify, WooCommerce, Wix, Facebook পেজ, Instagram, এমনকি কাস্টম PHP সাইট, সব জায়গায় বসানো যায়। Meta Ads, Google Ads, n8n, Grafana, সব টুলের সাথে নিরবিচ্ছিন্ন কাজ করে।',
  },
  {
    q: 'প্রজেক্ট ডেলিভারির পরে কে maintain করবে?',
    a: 'প্রথম ৩০ দিন আমরা ফ্রি মেইনটেইন করি। তারপর মান্থলি কেয়ার প্যাকেজে আপডেট, মনিটরিং, A/B টেস্ট, সব কভার করা হয়। চাইলে আপনার নিজের টিমকে handover ও সম্ভব।',
  },
  {
    q: 'ক্যাম্পেইনের ফলাফল কোথায় দেখব?',
    a: 'Real time dashboard পাবেন। ROAS, খরচ, কনভার্সন, কাস্টমার সোর্স, সব live update হয়। মোবাইলে এবং ডেস্কটপে সমান ভিউ। কোনো জটিল রিপোর্ট পড়তে হবে না।',
  },
  {
    q: 'প্রথমে শুধু কনসালটেশন নিতে পারি?',
    a: 'অবশ্যই। ৩০ মিনিটের ফ্রি কনসালটেশন কলে আপনার বিজনেসের ডিজিটাল গ্যাপ দেখি। কোনো বিক্রির চাপ নেই। সিদ্ধান্ত পরে নেবেন।',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(-1);

  return (
    <section className="section" id="faq" aria-labelledby="faq-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৭ · সাধারণ প্রশ্ন</div>
        <h2 id="faq-h2" className="section-h2">যা জানতে চান</h2>
        <p className="section-sub">
          এখনো প্রশ্ন আছে? নিচে WhatsApp এ সরাসরি জিজ্ঞেস করুন,<br />
          ২৪ ঘণ্টার মধ্যে উত্তর পাবেন।
        </p>

        <div className="faq-list" role="list">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`} role="listitem">
                <button
                  className="faq-btn"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-btn-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className="faq-q">{f.q}</span>
                  <span className="faq-icon" aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d={isOpen ? 'M2 7h10' : 'M7 2v10M2 7h10'}
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className={`faq-body${isOpen ? ' faq-body--open' : ''}`}
                  aria-hidden={!isOpen}
                >
                  <div className="faq-body-inner">{f.a}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
