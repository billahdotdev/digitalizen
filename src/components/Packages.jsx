import { useEffect, useRef, useCallback } from 'react'
import { track, WA_NUMBER } from '../lib/analytics.js'
import './Packages.css'

/* ─────────────────────────────────────────────
   Particle constellation — canvas renderer
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const COUNT   = 42
    const CONNECT = 80
    const SPEED   = 0.28

    let W, H, particles

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      W = canvas.width  = rect.width
      H = canvas.height = rect.height

      particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r:  Math.random() * 1.4 + 0.5,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT) {
            const alpha = (1 - dist / CONNECT) * 0.5
            ctx.strokeStyle = `rgba(60, 120, 255, ${alpha})`
            ctx.lineWidth   = 0.8
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(80, 160, 255, 0.75)'
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(init)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pk-obsidian-canvas"
      aria-hidden="true"
    />
  )
}

/* ─────────────────────────────────────────────
   Package data
───────────────────────────────────────────── */
const packages = [
  {
    id: '01',
    name: 'মাইক্রো টেস্ট',
    price: 'ফ্রি',
    tagline: '১০০% রিস্ক-ফ্রি এন্ট্রি',
    serial: '01. // গাইডলাইন আমাদের; সিদ্ধান্ত আপনার',
    period: '/লাইফটাইম',
    adChip: 'অ্যাড কস্ট আলাদা',
    features: [
      'ফ্রি বিজনেস অডিট',
      'গ্রোথ স্ট্র্যাটেজি ২০২৬',
      'হাই-কনভার্টিং অ্যাড সেটআপ',
      'ইউনিক কনটেন্ট আইডিয়া',
    ],
    cta: 'কুইক স্টার্ট',
    type: 'frosted',
  },
  {
    id: '02',
    name: 'মান্থলি কেয়ার',
    price: '১০,০০০',
    tagline: 'সবচেয়ে জনপ্রিয় চয়েস',
    serial: '02. // মার্কেটিং + ওয়েব ডেভ একসাথে',
    period: '/মাস',
    adChip: 'অ্যাড কস্ট আলাদা',
    features: [
      'AI সেলস ফানেল অটোমেশন',
      'ফ্রি আল্ট্রা-ফাস্ট ল্যান্ডিং পেজ (Vite + React)',
      'ফ্রি পিক্সেল ও কনভার্শন সেটআপ',
      'আনলিমিটেড অ্যাড ম্যানেজমেন্ট',
      'এক্সক্লুসিভ অ্যাড কনটেন্ট আইডিয়া',
    ],
    cta: 'আনলক প্রফিট',
    type: 'electric',
    popular: true,
  },
  {
    id: '03',
    name: 'ব্র্যান্ড কেয়ার',
    price: '৩০,০০০',
    tagline: 'বিজনেসের পূর্ণাঙ্গ সল্যুশন',
    serial: '03. // মার্কেটে ডমিন্যান্স',
    period: '/মাস',
    adChip: 'অ্যাড কস্ট আলাদা',
    features: [
      'অ্যাডভান্সড সেলস ফানেল অটোমেশন',
      'আনলিমিটেড ল্যান্ডিং পেজ সাপোর্ট (Vite + React)',
      'AI ডমিন্যান্স ও অথরিটি বিল্ডিং (AEO, GEO)',
      'কাস্টমার সেন্টিমেন্ট অ্যানালাইসিস',
      'মডার্ন ট্র্যাকিং (CAPI, GA4, TTK পিক্সেল)',
      'উইনিং অ্যাড কনটেন্ট আইডিয়া',
      'প্রিমিয়াম ব্র্যান্ড আইডেন্টিটি ডিজাইন',
    ],
    cta: 'বি দ্য অথরিটি',
    type: 'obsidian',
  },
]

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export default function Packages() {
  const handleCta = useCallback((pkg) => {
    const text = `Hi Digitalizen, I'm interested in the ${pkg.name} package.`
    track('Contact', { content_name: pkg.name, value: pkg.price })
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }, [])

  return (
    <section className="pk-section" id="pricing">
      {/* Grid background — matches Hero exactly */}
      <div className="pk-bg-grid" aria-hidden="true" />

      <div className="container">

        <div className="row-header">
          <span className="section-num">০০৫</span>
          <span className="section-title-right">{'// প্যাকেজ'}</span>
        </div>

        <h2 className="finder-heading">
          সবার জন্য এক সলিউশন নয়; আপনার চাই ইউনিক গ্রোথ প্ল্যান!
        </h2>

        <p className="finder-sub">
          প্রতিটি ব্যবসার চ্যালেঞ্জ আলাদা। আপনার বর্তমান প্রয়োজন এবং ভবিষ্যৎ পরিকল্পনা
          মাথায় রেখে আমাদের ৩টি প্ল্যান থেকে বেছে নিন।
        </p>

        <div className="pk-stack">
          {packages.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`pk-card pk-card--${pkg.type}`}
              style={{ '--index': i + 1 }}
            >
              <div className="pk-card-inner">

                {pkg.type === 'obsidian' && <ParticleCanvas />}

                {pkg.popular && (
                  <div className="pk-badge" aria-label="সবচেয়ে জনপ্রিয় প্যাকেজ">
                    BEST ROI
                  </div>
                )}

                <div className="pk-content-grid">

                  <div className="pk-main-info">
                    <span className="pk-serial">{pkg.serial}</span>
                    <h3 className="pk-title">{pkg.name}</h3>

                    <div className="pk-price">
                      <span className="pk-unit" aria-hidden="true">৳</span>
                      <span className="pk-amount">{pkg.price}</span>
                      <span className="pk-period">{pkg.period}</span>
                    </div>

                    <div className="pk-ad-chip" aria-label="বিজ্ঞাপনের খরচ আলাদা">
                      {pkg.adChip}
                    </div>
                  </div>

                  <div className="pk-details">
                    <ul className="pk-feat-list" role="list">
                      {pkg.features.map((f, j) => (
                        <li key={j} className="pk-feat-item">
                          <span className="pk-dot" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      className="pk-btn"
                      onClick={() => handleCta(pkg)}
                      aria-label={`${pkg.cta} — ${pkg.name}`}
                    >
                      <span>{pkg.cta}</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
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
