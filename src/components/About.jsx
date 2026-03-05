import './About.css'

const values = [
  { emoji: '🎯', title: 'ডেটা-ড্রিভেন', desc: 'প্রতিটি সিদ্ধান্ত ডেটার উপর ভিত্তি করে, অনুমানের উপর নয়।' },
  { emoji: '💡', title: 'স্বচ্ছতা', desc: 'প্রতিটি টাকা কোথায় যাচ্ছে তা আপনি সবসময় দেখতে পাবেন।' },
  { emoji: '🤝', title: 'পার্টনারশিপ', desc: 'আমরা ভেন্ডর নই — আপনার ডিজিটাল গ্রোথ পার্টনার।' },
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
               বাংলাদেশের বিজনেস-ফ্রেন্ডলি ডিজিটাল মার্কেটিং এজেন্সি
            </div>
            <h2 className="about-heading">
              আমরা শুধু অ্যাড চালাই না —<br />
              <span className="about-blue">আপনার টোটাল ডিজিটাল মার্কেটিং কভার করি</span>
            </h2>
            <p className="about-desc">
              Digitalizen একটি রেজাল্ট-ফোকাসড পারফরম্যান্স মার্কেটিং এজেন্সি। আমরা সোশ্যাল মিডিয়া অ্যাডসের মাধ্যমে সত্যিকারের স্কেলেবল গ্রোথ দিতে কাজ করি।
            </p>
            <p className="about-desc">
              আমাদের সহজ মেথড: টেস্ট করো, ডেটা দেখো, স্কেল করো। আমরা বিশ্বাস করি আপনার ইনভেস্ট করা প্রতিটি টাকার প্রপার রিটার্ন থাকা উচিত।
            </p>

            <div className="about-stats">
              <div className="about-stat">
                <span className="about-stat__num">৯+</span>
                <span className="about-stat__label">বছরের অভিজ্ঞতা</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">২৩,০০০+</span>
                <span className="about-stat__label">সফল ক্যাম্পেইন</span>
              </div>
              <div className="about-stat">
                <span className="about-stat__num">৩,৬০০+</span>
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
              <img
                src="https://avatars.githubusercontent.com/u/112099343?v=4"
                alt="ফাউন্ডার — Billah"
                className="founder-img"
              />
            </div>

            <div className="founder-info">
              <div className="founder-badge">ফাউন্ডার ও রেইনমেকার</div>
              <h3 className="founder-name">Masum Billah</h3>
              <p className="founder-bio">
                ৯+ বছরের অভিজ্ঞতা, ০% ফেক প্রমিজ। সোশ্যাল মিডিয়া অ্যাডস আর ডেটা-ড্রিভেন স্ট্র্যাটেজিতে আপনার বিজনেসের রিয়েল গ্রোথ নিশ্চিত করি।
              </p>

              <div className="founder-links">
                <a
                  href="https://github.com/billahdotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-link founder-link--x"
                  aria-label="GitHub প্রোফাইল"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  billahdotdev
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
                {/*
                <a
                  href="https://linkedin.com/in/billahdotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-link founder-link--linkedin"
                  aria-label="LinkedIn প্রোফাইল"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>

                <a
                  href="https://dev.to/billahdotdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="founder-link founder-link--devto"
                  aria-label="Dev.to প্রোফাইল"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z"/>
                  </svg>
                  Dev.to
                </a>
                */}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
