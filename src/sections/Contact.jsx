"use client"

import { useRef, useEffect, useState } from "react"
import { MessageCircle } from "react-feather"

const Contact = ({ registerSection, onButtonHover }) => {
  const sectionRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState(null)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("contact", sectionRef.current)
    }
  }, [registerSection])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Instead of simulating form submission, open WhatsApp
    const message = `Hi, my name is ${formData.name}. ${formData.message} (Reply to: ${formData.email})`
    const whatsappUrl = `https://wa.me/01711992558?text=${encodeURIComponent(message)}`

    // Show submitting status
    setFormStatus("submitting")

    // Short delay to show the submitting state
    setTimeout(() => {
      window.open(whatsappUrl, "_blank")
      setFormStatus("success")
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    }, 500)
  }

  const handleWhatsApp = () => {
    const message = "Hi, I'd like to get in touch about your services."
    const whatsappUrl = `https://wa.me/01711992558?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section ref={sectionRef} className="section contact-section" id="contact">
      <div className="section-content">
        <h2 className="section-title">Contact</h2>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Get In Touch</h3>
            <p>Let's discuss how we can help your business grow or just to say hello.</p>

            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a
                  href="mailto:hello@example.com"
                  className="contact-value"
                  onMouseEnter={() => onButtonHover(true, "Send Email")}
                  onMouseLeave={() => onButtonHover(false, "")}
                >
                  digitalizenbd@gmail.com
                </a>
              </div>

              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <a
                  href="tel:+8801711992558"
                  className="contact-value"
                  onMouseEnter={() => onButtonHover(true, "Call Us")}
                  onMouseLeave={() => onButtonHover(false, "")}
                >
                  +88 01711 992 558
                </a>
              </div>

              <div className="contact-item">
                <span className="contact-label">Location</span>
                <span className="contact-value">Dhaka, Manila</span>
              </div>
            </div>

            <button
              className="whatsapp-button"
              onClick={handleWhatsApp}
              onMouseEnter={() => onButtonHover(true, "WhatsApp")}
              onMouseLeave={() => onButtonHover(false, "")}
            >
              <MessageCircle size={18} />
              <span>Contact via WhatsApp</span>
            </button>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                onMouseEnter={() => onButtonHover(true, "Type Here")}
                onMouseLeave={() => onButtonHover(false, "")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                onMouseEnter={() => onButtonHover(true, "Type Here")}
                onMouseLeave={() => onButtonHover(false, "")}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                onMouseEnter={() => onButtonHover(true, "Type Here")}
                onMouseLeave={() => onButtonHover(false, "")}
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={formStatus === "submitting"}
              onMouseEnter={() => onButtonHover(true, "Send Message")}
              onMouseLeave={() => onButtonHover(false, "")}
            >
              {formStatus === "submitting" ? "Sending..." : "Send Message"}
            </button>

            {formStatus === "success" && (
              <div className="form-success">Thank you for your message! We'll get back to you soon.</div>
            )}
          </form>
        </div>
      </div>

      <div className="footer">
        <p>&copy; {new Date().getFullYear()} Brandotory. All rights reserved.</p>
      </div>
    </section>
  )
}

export default Contact

