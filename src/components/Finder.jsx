import { useState } from 'react'
import './Finder.css'

const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)
const WA_NUMBER = '8801711992558'

const questions = [
  {
    q: 'আপনার মান্থলি বিজ্ঞাপন বাজেট কত?',
    options: [
      { label: '১,০০০–৫,০০০ টাকা', pkg: 'micro' },
      { label: '৫,০০০–২০,০০০ টাকা', pkg: 'weekly' },
      { label: '২০,০০০+ টাকা', pkg: 'monthly' },
      { label: 'জানি না / আলোচনা করতে চাই', pkg: 'custom' },
    ]
  },
  {
    q: 'আপনার কনটেন্ট রেডি আছে?',
    options: [
      { label: 'হ্যাঁ, ছবি/ভিডিও আছে', val: 'yes' },
      { label: 'না, কনটেন্ট তৈরি করতে হবে', val: 'no' },
    ]
  },
]

const pkgMap = {
  micro:   { name: 'মাইক্রো টেস্ট', price: '৳১,৪৫০', tag: 'ছোট বাজেটে শুরু', id: 'micro' },
  weekly:  { name: 'সাপ্তাহিক অপ্টিমাইজেশন', price: '৳১০,০০০–৳২০,০০০', tag: 'সবচেয়ে জনপ্রিয়', id: 'weekly' },
  monthly: { name: 'মাসিক ম্যানেজমেন্ট', price: '৳৩০,০০০+', tag: 'সর্বোচ্চ ফলাফল', id: 'monthly' },
  custom:  { name: 'কাস্টম সলিউশন', price: 'আলোচনা', tag: 'আপনার জন্য বিশেষ', id: 'custom' },
}

export default function Finder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [selected, setSelected] = useState(null)

  const pick = (opt) => {
    setSelected(opt.label)
    const next = { ...answers, [step]: opt }
    setAnswers(next)
    setTimeout(() => {
      if (step === 0) {
        setStep(1)
        setSelected(null)
      } else {
        const pkg = pkgMap[next[0].pkg]
        pixel('ViewContent', { content_name: `Finder: ${pkg.name}` })
        setResult(pkg)
      }
    }, 320)
  }

  const reset = () => { setStep(0); setAnswers({}); setResult(null); setSelected(null) }

  const progressPct = result ? 100 : (step / questions.length) * 100

  return (
    <section id="finder" className="finder-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০১</span>
          <span className="section-title-right">প্যাকেজ ফাইন্ডার</span>
        </div>

        <h2 className="finder-heading">আপনার জন্য কোন প্যাকেজ ভালো হবে?</h2>
        <p className="finder-sub">মাত্র ২টি প্রশ্নের উত্তর দিয়ে — ৩০ সেকেন্ডে জেনে নিন।</p>

        <div className="finder-card">
          {/* Progress bar */}
          <div className="finder-progress" aria-hidden="true">
            <div className="finder-progress__bar" style={{ width: `${progressPct}%` }}></div>
          </div>

          {!result ? (
            <div className="finder-quiz">
              <div className="finder-step-info">
                <span className="finder-step-badge">প্রশ্ন {step + 1}/{questions.length}</span>
              </div>
              <p className="finder-q">{questions[step].q}</p>
              <div className="finder-opts">
                {questions[step].options.map((o, i) => (
                  <button
                    key={i}
                    className={`finder-opt ${selected === o.label ? 'finder-opt--selected' : ''}`}
                    onClick={() => pick(o)}
                  >
                    <span className="opt-num">{String.fromCharCode(0x2460 + i)}</span>
                    {o.label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button className="finder-back" onClick={() => { setStep(s => s - 1); setSelected(null) }}>
                  ← আগের প্রশ্নে ফিরুন
                </button>
              )}
            </div>
          ) : (
            <div className="finder-result">
              <div className="result-icon">✓</div>
              <div className="result-tag">{result.tag}</div>
              <h3 className="result-name">{result.name}</h3>
              <p className="result-price">{result.price}</p>
              <div className="result-actions">
                <button
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    pixel('InitiateCheckout', { content_name: result.name })
                    const msg = `হ্যালো, আমি ${result.name} প্যাকেজ (${result.price}) নিতে চাই। কীভাবে শুরু করতে পারি?`
                    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                >
                  💬 WhatsApp-এ অর্ডার করুন
                </button>
                <button className="btn-ghost" style={{ width: '100%' }} onClick={reset}>
                  আবার চেষ্টা করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
