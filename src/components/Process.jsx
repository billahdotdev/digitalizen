import './Process.css'

const steps = [
  {
    num: '১',
    emoji: '🧪',
    title: 'টেস্ট',
    desc: 'ছোট বাজেটে ৩–৫টি অ্যাড ভেরিয়েন্ট চালাই। কনটেন্ট রেডি থাকলে দ্রুতই শুরু করা যায়।',
    metric: '৭ দিন',
    metricLabel: 'প্রথম ডেটা',
  },
  {
    num: '২',
    emoji: '⚡',
    title: 'অপ্টিমাইজ',
    desc: 'ডেটা বিশ্লেষণ করি। কোনটা কাজ করছে সেটায় বাজেট বাড়াই। বাকি গুলো বন্ধ করি।',
    metric: '2X',
    metricLabel: 'কম খরচ',
  },
  {
    num: '৩',
    emoji: '🚀',
    title: 'স্কেল',
    desc: 'প্রমাণিত উইনার অ্যাড স্কেল করি। ROAS ধরে রেখে ইনকাম বাড়াই।',
    metric: '৩৪০%',
    metricLabel: 'গড় ROAS',
  },
]

export default function Process() {
  return (
    <section id="process" className="process-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০২</span>
          <span className="section-title-right">ভালো রেজাল্ট কীভাবে আসে</span>
        </div>

        <h2 className="process-heading">আমাদের প্রুভেন মেথড</h2>

        <div className="process-steps">
          {steps.map((s, i) => (
            <div key={i} className="process-step">
              <div className="step-left">
                <div className="step-num-wrap">
                  <span className="step-emoji" aria-hidden="true">{s.emoji}</span>
                  <span className="step-num">{s.num}</span>
                </div>
                {i < steps.length - 1 && <div className="step-connector" aria-hidden="true"></div>}
              </div>
              <div className="step-body">
                <div className="step-header-row">
                  <h3 className="step-title">{s.title}</h3>
                  <div className="step-metric-chip">
                    <span className="step-metric-num">{s.metric}</span>
                    <span className="step-metric-label">{s.metricLabel}</span>
                  </div>
                </div>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="process-formula" aria-label="প্রক্রিয়া সারসংক্ষেপ">
          {steps.map((s, i) => (
            <span key={i} className="formula-row">
              <span className="formula-item">
                <span className="formula-emoji" aria-hidden="true">{s.emoji}</span>
                {s.title}
              </span>
              {i < steps.length - 1 && <span className="formula-arrow" aria-hidden="true">→</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
