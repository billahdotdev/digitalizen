import { useState, useEffect } from 'react'
import './Packages.css'

const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)
const WA_NUMBER = '8801XXXXXXXXX'

const packages = [
  {
    id: '001',
    name: 'মাইক্রো টেস্ট',
    price: '৳১,৪৫০',
    priceNote: 'একবার',
    tagline: 'কনটেন্ট থাকলে — ছোট বাজেটে দ্রুত টেস্ট।',
    features: [
      '৩টি অ্যাড ভেরিয়েন্ট তৈরি',
      '৭ দিন ক্যাম্পেইন রান',
      'বিস্তারিত পারফরম্যান্স রিপোর্ট',
      'WhatsApp সাপোর্ট',
    ],
    ideal: 'নতুন ব্যবসা বা প্রথমবার অ্যাড টেস্ট',
    wa: 'মাইক্রো টেস্ট (৳১,৪৫০)',
    highlight: 'দ্রুত শুরু',
  },
  {
    id: '002',
    name: 'সাপ্তাহিক অপ্টিমাইজেশন',
    price: '৳১০,০০০–৳২০,০০০',
    priceNote: 'প্রতি সপ্তাহ',
    tagline: 'চলমান অপ্টিমাইজেশন + ১টি ক্রিয়েটিভ প্রতি সপ্তাহে।',
    features: [
      'সাপ্তাহিক A/B টেস্ট',
      '১টি নতুন ক্রিয়েটিভ/সপ্তাহ',
      'বাজেট অপ্টিমাইজেশন',
      'সাপ্তাহিক পারফরম্যান্স রিপোর্ট',
    ],
    ideal: 'বর্তমান অ্যাড আরও ভালো করতে চাইলে',
    wa: 'সাপ্তাহিক অপ্টিমাইজেশন',
    popular: true,
    highlight: 'সবচেয়ে জনপ্রিয়',
  },
  {
    id: '003',
    name: 'মাসিক ম্যানেজমেন্ট',
    price: '৳৩০,০০০+',
    priceNote: 'প্রতি মাস',
    tagline: 'ফুল-ফানেল ম্যানেজমেন্ট, স্কেল ও রিপোর্টিং।',
    features: [
      'ফুল ফানেল ক্যাম্পেইন ম্যানেজমেন্ট',
      'আনলিমিটেড ক্রিয়েটিভ',
      'মাসিক স্ট্র্যাটেজি কল',
      'প্রায়রিটি WhatsApp সাপোর্ট',
    ],
    ideal: 'স্কেল করতে প্রস্তুত এস্টাবলিশড ব্যবসা',
    wa: 'মাসিক ম্যানেজমেন্ট (৳৩০,০০০+)',
    highlight: 'সর্বোচ্চ ফলাফল',
  },
  {
    id: '004',
    name: 'কাস্টম সলিউশন',
    price: 'আলোচনা',
    priceNote: null,
    tagline: 'ইউনিক প্রজেক্ট বা কনটেন্ট প্রোডাকশন দরকার হলে।',
    features: [
      'কাস্টম স্ট্র্যাটেজি তৈরি',
      'কনটেন্ট প্রোডাকশন (ছবি/ভিডিও)',
      'মাল্টি-প্ল্যাটফর্ম ক্যাম্পেইন',
      'ডেডিকেটেড টিম অ্যাসাইনমেন্ট',
    ],
    ideal: 'বড় প্রজেক্ট বা বিশেষ কেস',
    wa: 'কাস্টম সলিউশন',
    highlight: 'বিশেষ প্রজেক্ট',
  },
]

/* ─── Row comparison: which features each package has ─── */
const COMPARE_ROWS = [
  { label: 'মূল্য', key: 'price' },
  { label: 'মেয়াদ', values: ['৭ দিন', 'সাপ্তাহিক', 'মাসিক', 'কাস্টম'] },
  { label: 'অ্যাড ভেরিয়েন্ট', values: ['৩টি', 'আনলিমিটেড', 'আনলিমিটেড', 'কাস্টম'] },
  { label: 'নতুন ক্রিয়েটিভ', values: ['—', '১টি/সপ্তাহ', 'আনলিমিটেড', 'কাস্টম'] },
  { label: 'পারফরম্যান্স রিপোর্ট', values: [true, true, true, true] },
  { label: 'বাজেট অপ্টিমাইজেশন', values: [false, true, true, true] },
  { label: 'স্ট্র্যাটেজি কল', values: [false, false, true, true] },
  { label: 'কনটেন্ট প্রোডাকশন', values: [false, false, false, true] },
  { label: 'WhatsApp সাপোর্ট', values: [true, true, true, true] },
  { label: 'প্রায়রিটি সাপোর্ট', values: [false, false, true, true] },
]

function CompareModal({ ids, onClose }) {
  const pkgs = ids.map(id => packages.find(p => p.id === id))

  // lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const waOrder = (pkg) => {
    pixel('AddToCart', { content_name: pkg.name, value: 0, currency: 'BDT' })
    const msg = `হ্যালো, আমি ${pkg.wa} প্যাকেজ নিতে চাই। কীভাবে শুরু করতে পারি?`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const renderCell = (row, colIdx) => {
    if (row.key === 'price') return <span className="cmp-price">{pkgs[colIdx].price}</span>
    const val = row.values[packages.indexOf(pkgs[colIdx])]
    if (val === true)  return <span className="cmp-yes" aria-label="আছে">✓</span>
    if (val === false) return <span className="cmp-no"  aria-label="নেই">—</span>
    return <span className="cmp-text">{val}</span>
  }

  return (
    <div className="cmp-overlay" role="dialog" aria-modal="true" aria-label="প্যাকেজ তুলনা" onClick={onClose}>
      <div className="cmp-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="cmp-modal__head">
          <h3 className="cmp-modal__title">প্যাকেজ তুলনা</h3>
          <button className="cmp-close" onClick={onClose} aria-label="বন্ধ করুন">✕</button>
        </div>

        {/* Package name headers */}
        <div className="cmp-pkg-headers">
          <div className="cmp-row-label-spacer" />
          {pkgs.map(pkg => (
            <div key={pkg.id} className={`cmp-pkg-head ${pkg.popular ? 'cmp-pkg-head--popular' : ''}`}>
              {pkg.popular && <span className="cmp-popular-dot">⭐</span>}
              <span className="cmp-pkg-name">{pkg.name}</span>
              <span className="cmp-pkg-price">{pkg.price}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="cmp-rows">
          {COMPARE_ROWS.map((row, ri) => (
            <div key={ri} className={`cmp-row ${ri % 2 === 0 ? 'cmp-row--alt' : ''}`}>
              <div className="cmp-row-label">{row.label}</div>
              {pkgs.map((_, ci) => (
                <div key={ci} className="cmp-row-cell">
                  {renderCell(row, ci)}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="cmp-ctas">
          <div className="cmp-row-label-spacer" />
          {pkgs.map(pkg => (
            <div key={pkg.id} className="cmp-cta-cell">
              <button className="btn-order cmp-order-btn" onClick={() => waOrder(pkg)}>
                অর্ডার করুন
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Packages() {
  const [compare, setCompare] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [showCompare, setShowCompare] = useState(false)

  const toggleCompare = (id) => {
    setCompare(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 2 ? [...prev, id] : prev
    )
  }

  const waOrder = (pkg) => {
    pixel('AddToCart', { content_name: pkg.name, value: 0, currency: 'BDT' })
    const msg = `হ্যালো, আমি ${pkg.wa} প্যাকেজ নিতে চাই। কীভাবে শুরু করতে পারি?`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const openCompare = () => {
    pixel('ViewContent', { content_name: 'Package Compare Modal' })
    setShowCompare(true)
  }

  return (
    <section id="packages" className="packages-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৩</span>
          <span className="section-title-right">প্যাকেজ</span>
        </div>

        <h2 className="packages-heading">সব প্যাকেজ একনজরে</h2>
        <p className="packages-hint">
          ২টি পর্যন্ত তুলনা করুন। অর্ডার করতে WhatsApp-এ ক্লিক করুন।
        </p>

        <div className="packages-list">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className={`pkg-card ${pkg.popular ? 'pkg-card--popular' : ''} ${expanded === pkg.id ? 'pkg-card--expanded' : ''}`}
            >
              {pkg.popular && (
                <div className="popular-badge" role="status">⭐ সবচেয়ে জনপ্রিয়</div>
              )}

              <div
                className="pkg-header"
                onClick={() => setExpanded(expanded === pkg.id ? null : pkg.id)}
                role="button"
                aria-expanded={expanded === pkg.id}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setExpanded(expanded === pkg.id ? null : pkg.id)}
              >
                <div className="pkg-left">
                  <span className="pkg-num-badge">{pkg.id}</span>
                  <div className="pkg-info">
                    <h3 className="pkg-name">{pkg.name}</h3>
                    <p className="pkg-tagline">{pkg.tagline}</p>
                  </div>
                </div>
                <div className="pkg-right">
                  <span className="pkg-price">{pkg.price}</span>
                  {pkg.priceNote && <span className="pkg-price-note">{pkg.priceNote}</span>}
                  <span className="expand-icon" aria-hidden="true">{expanded === pkg.id ? '↑' : '↓'}</span>
                </div>
              </div>

              {expanded === pkg.id && (
                <div className="pkg-details" aria-label={`${pkg.name} বিবরণ`}>
                  <ul className="pkg-features">
                    {pkg.features.map(f => (
                      <li key={f}>
                        <span className="feat-check" aria-hidden="true">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pkg-ideal">
                    <span className="ideal-label">আদর্শ:</span> {pkg.ideal}
                  </div>
                </div>
              )}

              <div className="pkg-actions">
                <button
                  className={`btn-compare ${compare.includes(pkg.id) ? 'btn-compare--active' : ''}`}
                  onClick={() => toggleCompare(pkg.id)}
                  disabled={!compare.includes(pkg.id) && compare.length >= 2}
                  aria-pressed={compare.includes(pkg.id)}
                >
                  {compare.includes(pkg.id) ? '✓ যোগ হয়েছে' : '+ তুলনা করুন'}
                </button>
                <button className="btn-order" onClick={() => waOrder(pkg)}>
                  WhatsApp-এ অর্ডার
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compare Bar */}
      {compare.length > 0 && (
        <div className="compare-bar" role="status" aria-live="polite">
          <span className="compare-bar__text">
            {compare.length === 1
              ? `${packages.find(p => p.id === compare[0])?.name} + আরেকটা বেছে নিন`
              : `${compare.map(id => packages.find(p => p.id === id)?.name).join(' vs ')}`
            }
          </span>
          {compare.length === 2 && (
            <button className="compare-bar__btn" onClick={openCompare}>
              তুলনা দেখুন →
            </button>
          )}
          <button className="compare-bar__clear" onClick={() => setCompare([])} aria-label="তুলনা মুছুন">✕</button>
        </div>
      )}

      {/* Inline Compare Modal */}
      {showCompare && compare.length === 2 && (
        <CompareModal ids={compare} onClose={() => setShowCompare(false)} />
      )}
    </section>
  )
}
