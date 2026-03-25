/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import './Contact.css'
import { WA_NUMBER } from '../lib/analytics.js'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', business: '' })
  const [errors, setErrors] = useState({})

  const handleInput = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      setErrors({ name: !form.name, phone: !form.phone })
      return
    }
    const msg = `Contact Request:\nName: ${form.name}\nPhone: ${form.phone}\nBrand: ${form.business}`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer')
  }

  return (
    <section className="ct-wrap" id="contact">
      <div className="ct-container">
        
        {/* Left: Branding & Status */}
        <div className="ct-left">
          <div className="ct-status-pill">
            <span className="ct-dot"></span>
            SYSTEM ONLINE: ACCEPTING PROJECTS
          </div>
          <h2 className="ct-big-title">Ready to <br/>Scale?</h2>
          <div className="ct-meta-info">
            <div className="ct-meta-row">
              <span className="ct-meta-label">Direct Line</span>
              <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="ct-meta-link">WhatsApp / +880 1711-925588</a>
            </div>
          </div>
        </div>

        {/* Right: The Modernist Form */}
        <div className="ct-right">
          <form onSubmit={handleSubmit} className="ct-minimal-form">
            
            <div className={`ct-input-group ${errors.name ? 'ct-error' : ''}`}>
              <label className="ct-label">01 / Full Name</label>
              <input 
                type="text" name="name" placeholder="Type here..."
                value={form.name} onChange={handleInput} 
              />
              <div className="ct-focus-line"></div>
            </div>

            <div className={`ct-input-group ${errors.phone ? 'ct-error' : ''}`}>
              <label className="ct-label">02 / Phone Number</label>
              <input 
                type="tel" name="phone" placeholder="01XXXXXXXXX"
                value={form.phone} onChange={handleInput} 
              />
              <div className="ct-focus-line"></div>
            </div>

            <div className="ct-input-group">
              <label className="ct-label">03 / Brand Name (Optional)</label>
              <input 
                type="text" name="business" placeholder="Your brand..."
                value={form.business} onChange={handleInput} 
              />
              <div className="ct-focus-line"></div>
            </div>

            <button type="submit" className="ct-magnetic-btn">
              <span className="ct-btn-text">Initiate Growth</span>
              <span className="ct-btn-arrow">→</span>
            </button>
            
          </form>
        </div>

      </div>
    </section>
  )
}