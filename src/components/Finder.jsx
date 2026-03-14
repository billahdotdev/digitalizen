import { useState, useRef, useEffect, useCallback } from 'react'
import './Finder.css'
import { track, pushEngagement, WA_NUMBER } from '../analytics.js'


/* ══════════════════════════════════════════════════
   TRACKING
   ① Meta Pixel — browser-side (client event)
   ② dataLayer  — GTM → GA4 + server-side CAPI tag
      event_id shared between fbq() & dataLayer for
      CAPI deduplication on your GTM server container.
══════════════════════════════════════════════════ */

/* ── SVG Icons ──────────────────────────────────── */
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
}

/* ══════════════════════════════════════════════════
   14-QUESTION BUSINESS AUDIT — A=1pt, D=4pt scoring
   <20 = Care+  |  20-34 = Monthly Care  |  35+ = Brand Care
══════════════════════════════════════════════════ */
const questions = [
  /* Q1 — বিজনেসের ধরন */
  { id: 1, q: 'আপনার বিজনেসের ধরন কি?', hint: '', opts: [
    { label: 'সার্ভিস/ সেবা (শিক্ষা, স্বাস্থ্য, কনসালটেন্সি ইত্যাদি)', scores: { foundation: 1 }, rawScore: 1 },
    { label: 'লোকাল সার্ভিস (জিম, রেস্টুরেন্ট, সেলুন ইত্যাদি)',        scores: { foundation: 1 }, rawScore: 2 },
    { label: 'ই-কমার্স (পাইকারি মার্কেট থেকে সংগ্রহ)',                  scores: { growth: 2 },     rawScore: 3 },
    { label: 'নিজস্ব ম্যানুফ্যাকচারিং (ব্র্যান্ড)/ নিজস্ব ইমপোর্ট',   scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q2 — ব্যবসার বর্তমান অবস্থা */
  { id: 2, q: 'আপনার ব্যবসার বর্তমান অবস্থা কী?', hint: '', opts: [
    { label: 'একদম নতুন শুরু করছি।',                                       scores: { foundation: 3 }, rawScore: 1 },
    { label: 'সেল হচ্ছে, কিন্তু যেমনটা চাচ্ছি তেমন প্রফিট আসছে না।',    scores: { foundation: 2 }, rawScore: 2 },
    { label: 'ব্যবসা বেশ ভালো, এখন মার্কেট ডমিনেট করতে চাই।',           scores: { growth: 2 },     rawScore: 3 },
    { label: 'অলরেডি ব্র্যান্ড, এখন আরও প্রিমিয়াম ও ট্রাস্টেড হতে চাই।', scores: { authority: 2 }, rawScore: 4 },
  ] },
  /* Q3 — মার্কেটিং পরিচালনা */
  { id: 3, q: 'মার্কেটিং কিভাবে পরিচালনা করেন?', hint: '', opts: [
    { label: 'প্রযোজ্য না/ মার্কেটিং করি না।',                scores: { foundation: 1 }, rawScore: 1, techGap: true },
    { label: 'নিজেই বুষ্টিং করি।',                            scores: { foundation: 1 }, rawScore: 2, techGap: true },
    { label: 'ফ্রিল্যান্সার দিয়ে বুষ্টিং/ ক্যাম্পেইন করি।', scores: { growth: 1 },     rawScore: 3 },
    { label: 'এজেন্সিকে দিয়ে প্রফেশনাল ক্যাম্পেইন করি।',    scores: { growth: 2 },     rawScore: 4 },
  ] },
  /* Q4 — প্রধান সেলস চ্যানেল */
  { id: 4, q: 'বর্তমানে আপনার প্রধান সেলস চ্যানেল কোনটি?', hint: '', opts: [
    { label: 'কোনো অ্যাড ছাড়াই অর্গানিক ভাবে/ অফ লাইন',          scores: { foundation: 1 }, rawScore: 1, landingPageWarning: 'none' },
    { label: 'শুধু ফেসবুক পেইজে মেসেজ ক্যাম্পেইন/ বুস্টিং',       scores: { foundation: 1 }, rawScore: 2, landingPageWarning: 'none' },
    { label: 'মেসেজ ক্যাম্পেইন এবং ল্যান্ডিং পেজ',                scores: { growth: 1 },     rawScore: 3, landingPageWarning: 'weak' },
    { label: 'সম্পূর্ণ ল্যান্ডিং পেইজ/ ওয়েবসাইট',                scores: { growth: 2 },     rawScore: 4 },
  ] },
  /* Q5 — ল্যান্ডিং পেজ স্পিড */
  { id: 5, q: 'আপনার বর্তমান ল্যান্ডিং পেইজ বা ওয়েবসাইটের স্পিড কেমন?', hint: '', opts: [
    { label: 'ল্যান্ডিং পেইজ/ ওয়েব সাইট নাই।',                               scores: { foundation: 1 }, rawScore: 1, landingPageWarning: 'none' },
    { label: 'ল্যান্ডিং পেইজ/ ওয়েব সাইট আছে, কিন্তু জানি না।',              scores: { foundation: 1 }, rawScore: 2, landingPageWarning: 'weak' },
    { label: 'সাধারণ ওয়ার্ডপ্রেস বা থিম দিয়ে বানানো (একটু স্লো)।',          scores: { growth: 1 },     rawScore: 3, landingPageWarning: 'weak' },
    { label: 'কাস্টম কোড করা সুপার-ফাস্ট (খুব দ্রুত লোড হয়)।',              scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q6 — অফার/ উৎসবে পেজ আপডেট */
  { id: 6, q: 'অফার বা উৎসবের সময় ল্যান্ডিং পেজ/ ওয়েব সাইট পেইজ আপডেট করা হয়?', hint: '', opts: [
    { label: 'প্রযোজ্য নয় (আমার কোনো ওয়েবসাইট নেই)।',                                  scores: { foundation: 1 }, rawScore: 1, landingPageWarning: 'none' },
    { label: 'মার্কেটার ও ডেভেলপার আলাদা, তাই অনেক সময় ও ঝামেলা পোহাতে হয়।',           scores: { growth: 1 },     rawScore: 2, techGap: true },
    { label: 'টেকনিক্যাল সাপোর্ট এবং বাজেটের অভাবে একই ডিজাইন মাসের পর মাস রেখে দিই।', scores: { growth: 1 },     rawScore: 3, techGap: true },
    { label: 'যখন দরকার তখনই কাস্টমাইজ করে লাইভ করতে পারি।',                            scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q7 — Pixel + Server API */
  { id: 7, q: 'পিক্সেল + সার্ভার সাইড API সেট আপ করা আছে?', hint: '', opts: [
    { label: 'ডাটা ট্র্যাকিং বা পিক্সেল সম্পর্কে ধারণা নেই।',     scores: { foundation: 1 }, rawScore: 1, trackingWarning: true },
    { label: 'ট্র্যাকিং ছাড়াই বিজ্ঞাপন চলছে, ডাটা নিয়ে কাজ করি না।', scores: { foundation: 1 }, rawScore: 2, trackingWarning: true },
    { label: 'শুধু পিক্সেল আছে এবং সব ডেটা ট্র্যাক হয়।',         scores: { growth: 1 },     rawScore: 3, kpiWarning: true },
    { label: 'হ্যাঁ, পিক্সেল এবং সার্ভার সাইড API দুটোই নিখুঁত।', scores: { authority: 2 },  rawScore: 4, trackingOk: true },
  ] },
  /* Q8 — ROAS / ROI */
  { id: 8, q: 'ROAS, ROI এর সঠিক হিসাব রাখেন?', hint: '', opts: [
    { label: 'এখনো ওভাবে নিখুঁত হিসাব রাখা শুরু করিনি।',                              scores: { foundation: 1 }, rawScore: 1, kpiWarning: true },
    { label: 'লাইক, কমেন্ট আর মেসেজ সংখ্যা দেখে সাফল্যের ধারণা নিই।',               scores: { foundation: 1 }, rawScore: 2, kpiWarning: true },
    { label: 'অ্যাড ম্যানেজারের রিপোর্ট দেখি, কিন্তু প্রকৃত লাভ/ লস অস্পষ্ট থাকে।', scores: { growth: 1 },     rawScore: 3, kpiWarning: true },
    { label: 'হ্যাঁ, অ্যাড কষ্ট, সেল এবং নিট প্রফিটের হিসাব রাখি।',                 scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q9 — ব্র্যান্ড আইডেন্টিটি */
  { id: 9, q: 'আপনার বিজনেসের নিজস্ব গল্প আছে? (কালার, ফন্ট, লোগো, স্লোগান)', hint: '', opts: [
    { label: 'ক্যানভা বা মোবাইল অ্যাপ দিয়ে নিজেই চালিয়ে নিচ্ছি।',        scores: { foundation: 1 }, rawScore: 1 },
    { label: 'ডিজাইন বা ব্র্যান্ডিং নিয়ে কখনো ওভাবে কাজ করা হয়নি।',     scores: { foundation: 1 }, rawScore: 2 },
    { label: 'মোটামুটি ভালো, তবে আরও প্রফেশনাল ও ট্রাস্টেড লুক দরকার।', scores: { growth: 1 },     rawScore: 3 },
    { label: 'প্রিমিয়াম এবং সবাই আমাদের কপি করে।',                        scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q10 — কনটেন্ট/ ক্রিয়েটিভ */
  { id: 10, q: 'আপনার বিজ্ঞাপনের ক্রিয়েটিভ বা ভিডিও কন্টেন্ট কে তৈরি করে?', hint: '', opts: [
    { label: 'নিজেই মোবাইল দিয়ে ভিডিও বা ছবি তৈরি করি।',          scores: { foundation: 1 }, rawScore: 1 },
    { label: 'ভালো কন্টেন্ট তৈরির জন্য প্রফেশনাল সাপোর্ট প্রয়োজন।', scores: { foundation: 1 }, rawScore: 2 },
    { label: 'ফ্রিল্যান্সার বা এজেন্সি দিয়ে করাই।',               scores: { growth: 1 },     rawScore: 3 },
    { label: 'নিজস্ব প্রফেশনাল ইন-হাউস টিম আছে।',                 scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q11 — কনটেন্ট টেস্ট */
  { id: 11, q: 'বিজ্ঞাপনের কন্টেন্ট/ ক্রিয়েটিভ কি নিয়মিত টেষ্ট এবং চেন্জ করেন?', hint: '', opts: [
    { label: 'দরকার নাই/ প্রযোজ্য না।', scores: { foundation: 1 }, rawScore: 1 },
    { label: 'কখনোই না।',               scores: { foundation: 1 }, rawScore: 2 },
    { label: 'অনিয়মিত।',               scores: { growth: 1 },     rawScore: 3 },
    { label: 'নিয়মিত।',                scores: { authority: 2 },  rawScore: 4 },
  ] },
  /* Q12 — সবচেয়ে বেশি ভাবায় */
  { id: 12, q: 'ব্যবসার কোন দিকটি আপনাকে এই মুহূর্তে সবচেয়ে বেশি ভাবিয়ে তোলে?', hint: '', opts: [
    { label: 'প্রোডাক্ট সোর্সিং/ প্রোডাক্ট কোয়ালিটি',                                  scores: { foundation: 1 }, rawScore: 1 },
    { label: 'বাজারে ব্র্যান্ড হিসেবে এখনো ট্রাস্ট তৈরি করতে পারিনি।',                  scores: { foundation: 1 }, rawScore: 2 },
    { label: 'স্লো ওয়েবসাইট বা টেকনিক্যাল সমস্যার কারণে কাস্টমার হারিয়ে যাচ্ছে।',    scores: { growth: 1 },     rawScore: 3, techGap: true, landingPageWarning: 'weak' },
    { label: 'অ্যাড খরচ হচ্ছে কিন্তু সেই তুলনায় সেল নেই',                               scores: { growth: 2 },     rawScore: 4, kpiWarning: true },
  ] },
  /* Q13 — ৬ মাসের লক্ষ্য */
  { id: 13, q: 'আগামী ৬ মাসের জন্য আপনার প্রধান লক্ষ্য কোনটি?', hint: '', opts: [
    { label: 'ঠিক করতে পারিনি/ বুজতে পারছি না।',                                scores: { foundation: 1 }, rawScore: 1 },
    { label: 'কোনোমতে বর্তমান অবস্থা বজায় রেখে টিকে থাকা।',                    scores: { foundation: 1 }, rawScore: 2 },
    { label: 'একটি প্রভাবশালী ব্র্যান্ড হিসেবে নিজেকে প্রতিষ্ঠিত করা।',        scores: { authority: 2 },  rawScore: 3 },
    { label: 'সেলস বৃদ্ধির একটি স্থায়ী ও অটোমেটেড সিস্টেম তৈরি করা।',        scores: { growth: 3 },     rawScore: 4 },
  ] },
  /* Q14 — কোন ধরনের সহযোগিতা দরকার — STRONGEST signal */
  { id: 14, q: 'কোন ধরণের সহযোগিতা আপনার সবচেয়ে বেশি প্রয়োজন?', hint: '', opts: [
    { label: 'বাজেটের ওপর নির্ভর করে সিদ্ধান্ত নেব।',                                    scores: { foundation: 1 }, rawScore: 1 },
    { label: 'অ্যাড ম্যানেজমেন্ট এবং টেকনিক্যাল সমস্যার সাময়িক সমাধান।',              scores: { growth: 2 },     rawScore: 2, budgetSignal: 'monthly_care' },
    { label: 'হাই-স্পিড কাস্টম ল্যান্ডিং পেইজ এবং সেলস ফানেল তৈরি।',                  scores: { growth: 3 },     rawScore: 3, budgetSignal: 'monthly_care' },
    { label: 'জিরো থেকে ব্র্যান্ড ডিজাইন এবং ফুল-স্ট্যাক মার্কেটিং পার্টনার।',       scores: { authority: 3 },  rawScore: 4, budgetSignal: 'brand_care' },
  ] },
]

const TOTAL = questions.length

const PACKAGES = {
  care_plus:    { variant: 'basic',   name: 'কেয়ার+',        price: 'অ্যাড বাজেট অনুযায়ী', priceNote: 'সার্ভিস চার্জ ফ্রি', tag: 'ফ্রি স্টার্টার',  waLabel: 'CarePlus' },
  monthly_care: { variant: 'popular', name: 'মান্থলি কেয়ার', price: '১০,০০০ টাকা থেকে শুরু', priceNote: 'মাসিক',           tag: 'সবচেয়ে জনপ্রিয়', waLabel: 'MonthlyCare' },
  brand_care:   { variant: 'premium', name: 'ব্র্যান্ড কেয়ার',   price: '৩০,০০০ টাকা থেকে শুরু', priceNote: 'মাসিক',           tag: 'ফুল সার্ভিস',     waLabel: 'BrandCare' },
}


/* rawScore sum → total 14-56 range
   <20 = Care+  |  20-34 = Monthly Care  |  35+ = Brand Care
   budgetSignal from Q14 always takes final priority */
const normalizeScore = (rawTotal) => {
  /* map 14-56 onto 0-100 for the progress bar */
  if (rawTotal <= 0) return 0
  return Math.min(100, Math.round(((rawTotal - 14) / (56 - 14)) * 100))
}

const decidePackage = (rawTotal, lastBudgetSignal) => {
  if (lastBudgetSignal) return lastBudgetSignal
  if (rawTotal >= 35) return 'brand_care'
  if (rawTotal >= 20) return 'monthly_care'
  return 'care_plus'
}

/* scoreLabel — derived from pkgKey so the bar label always matches the recommendation.
   The numeric score is a business-health %, not a stage classifier on its own. */
const scoreLabel = (pkgKey) =>
  pkgKey === 'care_plus' ? 'শুরুর পর্যায়' : pkgKey === 'monthly_care' ? 'গ্রোথ রেডি' : 'স্কেল রেডি'

const getDiagnosis = (pkgKey) => ({
  care_plus: {
    stage: 'আপনার ব্যবসা এখন শুরুর পর্যায়ে। সঠিকভাবে শুরু করলে এগিয়ে যাওয়া অনেক সহজ হবে।',
    insight: 'অনেকেই শুরুতে না বুঝেই অ্যাডে টাকা ঢালেন, কিন্তু বেসিক সেটআপ ঠিক না থাকলে সেই টাকার বেশিরভাগই নষ্ট হয়। কেয়ার+ এ আমরা আপনার অ্যাড অ্যাকাউন্ট ও বিজনেস পেজ সঠিকভাবে সেটআপ করে দেব, একটা ফ্রি বিজনেস অডিট করব এবং কোথায় কী করতে হবে তা পরামর্শ দেব। আপনি শুধু অ্যাডের বাজেট দেবেন, আর কোনো সার্ভিস চার্জ নেই।',
    advice: 'কেয়ার+ থেকে শুরু করুন, রেজাল্ট দেখুন। তারপর মান্থলি কেয়ার এ আসলে পাবেন কাস্টম ল্যান্ডিং পেজ এবং প্রফেশনাল অ্যাড ম্যানেজমেন্ট একসাথে। যত তাড়াতাড়ি সেই পদক্ষেপ নেবেন, তত দ্রুত সেল বাড়বে।',
  },
  monthly_care: {
    stage: 'আপনার ব্যবসা বাড়ার জায়গায় আছে। সঠিক সিস্টেম পেলে সেল অনেক বাড়বে।',
    insight: 'যারা শুধু অ্যাড চালায় আর পেজের দিকে নজর দেয় না, তাদের বেশিরভাগ বাজেটই নষ্ট হয়। ফাস্ট কাস্টম ল্যান্ডিং পেজ আর সঠিক অ্যাড একসাথে চললে কনভার্সন ২ থেকে ৩ গুণ বাড়ে। Digitalizen এর সবচেয়ে বড় সুবিধা হলো আমাদের কাছে মার্কেটার আর ডেভেলপার আলাদা না, তাই ঈদের রাতেও অফার লাইভ করতে পারবেন মাত্র ৩০ মিনিটে।',
    advice: 'মান্থলি কেয়ার এ আপনি পাচ্ছেন কাস্টম হাই-স্পিড ল্যান্ডিং পেজ, প্রফেশনাল অ্যাড ম্যানেজমেন্ট, Pixel ও CAPI সেটআপ এবং সিজনাল রিডিজাইন। সব এক টিম, এক খরচে। আলাদা ডেভেলপার আর আলাদা মার্কেটার রাখলে তিনগুণ খরচ হবে, তবুও সমন্বয় থাকবে না।',
  },
  brand_care: {
    stage: 'আপনার ব্যবসা এখন বড় ব্র্যান্ড হওয়ার দোরগোড়ায়।',
    insight: 'এই পর্যায়ে WordPress বা সাধারণ থিমের পেজ আপনার ব্র্যান্ডকে ছোট দেখায়। কম্পিটিটরের কাছে পিছিয়ে পড়ার সবচেয়ে বড় কারণ এটাই। শুধু অ্যাড দিলে ব্র্যান্ড হয় না। দরকার প্রিমিয়াম ডিজাইন, ফাস্ট পেজ, আর এমন অ্যাড যেটা ব্র্যান্ডের গল্প বলে। এই তিনটা এক জায়গায় না থাকলে বড় হওয়া কঠিন।',
    advice: 'ব্র্যান্ড কেয়ার এ আমরা আপনার পুরো ডিজিটাল পরিচয় নতুন করে গড়ব। জিরো থেকে ব্র্যান্ড আইডেন্টিটি, কাস্টম কোডের আনলিমিটেড ল্যান্ডিং পেজ, অ্যাডভান্সড ট্র্যাকিং এবং ফুল-স্ট্যাক মার্কেটিং। একটাই টিম, একটাই ভিশন এবং একটাই লক্ষ্য। আপনার ব্র্যান্ডকে মার্কেটে সবার উপরে নিয়ে যাওয়া।',
  },
}[pkgKey])

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Finder() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers,  setAnswers]  = useState([])
  const [selIdx,   setSelIdx]   = useState(null)
  const [phase,    setPhase]    = useState('quiz')
  const [visible,  setVisible]  = useState(true)
  const [result,   setResult]   = useState(null)

  const resultRef      = useRef(null)
  const sectionRef     = useRef(null)
  const enterTimeRef   = useRef(null)
  const sectionFiredRef = useRef(false)
  const quizStartTime  = useRef(null)   // when user answered Q1
  const dropOffQRef    = useRef(null)   // last question reached before abandon

  const q   = questions[currentQ]

  /* ── Section ViewContent + time-on-section + drop-off tracking ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !sectionFiredRef.current) {
          sectionFiredRef.current = true
          enterTimeRef.current    = Date.now()
          track('ViewContent', {
            content_name:     'Finder Section',
            content_category: 'Section',
          })
          io.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)

    const pushEng = () => pushEngagement('finder', enterTimeRef, { quiz_drop_off_question: dropOffQRef.current })

    const onVis = () => { if (document.visibilityState === 'hidden') pushEng() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('beforeunload', pushEng)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('beforeunload', pushEngagement)
    }
  }, [])

  /* ── Keyboard: press A–E to select option ── */
  useEffect(() => {
    if (phase !== 'quiz') return
    const onKey = (e) => {
      if (selIdx !== null) return
      const idx = e.key.toUpperCase().charCodeAt(0) - 65  // A=0, B=1 …
      if (idx >= 0 && idx < q.opts.length) pick(idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, selIdx, currentQ, q]) // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(() => {
    setCurrentQ(0); setAnswers([]); setSelIdx(null)
    setPhase('quiz'); setVisible(true); setResult(null)
    quizStartTime.current  = null
    dropOffQRef.current    = null
    track('ViewContent', {
      content_name:     'Finder Quiz Restart',
      content_category: 'Quiz',
    })
  }, [])

  const pick = useCallback((optIdx) => {
    if (selIdx !== null) return
    setSelIdx(optIdx)

    const opt         = q.opts[optIdx]
    const newAnswers  = [...answers, opt]
    dropOffQRef.current = currentQ + 1   // update last-reached question

    // Fire quiz start on Q1
    if (currentQ === 0 && !quizStartTime.current) {
      quizStartTime.current = Date.now()
      track('InitiateCheckout', {
        content_name:     'Finder Quiz Start',
        content_category: 'Quiz',
        currency:         'BDT',
        value:            0,
      })
    }

    // Per-question tracking — gives funnel drop-off visibility
    track('ViewContent', {
      content_name:      `Finder Q${q.id}: ${opt.label}`,
      content_category:  'Quiz Answer',
      content_ids:       [`finder_q${q.id}`],
      quiz_question:     q.id,
      quiz_answer_index: optIdx + 1,
      quiz_progress_pct: Math.round(((currentQ + 1) / TOTAL) * 100),
    })

    setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        if (currentQ < TOTAL - 1) {
          setAnswers(newAnswers); setCurrentQ(currentQ + 1); setSelIdx(null)
          setTimeout(() => setVisible(true), 0)
        } else {
          setAnswers(newAnswers); setPhase('loading'); setVisible(true)
          setTimeout(() => {
            const res = computeResult(newAnswers)
            setResult(res)
            setPhase('result')
            // Fire Lead on quiz completion — this is a high-intent signal
            const timeSpent = quizStartTime.current
              ? Math.round((Date.now() - quizStartTime.current) / 1000)
              : 0
            track('Lead', {
              content_name:         `Finder Result: ${res.pkg.name}`,
              content_category:     'Quiz Complete',
              content_ids:          [`finder_pkg_${res.pkgKey}`],
              currency:             'BDT',
              value:                0,
              quiz_score:           res.score,
              quiz_package:         res.pkg.waLabel,
              quiz_time_seconds:    timeSpent,
              tracking_warning:     res.trackingWarning,
              kpi_warning:          res.kpiWarning,
              tech_gap:             res.techGap,
            })
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
          }, 5500)
        }
      }, 170)
    }, 120)
  }, [selIdx, currentQ, answers, q])

  const goBack = useCallback(() => {
    if (currentQ === 0) return
    setVisible(false)
    setTimeout(() => {
      const prevAnswers = answers.slice(0, -1)
      const prevQ = questions[currentQ - 1]
      const prevSelIdx = prevQ.opts.findIndex(o => o.label === answers[currentQ - 1]?.label)
      setAnswers(prevAnswers); setCurrentQ(currentQ - 1)
      setSelIdx(prevSelIdx >= 0 ? prevSelIdx : null); setVisible(true)
    }, 170)
  }, [currentQ, answers])

  const computeResult = (all) => {
    let rawTotal = 0
    let trackingWarning = false, kpiWarning = false, landingPageWarning = null, techGap = false
    let lastBudgetSignal = null
    all.forEach((opt) => {
      rawTotal += opt.rawScore    || 0
      if (opt.trackingWarning)    trackingWarning    = true
      if (opt.kpiWarning)         kpiWarning         = true
      if (opt.landingPageWarning) landingPageWarning = opt.landingPageWarning
      if (opt.techGap)            techGap            = true
      if (opt.budgetSignal)       lastBudgetSignal   = opt.budgetSignal
    })
    const score  = normalizeScore(rawTotal)
    const pkgKey = decidePackage(rawTotal, lastBudgetSignal)
    return { score, rawTotal, pkgKey, pkg: PACKAGES[pkgKey], diag: getDiagnosis(pkgKey), trackingWarning, kpiWarning, landingPageWarning, techGap }
  }

  const buildWaMsg = useCallback(() => {
    if (!result) return ''
    const stage = scoreLabel(result.pkgKey).replace(/\s/g, '')
    const bs    = [...answers].reverse().find(a => a.budgetSignal)?.budgetSignal || 'unknown'
    const bMap  = { care_plus: 'Under10k', monthly_care: '10kTo30k', brand_care: 'Over30k', unknown: 'Unknown' }
    return `HelloDigitalizenAuditReportScore${result.score}Stage${stage}Budget${bMap[bs]}Package${result.pkg.waLabel}`
  }, [result, answers])

  const handleCtaPrimary = useCallback(() => {
    track('InitiateCheckout', {
      content_name:     `Finder CTA: ${result.pkg.name}`,
      content_category: 'CTA',
      content_ids:      [`finder_pkg_${result.pkgKey}`],
      currency:         'BDT',
      value:            0,
      quiz_score:       result.score,
      quiz_package:     result.pkg.waLabel,
    })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWaMsg())}`, '_blank')
  }, [result, buildWaMsg])

  const handleUpsell = useCallback(() => {
    track('AddToCart', {
      content_name:     'Monthly Care Upsell',
      content_category: 'Upsell',
      content_ids:      ['finder_pkg_monthly_care'],
      currency:         'BDT',
      value:            0,
    })
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো Digitalizen! আমি মান্থলি কেয়ার প্ল্যান সম্পর্কে জানতে চাই।')}`, '_blank')
  }, [])

  const warnings = result ? [
    /* W1 – No pixel/CAPI at all: red, critical */
    result.trackingWarning && {
      color: 'red', icon: 'warning',
      title: 'পিক্সেল ও CAPI ট্র্যাকিং মিসিং!',
      text:  'সঠিক ট্র্যাকিং ছাড়া ফেসবুকের অ্যালগরিদম বুঝতে পারে না আপনার আসল কাস্টমার কারা। এতে বিজ্ঞাপনের টাকা নষ্ট হয়।',
    },
    /* W2 – Pixel only / no ROAS tracking: amber, data gap */
    result.kpiWarning && {
      color: 'amber', icon: 'info',
      title: 'সঠিক ডাটা ট্র্যাকিং নেই',
      text:  'ROAS এবং প্রফিট ট্র্যাক না করলে আপনি বুঝতে পারবেন না মার্কেটিং থেকে আসলে কত লাভ হচ্ছে।',
    },
    /* W3 – No dev/design support: amber, Digitalizen USP hook */
    result.techGap && {
      color: 'amber', icon: 'warning',
      title: 'আপনার কি সিজনাল ডিজাইন সাপোর্ট আছে?',
      text:  'মার্কেটিং টিম যদি ল্যান্ডিং পেজ এডিট করতে না পারে তবে ক্যাম্পেইনের গতি কমে যায়। Digitalizen এর বিশেষত্ব হলো আমরা নিজেই প্রোগ্রামিং বুঝি, তাই যেকোনো উৎসব বা অফারে আপনার পেজ আমরাই ইনস্ট্যান্ট আপডেট করে দিতে পারি।',
    },
    /* W4 – Landing page issue: title & text differ by 'none' vs 'weak' */
    result.landingPageWarning && {
      color: 'amber', icon: 'warning',
      title: result.landingPageWarning === 'none'
        ? 'ল্যান্ডিং পেজ নেই!'
        : 'ল্যান্ডিং পেজ স্লো ও দুর্বল',
      text: result.landingPageWarning === 'none'
        ? 'ল্যান্ডিং পেজ ছাড়া অ্যাডের ট্রাফিক কোথাও যাচ্ছে না। শুধু ফেসবুক ইনবক্সে পাঠানো কনভার্সন অনেক কমিয়ে দেয়। একটি কাস্টম হাই-স্পিড পেজ আপনার সেল ২ থেকে ৩ গুণ বাড়াতে পারে।'
        : 'WordPress বা টেম্পলেট পেজ লোড হতে দেরি হয়। গবেষণা বলছে ১ সেকেন্ড দেরিতে ৭% কনভার্সন কমে। কাস্টম কোড করা পেজ আপনার অ্যাড বাজেটের সর্বোচ্চ ব্যবহার নিশ্চিত করে।',
    },
  ].filter(Boolean) : []

  /* ─── RENDER ─── */
  return (
    <section id="finder" className="finder-section" ref={sectionRef}>
      <div className="container">

        <div className="row-header">
          <span className="section-num">০০১</span>
          <span className="section-title-right">প্যাকেজ ফাইন্ডার</span>
        </div>

        <h2 className="finder-heading">আপনার ব্যবসার জন্য সঠিক প্ল্যান কোনটি?</h2>
        <p className="finder-sub">
          ১৪টি প্রশ্নে আপনার বিজনেসের বর্তমান অবস্থা এবং টেকনিক্যাল গ্যাপ জেনে নিন।
        </p>

        <div className="finder-card">

          {/* ── QUIZ ── */}
          {phase === 'quiz' && (
            <div className="finder-quiz" style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(12px)', transition: 'opacity 0.17s ease, transform 0.17s ease' }}>
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

              {/* Keyboard hint — only on desktop */}
              <p className="finder-keyboard-hint" aria-hidden="true">
                কীবোর্ড শর্টকাট: A, B, C… চাপুন
              </p>

              <div className="finder-opts">
                {q.opts.map((o, i) => (
                  <button
                    key={i}
                    className={`finder-opt${selIdx === i ? ' finder-opt--selected' : ''}`}
                    onClick={() => pick(i)}
                    disabled={selIdx !== null}
                    aria-label={`বিকল্প ${String.fromCharCode(0x41 + i)}: ${o.label}`}
                  >
                    <span className="finder-opt__key">{String.fromCharCode(0x41 + i)}</span>
                    <span className="finder-opt__text">{o.label}</span>
                    <span className="finder-opt__arrow">→</span>
                  </button>
                ))}
              </div>

              {currentQ > 0 && (
                <button className="finder-back" onClick={goBack}>{Icon.back} আগের প্রশ্নে ফিরুন</button>
              )}
            </div>
          )}

          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <div className="finder-loading">

              <div className="finder-loading__hero">
                <div className="finder-loading__ring" aria-hidden="true">
                  <svg width="72" height="72" viewBox="0 0 72 72">
                    <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(31,75,255,0.08)" strokeWidth="5"/>
                    <circle cx="36" cy="36" r="30" fill="none" stroke="#1F4BFF" strokeWidth="5"
                      strokeLinecap="round" strokeDasharray="188" strokeDashoffset="188"
                      className="finder-loading__ring-fill"
                      style={{ transformOrigin: '36px 36px', transform: 'rotate(-90deg)' }}
                    />
                  </svg>
                  <div className="finder-loading__ring-check" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <path d="M8 14l4 4 8-8" stroke="#1F4BFF" strokeWidth="2.4"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="finder-loading__check-path"/>
                    </svg>
                  </div>
                </div>
                <div className="finder-loading__hero-text">
                  <h3 className="finder-loading__title">আপনার বিজনেস অডিট চলছে</h3>
                  <p className="finder-loading__sub">১৪টি উত্তর বিশ্লেষণ করে আপনার জন্য সেরা প্ল্যান তৈরি হচ্ছে।</p>
                </div>
              </div>

              <div className="finder-loading__bar-track">
                <div className="finder-loading__bar" />
              </div>

              <div className="finder-loading__steps">
                {[
                  { txt: 'ব্যবসার স্তর ও মার্কেটিং গ্যাপ চিহ্নিত করা হচ্ছে', icon: '01' },
                  { txt: 'ল্যান্ডিং পেজ ও ট্র্যাকিং সেটআপ যাচাই করা হচ্ছে',  icon: '02' },
                  { txt: 'আপনার বিজনেসের জন্য কাস্টম প্ল্যান রেডি হচ্ছে',     icon: '03' },
                ].map((s, i) => (
                  <div key={i} className={`finder-loading__step finder-loading__step--${i + 1}`}>
                    <span className={`finder-loading__step-icon finder-loading__step-icon--${i + 1}`} aria-hidden="true">
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span className="finder-loading__step-txt">{s.txt}</span>
                  </div>
                ))}
              </div>

              <div className="finder-loading__footer">
                <span className="finder-loading__footer-dot" />
                <span className="finder-loading__footer-dot" />
                <span className="finder-loading__footer-dot" />
              </div>

            </div>
          )}

          {/* ── RESULT ── */}
          {phase === 'result' && result && (
            <div className="finder-result" ref={resultRef}>

              <div className={`finder-result__hero finder-result__hero--${result.pkg.variant}`}>
                {result.pkg.variant === 'premium' && <div className="finder-result__gold-strip" aria-hidden="true" />}
                <div className="finder-result__live">
                  <span className={`finder-result__live-dot finder-result__live-dot--${result.pkg.variant}`} />
                  {result.pkg.tag}
                </div>
                <h3 className="finder-result__name">{result.pkg.name}</h3>
                <p className="finder-result__price">
                  <strong>{result.pkg.price}</strong>
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

              {warnings.length > 0 && (
                <div className="finder-warnings">
                  {warnings.map((w, i) => (
                    <div key={i} className={`finder-warning finder-warning--${w.color}`}>
                      <div className={`finder-warning__icon finder-warning__icon--${w.color}`}>{Icon[w.icon]}</div>
                      <div>
                        <div className="finder-warning__title">{w.title}</div>
                        <p className="finder-warning__text">{w.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="finder-insights">
                <span className="finder-insights__label">আপনার বিজনেস অডিট রিপোর্ট</span>
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
                    <div className="finder-insight__label">সবচেয়ে বড় সমস্যা কোথায়</div>
                    <p className="finder-insight__text">{result.diag.insight}</p>
                  </div>
                </div>
              </div>

              <div className={`finder-advice finder-advice--${result.pkg.variant}`}>
                <div className="finder-advice__label">Digitalizen কীভাবে সাহায্য করবে</div>
                <p className="finder-advice__text">{result.diag.advice}</p>
              </div>

              {result.pkgKey === 'care_plus' && (
                <div className="finder-upsell">
                  <div className="finder-upsell__label">মান্থলি কেয়ার এ গেলে কী পরিবর্তন আসবে</div>
                  <p className="finder-upsell__text">কেয়ার+ এ শুরুটা ভালো হবে। কিন্তু সেল দ্রুত বাড়াতে চাইলে মান্থলি কেয়ার এ আসুন। মাত্র ১০,০০০ টাকায় পাচ্ছেন কাস্টম হাই-স্পিড ল্যান্ডিং পেজ, প্রফেশনাল অ্যাড ম্যানেজমেন্ট, Pixel ও CAPI সেটআপ এবং সিজনাল রিডিজাইন সব এক টিম থেকে। আলাদা ডেভেলপার আর আলাদা মার্কেটার রাখলে তিনগুণ বেশি খরচ হবে, তবুও এই সমন্বয় পাবেন না।</p>
                  <button className="finder-upsell__btn" onClick={handleUpsell}>
                    মান্থলি কেয়ার সম্পর্কে বিস্তারিত জানতে চাই
                  </button>
                </div>
              )}

              {result.pkgKey === 'monthly_care' && (
                <div className="finder-upsell">
                  <div className="finder-upsell__label">ব্র্যান্ড কেয়ার এ গেলে কী আলাদা হবে</div>
                  <p className="finder-upsell__text">মান্থলি কেয়ার এ ভালোই আছেন। তবে বাজারে সত্যিকারের বড় ব্র্যান্ড হতে চাইলে আরেক ধাপ এগোনো দরকার। ব্র্যান্ড কেয়ার এ পাচ্ছেন আনলিমিটেড কাস্টম পেজ, পুরো ব্র্যান্ড আইডেন্টিটি অর্থাৎ লোগো, কালার, ফন্ট, স্লোগান এবং একটা ডেডিকেটেড টেক ও মার্কেটিং টিম। কম্পিটিটর যখন সাধারণ WordPress পেজে অ্যাড দিচ্ছে, আপনার প্রিমিয়াম ফাস্ট পেজ দেখে কাস্টমার আগে ট্রাস্ট করবে। আর ট্রাস্টই বড় ব্র্যান্ডের ভিত্তি।</p>
                  <button className="finder-upsell__btn" onClick={handleUpsell}>
                    ব্র্যান্ড কেয়ার সম্পর্কে জানতে চাই
                  </button>
                </div>
              )}

              <div className="finder-ctas">
                <button className={`finder-cta-primary finder-cta-primary--${result.pkg.variant}`} onClick={handleCtaPrimary}>
                  {Icon.wa} WhatsApp এ কথা বলতে চাই
                </button>
                <button className="finder-cta-ghost" onClick={reset}>আবার চেকআপ করুন</button>
                <p className="finder-fine">পরামর্শ সম্পূর্ণ ফ্রি। কোনো বাধ্যবাধকতা নেই।</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

const bn = (n) => String(n).split('').map(d => '০১২৩৪৫৬৭৮৯'[+d] ?? d).join('')
