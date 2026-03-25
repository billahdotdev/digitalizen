import { track, WA_NUMBER } from '../lib/analytics.js'
import './Packages.css'

const packages = [
  {
    id: '01',
    name: 'মাইক্রো টেস্ট',
    price: '১,৪৫০',
    tagline: 'দ্রুত রেজাল্ট দেখার জন্য',
    features: ['১টি হাই-কনভার্টিং ভিডিও অ্যাড', 'টার্গেটেড অডিয়েন্স রিসার্চ', '৩ দিন ম্যানেজমেন্ট', 'বিস্তারিত রিপোর্ট'],
    cta: 'শুরু করুন',
    type: 'frosted'
  },
  {
    id: '02',
    name: 'গ্রোথ প্যাক',
    price: '৪,৯৫০',
    tagline: 'সবচেয়ে জনপ্রিয় চয়েস',
    features: ['৩টি কাস্টম ভিডিও অ্যাডস', 'পিক্সেল ও কনভার্শন সেটআপ', '১০ দিন ম্যানেজমেন্ট', 'অ্যাড কপিরাইটিং'],
    cta: 'গ্রোথ শুরু করুন',
    type: 'electric',
    popular: true
  },
  {
    id: '03',
    name: 'স্কেল আপ',
    price: '১২,০০০',
    tagline: 'বিজনেসের পূর্ণাঙ্গ সল্যুশন',
    features: ['আনলিমিটেড ক্রিয়েটিভস', 'CAPI ইমপ্লিমেন্টেশন', '৩০ দিন ম্যানেজমেন্ট', 'ডেডিকেটেড একাউন্ট ম্যানেজার'],
    cta: 'স্কেল করুন',
    type: 'obsidian'
  }
]

export default function Packages() {
  const handleCta = (pkg) => {
    const text = `Hi Digitalizen, I'm interested in the ${pkg.name} package.`
    track('Contact', { content_name: pkg.name, value: pkg.price })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <section className="pk-section" id="pricing">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৯</span>
          <span className="section-title-right">প্যাকেজ</span>
        </div>

        <div className="pk-stack">
          {packages.map((pkg, i) => (
            <div 
              key={pkg.id} 
              className={`pk-card pk-card--${pkg.type}`}
              style={{ '--index': i }}
            >
              {pkg.popular && <div className="pk-popular-tag">সেরা ভ্যালু</div>}
              
              <div className="pk-left">
                <span className="pk-id">PACKAGE // {pkg.id}</span>
                <h3 className="pk-title">{pkg.name}</h3>
                <p className="pk-desc">{pkg.tagline}</p>
                
                <div className="pk-price">
                  <span className="pk-taka">৳</span>
                  <span className="pk-num">{pkg.price}</span>
                </div>
              </div>

              <div className="pk-right">
                <ul className="pk-feats">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="pk-feat">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <button className="pk-cta" onClick={() => handleCta(pkg)}>
                  {pkg.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}