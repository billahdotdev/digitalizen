import { useEffect, useRef, useCallback, useState } from 'react'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import './Packages.css'

/* ══════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════ */
const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ══════════════════════════════════════════════════
   DATA — untouched
══════════════════════════════════════════════════ */
const packages = [
  {
    id:       'care_plus',
    variant:  'free',
    badge:    { label: 'সার্ভিস চার্জ ছাড়াই শুরু', type: 'free' },
    name:     'কেয়ার+ (গ্রোথ ব্লুপ্রিন্ট)',
    tagline:  'আমরা রোডম্যাপ বানাব, আপনি সিদ্ধান্ত দেবেন',
    price:    '৳ ০.০০ লাইফটাইম ফ্রি',
    adNote:   'অ্যাড কস্ট আপনার',
    checkStyle: 'green',
    features: [
      'ফ্রি বিজনেস অডিট',
      'ফ্রি ২০২৬ গ্রোথ স্ট্র্যাটেজি',
      'প্রফেশনাল অ্যাড ক্যাম্পেইন',
    ],
    cta:      'ফ্রি অডিট নিন',
    ctaStyle: 'ghost',
    waMsg:    'হ্যালো Digitalizen, কেয়ার+ ফ্রি ২০২৬ বিজনেস অডিট ও গ্রোথ স্ট্র্যাটেজি পেতে চাই।',
  },
  {
    id:       'monthly_care',
    variant:  'popular',
    badge:    { label: 'সবচেয়ে জনপ্রিয়', type: 'popular' },
    name:     'মান্থলি কেয়ার',
    tagline:  'মার্কেটিং + ওয়েব ডেভেলপমেন্ট সল্যুশন',
    price:    '৳ ১০,০০০ থেকে শুরু/মাস',
    adNote:   'অ্যাড কস্ট আপনার কার্ড থেকে',
    checkStyle: 'blue',
    features: [
      'ফ্রি সুপার-ফাস্ট রিঅ্যাক্ট ল্যান্ডিং পেজ',
      'ফানেল ভিত্তিক অ্যাডস ম্যানেজমেন্ট',
      'Pixel, CAPI ও আইওএস ১৪+ ট্র্যাকিং',
      'মান্থলি ROAS, ROI রিপোর্ট',
    ],
    cta:      'শুরু করতে চাই',
    ctaStyle: 'primary',
    waMsg:    'হ্যালো Digitalizen, মান্থলি কেয়ার প্যাকেজ সম্পর্কে বিস্তারিত জানতে চাই।',
  },
  {
    id:       'brand_care',
    variant:  'premium',
    badge:    { label: 'মার্কেট ডমিনেশন', type: 'premium' },
    name:     'ব্র্যান্ড কেয়ার',
    tagline:  'আপনার ব্র্যান্ডের গল্প বলি; মানুষের মনে দাগ কাটে',
    price:    '৳ ৩০,০০০ থেকে শুরু/মাস ',
    adNote:   'অ্যাড কস্ট আপনার কার্ড থেকে',
    checkStyle: 'gold',
    features: [
      'সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি ডিজাইন',
      'সব প্ল্যাটফর্মে আনলিমিটেড ক্যাম্পেইন',
      'কাস্টম রিঅ্যাক্ট ল্যান্ডিং পেজ (আনলিমিটেড আপডেট)',
      'Pixel, সার্ভার-সাইড CAPI ও iOS ১৪+ ট্র্যাকিং',
      'AI ও সার্চ অপ্টিমাইজেশন (AEO,GEO,ও অ্যাডভান্সড SEO)',
      'প্রিমিয়াম ক্রিয়েটিভ আইডিয়া ও সাপোর্ট',
    ],
    cta:      'ব্র্যান্ড কেয়ারে যান',
    ctaStyle: 'premium',
    waMsg:    'হ্যালো Digitalizen, ব্র্যান্ড কেয়ার প্যাকেজ সম্পর্কে বিস্তারিত জানতে চাই।',
  },
]

/* ══════════════════════════════════════════════════
   3D TILT CARD WRAPPER
   Tracks mouse position, applies CSS vars for tilt
══════════════════════════════════════════════════ */
function TiltCard({ children, className, style, disabled }) {
  const ref = useRef(null)

  const handleMouseMove = useCallback((e) => {
    if (disabled) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.setProperty('--rx', `${(-y * 12).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${( x * 12).toFixed(2)}deg`)
    el.style.setProperty('--mx', `${(x * 100 + 50).toFixed(1)}%`)
    el.style.setProperty('--my', `${(y * 100 + 50).toFixed(1)}%`)
    el.style.setProperty('--tilt', '1')
  }, [disabled])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--tilt', '0')
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Packages() {
  const sectionRef      = useRef(null)
  const enterTimeRef    = useRef(null)
  const sectionFiredRef = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sectionFiredRef.current) {
          sectionFiredRef.current = true
          enterTimeRef.current    = Date.now()
          setVisible(true)
          track('ViewContent', {
            content_name:     'Packages Section',
            content_category: 'Section',
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('packages', enterTimeRef, {})
    const onVis   = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEng)
    }
  }, [])

  const handleCta = useCallback((pkg) => {
    track('InitiateCheckout', {
      content_name:     pkg.name,
      content_category: 'Package CTA',
      content_ids:      [pkg.id],
      currency:         'BDT',
    })
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pkg.waMsg)}`,
      '_blank'
    )
  }, [])

  const scrollToFinder = useCallback(() => {
    document.getElementById('finder')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section
      id="packages"
      className={`packages-section${visible ? ' packages-section--visible' : ''}`}
      aria-label="প্যাকেজ ও মূল্য"
      ref={sectionRef}
    >
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০২</span>
          <span className="section-title-right">প্যাকেজ</span>
        </div>

        <h2 className="packages-heading">আমাদের প্যাকেজসমূহ</h2>
        <p className="packages-hint">টেস্ট ➜ অপ্টিমাইজ ➜ স্কেল</p>

        <div className="packages-grid">

          {/* ── CARD 1: FREE ── */}
          <TiltCard
            className={`pkg-card pkg-card--free${visible ? ' pkg-card--visible' : ''}`}
            style={{ '--stagger': '0ms' }}
          >
            {/* Frosted glass sheen layer */}
            <div className="pkg-sheen" aria-hidden="true" />

            <div className="pkg-badge-strip pkg-badge-strip--free">
              <span className="pkg-badge-pulse" aria-hidden="true" />
              {packages[0].badge.label}
            </div>

            <div className="pkg-body">
              <div className="pkg-price-area">
                <span className="pkg-price-label">{packages[0].price}</span>
                <span className="pkg-adnote pkg-adnote--free">{packages[0].adNote}</span>
              </div>

              <div className="pkg-divider" />

              <h3 className="pkg-name">{packages[0].name}</h3>
              <p className="pkg-tagline">{packages[0].tagline}</p>

              <ul className="pkg-features">
                {packages[0].features.map((f, j) => (
                  <li key={j} className="pkg-feature" style={{ '--fi': j }}>
                    <span className="pkg-check pkg-check--green"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="pkg-cta pkg-cta--ghost"
                onClick={() => handleCta(packages[0])}
                aria-label={`${packages[0].cta} — ${packages[0].name}`}
              >
                <WaIcon />
                <span>{packages[0].cta}</span>
              </button>
            </div>
          </TiltCard>

          {/* ── CARD 2: POPULAR ── */}
          <TiltCard
            className={`pkg-card pkg-card--popular${visible ? ' pkg-card--visible' : ''}`}
            style={{ '--stagger': '90ms' }}
          >
            {/* Scanning beam */}
            <div className="pkg-scan-beam" aria-hidden="true" />
            {/* Electric corner sparks */}
            <div className="pkg-corner pkg-corner--tl" aria-hidden="true" />
            <div className="pkg-corner pkg-corner--tr" aria-hidden="true" />
            <div className="pkg-corner pkg-corner--bl" aria-hidden="true" />
            <div className="pkg-corner pkg-corner--br" aria-hidden="true" />

            <div className="pkg-badge-strip pkg-badge-strip--popular">
              <span className="pkg-badge-pulse" aria-hidden="true" />
              {packages[1].badge.label}
              <span className="pkg-badge-pulse pkg-badge-pulse--right" aria-hidden="true" />
            </div>

            <div className="pkg-body">
              <div className="pkg-price-area">
                <span className="pkg-price-label pkg-price-label--popular">{packages[1].price}</span>
                <span className="pkg-adnote pkg-adnote--popular">{packages[1].adNote}</span>
              </div>

              <div className="pkg-divider pkg-divider--popular" />

              <h3 className="pkg-name pkg-name--popular">{packages[1].name}</h3>
              <p className="pkg-tagline">{packages[1].tagline}</p>

              <ul className="pkg-features">
                {packages[1].features.map((f, j) => (
                  <li key={j} className="pkg-feature" style={{ '--fi': j }}>
                    <span className="pkg-check pkg-check--blue"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="pkg-cta pkg-cta--primary"
                onClick={() => handleCta(packages[1])}
                aria-label={`${packages[1].cta} — ${packages[1].name}`}
              >
                <WaIcon />
                <span>{packages[1].cta}</span>
              </button>
            </div>
          </TiltCard>

          {/* ── CARD 3: PREMIUM ── */}
          <TiltCard
            className={`pkg-card pkg-card--premium${visible ? ' pkg-card--visible' : ''}`}
            style={{ '--stagger': '180ms' }}
          >
            {/* Liquid gold shimmer */}
            <div className="pkg-gold-light" aria-hidden="true" />

            <div className="pkg-badge-strip pkg-badge-strip--premium">
              <span className="pkg-badge-pulse pkg-badge-pulse--gold" aria-hidden="true" />
              {packages[2].badge.label}
              <span className="pkg-badge-pulse pkg-badge-pulse--gold pkg-badge-pulse--right" aria-hidden="true" />
            </div>

            <div className="pkg-body">
              <div className="pkg-price-area">
                <span className="pkg-price-label pkg-price-label--premium">{packages[2].price}</span>
                <span className="pkg-adnote pkg-adnote--premium">{packages[2].adNote}</span>
              </div>

              <div className="pkg-divider pkg-divider--premium" />

              <h3 className="pkg-name pkg-name--premium">{packages[2].name}</h3>
              <p className="pkg-tagline pkg-tagline--premium">{packages[2].tagline}</p>

              <ul className="pkg-features">
                {packages[2].features.map((f, j) => (
                  <li key={j} className="pkg-feature pkg-feature--premium" style={{ '--fi': j }}>
                    <span className="pkg-check pkg-check--gold"><CheckIcon /></span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className="pkg-cta pkg-cta--premium"
                onClick={() => handleCta(packages[2])}
                aria-label={`${packages[2].cta} — ${packages[2].name}`}
              >
                <WaIcon />
                <span>{packages[2].cta}</span>
              </button>
            </div>
          </TiltCard>

        </div>

        <div className="packages-note">
          <span className="packages-note-line" aria-hidden="true" />
          <p className="packages-note-text">
            <strong>কোনো বাধ্যবাধকতা নেই।</strong> আমরা ক্লায়েন্ট ধরে রাখি ফলাফল দিয়ে, চুক্তি দিয়ে নয়।{' '}
            নিশ্চিত না?{' '}
            <button className="packages-note-link" onClick={scrollToFinder}>
              ফ্রি অডিট করুন →
            </button>
          </p>
        </div>

      </div>
    </section>
  )
}
