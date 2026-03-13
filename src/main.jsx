// ============================================================
// src/main.jsx — Digitalizen 2026 Entry Point
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import analytics from './analytics.js'

// ── Mount React ───────────────────────────────────────────
const rootEl = document.getElementById('root')
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// ── Initialize all tracking after mount ───────────────────
// Deferred so it never blocks First Contentful Paint
requestIdleCallback
  ? requestIdleCallback(() => analytics.init())
  : setTimeout(() => analytics.init(), 1)

// ── Remove hard-coded static hero from index.html ─────────
// Fades out cleanly once React has rendered
const staticWrapper = document.getElementById('static-hero-wrapper')
if (staticWrapper) {
  requestAnimationFrame(() => {
    staticWrapper.style.transition = 'opacity 0.15s ease'
    staticWrapper.style.opacity = '0'
    staticWrapper.style.pointerEvents = 'none'
    setTimeout(() => staticWrapper.remove(), 150)
  })
}
