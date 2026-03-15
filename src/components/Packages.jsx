import { useEffect, useRef, useCallback } from 'react'
import './Packages.css'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'


/* ── Icons ──────────────────────────────────────── */
const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Star = () => (
  <svg className="pkg-star" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M7 1.5l1.48 3L12 5.07 9.5 7.5l.59 3.44L7 9.35l-3.09 1.59L4.5 7.5 2 5.07l3.52-.57L7 1.5z"/>
  </svg>
)

const Stars = ({ variant, count }) => (
  <div className={`pkg-stars pkg-stars--${variant}`} role="img" aria-label={`${count} star plan`}>
    {Array.from({ length: count }).map((_, i) => <Star key={i} />)}
  </div>
)

/* ── Shared card content ───────────────────────── */
const CardBody = ({ plan, onOrder }) => (
  <>
    {plan.ribbon && (
      <div className="pkg-ribbon">
        <span className="pkg-ribbon-dot" aria-hidden="true" />
        {plan.ribbon}
        <span className="pkg-ribbon-dot" aria-hidden="true" />
      </div>
    )}
    <div className="pkg-body">
      <Stars variant={plan.variant} count={plan.stars} />

      <span className={`pkg-stage pkg-stage--${plan.variant}`}>
        {plan.stage}
      </span>

      <h3 className={`pkg-tier pkg-tier--${plan.variant}`}>{plan.tier}</h3>
      <p  className={`pkg-tagline pkg-tagline--${plan.variant}`}>{plan.tagline}</p>

      <div className={`pkg-price-block pkg-price-block--${plan.variant}`}>
        <div className={`pkg-price pkg-price--${plan.variant}`}>
          <span className="pkg-price__currency">{plan.priceCurrency}</span>
          <span className="pkg-price__main">{plan.priceMain}</span>
          <span className="pkg-price__sub">{plan.priceSub}</span>
        </div>
      </div>

      <ul className="pkg-features">
        {plan.features.map((f, i) => (
          <li key={i} className={`pkg-feature pkg-feature--${plan.variant}`}>
            <span className={`pkg-feature__check pkg-feature__check--${plan.variant}`}>
              <CheckIcon />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <button
        className={`pkg-btn pkg-btn--${plan.variant}`}
        onClick={() => onOrder(plan)}
      >
        <WaIcon /> {plan.btnLabel}
      </button>

      {plan.guarantee && (
        <p className={`pkg-guarantee pkg-guarantee--${plan.variant}`}>
          {plan.guarantee}
        </p>
      )}
    </div>
  </>
)

/* ── Plans ─────────────────────────────────────── */
const plans = [
  {
    id: '01', variant: 'basic', stars: 1,
    stage: 'শুরুর পর্যায়',
    tier: 'কেয়ার+',
    tagline: 'অ্যাড শুরু করুন, সার্ভিস চার্জ নেই',
    priceCurrency: '৳', priceMain: '০', priceSub: 'অ্যাড বাজেট অনুযায়ী',
    features: [
      'ফ্রি বিজনেস অডিট',
      'বেসিক অ্যাড সেটআপ',
      'ফ্রি কনসালটেশন',
      'অ্যাড কস্ট ব্যবহার অনুযায়ী',
    ],
    guarantee: 'কোনো চুক্তি নেই',
    wa: 'কেয়ার+ প্ল্যান',
    btnLabel: 'ফ্রি শুরু করুন',
  },
  {
    id: '02', variant: 'popular', stars: 2,
    stage: 'গ্রোথ রেডি',
    tier: 'মান্থলি কেয়ার',
    tagline: 'মার্কেটিং আর ডেভেলপমেন্ট এক টিমে',
    priceCurrency: '৳', priceMain: '১০,০০০', priceSub: 'থেকে প্রতি মাসে',
    ribbon: 'সবচেয়ে জনপ্রিয়',
    features: [
      'কাস্টম হাই-স্পিড ল্যান্ডিং পেজ',
      'প্রফেশনাল অ্যাড ম্যানেজমেন্ট',
      'Meta Pixel ও CAPI সেটআপ',
      'সিজনাল পেজ রিডিজাইন',
      'কনটেন্ট কৌশল ও পোস্ট',
      'মাসিক গ্রোথ রিভিউ মিটিং',
    ],
    guarantee: '৩০ দিনের সন্তুষ্টি গ্যারান্টি',
    wa: 'মান্থলি কেয়ার প্ল্যান',
    btnLabel: 'এখনই শুরু করুন',
  },
  {
    id: '03', variant: 'premium', stars: 3,
    stage: 'স্কেল রেডি',
    tier: 'ব্র্যান্ড কেয়ার',
    tagline: 'শূন্য থেকে মার্কেট লিডার',
    priceCurrency: '৳', priceMain: '৩০,০০০', priceSub: 'থেকে প্রতি মাসে',
    features: [
      'ব্র্যান্ড আইডেন্টিটি ডিজাইন',
      'আনলিমিটেড কাস্টম ল্যান্ডিং পেজ',
      'অ্যাডভান্সড ট্র্যাকিং ও CAPI',
      'ফুল-স্ট্যাক অ্যাড ম্যানেজমেন্ট',
      'মোশন কনটেন্ট ও ক্রিয়েটিভ',
      'ডেডিকেটেড গ্রোথ ম্যানেজার',
    ],
    guarantee: 'ডেডিকেটেড প্রিমিয়াম সাপোর্ট',
    wa: 'ব্র্যান্ড কেয়ার প্ল্যান',
    btnLabel: 'আলোচনা করুন',
  },
]

const trustItems = ['চুক্তি নেই', '৪৮ ঘণ্টায় শুরু', 'বাংলায় সাপোর্ট', 'ফ্রি অনবোর্ডিং']

/* ── Component ─────────────────────────────────── */
export default function Packages() {
  const sectionRef   = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        track('ViewContent', {
          content_name:     'Packages Section',
          content_category: 'Section',
          content_ids:      ['packages'],
        }, 'pkg')
        io.unobserve(el)
      }
    }, { threshold: 0.2 })
    io.observe(el)
    const push  = () => pushEngagement('packages', enterTimeRef)
    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  const waOrder = useCallback((plan) => {
    track('AddToCart', {
      content_name:     plan.tier,
      content_category: 'Package',
      currency:         'BDT',
      value:            0,
    }, 'pkg')
    const msg = `হ্যালো Digitalizen,\n\n"${plan.wa}" সম্পর্কে জানতে চাই। কীভাবে শুরু করব?`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }, [])

  const scrollToFinder = useCallback(() => {
    document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="packages"
      className="packages-section"
      ref={sectionRef}
      aria-label="প্যাকেজ ও মূল্য তালিকা"
    >
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০৩</span>
          <span className="section-title-right">প্যাকেজ</span>
        </div>

        <h2 className="packages-heading">কোন প্রোগ্রাম আপনার জন্য?</h2>
        <p  className="packages-hint">কেয়ার+ থেকে ব্র্যান্ড কেয়ার পর্যন্ত তিনটি সুস্পষ্ট পথ।</p>

        <div className="packages-trust">
          {trustItems.map((item, i) => (
            <span key={i} className="packages-trust-item">{item}</span>
          ))}
        </div>

        <div className="packages-grid">

          {/* ── Care+ ─── */}
          <div className="pkg-card pkg-card--basic">
            <CardBody plan={plans[0]} onOrder={waOrder} />
          </div>

          {/* ── Monthly Care (spinning border) ── */}
          <div className="pkg-popular-wrapper">
            <div className="pkg-card pkg-card--popular">
              <CardBody plan={plans[1]} onOrder={waOrder} />
            </div>
          </div>

          {/* ── Brand Care ── */}
          <div className="pkg-card pkg-card--premium">
            <div className="pkg-grid-bg" aria-hidden="true" />
            <CardBody plan={plans[2]} onOrder={waOrder} />
          </div>

        </div>

        <div className="packages-note">
          <span className="packages-note-line" aria-hidden="true" />
          <p className="packages-note-text">
            কোনটা নেবেন বুঝতে পারছেন না?{' '}
            <button
              className="packages-note-link"
              onClick={scrollToFinder}
            >
              ফ্রি অডিট করুন →
            </button>
          </p>
        </div>

      </div>
    </section>
  )
}
