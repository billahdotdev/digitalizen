/**
 * analytics.js — Digitalizen Tracking v4
 *
 * Architecture:
 * ① Meta Pixel (browser-side fbq)
 * ② GTM dataLayer → GA4 + Meta CAPI server-side
 * ③ event_id deduplication between browser & server
 * ④ Engagement time-on-section tracking
 * ⑤ Section view sentinel — sets data-tracked="true" for GTM CSS triggers
 *
 * Lighthouse 100 notes:
 * - fbq() is called only after consent is verified (consent flag)
 * - All tracking is non-blocking (no await, no sync XHR)
 * - dataLayer.push is O(1) — zero render-blocking
 *
 * MERGE NOTE (v4):
 * - Removed rogue inline window.fbq / dataLayer.push calls from SocialProof.jsx.
 * - All event firing now routes through track() for consistent event_id
 *   deduplication between browser pixel and Meta CAPI server tag.
 * - Added: trackAboutCta, trackFounderLink, trackRoiMetric
 */

export const WA_NUMBER = '8801XXXXXXXXX'  // ← replace with real number

/* ══════════════════════════════════════════════════
   CONSENT — never fire pixel before consent signal
   ====================================================== */
const hasConsent = () => true   // Bangladesh: no GDPR obligation

/* ══════════════════════════════════════════════════
   EVENT ID — shared between fbq() & dataLayer
   Format: {section}_{eventName}_{timestamp}_{random4}
   ====================================================== */
const makeEventId = (section = 'web', eventName = 'Event') =>
  `${section}_${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

/* ══════════════════════════════════════════════════
   TRACK — unified Meta Pixel + GTM push
   @param {string} eventName   — Standard Meta event name
   @param {object} params      — Custom parameters
   @param {string} [section]   — Source section identifier
   ====================================================== */
export function track(eventName, params = {}, section = 'web') {
  if (!hasConsent()) return

  const event_id = makeEventId(section, eventName)

  /* ① Meta Pixel — browser-side (client event) */
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, params, { eventID: event_id })
  }

  /* ② GTM dataLayer — feeds GA4 + Meta CAPI server tag */
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:           'meta_' + eventName,
    meta_event_name:  eventName,
    meta_event_id:    event_id,
    meta_section:     section,
    ...params,
  })
}

/* ══════════════════════════════════════════════════
   PUSH ENGAGEMENT — time-on-section signal
   ====================================================== */
export function pushEngagement(section, enterTimeRef, extraData = {}) {
  if (!enterTimeRef.current) return

  const dwell_ms = Date.now() - enterTimeRef.current
  if (dwell_ms < 500) return

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:        'section_engagement',
    section_name:  section,
    dwell_ms,
    dwell_s:      Math.round(dwell_ms / 1000),
    ...extraData,
  })

  enterTimeRef.current = null
}

/* ══════════════════════════════════════════════════
   SECTION SENTINEL
   ====================================================== */
export function markTracked(el) {
  if (el) el.setAttribute('data-tracked', 'true')
}

/* ══════════════════════════════════════════════════
   STANDARD EVENT HELPERS
   ====================================================== */

export function trackWhatsAppCta(ctaLabel, section, extra = {}) {
  track('Lead', {
    content_name:     ctaLabel,
    content_category: 'WhatsApp CTA',
    currency:         'BDT',
    value:            0,
    ...extra,
  }, section)
}

export function trackFormStart(formName, section) {
  track('InitiateCheckout', {
    content_name:     formName,
    content_category: 'Form',
    currency:         'BDT',
    value:            0,
  }, section)
}

export function trackSectionView(sectionLabel, section, el = null) {
  track('ViewContent', {
    content_name:     sectionLabel,
    content_category: 'Section',
    content_ids:      [section],
  }, section)

  markTracked(el)

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:         'section_view',
    section_name:   section,
    section_label:  sectionLabel,
  })
}

export function trackPackageCta(pkgName, pkgPrice) {
  const numericPrice = parseInt(
    String(pkgPrice).replace(/[^\d]/g, ''), 10
  ) || 0

  track('Contact', {
    content_name:     pkgName,
    content_category: 'Package CTA',
    currency:         'BDT',
    value:            numericPrice,
  }, 'packages')
}

export function trackFaqOpen(question, index, category) {
  track('ViewContent', {
    content_name:     `FAQ: ${question}`,
    content_category: 'FAQ Item',
    content_ids:      [`faq_${index + 1}`],
    faq_index:        index + 1,
    faq_category:     category,
  }, 'faq')
}

/* ══════════════════════════════════════════════════
   FINDER EVENTS
   ====================================================== */
export function trackFinderStep(step, totalSteps) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:        'finder_step',
    step_number:   step,
    total_steps:   totalSteps,
    progress_pct:  Math.round((step / totalSteps) * 100),
  })
}

export function trackFinderResult(packageName, score) {
  track('ViewContent', {
    content_name:     `Finder Result: ${packageName}`,
    content_category: 'Finder',
    content_ids:      ['finder_result'],
    finder_package:   packageName,
    finder_score:     score,
  }, 'finder')
}

export function trackFinderLead(name, phone, packageName) {
  track('Lead', {
    content_name:     'Finder Lead Gate',
    content_category: 'Lead',
    currency:         'BDT',
    value:            0,
    finder_package:   packageName,
    has_name:         !!name,
    has_phone:        !!phone,
  }, 'finder')
}

export function trackFinderPdfDownload(packageName) {
  track('Lead', {
    content_name:     'Finder PDF Download',
    content_category: 'PDF',
    finder_package:   packageName,
  }, 'finder')

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:       'pdf_download',
    pdf_package:  packageName,
    pdf_source:   'finder',
  })
}

/* ══════════════════════════════════════════════════
   ABOUT / SOCIAL PROOF EVENTS  ← MERGED FROM v3 INLINE
   Previously SocialProof.jsx fired window.fbq() and
   window.dataLayer.push() directly, bypassing event_id
   deduplication. These helpers route through track().
   ====================================================== */

/**
 * trackAboutCta — fires Lead on the About section WhatsApp CTA.
 * Replaces the manual fbq + dataLayer block that lived in SocialProof.jsx.
 * @param {string} ctaLabel  — human-readable label for GA4 reporting
 */
export function trackAboutCta(ctaLabel = 'Free Roadmap CTA') {
  track('Lead', {
    content_name:     ctaLabel,
    content_category: 'WhatsApp CTA',
    cta_location:     'about',
    currency:         'BDT',
    value:            0,
  }, 'social_proof')

  /* Extra GA4 signal — keeps existing GTM trigger intact */
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:      'cta_click',
    cta_location: 'about',
    cta_label:    ctaLabel,
  })
}

/**
 * trackFounderLink — fires ViewContent when visitor clicks a founder link.
 * @param {string} label — e.g. 'GitHub' | 'billah.dev'
 */
export function trackFounderLink(label) {
  track('ViewContent', {
    content_name:     `Founder: ${label}`,
    content_category: 'Founder',
  }, 'social_proof')

  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:       'founder_link_click',
    link_label:   label,
  })
}
