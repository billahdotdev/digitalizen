import { useState, useRef, useEffect, useCallback } from 'react'
import './Finder.css'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import FinderPdfLayer                       from './FinderPdfLayer.jsx'

/* ══════════════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════════════ */
const Icon = {
  warning: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5L13.5 12.5H2.5L8 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8 6.5v2.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7.5V11M8 5.5v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  trend: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M2 11.5l4-4.5 3 3L14 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.5 4H14v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wa: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
  back: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

/* ══════════════════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════════════════ */
function ParticleCanvas({ className = 'finder-particle-canvas' }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const COUNT = 36, CONNECT = 90, SPEED = 0.22
    let W, H, particles

    const init = () => {
      const rect = canvas.getBoundingClientRect()
      W = canvas.width  = rect.width  || 400
      H = canvas.height = rect.height || 200
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.4 + 0.5,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < CONNECT) {
            ctx.strokeStyle = `rgba(60,120,255,${(1 - dist/CONNECT)*0.45})`
            ctx.lineWidth = 0.7
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke()
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(80,160,255,0.7)'; ctx.fill()
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    init(); draw()
    const ro = new ResizeObserver(init); ro.observe(canvas)
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}

/* ══════════════════════════════════════════════════
   QUESTION GRAPH — True Branching Architecture
   ──────────────────────────────────────────────────
   Structure: each node has an id, question text,
   and options. Each option carries:
     next      — next node id (string) or 'RESULT'
     tags[]    — scoring labels (unchanged engine)
     rawScore  — 1-4 for progress bar
     flags{}   — diagnostic triggers

   THREE DISTINCT CONVERSATION PATHS:

   PATH A — "নতুন শুরু" (10 Questions)
   stage → biz_type_new → online_presence_new → budget_new
         → audience_new → competitor_new → content_ready_new
         → wa_plan_new → worry_new → goal_new → RESULT
   Always micro_test. Richer copy from budget + content data.

   PATH B — "চলছে কিন্তু আটকে" (12 Questions)
   stage → mkt_stuck → ad_spend_stuck → channel_stuck
         → [no LP]  → pixel_stuck → creative_stuck → revenue_stuck → automation_stuck → pain_stuck → goal_stuck → RESULT
         → [has LP] → lp_tech_stuck → pixel_stuck → creative_stuck → revenue_stuck → automation_stuck → pain_stuck → goal_stuck → RESULT
   micro_test or monthly_care.

   PATH C — "স্কেলিং / ব্র্যান্ড" (13 Questions)
   stage → mkt_scale → channel_scale
         → [no LP]  → pixel_scale → revenue_scale → roas_scale → content_engine_scale → competition_scale → brand_scale → ai_scale → goal_scale → RESULT
         → [has LP] → lp_tech_scale → pixel_scale → revenue_scale → roas_scale → retention_scale → competition_scale → brand_scale → ai_scale → goal_scale → RESULT
   monthly_care or brand_care.

   WORST-CASE PATH: 13 nodes. AVERAGE: 10.
══════════════════════════════════════════════════ */

const Q = {

  /* ── ROOT ─────────────────────────────────────── */
  stage: {
    id: 'stage',
    q: 'এখন বিজনেসটা ঠিক কোথায় দাঁড়িয়ে আছে?',
    hint: 'সঠিক তথ্য দিয়ে নির্ভুল এবং কার্যকর রিপোর্ট নিন।',
    opts: [
      { label: 'একদম নতুন, এখনো ঠিকমতো শুরুই হয়নি।',                               next: 'biz_type_new',  tags: ['stage_early'],   rawScore: 1 },
      { label: 'চলছে, কিন্তু সেল বা প্রফিট যেভাবে চাই, সেভাবে আসছে না।',                 next: 'mkt_stuck',     tags: ['stage_stuck'],   rawScore: 2 },
      { label: 'ভালোই চলছে, এবার আরও বড় পরিসরে যেতে চাই',                         next: 'mkt_scale',     tags: ['stage_scaling'], rawScore: 3 },
      { label: 'আমরা ব্র্যান্ড হিসেবে পরিচিত, আরও প্রিমিয়াম হতে চাই।',             next: 'mkt_scale',     tags: ['stage_premium'], rawScore: 4 },
    ],
  },

  /* ══════════════════════════════════════════════
     PATH A — নতুন শুরু (10 Questions)
  ══════════════════════════════════════════════ */

  biz_type_new: {
    id: 'biz_type_new',
    q: 'বিজনেসটা কোন ধরনের?',
    hint: 'সঠিক ধরন জানলে কোন স্ট্র্যাটেজি সবচেয়ে দ্রুত কাজ করবে সেটা বলতে পারব।',
    opts: [
      { label: 'সার্ভিস বা সেবা, যেমন শিক্ষা, স্বাস্থ্য, কনসালটেন্সি।',    next: 'online_presence_new', tags: ['service'],      rawScore: 1 },
      { label: 'লোকাল বিজনেস, যেমন রেস্টুরেন্ট, জিম, সেলুন বা শপ।',         next: 'online_presence_new', tags: ['local'],        rawScore: 2 },
      { label: 'ই-কমার্স, বাজার বা সাপ্লায়ার থেকে কিনে বিক্রি করি।',        next: 'online_presence_new', tags: ['ecommerce'],    rawScore: 3 },
      { label: 'নিজেই বানাই বা ইমপোর্ট করি, নিজস্ব প্রোডাক্ট।',          next: 'online_presence_new', tags: ['manufacturer'], rawScore: 4 },
    ],
  },

  online_presence_new: {
    id: 'online_presence_new',
    q: 'অনলাইনে এখন কতটুকু আছেন?',
    hint: 'শূন্য থেকে শুরু করতে লজ্জা নেই, এই পর্যায়টাই আমরা সবচেয়ে ভালো সামলাই।',
    opts: [
      { label: 'কিছুই নেই, ফেসবুক পেজও খোলা হয়নি।',                                    next: 'budget_new', tags: ['mkt_none', 'channel_organic'], rawScore: 1, flags: { techGap: true, landingPageWarning: 'none' } },
      { label: 'শুধু একটা ফেসবুক পেজ আছে, অ্যাড চালাইনি।',                              next: 'budget_new', tags: ['mkt_none', 'channel_organic'], rawScore: 1, flags: { techGap: true, landingPageWarning: 'none' } },
      { label: 'মাঝে মাঝে নিজেই বুস্ট দিই, তেমন ফলাফল আসেনি।',                          next: 'budget_new', tags: ['mkt_self', 'channel_boost'],   rawScore: 2, flags: { techGap: true, trackingWarning: true } },
      { label: 'ওয়েবসাইট বা ল্যান্ডিং পেজ আছে, মার্কেটিং এখন শুরু করব।',               next: 'budget_new', tags: ['mkt_none', 'channel_lp'],      rawScore: 2, flags: { landingPageWarning: 'weak' } },
    ],
  },

  budget_new: {
    id: 'budget_new',
    q: 'প্রথম ৩ মাসে মার্কেটিংয়ে কতটুকু ঢালতে পারবেন?',
    hint: 'অ্যাড বাজেট আর সার্ভিস চার্জ মিলিয়ে মোট হিসাব করুন।',
    opts: [
      { label: '৳৫,০০০ থেকে ৳১৫,০০০, একদম সীমিত বাজেটে শুরু করব।',            next: 'audience_new', tags: ['need_budget'],                    rawScore: 1 },
      { label: '৳১৫,০০০ থেকে ৳৩০,০০০, মাঝারি বাজেট, স্মার্টলি খরচ করতে চাই।',  next: 'audience_new', tags: ['need_budget', 'need_adtech'],     rawScore: 2 },
      { label: '৳৩০,০০০ থেকে ৳৬০,০০০, ভালো বাজেট আছে, দিকনির্দেশনা দরকার।',    next: 'audience_new', tags: ['need_adtech', 'need_funnel'],     rawScore: 3 },
      { label: '৳৬০,০০০-এর বেশি, বাজেট সমস্যা না, ROI নিশ্চিত হলেই চলবে।',     next: 'audience_new', tags: ['need_funnel', 'need_fullstack'],  rawScore: 4 },
    ],
  },

  audience_new: {
    id: 'audience_new',
    q: 'কাস্টমাররা মূলত কারা হবে?',
    hint: 'এটা বুঝলে বিজ্ঞাপনের ভাষা, প্ল্যাটফর্ম আর সেলস ফানেল তিনটাই আলাদা হয়ে যায়।',
    opts: [
      { label: 'সাধারণ মানুষ, মোবাইলে দেখে সিদ্ধান্ত নেবে।',                              next: 'competitor_new', tags: ['audience_b2c'],                   rawScore: 2 },
      { label: 'অন্য বিজনেস বা প্রতিষ্ঠান, সিদ্ধান্তে একটু সময় লাগে।',                    next: 'competitor_new', tags: ['audience_b2b', 'need_funnel'],     rawScore: 3 },
      { label: 'লোকাল এলাকার মানুষ, আশেপাশের কাস্টমার।',                                   next: 'competitor_new', tags: ['audience_local'],                 rawScore: 2 },
      { label: 'দুটোই, ব্যক্তি আর বিজনেস উভয়ই কিনবে।',                                    next: 'competitor_new', tags: ['audience_mixed', 'need_funnel'],   rawScore: 3 },
    ],
  },

  competitor_new: {
    id: 'competitor_new',
    q: 'প্রতিযোগীদের সাথে তুলনায় আপনি কোথায়?',
    hint: 'মার্কেটে কোন দিকে এগোলে সবচেয়ে কম প্রতিরোধ পাবেন সেটা বুঝতে চাই।',
    opts: [
      { label: 'প্রতিযোগী অনেক, মার্কেট স্যাচুরেটেড, আলাদা হওয়া কঠিন।',          next: 'content_ready_new', tags: ['pain_trust', 'brand_none'],    rawScore: 2 },
      { label: 'কিছু প্রতিযোগী আছে, তাদের চেয়ে ভালো করতে চাই।',                    next: 'content_ready_new', tags: ['goal_brand', 'brand_partial'],  rawScore: 2 },
      { label: 'প্রতিযোগী কম, মার্কেট ধরার সুযোগ আছে।',                            next: 'content_ready_new', tags: ['goal_system', 'need_adtech'],   rawScore: 3 },
      { label: 'এখনো বুঝিনি, মার্কেট রিসার্চ করা হয়নি।',                           next: 'content_ready_new', tags: ['goal_unclear', 'need_budget'],  rawScore: 1 },
    ],
  },

  content_ready_new: {
    id: 'content_ready_new',
    q: 'বিজ্ঞাপনের জন্য কনটেন্ট কতটুকু রেডি?',
    hint: 'ছবি, ভিডিও, লেখার কথা বলছি। কনটেন্ট ছাড়া অ্যাড চালানো মানে গল্প ছাড়া সিনেমা।',
    opts: [
      { label: 'কিছুই নেই, একদম শুরু থেকে বানাতে হবে।',                           next: 'wa_plan_new', tags: ['creative_need', 'brand_none'],    rawScore: 1 },
      { label: 'কিছু মোবাইল ফটো বা ভিডিও আছে, প্রফেশনাল না।',                      next: 'wa_plan_new', tags: ['creative_diy', 'brand_diy'],      rawScore: 2 },
      { label: 'মোটামুটি কনটেন্ট আছে, অ্যাড কপি লেখায় সাহায্য দরকার।',            next: 'wa_plan_new', tags: ['creative_diy', 'need_adtech'],    rawScore: 2 },
      { label: 'প্রফেশনাল ফটো বা ভিডিও রেডি, শুধু ক্যাম্পেইন দরকার।',              next: 'wa_plan_new', tags: ['creative_agency', 'need_adtech'], rawScore: 3 },
    ],
  },

  wa_plan_new: {
    id: 'wa_plan_new',
    q: 'WhatsApp দিয়ে কাস্টমারদের সাথে কীভাবে কথা বলবেন?',
    hint: 'বাংলাদেশে বেশিরভাগ বিজনেসের সবচেয়ে বেশি কনভার্সন আসে WhatsApp থেকে। এটা না সাজালে অনেক সেল হাতছাড়া হয়।',
    opts: [
      { label: 'WhatsApp Business অ্যাকাউন্টও নেই, এখনো ভাবিনি।',                   next: 'worry_new', tags: ['wa_none', 'need_adtech'],   rawScore: 1 },
      { label: 'আছে, কিন্তু ম্যানুয়ালি একটা একটা করে রিপ্লাই দিই।',                 next: 'worry_new', tags: ['wa_manual'],                rawScore: 2 },
      { label: 'অটো-রিপ্লাই বা কিছু টেমপ্লেট আছে, পুরোটা সিস্টেমেটিক না।',          next: 'worry_new', tags: ['wa_basic', 'need_funnel'],  rawScore: 3 },
      { label: 'WhatsApp-কে মূল চ্যানেল বানাতে চাই, অটোমেশন দরকার।',                next: 'worry_new', tags: ['wa_goal', 'need_funnel'],  rawScore: 3 },
    ],
  },

  worry_new: {
    id: 'worry_new',
    q: 'শুরু করতে গিয়ে সবচেয়ে কোন ভয়টা মাথায় ঘুরছে?',
    hint: 'একটাই বাছুন, সবচেয়ে সত্যিটা।',
    opts: [
      { label: 'ভুল জায়গায় টাকা ঢেলে নষ্ট হয়ে যাওয়ার ভয়।',                      next: 'goal_new', tags: ['need_budget', 'goal_unclear'],    rawScore: 1 },
      { label: 'প্রতিযোগীদের মতো দেখাব, আলাদা হতে পারব না।',                         next: 'goal_new', tags: ['pain_trust', 'brand_none'],       rawScore: 2 },
      { label: 'মার্কেটিং বুঝি না, ভুল সিদ্ধান্ত নিয়ে ফেলব।',                      next: 'goal_new', tags: ['goal_unclear', 'need_adtech'],    rawScore: 1 },
      { label: 'সেল আসতে দেরি হলে ক্যাশফ্লো সামলাতে পারব কিনা।',                    next: 'goal_new', tags: ['goal_system', 'pain_product'],    rawScore: 2 },
    ],
  },

  goal_new: {
    id: 'goal_new',
    q: 'প্রথম ৩ মাসে কী হলে মনে হবে সফল হয়েছি?',
    hint: 'এটাই আপনার কাস্টম রোডম্যাপের গন্তব্য।',
    opts: [
      { label: 'মানুষ আমার বিজনেসের নামটা চিনতে শুরু করুক।',                         next: 'RESULT', tags: ['goal_brand', 'brand_none'],      rawScore: 1 },
      { label: 'প্রথম ১০ থেকে ৫০টা সেল আসুক, ছোট হলেও চলবে।',                        next: 'RESULT', tags: ['goal_system', 'need_adtech'],    rawScore: 2 },
      { label: 'একটা কার্যকর ডিজিটাল সেটআপ রেডি হয়ে যাক।',                          next: 'RESULT', tags: ['need_funnel', 'goal_unclear'],    rawScore: 2 },
      { label: 'ডেটা দেখে বুঝতে চাই কাস্টমার কে, কোথায় পাব।',                        next: 'RESULT', tags: ['goal_system', 'need_adtech'],    rawScore: 3 },
    ],
  },

  /* ══════════════════════════════════════════════
     PATH B — চলছে কিন্তু আটকে আছি (12 Questions)
  ══════════════════════════════════════════════ */

  mkt_stuck: {
    id: 'mkt_stuck',
    q: 'মার্কেটিং এখন কীভাবে চলছে?',
    hint: 'বর্তমান সেটআপটা যেটা সবচেয়ে কাছাকাছি সেটা বাছুন।',
    opts: [
      { label: 'নিজেই বুস্ট দিই, কিন্তু ফলাফল অনিশ্চিত।',                           next: 'ad_spend_stuck', tags: ['mkt_self'],       rawScore: 1, flags: { techGap: true } },
      { label: 'ফ্রিল্যান্সার দিয়ে অ্যাড চালাই, রেজাল্ট ঠিকমতো দেখতে পাই না।',      next: 'ad_spend_stuck', tags: ['mkt_freelancer'], rawScore: 2 },
      { label: 'এজেন্সি আছে, কিন্তু মনমতো রেজাল্ট আসছে না।',                         next: 'ad_spend_stuck', tags: ['mkt_agency'],     rawScore: 3 },
      { label: 'মার্কেটিং প্রায় নেই, মুখের কথায় বা অর্গানিকে চলছে।',                next: 'ad_spend_stuck', tags: ['mkt_none'],       rawScore: 1, flags: { techGap: true } },
    ],
  },

  ad_spend_stuck: {
    id: 'ad_spend_stuck',
    q: 'প্রতি মাসে অ্যাডে কতটাকা যাচ্ছে?',
    hint: 'শুধু অ্যাড বাজেট, সার্ভিস চার্জ আলাদা রাখুন।',
    opts: [
      { label: '৳৫,০০০ এর নিচে, একদম সীমিত।',                                        next: 'channel_stuck', tags: ['need_budget'],                  rawScore: 1 },
      { label: '৳৫,০০০ থেকে ৳২০,০০০।',                                                next: 'channel_stuck', tags: ['need_budget', 'need_adtech'],   rawScore: 2 },
      { label: '৳২০,০০০ থেকে ৳৫০,০০০, বাজেট আছে কিন্তু ফলাফল নেই।',                  next: 'channel_stuck', tags: ['need_adtech', 'need_funnel'],   rawScore: 3, flags: { kpiWarning: true } },
      { label: '৳৫০,০০০-এর বেশি, বড় বাজেট যাচ্ছে কিন্তু ROAS নেগেটিভ।',              next: 'channel_stuck', tags: ['need_funnel', 'pain_roas'],     rawScore: 3, flags: { kpiWarning: true, trackingWarning: true } },
    ],
  },

  channel_stuck: {
    id: 'channel_stuck',
    q: 'কাস্টমাররা মূলত কোথা থেকে আসছে?',
    hint: 'যেখান থেকে সবচেয়ে বেশি সেল হয় সেটা বাছুন।',
    opts: [
      { label: 'ফেসবুক মেসেজ বা ইনবক্স, ল্যান্ডিং পেজ নেই।',                         next: 'pixel_stuck',   tags: ['channel_boost', 'tech_none'],   rawScore: 2, flags: { landingPageWarning: 'none' } },
      { label: 'অর্গানিক, রেফারেল বা পরিচিত মানুষ থেকে।',                             next: 'pixel_stuck',   tags: ['channel_organic', 'tech_none'], rawScore: 1, flags: { landingPageWarning: 'none' } },
      { label: 'ল্যান্ডিং পেজ আছে কিন্তু স্লো বা পুরনো।',                             next: 'lp_tech_stuck', tags: ['channel_lp'],                   rawScore: 2, flags: { landingPageWarning: 'weak' } },
      { label: 'ওয়েবসাইট আছে, কিন্তু কনভার্সন কম।',                                  next: 'lp_tech_stuck', tags: ['channel_website'],              rawScore: 3 },
    ],
  },

  lp_tech_stuck: {
    id: 'lp_tech_stuck',
    q: 'ল্যান্ডিং পেজ বা ওয়েবসাইট কীভাবে বানানো?',
    hint: 'পেজ স্পিড সরাসরি কনভার্সনে লাগে। ১ সেকেন্ড দেরি মানে ৭% কনভার্সন কম।',
    opts: [
      { label: 'ওয়ার্ডপ্রেস বা থিম দিয়ে, লোড একটু স্লো।',                            next: 'pixel_stuck', tags: ['tech_legacy'],                   rawScore: 2, flags: { techGap: true, landingPageWarning: 'weak' } },
      { label: 'টেমপ্লেট বিল্ডার, যেমন Shopify বা Wix।',                              next: 'pixel_stuck', tags: ['tech_legacy', 'tech_shopify'],   rawScore: 2, flags: { techGap: true } },
      { label: 'কাস্টম কোড, দ্রুত লোড হয়।',                                           next: 'pixel_stuck', tags: ['tech_fast'],                     rawScore: 4 },
      { label: 'কে বানিয়েছে জানি না, স্পিড কেমন সেটাও জানা নেই।',                      next: 'pixel_stuck', tags: ['tech_unknown'],                  rawScore: 2, flags: { techGap: true, landingPageWarning: 'weak' } },
    ],
  },

  pixel_stuck: {
    id: 'pixel_stuck',
    q: 'Facebook Pixel বা কোনো ট্র্যাকিং সেটআপ আছে?',
    hint: 'Pixel ছাড়া Facebook অ্যালগরিদম অন্ধ। সে জানতেই পারে না কে কিনছে, তাই বারবার ভুল মানুষকে অ্যাড দেখায়।',
    opts: [
      { label: 'Pixel কী জিনিস সেটাই জানি না।',                                      next: 'creative_stuck', tags: ['pixel_none'],  rawScore: 1, flags: { trackingWarning: true, kpiWarning: true } },
      { label: 'ট্র্যাকিং ছাড়াই অ্যাড চলছে।',                                        next: 'creative_stuck', tags: ['pixel_skip'],  rawScore: 1, flags: { trackingWarning: true, kpiWarning: true } },
      { label: 'Pixel আছে কিন্তু ঠিকমতো কাজ করছে কিনা নিশ্চিত না।',                   next: 'creative_stuck', tags: ['pixel_basic'], rawScore: 2, flags: { kpiWarning: true } },
      { label: 'Pixel আর Server-side API দুটোই সেটআপ আছে।',                           next: 'creative_stuck', tags: ['pixel_full'],  rawScore: 4 },
    ],
  },

  creative_stuck: {
    id: 'creative_stuck',
    q: 'অ্যাড কনটেন্ট বা ক্রিয়েটিভ নিয়ে সৎভাবে বলুন।',
    hint: 'খারাপ ক্রিয়েটিভ ভালো ক্যাম্পেইনকেও মাটি করে দেয়।',
    opts: [
      { label: 'নিজেই মোবাইলে ছবি তুলি, প্রফেশনাল না।',                               next: 'revenue_stuck', tags: ['creative_diy', 'brand_diy'],       rawScore: 1 },
      { label: 'ভালো কনটেন্ট বানাতে পারি না, এটাই মূল দুর্বলতা।',                     next: 'revenue_stuck', tags: ['creative_need', 'brand_none'],     rawScore: 1 },
      { label: 'ফ্রিল্যান্সার বা এজেন্সি দিয়ে ডিজাইন করাই।',                          next: 'revenue_stuck', tags: ['creative_agency', 'brand_partial'], rawScore: 3 },
      { label: 'ভালো কনটেন্ট আছে কিন্তু অ্যাডে কনভার্ট হচ্ছে না।',                   next: 'revenue_stuck', tags: ['creative_agency', 'pain_roas'],     rawScore: 3, flags: { kpiWarning: true } },
    ],
  },

  revenue_stuck: {
    id: 'revenue_stuck',
    q: 'এখন মাসে মাসে কতটাকা সেল হচ্ছে?',
    hint: 'রেভিনিউ সাইজটা জানলে কোন সমাধান সবচেয়ে দ্রুত কাজে আসবে সেটা ঠিক করতে পারি।',
    opts: [
      { label: '৳৫০,০০০ এর নিচে, এখনো ছোট স্কেলে আছি।',                              next: 'automation_stuck', tags: ['revenue_low'],                    rawScore: 1 },
      { label: '৳৫০,০০০ থেকে ৳২,০০,০০০, মাঝারি কিন্তু স্থিতিশীল না।',                next: 'automation_stuck', tags: ['revenue_mid'],                    rawScore: 2 },
      { label: '৳২,০০,০০০ থেকে ৳৫,০০,০০০, ভালো চলছে কিন্তু আরও বাড়াতে চাই।',        next: 'automation_stuck', tags: ['revenue_high'],                   rawScore: 3 },
      { label: '৳৫,০০,০০০-এর বেশি, বড় সেল কিন্তু মার্কেটিং কস্ট অনেক।',             next: 'automation_stuck', tags: ['revenue_high', 'need_funnel'],    rawScore: 4 },
    ],
  },

  automation_stuck: {
    id: 'automation_stuck',
    q: 'অ্যাড ছাড়া আর কোনো ডিজিটাল টুল ব্যবহার করেন?',
    hint: 'সঠিক টুল না থাকলে একই কাজ বারবার করতে হয়। এটা সময় আর টাকা দুটোই নষ্ট করে।',
    opts: [
      { label: 'না, শুধু ফেসবুক আর WhatsApp, বাকিটা হাতে করি।',                       next: 'pain_stuck', tags: ['automation_none'],                   rawScore: 1 },
      { label: 'WhatsApp Business আছে, বাকিটা ম্যানুয়াল।',                            next: 'pain_stuck', tags: ['automation_basic', 'wa_manual'],    rawScore: 2 },
      { label: 'Google Sheets, Canva বা কিছু টুল আছে, সিস্টেম না।',                   next: 'pain_stuck', tags: ['automation_basic'],                  rawScore: 2 },
      { label: 'CRM বা অটোমেশন টুল আছে, আরও স্কেল করতে চাই।',                        next: 'pain_stuck', tags: ['automation_advanced', 'need_funnel'], rawScore: 3 },
    ],
  },

  pain_stuck: {
    id: 'pain_stuck',
    q: 'ঠিক কোন জায়গায় সব আটকে যাচ্ছে?',
    hint: 'যেটা সবচেয়ে বেশি মাথায় ঘোরে সেটা বাছুন।',
    opts: [
      { label: 'অ্যাডে টাকা যাচ্ছে, সেল নেই, ROAS নেগেটিভ।',                         next: 'goal_stuck', tags: ['pain_roas'],    rawScore: 2, flags: { kpiWarning: true } },
      { label: 'কনটেন্ট দুর্বল, মানুষ স্ক্রোল করেই চলে যায়।',                         next: 'goal_stuck', tags: ['creative_need'], rawScore: 1 },
      { label: 'পেজ বা ওয়েবসাইট স্লো, মানুষ ঢুকেই বের হয়ে যায়।',                    next: 'goal_stuck', tags: ['pain_tech'],    rawScore: 2, flags: { techGap: true, landingPageWarning: 'weak' } },
      { label: 'মানুষ বিশ্বাস করছে না, ব্র্যান্ড ট্রাস্ট কম।',                        next: 'goal_stuck', tags: ['pain_trust'],   rawScore: 2 },
    ],
  },

  goal_stuck: {
    id: 'goal_stuck',
    q: 'আগামী ৬ মাসে একটা জিনিস পাল্টাতে পারলে সবচেয়ে বেশি কী পরিবর্তন আসবে?',
    hint: 'এটাই আপনার ৩০-দিনের স্প্রিন্টের মূল লক্ষ্য।',
    opts: [
      { label: 'অ্যাড খরচ কমিয়ে ROAS পজিটিভে আনা।',                                  next: 'RESULT', tags: ['goal_system', 'need_adtech'],    rawScore: 2 },
      { label: 'কাস্টম ল্যান্ডিং পেজ দিয়ে কনভার্সন দ্বিগুণ করা।',                     next: 'RESULT', tags: ['need_funnel', 'goal_system'],    rawScore: 3 },
      { label: 'স্থিতিশীল মাসিক সেলস মেশিন তৈরি করা।',                                next: 'RESULT', tags: ['goal_system', 'need_funnel'],    rawScore: 3 },
      { label: 'ব্র্যান্ড ট্রাস্ট বাড়িয়ে রিপিট কাস্টমার আনা।',                       next: 'RESULT', tags: ['goal_brand', 'need_fullstack'],  rawScore: 4 },
    ],
  },

  /* ══════════════════════════════════════════════
     PATH C — স্কেলিং / ব্র্যান্ড (13 Questions)
  ══════════════════════════════════════════════ */

  mkt_scale: {
    id: 'mkt_scale',
    q: 'মার্কেটিং এখন কে সামলাচ্ছে?',
    hint: 'বর্তমান মার্কেটিং টিমের কাঠামো বলুন।',
    opts: [
      { label: 'নিজেই বা ইন-হাউস জুনিয়র দিয়ে।',                                     next: 'channel_scale', tags: ['mkt_self'],        rawScore: 2, flags: { techGap: true } },
      { label: 'ফ্রিল্যান্সার, একজন বা একাধিক।',                                      next: 'channel_scale', tags: ['mkt_freelancer'],  rawScore: 3 },
      { label: 'ডেডিকেটেড মার্কেটিং এজেন্সি।',                                        next: 'channel_scale', tags: ['mkt_agency'],      rawScore: 4 },
      { label: 'ইন-হাউস মার্কেটিং টিম আছে।',                                          next: 'channel_scale', tags: ['mkt_agency', 'creative_inhouse'], rawScore: 4 },
    ],
  },

  channel_scale: {
    id: 'channel_scale',
    q: 'কাস্টমার মূলত কোন পথে কিনতে আসে?',
    hint: 'এটাই আপনার সেলস ফানেলের হৃৎপিণ্ড।',
    opts: [
      { label: 'ফেসবুক মেসেজ ক্যাম্পেইন, ল্যান্ডিং পেজ নেই।',                        next: 'pixel_scale',   tags: ['channel_boost', 'tech_none'],      rawScore: 2, flags: { landingPageWarning: 'none' } },
      { label: 'ল্যান্ডিং পেজ আছে আর মেসেজ ক্যাম্পেইন একসাথে।',                      next: 'lp_tech_scale', tags: ['channel_lp'],                      rawScore: 3, flags: { landingPageWarning: 'weak' } },
      { label: 'ডেডিকেটেড ওয়েবসাইট আর মাল্টি-চ্যানেল অ্যাড।',                       next: 'lp_tech_scale', tags: ['channel_website'],                 rawScore: 4 },
      { label: 'অর্গানিক আর ইনফ্লুয়েন্সার, পেইড অ্যাড সাপ্লিমেন্টারি।',              next: 'pixel_scale',   tags: ['channel_organic', 'brand_partial'], rawScore: 3 },
    ],
  },

  lp_tech_scale: {
    id: 'lp_tech_scale',
    q: 'ল্যান্ডিং পেজ বা ওয়েবসাইটের টেকনিক্যাল অবস্থা কেমন?',
    hint: 'Google PageSpeed ৯০-এর নিচে মানে অ্যাডের প্রতিটা টাকার কিছুটা লিক হচ্ছে।',
    opts: [
      { label: 'ওয়ার্ডপ্রেস বা থিম, মোবাইলে স্লো।',                                  next: 'pixel_scale', tags: ['tech_legacy'],                  rawScore: 2, flags: { techGap: true, landingPageWarning: 'weak' } },
      { label: 'কাস্টম কোড, দ্রুত লোড, ভালো Core Web Vitals।',                        next: 'pixel_scale', tags: ['tech_fast'],                    rawScore: 4 },
      { label: 'Shopify বা WooCommerce, মাঝারি পারফরম্যান্স।',                         next: 'pixel_scale', tags: ['tech_legacy', 'tech_shopify'],  rawScore: 3, flags: { techGap: true } },
      { label: 'নিশ্চিত না, স্পিড কখনো টেস্ট করা হয়নি।',                              next: 'pixel_scale', tags: ['tech_unknown'],                 rawScore: 2, flags: { techGap: true, landingPageWarning: 'weak' } },
    ],
  },

  pixel_scale: {
    id: 'pixel_scale',
    q: 'ট্র্যাকিং ইনফ্রাস্ট্রাকচার কতটা শক্তিশালী?',
    hint: 'Pixel ছাড়া অ্যালগরিদম অন্ধ, CAPI ছাড়া অর্ধেক ডেটা হারিয়ে যায়।',
    opts: [
      { label: 'শুধু Pixel আছে, CAPI বা Server-side API নেই।',                         next: 'revenue_scale', tags: ['pixel_basic'], rawScore: 2, flags: { kpiWarning: true } },
      { label: 'Pixel আর CAPI দুটোই সেটআপ, ইভেন্ট ঠিকমতো ফায়ার হচ্ছে।',             next: 'revenue_scale', tags: ['pixel_full'],  rawScore: 4 },
      { label: 'Pixel আছে কিন্তু ইভেন্ট ঠিকমতো ফায়ার হচ্ছে কিনা জানি না।',           next: 'revenue_scale', tags: ['pixel_basic'], rawScore: 2, flags: { trackingWarning: true, kpiWarning: true } },
      { label: 'ট্র্যাকিং নেই বা পুরো বিষয়টা বুঝি না।',                               next: 'revenue_scale', tags: ['pixel_none'],  rawScore: 1, flags: { trackingWarning: true, kpiWarning: true } },
    ],
  },

  revenue_scale: {
    id: 'revenue_scale',
    q: 'এখন মাসিক রেভিনিউ কোথায় আছে?',
    hint: 'এটা না জানলে ROAS টার্গেট আর বাজেট অ্যালোকেশন ঠিকমতো করা যায় না।',
    opts: [
      { label: '৳৫ লাখ থেকে ৳১৫ লাখের মধ্যে।',                                       next: 'roas_scale', tags: ['revenue_scale_mid'],                              rawScore: 2 },
      { label: '৳১৫ লাখ থেকে ৳৫০ লাখের মধ্যে।',                                      next: 'roas_scale', tags: ['revenue_scale_high'],                             rawScore: 3 },
      { label: '৳৫০ লাখের বেশি।',                                                     next: 'roas_scale', tags: ['revenue_scale_enterprise', 'need_fullstack'],     rawScore: 4 },
      { label: 'ঠিক জানি না, আনুমানিক হিসাবে চলি।',                                   next: 'roas_scale', tags: ['kpi_vanity', 'revenue_scale_unknown'],            rawScore: 1 },
    ],
  },

  roas_scale: {
    id: 'roas_scale',
    q: 'ROAS আর আসল লাভ-লোকসান কীভাবে ট্র্যাক করেন?',
    hint: 'অ্যাড ম্যানেজারের রিপোর্টেড ROAS আর নেট প্রফিট কিন্তু দুটো আলাদা জিনিস।',
    opts: [
      { label: 'অ্যাড ম্যানেজারের ডেটা দেখি, নেট প্রফিট অস্পষ্ট।',                    next: 'content_engine_scale', tags: ['kpi_partial'], rawScore: 2, flags: { kpiWarning: true } },
      { label: 'অ্যাড কস্ট, সেলস আর নেট প্রফিট আলাদা করে হিসাব রাখি।',                next: 'retention_scale',      tags: ['kpi_full'],    rawScore: 4 },
      { label: 'লাইক, মেসেজ বা রিচ দেখে অনুমান করি।',                                 next: 'content_engine_scale', tags: ['kpi_vanity'],  rawScore: 1, flags: { kpiWarning: true } },
      { label: 'ড্যাশবোর্ড বা Sheets-এ সব মেট্রিক ট্র্যাক হয়।',                       next: 'retention_scale',      tags: ['kpi_full', 'test_regular'], rawScore: 4 },
    ],
  },

  content_engine_scale: {
    id: 'content_engine_scale',
    q: 'বিজ্ঞাপনের কনটেন্ট আর ক্রিয়েটিভ প্রোডাকশন কেমন চলছে?',
    hint: '২০২৬-এ জেতার অ্যাড মানে ভালো কনটেন্ট। মিডিয়া বায়িং একা যথেষ্ট না।',
    opts: [
      { label: 'ফ্রিল্যান্সার বা এজেন্সি দিয়ে, অনিয়মিত।',                            next: 'competition_scale', tags: ['creative_agency', 'test_rarely'],  rawScore: 2 },
      { label: 'ইন-হাউস ডিজাইনার আছে, নিয়মিত কনটেন্ট বের হয়।',                       next: 'competition_scale', tags: ['creative_inhouse', 'test_regular'], rawScore: 4 },
      { label: 'নিজেই বানাই বা টিম দিয়ে, অনিয়মিত।',                                  next: 'competition_scale', tags: ['creative_diy', 'test_rarely'],     rawScore: 1 },
      { label: 'A/B টেস্ট করি, ডেটা দেখে ক্রিয়েটিভ পাল্টাই।',                        next: 'competition_scale', tags: ['creative_inhouse', 'test_regular'], rawScore: 4 },
    ],
  },

  retention_scale: {
    id: 'retention_scale',
    q: 'রিপিট কাস্টমার কেমন আসছে?',
    hint: 'নতুন কাস্টমার আনতে ৫ গুণ বেশি খরচ লাগে। রিটেনশন হলো লুকানো সোনার খনি।',
    opts: [
      { label: 'বেশিরভাগই নতুন কাস্টমার, রিপিট অর্ডার কম।',                           next: 'competition_scale', tags: ['goal_system', 'pain_trust'],    rawScore: 2 },
      { label: 'মাঝামাঝি, কিছু রিপিট আছে কিন্তু সিস্টেমেটিক না।',                     next: 'competition_scale', tags: ['goal_system', 'need_funnel'],   rawScore: 2 },
      { label: 'ভালো রিটেনশন, লয়্যাল কাস্টমারবেস তৈরি হয়েছে।',                       next: 'competition_scale', tags: ['brand_partial', 'goal_brand'],  rawScore: 3 },
      { label: 'চমৎকার, কাস্টমাররা নিজেরাই রেফার করে, কমিউনিটি হয়েছে।',               next: 'competition_scale', tags: ['brand_strong', 'goal_brand'],   rawScore: 4 },
    ],
  },

  competition_scale: {
    id: 'competition_scale',
    q: 'মার্কেটে আপনার পজিশন কেমন?',
    hint: 'কাস্টমার আপনাকে বেছে নেওয়ার কারণটা কি পরিষ্কার?',
    opts: [
      { label: 'অনেক প্রতিযোগী, সবাই প্রায় একই, আমরাও একই রকম।',                     next: 'brand_scale', tags: ['pain_trust', 'brand_partial'],   rawScore: 2 },
      { label: 'কিছু প্রতিযোগী আছে, আমাদের কিছু ইউনিক অ্যাডভান্টেজ আছে।',             next: 'brand_scale', tags: ['brand_partial', 'goal_brand'],  rawScore: 3 },
      { label: 'আমরা মার্কেট লিডার, তবে চ্যালেঞ্জার আসছে।',                           next: 'brand_scale', tags: ['brand_strong', 'goal_brand'],    rawScore: 4 },
      { label: 'নিশ মার্কেট, প্রতিযোগী কম কিন্তু মার্কেটটাও ছোট।',                    next: 'brand_scale', tags: ['brand_partial', 'need_fullstack'], rawScore: 3 },
    ],
  },

  brand_scale: {
    id: 'brand_scale',
    q: 'ব্র্যান্ড আইডেন্টিটি কতটা শক্তিশালী?',
    hint: 'লোগো, কালার, ভয়েস, কপি সব মিলিয়ে একটা পরিষ্কার পরিচয় আছে?',
    opts: [
      { label: 'মোটামুটি, আরও কনসিস্টেন্ট আর প্রফেশনাল হওয়া দরকার।',                 next: 'ai_scale', tags: ['brand_partial'], rawScore: 2 },
      { label: 'শক্তিশালী, প্রতিযোগীরা আমাদের স্টাইল কপি করে।',                       next: 'ai_scale', tags: ['brand_strong'],  rawScore: 4 },
      { label: 'Canva বা নিজেই ডিজাইন করি, তেমন প্রফেশনাল না।',                       next: 'ai_scale', tags: ['brand_diy'],     rawScore: 1 },
      { label: 'ব্র্যান্ডিং নিয়ে এখনো সিরিয়াসলি কাজ করিনি।',                         next: 'ai_scale', tags: ['brand_none'],    rawScore: 1 },
    ],
  },

  ai_scale: {
    id: 'ai_scale',
    q: 'AI আর অটোমেশন নিয়ে বিজনেসটা কোথায় আছে?',
    hint: '২০২৬-এ যারা AI ব্যবহার করছে না তারা পিছিয়ে পড়ছে। এটা এখন বিলাসিতা না, টিকে থাকার শর্ত।',
    opts: [
      { label: 'এখনো শুরু করিনি, AI কীভাবে কাজে লাগবে বুঝি না।',                      next: 'goal_scale', tags: ['ai_unaware', 'need_fullstack'],      rawScore: 1 },
      { label: 'ChatGPT বা Canva AI ব্যবহার করি, অনানুষ্ঠানিকভাবে।',                   next: 'goal_scale', tags: ['ai_basic'],                         rawScore: 2 },
      { label: 'কিছু অটোমেশন আছে, WhatsApp Bot বা email sequence।',                    next: 'goal_scale', tags: ['ai_partial', 'automation_basic'],    rawScore: 3 },
      { label: 'AI পুরোপুরি ইন্টিগ্রেটেড, আরও এক্সপ্যান্ড করতে চাই।',                 next: 'goal_scale', tags: ['ai_advanced', 'automation_advanced'], rawScore: 4 },
    ],
  },

  goal_scale: {
    id: 'goal_scale',
    q: 'আগামী ৬ মাসে একটাই ফলাফল পাওয়ার থাকলে কোনটা সবচেয়ে বেশি দরকার?',
    hint: 'এটাই আপনার কাস্টম রোডম্যাপের শেষ গন্তব্য।',
    opts: [
      { label: 'মার্কেটে একটা প্রভাবশালী ব্র্যান্ড হিসেবে প্রতিষ্ঠিত হওয়া।',          next: 'RESULT', tags: ['goal_brand', 'need_fullstack'],  rawScore: 4 },
      { label: 'ROAS অপ্টিমাইজ করে অ্যাড খরচ কমানো।',                                 next: 'RESULT', tags: ['goal_system', 'need_adtech'],    rawScore: 3 },
      { label: 'কাস্টম ফানেল দিয়ে কনভার্সন হার দ্বিগুণ করা।',                          next: 'RESULT', tags: ['need_funnel', 'goal_system'],    rawScore: 3 },
      { label: 'নতুন প্রোডাক্ট লাইন বা নতুন মার্কেটে এক্সপ্যান্ড করা।',                next: 'RESULT', tags: ['goal_system', 'need_fullstack'],  rawScore: 4 },
    ],
  },
}
/* Dynamic TOTAL: worst-case path length for display */
const TOTAL_DISPLAY = 14

/* ══════════════════════════════════════════════════
   PACKAGE DEFINITIONS
   "১ মাসের প্ল্যান" → "৩০-দিনের লঞ্চ স্প্রিন্ট"
   Care+ branding replaced with "মাইক্রো টেস্ট" naming
══════════════════════════════════════════════════ */
const PACKAGES = {
  micro_test: {
    variant: 'basic',
    name: 'মাইক্রো টেস্ট',
    price: 'অ্যাড বাজেট অনুযায়ী',
    priceNote: 'সার্ভিস চার্জ ফ্রি',
    tag: 'ফ্রি অডিট স্টার্ট',
    waLabel: 'MicroTest',
    features: [
      'ফ্রি বিজনেস ও টেক অডিট',
      '২০২৬ গ্রোথ স্ট্র্যাটেজি রোডম্যাপ',
      'হাই-কনভার্টিং অ্যাড সেটআপ গাইড',
      'WhatsApp Business সেটআপ পরামর্শ',
      'ইউনিক কনটেন্ট আইডিয়া',
    ],
    sprint30: [
      'বিজনেস ও ডিজিটাল প্রেজেন্স সম্পূর্ণ অডিট',
      'অ্যাড অ্যাকাউন্ট ও Pixel সেটআপ রিভিউ',
      'প্রথম টেস্ট ক্যাম্পেইন লঞ্চ',
      'ডেটা রিভিউ ও পরবর্তী ধাপের পরিকল্পনা',
    ],
  },
  monthly_care: {
    variant: 'popular',
    name: 'মান্থলি কেয়ার',
    price: '১০,০০০',
    priceNote: 'মাসিক',
    tag: 'সবচেয়ে জনপ্রিয়',
    waLabel: 'MonthlyCare',
    features: [
      'AI-পাওয়ার্ড সেলস ফানেল অটোমেশন',
      'ফ্রি আল্ট্রা-ফাস্ট ল্যান্ডিং পেজ (Vite + React)',
      'ফ্রি Pixel ও Conversion API সেটআপ',
      'WhatsApp অটোমেশন বেসিক সেটআপ',
      'আনলিমিটেড অ্যাড ম্যানেজমেন্ট',
      'AI কনটেন্ট আইডিয়া সিস্টেম',
    ],
    sprint30: [
      'ডিজিটাল ইনফ্রাস্ট্রাকচার অডিট (Pixel, CAPI, Analytics)',
      'কাস্টম Vite+React ল্যান্ডিং পেজ বিল্ড ও লাইভ',
      'প্রথম হাই-কনভার্টিং ক্যাম্পেইন সেটআপ ও লঞ্চ',
      'A/B টেস্ট, ROAS রিপোর্ট ও মাস ২ প্ল্যানিং',
    ],
  },
  brand_care: {
    variant: 'premium',
    name: 'ব্র্যান্ড কেয়ার',
    price: '৩০,০০০',
    priceNote: 'মাসিক',
    tag: 'ফুল সার্ভিস',
    waLabel: 'BrandCare',
    features: [
      'অ্যাডভান্সড AI সেলস ফানেল অটোমেশন',
      'আনলিমিটেড ল্যান্ডিং পেজ সাপোর্ট (Vite + React)',
      'AI অথরিটি বিল্ডিং: AEO ও GEO অপটিমাইজেশন',
      'WhatsApp Bot ইন্টিগ্রেশন ও অটোমেশন',
      'মডার্ন ট্র্যাকিং: CAPI, GA4, TikTok Pixel',
      'কাস্টমার সেন্টিমেন্ট ও কনভার্সেশন অ্যানালিসিস',
      'প্রিমিয়াম ব্র্যান্ড আইডেন্টিটি ডিজাইন',
      'উইনিং অ্যাড কনটেন্ট ও ক্রিয়েটিভ স্ট্র্যাটেজি',
    ],
    sprint30: [
      'ফুল ব্র্যান্ড অডিট ও কম্পিটিটর রিসার্চ',
      'ব্র্যান্ড আইডেন্টিটি — লোগো, কালার, টাইপোগ্রাফি',
      'মাল্টি-পেজ Vite+React ওয়েবসাইট বিল্ড ও লাইভ',
      'CAPI + GA4 + TikTok + WhatsApp Bot সম্পূর্ণ সেটআপ',
      'ফার্স্ট অথরিটি ক্যাম্পেইন লঞ্চ ও KPI বেসলাইন',
    ],
  },
}
/* ══════════════════════════════════════════════════
   CROSS-CALCULATION ENGINE
   
   Method: Weighted Tags + Cross-Rule overrides
   
   Step 1 — Accumulate tag counters from all answers
   Step 2 — Apply cross-rules (e.g. high budget + no tracking → monthly_care not brand_care)
   Step 3 — Decide final package from weighted profile
══════════════════════════════════════════════════ */

/**
 * Tag weight map: how much each tag pushes toward each package
 * Format: { tag: { micro_test: N, monthly_care: N, brand_care: N } }
 */
const TAG_WEIGHTS = {
  // Business type
  service:      { micro_test: 2, monthly_care: 1, brand_care: 0 },
  local:        { micro_test: 2, monthly_care: 1, brand_care: 0 },
  ecommerce:    { micro_test: 0, monthly_care: 3, brand_care: 1 },
  manufacturer: { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Stage
  stage_early:   { micro_test: 4, monthly_care: 0, brand_care: 0 },
  stage_stuck:   { micro_test: 3, monthly_care: 2, brand_care: 0 },
  stage_scaling: { micro_test: 0, monthly_care: 3, brand_care: 2 },
  stage_premium: { micro_test: 0, monthly_care: 0, brand_care: 5 },
  // Marketing maturity
  mkt_none:       { micro_test: 3, monthly_care: 0, brand_care: 0 },
  mkt_self:       { micro_test: 3, monthly_care: 1, brand_care: 0 },
  mkt_freelancer: { micro_test: 0, monthly_care: 3, brand_care: 1 },
  mkt_agency:     { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Channel
  channel_organic: { micro_test: 3, monthly_care: 1, brand_care: 0 },
  channel_boost:   { micro_test: 3, monthly_care: 1, brand_care: 0 },
  channel_lp:      { micro_test: 0, monthly_care: 3, brand_care: 1 },
  channel_website: { micro_test: 0, monthly_care: 2, brand_care: 3 },
  // Tech
  tech_none:    { micro_test: 3, monthly_care: 1, brand_care: 0 },
  tech_unknown: { micro_test: 2, monthly_care: 2, brand_care: 0 },
  tech_legacy:  { micro_test: 0, monthly_care: 3, brand_care: 1 },
  tech_shopify: { micro_test: 0, monthly_care: 3, brand_care: 1 },
  tech_fast:    { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Pixel/tracking
  pixel_none:  { micro_test: 3, monthly_care: 1, brand_care: 0 },
  pixel_skip:  { micro_test: 3, monthly_care: 1, brand_care: 0 },
  pixel_basic: { micro_test: 0, monthly_care: 3, brand_care: 1 },
  pixel_full:  { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // KPI
  kpi_none:    { micro_test: 3, monthly_care: 1, brand_care: 0 },
  kpi_vanity:  { micro_test: 2, monthly_care: 2, brand_care: 0 },
  kpi_partial: { micro_test: 0, monthly_care: 3, brand_care: 1 },
  kpi_full:    { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Brand
  brand_diy:     { micro_test: 3, monthly_care: 1, brand_care: 0 },
  brand_none:    { micro_test: 3, monthly_care: 1, brand_care: 0 },
  brand_partial: { micro_test: 0, monthly_care: 3, brand_care: 2 },
  brand_strong:  { micro_test: 0, monthly_care: 1, brand_care: 4 },
  // Goal
  goal_unclear: { micro_test: 3, monthly_care: 1, brand_care: 0 },
  goal_survive: { micro_test: 3, monthly_care: 1, brand_care: 0 },
  goal_brand:   { micro_test: 0, monthly_care: 1, brand_care: 4 },
  goal_system:  { micro_test: 0, monthly_care: 4, brand_care: 2 },
  // Explicit need
  need_budget:    { micro_test: 4, monthly_care: 1, brand_care: 0 },
  need_adtech:    { micro_test: 1, monthly_care: 4, brand_care: 0 },
  need_funnel:    { micro_test: 0, monthly_care: 4, brand_care: 1 },
  need_fullstack: { micro_test: 0, monthly_care: 1, brand_care: 5 },
  // Pain points
  pain_product: { micro_test: 3, monthly_care: 1, brand_care: 0 },
  pain_trust:   { micro_test: 0, monthly_care: 1, brand_care: 4 },
  pain_tech:    { micro_test: 0, monthly_care: 4, brand_care: 1 },
  pain_roas:    { micro_test: 1, monthly_care: 4, brand_care: 1 },
  // Creative & testing
  creative_diy:     { micro_test: 3, monthly_care: 1, brand_care: 0 },
  creative_need:    { micro_test: 2, monthly_care: 2, brand_care: 0 },
  creative_agency:  { micro_test: 0, monthly_care: 2, brand_care: 2 },
  creative_inhouse: { micro_test: 0, monthly_care: 1, brand_care: 4 },
  test_na:      { micro_test: 3, monthly_care: 0, brand_care: 0 },
  test_never:   { micro_test: 3, monthly_care: 0, brand_care: 0 },
  test_rarely:  { micro_test: 0, monthly_care: 3, brand_care: 0 },
  test_regular: { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Update agility
  update_na:    { micro_test: 3, monthly_care: 1, brand_care: 0 },
  update_slow:  { micro_test: 0, monthly_care: 3, brand_care: 0 },
  update_stale: { micro_test: 0, monthly_care: 3, brand_care: 0 },
  update_agile: { micro_test: 0, monthly_care: 1, brand_care: 3 },
  // Revenue signals
  revenue_low:              { micro_test: 3, monthly_care: 1, brand_care: 0 },
  revenue_mid:              { micro_test: 1, monthly_care: 3, brand_care: 0 },
  revenue_high:             { micro_test: 0, monthly_care: 2, brand_care: 3 },
  revenue_scale_mid:        { micro_test: 0, monthly_care: 3, brand_care: 1 },
  revenue_scale_high:       { micro_test: 0, monthly_care: 1, brand_care: 3 },
  revenue_scale_enterprise: { micro_test: 0, monthly_care: 0, brand_care: 5 },
  revenue_scale_unknown:    { micro_test: 2, monthly_care: 2, brand_care: 0 },
  // Audience type
  audience_b2b:   { micro_test: 0, monthly_care: 2, brand_care: 3 },
  audience_b2c:   { micro_test: 2, monthly_care: 3, brand_care: 1 },
  audience_local: { micro_test: 3, monthly_care: 2, brand_care: 0 },
  audience_mixed: { micro_test: 1, monthly_care: 2, brand_care: 2 },
  // WhatsApp usage
  wa_none:   { micro_test: 3, monthly_care: 1, brand_care: 0 },
  wa_manual: { micro_test: 2, monthly_care: 2, brand_care: 0 },
  wa_basic:  { micro_test: 0, monthly_care: 3, brand_care: 1 },
  wa_goal:   { micro_test: 0, monthly_care: 2, brand_care: 2 },
  // Automation maturity
  automation_none:     { micro_test: 3, monthly_care: 1, brand_care: 0 },
  automation_basic:    { micro_test: 0, monthly_care: 3, brand_care: 1 },
  automation_advanced: { micro_test: 0, monthly_care: 1, brand_care: 4 },
  // AI readiness
  ai_unaware:  { micro_test: 2, monthly_care: 2, brand_care: 0 },
  ai_basic:    { micro_test: 1, monthly_care: 3, brand_care: 1 },
  ai_partial:  { micro_test: 0, monthly_care: 2, brand_care: 2 },
  ai_advanced: { micro_test: 0, monthly_care: 0, brand_care: 5 },
}
/**
 * Cross-Rules: applied AFTER tag scoring.
 * If condition matches → force or cap a package.
 * Rules are evaluated in order; first match wins.
 */
const CROSS_RULES = [
  {
    name: 'eager_no_foundation',
    condition: (tags, flags) =>
      (tags.includes('need_fullstack') || tags.includes('goal_brand') || tags.includes('stage_premium')) &&
      flags.trackingWarning && flags.kpiWarning,
    result: 'monthly_care',
    reason: 'ব্র্যান্ড কেয়ার শুরু করতে ট্র্যাকিং ফাউন্ডেশন আগে দরকার।',
  },
  {
    name: 'agency_budget_conscious',
    condition: (tags) =>
      tags.includes('mkt_agency') && tags.includes('need_budget'),
    result: 'monthly_care',
    reason: 'এজেন্সি ব্যাকগ্রাউন্ড আছে, কিন্তু বাজেট নিয়ন্ত্রণই এখন মূল প্রায়োরিটি।',
  },
  {
    name: 'absolute_beginner',
    condition: (tags, flags) =>
      (tags.includes('stage_early') || tags.includes('mkt_none')) &&
      flags.trackingWarning && tags.includes('channel_organic'),
    result: 'micro_test',
    reason: 'শুরু থেকে সঠিকভাবে সেটআপ করাটাই সবচেয়ে স্মার্ট পদক্ষেপ।',
  },
  {
    name: 'scaling_strong_infra',
    condition: (tags) =>
      tags.includes('stage_scaling') &&
      tags.includes('pixel_full') &&
      tags.includes('tech_fast'),
    result: 'brand_care',
    reason: 'টেকনিক্যাল ফাউন্ডেশন শক্ত। এখন ব্র্যান্ড অথরিটি বিল্ডিংই পরের বড় জাম্প।',
  },
  {
    name: 'b2b_needs_funnel',
    condition: (tags) =>
      tags.includes('audience_b2b') &&
      !tags.includes('tech_fast') &&
      !tags.includes('stage_early'),
    result: 'monthly_care',
    reason: 'B2B সেলস সাইকেল লম্বা। প্রপার ফানেল ছাড়া লিড ধরে রাখা যায় না।',
  },
  {
    name: 'high_revenue_poor_tracking',
    condition: (tags, flags) =>
      tags.includes('revenue_high') && flags.trackingWarning,
    result: 'monthly_care',
    reason: 'এত রেভিনিউ আসছে কিন্তু ট্র্যাকিং নেই মানে প্রতিদিন বাজেট লিক হচ্ছে।',
  },
  {
    name: 'enterprise_ai_ready',
    condition: (tags) =>
      tags.includes('ai_advanced') && tags.includes('revenue_scale_enterprise'),
    result: 'brand_care',
    reason: 'আপনার বিজনেস ফুল ব্র্যান্ড অথরিটি বিল্ডিংয়ের জন্য রেডি।',
  },
]
/**
 * Main scoring function.
 * Returns { pkgKey, score, rawTotal, tags, flags, crossRuleApplied }
 */
const computeResult = (all) => {
  // Accumulate tags + flags + rawScore
  let rawTotal = 0
  const allTags = []
  const flags = {
    trackingWarning: false,
    kpiWarning: false,
    landingPageWarning: null,
    techGap: false,
  }

  all.forEach((opt) => {
    rawTotal += opt.rawScore || 0
    if (opt.tags) allTags.push(...opt.tags)
    if (opt.flags) {
      if (opt.flags.trackingWarning)    flags.trackingWarning = true
      if (opt.flags.kpiWarning)         flags.kpiWarning      = true
      if (opt.flags.landingPageWarning) flags.landingPageWarning = opt.flags.landingPageWarning
      if (opt.flags.techGap)            flags.techGap         = true
    }
  })

  // Step 1: Accumulate weighted scores
  const scores = { micro_test: 0, monthly_care: 0, brand_care: 0 }
  for (const tag of allTags) {
    const w = TAG_WEIGHTS[tag]
    if (w) {
      scores.micro_test    += w.micro_test
      scores.monthly_care  += w.monthly_care
      scores.brand_care    += w.brand_care
    }
  }

  // Step 2: Check cross-rules
  let crossRuleApplied = null
  for (const rule of CROSS_RULES) {
    if (rule.condition(allTags, flags)) {
      crossRuleApplied = { name: rule.name, reason: rule.reason, forced: rule.result }
      break
    }
  }

  // Step 3: Decide final package
  let pkgKey
  if (crossRuleApplied) {
    pkgKey = crossRuleApplied.forced
  } else {
    // Highest weighted score wins
    pkgKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
  }

  // Normalize display score (0–100) from rawTotal
  // Graph quiz: min ~7 (all 1s, 7-question path A), max ~48 (all 4s, 12-question path C)
  const score = Math.min(100, Math.max(5, Math.round(((rawTotal - 10) / (52 - 10)) * 100)))

  return {
    score,
    rawTotal,
    pkgKey,
    pkg: PACKAGES[pkgKey],
    diag: getDiagnosis(pkgKey, allTags, flags, crossRuleApplied),
    ...flags,
    crossRuleApplied,
    weightedScores: scores,
  }
}

/* ══════════════════════════════════════════════════
   DIAGNOSIS — Problem → Insight → Solution → Action
   
   Generates HUMAN-LIKE narrative based on actual tags + flags.
   Feels like a consultant, not a calculator.
   
   Enhanced with hyper-contextual bridging logic:
   - If they land on Micro Test but show high-budget + severe gaps → explain why upgrade
   - Dynamic text that feels custom-tailored to their exact pain points
══════════════════════════════════════════════════ */
const getDiagnosis = (pkgKey, tags = [], flags = {}, crossRule = null) => {
  const hasTrackingProblem  = flags.trackingWarning
  const hasRoasProblem      = flags.kpiWarning
  const hasTechGap          = flags.techGap
  const hasNoLp             = flags.landingPageWarning === 'none'
  const hasWeakLp           = flags.landingPageWarning === 'weak'

  const wantsBrand          = tags.includes('goal_brand') || tags.includes('need_fullstack')
  const wantsFullstack      = tags.includes('need_fullstack')
  const isEarly             = tags.includes('stage_early') || tags.includes('stage_stuck')
  const isScaling           = tags.includes('stage_scaling') || tags.includes('stage_premium')
  const hasHighBudget       = tags.includes('need_funnel') || tags.includes('need_fullstack')
  const isManufacturer      = tags.includes('manufacturer')
  const painIsTech          = tags.includes('pain_tech')
  const painIsTrust         = tags.includes('pain_trust')

  const hasTechShopify      = tags.includes('tech_shopify')
  const hasTechWP           = tags.includes('tech_legacy') && !hasTechShopify
  const legacyPlatformName  =
    hasTechShopify ? 'Shopify/WooCommerce' :
    hasTechWP      ? 'WordPress/Themes'    : null

  const isEnterprise        = tags.includes('revenue_scale_enterprise')
  const needsWaAutomation   = tags.includes('wa_none') || tags.includes('wa_manual')
  const isAiUnaware         = tags.includes('ai_unaware')
  const hasAiAdvanced       = tags.includes('ai_advanced')

  const problems = []
  if (hasTrackingProblem) problems.push('ট্র্যাকিং সেটআপ নেই বলে অ্যাড বাজেট অনুমানের উপর চলছে')
  if (hasRoasProblem)     problems.push('ROAS/ROI ট্র্যাক না হওয়ায় কোন ক্যাম্পেইন লাভজনক তা স্পষ্ট না')
  if (hasTechGap)         problems.push(`${legacyPlatformName ?? 'Legacy Tech'} দিয়ে সিজনাল ক্যাম্পেইন আপডেট করা কঠিন হচ্ছে`)
  if (hasNoLp)            problems.push('ডেডিকেটেড ল্যান্ডিং পেজ না থাকায় ক্লিক কনভার্সন হচ্ছে না')
  if (hasWeakLp)          problems.push('ধীর পেজ লোড স্পিড ভিজিটরদের ধরে রাখতে পারছে না')

  const problemText = problems.length > 0
    ? problems.join('। ') + '।'
    : 'আপনার ডিজিটাল উপস্থিতিতে কিছু সুনির্দিষ্ট গ্যাপ চিহ্নিত হয়েছে।'

  if (pkgKey === 'micro_test') {
    const wasCapped = crossRule && (crossRule.name === 'eager_no_foundation' || crossRule.name === 'absolute_beginner')

    if (isEarly && !tags.includes('mkt_self') && !tags.includes('mkt_freelancer') && !tags.includes('mkt_agency')) {
      const waNote = needsWaAutomation ? ' WhatsApp Business সেটআপ থেকে শুরু করলে প্রথম দিন থেকেই কাস্টমার ধরা সহজ হবে।' : ''
      return {
        problem: `আপনার বিজনেস এখনো ডিজিটাল মার্কেটিং শুরু করেনি।${waNote} এটা আসলে একটা সুযোগ — শুরুতেই সঠিক ভিত্তি তৈরি করলে পরে অনেক কম খরচে বেশি ফলাফল পাওয়া যায়।`,
        stage: 'একদম নতুন শুরু। এই পর্যায়ে সবচেয়ে বড় ভুল হলো তাড়াহুড়ো করে অ্যাড চালানো। সেটাপ ঠিক না থাকলে প্রথম বাজেটটাই পানিতে যাবে।',
        insight: 'নতুন বিজনেসের জন্য আগে দরকার সঠিক অ্যাকাউন্ট সেটআপ, পেজ অপটিমাইজেশন আর কোন ধরনের কনটেন্ট কাজ করে সেটা বোঝা। মাইক্রো টেস্টে আমরা এই পুরো ফাউন্ডেশনটা একসাথে রেডি করে দিই, বিনামূল্যে।',
        advice: 'মাইক্রো টেস্ট সম্পূর্ণ ফ্রি। আমরা আপনার বিজনেস দেখব, কোথা থেকে শুরু করলে সবচেয়ে দ্রুত ফলাফল আসবে সেটা পরিষ্কার করে বলব। শুরু করুন, কোনো চুক্তি নেই।',
      }
    }

    if (wasCapped && wantsBrand && (hasTrackingProblem || hasRoasProblem)) {
      return {
        problem: problemText,
        stage: 'উচ্চাভিলাষ ভালো, ব্র্যান্ড বিল্ডিং একটা শক্তিশালী লক্ষ্য। কিন্তু এই মুহূর্তে ফাউন্ডেশন ঠিক না থাকায় সেখানে পৌঁছানো কঠিন।',
        insight: `${hasTrackingProblem ? 'Pixel ও CAPI ছাড়া' : ''} ${hasRoasProblem ? 'ROAS/ROI ট্র্যাকিং ছাড়া' : ''} ব্র্যান্ড কেয়ার শুরু করলে অ্যাড বাজেট অনুমানে চলবে। মাইক্রো টেস্ট দিয়ে শুরু করুন, ডিজিটাল ফাউন্ডেশন ঠিক করুন, তারপর ব্র্যান্ড বিল্ডিং করা অনেক সহজ হবে।`,
        advice: 'মাইক্রো টেস্ট সম্পূর্ণ ফ্রি। পুরো সেটআপ দেখব, কোথায় কী ঠিক করলে সবচেয়ে বেশি কাজ হবে সেটা পরিষ্কার করে বলব।',
      }
    }

    return {
      problem: problemText || 'সঠিক ফাউন্ডেশন ছাড়া পরে বিজ্ঞাপনে টাকা ঢালা মানে বালুতে বাড়ি বানানো।',
      stage: isEarly
        ? 'বিজনেস এখন শুরুর পর্যায়ে। এই সময়টা সবচেয়ে গুরুত্বপূর্ণ, এখনকার সিদ্ধান্তই পরের গ্রোথ নির্ধারণ করে।'
        : 'বিজনেসে এখন সঠিক ডিজিটাল ভিত্তি তৈরির সময়।',
      insight: 'অ্যাড অ্যাকাউন্ট ও বিজনেস পেজ ঠিকমতো সেটআপ না হলে পরে টাকা খরচ করেও ফলাফল আসবে না। মাইক্রো টেস্টে পুরো ডিজিটাল সেটআপ একবার দেখব আর কোথায় কী ঠিক করলে সবচেয়ে বেশি কাজ হবে সেটা পরিষ্কার করে বলব।',
      advice: 'মাইক্রো টেস্ট সম্পূর্ণ ফ্রি। কোনো চুক্তি নেই। শুরু করুন, নিজেই বুঝুন পরের ধাপটা কী।',
    }
  }

  if (pkgKey === 'monthly_care') {
    const needsFunnelBadly = hasHighBudget && (hasTechGap || painIsTech)
    const agencyDowngraded = crossRule && crossRule.name === 'agency_budget_conscious'
    const b2bNeedsFunnel   = crossRule && crossRule.name === 'b2b_needs_funnel'
    const highRevNoTrack   = crossRule && crossRule.name === 'high_revenue_poor_tracking'
    const waNote           = needsWaAutomation ? ' WhatsApp অটোমেশন সেটআপ করলে ম্যানুয়াল রিপ্লাইয়ে সময় নষ্ট বন্ধ হবে।' : ''

    if (b2bNeedsFunnel) {
      return {
        problem: problemText,
        stage: 'আপনার B2B কাস্টমার বেস আছে। B2B সেলস সাইকেল লম্বা তাই শুধু বুস্ট দিয়ে কাজ হয় না, একটা প্রপার ফানেল ছাড়া লিড হারিয়ে যায়।',
        insight: 'B2B বিজনেসে কাস্টমার সিদ্ধান্ত নিতে সময় লাগে। সেই সময়টায় তাকে ধরে রাখতে দরকার কাস্টম ল্যান্ডিং পেজ, রিটার্গেটিং আর WhatsApp follow-up সিকোয়েন্স। মান্থলি কেয়ারে এই পুরো ফানেলটা একটাই টিম বানিয়ে দেয়।',
        advice: 'মান্থলি কেয়ারে ৩০ দিনের স্প্রিন্টে B2B ফানেল রেডি হবে — ল্যান্ডিং পেজ থেকে WhatsApp সিকোয়েন্স পর্যন্ত একটাই টিম।',
      }
    }

    if (highRevNoTrack) {
      return {
        problem: problemText,
        stage: 'রেভিনিউ ভালো আসছে কিন্তু ট্র্যাকিং না থাকায় আসলে কতটা লাভ হচ্ছে বোঝা যাচ্ছে না।',
        insight: `এই রেভিনিউ লেভেলে ট্র্যাকিং না থাকা মানে প্রতিদিন কিছু বাজেট লিক হচ্ছে। Pixel + CAPI সেটআপ করলে Facebook অ্যালগরিদম ঠিক কাস্টমার খুঁজে পাবে আর ROAS দ্রুত উন্নত হবে।${waNote}`,
        advice: 'মান্থলি কেয়ারে Pixel, CAPI, আর ল্যান্ডিং পেজ একটাই টিম সামলাবে। ৩০ দিনে পুরো ট্র্যাকিং ইনফ্রাস্ট্রাকচার রেডি হবে।',
      }
    }

    if (needsFunnelBadly) {
      return {
        problem: problemText,
        stage: 'বিজনেস এখন বাড়ার পর্যায়ে। টেকনিক্যাল সাপোর্ট ঠিক থাকলে সেল দ্রুত বাড়বে।',
        insight: `${painIsTech ? 'সবচেয়ে বড় সমস্যা টেকনিক্যাল গ্যাপ।' : `${legacyPlatformName ?? 'Legacy Tech'} দিয়ে সিজনাল ক্যাম্পেইন আপডেট করা কঠিন হচ্ছে।`} মান্থলি কেয়ারে একই টিম মার্কেটিং আর ডেভেলপমেন্ট দেখে, তাই ঈদ বা পূজার অফার মিনিটে লাইভ করা যায়।${waNote}`,
        advice: 'মান্থলি কেয়ারে ৩০ দিনের স্প্রিন্টে পুরো ডিজিটাল ইনফ্রাস্ট্রাকচার রেডি করে ফার্স্ট ক্যাম্পেইন লাইভ করা হবে। একটাই টিম, ক্যাম্পেইন থেকে কোড পর্যন্ত।',
      }
    }

    if (agencyDowngraded) {
      return {
        problem: problemText,
        stage: 'এজেন্সি ব্যাকগ্রাউন্ড আছে, মানে ভালো মার্কেটিং কেমন হয় সেটা জানেন। কিন্তু এই মুহূর্তে বাজেট নিয়ন্ত্রণই মূল প্রায়োরিটি।',
        insight: `মান্থলি কেয়ার দিয়ে শুরু করলে ফ্রি ল্যান্ডিং পেজ আর ফ্রি Pixel+CAPI সেটআপ পাবেন, কোনো আপফ্রন্ট খরচ ছাড়াই।${waNote}`,
        advice: 'মান্থলি কেয়ার মানে প্রফেশনাল মার্কেটিং যা বাজেটের মধ্যে থেকে স্কেল করে। পরে বিজনেস আরো বাড়লে ব্র্যান্ড কেয়ারে আপগ্রেড করা যাবে।',
      }
    }

    return {
      problem: problemText || 'অ্যাড খরচ হচ্ছে কিন্তু ট্র্যাকিং ও ফানেল না থাকায় কনভার্সন রেট কম।',
      stage: 'বিজনেস এখন বাড়ার পর্যায়ে। সঠিক সাপোর্ট পেলে সেল আরো দ্রুত বাড়বে।',
      insight: `অ্যাড ম্যানেজমেন্ট আর ল্যান্ডিং পেজ একই টিম দেখলে ফলাফল অনেক ভালো হয়। ঈদ বা পূজার অফার তাৎক্ষণিক লাইভ করা যায়, ট্র্যাকিং সবসময় ঠিক থাকে।${waNote}`,
      advice: 'মান্থলি কেয়ারে একটাই টিম, ক্যাম্পেইন থেকে কোড পর্যন্ত। ৩০ দিনের স্প্রিন্টে পুরো ডিজিটাল ইনফ্রাস্ট্রাকচার রেডি করে ফার্স্ট ক্যাম্পেইন লাইভ করা হবে।',
    }
  }

  const manufacturerNeedsBrand = isManufacturer && (painIsTrust || wantsBrand)
  const trustIssuePrimary      = painIsTrust && wantsFullstack
  const enterpriseReady        = isEnterprise && hasAiAdvanced

  const aiLine = isAiUnaware
    ? ' আর ২০২৬-এ AI ইন্টিগ্রেশন না থাকলে প্রতিযোগীরা দ্রুত এগিয়ে যাবে।'
    : hasAiAdvanced
      ? ' AI ইন্টিগ্রেশন আছে বলে ব্র্যান্ড কেয়ারের পুরো সুবিধা নেওয়া সহজ হবে।'
      : ''

  if (enterpriseReady) {
    return {
      problem: problemText || 'এন্টারপ্রাইজ লেভেলে পৌঁছে গেছেন। এখন দরকার পুরো ইকোসিস্টেমকে একটা শক্তিশালী ব্র্যান্ডের নিচে আনা।',
      stage: 'আপনার বিজনেস এন্টারপ্রাইজ লেভেলে আছে আর AI ইন্টিগ্রেশনও সম্পূর্ণ। এটা অনেক বড় অর্জন।',
      insight: 'এই পর্যায়ে দরকার AEO ও GEO অপটিমাইজেশন, মানে AI সার্চ ইঞ্জিনেও আপনার ব্র্যান্ড যেন শীর্ষে থাকে। ব্র্যান্ড কেয়ারে আমরা এই পুরো ইকোসিস্টেম একটা কেন্দ্রীয় কৌশলের নিচে আনব।',
      advice: 'ব্র্যান্ড কেয়ারে পাবেন পূর্ণ ব্র্যান্ড অথরিটি বিল্ডিং, AEO/GEO অপটিমাইজেশন আর ডেডিকেটেড টিম যারা শুধু আপনার বিজনেসের জন্যই কাজ করে।',
    }
  }

  if (manufacturerNeedsBrand) {
    return {
      problem: problemText || 'নিজস্ব ম্যানুফ্যাকচারিং থাকলেও ব্র্যান্ড আইডেন্টিটি ছাড়া প্রিমিয়াম দাম পাওয়া কঠিন।',
      stage: 'নিজে প্রোডাক্ট বানান, এটা বিশাল সুবিধা। কিন্তু মার্কেটে ব্র্যান্ড আইডেন্টিটি ছাড়া আপনাকে আর দশজনের মতোই দেখায়।',
      insight: `ম্যানুফ্যাকচারার হলে প্রিমিয়াম মার্কেটে আপনার জায়গা হওয়া উচিত। কিন্তু সেটা করতে দরকার শক্তিশালী ব্র্যান্ড আইডেন্টিটি, কাস্টম ডিজাইন, সুনির্দিষ্ট সেলস ফানেল আর ডেটা-চালিত মার্কেটিং।${legacyPlatformName ? ` ${legacyPlatformName} দিয়ে ২০২৬-এ প্রিমিয়াম ব্র্যান্ড বানানো যায় না।` : ' Legacy Tech দিয়ে ২০২৬-এ প্রিমিয়াম ব্র্যান্ড বানানো যায় না।'}${aiLine}`,
      advice: 'ব্র্যান্ড কেয়ারে পুরো ব্র্যান্ড গড়ার কাজ করব। লোগো থেকে কাস্টম ল্যান্ডিং পেজ, অ্যাডভান্সড ট্র্যাকিং থেকে ফুল-স্ট্যাক মার্কেটিং, একটাই টিম যারা আপনার বিজনেস ভেতর থেকে চেনে।',
    }
  }

  if (trustIssuePrimary) {
    return {
      problem: problemText || 'বাজারে ট্রাস্ট তৈরি না হলে প্রতিযোগিতায় টিকে থাকা কঠিন।',
      stage: 'সবচেয়ে বড় চ্যালেঞ্জ ট্রাস্ট বিল্ডিং। মানুষ এখনো আপনাকে একটা প্রতিষ্ঠিত ব্র্যান্ড হিসেবে দেখছে না।',
      insight: `ট্রাস্ট শুধু ভালো প্রোডাক্ট দিয়ে আসে না, আসে ব্র্যান্ড আইডেন্টিটি, প্রফেশনাল ওয়েবসাইট, কনসিস্টেন্ট কমিউনিকেশন আর কাস্টমার এক্সপেরিয়েন্স থেকে। ব্র্যান্ড কেয়ারে এই পুরো ইকোসিস্টেম তৈরি করি।${aiLine}`,
      advice: 'ব্র্যান্ড কেয়ারে পাবেন পূর্ণ ব্র্যান্ড আইডেন্টিটি, প্রিমিয়াম ডিজাইন, অ্যাডভান্সড ট্র্যাকিং আর ডেডিকেটেড টিম।',
    }
  }

  return {
    problem: problemText || 'ব্র্যান্ড আইডেন্টিটি ও অথরিটি ছাড়া প্রিমিয়াম মার্কেটে টিকে থাকা কঠিন।',
    stage: isScaling
      ? 'বিজনেস এখন শক্তিশালী ব্র্যান্ড হওয়ার জায়গায় দাঁড়িয়ে আছে। এটা অনেক বড় অর্জন।'
      : 'বিজনেস এখন মার্কেট লিডার হওয়ার পর্যায়ে।',
    insight: `এই পর্যায়ে শুধু সেল না, দরকার একটা ব্র্যান্ড আইডেন্টিটি যা মানুষ চেনে আর বিশ্বাস করে।${legacyPlatformName ? ` ${legacyPlatformName} দিয়ে ২০২৬-এ মার্কেট ডমিনেট করা যায় না।` : ' Legacy Tech দিয়ে ২০২৬-এ মার্কেট ডমিনেট করা যায় না।'} কাস্টম ডিজাইন, সুনির্দিষ্ট সেলস ফানেল আর ডেটা-চালিত মার্কেটিং একসাথে থাকলে ব্র্যান্ড দ্রুত বড় হয়।${aiLine}`,
    advice: 'ব্র্যান্ড কেয়ারে পুরো ব্র্যান্ড গড়ার কাজ করব। লোগো থেকে কাস্টম ল্যান্ডিং পেজ, অ্যাডভান্সড ট্র্যাকিং থেকে ফুল-স্ট্যাক মার্কেটিং, একটাই টিম যারা আপনার বিজনেস ভেতর থেকে চেনে।',
  }
}
/* ══════════════════════════════════════════════════
   SMART VALIDATION — Lead Capture Gate
   
   Phone: Bangladesh-specific validation (10-11 digits, proper format)
   Name: Anti-spam logic (reject "test", "asdf", numbers-only)
   Business: Minimum 4 chars, must contain actual letters
══════════════════════════════════════════════════ */

// Common spam patterns to reject
const SPAM_PATTERNS = [
  /^test$/i, /^asdf/i, /^qwer/i, /^zxcv/i,
  /^aaa+$/i, /^bbb+$/i, /^xxx+$/i,
  /^demo$/i, /^sample$/i, /^example$/i,
  /^\d+$/, // numbers only
]

const validateBusinessName = (name) => {
  const trimmed = name.trim()
  
  // Minimum length
  if (trimmed.length < 4) return 'বিজনেসের নাম কমপক্ষে ৪ অক্ষর হতে হবে।'
  
  // Must contain at least some letters (not just numbers/symbols)
  if (!/\p{L}/u.test(trimmed)) return 'বিজনেসের নামে অক্ষর থাকতে হবে।'
  
  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) return 'সঠিক বিজনেসের নাম দিন।'
  }
  
  return null // Valid
}

const validateBdPhone = (phone) => {
  const trimmed = phone.trim()
  
  // BD numbers: 10 digits (without country code) or 11 digits (with leading 0)
  // Valid formats: 1XXXXXXXXX (10 digits) or 01XXXXXXXXX (11 digits starting with 0)
  const validPattern = /^(0?1[3-9]\d{8})$/
  
  if (!validPattern.test(trimmed)) {
    return 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (১০ বা ১১ ডিজিট)।'
  }
  
  return null // Valid
}

const scoreLabel = (pkgKey) =>
  pkgKey === 'micro_test' ? 'শুরুর পর্যায়' : pkgKey === 'monthly_care' ? 'গ্রোথ রেডি' : 'স্কেল রেডি'

/* Stable module-level constant — safe to reference inside useEffect */
const ANALYSIS_STEPS = [
  'মার্কেট বেঞ্চমার্কিং চলছে…',
  'টেক স্ট্যাক বিশ্লেষণ হচ্ছে…',
  'লজিক সিন্থেসিস চলছে…',
  'রোডম্যাপ ফাইনালাইজ হচ্ছে…',
]

const bn = (n) => String(n).split('').map(d => '০১২৩৪৫৬৭৮৯'[+d] ?? d).join('')

/* ══════════════════════════════════════════════════
   GRAPH TRAVERSAL — follows .next on each option
   No skip logic needed: the graph encodes all paths.
══════════════════════════════════════════════════ */
const getNextId = (selectedOpt) => selectedOpt.next

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Finder() {
  const [nodeId,     setNodeId]     = useState('stage')       // current graph node
  const [answers,    setAnswers]    = useState([])
  const [selIdx,     setSelIdx]     = useState(null)
  const [locked,     setLocked]     = useState(false)
  const [phase,      setPhase]      = useState('quiz')
  const [visible,    setVisible]    = useState(true)
  const [result,     setResult]     = useState(null)
  const [history,    setHistory]    = useState([])            // stack of {nodeId, answerIdx}

  const [leadName,       setLeadName]       = useState('')
  const [leadPhone,      setLeadPhone]      = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadError,      setLeadError]      = useState('')

  const [pdfLoading,    setPdfLoading]    = useState(false)
  const [analysisStep,  setAnalysisStep]  = useState(0)

  const resultRef       = useRef(null)
  const sectionRef      = useRef(null)
  const enterTimeRef    = useRef(null)
  const sectionFiredRef = useRef(false)
  const quizStartTime   = useRef(null)
  const dropOffQRef     = useRef(null)
  const pendingAnswers  = useRef(null)
  const nameRef         = useRef(null)

  // Current node from graph
  const node = Q[nodeId]
  // How many questions answered so far (for progress display)
  const questionNum = answers.length + 1

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !sectionFiredRef.current) {
        sectionFiredRef.current = true
        enterTimeRef.current    = Date.now()
        track('ViewContent', { content_name: 'Finder Section', content_category: 'Section' })
        io.unobserve(el)
      }
    }, { threshold: 0.15 })
    io.observe(el)
    const pushEng = () => pushEngagement('finder', enterTimeRef, { quiz_drop_off_question: dropOffQRef.current })
    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEng)
    }
  }, [])

  useEffect(() => {
    if (pdfLoading) {
      setAnalysisStep(0)
      const timer = setInterval(() => {
        setAnalysisStep(s => (s < ANALYSIS_STEPS.length - 1 ? s + 1 : s))
      }, 1800)
      return () => clearInterval(timer)
    }
  }, [pdfLoading])

  useEffect(() => {
    if (phase === 'lead') setTimeout(() => nameRef.current?.focus(), 300)
  }, [phase])

  const reset = useCallback(() => {
    setNodeId('stage'); setAnswers([]); setSelIdx(null); setLocked(false)
    setPhase('quiz'); setVisible(true); setResult(null); setHistory([])
    setLeadName(''); setLeadPhone(''); setLeadError('')
    pendingAnswers.current = null; quizStartTime.current = null; dropOffQRef.current = null
    track('ViewContent', { content_name: 'Finder Quiz Restart', content_category: 'Quiz' })
  }, [])

  const pick = useCallback((optIdx) => {
    if (locked) return
    setLocked(true); setSelIdx(optIdx)
    const opt = node.opts[optIdx]
    const newAnswers = [...answers, opt]
    dropOffQRef.current = questionNum

    if (questionNum === 1 && !quizStartTime.current) {
      quizStartTime.current = Date.now()
      track('InitiateCheckout', { content_name: 'Finder Quiz Start', content_category: 'Quiz', currency: 'BDT', value: 0 })
    }

    track('ViewContent', {
      content_name: `Finder ${nodeId}: ${opt.label}`,
      content_category: 'Quiz Answer',
      content_ids: [`finder_${nodeId}`],
      quiz_question: nodeId,
      quiz_answer_index: optIdx + 1,
      quiz_progress_pct: Math.round((questionNum / TOTAL_DISPLAY) * 100),
    })

    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        const nextId = getNextId(opt)
        if (nextId === 'RESULT') {
          pendingAnswers.current = newAnswers
          setAnswers(newAnswers); setPhase('lead'); setVisible(true); setLocked(false)
        } else {
          setHistory(prev => [...prev, { nodeId, answerIdx: optIdx }])
          setAnswers(newAnswers); setNodeId(nextId); setSelIdx(null)
          setTimeout(() => { setVisible(true); setLocked(false) }, 60)
        }
      }, 170)
    }, 120)
  }, [locked, nodeId, answers, node, questionNum])

  const goBack = useCallback(() => {
    if (history.length === 0) return
    setVisible(false)
    setTimeout(() => {
      const prev = history[history.length - 1]
      setHistory(h => h.slice(0, -1))
      setAnswers(a => a.slice(0, -1))
      setNodeId(prev.nodeId)
      setSelIdx(prev.answerIdx)
      setLocked(false); setVisible(true)
    }, 170)
  }, [history])

  const handleLeadSubmit = useCallback((e) => {
    e.preventDefault()
    const name  = leadName.trim()
    const phone = leadPhone.trim()

    // Smart validation
    const nameError = validateBusinessName(name)
    if (nameError) { setLeadError(nameError); return }

    const phoneError = validateBdPhone(phone)
    if (phoneError) { setLeadError(phoneError); return }

    setLeadError(''); setLeadSubmitting(true)

    track('Lead', {
      content_name: 'Finder Lead Capture',
      content_category: 'Lead',
      business_name: name,
      whatsapp: phone,
    })

    /* Ghost Backend: POST to Google Forms silently */
    const GF_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'
    const allAnswerText = pendingAnswers.current?.map((a, i) => `Q${i + 1}: ${a.label}`).join('\n') ?? ''
    const fd = new FormData()
    fd.append('entry.000000001', name)
    fd.append('entry.000000002', `+880${phone}`)
    fd.append('entry.000000003', allAnswerText)
    fetch(GF_URL, { method: 'POST', body: fd, mode: 'no-cors' }).catch(() => {})

    setTimeout(() => {
      setLeadSubmitting(false)
      setPhase('loading')
      setTimeout(() => {
        const res = computeResult(pendingAnswers.current)
        res._answers = pendingAnswers.current   // PDF layer uses this for isPathA check
        setResult(res)
        const doTransition = () => {
          setPhase('result')
        }
        if (document.startViewTransition) {
          document.startViewTransition(doTransition)
        } else {
          doTransition()
        }
        const timeSpent = quizStartTime.current ? Math.round((Date.now() - quizStartTime.current) / 1000) : 0
        track('Lead', {
          content_name:      `Finder Result: ${res.pkg.name}`,
          content_category:  'Quiz Complete',
          content_ids:       [`finder_pkg_${res.pkgKey}`],
          currency: 'BDT', value: 0,
          quiz_score: res.score,
          quiz_package: res.pkg.waLabel,
          quiz_time_seconds: timeSpent,
          business_name: name,
          whatsapp: phone,
        })
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }, 5500)
    }, 400)
  }, [leadName, leadPhone])

  const buildWaMsg = useCallback((pkgName) => {
    const name = leadName.trim() || 'আমি'
    return `হ্যালো Digitalizen, আমি ${name}। ফাইন্ডার অডিট শেষ করলাম এবং ${pkgName} নিয়ে কথা বলতে চাই। বিস্তারিত জানতে চাই।`
  }, [leadName])

  const handleCtaPrimary = useCallback(() => {
    if (!result) return
    track('InitiateCheckout', { content_name: `Finder CTA: ${result.pkg.name}`, content_category: 'CTA', content_ids: [`finder_pkg_${result.pkgKey}`], currency: 'BDT', value: 0 })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg(result.pkg.name))}`, '_blank', 'noopener,noreferrer')
  }, [result, buildWaMsg])

  const handleUpsellMonthly = useCallback(() => {
    track('AddToCart', { content_name: 'Monthly Care Upsell', content_category: 'Upsell', content_ids: ['finder_pkg_monthly_care'], currency: 'BDT', value: 0 })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg('মান্থলি কেয়ার'))}`, '_blank', 'noopener,noreferrer')
  }, [buildWaMsg])

  const handleUpsellBrand = useCallback(() => {
    track('AddToCart', { content_name: 'Brand Care Upsell', content_category: 'Upsell', content_ids: ['finder_pkg_brand_care'], currency: 'BDT', value: 0 })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg('ব্র্যান্ড কেয়ার'))}`, '_blank', 'noopener,noreferrer')
  }, [buildWaMsg])

  const handleLandingPageCta = useCallback(() => {
    track('AddToCart', { content_name: 'Landing Page CTA', content_category: 'Upsell', content_ids: ['landing_page_service'], currency: 'BDT', value: 0 })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো Digitalizen, হাই-স্পিড কাস্টম ল্যান্ডিং পেজ বানাতে চাই।')}`, '_blank', 'noopener,noreferrer')
  }, [])

  const triggerPdfDownload = useCallback(async () => {
    if (!result) return
    setPdfLoading(true)
    try {
      /* Lazy import — jsPDF + html2canvas (~400KB) load ONLY when
         the user actually clicks download. Zero impact on initial TTI. */
      const { generateBrandedPdf } = await import('../lib/generatePdf.js')
      await generateBrandedPdf('finder-pdf-layer', `Digitalizen-Roadmap-${result.pkg.waLabel}-${Date.now()}.pdf`)
    } catch (err) {
      console.error('[Finder PDF]', err)
    } finally {
      setPdfLoading(false)
    }
  }, [result])

  /* ── Diagnostic Score (Psychological Validation) ── */
  const diagnosticScore = result
    ? result.pkgKey === 'brand_care'   ? '87/100'
    : result.pkgKey === 'monthly_care' ? '64/100'
    : '41/100'
    : null

  /* ── Warnings ── */
  // Path A = new business (stage_early). They haven't run ads, don't have a page yet.
  // Operational warnings (techGap, landingPage) are MEANINGLESS for them —
  // "can't update your page" is absurd when you don't have one yet.
  // We suppress all flags and let getDiagnosis carry the full narrative.
  const isPathA = result?.pkgKey === 'micro_test' &&
    pendingAnswers.current?.some(a => a.tags?.includes('stage_early'))

  const warnings = result && !isPathA ? [
    result.trackingWarning && {
      key: 'tracking', color: 'red', icon: 'warning',
      title: 'আপনার অ্যাড বাজেট ড্রেনে যাচ্ছে',
      text: 'Pixel ও CAPI ছাড়া Facebook জানতে পারে না কে কিনছে। অ্যাড বারবার ভুল মানুষের কাছে যাচ্ছে এবং বাজেট নষ্ট হচ্ছে। এটা টেকনিক্যাল কাজ — আমরা সেটআপ করে দিতে পারি।',
    },
    result.kpiWarning && {
      key: 'kpi', color: 'amber', icon: 'info',
      title: 'অ্যাডের আসল লাভ-লোকসান হিসাব হচ্ছে না',
      text: 'শুধু লাইক বা মেসেজ দেখে বোঝা যায় না অ্যাডে লাভ হচ্ছে কিনা। ROAS ট্র্যাক না করলে কোন ক্যাম্পেইন টাকা নষ্ট করছে সেটা বোঝা সম্ভব না।',
    },
    result.techGap && {
      key: 'techGap', color: 'amber', icon: 'warning',
      title: 'সিজনাল ক্যাম্পেইনে পেজ আপডেট করতে পারছেন না',
      text: 'Digitalizen-এ মার্কেটার আর ডেভেলপার একই টিমে, তাই নতুন ক্যাম্পেইন লাইভ করতে ঘণ্টার বেশি লাগে না। Legacy টেক দিয়ে ২০২৬-এ টিকে থাকা অসম্ভব।',
    },
    result.landingPageWarning && {
      key: 'landingPage', color: 'amber', icon: 'warning',
      title: result.landingPageWarning === 'none' ? 'আলাদা ল্যান্ডিং পেজ নেই' : 'ল্যান্ডিং পেজের গতি বাড়ানো দরকার',
      text: result.landingPageWarning === 'none'
        ? 'অ্যাড দেখে ক্লিক করা মানুষ সরাসরি ইনবক্সে গেলে অনেকেই মেসেজ না করে চলে যায়। ডেডিকেটেড ল্যান্ডিং পেজ থাকলে কনভার্সন অনেক বেড়ে যায়।'
        : 'পেজ লোড হতে দেরি হলে ভিজিটর অপেক্ষা না করে চলে যান। দ্রুত পেজ মানে বেশি কনভার্সন, কম অ্যাড খরচে বেশি সেল।',
    },
  ].filter(Boolean) : []

  /* ═════════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════════ */
  return (
    <section id="finder" className="finder-section" ref={sectionRef} aria-label="প্যাকেজ ফাইন্ডার — আপনার বিজনেসের জন্য সঠিক প্ল্যান খুঁজুন">
      {/* Grid background — matches other sections exactly */}
      <div className="finder-bg-grid" aria-hidden="true" />

      <div className="container">

        <div className="row-header">
          <span className="section-num">০০৪</span>
          <span className="section-title-right">{'// ফ্রি বিজনেস ও টেক অডিট'}</span>
        </div>

        <h2 className="finder-heading">
          আপনার ব্যবসার<br />
          <span className="text-glow">স্বাস্থ্য পরীক্ষা!</span>
        </h2>
        <p className="finder-sub">
          মাত্র ১০–১৪টি স্মার্ট প্রশ্ন = আপনার বিজনেসের জন্য একটি কাস্টম রোডম্যাপ।
        </p>

        <div className="finder-card">

          {/* ══ QUIZ ══ */}
          {phase === 'quiz' && (
            <div className="finder-quiz" style={{
              opacity: visible ? 1 : 0,
              visibility: visible ? 'visible' : 'hidden',
              pointerEvents: visible ? 'auto' : 'none',
              transform: visible ? 'none' : 'translateX(12px)',
              transition: 'opacity 0.17s ease, transform 0.17s ease',
            }}>
              <div className="finder-pips">
                {history.map((_, i) => (
                  <div key={i} className="finder-pip finder-pip--done" />
                ))}
                <div className="finder-pip finder-pip--current" />
                {/* Ghost pips — estimated remaining */}
                {Array.from({ length: Math.max(0, TOTAL_DISPLAY - questionNum) }).map((_, i) => (
                  <div key={`g${i}`} className="finder-pip" />
                ))}
              </div>
              <div className="finder-step-meta">
                <span className="finder-step-label">বিজনেস ও টেক অডিট</span>
                <span className="finder-step-counter">প্রশ্ন {bn(questionNum)} / ~{bn(TOTAL_DISPLAY)}</span>
              </div>
              <p className="finder-q">{node.q}</p>
              {node.hint && <p className="finder-hint">{node.hint}</p>}
              <div className="finder-opts">
                {node.opts.map((o, i) => (
                  <button
                    key={i}
                    className={`finder-opt${selIdx === i ? ' finder-opt--selected' : ''}`}
                    onClick={() => pick(i)}
                    disabled={locked}
                  >
                    <span className="finder-opt__key" aria-hidden="true">
                      {['A','B','C','D'][i]}
                    </span>
                    <span className="finder-opt__text">{o.label}</span>
                    {selIdx === i && <span className="finder-opt__sel" aria-hidden="true">{Icon.check}</span>}
                  </button>
                ))}
              </div>
              {history.length > 0 && (
                <button className="finder-back" onClick={goBack} aria-label="আগের প্রশ্নে ফিরে যান">
                  {Icon.back} আগের প্রশ্ন
                </button>
              )}
            </div>
          )}

          {/* ══ LEAD GATE ══ */}
          {phase === 'lead' && (
            <div className="finder-lead" style={{
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}>
              <div className="finder-lead__badge">অডিট সম্পন্ন</div>
              <h3 className="finder-lead__title">আপনার রিপোর্ট রেডি!</h3>
              <p className="finder-lead__sub">ফলাফল দেখতে আপনার বিজনেসের নাম ও WhatsApp নম্বর দিন। রিপোর্ট PDF হিসেবেও ডাউনলোড করতে পারবেন।</p>
              <form onSubmit={handleLeadSubmit} className="finder-lead__form">
                <div className="finder-lead__field">
                  <label className="finder-lead__label" htmlFor="fl-name">বিজনেসের নাম</label>
                  <input
                    id="fl-name" ref={nameRef}
                    type="text" autoComplete="organization"
                    value={leadName}
                    onChange={e => setLeadName(e.target.value)}
                    placeholder="যেমন: Digitalizen Agency PLC."
                    className="finder-lead__input"
                  />
                </div>
                <div className="finder-lead__field">
                  <label className="finder-lead__label" htmlFor="fl-phone">WhatsApp নম্বর</label>
                  <div className="finder-lead__phone-wrap">
                    <span className="finder-lead__phone-prefix">+880</span>
                    <input
                      id="fl-phone"
                      type="tel" autoComplete="tel"
                      value={leadPhone}
                      onChange={e => setLeadPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="1XXXXXXXXX"
                      maxLength={11}
                      className="finder-lead__input finder-lead__input--phone"
                    />
                  </div>
                </div>
                {leadError && <p className="finder-lead__error" role="alert">{leadError}</p>}
                <button type="submit" className="finder-lead__submit" disabled={leadSubmitting}>
                  {leadSubmitting ? (
                    <><span className="finder-pdf-spinner" aria-hidden="true" /> প্রসেস হচ্ছে…</>
                  ) : (
                    <>
                      <span>ফলাফল দেখুন</span>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>
                <p className="finder-lead__fine">আপনার তথ্য শুধু রিপোর্ট পাঠাতে ব্যবহার হবে। স্প্যাম নেই।</p>
              </form>
            </div>
          )}

          {/* ══ LOADING ══ */}
          {phase === 'loading' && (
            <div className="finder-loading">
              <ParticleCanvas className="finder-loading__particles" />

              <div className="finder-loading__hero">
                <div className="finder-loading__ring" aria-hidden="true">
                  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                    <circle cx="36" cy="36" r="30" stroke="var(--border2)" strokeWidth="2"/>
                    <circle cx="36" cy="36" r="30" stroke="#1F4BFF" strokeWidth="2"
                      strokeLinecap="round" strokeDasharray="188"
                      className="finder-loading__ring-fill"
                    />
                  </svg>
                  <div className="finder-loading__ring-check">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M7 14l5 5 9-9" stroke="#1F4BFF" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="finder-loading__check-path"
                      />
                    </svg>
                  </div>
                </div>
                <div className="finder-loading__hero-text">
                  <p className="finder-loading__title">আপনার বিজনেস বিশ্লেষণ হচ্ছে…</p>
                  <p className="finder-loading__sub">আপনার উত্তর থেকে সেরা সমাধান খুঁজছি</p>
                </div>
              </div>

              <div className="finder-loading__bar-track">
                <div className="finder-loading__bar" />
              </div>

              <div className="finder-loading__steps">
                <div className="finder-loading__step finder-loading__step--1">
                  <div className="finder-loading__step-icon finder-loading__step-icon--1">{Icon.trend}</div>
                  <span className="finder-loading__step-txt">ব্যবসার প্রোফাইল বিশ্লেষণ করা হচ্ছে</span>
                </div>
                <div className="finder-loading__step finder-loading__step--2">
                  <div className="finder-loading__step-icon finder-loading__step-icon--2">{Icon.warning}</div>
                  <span className="finder-loading__step-txt">টেকনিক্যাল গ্যাপ চিহ্নিত করা হচ্ছে</span>
                </div>
                <div className="finder-loading__step finder-loading__step--3">
                  <div className="finder-loading__step-icon finder-loading__step-icon--3">{Icon.check}</div>
                  <span className="finder-loading__step-txt">আপনার জন্য সেরা সমাধান রেডি হচ্ছে</span>
                </div>
              </div>

              <div className="finder-loading__footer">
                <span className="finder-loading__footer-dot" />
                <span className="finder-loading__footer-dot" />
                <span className="finder-loading__footer-dot" />
              </div>
            </div>
          )}

          {/* ══ RESULT — Problem → Solution → Action ══ */}
          {phase === 'result' && result && (
            <div className="finder-result" ref={resultRef}>

              {/* ── PROBLEM: Pain Points ── */}
              {warnings.length > 0 && (
                <div className="finder-problem-band">
                  <div className="finder-problem-band__label">
                    <span className="finder-problem-band__dot" />
                    অডিটে যা পাওয়া গেছে
                  </div>
                  <div className="finder-warnings">
                    {warnings.map((w, i) => (
                      <div key={i} className={`finder-warning finder-warning--${w.color}`}>
                        <div className={`finder-warning__icon finder-warning__icon--${w.color}`}>{Icon[w.icon]}</div>
                        <div>
                          <div className="finder-warning__title">{w.title}</div>
                          <p className="finder-warning__text">{w.text}</p>
                          {w.key === 'landingPage' && (
                            <button className="finder-warning__cta" onClick={handleLandingPageCta}>
                              কাস্টম ল্যান্ডিং পেজ দরকার →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SOLUTION: Package Hero ── */}
              <div className="finder-solution-label">
                <span className="finder-solution-label__line" />
                আমাদের সমাধান
                <span className="finder-solution-label__line" />
              </div>

              <div className={`finder-result__hero finder-result__hero--${result.pkg.variant}`}>
                {result.pkg.variant === 'premium' && <div className="finder-result__gold-strip" aria-hidden="true" />}
                <div className="finder-result__live">
                  <span className={`finder-result__live-dot finder-result__live-dot--${result.pkg.variant}`} />
                  {result.pkg.tag}
                </div>
                <h3 className="finder-result__name">{result.pkg.name}</h3>
                <p className="finder-result__price">
                  <strong>
                    {result.pkgKey === 'micro_test' ? result.pkg.price : `৳ ${result.pkg.price}`}
                  </strong>
                  {result.pkg.priceNote && <span> · {result.pkg.priceNote}</span>}
                </p>
                <div className={`finder-score finder-score--${result.pkg.variant}`}>
                  <span className="finder-score__num">{result.rawTotal}<span style={{ fontSize: '0.55em', opacity: 0.6 }}>/৫২</span></span>
                  <div className="finder-score__bar-wrap">
                    <div className="finder-score__bar-track">
                      <div className={`finder-score__bar-fill finder-score__bar-fill--${result.pkg.variant}`} style={{ width: `${result.score}%` }} />
                    </div>
                    <span className="finder-score__label">{scoreLabel(result.pkgKey)}</span>
                  </div>
                </div>
              </div>

              {/* ── Professional Insight ── */}
              <div className="finder-insights">
                <span className="finder-insights__label">প্রফেশনাল অ্যানালাইসিস</span>
                <div className="finder-insight">
                  <div className="finder-insight__icon" style={{ background: '#EEF1FC', color: '#1F4BFF' }}>{Icon.trend}</div>
                  <div>
                    <div className="finder-insight__label">এখন কোথায় আছেন</div>
                    <p className="finder-insight__text">{result.diag.stage}</p>
                  </div>
                </div>
                <div className="finder-insight">
                  <div className="finder-insight__icon" style={{ background: '#FEF3C7', color: '#D97706' }}>{Icon.info}</div>
                  <div>
                    <div className="finder-insight__label">আমরা কী দেখলাম</div>
                    <p className="finder-insight__text">{result.diag.insight}</p>
                  </div>
                </div>
              </div>

              {/* ── Advice ── */}
              <div className={`finder-advice finder-advice--${result.pkg.variant}`}>
                <div className="finder-advice__label">আমাদের পরামর্শ</div>
                <p className="finder-advice__text">{result.diag.advice}</p>
              </div>

              {/* ── Package Features ── */}
              <div className={`finder-pkg-detail finder-pkg-detail--${result.pkg.variant}`}>
                <div className="finder-pkg-detail__label">এই প্ল্যানে যা পাচ্ছেন</div>
                <ul className="finder-pkg-detail__list" role="list">
                  {result.pkg.features.map((f, i) => (
                    <li key={i} className="finder-pkg-detail__item">
                      <span className="finder-pkg-detail__check" aria-hidden="true">{Icon.check}</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── 30-Day Launch Sprint (NOT "1 Month Plan") ── */}
              <div className="finder-roadmap">
                <div className="finder-roadmap__label">৩০-দিনের লঞ্চ স্প্রিন্ট</div>
                <ol className="finder-roadmap__list" role="list">
                  {(result.pkg.sprint30 || result.pkg.plan30 || []).map((step, i) => (
                    <li key={i} className="finder-roadmap__item">
                      <span className="finder-roadmap__num" aria-hidden="true">{i + 1}</span>
                      <span className="finder-roadmap__txt">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* ── Upsell nudge ── */}
              {result.pkgKey === 'micro_test' && (
                <div className="finder-upsell">
                  <div className="finder-upsell__label">পরের লজিক্যাল স্টেপ →</div>
                  <p className="finder-upsell__text">মান্থলি কেয়ার নিলে কাস্টম হাই-স্পিড ল্যান্ডিং পেজ (Vite+React), অ্যাড ম্যানেজমেন্ট, Pixel ও CAPI সেটআপ এবং সিজনাল ক্যাম্পেইন — সব একই টিম থেকে।</p>
                  <button className="finder-upsell__btn" onClick={handleUpsellMonthly}>মান্থলি কেয়ার সম্পর্কে জানতে চাই →</button>
                </div>
              )}
              {result.pkgKey === 'monthly_care' && (
                <div className="finder-upsell">
                  <div className="finder-upsell__label">পরের লজিক্যাল স্টেপ →</div>
                  <p className="finder-upsell__text">ব্র্যান্ড কেয়ারে পাবেন পূর্ণ ব্র্যান্ড আইডেন্টিটি, আনলিমিটেড কাস্টম ল্যান্ডিং পেজ এবং ডেডিকেটেড টিম যারা শুধু আপনার ব্যবসার জন্যই কাজ করে।</p>
                  <button className="finder-upsell__btn" onClick={handleUpsellBrand}>ব্র্যান্ড কেয়ার সম্পর্কে জানতে চাই →</button>
                </div>
              )}

              {/* ── Diagnostic Score Badge ── */}
              <div className="finder-diag-score" aria-label={`ডায়াগনস্টিক স্কোর ${diagnosticScore}`}>
                <span className="finder-diag-score__label">ডায়াগনস্টিক স্কোর</span>
                <span className="finder-diag-score__value" aria-live="polite">{diagnosticScore}</span>
              </div>

              {/* ── ACTION: CTAs ── */}
              <div className="finder-pdf-gate">
                <span className="finder-pdf-gate__seal" aria-hidden="true">✓</span>
                আপনার কাস্টম রোডম্যাপ রেডি · ৩০-দিনের স্প্রিন্ট সহ
              </div>
              <div className="finder-ctas">

                {/* PDF Ghost Preview */}
                <div className="finder-pdf-ghost" aria-hidden="true">
                  <div className="finder-pdf-ghost__header">
                    <div className="finder-pdf-ghost__logo-bar" />
                    <div className="finder-pdf-ghost__title-block">
                      <div className="finder-pdf-ghost__line finder-pdf-ghost__line--wide" />
                      <div className="finder-pdf-ghost__line finder-pdf-ghost__line--mid" />
                    </div>
                  </div>
                  <div className="finder-pdf-ghost__body">
                    <div className="finder-pdf-ghost__col">
                      <div className="finder-pdf-ghost__line" />
                      <div className="finder-pdf-ghost__line finder-pdf-ghost__line--mid" />
                      <div className="finder-pdf-ghost__line finder-pdf-ghost__line--short" />
                    </div>
                    <div className="finder-pdf-ghost__col">
                      <div className="finder-pdf-ghost__bar-block">
                        <div className="finder-pdf-ghost__bar" style={{ width: `${result.score}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="finder-pdf-ghost__stamp">PDF রেডি</div>
                </div>

                {/* PDF = PRIMARY hero CTA — value delivery before the ask */}
                <div className="finder-cta-pdf-wrap">
                  <button
                    className={`finder-cta-pdf${pdfLoading ? ' finder-cta-pdf--busy' : ''}`}
                    onClick={triggerPdfDownload}
                    disabled={pdfLoading}
                    aria-label="রোডম্যাপ PDF হিসেবে ডাউনলোড করুন"
                  >
                    {pdfLoading ? (
                      <>
                        <span className="finder-pdf-spinner" aria-hidden="true" />
                        <span>{ANALYSIS_STEPS[analysisStep]}</span>
                        <span aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <span>রোডম্যাপ ডাউনলোড করুন</span>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </>
                    )}
                  </button>
                  {pdfLoading && (
                    <div className="finder-analysis-overlay" aria-live="polite" aria-label={ANALYSIS_STEPS[analysisStep]}>
                      <div className="finder-analysis-overlay__track">
                        <div className="finder-analysis-overlay__fill" />
                      </div>
                    </div>
                  )}
                </div>

                {/* WA = SECONDARY — conversion after value is delivered */}
                <button
                  className={`finder-cta-primary finder-cta-primary--${result.pkg.variant}`}
                  onClick={handleCtaPrimary}
                >
                  {Icon.wa} WhatsApp-এ কথা বলুন
                </button>

                <button className="finder-cta-ghost" onClick={reset}>আবার চেকআপ করুন</button>
                <p className="finder-fine">পরামর্শ সম্পূর্ণ ফ্রি। কোনো বাধ্যবাধকতা নেই।</p>
              </div>

              {/* ══ BRANDED PDF TEMPLATE ══ */}
              <FinderPdfLayer
                id="finder-pdf-layer"
                result={result}
                leadName={leadName}
              />

            </div>
          )}
        </div>
      </div>
    </section>
  )
}
