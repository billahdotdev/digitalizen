import React, { useState, useEffect, useRef, useCallback } from 'react';
import './InstallButton.css';

/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.

   PWA install is a very high-intent signal — a user
   who installs your app is likely to convert. Every
   step of the funnel is tracked separately so you
   can build a retargeting audience around each stage.
══════════════════════════════════════════════════ */
let _seq = 0;
const genEventId = () => `pwa_${Date.now()}_${++_seq}`;

const track = (ev, params = {}) => {
  const event_id = genEventId();
  window.fbq?.(
    'track', ev,
    { ...params, event_source_url: window.location.href },
    { eventID: event_id }
  );
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event:                 'meta_' + ev.toLowerCase().replace(/\s+/g, '_'),
    meta_event_name:       ev,
    meta_event_id:         event_id,
    meta_event_source_url: window.location.href,
    ...params,
  });
};

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton,     setShowButton]     = useState(false);

  // Track time from prompt shown to user clicking — quality signal
  const shownAtRef   = useRef(null);
  // Prevent firing "prompt shown" more than once
  const promptFired  = useRef(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
      shownAtRef.current = Date.now();

      // ViewContent — browser offered the install prompt (user is eligible)
      // Only fires once per session
      if (!promptFired.current) {
        promptFired.current = true;
        track('ViewContent', {
          content_name:     'PWA Install Prompt Available',
          content_category: 'PWA',
          content_ids:      ['pwa_install'],
        });
      }
    };

    // appinstalled — fires when the OS confirms install completed
    // (catches installs triggered outside our button too)
    const handleAppInstalled = () => {
      track('CompleteRegistration', {
        content_name:     'PWA Installed (OS Confirmed)',
        content_category: 'PWA',
        content_ids:      ['pwa_install'],
        currency:         'BDT',
        value:            0,
      });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'pwa_installed_os_confirmed' });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;

    const timeToClick = shownAtRef.current
      ? Math.round((Date.now() - shownAtRef.current) / 1000)
      : 0;

    // InitiateCheckout — user clicked the install button (high intent)
    track('InitiateCheckout', {
      content_name:          'PWA Install Button Clicked',
      content_category:      'PWA',
      content_ids:           ['pwa_install'],
      currency:              'BDT',
      value:                 0,
      time_to_click_seconds: timeToClick,
    });

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // Lead — user accepted the OS install dialog
      track('Lead', {
        content_name:          'PWA Install Accepted',
        content_category:      'PWA',
        content_ids:           ['pwa_install'],
        currency:              'BDT',
        value:                 0,
        time_to_click_seconds: timeToClick,
      });
      setDeferredPrompt(null);
      setShowButton(false);
    } else {
      // Track dismissals — useful for re-targeting dismissed users
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event:                 'pwa_install_dismissed',
        time_to_click_seconds: timeToClick,
      });
    }
  }, [deferredPrompt]);

  if (!showButton) return null;

  return (
    <button
      className="pwa-install-button"
      onClick={handleInstallClick}
      aria-label="অ্যাপটি ইনস্টল করুন"
    >
      <span className="pwa-icon">📲</span>
      <span className="pwa-text">Install App</span>
    </button>
  );
};

export default InstallButton;
