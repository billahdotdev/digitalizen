import { useCallback } from 'react'
import { track, WA_NUMBER } from '../lib/analytics.js'
import './Gallery.css'

const projects = [
  { id: 1, number: '001', title: 'DhakaTeez',    image: './images/1.jpg', url: 'https://billahdotdev.github.io/dhakateez/' },
  { id: 2, number: '002', title: 'Auora',         image: './images/2.jpg', url: 'https://billahdotdev.github.io/velore_bangla/' },
  { id: 3, number: '003', title: 'xyzxyz',        image: './images/3.jpg', url: '#' },
  { id: 4, number: '004', title: '@billahdotdev', image: './images/4.jpg', url: 'https://billah.dev' },
  { id: 5, number: '005', title: 'GARMENTIK',     image: './images/5.jpg', url: 'https://billahdotdev.github.io/garmentik/' },
  { id: 6, number: '006', title: 'resto',         image: './images/6.jpg', url: 'https://billahdotdev.github.io/resto/' },
]

const WA_MSG = encodeURIComponent('হ্যালো, আমার ব্যবসার জন্য একটি কাস্টম ল্যান্ডিং পেজ বানাতে চাই।')

export default function Gallery() {
  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`)
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`)
  }

  const handleWa = useCallback(() => {
    track('Contact', { content_name: 'Gallery CTA', content_category: 'CTA' }, 'gallery')
    window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank')
  }, [])

  return (
    <section className="gl-archive" id="gallery">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৩</span>
          <span className="section-title-right">{'// ২৪/৭ সেলস পারসন'}</span>
        </div>
        <h2 className="finder-heading">ল্যান্ডিং পেজ কি আপনার ব্যবসার গল্প বলে?</h2>
        <p className="finder-sub">১ সেকেন্ড দেরি = ২০% কনভার্সন লস, ৩ সেকেন্ড = ৪৭% কাস্টমার চিরতরে হারায়, ৫ সেকেন্ড = ৯০% বাউন্স ও গুগল র‍্যাঙ্কিং হারানো।</p>
        <p className="finder-sub">মনে রাখবেন: ২০২৬ সালে স্লো, সাধারণ ল্যান্ডিং পেজ মানে হচ্ছে কাস্টমারের মুখের সামনে দরজা বন্ধ করে দেওয়া। আপনি কি এই ঝুঁকি নিতে প্রস্তুত?</p>
        <div className="gl-stack">

          {/* ── Cards 001–006 ── */}
          {projects.map((project, i) => (
            <div key={project.id} className="gl-frame-wrapper" style={{ '--index': i }}>
              <article className="gl-frame">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gl-window"
                  aria-label={`${project.title} — লাইভ সাইট দেখুন`}
                  onTouchMove={handleTouch}
                >
                  <div className="gl-parallax-box">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="gl-img"
                      width="900"
                      height="600"
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={i === 0 ? 'high' : 'auto'}
                      decoding={i === 0 ? 'sync' : 'async'}
                    />
                  </div>
                  <div className="gl-hud" aria-hidden="true">
                    <div className="gl-hud-btn">
                      <span>লাইভ দেখুন</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </div>
                  <div className="gl-glass-sheen" aria-hidden="true" />
                </a>
                <div className="gl-frame-bottom">
                  <div>
                    <span className="gl-id">{project.number}</span>
                    <h3 className="gl-name">{project.title}</h3>
                  </div>
                  <span className="gl-pulse" aria-label="লাইভ" />
                </div>
              </article>
            </div>
          ))}

          {/* ── Card 007 — the ask ── */}
          <div className="gl-frame-wrapper" style={{ '--index': 6 }}>
            <article className="gl-frame gl-frame--ask">

              {/* Same window dimensions, dark fill, no image */}
              <div className="gl-window gl-window--ask" aria-hidden="true">
                <p className="gl-ask__headline">
                  আপনারটা<br />
                  <em>কবে<br />বানাবেন?</em>
                </p>
              </div>

              <div className="gl-frame-bottom">
                <div>
                  <span className="gl-id">007</span>
                  <h3 className="gl-name">আপনার ব্র্যান্ড</h3>
                </div>
                {/* WA button replaces pulse dot */}
                <button
                  className="gl-ask__btn"
                  onClick={handleWa}
                  aria-label="WhatsApp-এ কাস্টম ল্যান্ডিং পেজ নিয়ে কথা বলুন"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>এখনই বানাই</span>
                </button>
              </div>

            </article>
          </div>

        </div>
      </div>
    </section>
  )
}
