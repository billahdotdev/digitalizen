import React, { useEffect, useState } from 'react';
import Nav           from './components/Nav.jsx';
import Hero          from './components/Hero.jsx';
import Services      from './components/Services.jsx';
import Process       from './components/Process.jsx';
import Works         from './components/Works.jsx';
import ChatBot       from './components/ChatBot.jsx';
import SpeedTest     from './components/SpeedTest.jsx';
import Packages      from './components/Packages.jsx';
import FAQ           from './components/FAQ.jsx';
import Contact       from './components/Contact.jsx';
import Footer        from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import BotLanding    from './components/BotLanding.jsx';
import { initTracking } from './utils/tracking.js';

const SECTIONS = [
  Hero, Services, Process,
  Works, ChatBot, SpeedTest, Packages, FAQ, Contact,
];

/* ─── Zero-dependency path router ───────────────────────────────────────
   Why no react-router?
   ─ Single extra route doesn't justify 18 KB of router lib.
   ─ window.location.pathname + popstate covers /bot (ad URL) and / (main).
   ─ GitHub Pages SPA fallback (public/404.html) handles deep links.

   To add a new route:
     1. Create your component in src/components/
     2. Add a case below in pathToView()
   ────────────────────────────────────────────────────────────────────── */
function pathToView(pathname) {
  const p = pathname.replace(/\/+$/, '').toLowerCase();
  if (p === '/bot') return 'bot';
  return 'main';
}

function useRoute() {
  const [view, setView] = useState(() =>
    typeof window !== 'undefined' ? pathToView(window.location.pathname) : 'main'
  );

  useEffect(() => {
    const onPop = () => setView(pathToView(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return view;
}

export default function App() {
  const view = useRoute();

  /* Init tracking only on the main site — BotLanding fires its own
     dedicated Pixel events from inside the component.              */
  useEffect(() => {
    if (view === 'main') initTracking();
  }, [view]);

  if (view === 'bot') return <BotLanding />;

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        {SECTIONS.map((Section) => <Section key={Section.name} />)}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
