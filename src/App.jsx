import { useEffect, useRef, useState, useCallback, Component } from 'react'
import './App.css'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Nav            from './components/Nav'
import Hero           from './components/Hero'
import Finder         from './components/Finder'
import Process        from './components/Process'
import Packages       from './components/Packages'
import About          from './components/About'
import BookCall       from './components/BookCall'
import Resources      from './components/Resources'
import Faq            from './components/Faq'
import Contact        from './components/Contact'
import Footer         from './components/Footer'
import InstallButton  from './components/InstallButton'
import FreeResources  from './components/FreeResources'
import Access         from './components/Access'
import Gallery        from './components/Gallery'
import SEO            from './SEO'

/* ── WhatsApp number (single source of truth) ── */
const WA_NUMBER = '8801711992558'

/* ──────────────────────────────────────────────────
   STICKY CTA BAR — mobile-only, slides up from bottom
────────────────────────────────────────────────── */
function StickyCtaBar() {
  const [visible, setVisible] = useState(false)
  const ticking = useRef(false)

  useEffect(() => {
    const check = () => {
      const scrollY    = window.scrollY
      const docH       = document.documentElement.scrollHeight
      const winH       = window.innerHeight
      const nearFooter = scrollY + winH > docH - 160
      const pastFold   = scrollY > winH * 0.8
      setVisible(pastFold && !nearFooter)
      ticking.current = false
    }
    const onScroll = () => {
      if (!ticking.current) { requestAnimationFrame(check); ticking.current = true }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = useCallback(() => {
    const event_id = `sticky_${Date.now()}`
    window.fbq?.('track', 'InitiateCheckout',
      { content_name: 'Sticky CTA Bar', content_category: 'CTA', currency: 'BDT', value: 0 },
      { eventID: event_id }
    )
    window.ttq?.track('InitiateCheckout', { content_name: 'Sticky CTA Bar', currency: 'BDT', value: 0 })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'sticky_cta_click', meta_event_name: 'InitiateCheckout', meta_event_id: event_id, cta_location: 'sticky_bar' })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো Digitalizen! আমি ফ্রি কনসালটেশন কল করতে চাই।')}`, '_blank')
  }, [])

  return (
    <div className={`sticky-cta-bar${visible ? ' sticky-cta-bar--visible' : ''}`} role="complementary" aria-label="ফ্রি কনসালটেশন কল">
      <button className="sticky-cta-bar__btn" onClick={handleClick} aria-label="WhatsApp-এ ফ্রি কনসালটেশন কল বুক করুন">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        ফ্রি কনসালটেশন কল
      </button>
    </div>
  )
}

/* ── Analytics hooks ── */
function useAppAnalytics() {
  useEffect(() => {
    window.ttq?.page()
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'virtualPageView', page_path: window.location.href, page_title: document.title })
  }, [])
}

function useScrollDepth() {
  const fired = useRef(new Set())
  useEffect(() => {
    const milestones = [25, 50, 75, 100]
    const check = () => {
      const pct = Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100)
      milestones.forEach(m => {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m)
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({ event: 'scroll_depth', scroll_depth_pct: m })
        }
      })
    }
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])
}

/* ── Error Boundary ── */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'react_error', error_message: error?.message })
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <p className="error-boundary__title">কিছু একটা ভুল হয়েছে</p>
          <p className="error-boundary__sub">পেজটি রিলোড করুন অথবা WhatsApp-এ আমাদের জানান।</p>
          <button className="error-boundary__btn" onClick={() => window.location.reload()}>পেজ রিলোড করুন</button>
        </div>
      )
    }
    return this.props.children
  }
}

/* ── Main Layout (home page) ── */
function MainLayout() {
  useAppAnalytics()
  useScrollDepth()
  useEffect(() => { window.__removeLoader?.() }, [])

  return (
    <>
      <SEO page="home" />
      <InstallButton />
      <Nav />
      <main id="main-content">
        <Hero />
        <Finder />
        <Packages />
        <Process />
        <Faq />
        <About />
        <BookCall />
        <Resources />
        <Contact />
        <Gallery />
      </main>
      <Footer />
      <StickyCtaBar />
    </>
  )
}

/* ── 404 Page ── */
function NotFound() {
  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'page_not_found', page_path: window.location.href })
  }, [])

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'var(--font)', background:'var(--bg)', padding:'24px', textAlign:'center' }}>
      <p style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', color:'var(--blue)', textTransform:'uppercase', marginBottom:'12px' }}>404</p>
      <h1 style={{ fontSize:'1.8rem', fontWeight:900, color:'var(--text)', marginBottom:'12px' }}>পেজটি পাওয়া যাচ্ছে না</h1>
      <p style={{ color:'var(--muted)', marginBottom:'28px', lineHeight:1.6 }}>আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা ঠিকানা পরিবর্তন হয়েছে।</p>
      <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'var(--blue)', color:'#fff', padding:'14px 24px', borderRadius:'var(--radius-sm)', fontWeight:700, fontSize:'0.9rem', textDecoration:'none' }}>← হোমপেজে যান</a>
    </div>
  )
}

/* ──────────────────────────────────────────────────
   ROUTER
   ─────────────────────────────────────────────────
   ► HOW TO ADD A NEW ROUTE — see README.md
   1. Create src/components/MyPage.jsx + MyPage.css
   2. import MyPage from './components/MyPage'
   3. Add: <Route path="/my-page" element={<MyPage />} />
   4. Add Nav link in Nav.jsx drawer
   5. Add SEO config in src/SEO.jsx → PAGE_DEFAULTS
────────────────────────────────────────────────── */
export default function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path="/"        element={<MainLayout />} />
          <Route path="/free"    element={<FreeResources />} />
          <Route path="/access"  element={<Access />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  )
}
