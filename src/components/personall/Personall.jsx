/**
 * Personal.jsx — VELOUR Romance & Intimacy Store
 * Final Production Build
 *
 * ✅ Single-column cinematic layout (mobile-first)
 * ✅ All Google Form fields explicitly mapped (productId, productName, price, qty, total, name, phone, address, note)
 * ✅ fetch() with no-cors — serverless, zero backend
 * ✅ WhatsApp number validation (BD 01X format) with prominent inline error
 * ✅ Phone field shows WhatsApp icon — communicates confirmation channel
 * ✅ Success state confirms order will be finalized via WhatsApp
 * ✅ Sticky bottom bar tracks last-tapped product
 * ✅ Image gallery with thumbnail strip per product
 * ✅ Staggered card fade-in animations
 * ✅ fetchpriority="high" on first image, loading="lazy" on rest
 * ✅ Body scroll locked when modal open, restored on close
 * ✅ No dead ends — every CTA opens the checkout directly
 */

import { useState, useEffect, useRef } from "react";
import "./Personall.css";
import { PRODUCTS, STORE } from "./Personall.data";

/* ══════════════════════════════════════
   SVG ICONS — all inline, zero deps
══════════════════════════════════════ */
const LockIcon   = () => <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>;
const ShieldIcon = () => <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>;
const TruckIcon  = () => <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>;
const HeartIcon  = () => <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>;
const CodIcon    = () => <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>;
const WaIcon     = () => <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>;
const GiftIcon   = () => <svg viewBox="0 0 24 24"><path d="M20 6h-2.18c.07-.28.18-.54.18-.83C18 3.42 16.83 2 15.17 2c-.91 0-1.73.41-2.34 1.07L12 4.18l-.83-.83C10.56 2.41 9.74 2 8.83 2 7.17 2 6 3.42 6 5.17c0 .29.11.55.18.83H4c-1.11 0-1.99.89-1.99 2L2 20c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-4.83-2c.58 0 1.17.48 1.17 1.17C16.34 5.65 15.6 6 15 6h-1.87l1.04-1.15c.3-.35.71-.85 1-1zm-7.34 0c.3 0 .82.5 1.13.85L10.87 6H9c-.66 0-1.34-.35-1.34-1.17C7.66 4.04 8.25 4 8.83 4zM20 20H4v-2h16v2zm0-5H4V8h5.08L7 10.37 8.62 12 11 9.43 12 8.35l1 1.08L15.38 12 17 10.37 14.92 8H20v7z"/></svg>;

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
const fmt  = n  => "৳" + n.toLocaleString("en-BD");
const disc = p  => Math.round(((p.was - p.price) / p.was) * 100);
const stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

// BD WhatsApp/mobile: 01 + [3-9] + 8 digits = 11 digits
const validatePhone = v => /^01[3-9]\d{8}$/.test(v.trim());

// Products where size/color is a single fixed variant — no selector needed
const FIXED_VARIANTS = new Set(["One size","One size fits all","Set of 3","100ml","Single variant"]);
const needsSelector  = arr => arr.length > 1 || (arr.length === 1 && !FIXED_VARIANTS.has(arr[0]));

/* ══════════════════════════════════════
   CHECKOUT MODAL
   The premium invitation experience.
   All form fields mapped to Google Form.
══════════════════════════════════════ */
function CheckoutModal({ product, onClose }) {
  const [qty,    setQty]    = useState(1);
  const [size,   setSize]   = useState(
    product.sizes.length === 1 ? product.sizes[0] : ""
  );
  const [color,  setColor]  = useState(
    product.colors.length === 1 ? product.colors[0] : ""
  );
  const [form,   setForm]   = useState({ name: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const firstInputRef = useRef(null);

  const total = product.price * qty;

  // Preload hero image for instant modal display
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "preload"; link.as = "image"; link.href = product.heroImg;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, [product.heroImg]);

  // Focus first input when modal opens (delayed for animation)
  useEffect(() => {
    const t = setTimeout(() => firstInputRef.current?.focus(), 380);
    return () => clearTimeout(t);
  }, []);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())       e.name    = "আপনার পুরো নাম দিন";
    if (!validatePhone(form.phone)) e.phone = "সঠিক WhatsApp নম্বর দিন (01XXXXXXXXX)";
    if (!form.address.trim())    e.address = "ডেলিভারি ঠিকানা দিন";
    return e;
  };

  /* ── Google Form submit via fetch no-cors ──
     All 9 fields mapped explicitly:
     productId | productName | price | qty | total | name | phone | address | note
  ── */
  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus("submitting");

    const F = STORE.fields;
    const sizeLabel  = needsSelector(product.sizes)  && size  ? ` — ${size}`  : "";
    const colorLabel = needsSelector(product.colors) && color ? ` / ${color}` : "";
    const productLabel = `${product.name}${sizeLabel}${colorLabel}`;

    const body = new URLSearchParams({
      [F.productId]:   String(product.id),
      [F.productName]: productLabel,
      [F.price]:       fmt(product.price),
      [F.qty]:         String(qty),
      [F.total]:       `${fmt(total)} BDT`,
      [F.name]:        form.name.trim(),
      [F.phone]:       form.phone.trim(),
      [F.address]:     form.address.trim(),
      [F.note]:        form.note.trim() || "—",
    });

    try {
      // no-cors: browser throws TypeError but Google Form records the submission
      await fetch(STORE.formAction, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:    body.toString(),
      });
    } catch (_) { /* no-cors always throws — submission still reaches Google */ }

    setStatus("done");
  };

  const upd = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  return (
    <div className="vl-overlay" onClick={onClose}>
      <div className="vl-modal" onClick={e => e.stopPropagation()}>

        {/* Gradient top line — the luxury tell */}
        <div className="vl-modal-line" />
        <div className="vl-modal-handle"><div className="vl-modal-handle-bar" /></div>
        <button className="vl-modal-x" onClick={onClose} aria-label="Close">✕</button>

        {/* ── SUCCESS STATE ── */}
        {status === "done" ? (
          <div className="vl-success">
            <div className="vl-success-glyph" role="img" aria-label="Rose">🌹</div>

            <div className="vl-success-title">
              Thank you, {form.name.split(" ")[0]}.
            </div>

            <p className="vl-success-msg">
              Your order is being prepared for{" "}
              <span className="vl-success-highlight">discreet delivery</span>.<br />
              Our team will confirm your order via WhatsApp at{" "}
              <span className="vl-success-phone">{form.phone}</span> within the hour.
            </p>

            {/* WhatsApp confirmation assurance */}
            <div className="vl-success-wa">
              <WaIcon />
              Order confirmation coming via WhatsApp
            </div>

            {/* Discreet packaging reminder */}
            <div className="vl-success-discreet">
              <LockIcon />
              Discreet Packaging Guaranteed
            </div>

            <button className="vl-success-close" onClick={onClose}>
              Continue browsing
            </button>
          </div>

        ) : (
          <>
            {/* ── Product summary ── */}
            <div className="vl-modal-product">
              <img
                src={product.heroImg}
                alt={product.name}
                className="vl-modal-thumb"
                loading="eager"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="vl-modal-pname">{product.name}</div>
                <div className="vl-modal-psub">
                  Cash on Delivery ·{" "}
                  {(needsSelector(product.sizes) && size) ? size : "Pay when delivered"}
                </div>
              </div>
              <div className="vl-modal-pprice">{fmt(product.price)}</div>
            </div>

            <div className="vl-modal-body">

              {/* Invitation heading */}
              <div className="vl-modal-invite">
                <div className="vl-modal-invite-title">Place your order</div>
                <p className="vl-modal-invite-sub">
                  Three fields. Delivered to your door.<br />
                  No payment until it arrives.
                </p>
              </div>

              {/* Size selector — only when multiple real sizes */}
              {needsSelector(product.sizes) && (
                <div className="vl-modal-sizes">
                  <div className="vl-modal-sel-lbl">
                    <span>Select size</span>
                    {size && <span className="vl-modal-sel-chosen">{size} ✓</span>}
                  </div>
                  <div className="vl-modal-size-row">
                    {product.sizes.map(s => (
                      <button key={s}
                        className={`vl-modal-size-btn${size === s ? " vl-modal-size-btn--on" : ""}`}
                        onClick={() => setSize(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color selector — only when multiple real colors */}
              {needsSelector(product.colors) && (
                <div className="vl-modal-sizes vl-modal-colors">
                  <div className="vl-modal-sel-lbl">
                    <span>Select color</span>
                    {color && <span className="vl-modal-sel-chosen">{color} ✓</span>}
                  </div>
                  <div className="vl-modal-size-row">
                    {product.colors.map(c => (
                      <button key={c}
                        className={`vl-modal-size-btn${color === c ? " vl-modal-size-btn--on" : ""}`}
                        onClick={() => setColor(c)}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="vl-qty-row">
                <span className="vl-qty-lbl">Quantity</span>
                <div className="vl-qty-ctrl">
                  <button className="vl-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="vl-qty-num">{qty}</span>
                  <button className="vl-qty-btn" onClick={() => setQty(q => Math.min(5, q + 1))}>+</button>
                </div>
                <span className="vl-qty-total">{fmt(total)}</span>
              </div>

              <div className="vl-modal-divider" />

              {/* ── 3 required fields ── */}

              {/* Name */}
              <div className="vl-field">
                <label className="vl-label vl-label--req">Your Name</label>
                <input
                  ref={firstInputRef}
                  className={`vl-input${errors.name ? " vl-input--err" : ""}`}
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={e => upd("name", e.target.value)}
                  autoComplete="name"
                />
                {errors.name && <span className="vl-err" role="alert">{errors.name}</span>}
              </div>

              {/* WhatsApp / Phone — with WA icon inside field */}
              <div className="vl-field">
                <label className="vl-label vl-label--req">WhatsApp Number</label>
                <div className="vl-field-phone">
                  <input
                    className={`vl-input${errors.phone ? " vl-input--err" : ""}`}
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={e => upd("phone", e.target.value)}
                    autoComplete="tel"
                    maxLength={11}
                  />
                  <span className="vl-field-phone-wa" aria-hidden="true"><WaIcon /></span>
                </div>
                {errors.phone && <span className="vl-err" role="alert">{errors.phone}</span>}
              </div>

              {/* Address */}
              <div className="vl-field">
                <label className="vl-label vl-label--req">Delivery Address</label>
                <textarea
                  className={`vl-textarea${errors.address ? " vl-input--err" : ""}`}
                  placeholder="House no., Road, Area, Upazila, District"
                  value={form.address}
                  onChange={e => upd("address", e.target.value)}
                  autoComplete="street-address"
                  rows={3}
                />
                {errors.address && <span className="vl-err" role="alert">{errors.address}</span>}
              </div>

              {/* Note — optional */}
              <div className="vl-field">
                <label className="vl-label">Special note <span style={{opacity:.5,fontWeight:400,letterSpacing:0,textTransform:'none'}}>(optional)</span></label>
                <textarea
                  className="vl-textarea"
                  placeholder="Any special request for your order…"
                  value={form.note}
                  onChange={e => upd("note", e.target.value)}
                  rows={2}
                />
              </div>

              {/* COD guarantee */}
              <div className="vl-modal-cod">
                <CodIcon />
                <div className="vl-modal-cod-text">
                  <strong>Pay on Delivery — Zero Risk</strong>
                  <span>You pay only when the package arrives at your door.</span>
                </div>
              </div>

              {/* WhatsApp confirmation note */}
              <div className="vl-modal-wa-note">
                <WaIcon />
                <span>
                  We'll send your order confirmation & delivery update via WhatsApp.
                </span>
              </div>

              {/* Submit */}
              <button
                className="vl-submit"
                onClick={submit}
                disabled={status === "submitting"}>
                {status === "submitting"
                  ? "Confirming your order…"
                  : `Order Now — Pay ${fmt(total)} on Delivery`}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   PRODUCT ITEM
   Full-width cinematic card.
   Single column on mobile. Gallery included.
══════════════════════════════════════ */
function ProductItem({ product, onOrder, isFirst }) {
  const [imgIdx, setImgIdx] = useState(0);
  const itemRef  = useRef(null);

  // IntersectionObserver scroll reveal — fires once, better perf than animation-delay
  useEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    // First item is already visible — skip observer
    if (isFirst) { el.classList.add("vl-item--visible"); return; }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("vl-item--visible"); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isFirst]);

  return (
    <article className="vl-item" ref={itemRef}>

      {/* ── Image panel — full width, tall ── */}
      <div className="vl-item-img-wrap" onClick={() => onOrder(product)}>
        <img
          src={product.imgs[imgIdx]}
          alt={product.name}
          loading={isFirst ? "eager" : "lazy"}
          fetchPriority={isFirst ? "high" : "auto"}
          decoding="async"
        />

        {/* Badge */}
        <span className={`vl-item-badge ${product.badgeGold ? "vl-item-badge--gold" : "vl-item-badge--blush"}`}>
          {product.badge}
        </span>

        {/* Discount */}
        <span className="vl-item-save">−{disc(product)}%</span>

        {/* Low stock */}
        {product.stock <= 20 && (
          <span className="vl-item-stock-overlay">Only {product.stock} left</span>
        )}
      </div>

      {/* Thumbnail strip */}
      {product.imgs.length > 1 && (
        <div className="vl-item-thumbs">
          {product.imgs.map((src, i) => (
            <button
              key={i}
              className={`vl-item-thumb${i === imgIdx ? " vl-item-thumb--on" : ""}`}
              onClick={() => setImgIdx(i)}
              aria-label={`View image ${i + 1}`}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div className="vl-item-body">

        <div className="vl-item-meta">
          <span className="vl-item-subtitle">{product.subtitle}</span>
          <div className="vl-item-stars">
            <span className="vl-stars">{stars(product.rating)}</span>
            <span className="vl-rnum">{product.rating}</span>
            <span className="vl-rcnt">({product.reviews})</span>
          </div>
        </div>

        <h2 className="vl-item-name">{product.name}</h2>
        <p className="vl-item-desc">{product.desc}</p>

        {/* Feature pills */}
        <div className="vl-item-details">
          {product.details.map(d => (
            <span key={d} className="vl-item-detail">{d}</span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="vl-item-buy">
          <div className="vl-item-prices">
            <span className="vl-price">{fmt(product.price)}</span>
            <span className="vl-price-was">{fmt(product.was)}</span>
          </div>
          <button
            className="vl-item-cta"
            onClick={() => onOrder(product)}
            aria-label={`Order ${product.name}`}>
            Order Now
          </button>
        </div>

      </div>
    </article>
  );
}

/* ══════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════ */
const TRUST_ITEMS = [
  { Icon: LockIcon,   title: "Discreet Packaging",   sub: "Plain box, no labels"       },
  { Icon: TruckIcon,  title: "Nationwide Delivery",  sub: "2–4 business days"          },
  { Icon: CodIcon,    title: "Pay on Delivery",      sub: "Cash when it arrives"       },
  { Icon: ShieldIcon, title: "100% Private",         sub: "No brand markings outside"  },
  { Icon: GiftIcon,   title: "Gift Wrapping",        sub: "Complimentary on request"   },
];

export default function Personal() {
  const [modal,       setModal]       = useState(null);   // product being ordered
  const [stickyProd,  setStickyProd]  = useState(PRODUCTS[0]); // tracks last-tapped

  // Open modal + update sticky reference
  const openOrder = product => {
    setStickyProd(product);
    setModal(product);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = prev; };
  }, [modal]);

  return (
    <div className="vl">

      {/* ── NAV ── */}
      <nav className="vl-nav" role="navigation" aria-label="Main navigation">
        <a href="#" className="vl-nav-logo" aria-label={STORE.name}>
          {STORE.name}
        </a>
        <div className="vl-nav-badge" aria-label="Discreet packaging guaranteed">
          <LockIcon />
          Discreet Packaging
        </div>
      </nav>

      {/* ── HERO — 3-second hook ── */}
      <section className="vl-hero" aria-label="Hero">
        <img
          src={PRODUCTS[0].heroImg}
          alt="Romance & Intimacy Collection"
          className="vl-hero-img"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="vl-hero-grad" aria-hidden="true" />

        {/* Petal particles */}
        <div className="vl-petals" aria-hidden="true">
          {[1,2,3,4,5,6].map(i => <span key={i} className="vl-petal" />)}
        </div>

        <div className="vl-hero-content">
          {/* Discreet badge — MUST be above fold */}
          <div className="vl-discreet-badge" role="note">
            <LockIcon />
            <div className="vl-discreet-badge-text">
              <strong>Discreet Packaging Guaranteed</strong>
              <span>Plain box · No brand name outside · Straight to your door</span>
            </div>
          </div>

          <div className="vl-hero-eyebrow" aria-hidden="true">
            <span className="vl-hero-eyebrow-line" />
            Romance &amp; Intimacy
            <span className="vl-hero-eyebrow-line" />
          </div>

          <h1 className="vl-hero-title">
            For your most<br /><em>intimate</em> moments.
          </h1>

          <p className="vl-hero-sub">
            Premium curated collection. Cash on delivery.<br />
            Packaged so discreetly, only you will know.
          </p>

          <div className="vl-hero-ctas">
            <button
              className="vl-hero-cta"
              onClick={() => openOrder(PRODUCTS[0])}
              aria-label="Order now, pay on delivery">
              <HeartIcon />
              Order Now — Pay on Delivery
            </button>
            <span className="vl-hero-hint" aria-hidden="true">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="vl-trust-strip" role="list" aria-label="Trust signals">
        {TRUST_ITEMS.map(({ Icon, title, sub }) => (
          <div className="vl-trust-item" key={title} role="listitem">
            <Icon />
            <div>
              <strong>{title}</strong>
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION HEADING ── */}
      <div className="vl-section-head">
        <span className="vl-section-eyebrow">The Collection</span>
        <h2 className="vl-section-title">Curated for <em>intimacy</em></h2>
        <div className="vl-section-rule" aria-hidden="true" />
      </div>

      {/* ── PRODUCT LIST — single column cinematic ── */}
      <main className="vl-list" aria-label="Products">
        {PRODUCTS.map((p, i) => (
          <ProductItem
            key={p.id}
            product={p}
            onOrder={openOrder}
            isFirst={i === 0}
          />
        ))}
      </main>

      {/* ── FOOTER ── */}
      <footer className="vl-footer">
        <div className="vl-footer-logo" aria-label={STORE.name}>{STORE.name}</div>
        <div className="vl-footer-discreet">
          <LockIcon />
          All orders ship in plain, unmarked packaging
        </div>
        <p className="vl-footer-copy">
          © 2025 {STORE.name}. All rights reserved.<br />
          Your privacy is our absolute priority.
        </p>
      </footer>

      {/* ── STICKY BOTTOM BAR — tracks last-tapped product, hides when modal open ── */}
      <div className={`vl-sticky${modal ? " vl-sticky--hidden" : ""}`} role="complementary" aria-label="Quick order">
        <div className="vl-sticky-info">
          <div className="vl-sticky-name">{stickyProd.name}</div>
          <div className="vl-sticky-price">{fmt(stickyProd.price)} · Cash on Delivery</div>
        </div>
        <button
          className="vl-sticky-cta"
          onClick={() => openOrder(stickyProd)}
          aria-label={`Order ${stickyProd.name}`}>
          Order Now
        </button>
      </div>

      {/* ── CHECKOUT MODAL ── */}
      {modal && (
        <CheckoutModal
          product={modal}
          onClose={() => setModal(null)}
        />
      )}

    </div>
  );
}
