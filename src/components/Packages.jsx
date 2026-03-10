import { useState } from 'react'
import './Packages.css'

const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)
const WA_NUMBER = '8801711992558'

/* ── SVG Icons ─────────────────────────────────────── */
const Icon = {
  check: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrow: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  arrowUp: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M11 7H3M6 10l-3-3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevron: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wa: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  seed: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 17V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M10 9C10 9 6.5 7.5 5.5 4c3-.5 5.5 1.5 4.5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 12.5C10 12.5 13 11.5 14.5 8.5c-2.5-.5-5 1-4.5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M5.5 17h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  growth: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-4.5 3 3 4-6 3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 5h3v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  brand: (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M10 6.5v3.5l2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 4.5l.8 1.2M13 4.5l-.8 1.2M10 3V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
}

const plans = [
  {
    id: '01',
    num: '০০১',
    tier: 'ছোট শুরু',
    tagline: 'ঝুঁকিমুক্তভাবে পরীক্ষা করুন — ফলাফল দেখে সিদ্ধান্ত নিন।',
    price: 'ফ্রি থেকে শুরু',
    priceSub: 'শুধু অ্যাড খরচ দিন',
    icon: 'seed',
    badge: null,
    features: [
      'ফ্রি বিজনেস অডিট',
      'বেসিক পেজ সেটআপ',
      'যেকোনো দিন, যেকোনো বাজেটে অ্যাড চালান',
      'শুধু যা ব্যবহার করেন তার জন্য পেমেন্ট',
    ],
    footnote: 'কোনো চুক্তি নেই। কোনো চাপ নেই। শুরু করুন এবং দেখুন কী কাজ করে।',
    wa: 'ছোট শুরু প্ল্যান',
  },
  {
    id: '02',
    num: '০০২',
    tier: 'মান্থলি কেয়ার',
    tagline: 'ধারাবাহিক গ্রোথ ও অব্যাহত সাপোর্টের জন্য।',
    price: 'মাসিক',
    priceSub: 'একটি ডেডিকেটেড গ্রোথ টিম',
    icon: 'growth',
    badge: 'সবচেয়ে জনপ্রিয়',
    features: [
      'আনলিমিটেড অ্যাড ক্যাম্পেইন ম্যানেজমেন্ট',
      'আনলিমিটেড ল্যান্ডিং পেজ',
      'আনলিমিটেড অ্যাড ক্রিয়েটিভ আইডিয়া',
      'ব্লগ রাইটিং ও কনটেন্ট সাপোর্ট',
      'AI গাইডেন্স — মার্কেটিং ও কনটেন্টে AI ব্যবহার শিখুন',
      'ক্রমাগত ডেটা ট্র্যাকিং ও অপ্টিমাইজেশন',
    ],
    footnote: 'প্রতি মাসে আপনার সাথে কাজ করে একটি ছোট গ্রোথ ও ব্র্যান্ডিং টিম।',
    wa: 'মান্থলি কেয়ার প্ল্যান',
  },
  {
    id: '03',
    num: '০০৩',
    tier: 'ব্র্যান্ড কেয়ার',
    tagline: 'আলাদা হয়ে উঠুন — মানুষ যে ব্র্যান্ড ভালোবাসে তা হোন।',
    price: 'কাস্টম',
    priceSub: 'আপনার লক্ষ্য অনুযায়ী কৌশল',
    icon: 'brand',
    badge: null,
    features: [
      'ফ্রি বিজনেস ও মার্কেটিং অডিট',
      'ওয়েবসাইট / ল্যান্ডিং পেজ স্পিড অ্যানালাইসিস',
      'ইউজার এক্সপেরিয়েন্স ও ব্যবহারযোগ্যতা রিভিউ',
      'ক্রিয়েটিভ ক্যাম্পেইন কনসেপ্ট',
      'ব্র্যান্ড স্ট্র্যাটেজি ও পজিশনিং',
      'আপনার নির্দিষ্ট লক্ষ্য অনুযায়ী সার্ভিস',
    ],
    footnote: 'আপনি বেছে নিন কী দরকার। আমরা আপনার ব্র্যান্ডকে কেন্দ্রে রেখে কৌশল তৈরি করি।',
    wa: 'ব্র্যান্ড কেয়ার প্ল্যান',
  },
]

export default function Packages() {
  const [expanded, setExpanded] = useState(null)

  const waOrder = (plan) => {
    pixel('AddToCart', { content_name: plan.tier, value: 0, currency: 'BDT' })
    const msg = `হ্যালো Digitalizen!\n\nআমি "${plan.wa}" সম্পর্কে জানতে চাই।\nকীভাবে শুরু করতে পারি?`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const toggle = (id) => setExpanded(expanded === id ? null : id)

  return (
    <section id="packages" className="packages-section">
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০৩</span>
          <span className="section-title-right">প্যাকেজ</span>
        </div>

        <h2 className="packages-heading">একসাথে কীভাবে কাজ করতে পারি</h2>
        <p className="packages-hint">
          তিনটি ধাপ — আপনি এখন যেখানে আছেন সেখান থেকে শুরু করুন।
        </p>

        <div className="packages-list">
          {plans.map((plan) => {
            const isOpen = expanded === plan.id
            const isPopular = !!plan.badge

            return (
              <div
                key={plan.id}
                className={`pkg-card${isPopular ? ' pkg-card--popular' : ''}${isOpen ? ' pkg-card--open' : ''}`}
              >
                {/* Popular strip */}
                {isPopular && (
                  <div className="pkg-popular-strip" role="status">
                    <span className="pkg-popular-live" aria-hidden="true" />
                    {plan.badge}
                  </div>
                )}

                {/* Header / toggle */}
                <button
                  className="pkg-header"
                  onClick={() => toggle(plan.id)}
                  aria-expanded={isOpen}
                  aria-controls={`pkg-body-${plan.id}`}
                >
                  <div className="pkg-header-left">
                    <div className={`pkg-icon-wrap pkg-icon-wrap--${plan.id}`} aria-hidden="true">
                      {Icon[plan.icon]}
                    </div>
                    <div className="pkg-info">
                      <div className="pkg-meta-row">
                        <span className="pkg-num">{plan.num}</span>
                        <span className="pkg-tier">{plan.tier}</span>
                      </div>
                      <p className="pkg-tagline">{plan.tagline}</p>
                    </div>
                  </div>

                  <div className="pkg-header-right">
                    <div className="pkg-price-block">
                      <span className="pkg-price">{plan.price}</span>
                      <span className="pkg-price-sub">{plan.priceSub}</span>
                    </div>
                    <span className={`pkg-chevron${isOpen ? ' pkg-chevron--open' : ''}`} aria-hidden="true">
                      {Icon.chevron}
                    </span>
                  </div>
                </button>

                {/* Expandable body */}
                {isOpen && (
                  <div
                    id={`pkg-body-${plan.id}`}
                    className="pkg-body"
                    role="region"
                    aria-label={`${plan.tier} বিবরণ`}
                  >
                    <ul className="pkg-features">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="pkg-feature">
                          <span className="pkg-feature-icon" aria-hidden="true">
                            {Icon.check}
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pkg-footnote">
                      <span className="pkg-footnote-bar" aria-hidden="true" />
                      <p>{plan.footnote}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pkg-actions">
                  <button className="pkg-btn-wa" onClick={() => waOrder(plan)}>
                    {Icon.wa}
                    WhatsApp-এ আলোচনা করি
                  </button>
                  <button
                    className="pkg-btn-details"
                    onClick={() => toggle(plan.id)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'কম দেখুন' : 'বিস্তারিত দেখুন'}
                    <span className={`pkg-btn-arrow${isOpen ? ' pkg-btn-arrow--flip' : ''}`} aria-hidden="true">
                      {Icon.arrow}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom nudge */}
        <div className="packages-note">
          <span className="packages-note-line" aria-hidden="true" />
          <p className="packages-note-text">
            কোন প্ল্যানটি আপনার জন্য উপযুক্ত জানতে{' '}
            <button
              className="packages-note-link"
              onClick={() => document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' })}
            >
              প্যাকেজ ফাইন্ডার ব্যবহার করুন
            </button>
          </p>
        </div>

      </div>
    </section>
  )
}
