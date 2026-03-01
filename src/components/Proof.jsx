import './Proof.css'

const proofs = [
  {
    client: 'ফ্যাশন ব্র্যান্ড',
    icon: '👗',
    result: 'ROAS ৪.২x',
    detail: 'মাইক্রো টেস্ট থেকে মাসিক স্কেলে গেছে মাত্র ৬ সপ্তাহে। প্রতি মাসে ৫০+ অর্ডার।',
    budget: '৳৫০,০০০/মাস',
    change: '+৩২০%',
  },
  {
    client: 'ফুড ডেলিভারি',
    icon: '🍔',
    result: '৩২০% বেশি অর্ডার',
    detail: 'সাপ্তাহিক ক্রিয়েটিভ টেস্টে CTR দ্বিগুণ হয়েছে। CPC ৪৫% কমেছে।',
    budget: '৳২০,০০০/সপ্তাহ',
    change: '+৩২০%',
  },
  {
    client: 'অনলাইন কোর্স',
    icon: '📚',
    result: 'CPA ৬০% কমেছে',
    detail: 'লুকঅ্যালাইক অডিয়েন্স + রিটার্গেটিং কম্বোতে সেরা ফলাফল।',
    budget: '৳৩০,০০০/মাস',
    change: '-৬০%',
  },
]

export default function Proof() {
  return (
    <section id="proof" className="proof-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৪</span>
          <span className="section-title-right">প্রুফ</span>
        </div>

        <h2 className="proof-heading">রিয়েল ক্লায়েন্ট, রিয়েল রেজাল্ট</h2>
        <p className="proof-note">সংখ্যা মিথ্যা বলে না। আমাদের ক্লায়েন্টদের ফলাফল:</p>

        <div className="proof-list">
          {proofs.map((p, i) => (
            <div key={i} className="proof-card">
              <div className="proof-card__top">
                <div className="proof-client-info">
                  <span className="proof-client-icon" aria-hidden="true">{p.icon}</span>
                  <span className="proof-client">{p.client}</span>
                </div>
                <span className="proof-result">{p.result}</span>
              </div>
              <p className="proof-detail">{p.detail}</p>
              <div className="proof-footer">
                <span className="proof-budget">বাজেট: {p.budget}</span>
                <span className="proof-change">{p.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="proof-placeholder">
          <span className="placeholder-icon" aria-hidden="true">📊</span>
          <div>
            <p className="placeholder-title">স্ক্রিনশট ও কেস স্টাডি শীঘ্রই যোগ হবে</p>
            <p className="placeholder-sub">Ads Manager স্ক্রিনশট ও বিস্তারিত কেস স্টাডি প্রস্তুত হচ্ছে</p>
          </div>
        </div>
      </div>
    </section>
  )
}
