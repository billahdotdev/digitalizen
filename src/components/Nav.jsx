import React, { useEffect, useState, useRef } from 'react';
import { IconMenu, IconClose } from './Icons.jsx';

/* ── Data ─────────────────────────────────────────────────────── */
const BRAND = {
  name:     'digitalizen',
  whatsapp: '+8801311773040',
};

const NAV = [
  { id: 'services', label: 'সার্ভিস'  },
  { id: 'process',  label: 'প্রসেস'   },
  { id: 'works',    label: 'কাজ'      },
  { id: 'chatbot',  label: 'AI Bot'   },
  { id: 'pricing',  label: 'প্যাকেজ' },
  { id: 'contact',  label: 'যোগাযোগ' },
];

const WA_MSG  = encodeURIComponent('হ্যালো! আমি Digitalizen-এর সাথে কথা বলতে চাই।');
const WA_HREF = `https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}?text=${WA_MSG}`;

export default function Nav() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef  = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); menuBtnRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => {
    setOpen(false);
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const scrollTop = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <>
      <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`} aria-label="Primary navigation">
        <a href="#top" className="nav-logo" onClick={scrollTop} aria-label="Digitalizen — top of page">
          {BRAND.name}<em aria-hidden="true">.</em>
        </a>

        <ul className="nav-links" role="list">
          {NAV.map((n) => (
            <li key={n.id}>
              <button className="nav-link" onClick={() => go(n.id)}>{n.label}</button>
            </li>
          ))}
        </ul>

        <a
          className="nav-cta"
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          WhatsApp করুন
        </a>

        <button
          ref={menuBtnRef}
          className="nav-menu-btn"
          aria-label={open ? 'মেনু বন্ধ করুন' : 'মেনু খুলুন'}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </nav>

      {open && (
        <div
          className="nav-overlay"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`nav-drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        <div className="nav-drawer-header">
          <span className="nav-drawer-brand">{BRAND.name}<em>.</em></span>
          <button
            className="nav-drawer-close"
            onClick={() => setOpen(false)}
            aria-label="মেনু বন্ধ করুন"
          >
            <IconClose />
          </button>
        </div>

        <nav aria-label="Mobile links">
          <ul role="list">
            {NAV.map((n, i) => (
              <li key={n.id} style={{ '--i': i }}>
                <button
                  className="nav-drawer-link"
                  onClick={() => go(n.id)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="nav-drawer-num">0{i + 1}</span>
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="btn-primary nav-drawer-cta"
          href={WA_HREF}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
          tabIndex={open ? 0 : -1}
        >
          <span>ফ্রি অডিট বুক করুন</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </>
  );
}
