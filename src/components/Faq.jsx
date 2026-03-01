import { useState } from 'react'
import './Faq.css'

const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)
const WA_NUMBER = '8801XXXXXXXXX'

const faqs = [
  {
    q: 'শুরু করতে কত টাকা লাগবে?',
    a: 'মাত্র ৳১,৪৫০ দিয়েই শুরু করতে পারবেন আমাদের মাইক্রো টেস্ট প্যাকেজের মাধ্যমে। এটি ছোট বাজেটে দ্রুত রেজাল্ট দেখার সেরা উপায়। বাজেট বেশি হলে সাপ্তাহিক বা মাসিক প্যাকেজও আছে।',
    cat: 'মূল্য',
    catColor: { bg: '#fef9c3', fg: '#854d0e' },
  },
  {
    q: 'ফলাফল পেতে কতদিন লাগে?',
    a: 'সাধারণত প্রথম ৭ দিনের মধ্যেই প্রাথমিক ডেটা পাওয়া যায়। ২–৩ সপ্তাহের মধ্যে স্পষ্ট প্যাটার্ন দেখা দেয়। তবে ROAS সর্বোচ্চ পর্যায়ে নিতে সাধারণত ৪–৬ সপ্তাহ লাগে, কারণ প্রতিটি ডেটা পয়েন্ট অনুযায়ী অপ্টিমাইজেশন করা হয়।',
    cat: 'ফলাফল',
    catColor: { bg: '#dcfce7', fg: '#166534' },
  },
  {
    q: 'আমার কাছে কনটেন্ট না থাকলে কী হবে?',
    a: 'কোনো সমস্যা নেই। আমাদের কাস্টম সলিউশন প্যাকেজে ছবি ও ভিডিও কনটেন্ট প্রোডাকশনের সুবিধা আছে। আপনাকে শুধু পণ্য বা সেবার বিবরণ দিতে হবে — বাকিটা আমরা করব।',
    cat: 'কনটেন্ট',
    catColor: { bg: '#f3e8ff', fg: '#6b21a8' },
  },
  {
    q: 'মেটা অ্যাডস বাদে অন্য প্ল্যাটফর্মে কাজ করেন?',
    a: 'মূলত Facebook ও Instagram (মেটা ইকোসিস্টেম) নিয়ে কাজ করি, কারণ বাংলাদেশের ব্যবসার জন্য এটাই সবচেয়ে কার্যকর। তবে কাস্টম প্যাকেজে Google Ads, TikTok Ads এবং YouTube Ads অন্তর্ভুক্ত করার সুযোগ আছে।',
    cat: 'সার্ভিস',
    catColor: { bg: '#e0f2fe', fg: '#075985' },
  },
  {
    q: 'রিপোর্ট কীভাবে পাব?',
    a: 'প্যাকেজ ভেদে সাপ্তাহিক বা মাসিক রিপোর্ট WhatsApp ও ইমেইলে পাঠানো হয়। রিপোর্টে থাকবে: Reach, Impressions, CTR, CPC, ROAS এবং কনভার্সন ডেটা — সহজ বাংলায় ব্যাখ্যা সহ।',
    cat: 'রিপোর্টিং',
    catColor: { bg: '#fff7ed', fg: '#9a3412' },
  },
  {
    q: 'চুক্তি বা লক-ইন পিরিয়ড আছে?',
    a: 'না। আমরা দীর্ঘমেয়াদি চুক্তিতে বিশ্বাসী নই। মাইক্রো টেস্ট একবারের পেমেন্ট। সাপ্তাহিক ও মাসিক প্যাকেজ যেকোনো সময় বন্ধ করা যাবে। রেজাল্ট দেখে সন্তুষ্ট হলে চালিয়ে যাবেন — এটাই আমাদের মডেল।',
    cat: 'চুক্তি',
    catColor: { bg: '#fce7f3', fg: '#9d174d' },
  },
  {
    q: 'পেমেন্ট কীভাবে করব?',
    a: 'bKash, Nagad, Rocket এবং ব্যাংক ট্রান্সফার গ্রহণ করা হয়। প্রথম অর্ডারে ৫০% অ্যাডভান্স নেওয়া হয়, বাকি ৫০% কাজ শুরু হওয়ার পর। বিস্তারিত WhatsApp-এ আলোচনা করা যাবে।',
    cat: 'পেমেন্ট',
    catColor: { bg: '#e8eeff', fg: '#1e3a8a' },
  },
  {
    q: 'আমার বিজ্ঞাপন বাজেট কতটুকু রাখা উচিত?',
    a: 'টেস্টিংয়ের জন্য দৈনিক ৳৩০০–৳৫০০ যথেষ্ট। স্কেলিংয়ের সময় ধীরে ধীরে বাজেট বাড়ানো হয়, যেন ROAS ধরে রাখা যায়। বিজ্ঞাপন বাজেট সরাসরি Meta-তে যায় — আমাদের ম্যানেজমেন্ট ফি আলাদা।',
    cat: 'বাজেট',
    catColor: { bg: '#ecfdf5', fg: '#065f46' },
  },
]

export default function Faq() {
  const [open, setOpen] = useState(null)

  const toggle = (i) => {
    setOpen(open === i ? null : i)
    if (open !== i) pixel('ViewContent', { content_name: 'FAQ: ' + faqs[i].q })
  }

  return (
    <section id="faq" className="faq-section" aria-label="সাধারণ প্রশ্নোত্তর">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৮</span>
          <span className="section-title-right">FAQ</span>
        </div>

        <h2 className="faq-heading">সাধারণ প্রশ্নোত্তর</h2>
        <p className="faq-sub">সবচেয়ে বেশি জিজ্ঞেস করা প্রশ্নগুলোর উত্তর এখানে পাবেন।</p>

        <div className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i} className={`faq-item${isOpen ? ' faq-item--open' : ''}`}>
                <button
                  className="faq-trigger"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={'faq-body-' + i}
                  id={'faq-btn-' + i}
                >
                  <div className="faq-trigger-left">
                    <span
                      className="faq-cat"
                      style={{ background: item.catColor.bg, color: item.catColor.fg }}
                    >
                      {item.cat}
                    </span>
                    <span className="faq-q">{item.q}</span>
                  </div>
                  <span className={'faq-chevron' + (isOpen ? ' faq-chevron--open' : '')} aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div
                    id={'faq-body-' + i}
                    role="region"
                    aria-labelledby={'faq-btn-' + i}
                    className="faq-body"
                  >
                    <p className="faq-answer">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="faq-cta">
          <p className="faq-cta-text">আপনার প্রশ্নের উত্তর এখানে পাননি?</p>
          <button
            className="faq-cta-btn"
            onClick={() => {
              pixel('Contact', { content_name: 'FAQ WhatsApp CTA' })
              window.open(
                'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent('হ্যালো, আমার একটি প্রশ্ন আছে।'),
                '_blank'
              )
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp-এ জিজ্ঞেস করুন
          </button>
        </div>
      </div>
    </section>
  )
}
