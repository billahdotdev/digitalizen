import './About.css'

const values = [
  { emoji: '🎯', title: 'ডেটা-চালিত', desc: 'প্রতিটি সিদ্ধান্ত ডেটার উপর ভিত্তি করে, অনুমানের উপর নয়।' },
  { emoji: '💡', title: 'স্বচ্ছতা', desc: 'প্রতিটি টাকা কোথায় যাচ্ছে তা আপনি সবসময় দেখতে পাবেন।' },
  { emoji: '🤝', title: 'পার্টনারশিপ', desc: 'আমরা ভেন্ডর নই — আমরা আপনার গ্রোথ পার্টনার।' },
]

export default function About() {
  return (
    <section id="about" className="about-section" aria-label="আমাদের সম্পর্কে">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৫</span>
          <span className="section-title-right">আমাদের সম্পর্কে</span>
        </div>

        <div className="about-grid">
          <div className="about-main">
            <div className="about-badge">
              <span className="about-badge-dot" aria-hidden="true"></span>
              বাংলাদেশের ডিজিটাল মার্কেটিং এজেন্সি
            </div>
            <h2 className="about-heading">
              আমরা শুধু অ্যাড চালাই না —<br />
              <span className="about-blue">ব্যবসা বাড়াই</span>
            </h2>
            <p className="about-desc">
              Digitalizen একটি পারফরম্যান্স মার্কেটিং এজেন্সি। আমরা ছোট ও মাঝারি বাংলাদেশি ব্যবসাগুলোকে মেটা অ্যাডসের মাধ্যমে সত্যিকারের গ্রোথ দিতে কাজ করি।
            </p>
            <p className="about-desc">
              আমাদের পদ্ধতি সহজ: টেস্ট করো, ডেটা দেখো, স্কেল করো। আমরা বিশ্বাস করি প্রতিটি টাকা হিসাব করা উচিত।
            </p>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat__num">৫+</span>
                <span className="about-stat__label">বছরের অভিজ্ঞতা</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">২০০+</span>
                <span className="about-stat__label">সফল ক্যাম্পেইন</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">৫০+</span>
                <span className="about-stat__label">সন্তুষ্ট ক্লায়েন্ট</span>
              </div>
            </div>
          </div>

          <div className="about-values" aria-label="আমাদের মূল্যবোধ">
            {values.map((v, i) => (
              <div key={i} className="value-card">
                <span className="value-emoji" aria-hidden="true">{v.emoji}</span>
                <div>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Screenshot Gallery ── */}
        <div className="about-screenshots" aria-label="ক্যাম্পেইন স্ক্রিনশট">
          <p className="screenshots-label">Ads Manager থেকে সরাসরি</p>
          <div className="screenshots-grid">
            {[
              { caption: 'ক্যাম্পেইন ড্যাশবোর্ড', file: 'placeholder-1.svg', real: 'campaign-dashboard.png' },
              { caption: 'ROAS রিপোর্ট', file: 'placeholder-2.svg', real: 'roas-report.png' },
              { caption: 'অডিয়েন্স ইনসাইট', file: 'placeholder-3.svg', real: 'audience-insight.png' },
            ].map((s, i) => (
              <div key={i} className="screenshot-card">
                {/* To replace: put real screenshot at /public/screenshots/{real} and update src */}
                <div className="screenshot-img-wrap">
                  <img
                    src={`/screenshots/${s.file}`}
                    alt={s.caption}
                    className="screenshot-img"
                  />
                </div>
                <p className="screenshot-caption">{s.caption}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Founder Section ── */}
        <div className="founder-section" aria-label="ফাউন্ডার">
          <div className="founder-card">
            <div className="founder-img-wrap">
              {/* Replace src with /images/founder.jpg once you have the real photo */}
              <img
                src="/images/founder.svg"
                alt="ফাউন্ডার — Billah"
                className="founder-img"
              />
            </div>

            <div className="founder-info">
              <div className="founder-badge">ফাউন্ডার ও সিইও</div>
              <h3 className="founder-name">Billah</h3>
              <p className="founder-bio">
                মেটা অ্যাডসে ৫+ বছরের অভিজ্ঞতা। বাংলাদেশের ছোট ব্যবসাগুলোকে ডিজিটালে এগিয়ে নিয়ে যাওয়াই আমার লক্ষ্য। ডেটার মাধ্যমে সিদ্ধান্ত নিই, ফলাফলে বিশ্বাস রাখি।
              </p>

              <div className="founder-links">
                <a
                  href="https://x.com/billahdotde"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-link founder-link--x"
                  aria-label="Twitter/X প্রোফাইল"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @billahdotde
                </a>
                <a
                  href="https://billah.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-link founder-link--web"
                  aria-label="ব্যক্তিগত ওয়েবসাইট"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  billah.dev
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
