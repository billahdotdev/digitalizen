import { track, WA_NUMBER } from '../lib/analytics.js'
import './Packages.css'

const packages = [
  {
    id: '01',
    name: 'মাইক্রো টেস্ট',
    price: '১,৪৫০',
    tagline: 'দ্রুত রেজাল্ট দেখার জন্য',
    features: ['১টি হাই-কনভার্টিং ভিডিও অ্যাড', 'টার্গেটেড অডিয়েন্স রিসার্চ', '৩ দিন ম্যানেজমেন্ট'],
    cta: 'শুরু করুন',
    type: 'frosted'
  },
  {
    id: '02',
    name: 'গ্রোথ প্যাক',
    price: '৪,৯৫০',
    tagline: 'সবচেয়ে জনপ্রিয় চয়েস',
    features: ['৩টি কাস্টম ভিডিও অ্যাডস', 'পিক্সেল ও কনভার্শন সেটআপ', '১০ দিন ম্যানেজমেন্ট'],
    cta: 'গ্রোথ শুরু করুন',
    type: 'electric',
    popular: true
  },
  {
    id: '03',
    name: 'স্কেল আপ',
    price: '১২,০০০',
    tagline: 'বিজনেসের পূর্ণাঙ্গ সল্যুশন',
    features: ['আনলিমিটেড ক্রিয়েটিভস', 'CAPI ইমপ্লিমেন্টেশন', '৩০ দিন ম্যানেজমেন্ট'],
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
          <span className="section-num">০০৫</span>
          <span className="section-title-right">{"// প্যাকেজ"}</span>
        </div>
        <h2 className="finder-heading">সবার জন্য এক সলিউশন নয়; আপনার চাই ইউনিক গ্রোথ প্ল্যান!</h2>
        <p className="finder-sub">
          প্রতিটি ব্যবসার চ্যালেঞ্জ আলাদা। আপনার বর্তমান প্রয়োজন এবং ভবিষ্যৎ পরিকল্পনা মাথায় রেখে আমাদের ৩টি প্ল্যান থেকে বেছে নিন।
        </p>

        <div className="pk-stack">
          {packages.map((pkg, i) => (
            <div 
              key={pkg.id} 
              className={`pk-card pk-card--${pkg.type}`}
              style={{ '--index': i + 1 }}
            >
              <div className="pk-card-inner">
                {pkg.popular && <div className="pk-badge">BEST ROI</div>}
                
                <div className="pk-content-grid">
                  <div className="pk-main-info">
                    <span className="pk-serial">0{i+1}. // PACKAGE</span>
                    <h3 className="pk-title">{pkg.name}</h3>
                    <div className="pk-price">
                      <span className="pk-unit">৳</span>
                      <span className="pk-amount">{pkg.price}</span>
                    </div>
                  </div>

                  <div className="pk-details">
                    <ul className="pk-feat-list">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="pk-feat-item">
                          <span className="pk-dot" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className="pk-btn" onClick={() => handleCta(pkg)}>
                      <span>{pkg.cta}</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}