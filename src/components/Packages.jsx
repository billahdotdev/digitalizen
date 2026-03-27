import { useEffect, useRef, useCallback } from 'react'
import { track, WA_NUMBER } from '../lib/analytics.js'
import './Packages.css'

/* ─────────────────────────────────────────────
   Particle constellation — canvas renderer
   Lightweight: ~40 nodes, no lib, RAF loop.
   Draws connected dots that drift slowly.
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Respect reduced-motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const COUNT    = 42
    const CONNECT  = 80   // max px to draw edge
    const SPEED    = 0.28

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

      // Update positions
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      // Draw edges
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

      // Draw nodes
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
    price: '০',
    tagline: 'দ্রুত রেজাল্ট দেখার জন্য',
    features: [
      '১টি হাই-কনভার্টিং ভিডিও অ্যাড',
      'টার্গেটেড অডিয়েন্স রিসার্চ',
      '৩ দিন ম্যানেজমেন্ট',
    ],
    cta: 'শুরু করুন',
    type: 'frosted',
  },
  {
    id: '02',
    name: 'গ্রোথ প্যাক',
    price: '১০,০০০',
    tagline: 'সবচেয়ে জনপ্রিয় চয়েস',
    features: [
      '৩টি কাস্টম ভিডিও অ্যাডস',
      'পিক্সেল ও কনভার্শন সেটআপ',
      '১০ দিন ম্যানেজমেন্ট',
    ],
    cta: 'গ্রোথ শুরু করুন',
    type: 'electric',
    popular: true,
  },
  {
    id: '03',
    name: 'স্কেল আপ',
    price: '৩০,০০০',
    tagline: 'বিজনেসের পূর্ণাঙ্গ সল্যুশন',
    features: [
      'আনলিমিটেড ক্রিয়েটিভস',
      'CAPI ইমপ্লিমেন্টেশন',
      '৩০ দিন ম্যানেজমেন্ট',
    ],
    cta: 'স্কেল করুন',
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

                {/* Particle canvas — obsidian only */}
                {pkg.type === 'obsidian' && <ParticleCanvas />}

                {/* Popular badge */}
                {pkg.popular && (
                  <div className="pk-badge" aria-label="সবচেয়ে জনপ্রিয় প্যাকেজ">
                    BEST ROI
                  </div>
                )}

                <div className="pk-content-grid">

                  {/* Left: identity + price */}
                  <div className="pk-main-info">
                    <span className="pk-serial">0{i + 1}. // PACKAGE</span>
                    <h3 className="pk-title">{pkg.name}</h3>

                    {/* Price with /মাস */}
                    <div className="pk-price">
                      <span className="pk-unit" aria-hidden="true">৳</span>
                      <span className="pk-amount">{pkg.price}</span>
                      <span className="pk-period">/মাস</span>
                    </div>

                    {/* Ad cost chip */}
                    <div className="pk-ad-chip" aria-label="বিজ্ঞাপনের খরচ আলাদা">
                      ad cost আলাদা
                    </div>
                  </div>

                  {/* Right: features + CTA */}
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
