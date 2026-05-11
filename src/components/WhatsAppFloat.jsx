import React from 'react';
import { IconWhatsApp } from './Icons.jsx';
import { trackWhatsApp } from '../utils/tracking.js';

/* ── Config (previously in src/data/content.js → brand.whatsapp) ── */
const WA_NUMBER = '8801311773040';
const WA_HREF   = `https://wa.me/${WA_NUMBER}`;

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp-এ যোগাযোগ করুন"
      onClick={() => trackWhatsApp('float_button')}
    >
      <IconWhatsApp width={24} height={24} fill="#fff" />
      <span className="wa-float-ring" aria-hidden />
    </a>
  );
}
