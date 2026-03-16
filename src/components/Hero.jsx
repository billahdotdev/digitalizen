import { useEffect, useRef, useCallback } from 'react'
import { Smile } from 'lucide-react'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import './Hero.css'

export default function Hero() {
  const heroRef      = useRef(null)
  const enterTimeRef = useRef(null)
  const firedRef     = useRef(false)
  const ctaClicksRef = useRef(0)

  /* ── Section ViewContent + time-on-hero ── */
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !firedRef.current) {
        firedRef.current     = true
        enterTimeRef.current = Date.now()
        track('ViewContent', { content_name: 'Hero Section', content_category: 'Section', content_ids: ['hero'] }, 'hero')
      }
    }, { threshold: 0.3 })
    io.observe(el)

    /* time-on-hero + scroll-off signal */
    const push = () => pushEngagement('hero', enterTimeRef, { cta_clicks: ctaClicksRef.current })

    const scrollIo = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && firedRef.current) push()
    }, { threshold: 0 })
    scrollIo.observe(el)

    const onVis = () => { if (document.visibilityState === 'hidden') push() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', push)

    return () => {
      io.disconnect()
      scrollIo.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', push)
    }
  }, [])

  /* ── Primary CTA — WhatsApp ── */
  const handleMainCta = useCallback(() => {
    ctaClicksRef.current += 1
    track('InitiateCheckout', {
      content_name:     'Hero WhatsApp CTA',
      content_category: 'CTA',
      content_ids:      ['hero_wa_cta'],
      currency:         'BDT',
      value:            0,
    }, 'hero')
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো, ফ্রি কনসালটেশন কল বুক করতে চাই। ব্যবসা সম্পর্কে কথা বলতে চাই।')}`,
      '_blank'
    )
  }, [])

  /* ── Secondary CTA — scroll to About ── */
  const handleSecondaryCta = useCallback(() => {
    ctaClicksRef.current += 1
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'hero_secondary_cta', scroll_target: 'about' })
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <section className="hero" id="home" aria-label="Digitalizen পারফরম্যান্স মার্কেটিং" ref={heroRef}>
      <div className="hero__bg-grid" aria-hidden="true"></div>
      <div className="hero__bg-glow" aria-hidden="true"></div>

      <div className="container hero__inner">
        <div className="hero__badge">
          <span className="badge-dot"></span>
          ডিজিটাল অ্যাড এক্সপার্ট এজেন্সি
        </div>

        <h1 className="hero__headline">
          মেটা অ্যাডে<br />
          <span className="hero__blue">রিয়েল রেজাল্ট</span>
        </h1>

        <p className="hero__sub">
          আমরা টেস্ট করি, অপ্টিমাইজ করি এবং স্কেল করি।<br />
          শো-অফ মেট্রিক্স নয়, কনভার্শন আর একচুয়াল গ্রোথ।
        </p>

        <div className="hero__actions">
          <button className="btn-primary hero__btn-main" onClick={handleMainCta}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            ফ্রি কনসালটেশন কল বুক করুন
          </button>
          <button className="btn-ghost" onClick={handleSecondaryCta}>
            আরো জানতে চাই ↓
          </button>
        </div>

        <div className="hero__trust">
          <span className="trust-icon">🔒</span>
          <span>আমরা সার্ভিস বিক্রি করি না, বিজনেস স্কেল করি। আগে পারফরম্যান্স দেখুন, সিদ্ধান্ত পরে নিন।</span>
        </div>

        <button
          className="hero__salesperson"
          onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="আমাদের কাজ দেখুন"
        >
          <Smile className="hero__salesperson-face" size={22} strokeWidth={2} aria-hidden="true" />
          <span className="hero__salesperson-text">সেলস পারসন; যে কখনো ঘুমায় না</span>
        </button>

      </div>
    </section>
  )
}
