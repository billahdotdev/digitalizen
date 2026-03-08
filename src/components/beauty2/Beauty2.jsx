/**
 * Beauty.jsx — Lumière Skin
 * "The Stage" — Living Canvas + Magnetic Bottom-Sheet Architecture
 *
 * UX CONCEPT:
 * ─ Top 62%: Full-bleed product canvas. Background gradient shifts with shade selection.
 * ─ Bottom sheet: 3 magnetic snap points (peek → detail → checkout).
 * ─ Shade swatch tap: ripple + canvas gradient wave transition.
 * ─ Checkout: slides in from right like a native app drawer.
 * ─ All state-driven. Zero page navigation. Zero backend.
 * ─ Orders: Google Form (no-cors) + WhatsApp fallback.
 *
 * INFORMATION HIERARCHY:
 *   Canvas     → Product identity (name, badge, hero image)
 *   Sheet peek → Price · Shade selector · CTA
 *   Sheet mid  → Description · Benefits · How-to-use
 *   Sheet full → Ingredients accordion · Sustainability · Rail
 *   Checkout   → Product snapshot · Qty · 3 fields · COD · Submit
 */

import { useState, useEffect, useRef, useCallback } from "react";
import "./Beauty2.css";
import { PRODUCTS, STORE } from "./Beauty2.data";

/* ═══════════════════════════════════════════════
   ICONS — inline SVG, zero dependencies
═══════════════════════════════════════════════ */
const IconWA    = () => <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const IconBag   = () => <svg viewBox="0 0 24 24"><path d="M19 7h-3V6a4 4 0 00-8 0v1H5a1 1 0 00-1 1v11a3 3 0 003 3h10a3 3 0 003-3V8a1 1 0 00-1-1zM10 6a2 2 0 014 0v1h-4V6zm8 13a1 1 0 01-1 1H7a1 1 0 01-1-1V9h2v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h2v10z"/></svg>;
const IconBack  = () => <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>;
const IconChev  = () => <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>;
const IconLeaf  = () => <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 5.5-11 10h-3.5C8.5 10 12 8 17 8z"/></svg>;
const IconCOD   = () => <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
const IconStar  = () => <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const fmt = n => "৳" + n.toLocaleString("en-BD");
const savePct = p => Math.round(((p.was - p.price) / p.was) * 100);
const validateBDPhone = v => /^01[3-9]\d{8}$/.test(v.trim());

/* ═══════════════════════════════════════════════
   RIPPLE HOOK — fires haptic-style CSS ripple
═══════════════════════════════════════════════ */
function useRipple() {
  const [ripples, setRipples] = useState([]);
  const fire = useCallback((x, y, color = "rgba(255,255,255,0.5)") => {
    const id = Date.now();
    setRipples(r => [...r, { id, x, y, color }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 600);
  }, []);
  return [ripples, fire];
}

/* ═══════════════════════════════════════════════
   BOTTOM SHEET — drag-snappable, 3 stops
═══════════════════════════════════════════════ */
const STOPS = { peek: 0, detail: 1, full: 2 };
const STOP_TRANSLATE = { 0: "62%", 1: "25%", 2: "0%" };

function BottomSheet({ stop, onStopChange, children, checkoutOpen }) {
  const sheetRef = useRef(null);
  const dragRef  = useRef({ startY: 0, startT: 0, active: false });

  const onTouchStart = e => {
    dragRef.current = { startY: e.touches[0].clientY, startT: Date.now(), active: true };
  };
  const onTouchEnd = e => {
    if (!dragRef.current.active) return;
    const dy   = e.changedTouches[0].clientY - dragRef.current.startY;
    const fast = (Date.now() - dragRef.current.startT) < 240;
    dragRef.current.active = false;

    if (fast && Math.abs(dy) > 30) {
      // Flick gesture
      onStopChange(dy < 0 ? Math.min(stop + 1, 2) : Math.max(stop - 1, 0));
    } else if (dy < -60) {
      onStopChange(Math.min(stop + 1, 2));
    } else if (dy > 60) {
      onStopChange(Math.max(stop - 1, 0));
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`lu-sheet lu-sheet--s${stop}${checkoutOpen ? " lu-sheet--behind" : ""}`}
      style={{ transform: `translateY(${STOP_TRANSLATE[stop]})` }}
    >
      {/* Drag handle */}
      <div
        className="lu-handle"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => onStopChange(stop === 2 ? 1 : stop + 1)}
        role="button"
        aria-label="Expand sheet"
      >
        <div className="lu-handle-pill" />
      </div>

      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ACCORDION — smooth curtain reveal
═══════════════════════════════════════════════ */
function Accordion({ icon, title, children }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.maxHeight = open ? bodyRef.current.scrollHeight + "px" : "0px";
    }
  }, [open]);

  return (
    <div className={`lu-acc${open ? " lu-acc--open" : ""}`}>
      <button className="lu-acc-head" onClick={() => setOpen(o => !o)}>
        <span className="lu-acc-label">
          <span className="lu-acc-icon">{icon}</span>
          {title}
        </span>
        <span className={`lu-acc-chev${open ? " lu-acc-chev--open" : ""}`}>
          <IconChev />
        </span>
      </button>
      <div className="lu-acc-body" ref={bodyRef}>
        <div className="lu-acc-inner">{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CHECKOUT PANEL — slides from right
═══════════════════════════════════════════════ */
function CheckoutPanel({ product, shade, open, onClose }) {
  const [qty,    setQty]    = useState(1);
  const [form,   setForm]   = useState({ name:"", phone:"", address:"", note:"" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const nameRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 420);
    if (!open) { setStatus("idle"); setErrors({}); }
  }, [open]);

  const total = product ? product.price * qty : 0;

  const validate = () => {
    const e = {};
    if (!form.name.trim())            e.name    = "নাম দিন";
    if (!validateBDPhone(form.phone)) e.phone   = "সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)";
    if (!form.address.trim())         e.address = "ঠিকানা দিন";
    return e;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("sending");

    const F = STORE.fields;
    const body = new URLSearchParams({
      [F.productName]: `${product.name} — ${shade?.name || ""}`,
      [F.shade]:       shade?.name || "",
      [F.qty]:         String(qty),
      [F.price]:       fmt(product.price),
      [F.total]:       `${fmt(total)} BDT`,
      [F.name]:        form.name.trim(),
      [F.phone]:       form.phone.trim(),
      [F.address]:     form.address.trim(),
      [F.note]:        form.note.trim() || "—",
    });

    try {
      await fetch(STORE.formAction, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
    } catch (_) { /* no-cors always throws — form still records */ }

    setStatus("done");
  };

  const upd = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const waMessage = product
    ? encodeURIComponent(`Hi! I'd like to order:\n\n🛍️ *${product.name}*\n🎨 Shade: ${shade?.name || "N/A"}\n📦 Qty: ${qty}\n💰 Total: ${fmt(total)} (COD)\n\nPlease confirm my order. Thank you!`)
    : "";

  if (!product) return null;

  return (
    <div className={`lu-co${open ? " lu-co--open" : ""}`} aria-modal="true" role="dialog">

      {/* Header */}
      <div className="lu-co-head">
        <button className="lu-co-back" onClick={onClose} aria-label="Back">
          <IconBack />
        </button>
        <span className="lu-co-title">
          {status === "done" ? "Order Placed ✨" : "Complete Your Order"}
        </span>
      </div>

      {status === "done" ? (
        /* ── SUCCESS STATE ── */
        <div className="lu-success">
          <div className="lu-success-orb">🌸</div>
          <h2 className="lu-success-title">Thank you, {form.name.split(" ")[0]}.</h2>
          <p className="lu-success-msg">
            Your <strong>{product.name}</strong> is confirmed.<br />
            We'll reach you at <span className="lu-success-ph">{form.phone}</span> to arrange cash-on-delivery.
          </p>
          <div className="lu-success-cod">
            <IconCOD />
            Pay ৳{total.toLocaleString("en-BD")} on Delivery
          </div>
          <a
            href={`https://wa.me/${STORE.whatsapp}?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            className="lu-success-wa"
          >
            <IconWA /> Confirm on WhatsApp
          </a>
          <button className="lu-success-close" onClick={onClose}>Continue Shopping</button>
        </div>

      ) : (
        <div className="lu-co-scroll">

          {/* Product snapshot */}
          <div className="lu-co-snap">
            <img src={product.imgs[0]} alt={product.name} className="lu-co-snap-img" loading="eager" />
            <div className="lu-co-snap-info">
              <div className="lu-co-snap-name">{product.name}</div>
              <div className="lu-co-snap-meta">
                {shade?.name && <span className="lu-co-snap-shade" style={{ background: shade.hex }} />}
                {shade?.name || product.subtitle}
              </div>
              <div className="lu-co-snap-price">{fmt(product.price)}</div>
            </div>
          </div>

          {/* COD only notice */}
          <div className="lu-co-cod-note">
            <IconCOD />
            <div>
              <strong>Cash on Delivery only</strong>
              <span>Pay when your order arrives at your door.</span>
            </div>
          </div>

          {/* Qty */}
          <div className="lu-co-row">
            <span className="lu-co-lbl">Quantity</span>
            <div className="lu-co-qty">
              <button className="lu-co-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="lu-co-qty-num">{qty}</span>
              <button className="lu-co-qty-btn" onClick={() => setQty(q => Math.min(5, q + 1))}>+</button>
            </div>
            <span className="lu-co-total">{fmt(total)}</span>
          </div>

          <div className="lu-co-divider" />

          {/* Fields */}
          <div className="lu-fg">
            <label className="lu-fl lu-fl--req">Full Name</label>
            <input
              ref={nameRef}
              className={`lu-fi${errors.name ? " lu-fi--err" : ""}`}
              type="text" placeholder="Your name"
              value={form.name} onChange={e => upd("name", e.target.value)}
              autoComplete="name"
            />
            {errors.name && <span className="lu-ferr">{errors.name}</span>}
          </div>

          <div className="lu-fg">
            <label className="lu-fl lu-fl--req">WhatsApp / Mobile</label>
            <div className="lu-phone-wrap">
              <input
                className={`lu-fi${errors.phone ? " lu-fi--err" : ""}`}
                type="tel" placeholder="01XXXXXXXXX"
                inputMode="numeric" maxLength={11}
                value={form.phone} onChange={e => upd("phone", e.target.value)}
                autoComplete="tel"
              />
              <span className="lu-phone-icon"><IconWA /></span>
            </div>
            {errors.phone && <span className="lu-ferr">{errors.phone}</span>}
          </div>

          <div className="lu-fg">
            <label className="lu-fl lu-fl--req">Delivery Address</label>
            <textarea
              className={`lu-fta${errors.address ? " lu-fi--err" : ""}`}
              placeholder="House, Road, Area, District"
              value={form.address} onChange={e => upd("address", e.target.value)}
              autoComplete="street-address" rows={3}
            />
            {errors.address && <span className="lu-ferr">{errors.address}</span>}
          </div>

          <div className="lu-fg">
            <label className="lu-fl">Note <span style={{fontWeight:400,opacity:.6}}>(optional)</span></label>
            <textarea
              className="lu-fta"
              placeholder="Any special request…"
              value={form.note} onChange={e => upd("note", e.target.value)}
              rows={2}
            />
          </div>

          {/* CTAs */}
          <button className="lu-co-submit" onClick={submit} disabled={status === "sending"}>
            {status === "sending" ? "Placing order…" : `Place Order — Pay ${fmt(total)} on Delivery`}
          </button>

          <a
            href={`https://wa.me/${STORE.whatsapp}?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            className="lu-co-wa"
          >
            <IconWA /> Order via WhatsApp instead
          </a>

          <div style={{ height: 32 }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════ */
export default function Beauty() {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [activeShadeIdx, setActiveShadeIdx] = useState(0);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [sheetStop, setSheetStop] = useState(STOPS.peek);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ripples, fireRipple] = useRipple();
  const [swatchRipple, setSwatchRipple] = useState(null);

  const shade = activeProduct.shades[activeShadeIdx];

  // Lock body scroll when checkout open
  useEffect(() => {
    document.body.style.overflow = checkoutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [checkoutOpen]);

  const handleShadeSelect = (idx, e) => {
    setActiveShadeIdx(idx);
    // Ripple on swatch
    const rect = e.currentTarget.getBoundingClientRect();
    setSwatchRipple({ idx, x: rect.width / 2, y: rect.height / 2 });
    setTimeout(() => setSwatchRipple(null), 500);
    // Pull sheet to detail so user sees the shade name
    if (sheetStop === STOPS.peek) setSheetStop(STOPS.detail);
  };

  const handleProductSwitch = (product) => {
    setActiveProduct(product);
    setActiveShadeIdx(0);
    setActiveImgIdx(0);
    setSheetStop(STOPS.peek);
  };

  const handleAddToBag = () => {
    if (sheetStop < STOPS.full) {
      setSheetStop(STOPS.full);
    } else {
      setCheckoutOpen(true);
    }
  };

  const handleBarCTA = () => {
    setCheckoutOpen(true);
  };

  const savePc = savePct(activeProduct);

  return (
    <div className="lu">

      {/* ═══════════════════════════════
          CANVAS — immersive product zone
      ═══════════════════════════════ */}
      <div className="lu-canvas">
        {/* Gradient background — transitions on shade change */}
        <div
          className="lu-canvas-grad"
          style={{ background: shade.grad }}
          aria-hidden="true"
        />

        {/* Product image */}
        <img
          src={activeProduct.imgs[activeImgIdx]}
          alt={activeProduct.name}
          className="lu-canvas-img"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          key={activeProduct.imgs[activeImgIdx]} // re-triggers fade on change
        />

        {/* Bottom canvas fade-out */}
        <div className="lu-canvas-fade" aria-hidden="true" />

        {/* NAV */}
        <nav className="lu-nav" aria-label="Top navigation">
          <span className="lu-nav-brand">{STORE.name}</span>
          <div className="lu-nav-actions">
            <a
              href={`https://wa.me/${STORE.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              className="lu-nav-pill lu-nav-pill--wa"
              aria-label="WhatsApp"
            >
              <IconWA />
            </a>
            <button
              className="lu-nav-pill"
              aria-label="Bag"
              onClick={() => setCheckoutOpen(true)}
            >
              <IconBag />
            </button>
          </div>
        </nav>

        {/* Product identity — floats at bottom of canvas */}
        <div className="lu-identity">
          <div className={`lu-badge lu-badge--${activeProduct.badgeTone}`}>
            {activeProduct.badge}
          </div>
          <h1 className="lu-identity-name">
            <em>{activeProduct.name.split(" ")[0]}</em>{" "}
            {activeProduct.name.split(" ").slice(1).join(" ")}
          </h1>
          <div className="lu-identity-sub">{activeProduct.category}</div>
        </div>

        {/* Image thumbnail strip — right rail */}
        <div className="lu-img-rail" role="group" aria-label="Product images">
          {activeProduct.imgs.map((src, i) => (
            <button
              key={i}
              className={`lu-img-thumb${i === activeImgIdx ? " lu-img-thumb--on" : ""}`}
              onClick={() => setActiveImgIdx(i)}
              aria-label={`Image ${i + 1}`}
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════
          BOTTOM SHEET
      ═══════════════════════════════ */}
      <BottomSheet
        stop={sheetStop}
        onStopChange={setSheetStop}
        checkoutOpen={checkoutOpen}
      >
        <div className="lu-sheet-scroll">

          {/* ── Price + Rating ── */}
          <div className="lu-price-row">
            <div className="lu-prices">
              <span className="lu-price">{fmt(activeProduct.price)}</span>
              <span className="lu-price-was">{fmt(activeProduct.was)}</span>
              {savePc > 0 && (
                <span className="lu-price-save">−{savePc}%</span>
              )}
            </div>
            <div className="lu-rating" aria-label={`${activeProduct.rating} stars`}>
              <div className="lu-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} style={{ opacity: i < Math.round(activeProduct.rating) ? 1 : 0.2 }} />
                ))}
              </div>
              <span className="lu-rating-txt">{activeProduct.rating} ({activeProduct.reviews.toLocaleString()})</span>
            </div>
          </div>

          {/* ── Tagline ── */}
          <p className="lu-tagline">"{activeProduct.tagline}"</p>

          {/* ── Shade Selector ── */}
          <div className="lu-shades" role="group" aria-label="Shade selector">
            <div className="lu-shades-header">
              <span className="lu-shades-lbl">Shade</span>
              <span className="lu-shades-chosen">{shade.name}</span>
            </div>
            <div className="lu-swatches">
              {activeProduct.shades.map((sh, i) => (
                <button
                  key={sh.name}
                  className={`lu-swatch${i === activeShadeIdx ? " lu-swatch--on" : ""}`}
                  style={{ "--sw-color": sh.hex }}
                  onClick={e => handleShadeSelect(i, e)}
                  aria-label={sh.name}
                  aria-pressed={i === activeShadeIdx}
                >
                  {swatchRipple?.idx === i && (
                    <span
                      className="lu-swatch-ripple"
                      style={{ left: swatchRipple.x, top: swatchRipple.y }}
                    />
                  )}
                  {i === activeShadeIdx && <span className="lu-swatch-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* ── Description ── */}
          <p className="lu-desc">{activeProduct.description}</p>

          {/* ── Key Benefits ── */}
          <div className="lu-benefits" role="list" aria-label="Key benefits">
            {activeProduct.benefits.map(b => (
              <span key={b} className="lu-benefit" role="listitem">{b}</span>
            ))}
          </div>

          {/* ── How to Use ── */}
          <div className="lu-section">
            <div className="lu-section-lbl">How to Use</div>
            <p className="lu-section-body">{activeProduct.howToUse}</p>
          </div>

          {/* ── Accordions ── */}
          <div className="lu-accordions">
            <Accordion icon="🧪" title="Full Ingredients">
              <p className="lu-acc-text">{activeProduct.ingredients}</p>
            </Accordion>
            <Accordion icon={<IconLeaf style={{ width:14, height:14, fill:"#5A8A5A" }} />} title="Sustainability Pledge">
              <div className="lu-sustain">
                {activeProduct.sustain.map(s => (
                  <div key={s.label} className="lu-sustain-item">
                    <span className="lu-sustain-icon">{s.icon}</span>
                    <span className="lu-sustain-lbl">{s.label}</span>
                  </div>
                ))}
              </div>
            </Accordion>
          </div>

          {/* ── Product Rail — switch products ── */}
          <div className="lu-rail">
            <div className="lu-rail-lbl">More from Lumière</div>
            <div className="lu-rail-track">
              {PRODUCTS.map(p => (
                <button
                  key={p.id}
                  className={`lu-rail-card${p.id === activeProduct.id ? " lu-rail-card--on" : ""}`}
                  onClick={() => handleProductSwitch(p)}
                  aria-label={p.name}
                  aria-pressed={p.id === activeProduct.id}
                >
                  <img src={p.imgs[0]} alt={p.name} loading="lazy" decoding="async" />
                  <div className="lu-rail-card-body">
                    <div className="lu-rail-card-name">{p.name}</div>
                    <div className="lu-rail-card-price">{fmt(p.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Spacer for sticky bar */}
          <div style={{ height: 88 }} />
        </div>

        {/* ── Sticky Add-to-Bag Bar ── */}
        <div className="lu-bar">
          <div className="lu-bar-inner">
            <button className="lu-bar-cta" onClick={handleBarCTA} aria-label="Proceed to checkout">
              <IconBag />
              Add to Bag — {fmt(activeProduct.price)}
            </button>
            <a
              href={`https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(`Hi! I want to order ${activeProduct.name} (${shade.name}). Cash on delivery please!`)}`}
              target="_blank" rel="noopener noreferrer"
              className="lu-bar-wa"
              aria-label="Order via WhatsApp"
            >
              <IconWA />
            </a>
          </div>
        </div>
      </BottomSheet>

      {/* ═══════════════════════════════
          CHECKOUT PANEL
      ═══════════════════════════════ */}
      <CheckoutPanel
        product={activeProduct}
        shade={shade}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
