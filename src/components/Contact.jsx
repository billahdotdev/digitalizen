import { useState } from 'react'
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
    const msg = `নতুন ইনকোয়ারি:\nনাম: ${form.name}\nফোন: ${form.phone}\nব্র্যান্ড: ${form.business || 'N/A'}`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noreferrer')
  }

  return (
    <section className="ct-ghost-section" id="contact">
      <div className="ct-grid-overlay"></div>
      
      <div className="container ct-main-grid">
        <div className="ct-vision">
          <div className="ct-tag">{"//  Contact"}</div>
          <h2 className="ct-hero-text">
            Let&apos;s build <br /> 
            something <span className="text-glow">Legendary.</span>
          </h2>
          <div className="ct-availability">
            <span className="pulse-ring"></span>
            Currently taking 2 new projects
          </div>
        </div>

        <div className="ct-form-side">
          <form onSubmit={handleSubmit} className="ct-ghost-form">
            
            <div className={`ct-ghost-field ${errors.name ? 'is-err' : ''}`}>
              <span className="ct-num">01</span>
              <input 
                type="text" name="name" autoComplete="off" required
                value={form.name} onChange={handleInput} 
              />
              <label className="ct-floating-label">আপনার নাম কি?</label>
              <div className="ct-bar"></div>
            </div>

            <div className={`ct-ghost-field ${errors.phone ? 'is-err' : ''}`}>
              <span className="ct-num">02</span>
              <input 
                type="tel" name="phone" autoComplete="off" required
                value={form.phone} onChange={handleInput} 
              />
              <label className="ct-floating-label">আপনার ফোন নম্বর?</label>
              <div className="ct-bar"></div>
            </div>

            <div className="ct-ghost-field">
              <span className="ct-num">03</span>
              <input 
                type="text" name="business" autoComplete="off" required
                value={form.business} onChange={handleInput} 
              />
              <label className="ct-floating-label">আপনার ব্র্যান্ড?</label>
              <div className="ct-bar"></div>
            </div>

            <button type="submit" className="ct-industrial-btn">
              <span className="ct-btn-label">INITIATE GROWTH</span>
              <div className="ct-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </button>
            
          </form>
        </div>
      </div>
    </section>
  )
}