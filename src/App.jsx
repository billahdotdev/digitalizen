// ============================================================
// src/App.jsx — Digitalizen 2026
//
// ● BrowserRouter (replaces HashRouter — clean URLs)
// ● Lazy-loaded below-fold components (FCP optimised)
// ● SEO component injected per route
// ● ScrollToTop + analytics.pageView on every navigation
// ● 404 catch-all route
// ============================================================

import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'

// ── Analytics (fire pageView on every route change) ───────
import analytics from './analytics.js'

// ── SEO (dynamic JSON-LD + meta per route) ────────────────
import SEO from './SEO.jsx'

// ── Critical path — load eagerly (above fold) ─────────────
import Nav  from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'

// ── Below-fold — lazy load (reduces initial JS bundle) ────

const Finder         = lazy(() => import('./components/Finder'))
const Packages       = lazy(() => import('./components/Packages'))
const Process        = lazy(() => import('./components/Process'))
const Proof          = lazy(() => import('./components/Proof'))
const About          = lazy(() => import('./components/About'))
const BookCall       = lazy(() => import('./components/BookCall'))
const Resources      = lazy(() => import('./components/Resources'))
const Faq            = lazy(() => import('./components/Faq'))
const Contact        = lazy(() => import('./components/Contact'))
const Gallery        = lazy(() => import('./components/Gallery'))
const Access         = lazy(() => import('./components/Access'))
const FreeResources  = lazy(() => import('./components/FreeResources'))

// ── Minimal loading skeleton (below-fold only) ─────────────
function SectionSkeleton({ height = '20vh' }) {
  return <div style={{ minHeight: height, background: 'transparent' }} aria-hidden="true" />
}

// ── Full-page loader (standalone pages) ───────────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0f1e',
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid rgba(59,130,246,0.15)',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── ScrollToTop + analytics pageView ──────────────────────
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    analytics.pageView(pathname)
  }, [pathname])
  return null
}

// ═══════════════════════════════════════════════════════════
// HOME — all sections in a single scroll
// ═══════════════════════════════════════════════════════════
function MainLayout() {
  return (
    <>
      <SEO page="home" />

      {/* PWA install banner — non-blocking */}
      <Suspense fallback={null}>
        <InstallButton />
      </Suspense>

      {/* Eagerly loaded — above the fold */}
      <Nav />
      <main>
        <Hero />

        {/* Below-fold sections — lazy loaded in one boundary */}
        <Suspense fallback={<SectionSkeleton height="40vh" />}>
          <Finder />
          <Packages />
          <Process />
          <Proof />
          <Faq />
          <About />
          <BookCall />
          <Resources />
          <Contact />
          <Gallery />
          <Access />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// /free — Free Resources page
// ═══════════════════════════════════════════════════════════
function FreeResourcesPage() {
  return (
    <>
      <SEO page="free" />
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <FreeResources />
      </Suspense>
      <Footer />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// /gallery — Portfolio / Gallery page
// ═══════════════════════════════════════════════════════════
function GalleryPage() {
  return (
    <>
      <SEO page="gallery" />
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <Gallery />
      </Suspense>
      <Footer />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// /access — Client Access page (gated, noindex)
// ═══════════════════════════════════════════════════════════
function AccessPage() {
  return (
    <>
      <SEO page="access" noindex />
      <Nav />
      <Suspense fallback={<PageLoader />}>
        <Access />
      </Suspense>
      <Footer />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// * — 404 Not Found
// ═══════════════════════════════════════════════════════════
function NotFoundPage() {
  return (
    <>
      <SEO
        page="home"
        title="Page Not Found — Digitalizen Bangladesh"
        description="The page you're looking for doesn't exist. Return to Digitalizen — Bangladesh's top digital marketing agency."
        noindex
      />
      <Nav />
      <main style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        background: '#0a0f1e',
      }}>
        <p style={{
          fontSize: '5rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg,#3b82f6,#06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '1.5rem',
        }}>
          404
        </p>
        <h1 style={{ color: '#f1f5f9', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          পেজটি পাওয়া যায়নি
        </h1>
        <p style={{ color: '#94a3b8', maxWidth: 400, lineHeight: 1.7, marginBottom: '2rem' }}>
          You might have followed a broken link. Let's get you back to scaling your business.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            color: '#fff',
            padding: '0.85rem 2rem',
            borderRadius: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '0.95rem',
          }}
        >
          ← হোমে ফিরে যান
        </a>
      </main>
      <Footer />
    </>
  )
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// BrowserRouter replaces HashRouter for clean URLs:
//   ✅ digitalizen.billah.dev/free       (not /#/free)
//   ✅ digitalizen.billah.dev/gallery    (not /#/gallery)
//   ✅ deeplink-indexable by Google + AI bots
//
// GitHub Pages 404.html handles direct URL loads.
// ═══════════════════════════════════════════════════════════
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"        element={<MainLayout />} />
        <Route path="/free"    element={<FreeResourcesPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/access"  element={<AccessPage />} />
        <Route path="*"        element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
