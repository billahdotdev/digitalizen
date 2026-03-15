// ============================================================
// api/capi.js — Meta Conversions API Server-Side Endpoint
//
// PURPOSE:
//   Receives browser-side pixel events from analytics.js
//   and forwards them to Meta's Graph API server-side.
//   This eliminates ~30-40% data loss from:
//     ● Ad blockers (very common in Dhaka)
//     ● iOS 14+ ITP cookie restrictions
//     ● Browser privacy modes
//
// DEPLOYMENT OPTIONS (pick one):
//   A) Cloudflare Workers — free tier, lowest latency from BD
//      → Deploy at: capi.digitalizen.billah.dev
//      → wrangler deploy api/capi.js
//
//   B) Vercel Edge Function
//      → Rename to api/capi/route.js, wrap in NextResponse
//
//   C) Netlify Function
//      → Move to netlify/functions/capi.js
//
// SETUP:
//   1. Meta Events Manager → Settings → Conversions API
//   2. Generate Access Token (copy it)
//   3. Set CAPI_ACCESS_TOKEN in Cloudflare Worker env vars
//   4. Set META_PIXEL_ID in Cloudflare Worker env vars
//   5. Update CAPI_ENDPOINT in src/analytics.js to point here
//
// DEDUPLICATION:
//   Both browser fbq() and this server event carry the same
//   event_id → Meta deduplicates, counts only once.
// ============================================================

// ─── Cloudflare Worker Entry Point ───────────────────────
export default {
  async fetch(request, env) {
    return handleCAPI(request, env);
  },
};

// ─── Also export as named handler for Netlify/Vercel ─────
export async function handler(event, context) {
  const request = new Request(event.rawUrl || 'https://api/', {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body,
  });
  const env = {
    META_PIXEL_ID: process.env.META_PIXEL_ID,
    CAPI_ACCESS_TOKEN: process.env.CAPI_ACCESS_TOKEN,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'https://digitalizen.billah.dev',
  };
  const response = await handleCAPI(request, env);
  return {
    statusCode: response.status,
    body: await response.text(),
    headers: Object.fromEntries(response.headers.entries()),
  };
}

// ─── Core Handler ─────────────────────────────────────────
async function handleCAPI(request, env) {
  const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || 'https://digitalizen.billah.dev';

  // ── CORS preflight ──
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(ALLOWED_ORIGIN),
    });
  }

  // ── Only accept POST ──
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  // ── Validate environment variables ──
  const PIXEL_ID     = env.META_PIXEL_ID;
  const ACCESS_TOKEN = env.CAPI_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error('[CAPI] Missing META_PIXEL_ID or CAPI_ACCESS_TOKEN env vars');
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  // ── Parse request body ──
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  // ── Extract client IP (used for matching — never stored) ──
  const clientIP = request.headers.get('CF-Connecting-IP')   // Cloudflare
    || request.headers.get('X-Forwarded-For')?.split(',')[0]  // Proxies
    || request.headers.get('X-Real-IP')
    || null;

  // ── Build CAPI event payload ──
  const eventTime = body.event_time || Math.floor(Date.now() / 1000);

  const capiPayload = {
    data: [
      {
        event_name:        body.event_name,
        event_id:          body.event_id,        // For deduplication with browser pixel
        event_time:        eventTime,
        event_source_url:  body.event_source_url || 'https://digitalizen.billah.dev/',
        action_source:     'website',

        // ── User Data (for matching — all hashed by Meta) ──
        user_data: {
          client_ip_address: clientIP,
          client_user_agent: body.user_data?.client_user_agent || '',
          fbp:               body.user_data?.fbp  || null,  // _fbp cookie
          fbc:               body.user_data?.fbc  || null,  // _fbc cookie
          // Add hashed email/phone if available:
          // em: body.user_data?.em || null,
          // ph: body.user_data?.ph || null,
        },

        // ── Custom Data (event-specific) ──
        custom_data: body.custom_data || {},
      },
    ],

    // ── Test event code (remove in production) ──
    // test_event_code: 'TEST12345',
  };

  // ── Forward to Meta Graph API ──
  const metaUrl = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

  let metaResponse;
  try {
    metaResponse = await fetch(metaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(capiPayload),
    });
  } catch (networkError) {
    console.error('[CAPI] Network error reaching Meta API:', networkError);
    return new Response(JSON.stringify({ error: 'Upstream network error' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  const metaBody = await metaResponse.json();

  // ── Log errors from Meta (without leaking to client) ──
  if (!metaResponse.ok) {
    console.error('[CAPI] Meta API error:', JSON.stringify(metaBody));
    return new Response(JSON.stringify({ success: false, code: metaResponse.status }), {
      status: 200, // Return 200 to client so analytics.js doesn't retry aggressively
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  // ── Success ──
  return new Response(JSON.stringify({
    success: true,
    events_received: metaBody.events_received,
    fbtrace_id: metaBody.fbtrace_id,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
  });
}

// ─── CORS Helper ──────────────────────────────────────────
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}

// ─── Cloudflare Worker wrangler.toml (create separately) ──
/*
  # wrangler.toml — place at project root
  name = "digitalizen-capi"
  main = "api/capi.js"
  compatibility_date = "2024-01-01"

  [vars]
  ALLOWED_ORIGIN = "https://digitalizen.billah.dev"

  # Set secrets via CLI (never in wrangler.toml):
  # wrangler secret put META_PIXEL_ID
  # wrangler secret put CAPI_ACCESS_TOKEN
*/
