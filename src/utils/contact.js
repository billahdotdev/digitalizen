/* ────────────────────────────────────────────────────────────────────
   contact.js — Single source of truth for every outbound contact link.

   Two phone numbers. Two purposes. No drift.

     GENERAL  01711992558  →  Consultancy bookings, audit requests,
                              nav WhatsApp, footer social, sales inquiry,
                              package inquiries, contact form.

     BOT      01311773040  →  AI moderator demo, live bot try,
                              speed test bot fallback, every WhatsApp
                              link that drops the visitor into the
                              live AI conversation.

   If a button is asking for a human, it goes to GENERAL.
   If a button is asking for the bot, it goes to BOT.
   ──────────────────────────────────────────────────────────────────── */

export const WA = Object.freeze({
  GENERAL: '8801711992558',
  BOT:     '8801311773040',
});

/* Default messages so deep links open with context already pre filled. */
export const MSG = Object.freeze({
  CONSULT:     'হ্যালো! আমি Digitalizen এর সাথে ফ্রি কনসালটেশন বুক করতে চাই।',
  AUDIT:       'হ্যালো! আমি ফ্রি অডিট বুক করতে চাই।',
  CONTACT:     'হ্যালো! আমি Digitalizen এর সাথে কথা বলতে চাই।',
  BOT_TRY:     'হ্যালো! আমি Digitalizen এর AI Bot এ কথা বলতে চাই।',
  BOT_INQUIRY: 'হ্যালো! এই AI বটের মতো একটা আমার ব্যবসার জন্য চাই।',
});

const safe = (m) => encodeURIComponent(typeof m === 'string' ? m : String(m));

export const generalHref = (msg = MSG.CONTACT) =>
  `https://wa.me/${WA.GENERAL}?text=${safe(msg)}`;

export const botHref = (msg = MSG.BOT_TRY) =>
  `https://wa.me/${WA.BOT}?text=${safe(msg)}`;

/* Convenience: caller sites that already have a custom message but
   want to be explicit about which number it routes to.              */
export const waHref = (number, msg) => `https://wa.me/${number}?text=${safe(msg)}`;

/* GitHub landing page URLs for each portfolio piece. Swap these for
   the real live URLs once each project is published.                */
export const PROJECT_LINKS = Object.freeze({
  dhakateez: 'https://github.com/digitalizen-bd/dhakateez',
  auora:     'https://github.com/digitalizen-bd/auora',
  garmentik: 'https://github.com/digitalizen-bd/garmentik',
  resto:     'https://github.com/digitalizen-bd/resto',
});
