import { useState, useEffect, useCallback } from 'react'
import './InstallButton.css'

/* ──────────────────────────────────────────────────
   InstallButton — PWA Add-to-Home-Screen prompt
   ─────────────────────────────────────────────────
   • Listens for the browser's `beforeinstallprompt`
   • Shows a subtle bottom banner after 30s on-page
   • Tracks installs via GA4 dataLayer
   • Hides permanently once installed or dismissed
────────────────────────────────────────────────── */
export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible]               = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Show banner after 30 s of page time
      setTimeout(() => setVisible(true), 30_000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'pwa_install', pwa_outcome: outcome })
    setDeferredPrompt(null)
    setVisible(false)
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    setVisible(false)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'pwa_install_dismissed' })
  }, [])

  if (!visible || !deferredPrompt) return null

  return (
    <div
      className={`install-banner${visible ? ' install-banner--visible' : ''}`}
      role="region"
      aria-label="অ্যাপ ইনস্টল করুন"
    >
      <div className="install-banner__content">
        <span className="install-banner__icon" aria-hidden="true">📲</span>
        <p className="install-banner__text">
          <strong>Digitalizen</strong> অ্যাপ ইনস্টল করুন — অফলাইনেও কাজ করবে
        </p>
      </div>
      <div className="install-banner__actions">
        <button
          className="install-banner__install-btn"
          onClick={handleInstall}
          aria-label="অ্যাপ ইনস্টল করুন"
        >
          ইনস্টল
        </button>
        <button
          className="install-banner__dismiss-btn"
          onClick={handleDismiss}
          aria-label="বাতিল করুন"
        >
          পরে
        </button>
      </div>
    </div>
  )
}
