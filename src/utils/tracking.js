// tracking.js — analytics brain (Meta CAPI + GA4 + custom events)

const px  = (...a) => typeof window.fbq  === 'function' && window.fbq(...a);
const ga  = (...a) => typeof window.gtag === 'function' && window.gtag(...a);

export async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function buildCapiPayload(eventName, customData = {}, userData = {}) {
  return {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id:   `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    action_source: 'website',
    event_source_url: window.location.href,
    user_data: { client_user_agent: navigator.userAgent, ...userData },
    custom_data: customData,
  };
}

export function initTracking() {
  _trackScrollDepth();
  _trackTimeOnPage();
}

const _scrollFired = new Set();
function _trackScrollDepth() {
  const onScroll = () => {
    const pct = Math.round(((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100);
    [25, 50, 75, 90, 100].forEach(m => {
      if (pct >= m && !_scrollFired.has(m)) {
        _scrollFired.add(m);
        ga('event', 'scroll_depth', { depth_percent: m });
        px('trackCustom', 'ScrollDepth', { depth: m });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

function _trackTimeOnPage() {
  [30, 60, 120, 300].forEach(sec => {
    setTimeout(() => {
      ga('event', 'time_on_page', { seconds: sec });
      px('trackCustom', 'TimeOnPage', { seconds: sec });
    }, sec * 1000);
  });
}

const _sectionFired = new Set();
export function trackSectionView(sectionId, extraData = {}) {
  if (typeof window === 'undefined') return () => {};
  const el = document.getElementById(sectionId);
  if (!el) return () => {};
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !_sectionFired.has(sectionId)) {
      _sectionFired.add(sectionId);
      const event_id = `ViewContent_${sectionId}_${Date.now()}`;
      ga('event', 'section_view', { section_id: sectionId, event_id, ...extraData });
      px('track', 'ViewContent', { content_name: sectionId, ...extraData }, { eventID: event_id });
      // Once fired, no need to keep observing
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(el);
  // Always return a cleanup function so useEffect can disconnect on unmount
  return () => observer.disconnect();
}

export function trackCTA(label, location = 'unknown', extra = {}) {
  const event_id = `CTAClick_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  ga('event', 'cta_click', { cta_label: label, cta_location: location, event_id, ...extra });
  px('trackCustom', 'CTAClick', { label, location, ...extra }, { eventID: event_id });
}

export function trackWhatsApp(source = 'unknown') {
  const event_id = `Contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  ga('event', 'whatsapp_click', { source, event_id });
  px('track', 'Contact', { content_name: 'whatsapp', source }, { eventID: event_id });
}

export function trackChatbotOpen(source = 'chatbot_section') {
  const event_id = `Lead_chatbot_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  ga('event', 'chatbot_open', { source, event_id });
  px('trackCustom', 'ChatbotOpen', { source });
  px('track', 'Lead', { content_name: 'chatbot_engagement', source }, { eventID: event_id });
}

export function trackFormStart(formName = 'contact') {
  ga('event', 'form_start', { form_name: formName });
  px('trackCustom', 'FormStart', { form_name: formName });
}

export function trackFormSubmit(formName = 'contact', capiUserData = {}) {
  const event_id = `Lead_form_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  ga('event', 'form_submit', { form_name: formName, event_id });
  px('track', 'Lead', { content_name: formName, status: 'submitted' }, { eventID: event_id });
  return buildCapiPayload('Lead', { content_name: formName }, capiUserData);
}

export function trackFormError(formName = 'contact', reason = 'unknown') {
  ga('event', 'form_error', { form_name: formName, reason });
  px('trackCustom', 'FormError', { form_name: formName, reason });
}

export function trackPricingCTA(planName, planValue = 0) {
  const event_id = `InitiateCheckout_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  ga('event', 'select_item', {
    item_list_id: 'pricing',
    items: [{ item_id: planName, item_name: planName, price: planValue, currency: 'BDT' }],
    event_id,
  });
  px('track', 'InitiateCheckout',
    { content_name: planName, value: planValue, currency: 'BDT' },
    { eventID: event_id }
  );
}

export function trackSpeedTestRun(url) {
  ga('event', 'speed_test_run', { tested_url: url });
  px('trackCustom', 'SpeedTestRun', { tested_url: url });
}

export function trackSpeedTestResult(score) {
  const tier = score >= 80 ? 'good' : score >= 50 ? 'ok' : 'bad';
  ga('event', 'speed_test_result', { score, tier });
  px('trackCustom', 'SpeedTestResult', { score, tier });
}


/* ════════════════════════════════════════════════════════════════════
   BOT LANDING — `/bot` Meta-ad-route helpers
   ──────────────────────────────────────────────────────────────────
   These three fire the events Meta's auction needs to optimize ads:
     • ViewContent     — landed on the page
     • Lead            — clicked the WhatsApp demo deep-link
     • InitiateCheckout — clicked "Get this for my business"

   Each Pixel event carries an event_id (deduplication-ready for the
   server-side Conversions API once you wire up CAPI later).
   ════════════════════════════════════════════════════════════════════ */

const _eventId = (name) =>
  `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export function trackBotLandingView() {
  const event_id = _eventId('ViewContent');
  ga('event', 'page_view', {
    page_path:  '/bot',
    page_title: 'AI Bot Demo Landing',
    event_id,
  });
  px('track', 'ViewContent', {
    content_name:     'AI Bot Landing',
    content_category: 'landing',
    content_ids:      ['bot_landing'],
  }, { eventID: event_id });
}

/**
 * Fired on any WhatsApp deep-link click on the bot landing page.
 * @param {string} source — hero_primary | how_section | final_try
 */
export function trackBotDemoStart(source = 'unknown') {
  const event_id = _eventId('Lead');
  ga('event', 'bot_demo_start', { source, event_id });
  px('track', 'Lead', {
    content_name:     'bot_demo_click',
    content_category: 'whatsapp_bot',
    source,
  }, { eventID: event_id });
  px('trackCustom', 'BotDemoStart', { source });
}

/**
 * Fired when visitor clicks "Get this for my business" — high-intent.
 * @param {string} source — final_inquiry | mid_inquiry | etc.
 */
export function trackBotInquiry(source = 'unknown') {
  const event_id = _eventId('InitiateCheckout');
  ga('event', 'bot_inquiry', { source, event_id });
  px('track', 'InitiateCheckout', {
    content_name: 'bot_for_my_business',
    value:         15000,
    currency:      'BDT',
    source,
  }, { eventID: event_id });
}
