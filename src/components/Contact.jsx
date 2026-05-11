import React, { useState, useRef } from 'react';
import { trackFormStart, trackFormSubmit, trackFormError, sha256 } from '../utils/tracking.js';

// ─── CONFIG ────────────────────────────────────────────────────────────────
const WA_NUMBER = '8801311773040';

// Accepts BD numbers: 01XXXXXXXXX (11 digits) or +8801XXXXXXXXX (13 digits)
// Also accepts spaces/dashes between groups for UX.
const BD_PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;

function normalizePhone(raw) {
  return raw.replace(/[\s\-()]/g, '');
}

function validatePhone(raw) {
  return BD_PHONE_RE.test(normalizePhone(raw));
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────
export default function Contact() {
  const [form,       setForm]       = useState({ name: '', phone: '', brand: '' });
  const [phoneError, setPhoneError] = useState('');
  const [state,      setState]      = useState('idle'); // idle | sending | success | error
  const startedRef  = useRef(false);
  const submitting  = useRef(false); // double-submit guard


  const update = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (k === 'phone') setPhoneError(''); // clear inline error on edit
  };

  const handleFocus = () => {
    if (!startedRef.current) { startedRef.current = true; trackFormStart('contact_audit'); }
  };

  const handlePhoneBlur = () => {
    if (form.phone && !validatePhone(form.phone)) {
      setPhoneError('সঠিক বাংলাদেশী নম্বর দিন। যেমন: 01712345678');
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) return;
    if (!validatePhone(form.phone)) {
      setPhoneError('সঠিক বাংলাদেশী নম্বর দিন। যেমন: 01712345678');
      return;
    }
    if (submitting.current) return;
    submitting.current = true;

    setState('sending');

    const phone = normalizePhone(form.phone);
    const [hashedPhone, hashedName] = await Promise.all([sha256(phone), sha256(form.name.trim())]);
    trackFormSubmit('contact_audit', { ph: hashedPhone, fn: hashedName });

    // Build a WhatsApp message with the form data
    const waText = encodeURIComponent(
      `হ্যালো! আমি ফ্রি অডিট বুক করতে চাই।\n\nনাম: ${form.name.trim()}\nফোন: ${phone}${form.brand.trim() ? `\nব্র্যান্ড: ${form.brand.trim()}` : ''}`
    );
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${waText}`;

    // Small delay so "পাঠানো হচ্ছে…" is visible, then open WhatsApp
    await new Promise(r => setTimeout(r, 600));
    setState('success');
    submitting.current = false;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="section section--dark" id="contact" aria-labelledby="contact-h2">
      <div className="section-inner">
        <div className="section-tag">// ০০৮ — যোগাযোগ</div>

        <div className="contact-grid">
          <div className="contact-copy">
            <h2 id="contact-h2" className="contact-h">
              আজই শুরু করুন।<br />
              <em>ফ্রি অডিট</em><br />
              আপনার জন্য।
            </h2>
            <p className="contact-sub">
              ৩০ মিনিটের কলে আপনার বিজনেসের ডিজিটাল গ্যাপ বের করি।
              কোনো বিক্রির চাপ নেই।
            </p>
            <div className="availability">
              <span className="avail-dot" aria-hidden />
              এখন ২টি নতুন প্রজেক্ট নিচ্ছি
            </div>
            <div className="contact-perks">
              {['ফ্রি', 'কোনো চুক্তি নেই', '২৪ ঘণ্টার মধ্যে রিপ্লাই'].map(p => (
                <div key={p} className="contact-perk">
                  <span className="contact-perk-dot" aria-hidden />
                  {p}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-wrap">
            {state === 'success' ? (
              <div className="form-success" role="status" aria-live="polite">
                <div className="form-success-icon" aria-hidden>✓</div>
                <div className="form-success-h">ধন্যবাদ! WhatsApp খুলছে…</div>
                <p className="form-success-p">আপনার তথ্য নিয়ে WhatsApp-এ চ্যাট শুরু হবে। ২৪ ঘণ্টার মধ্যে রিপ্লাই পাবেন।</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="contact-form">
                <Field
                  label="আপনার নাম"
                  value={form.name}
                  onChange={update('name')}
                  onFocus={handleFocus}
                  type="text"
                  required
                  placeholder="মাসুম বিল্লাহ"
                  autoComplete="name"
                />
                <Field
                  label="ফোন নম্বর"
                  value={form.phone}
                  onChange={update('phone')}
                  onFocus={handleFocus}
                  onBlur={handlePhoneBlur}
                  type="tel"
                  required
                  placeholder="01712 345 678"
                  autoComplete="tel"
                  inputMode="tel"
                  error={phoneError}
                />
                <Field
                  label="ব্র্যান্ডের নাম"
                  value={form.brand}
                  onChange={update('brand')}
                  onFocus={handleFocus}
                  type="text"
                  placeholder="আপনার ব্র্যান্ড"
                  autoComplete="organization"
                />

                <button
                  className="submit-btn"
                  type="submit"
                  disabled={state === 'sending'}
                  aria-busy={state === 'sending'}
                >
                  <span>{state === 'sending' ? 'পাঠানো হচ্ছে…' : 'ফ্রি অডিট বুক করুন'}</span>
                  <span aria-hidden>{state === 'sending' ? '…' : '→'}</span>
                </button>

                {state === 'error' && (
                  <p className="form-error" role="alert">
                    সাবমিট ব্যর্থ — WhatsApp-এ সরাসরি যোগাযোগ করুন।
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FIELD ─────────────────────────────────────────────────────────────────
function Field({ label, error, onBlur, ...input }) {
  const id    = `f-${label.replace(/\s+/g, '-')}`;
  const errId = `${id}-err`;
  return (
    <div className="ghost-field">
      <label className="ghost-label" htmlFor={id}>{label}</label>
      <input
        id={id}
        className={`ghost-input${error ? ' ghost-input--error' : ''}`}
        aria-describedby={error ? errId : undefined}
        aria-invalid={error ? 'true' : undefined}
        onBlur={onBlur}
        {...input}
      />
      {error && (
        <span id={errId} className="ghost-field-error" role="alert">{error}</span>
      )}
    </div>
  );
}
