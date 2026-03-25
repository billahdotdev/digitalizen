import { useState } from 'react'
import { Instagram, Linkedin, Facebook, Youtube } from 'lucide-react'
import './Footer.css'
import { WA_NUMBER } from '../lib/analytics.js'

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openModal = (type) => setActiveModal(type)
  const closeModal = () => setActiveModal(null)

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('হ্যালো, আরো জানতে চাই।')}`,
      '_blank',
      'noreferrer'
    )
  }

  return (
    <>
      <footer className="footer">
        <div className="footer__glow-top"></div>
        
        <div className="container">
          
          <div className="footer__main">
            
            {/* Brand Section */}
            <div className="footer__brand">
              <div className="footer__logo">
                Digitalizen<span className="footer__logo-dot"></span>
              </div>
              <p className="footer__tagline">
                পারফরম্যান্স-ড্রিভেন মার্কেটিং এজেন্সি। আমরা শুধু ক্যাম্পেইন চালাই না, 
                আমরা আপনার ব্যবসার গ্রোথ পার্টনার।
              </p>

              {/* WhatsApp Button */}
              <button className="footer__wa-btn" onClick={handleWhatsApp}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>হোয়াটসঅ্যাপে যোগাযোগ করুন</span>
              </button>

              {/* Social Icons */}
              <ul className="footer__socials">
                <li>
                  <a 
                    href="https://instagram.com/digitalizen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com/company/digitalizen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://facebook.com/digitalizen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} strokeWidth={2} />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://youtube.com/@digitalizen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-icon"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} strokeWidth={2} />
                  </a>
                </li>
              </ul>
            </div>

            {/* Navigation Section */}
            <div className="footer__nav">
              <h3 className="footer__nav-title">নেভিগেশন</h3>
              <button onClick={() => scrollTo('home')} className="footer__link">
                হোম
              </button>
              <button onClick={() => scrollTo('about')} className="footer__link">
                আমাদের সম্পর্কে
              </button>
              <button onClick={() => scrollTo('services')} className="footer__link">
                সার্ভিস
              </button>
              <button onClick={() => scrollTo('gallery')} className="footer__link">
                আমাদের কাজ
              </button>
              <button onClick={() => scrollTo('contact')} className="footer__link">
                যোগাযোগ
              </button>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="footer__bottom">
            <p className="footer__copy">
              © {new Date().getFullYear()} Digitalizen. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="footer__legal">
              <button onClick={() => openModal('privacy')} className="footer__legal-btn">
                প্রাইভেসি পলিসি
              </button>
              <span>•</span>
              <button onClick={() => openModal('terms')} className="footer__legal-btn">
                টার্মস অব সার্ভিস
              </button>
              <span>•</span>
              <button onClick={() => openModal('refund')} className="footer__legal-btn">
                রিফান্ড পলিসি
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Legal Modals */}
      {activeModal && (
        <div className="legal-overlay" onClick={closeModal}>
          <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="legal-modal__header">
              <h3 className="legal-modal__title">
                {activeModal === 'privacy' && 'প্রাইভেসি পলিসি'}
                {activeModal === 'terms' && 'টার্মস অব সার্ভিস'}
                {activeModal === 'refund' && 'রিফান্ড পলিসি'}
              </h3>
              <button 
                onClick={closeModal} 
                className="legal-modal__close"
                aria-label="বন্ধ করুন"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="legal-modal__body">
              {activeModal === 'privacy' && (
                <>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">তথ্য সংগ্রহ</h4>
                    <p className="legal-modal__section-text">
                      আমরা শুধুমাত্র প্রয়োজনীয় তথ্য সংগ্রহ করি যা আপনার সেবা প্রদানের জন্য অপরিহার্য। 
                      এর মধ্যে রয়েছে আপনার নাম, যোগাযোগের তথ্য এবং ব্যবসায়িক বিবরণ।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">তথ্য ব্যবহার</h4>
                    <p className="legal-modal__section-text">
                      আপনার তথ্য শুধুমাত্র সেবা প্রদান, যোগাযোগ এবং পরিসেবা উন্নতির জন্য ব্যবহৃত হয়। 
                      আমরা কখনোই তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি করি না।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">তথ্য নিরাপত্তা</h4>
                    <p className="legal-modal__section-text">
                      আমরা আপনার তথ্যের সুরক্ষার জন্য শিল্পমান নিরাপত্তা ব্যবস্থা প্রয়োগ করি। 
                      আপনার ডেটা এনক্রিপ্টেড এবং সুরক্ষিত সার্ভারে সংরক্ষিত থাকে।
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">সেবা প্রদান</h4>
                    <p className="legal-modal__section-text">
                      আমরা আপনার ব্যবসায়িক লক্ষ্য অর্জনের জন্য সর্বোত্তম প্রচেষ্টা করি। 
                      তবে, মার্কেটিং ফলাফল বাজার পরিস্থিতি এবং বিভিন্ন ফ্যাক্টরের উপর নির্ভর করে।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">পেমেন্ট শর্তাবলী</h4>
                    <p className="legal-modal__section-text">
                      সেবা শুরুর আগে সম্মত পেমেন্ট টার্মস অনুযায়ী পেমেন্ট করতে হবে। 
                      দেরিতে পেমেন্টের ক্ষেত্রে সেবা স্থগিত হতে পারে।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">চুক্তি বাতিল</h4>
                    <p className="legal-modal__section-text">
                      যেকোনো পক্ষ ৩০ দিনের নোটিশ দিয়ে চুক্তি বাতিল করতে পারে। 
                      বাতিলের ক্ষেত্রে সম্পন্ন কাজের জন্য পেমেন্ট প্রযোজ্য থাকবে।
                    </p>
                  </section>
                </>
              )}

              {activeModal === 'refund' && (
                <>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">রিফান্ড যোগ্যতা</h4>
                    <p className="legal-modal__section-text">
                      সেবা শুরুর ৭ দিনের মধ্যে যদি আপনি সন্তুষ্ট না হন, আমরা সম্পূর্ণ রিফান্ড প্রদান করি। 
                      এর পরে, সম্পন্ন কাজের মূল্য বাদ দিয়ে আংশিক রিফান্ড প্রযোজ্য হতে পারে।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">রিফান্ড প্রক্রিয়া</h4>
                    <p className="legal-modal__section-text">
                      রিফান্ডের জন্য আবেদন করতে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন। 
                      অনুমোদনের পর ৭-১০ কর্মদিবসের মধ্যে রিফান্ড প্রসেস করা হবে।
                    </p>
                  </section>
                  <section className="legal-modal__section">
                    <h4 className="legal-modal__section-title">ব্যতিক্রম</h4>
                    <p className="legal-modal__section-text">
                      কাস্টম ডেভেলপমেন্ট কাজ এবং বিশেষ প্রজেক্টের ক্ষেত্রে আলাদা রিফান্ড পলিসি প্রযোজ্য হতে পারে, 
                      যা চুক্তিতে উল্লেখ থাকবে।
                    </p>
                  </section>
                </>
              )}
            </div>

            <div className="legal-modal__footer">
              <button onClick={closeModal} className="legal-modal__done">
                বুঝেছি
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
