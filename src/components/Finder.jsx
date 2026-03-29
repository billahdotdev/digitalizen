import { useState, useRef, useEffect, useCallback } from 'react'
import './Finder.css'
import { track, pushEngagement, WA_NUMBER } from '../lib/analytics.js'
import { generateBrandedPdf }               from '../lib/generatePdf.js'
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
   14-QUESTION AUDIT
   Each answer now carries:
     tags[]        — semantic labels for cross-matching
     rawScore      — raw linear score (kept for UI progress)
     flags{}       — diagnostic triggers
══════════════════════════════════════════════════ */
const questions = [
  { id: 1, q: 'আপনার বিজনেসের ধরন কি?', hint: '', opts: [
    { label: 'সার্ভিস/ সেবা (শিক্ষা, স্বাস্থ্য, কনসালটেন্সি ইত্যাদি)', tags: ['service'],       rawScore: 1 },
    { label: 'লোকাল সার্ভিস (জিম, রেস্টুরেন্ট, সেলুন ইত্যাদি)',        tags: ['local'],         rawScore: 2 },
    { label: 'ই-কমার্স (পাইকারি মার্কেট থেকে সংগ্রহ)',                  tags: ['ecommerce'],     rawScore: 3 },
    { label: 'নিজস্ব ম্যানুফ্যাকচারিং (ব্র্যান্ড)/ নিজস্ব ইমপোর্ট',   tags: ['manufacturer'],  rawScore: 4 },
  ] },
  { id: 2, q: 'আপনার ব্যবসার বর্তমান অবস্থা কী?', hint: '', opts: [
    { label: 'একদম নতুন শুরু করছি।',                                         tags: ['stage_early'],   rawScore: 1 },
    { label: 'সেল হচ্ছে, কিন্তু যেমনটা চাচ্ছি তেমন প্রফিট আসছে না।',      tags: ['stage_stuck'],   rawScore: 2 },
    { label: 'ব্যবসা বেশ ভালো, এখন মার্কেট ডমিনেট করতে চাই।',             tags: ['stage_scaling'], rawScore: 3 },
    { label: 'অলরেডি ব্র্যান্ড, এখন আরও প্রিমিয়াম ও ট্রাস্টেড হতে চাই।', tags: ['stage_premium'], rawScore: 4 },
  ] },
  { id: 3, q: 'মার্কেটিং কিভাবে পরিচালনা করেন?', hint: '', opts: [
    { label: 'প্রযোজ্য না/ মার্কেটিং করি না।',                tags: ['mkt_none'],        rawScore: 1, flags: { techGap: true } },
    { label: 'নিজেই বুষ্টিং করি।',                            tags: ['mkt_self'],        rawScore: 2, flags: { techGap: true } },
    { label: 'ফ্রিল্যান্সার দিয়ে বুষ্টিং/ ক্যাম্পেইন করি।', tags: ['mkt_freelancer'],  rawScore: 3 },
    { label: 'এজেন্সিকে দিয়ে প্রফেশনাল ক্যাম্পেইন করি।',    tags: ['mkt_agency'],      rawScore: 4 },
  ] },
  { id: 4, q: 'বর্তমানে আপনার প্রধান সেলস চ্যানেল কোনটি?', hint: '', opts: [
    { label: 'কোনো অ্যাড ছাড়াই অর্গানিক ভাবে/ অফ লাইন',          tags: ['channel_organic'],  rawScore: 1, flags: { landingPageWarning: 'none' } },
    { label: 'শুধু ফেসবুক পেইজে মেসেজ ক্যাম্পেইন/ বুস্টিং',       tags: ['channel_boost'],    rawScore: 2, flags: { landingPageWarning: 'none' } },
    { label: 'মেসেজ ক্যাম্পেইন এবং ল্যান্ডিং পেজ',                tags: ['channel_lp'],       rawScore: 3, flags: { landingPageWarning: 'weak' } },
    { label: 'সম্পূর্ণ ল্যান্ডিং পেইজ/ ওয়েবসাইট',                tags: ['channel_website'],  rawScore: 4 },
  ] },
  { id: 5, q: 'আপনার বর্তমান ল্যান্ডিং পেইজ বা ওয়েবসাইটের স্পিড কেমন?', hint: '', opts: [
    { label: 'ল্যান্ডিং পেইজ/ ওয়েব সাইট নাই।',                               tags: ['tech_none'],    rawScore: 1, flags: { landingPageWarning: 'none' } },
    { label: 'ল্যান্ডিং পেইজ/ ওয়েব সাইট আছে, কিন্তু জানি না।',              tags: ['tech_unknown'], rawScore: 2, flags: { landingPageWarning: 'weak' } },
    { label: 'সাধারণ ওয়ার্ডপ্রেস বা থিম দিয়ে বানানো (একটু স্লো)।',          tags: ['tech_legacy'],  rawScore: 3, flags: { landingPageWarning: 'weak', techGap: true } },
    { label: 'কাস্টম কোড করা সুপার-ফাস্ট (খুব দ্রুত লোড হয়)।',              tags: ['tech_fast'],    rawScore: 4 },
  ] },
  { id: 6, q: 'অফার বা উৎসবের সময় ল্যান্ডিং পেজ/ ওয়েব সাইট পেইজ আপডেট করা হয়?', hint: '', opts: [
    { label: 'প্রযোজ্য নয় (আমার কোনো ওয়েবসাইট নেই)।',                                  tags: ['update_na'],      rawScore: 1, flags: { landingPageWarning: 'none' } },
    { label: 'মার্কেটার ও ডেভেলপার আলাদা, তাই অনেক সময় ও ঝামেলা পোহাতে হয়।',           tags: ['update_slow'],    rawScore: 2, flags: { techGap: true } },
    { label: 'টেকনিক্যাল সাপোর্ট এবং বাজেটের অভাবে একই ডিজাইন মাসের পর মাস রেখে দিই।', tags: ['update_stale'],   rawScore: 3, flags: { techGap: true } },
    { label: 'যখন দরকার তখনই কাস্টমাইজ করে লাইভ করতে পারি।',                            tags: ['update_agile'],   rawScore: 4 },
  ] },
  { id: 7, q: 'পিক্সেল + সার্ভার সাইড API সেট আপ করা আছে?', hint: '', opts: [
    { label: 'ডাটা ট্র্যাকিং বা পিক্সেল সম্পর্কে ধারণা নেই।',     tags: ['pixel_none'],    rawScore: 1, flags: { trackingWarning: true } },
    { label: 'ট্র্যাকিং ছাড়াই বিজ্ঞাপন চলছে, ডাটা নিয়ে কাজ করি না।', tags: ['pixel_skip'],    rawScore: 2, flags: { trackingWarning: true } },
    { label: 'শুধু পিক্সেল আছে এবং সব ডেটা ট্র্যাক হয়।',         tags: ['pixel_basic'],   rawScore: 3, flags: { kpiWarning: true } },
    { label: 'হ্যাঁ, পিক্সেল এবং সার্ভার সাইড API দুটোই নিখুঁত।', tags: ['pixel_full'],    rawScore: 4 },
  ] },
  { id: 8, q: 'ROAS, ROI এর সঠিক হিসাব রাখেন?', hint: '', opts: [
    { label: 'এখনো ওভাবে নিখুঁত হিসাব রাখা শুরু করিনি।',                              tags: ['kpi_none'],    rawScore: 1, flags: { kpiWarning: true } },
    { label: 'লাইক, কমেন্ট আর মেসেজ সংখ্যা দেখে সাফল্যের ধারণা নিই।',               tags: ['kpi_vanity'],  rawScore: 2, flags: { kpiWarning: true } },
    { label: 'অ্যাড ম্যানেজারের রিপোর্ট দেখি, কিন্তু প্রকৃত লাভ/ লস অস্পষ্ট থাকে।', tags: ['kpi_partial'], rawScore: 3, flags: { kpiWarning: true } },
    { label: 'হ্যাঁ, অ্যাড কষ্ট, সেল এবং নিট প্রফিটের হিসাব রাখি।',                 tags: ['kpi_full'],    rawScore: 4 },
  ] },
  { id: 9, q: 'আপনার বিজনেসের নিজস্ব গল্প আছে? (কালার, ফন্ট, লোগো, স্লোগান)', hint: '', opts: [
    { label: 'ক্যানভা বা মোবাইল অ্যাপ দিয়ে নিজেই চালিয়ে নিচ্ছি।',        tags: ['brand_diy'],     rawScore: 1 },
    { label: 'ডিজাইন বা ব্র্যান্ডিং নিয়ে কখনো ওভাবে কাজ করা হয়নি।',     tags: ['brand_none'],    rawScore: 2 },
    { label: 'মোটামুটি ভালো, তবে আরও প্রফেশনাল ও ট্রাস্টেড লুক দরকার।', tags: ['brand_partial'], rawScore: 3 },
    { label: 'প্রিমিয়াম এবং সবাই আমাদের কপি করে।',                        tags: ['brand_strong'],  rawScore: 4 },
  ] },
  { id: 10, q: 'আপনার বিজ্ঞাপনের ক্রিয়েটিভ বা ভিডিও কন্টেন্ট কে তৈরি করে?', hint: '', opts: [
    { label: 'নিজেই মোবাইল দিয়ে ভিডিও বা ছবি তৈরি করি।',          tags: ['creative_diy'],     rawScore: 1 },
    { label: 'ভালো কন্টেন্ট তৈরির জন্য প্রফেশনাল সাপোর্ট প্রয়োজন।', tags: ['creative_need'],    rawScore: 2 },
    { label: 'ফ্রিল্যান্সার বা এজেন্সি দিয়ে করাই।',               tags: ['creative_agency'],  rawScore: 3 },
    { label: 'নিজস্ব প্রফেশনাল ইন-হাউস টিম আছে।',                 tags: ['creative_inhouse'], rawScore: 4 },
  ] },
  { id: 11, q: 'বিজ্ঞাপনের কন্টেন্ট/ ক্রিয়েটিভ কি নিয়মিত টেষ্ট এবং চেন্জ করেন?', hint: '', opts: [
    { label: 'দরকার নাই/ প্রযোজ্য না।', tags: ['test_na'],      rawScore: 1 },
    { label: 'কখনোই না।',               tags: ['test_never'],   rawScore: 2 },
    { label: 'অনিয়মিত।',               tags: ['test_rarely'],  rawScore: 3 },
    { label: 'নিয়মিত।',                tags: ['test_regular'], rawScore: 4 },
  ] },
  { id: 12, q: 'ব্যবসার কোন দিকটি আপনাকে এই মুহূর্তে সবচেয়ে বেশি ভাবিয়ে তোলে?', hint: '', opts: [
    { label: 'প্রোডাক্ট সোর্সিং/ প্রোডাক্ট কোয়ালিটি',                                  tags: ['pain_product'],  rawScore: 1 },
    { label: 'বাজারে ব্র্যান্ড হিসেবে এখনো ট্রাস্ট তৈরি করতে পারিনি।',                  tags: ['pain_trust'],    rawScore: 2 },
    { label: 'স্লো ওয়েবসাইট বা টেকনিক্যাল সমস্যার কারণে কাস্টমার হারিয়ে যাচ্ছে।',    tags: ['pain_tech'],     rawScore: 3, flags: { techGap: true, landingPageWarning: 'weak' } },
    { label: 'অ্যাড খরচ হচ্ছে কিন্তু সেই তুলনায় সেল নেই',                               tags: ['pain_roas'],     rawScore: 4, flags: { kpiWarning: true } },
  ] },
  { id: 13, q: 'আগামী ৬ মাসের জন্য আপনার প্রধান লক্ষ্য কোনটি?', hint: '', opts: [
    { label: 'ঠিক করতে পারিনি/ বুজতে পারছি না।',                                tags: ['goal_unclear'],    rawScore: 1 },
    { label: 'কোনোমতে বর্তমান অবস্থা বজায় রেখে টিকে থাকা।',                    tags: ['goal_survive'],    rawScore: 2 },
    { label: 'একটি প্রভাবশালী ব্র্যান্ড হিসেবে নিজেকে প্রতিষ্ঠিত করা।',        tags: ['goal_brand'],      rawScore: 3 },
    { label: 'সেলস বৃদ্ধির একটি স্থায়ী ও অটোমেটেড সিস্টেম তৈরি করা।',        tags: ['goal_system'],     rawScore: 4 },
  ] },
  { id: 14, q: 'কোন ধরণের সহযোগিতা আপনার সবচেয়ে বেশি প্রয়োজন?', hint: '', opts: [
    { label: 'বাজেটের ওপর নির্ভর করে সিদ্ধান্ত নেব।',                                    tags: ['need_budget'],    rawScore: 1 },
    { label: 'অ্যাড ম্যানেজমেন্ট এবং টেকনিক্যাল সমস্যার সাময়িক সমাধান।',              tags: ['need_adtech'],    rawScore: 2 },
    { label: 'হাই-স্পিড কাস্টম ল্যান্ডিং পেইজ এবং সেলস ফানেল তৈরি।',                  tags: ['need_funnel'],    rawScore: 3 },
    { label: 'জিরো থেকে ব্র্যান্ড ডিজাইন এবং ফুল-স্ট্যাক মার্কেটিং পার্টনার।',       tags: ['need_fullstack'], rawScore: 4 },
  ] },
]

const TOTAL = questions.length

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
      'ফ্রি বিজনেস অডিট',
      'গ্রোথ স্ট্র্যাটেজি ২০২৬',
      'হাই-কনভার্টিং অ্যাড সেটআপ',
      'ইউনিক কনটেন্ট আইডিয়া',
    ],
    sprint30: [
      'দিন ১–৭: বিজনেস অডিট ও ডিজিটাল প্রেজেন্স রিভিউ',
      'দিন ৮–১৪: অ্যাড অ্যাকাউন্ট ও Pixel সেটআপ',
      'দিন ১৫–২১: প্রথম টেস্ট ক্যাম্পেইন লঞ্চ',
      'দিন ২২–৩০: ডেটা রিভিউ ও পরবর্তী ধাপ পরিকল্পনা',
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
      'AI সেলস ফানেল অটোমেশন',
      'ফ্রি আল্ট্রা-ফাস্ট ল্যান্ডিং পেজ (Vite + React)',
      'ফ্রি Pixel ও Conversion API সেটআপ',
      'আনলিমিটেড অ্যাড ম্যানেজমেন্ট',
      'এক্সক্লুসিভ অ্যাড কনটেন্ট আইডিয়া',
    ],
    sprint30: [
      'দিন ১–৫: ডিজিটাল ইনফ্রাস্ট্রাকচার অডিট (Pixel, CAPI, Analytics)',
      'দিন ৬–১২: কাস্টম Vite+React ল্যান্ডিং পেজ বিল্ড ও লাইভ',
      'দিন ১৩–২০: প্রথম হাই-কনভার্টিং ক্যাম্পেইন সেটআপ ও লঞ্চ',
      'দিন ২১–৩০: A/B টেস্ট, ROAS রিপোর্ট ও মাস ২ প্ল্যানিং',
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
      'অ্যাডভান্সড সেলস ফানেল অটোমেশন',
      'আনলিমিটেড ল্যান্ডিং পেজ সাপোর্ট (Vite + React)',
      'AI ডমিন্যান্স ও অথরিটি বিল্ডিং (AEO, GEO)',
      'কাস্টমার সেন্টিমেন্ট অ্যানালাইসিস',
      'মডার্ন ট্র্যাকিং (CAPI, GA4, TTK Pixel)',
      'উইনিং অ্যাড কনটেন্ট আইডিয়া',
      'প্রিমিয়াম ব্র্যান্ড আইডেন্টিটি ডিজাইন',
    ],
    sprint30: [
      'দিন ১–৫: ফুল ব্র্যান্ড অডিট ও কম্পিটিটর রিসার্চ',
      'দিন ৬–১০: ব্র্যান্ড আইডেন্টিটি (লোগো, কালার, টাইপোগ্রাফি)',
      'দিন ১১–১৮: মাল্টি-পেজ Vite+React ওয়েবসাইট বিল্ড ও লাইভ',
      'দিন ১৯–২৫: CAPI + GA4 + TTK সম্পূর্ণ ট্র্যাকিং সেটআপ',
      'দিন ২৬–৩০: ফার্স্ট অথরিটি ক্যাম্পেইন লঞ্চ ও KPI বেসলাইন',
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
}

/**
 * Cross-Rules: applied AFTER tag scoring.
 * If condition matches → force or cap a package.
 * Rules are evaluated in order; first match wins.
 */
const CROSS_RULES = [
  // "Eager but unprepared": wants brand_care but has no pixel & no KPI tracking
  // → cap at monthly_care (needs foundation first)
  {
    name: 'eager_no_foundation',
    condition: (tags, flags) =>
      (tags.includes('need_fullstack') || tags.includes('goal_brand') || tags.includes('stage_premium')) &&
      flags.trackingWarning && flags.kpiWarning,
    result: 'monthly_care',
    reason: 'ব্র্যান্ড কেয়ার শুরু করতে ট্র্যাকিং ফাউন্ডেশন আগে দরকার।',
  },
  // "High-agency user, but budget-first mindset" → monthly_care
  {
    name: 'agency_budget_conscious',
    condition: (tags) =>
      tags.includes('mkt_agency') && tags.includes('need_budget'),
    result: 'monthly_care',
    reason: 'এজেন্সি ব্যাকগ্রাউন্ড আছে, কিন্তু বাজেট নিয়ন্ত্রণই এখন মূল প্রায়োরিটি।',
  },
  // "Absolute beginner": early stage + no marketing + no pixel + no KPI
  {
    name: 'absolute_beginner',
    condition: (tags, flags) =>
      (tags.includes('stage_early') || tags.includes('mkt_none')) &&
      flags.trackingWarning && tags.includes('channel_organic'),
    result: 'micro_test',
    reason: 'শুরু থেকে সঠিকভাবে সেটআপ করাটাই সবচেয়ে স্মার্ট পদক্ষেপ।',
  },
  // "Scaling brand with strong infra" → brand_care
  {
    name: 'scaling_strong_infra',
    condition: (tags) =>
      tags.includes('stage_scaling') &&
      tags.includes('pixel_full') &&
      tags.includes('tech_fast'),
    result: 'brand_care',
    reason: 'টেকনিক্যাল ফাউন্ডেশন শক্ত। এখন ব্র্যান্ড অথরিটি বিল্ডিং-ই পরের বড় জাম্প।',
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
  const score = Math.min(100, Math.round(((rawTotal - 14) / (56 - 14)) * 100))

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

  // Build dynamic problem string
  const problems = []
  if (hasTrackingProblem) problems.push('ট্র্যাকিং সেটআপ নেই বলে অ্যাড বাজেট অনুমানের উপর চলছে')
  if (hasRoasProblem)     problems.push('ROAS/ROI ট্র্যাক না হওয়ায় কোন ক্যাম্পেইন লাভজনক তা স্পষ্ট না')
  if (hasTechGap)         problems.push('লিগ্যাসি টেক দিয়ে সিজনাল ক্যাম্পেইন আপডেট করা কঠিন হচ্ছে')
  if (hasNoLp)            problems.push('ডেডিকেটেড ল্যান্ডিং পেজ না থাকায় ক্লিক কনভার্শন হচ্ছে না')
  if (hasWeakLp)          problems.push('ধীর পেজ লোড স্পিড ভিজিটরদের ধরে রাখতে পারছে না')

  const problemText = problems.length > 0
    ? problems.join('। ') + '।'
    : 'আপনার ডিজিটাল উপস্থিতিতে কিছু সুনির্দিষ্ট গ্যাপ চিহ্নিত হয়েছে।'

  /* ── MICRO TEST DIAGNOSIS ────────────────────── */
  if (pkgKey === 'micro_test') {
    // Hyper-contextual bridging: If they WANTED fullstack/brand but got capped to micro_test
    const wasCappped = crossRule && (crossRule.name === 'eager_no_foundation' || crossRule.name === 'absolute_beginner')
    
    if (wasCappped && wantsBrand && (hasTrackingProblem || hasRoasProblem)) {
      return {
        problem: problemText,
        stage: 'আপনার উচ্চাভিলাষ ভালো — ব্র্যান্ড বিল্ডিং একটা শক্তিশালী লক্ষ্য। কিন্তু এই মুহূর্তে ফাউন্ডেশন ঠিক না থাকায় সেখানে পৌঁছানো কঠিন।',
        insight: `${hasTrackingProblem ? 'Pixel ও CAPI ছাড়া' : ''} ${hasRoasProblem ? 'ROAS/ROI ট্র্যাকিং ছাড়া' : ''} ব্র্যান্ড কেয়ার শুরু করলে অ্যাড বাজেট অনুমানে চলবে এবং কোন ক্যাম্পেইন কাজ করছে সেটা জানার উপায় থাকবে না। মাইক্রো টেস্ট দিয়ে শুরু করুন — ডিজিটাল ফাউন্ডেশন ঠিক করুন, তারপর ব্র্যান্ড বিল্ডিং করা অনেক সহজ হবে।`,
        advice: 'মাইক্রো টেস্ট সম্পূর্ণ ফ্রি। আমরা আপনার পুরো সেটআপ দেখব, কোথায় কী ঠিক করলে সবচেয়ে বেশি কাজ হবে সেটা পরিষ্কার করে বলব। ফাউন্ডেশন ঠিক হলে পরে ব্র্যান্ড কেয়ারে আপগ্রেড করতে পারবেন।',
      }
    }

    return {
      problem: problemText || 'সঠিক ফাউন্ডেশন ছাড়া পরে বিজ্ঞাপনে টাকা ঢালা মানে বালুতে বাড়ি বানানো।',
      stage: isEarly 
        ? 'আপনার বিজনেস এখন শুরুর পর্যায়ে। এই সময়টা সবচেয়ে গুরুত্বপূর্ণ — এখনকার সিদ্ধান্তই পরের গ্রোথ নির্ধারণ করে।'
        : 'আপনার বিজনেসে এখন সঠিক ডিজিটাল ভিত্তি তৈরির সময়।',
      insight: 'অ্যাড অ্যাকাউন্ট ও বিজনেস পেজ ঠিকমতো সেটআপ না হলে পরে টাকা খরচ করেও ফলাফল আসবে না। মাইক্রো টেস্ট-এ আমরা আপনার পুরো ডিজিটাল সেটআপ একবার দেখব এবং কোথায় কী ঠিক করলে সবচেয়ে বেশি কাজ হবে সেটা পরিষ্কার করে বলব।',
      advice: 'মাইক্রো টেস্ট সম্পূর্ণ ফ্রি। কোনো চুক্তি নেই। শুরু করুন, আমাদের সাথে কথা বলুন, নিজেই বুঝুন পরের ধাপটা কী।',
    }
  }

  /* ── MONTHLY CARE DIAGNOSIS ──────────────────── */
  if (pkgKey === 'monthly_care') {
    // Hyper-contextual: If they have tech gaps AND budget for custom funnel
    const needsFunnelBadly = hasHighBudget && (hasTechGap || painIsTech)
    const agencyDowngraded = crossRule && crossRule.name === 'agency_budget_conscious'
    
    if (needsFunnelBadly) {
      return {
        problem: problemText,
        stage: 'আপনার বিজনেস এখন বাড়ার পর্যায়ে। টেকনিক্যাল সাপোর্ট ঠিক থাকলে সেল দ্রুত বাড়বে।',
        insight: `${painIsTech ? 'আপনার সবচেয়ে বড় সমস্যা টেকনিক্যাল গ্যাপ।' : 'Legacy Tech দিয়ে সিজনাল ক্যাম্পেইন আপডেট করা কঠিন হচ্ছে।'} মান্থলি কেয়ারে একই টিম মার্কেটিং + ডেভেলপমেন্ট দেখে — ঈদ/পূজার অফার মিনিটে লাইভ করা যায়, ট্র্যাকিং সবসময় ঠিক থাকে। আলাদা মার্কেটার আর আলাদা ডেভেলপার রাখলে এই সমন্বয় কখনো ঠিকমতো হয় না।`,
        advice: 'মান্থলি কেয়ারে ৩০ দিনের স্প্রিন্টে পুরো ডিজিটাল ইনফ্রাস্ট্রাকচার রেডি করে ফার্স্ট ক্যাম্পেইন লাইভ করা হবে। একটাই টিম — ক্যাম্পেইন থেকে কোড পর্যন্ত।',
      }
    }

    if (agencyDowngraded) {
      return {
        problem: problemText,
        stage: 'আপনার এজেন্সি ব্যাকগ্রাউন্ড আছে, যার মানে আপনি জানেন ভালো মার্কেটিং কেমন হয়। কিন্তু এই মুহূর্তে বাজেট নিয়ন্ত্রণই মূল প্রায়োরিটি।',
        insight: 'মান্থলি কেয়ার দিয়ে শুরু করলে ফ্রি ল্যান্ডিং পেজ, ফ্রি Pixel+CAPI সেটআপ পাবেন — কোনো আপফ্রন্ট খরচ ছাড়াই। এজেন্সি-কোয়ালিটি কাজ, কিন্তু ছোট বিজনেসের বাজেটে।',
        advice: 'মান্থলি কেয়ার মানে — প্রফেশনাল মার্কেটিং যা আপনার বাজেটের মধ্যে থেকেই স্কেল করে। পরে যখন বিজনেস আরো বাড়বে তখন ব্র্যান্ড কেয়ারে আপগ্রেড করতে পারবেন।',
      }
    }

    return {
      problem: problemText || 'অ্যাড খরচ হচ্ছে কিন্তু ট্র্যাকিং ও ফানেল না থাকায় কনভার্শন রেট কম।',
      stage: 'আপনার বিজনেস এখন বাড়ার পর্যায়ে। সঠিক সাপোর্ট পেলে সেল আরো দ্রুত বাড়বে।',
      insight: 'অ্যাড ম্যানেজমেন্ট আর ল্যান্ডিং পেজ যখন এক টিম দেখে, ফলাফল অনেক বেশি হয়। ঈদ বা পূজার অফার তাৎক্ষণিক লাইভ করা যায়, ট্র্যাকিং সবসময় ঠিক থাকে। আলাদা মার্কেটার আর আলাদা ডেভেলপার রাখলে এই সমন্বয় কখনো ঠিকমতো হয় না।',
      advice: 'মান্থলি কেয়ারে একটাই টিম — ক্যাম্পেইন থেকে কোড পর্যন্ত। ৩০ দিনের স্প্রিন্টে পুরো ডিজিটাল ইনফ্রাস্ট্রাকচার রেডি করে ফার্স্ট ক্যাম্পেইন লাইভ করা হবে।',
    }
  }

  /* ── BRAND CARE DIAGNOSIS ────────────────────── */
  // Hyper-contextual: Manufacturer needs brand authority, trust-building needs brand identity
  const manufacturerNeedsBrand = isManufacturer && (painIsTrust || wantsBrand)
  const trustIssuePrimary      = painIsTrust && wantsFullstack

  if (manufacturerNeedsBrand) {
    return {
      problem: problemText || 'নিজস্ব ম্যানুফ্যাকচারিং থাকলেও ব্র্যান্ড আইডেন্টিটি ছাড়া প্রিমিয়াম দাম পাওয়া কঠিন।',
      stage: 'আপনি নিজে প্রোডাক্ট বানান — এটা বিশাল সুবিধা। কিন্তু মার্কেটে ব্র্যান্ড আইডেন্টিটি ছাড়া আপনাকে আর দশজনের মতোই দেখায়।',
      insight: 'ম্যানুফ্যাকচারার হলে প্রিমিয়াম মার্কেটে আপনার জায়গা হওয়া উচিত। কিন্তু সেটা করতে দরকার শক্তিশালী ব্র্যান্ড আইডেন্টিটি, কাস্টম ডিজাইন, সুনির্দিষ্ট সেলস ফানেল এবং ডেটা-চালিত মার্কেটিং। Legacy Tech (WP/Themes) দিয়ে ২০২৬-এ প্রিমিয়াম ব্র্যান্ড বানানো অসম্ভব।',
      advice: 'ব্র্যান্ড কেয়ারে আমরা পুরো ব্র্যান্ড গড়ার কাজ করব — লোগো থেকে কাস্টম ল্যান্ডিং পেজ, অ্যাডভান্সড ট্র্যাকিং থেকে ফুল-স্ট্যাক মার্কেটিং। একটাই টিম যারা আপনার বিজনেস ভেতর থেকে চেনে।',
    }
  }

  if (trustIssuePrimary) {
    return {
      problem: problemText || 'বাজারে ট্রাস্ট তৈরি না হলে প্রতিযোগিতায় টিকে থাকা কঠিন।',
      stage: 'আপনার সবচেয়ে বড় চ্যালেঞ্জ ট্রাস্ট বিল্ডিং। মানুষ এখনো আপনাকে একটা প্রতিষ্ঠিত ব্র্যান্ড হিসেবে দেখছে না।',
      insight: 'ট্রাস্ট শুধু ভালো প্রোডাক্ট দিয়ে আসে না — আসে ব্র্যান্ড আইডেন্টিটি, প্রফেশনাল ওয়েবসাইট, কনসিস্টেন্ট কমিউনিকেশন এবং কাস্টমার এক্সপেরিয়েন্স থেকে। ব্র্যান্ড কেয়ারে আমরা এই পুরো ইকোসিস্টেম তৈরি করি — মানুষ যখন আপনার নাম দেখবে, তখন "এদের বিশ্বাস করা যায়" এই অনুভূতি আসবে।',
      advice: 'ব্র্যান্ড কেয়ারে পাবেন পূর্ণ ব্র্যান্ড আইডেন্টিটি, প্রিমিয়াম ডিজাইন, অ্যাডভান্সড ট্র্যাকিং এবং ডেডিকেটেড টিম যারা শুধু আপনার ব্যবসার জন্যই কাজ করে।',
    }
  }

  return {
    problem: problemText || 'ব্র্যান্ড আইডেন্টিটি ও অথরিটি ছাড়া প্রিমিয়াম মার্কেটে টিকে থাকা কঠিন।',
    stage: isScaling 
      ? 'আপনার বিজনেস এখন শক্তিশালী ব্র্যান্ড হওয়ার জায়গায়। এটা অনেক বড় অর্জন।'
      : 'আপনার বিজনেস এখন মার্কেট লিডার হওয়ার পর্যায়ে।',
    insight: 'এই পর্যায়ে শুধু সেল না — দরকার একটা ব্র্যান্ড আইডেন্টিটি যা মানুষ চেনে এবং বিশ্বাস করে। Legacy Tech (WP/Themes) দিয়ে ২০২৬-এ মার্কেট ডমিনেট করা অসম্ভব। কাস্টম ডিজাইন, সুনির্দিষ্ট সেলস ফানেল এবং ডেটা-চালিত মার্কেটিং একসাথে থাকলে ব্র্যান্ড দ্রুত বড় হয়।',
    advice: 'ব্র্যান্ড কেয়ারে আমরা পুরো ব্র্যান্ড গড়ার কাজ করব। লোগো থেকে কাস্টম ল্যান্ডিং পেজ, অ্যাডভান্সড ট্র্যাকিং থেকে ফুল-স্ট্যাক মার্কেটিং — একটাই টিম যারা আপনার বিজনেস ভেতর থেকে চেনে।',
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
  if (!/[a-zA-Z\u09BE-\u09EF]/.test(trimmed)) return 'বিজনেসের নামে অক্ষর থাকতে হবে।'
  
  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) return 'বিজনেসের সঠিক নাম দিন।'
  }
  
  return null // Valid
}

const validateBdPhone = (phone) => {
  const trimmed = phone.trim()
  
  // BD numbers: 10 digits (without country code) or 11 digits (with leading 0)
  // Valid formats: 1XXXXXXXXX (10 digits) or 01XXXXXXXXX (11 digits starting with 0)
  const validPattern = /^(0?1[3-9]\d{8})$/
  
  if (!validPattern.test(trimmed)) {
    return 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন।'
  }
  
  return null // Valid
}

const scoreLabel = (pkgKey) =>
  pkgKey === 'micro_test' ? 'শুরুর পর্যায়' : pkgKey === 'monthly_care' ? 'গ্রোথ রেডি' : 'স্কেল রেডি'

const bn = (n) => String(n).split('').map(d => '০১২৩৪৫৬৭৮৯'[+d] ?? d).join('')

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Finder() {
  const [currentQ,  setCurrentQ]  = useState(0)
  const [answers,   setAnswers]   = useState([])
  const [selIdx,    setSelIdx]    = useState(null)
  const [locked,    setLocked]    = useState(false)
  const [phase,     setPhase]     = useState('quiz')
  const [visible,   setVisible]   = useState(true)
  const [result,    setResult]    = useState(null)

  const [leadName,       setLeadName]       = useState('')
  const [leadPhone,      setLeadPhone]      = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadError,      setLeadError]      = useState('')

  const [pdfLoading, setPdfLoading] = useState(false)

  const resultRef       = useRef(null)
  const sectionRef      = useRef(null)
  const enterTimeRef    = useRef(null)
  const sectionFiredRef = useRef(false)
  const quizStartTime   = useRef(null)
  const dropOffQRef     = useRef(null)
  const pendingAnswers  = useRef(null)
  const nameRef         = useRef(null)

  const q = questions[currentQ]

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
    if (phase === 'lead') setTimeout(() => nameRef.current?.focus(), 300)
  }, [phase])

  const reset = useCallback(() => {
    setCurrentQ(0); setAnswers([]); setSelIdx(null); setLocked(false)
    setPhase('quiz'); setVisible(true); setResult(null)
    setLeadName(''); setLeadPhone(''); setLeadError('')
    pendingAnswers.current = null; quizStartTime.current = null; dropOffQRef.current = null
    track('ViewContent', { content_name: 'Finder Quiz Restart', content_category: 'Quiz' })
  }, [])

  const pick = useCallback((optIdx) => {
    if (locked) return
    setLocked(true); setSelIdx(optIdx)
    const opt = q.opts[optIdx]
    const newAnswers = [...answers, opt]
    dropOffQRef.current = currentQ + 1

    if (currentQ === 0 && !quizStartTime.current) {
      quizStartTime.current = Date.now()
      track('InitiateCheckout', { content_name: 'Finder Quiz Start', content_category: 'Quiz', currency: 'BDT', value: 0 })
    }

    track('ViewContent', {
      content_name: `Finder Q${q.id}: ${opt.label}`,
      content_category: 'Quiz Answer',
      content_ids: [`finder_q${q.id}`],
      quiz_question: q.id,
      quiz_answer_index: optIdx + 1,
      quiz_progress_pct: Math.round(((currentQ + 1) / TOTAL) * 100),
    })

    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        if (currentQ < TOTAL - 1) {
          setAnswers(newAnswers); setCurrentQ(currentQ + 1); setSelIdx(null)
          setTimeout(() => { setVisible(true); setLocked(false) }, 60)
        } else {
          pendingAnswers.current = newAnswers
          setAnswers(newAnswers); setPhase('lead'); setVisible(true); setLocked(false)
        }
      }, 170)
    }, 120)
  }, [locked, currentQ, answers, q])

  const goBack = useCallback(() => {
    if (currentQ === 0) return
    setVisible(false)
    setTimeout(() => {
      const prevQ = questions[currentQ - 1]
      const prevAnswer = answers[currentQ - 1]
      const prevIdx = prevAnswer ? prevQ.opts.findIndex(o => o.label === prevAnswer.label) : null
      setAnswers(answers.slice(0, -1))
      setCurrentQ(currentQ - 1)
      setSelIdx(prevIdx >= 0 ? prevIdx : null)
      setLocked(false); setVisible(true)
    }, 170)
  }, [currentQ, answers])

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
        setResult(res)
        setPhase('result')
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
      await generateBrandedPdf('finder-pdf-layer', `Digitalizen-Roadmap-${result.pkg.waLabel}-${Date.now()}.pdf`)
    } catch (err) {
      console.error('[Finder PDF]', err)
    } finally {
      setPdfLoading(false)
    }
  }, [result])

  /* ── Warnings ── */
  const warnings = result ? [
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
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০৪</span>
          <span className="section-title-right">{'// বিজনেস অডিট'}</span>
        </div>

        <div className="ct-tag">{"// বিজনেস ও টেক অডিট"}</div>
        <h2 className="finder-heading">
          আপনার ব্যবসার<br />
          <span className="text-glow">স্বাস্থ্য পরীক্ষা!</span>
        </h2>
        <p className="finder-sub">
          ১৪টি ছোট প্রশ্ন = ১টি বড় সমাধান। আপনার ব্যবসার টেকনিক্যাল গ্যাপগুলো জানুন।
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
                {questions.map((_, i) => (
                  <div key={i} className={`finder-pip${i < currentQ ? ' finder-pip--done' : i === currentQ ? ' finder-pip--current' : ''}`} />
                ))}
              </div>
              <div className="finder-step-meta">
                <span className="finder-step-label">বিজনেস ও টেক অডিট</span>
                <span className="finder-step-counter">প্রশ্ন {bn(currentQ + 1)} / {bn(TOTAL)}</span>
              </div>
              <p className="finder-q">{q.q}</p>
              {q.hint && <p className="finder-hint">{q.hint}</p>}
              <div className="finder-opts">
                {q.opts.map((o, i) => (
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
              {currentQ > 0 && (
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
                    placeholder="যেমন: Rahman Traders"
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
                  <p className="finder-loading__sub">১৪টি উত্তর থেকে সেরা সমাধান খুঁজছি</p>
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
                  <span className="finder-score__num">{result.rawTotal}<span style={{ fontSize: '0.55em', opacity: 0.6 }}>/৫৬</span></span>
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

              {/* ── ACTION: CTAs ── */}
              <div className="finder-pdf-gate">
                <span className="finder-pdf-gate__seal" aria-hidden="true">✓</span>
                আপনার কাস্টম রোডম্যাপ রেডি · ৩০-দিনের স্প্রিন্ট সহ
              </div>
              <div className="finder-ctas">

                {/* PDF = PRIMARY hero CTA — value delivery before the ask */}
                <button
                  className={`finder-cta-pdf${pdfLoading ? ' finder-cta-pdf--busy' : ''}`}
                  onClick={triggerPdfDownload}
                  disabled={pdfLoading}
                  aria-label="রোডম্যাপ PDF হিসেবে ডাউনলোড করুন"
                >
                  {pdfLoading ? (
                    <>
                      <span className="finder-pdf-spinner" aria-hidden="true" />
                      <span>রিপোর্ট তৈরি হচ্ছে…</span>
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
