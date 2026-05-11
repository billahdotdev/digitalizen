import React, { useState } from 'react';

/* ── Data ─────────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '01', tag: 'AUDIT',  title: 'ফ্রি বিজনেস অডিট',
    desc: 'আপনার বর্তমান ডিজিটাল সেটআপ দেখি। কোথায় টাকা নষ্ট হচ্ছে, কোথায় সুযোগ — পরিষ্কার রোডম্যাপ দিই।',
  },
  {
    num: '02', tag: 'BUILD',  title: 'Infrastructure সেটআপ',
    desc: 'ল্যান্ডিং পেজ, CAPI, Pixel, n8n automation একসাথে। ভিত শক্ত না হলে বিজ্ঞাপন কাজ করে না।',
  },
  {
    num: '03', tag: 'LAUNCH', title: 'Campaign চালু ও অপ্টিমাইজ',
    desc: '৭ দিনে প্রাথমিক ডেটা। ৪–৬ সপ্তাহে ROAS সর্বোচ্চ পর্যায়ে। প্রতিটি সিদ্ধান্ত ডেটাভিত্তিক।',
  },
  {
    num: '04', tag: 'SCALE',  title: 'AI দিয়ে স্কেল',
    desc: 'Grafana-তে real-time মনিটর। AI automation ঘুমালেও কাজ করে। আপনি শুধু রেজাল্ট দেখুন।',
  },
];

const ICONS      = ['🔍', '🏗️', '🚀', '🤖'];
const STEP_GLOWS = [
  'rgba(80,200,120,.22)',
  'rgba(80,200,120,.18)',
  'rgba(80,200,120,.20)',
  'rgba(80,200,120,.24)',
];

export default function Process() {
  const [hovered, setHovered] = useState(null);
  const [active,  setActive]  = useState(null);

  const toggle = (i) => setActive(active === i ? null : i);

  return (
    <section className="section" id="process" aria-labelledby="process-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০২ — কীভাবে কাজ করি</div>
        <h2 id="process-h2" className="section-h2">৪ ধাপে রেজাল্ট</h2>
        <p className="section-sub">অনুমানে নয়, ডেটায় চলি। প্রতিটি ধাপ পরিষ্কার।</p>

        <ol className="process-gl-grid" aria-label="Our 4-step process">
          {STEPS.map((p, i) => {
            const isHovered = hovered === i;
            const isActive  = active  === i;
            const expanded  = isHovered || isActive;

            return (
              <li
                key={p.num}
                className={`process-gl-card${expanded ? ' process-gl-card--on' : ''}`}
                style={{ '--glow-c': STEP_GLOWS[i], '--i': i }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => toggle(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(i)}
                aria-expanded={isActive}
                aria-label={`ধাপ ${p.num}: ${p.title}`}
              >
                <div className="process-gl-glow" aria-hidden />
                <span className="process-gl-corner process-gl-corner--tl" aria-hidden />
                <span className="process-gl-corner process-gl-corner--br" aria-hidden />

                <div className="process-gl-top">
                  <span className="process-gl-num">{p.num}</span>
                  <span className="process-gl-icon" aria-hidden>{ICONS[i]}</span>
                </div>

                <span className="process-gl-tag">{p.tag}</span>
                <div className="process-gl-title">{p.title}</div>

                <div className={`process-gl-desc${expanded ? ' process-gl-desc--open' : ''}`}>
                  <div className="process-gl-desc-inner">{p.desc}</div>
                </div>

                <div className="process-gl-line" aria-hidden />
              </li>
            );
          })}
        </ol>

        <div className="process-gl-connector" aria-hidden>
          {STEPS.map((_, i) => (
            <React.Fragment key={i}>
              <span className={`process-gl-dot${hovered === i || active === i ? ' process-gl-dot--on' : ''}`} />
              {i < STEPS.length - 1 && <span className="process-gl-dash" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
