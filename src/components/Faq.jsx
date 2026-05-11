import React, { useState } from 'react';

/* ── Data (previously in src/data/content.js) ─────────────────── */
const FAQS = [
  {
    q: 'শুরু করতে কত টাকা লাগবে?',
    a: 'একদম ফ্রিতে শুরু করতে পারেন মাইক্রো টেস্ট দিয়ে। মান্থলি কেয়ার শুরু হয় মাত্র ৳১০,০০০ থেকে — কোনো আপফ্রন্ট নেই।',
  },
  {
    q: 'ফলাফল পেতে কতদিন লাগে?',
    a: 'প্রথম ৭ দিনে প্রাথমিক ডেটা দেখা যায়। ৪–৬ সপ্তাহে ROAS সর্বোচ্চ পর্যায়ে পৌঁছায়।',
  },
  {
    q: 'চুক্তি বা লক-ইন আছে কি?',
    a: 'না। কোনো দীর্ঘমেয়াদি চুক্তি নেই। রেজাল্ট দেখে সন্তুষ্ট হলে চালিয়ে যাবেন, না হলে যাবেন।',
  },
  {
    q: 'CAPI আর সাধারণ Pixel-এর পার্থক্য কী?',
    a: 'Browser Pixel iOS-এ block হয়। Server-side CAPI সরাসরি Meta সার্ভারে ডেটা পাঠায় — কোনো ডেটা হারায় না, targeting আরও ভালো হয়।',
  },
  {
    q: 'বিকাশ বা নগদে পেমেন্ট হয় কি?',
    a: 'হ্যাঁ। বিকাশ, নগদ, ব্যাংক ট্রান্সফার — সব পদ্ধতিতে পেমেন্ট করা যায়।',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(-1);

  return (
    <section className="section" id="faq" aria-labelledby="faq-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৭ — সাধারণ প্রশ্ন</div>
        <h2 id="faq-h2" className="section-h2">যা জানতে চান</h2>

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
