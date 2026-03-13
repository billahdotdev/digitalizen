// ============================================================
// api/tt-capi.js — TikTok Events API Server-Side Endpoint
//
// PURPOSE:
//   Mirrors browser TikTok Pixel events server-side to
//   eliminate data loss from ad blockers and iOS restrictions.
//   Critical for TikTok Ads targeting accuracy in BD market.
//
// DEPLOYMENT: Same options as api/capi.js
//   → Cloudflare Worker (recommended — free, low latency BD)
//   → Vercel Edge / Netlify Function
//
// SETUP:
//   1. TikTok Ads Manager → Assets → Events
//   2. Web Events → Manage → Set Up Web Events
//   3. Events API → Generate Access Token
//   4. Copy: Pixel ID + Access Token
//   5. Set env vars: TT_PIXEL_ID, TT_ACCESS_TOKEN
//   6. Update TT_CAPI_ENDPOINT in src/analytics.js
// ============================================================

export default {
  async fetch(request, env) {
    return handleTTCAPI(request, env);
  },
};

async function handleTTCAPI(request, env) {
  const ALLOWED_ORIGIN = env.ALLOWED_ORIGIN || 'https://digitalizen.billah.dev';

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(ALLOWED_ORIGIN) });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  const PIXEL_ID     = env.TT_PIXEL_ID;
  const ACCESS_TOKEN = env.TT_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  let body;
  try { body = await request.json(); }
  catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  const clientIP = request.headers.get('CF-Connecting-IP')
    || request.headers.get('X-Forwarded-For')?.split(',')[0]
    || null;

  // ── TikTok Events API payload ─────────────────────────
  // Docs: https://business-api.tiktok.com/portal/docs?id=1741601162187777
  const ttPayload = {
    pixel_code:  PIXEL_ID,
    event:       body.event_name,
    event_id:    body.event_id,           // Deduplication with browser pixel
    timestamp:   new Date().toISOString(),
    context: {
      user_agent: body.user_data?.client_user_agent || '',
      ip:         clientIP,
      page: {
        url: body.event_source_url || 'https://digitalizen.billah.dev/',
      },
      user: {
        // TikTok Click ID from URL param ?ttclid=
        ttclid: body.user_data?.ttclid || null,
        // External ID (hashed user identifier if available)
        external_id: body.user_data?.external_id || null,
      },
    },
    properties: {
      currency:     body.custom_data?.currency     || 'BDT',
      value:        body.custom_data?.value         || 0,
      content_name: body.custom_data?.content_name  || '',
      content_type: body.custom_data?.content_type  || 'product',
      contents:     body.custom_data?.contents      || [],
    },
  };

  const ttUrl = `https://business-api.tiktok.com/open_api/v1.3/pixel/track/?access_token=${ACCESS_TOKEN}`;

  let ttResponse;
  try {
    ttResponse = await fetch(ttUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ttPayload),
    });
  } catch (err) {
    console.error('[TT-CAPI] Network error:', err);
    return new Response(JSON.stringify({ success: false, error: 'upstream' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
    });
  }

  const ttBody = await ttResponse.json();

  if (!ttResponse.ok || ttBody.code !== 0) {
    console.error('[TT-CAPI] TikTok API error:', JSON.stringify(ttBody));
  }

  return new Response(JSON.stringify({
    success: ttBody.code === 0,
    code:    ttBody.code,
    message: ttBody.message,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(ALLOWED_ORIGIN) },
  });
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
}
