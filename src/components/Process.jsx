import { useState, useEffect, useCallback, useRef } from 'react'
import './Process.css'
import { track, WA_NUMBER } from '../analytics.js'

/* ── Tracking helpers ───────────────────────────────
   Meta Pixel (client-side) + CAPI-ready dataLayer push
   for server-side event deduplication via GTM / GA4.
   event_id is shared between fbq() and dataLayer so
   your CAPI endpoint can deduplicate with Meta.
─────────────────────────────────────────────────── */


/* ── WhatsApp icon ──────────────────────────────── */
const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* ── Check icon ─────────────────────────────────── */
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/* ── Step data ──────────────────────────────────── */
const steps = [
  {
    num: '01',
    numBn: '১',
    title: 'টেস্ট',
    desc: 'ছোট বাজেটে ৩–৫টি অ্যাড ভেরিয়েন্ট চালাই। কনটেন্ট রেডি থাকলে দ্রুতই শুরু করা যায়।',
    metric: '৭ দিন',
    metricLabel: 'প্রথম ডেটা',
    modal: {
      stepLabel: 'ধাপ ০১',
      title: 'টেস্ট ফেজ',
      tagline: 'ডেটা ছাড়া সিদ্ধান্ত নয়। আমরা আগে প্রমাণ সংগ্রহ করি, তারপর বিনিয়োগ বাড়াই।',
      stats: [
        { num: '৭ দিন', lbl: 'প্রথম ডেটা পয়েন্ট' },
        { num: '৩–৫টি', lbl: 'ভেরিয়েন্ট একসাথে' },
      ],
      story: 'আমরা কখনো সরাসরি বড় বাজেট ঢালি না। ছোট পরিসরে একাধিক ভিন্ন অ্যাড ভেরিয়েন্ট রান করি — ভিন্ন হেডলাইন, ভিন্ন ভিজ্যুয়াল, ভিন্ন অডিয়েন্স। মাত্র ৭ দিনেই বোঝা যায় কোনটা আপনার কাস্টমার টানছে।',
      checksLabel: 'এই ধাপে আমরা যা করি',
      checks: [
        'Meta Pixel ও Conversion API সেটআপ',
        'A/B টেস্ট কপি ও ক্রিয়েটিভ তৈরি',
        '৩–৫টি অডিয়েন্স সেগমেন্ট টেস্ট',
        'লো-বাজেটে ক্যাম্পেইন লঞ্চ',
        'প্রতিদিন পারফরম্যান্স মনিটরিং',
      ],
      insight: {
        title: 'কেন এটা জরুরি',
        text: 'টেস্ট না করে স্কেল করলে বাজেটের ৬০–৭০% নষ্ট হয়। আমাদের ক্লায়েন্টরা প্রথম সপ্তাহেই জানতে পারেন কোন ক্রিয়েটিভে সবচেয়ে কম খরচে সবচেয়ে বেশি রেজাল্ট আসছে।',
      },
      ctaText: 'ফ্রি টেস্ট স্ট্র্যাটেজি নিন',
      waMsg: 'হ্যালো Digitalizen! আমি টেস্ট ফেজ সম্পর্কে আরো জানতে চাই এবং আমার ব্যবসার জন্য কীভাবে শুরু করব সেটা বুঝতে চাই।',
    },
  },
  {
    num: '02',
    numBn: '২',
    title: 'অপ্টিমাইজ',
    desc: 'ডেটা বিশ্লেষণ করি। কোনটা কাজ করছে সেটায় বাজেট বাড়াই। বাকি গুলো বন্ধ করি।',
    metric: '2X',
    metricLabel: 'কম খরচ',
    modal: {
      stepLabel: 'ধাপ ০২',
      title: 'অপ্টিমাইজ ফেজ',
      tagline: 'লুজার বন্ধ করো, উইনার স্কেল করো। এই নীতিতেই প্রতিটি টাকার মূল্য দ্বিগুণ হয়।',
      stats: [
        { num: '2X',   lbl: 'বাজেট এফিশিয়েন্সি' },
        { num: '৪০–৬০%', lbl: 'CPL কমে গড়ে' },
      ],
      story: 'টেস্ট ডেটা হাতে আসার পর আমরা বিশ্লেষণ করি। যে অ্যাড কম খরচে বেশি কনভার্ট করছে সেটায় বাজেট সরিয়ে দিই। বাকিগুলো নিষ্ঠুরভাবে বন্ধ করি। এই ধাপেই একই বাজেটে দ্বিগুণ ফল আসে।',
      checksLabel: 'এই ধাপে আমরা যা করি',
      checks: [
        'CPL, ROAS, CTR গভীরভাবে বিশ্লেষণ',
        'পারফর্মিং ক্রিয়েটিভ আইডেন্টিফাই',
        'বাজেট রিঅ্যালোকেশন',
        'অডিয়েন্স রিফাইনমেন্ট',
        'ল্যান্ডিং পেজ ও ফানেল অডিট',
      ],
      insight: {
        title: 'রিয়েল নাম্বার',
        text: 'গড়ে আমাদের ক্লায়েন্টদের CPL এই ধাপে ৪০–৬০% কমে যায়। একই বাজেটে দ্বিগুণ লিড মানে হলো আপনার মার্কেটিং ROI সরাসরি ২X হওয়া।',
      },
      ctaText: 'অপ্টিমাইজেশন কল বুক করুন',
      waMsg: 'হ্যালো Digitalizen! আমার চলমান অ্যাড ক্যাম্পেইন অপ্টিমাইজ করতে চাই। কীভাবে শুরু করা যায়?',
    },
  },
  {
    num: '03',
    numBn: '৩',
    title: 'স্কেল',
    desc: 'প্রমাণিত উইনার অ্যাড স্কেল করি। ROAS ধরে রেখে ইনকাম বাড়াই।',
    metric: '৩৪০%',
    metricLabel: 'গড় ROAS',
    modal: {
      stepLabel: 'ধাপ ০৩',
      title: 'স্কেল ফেজ',
      tagline: 'প্রমাণিত ফর্মুলায় বাজেট বাড়াও। অনুমান নয়, ডেটায় নিশ্চিত।',
      stats: [
        { num: '৩৪০%', lbl: 'গড় ROAS আমাদের ক্লায়েন্টের' },
        { num: '৩X',   lbl: 'বাজেট বাড়িয়েও ROAS একই' },
      ],
      story: 'এখন আমাদের কাছে উইনার আছে। এই স্টেজে সেই অ্যাডগুলো দিয়ে নতুন অডিয়েন্সে যাই, Lookalike তৈরি করি এবং বাজেট ধীরে ধীরে বাড়াই। ROAS যেন না কমে সেদিকে প্রতিটি ধাপে নজর রাখি।',
      checksLabel: 'এই ধাপে আমরা যা করি',
      checks: [
        'Lookalike Audience তৈরি',
        'Retargeting ফানেল সেটআপ',
        'ধাপে ধাপে বাজেট স্কেলিং',
        'ROAS ট্র্যাকিং ও মেইনটেন',
        'মাসিক গ্রোথ রিভিউ মিটিং',
      ],
      insight: {
        title: 'ক্লায়েন্টের অভিজ্ঞতা',
        text: 'সঠিকভাবে স্কেল করলে বাজেট ৩ গুণ বাড়িয়েও ROAS একই রাখা সম্ভব। আমাদের ক্লায়েন্টরা গড়ে ৩৪০% ROAS পাচ্ছেন — মানে প্রতি ১০০ টাকায় ৩৪০ টাকা ফেরত।',
      },
      ctaText: 'স্কেলিং স্ট্র্যাটেজি নিন',
      waMsg: 'হ্যালো Digitalizen! আমার ব্যবসা স্কেল করতে চাই। ROAS এবং গ্রোথ নিয়ে আলোচনা করতে চাই।',
    },
  },
]

/* ══════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════ */
export default function Process() {
  const [activeModal, setActiveModal] = useState(null)
  const sectionRef  = useRef(null)
  const enterTimeRef = useRef(null)   // when user entered the section
  const firedRef    = useRef(false)   // section ViewContent fires once

  /* ── Section in-view tracking (Intersection Observer) ── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true
          enterTimeRef.current = Date.now()
          track('ViewContent', {
            content_name: 'Process Section',
            content_category: 'Section',
          })
        }
        // track time-on-section when leaving viewport
        if (!entry.isIntersecting && enterTimeRef.current) {
          const secs = Math.round((Date.now() - enterTimeRef.current) / 1000)
          window.dataLayer = window.dataLayer || []
          window.dataLayer.push({
            event: 'section_engagement',
            section: 'process',
            time_on_section_seconds: secs,
          })
          enterTimeRef.current = null
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* ── Modal open ── */
  const openModal = useCallback((idx) => {
    setActiveModal(idx)
    document.body.style.overflow = 'hidden'
    track('ViewContent', {
      content_name: `Process Step ${idx + 1} – ${steps[idx].title}`,
      content_category: 'Modal',
      content_ids: [`process_step_${idx + 1}`],
    })
  }, [])

  /* ── Modal close ── */
  const closeModal = useCallback(() => {
    setActiveModal(null)
    document.body.style.overflow = ''
  }, [])

  /* ── Keyboard close ── */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  /* ── WhatsApp CTA click ── */
  const handleWa = (step) => {
    track('InitiateCheckout', {
      content_name: step.title,
      content_category: 'WhatsApp CTA',
      content_ids: [`process_step_${steps.indexOf(step) + 1}`],
      currency: 'BDT',
    })
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(step.modal.waMsg)}`,
      '_blank'
    )
  }

  const active = activeModal !== null ? steps[activeModal] : null

  return (
    <>
      {/* ═══════ SECTION ═══════ */}
      <section id="process" className="process-section" ref={sectionRef}>
        <div className="container">

          <div className="row-header">
            <span className="section-num">০০২</span>
            <span className="section-title-right">ভালো রেজাল্ট কীভাবে আসে</span>
          </div>

          <h2 className="process-heading">আমাদের প্রুভেন মেথড</h2>
          <p className="process-sub">
            তিনটি ধাপ — ছোট টেস্ট থেকে বড় স্কেল পর্যন্ত।
            প্রতিটি কার্ড ক্লিক করলে বিস্তারিত জানতে পারবেন।
          </p>

          {/* Cards */}
          <div className="process-cards">
            {steps.map((s, i) => (
              <button
                key={i}
                className="prc-card"
                onClick={() => openModal(i)}
                aria-haspopup="dialog"
                aria-label={`${s.title} সম্পর্কে বিস্তারিত দেখুন`}
              >
                {/* Orb */}
                <div className="prc-orb-col">
                  <div className="prc-orb">
                    <span className="prc-orb-num">{s.num}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="prc-thread" aria-hidden="true" />
                  )}
                </div>

                {/* Body */}
                <div className="prc-body" data-n={s.num}>
                  <div className="prc-body-shine" aria-hidden="true" />
                  <div className="prc-row">
                    <h3 className="prc-title">{s.title}</h3>
                    <div className="prc-metric">
                      <span className="prc-metric-num">{s.metric}</span>
                      <span className="prc-metric-label">{s.metricLabel}</span>
                    </div>
                  </div>
                  <p className="prc-desc">{s.desc}</p>
                  <span className="prc-cue" aria-hidden="true">
                    বিস্তারিত দেখুন
                    <span className="prc-cue-arr">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════ MODAL ═══════ */}
      <div
        className={`prc-overlay${activeModal !== null ? ' prc-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={active ? active.modal.title : undefined}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
      >
        <div className="prc-modal">
          <div className="prc-modal-handle" aria-hidden="true" />

          <button
            className="prc-modal-close"
            onClick={closeModal}
            aria-label="বন্ধ করুন"
          >
            ✕
          </button>

          {active && (
            <>
              {/* Header */}
              <div className="prc-modal-header">
                <div className="prc-modal-step-pill">
                  <span className="prc-modal-step-pill-dot" aria-hidden="true" />
                  {active.modal.stepLabel}
                </div>

                <h2 className="prc-modal-title">{active.modal.title}</h2>
                <p className="prc-modal-tagline">{active.modal.tagline}</p>

                {/* Stats */}
                <div className="prc-modal-stat-row">
                  {active.modal.stats.map((st, i) => (
                    <div key={i} className="prc-modal-stat">
                      <span className="prc-modal-stat-num">{st.num}</span>
                      <span className="prc-modal-stat-lbl">{st.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="prc-modal-content">

                <p className="prc-modal-story">{active.modal.story}</p>

                <div className="prc-checks">
                  <div className="prc-checks-lbl">{active.modal.checksLabel}</div>
                  {active.modal.checks.map((c, i) => (
                    <div key={i} className="prc-check">
                      <span className="prc-check-tick"><CheckIcon /></span>
                      {c}
                    </div>
                  ))}
                </div>

                <div className="prc-modal-insight">
                  <div className="prc-modal-insight-bar" aria-hidden="true" />
                  <div className="prc-modal-insight-body">
                    <strong>{active.modal.insight.title}</strong>
                    {active.modal.insight.text}
                  </div>
                </div>

                <button
                  className="prc-modal-cta"
                  onClick={() => handleWa(active)}
                >
                  <WaIcon />
                  {active.modal.ctaText}
                </button>

                <p className="prc-modal-fine">কোনো বাধ্যবাধকতা নেই · বিনামূল্যে পরামর্শ</p>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
