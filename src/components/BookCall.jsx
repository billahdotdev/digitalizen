import { useState } from 'react'
import './BookCall.css'

const pixel = (ev, p = {}) => window.fbq?.('track', ev, p)
const WA_NUMBER = '8801711992558'

const TOPICS = [
  'ফেসবুক অ্যাড শুরু করতে চাই',
  'বিদ্যমান অ্যাড আরও ভালো করতে চাই',
  'বাজেট অপ্টিমাইজ করতে চাই',
  'নতুন প্রোডাক্ট লঞ্চ করব',
  'ROAS বাড়াতে চাই',
  'অন্য বিষয়ে আলোচনা করতে চাই',
]

export default function BookCall() {
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')
  const [topic, setTopic] = useState('')
  const [budget, setBudget] = useState('')
  const [preview, setPreview] = useState(false)

  const buildMessage = () => {
    const parts = [
      `হ্যালো Digitalizen! আমি ফ্রি কনসালটেশন কল করতে চাই।`,
      name ? `👤 নাম: ${name}` : null,
      business ? `🏢 ব্যবসা: ${business}` : null,
      topic ? `📌 আলোচনার বিষয়: ${topic}` : null,
      budget ? `💰 মান্থলি বাজেট: ${budget}` : null,
      ``,
      `কখন কল করা যাবে জানাবেন? ধন্যবাদ! 🙏`,
    ].filter(p => p !== null)
    return parts.join('\n')
  }

  const handleBook = () => {
    pixel('Lead', { content_name: 'Book Free Call', value: 0, currency: 'BDT' })
    const msg = buildMessage()
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const previewMsg = buildMessage()

  return (
    <section id="book-call" className="bookcall-section">
      <div className="container">
        <div className="row-header">
          <span className="section-num">০০৬</span>
          <span className="section-title-right">ফ্রি কল</span>
        </div>

        <div className="bookcall-card">
          {/* Header */}
          <div className="bookcall-header">
            <div className="call-badge">
              <span className="call-badge__dot" aria-hidden="true"></span>
              সম্পূর্ণ বিনামূল্যে
            </div>
            <h2 className="bookcall-heading">ফ্রি কনসালটেশন কল বুক করুন</h2>
            <p className="bookcall-sub">
              ৫ মিনিটেই জানুন আপনার ব্যবসার জন্য সেরা অ্যাড স্ট্র্যাটেজি।
            </p>

            <div className="call-perks">
              {[
                { icon: '⚡', text: 'দ্রুত WhatsApp রিপ্লাই' },
                { icon: '🎯', text: 'কাস্টম অ্যাড স্ট্র্যাটেজি' },
                { icon: '💸', text: 'সম্পূর্ণ ফ্রি, কোনো শর্ত নাই' },
              ].map((p, i) => (
                <div key={i} className="call-perk">
                  <span aria-hidden="true">{p.icon}</span>
                  <span>{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bookcall-form">
            <div className="form-group">
              <label className="form-label" htmlFor="bc-name">আপনার নাম</label>
              <input
                id="bc-name"
                type="text"
                className="form-input"
                placeholder="যেমন: মাসুম বিল্লাহ"
                value={name}
                onChange={e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bc-business">আপনার ব্যবসার ধরন</label>
              <input
                id="bc-business"
                type="text"
                className="form-input"
                placeholder="যেমন: ফ্যাশন শপ, রেস্টুরেন্ট, অনলাইন কোর্স..."
                value={business}
                onChange={e => setBusiness(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bc-topic">কী নিয়ে আলোচনা করতে চান?</label>
              <select
                id="bc-topic"
                className="form-input form-select"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              >
                <option value="">বিষয় বেছে নিন</option>
                {TOPICS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="bc-budget">মান্থলি বিজ্ঞাপন বাজেট (আনুমানিক)</label>
              <select
                id="bc-budget"
                className="form-input form-select"
                value={budget}
                onChange={e => setBudget(e.target.value)}
              >
                <option value="">বাজেট বেছে নিন</option>
                <option value="১,০০০–৫,০০০ টাকা">১,০০০–৫,০০০ টাকা</option>
                <option value="৫,০০০–২০,০০০ টাকা">৫,০০০–২০,০০০ টাকা</option>
                <option value="২০,০০০–৫০,০০০ টাকা">২০,০০০–৫০,০০০ টাকা</option>
                <option value="৫০,০০০+ টাকা">৫০,০০০+ টাকা</option>
                <option value="এখনো নিশ্চিত নই">এখনো নিশ্চিত নই</option>
              </select>
            </div>

            {/* Message preview toggle */}
            <button
              className="preview-toggle"
              onClick={() => setPreview(p => !p)}
              type="button"
            >
              {preview ? '▲' : '▼'} WhatsApp মেসেজ প্রিভিউ দেখুন
            </button>

            {preview && (
              <div className="msg-preview" role="region" aria-label="WhatsApp মেসেজ প্রিভিউ">
                <div className="msg-preview__label">আপনার মেসেজটি দেখতে এইরকম হবে:</div>
                <div className="msg-preview__bubble">
                  {previewMsg.split('\n').map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                </div>
              </div>
            )}

            <button className="bookcall-btn" onClick={handleBook} type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp-এ ফ্রি কল বুক করুন
            </button>

            <p className="bookcall-fine">
              কোনো বাধ্যবাধকতা নেই, পরামর্শ একদম ফ্রি।
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
