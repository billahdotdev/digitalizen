import React from 'react';
import { IconWhatsApp } from './Icons.jsx';
import { trackWhatsApp } from '../utils/tracking.js';
import { generalHref, MSG } from '../utils/contact.js';

/* Floating WhatsApp button. General contact, not the bot. */
const HREF = generalHref(MSG.CONTACT);

export default function WhatsAppFloat() {
  return (
    <a
      className="wa-float"
      href={HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp এ যোগাযোগ করুন"
      onClick={() => trackWhatsApp('float_button')}
    >
      <IconWhatsApp width={24} height={24} fill="#fff" />
      <span className="wa-float-ring" aria-hidden />
    </a>
  );
}
