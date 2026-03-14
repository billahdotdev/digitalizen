/* ════════════════════════════════════════════════════════
   analytics.js — Digitalizen Unified Tracking Utility
   ─────────────────────────────────────────────────────
   Fires three destinations in parallel:
   ① window.fbq  — Meta Pixel (browser-side)
   ② window.ttq  — TikTok Pixel (browser-side)
   ③ window.dataLayer — GTM → GA4 + server-side CAPI tag

   The shared event_id is passed to both fbq() and dataLayer
   so your GTM server container can deduplicate the Meta CAPI
   call against the browser Pixel event.

   Replace placeholder IDs in index.html before deploying:
     GTM_ID:        GTM-XXXXXXX
     META_PIXEL_ID: XXXXXXXXXXXXXXXXXX  (in fbq('init'))
     TT_PIXEL_ID:   XXXXXXXXXXXXXXXXXX  (in ttq.load())
════════════════════════════════════════════════════════ */

/* ── WhatsApp number (single source of truth) ── */
export const WA_NUMBER = '8801711992558'

/* ── Event ID generator — prefix per module ── */
export const makeEventId = (prefix = 'ev') =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

/* ── Unified track function ──────────────────────────
   @param {string}  ev      — Meta standard event name
                               e.g. 'ViewContent', 'Lead'
   @param {object}  params  — Custom parameters passed to
                               all three destinations
   @param {string}  prefix  — Short prefix for event_id
                               (helps identify source in logs)
── */
export const track = (ev, params = {}, prefix = 'ev') => {
  const event_id  = makeEventId(prefix)
  const sourceUrl = window.location.href

  /* ① Meta Pixel */
  window.fbq?.(
    'track', ev,
    { ...params, event_source_url: sourceUrl },
    { eventID: event_id }
  )

  /* ② TikTok Pixel
       TikTok uses different event names — map Meta → TikTok */
  const ttqEventMap = {
    ViewContent:      'ViewContent',
    InitiateCheckout: 'InitiateCheckout',
    AddToCart:        'AddToCart',
    Lead:             'SubmitForm',
    Purchase:         'CompletePayment',
    Contact:          'Contact',
    Search:           'Search',
  }
  const ttqEvent = ttqEventMap[ev] || 'ViewContent'
  window.ttq?.track(ttqEvent, {
    content_name: params.content_name ?? ev,
    content_id:   params.content_ids?.[0] ?? undefined,
    currency:     params.currency ?? 'BDT',
    value:        params.value   ?? 0,
  })

  /* ③ dataLayer — GTM server container → CAPI + GA4 */
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:                 'meta_' + ev.toLowerCase().replace(/\s+/g, '_'),
    meta_event_name:       ev,
    meta_event_id:         event_id,   /* ← CAPI dedup key */
    meta_event_source_url: sourceUrl,
    ...params,
  })
}

/* ── Section engagement helper —────────────────────
   Call on visibilitychange / beforeunload to push
   time-on-section data to GTM / GA4.
── */
export const pushEngagement = (section, enterTimeRef, extraData = {}) => {
  if (!enterTimeRef.current) return
  const secs = Math.round((Date.now() - enterTimeRef.current) / 1000)
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event:                   'section_engagement',
    section,
    time_on_section_seconds: secs,
    ...extraData,
  })
  enterTimeRef.current = null
}
