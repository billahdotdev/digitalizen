import { useState, useEffect, useCallback, useRef } from 'react'
import './Process.css'
import { track, WA_NUMBER } from '../lib/analytics.js'

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

/* ── Step icons ─────────────────────────────────── */
const Icons = {
  data: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M17.5 14v6M14.5 17h6" />
    </svg>
  ),
  cog: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
}

/* ── Step data ──────────────────────────────────── */
const STEPS = [
  {
    id: '01',
    label: 'Audit & Strategy',
    lbl: 'Audit',
    title: 'বিজনেসের গভীর বিশ্লেষণ',
    desc: 'আপনার বর্তমান অ্যাড অ্যাকাউন্ট এবং ল্যান্ডিং পেজের ডাটা এনালাইসিস করে আমরা একটি কাস্টম রোডম্যাপ তৈরি করি।',
    icon: Icons.data,
    modal: {
      story: 'অ্যাড রান করার আগে আমরা দেখি আপনার ব্যবসার ফানেল ঠিক আছে কি না। সঠিক অডিট ছাড়া অ্যাড চালানো মানে অন্ধের মতো টাকা খরচ করা।',
      checksLabel: 'আমরা যা চেক করি:',
      checks: [
        'বর্তমান কনভার্সন রেট এনালাইসিস',
        'প্রতিযোগী ও মার্কেট রিসার্চ',
        'সঠিক পিক্সেল ও ট্র্যাকিং সেটআপ',
        'রি-টার্গেটিং ফানেল প্ল্যানিং',
      ],
      insight: {
        title: 'প্রো টিপ: ',
        text: 'ভুল ফানেলে অ্যাড দিলে শুধু টাকা নষ্ট হয়, সেল আসে না।',
      },
      ctaText: 'ফ্রি বিজনেস অডিট বুক করুন',
    },
  },
  {
    id: '02',
    label: 'Automation System',
    lbl: 'System',
    title: 'সেলস অটোমেশন সেটআপ',
    desc: 'আমরা আপনার জন্য এমন এক সিস্টেম (Make/ManyChat) তৈরি করি যা আপনার অনুপস্থিতিতেও কাস্টমারকে গাইড করবে।',
    icon: Icons.cog,
    modal: {
      story: 'অ্যাড থেকে আসা লিডগুলো যেন রিপ্লাই না পেয়ে হারিয়ে না যায়, সেজন্য আমরা হোয়াটসঅ্যাপ ও মেসেঞ্জার অটোমেশন সেট করি।',
      checksLabel: 'অটোমেশনের সুফল:',
      checks: [
        'লিড পাওয়ার সাথে সাথে অটো-রিপ্লাই',
        'কাস্টমার ডাটা অটোমেটিক গুগল শিটে জমা',
        'রি-মার্কেটিং এর জন্য অটোমেটেড ফলো-আপ',
        'কাস্টমার সাপোর্ট ম্যানেজমেন্ট সহজ করা',
      ],
      insight: {
        title: 'কেন অটোমেশন? ',
        text: 'দ্রুত রিপ্লাই দিলে সেলস ক্লোজ হওয়ার সম্ভাবনা ৪ গুণ বেড়ে যায়।',
      },
      ctaText: 'অটোমেশন নিয়ে কথা বলি',
    },
  },
  {
    id: '03',
    label: 'Conversion Assets',
    lbl: 'Assets',
    title: 'হাই-কনভার্টিং ল্যান্ডিং পেজ',
    desc: 'শুধু অ্যাড না, আমরা হাই-স্পিড Vite+React ল্যান্ডিং পেজ ডিজাইন করি যা কাস্টমারকে ট্রাস্ট করতে বাধ্য করে।',
    icon: Icons.eye,
    modal: {
      story: 'ফেসবুক পেজের চেয়ে একটি প্রফেশনাল ল্যান্ডিং পেজ কাস্টমারের ট্রাস্ট বহুগুণ বাড়িয়ে দেয় এবং ব্র্যান্ড ভ্যালু তৈরি করে।',
      checksLabel: 'ল্যান্ডিং পেজের বৈশিষ্ট্য:',
      checks: [
        'আল্ট্রা-ফাস্ট লোডিং স্পিড (Vite+React)',
        'মোবাইল-ফ্রেন্ডলি ক্লিন ডিজাইন',
        'কনভার্সন অপ্টিমাইজড কপিরাইটিং',
        'সার্ভার সাইড ট্র্যাকিং (CAPI) সেটআপ',
      ],
      insight: {
        title: 'সিক্রেট: ',
        text: 'আপনার ল্যান্ডিং পেজই আপনার ব্যবসার ২৪/৭ সেরা সেলস পারসন।',
      },
      ctaText: 'আমার ল্যান্ডিং পেজ দরকার',
    },
  },
  {
    id: '04',
    label: 'Scaling & Growth',
    lbl: 'Growth',
    title: 'স্কেলিং এবং প্রফিট নিশ্চিত করা',
    desc: 'সিস্টেম রেডি হওয়ার পর আমরা ডাটা দেখে বাজেট বাড়াই এবং আপনার বিজনেসের দীর্ঘমেয়াদী গ্রোথ নিশ্চিত করি।',
    icon: Icons.check,
    modal: {
      story: 'সবকিছু যখন অটোমেটেড এবং অপ্টিমাইজড থাকে, তখন বিজ্ঞাপনের বাজেট বাড়ানো খুব সহজ ও রিস্ক-ফ্রি হয়ে যায়।',
      checksLabel: 'স্কেলিং প্রসেস:',
      checks: [
        'এ/বি টেস্টিং (A/B Testing)',
        'অ্যাডের আরও ভ্যারিয়েশন তৈরি',
        'লো-কস্ট লিড জেনারেশন',
        'মাসিক পারফরম্যান্স রিপোর্ট প্রদান',
      ],
      insight: {
        title: 'লক্ষ্য: ',
        text: 'আমাদের লক্ষ্য আপনার প্রতি ১ টাকা ইনভেস্টমেন্টকে ৫ টাকায় রূপান্তর করা।',
      },
      ctaText: 'বিজনেস স্কেল করতে চাই',
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
      content_name: `Process Step ${idx + 1} – ${STEPS[idx].title}`,
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
      content_ids: [`process_step_${STEPS.indexOf(step) + 1}`],
      currency: 'BDT',
    })
    const waMsg = `হ্যালো Digitalizen, ${step.modal.ctaText} সম্পর্কে জানতে চাই।`
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMsg)}`,
      '_blank'
    )
  }

  const active = activeModal !== null ? STEPS[activeModal] : null

  return (
    <>
      {/* ═══════ SECTION ═══════ */}
      <section id="process" className="process-section" ref={sectionRef} aria-label="আমাদের কাজের প্রক্রিয়া">
        <div className="container">

          <div className="row-header">
            <span className="section-num">০০২</span>
            <span className="section-title-right">{"// ভালো রেজাল্ট কীভাবে আসে"}</span>
          </div>

          <h2 className="process-heading">আমাদের প্রমাণিত পদ্ধতি</h2>
          <p className="process-sub">
            চারটি ধাপ, অডিট থেকে স্কেলিং পর্যন্ত।
            প্রতিটি কার্ড চাপলে বিস্তারিত জানতে পারবেন।
          </p>

          {/* Cards */}
          <div className="process-cards">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon
              return (
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
                      <span className="prc-orb-num">{s.id}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="prc-thread" aria-hidden="true" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="prc-body" data-n={s.id}>
                    <div className="prc-body-shine" aria-hidden="true" />
                    <div className="prc-row">
                      <h3 className="prc-title">{s.title}</h3>
                      <div className="prc-label-chip">
                        <span className="prc-label-icon"><StepIcon /></span>
                        <span className="prc-label-text">{s.lbl}</span>
                      </div>
                    </div>
                    <p className="prc-desc">{s.desc}</p>
                    <span className="prc-cue" aria-hidden="true">
                      বিস্তারিত দেখুন
                      <span className="prc-cue-arr">→</span>
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </section>

      {/* ═══════ MODAL ═══════ */}
      <div
        className={`prc-overlay${activeModal !== null ? ' prc-overlay--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={activeModal !== null ? 'prc-modal-title-id' : undefined}
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
                  ধাপ {active.id} — {active.label}
                </div>

                <h2 id="prc-modal-title-id" className="prc-modal-title">{active.title}</h2>
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

                <p className="prc-modal-fine">কোনো বাধ্যবাধকতা নেই, পরামর্শ বিনামূল্যে।</p>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
