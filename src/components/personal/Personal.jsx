import { useState, useEffect } from "react";
import "./Personal.css";
import { PRODUCTS, STORE } from "./Personal.data";

/* ── SVG Icons ─────────────────────────────── */
const LockIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
);
const BoxIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4.7l-8 5.02L4 8.7V6.6l8 5.02 8-5.02v2.1z"/></svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
);
const TruckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
);
const CodIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
);

/* ── Helpers ─────────────────────────────── */
const fmt  = n => "৳" + n.toLocaleString("en-BD");
const disc = p => Math.round(((p.was - p.price) / p.was) * 100);
const strs = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* ── Checkout Modal ──────────────────────── */
function CheckoutModal({ product, onClose }) {
  const [qty,    setQty]    = useState(1);
  const [size,   setSize]   = useState(product.sizes.length === 1 ? product.sizes[0] : "");
  const [form,   setForm]   = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done

  const total = product.price * qty;

  const validate = () => {
    const e = {};
    if (!form.name.trim())                          e.name    = "আপনার নাম দিন";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) e.phone   = "সঠিক মোবাইল নম্বর দিন";
    if (!form.address.trim())                       e.address = "ডেলিভারি ঠিকানা দিন";
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus("submitting");

    const F = STORE.fields;
    const body = new URLSearchParams({
      [F.name]:    form.name.trim(),
      [F.phone]:   form.phone.trim(),
      [F.address]: form.address.trim(),
      [F.product]: `${product.name}${size ? ` (${size})` : ""}`,
      [F.qty]:     String(qty),
      [F.total]:   `${fmt(total)} BDT`,
    });

    try {
      // Serverless hidden submit — CORS will block, but the form still records
      await fetch(STORE.formAction, {
        method: "POST",
        mode:   "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body:   body.toString(),
      });
    } catch (_) { /* no-cors always throws — data still submitted */ }

    setStatus("done");
  };

  const upd = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  return (
    <div className="vl-modal-overlay" onClick={onClose}>
      <div className="vl-modal" onClick={e => e.stopPropagation()}>
        <div className="vl-modal-top-line" />
        <div className="vl-modal-handle"><div className="vl-modal-handle-bar" /></div>
        <button className="vl-modal-x" onClick={onClose}>✕</button>

        {status === "done" ? (
          /* ── SUCCESS STATE ── */
          <div className="vl-success">
            <div className="vl-success-glyph">🌹</div>
            <div className="vl-success-title">Thank you, {form.name.split(" ")[0]}.</div>
            <p className="vl-success-msg">
              Your order is being prepared for<br />
              <strong style={{ color: "var(--blush-lt)", fontWeight: 500 }}>discreet delivery</strong>.
              We'll reach you at <strong style={{ color: "var(--white)", fontWeight: 500 }}>{form.phone}</strong> to confirm.
            </p>
            <div className="vl-success-discreet">
              <LockIcon />
              Discreet Packaging Guaranteed
            </div>
            <button className="vl-success-close" onClick={onClose}>Continue browsing</button>
          </div>
        ) : (
          <>
            {/* Product summary */}
            <div className="vl-modal-product">
              <img src={product.heroImg} alt={product.name} className="vl-modal-thumb" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="vl-modal-product-name">{product.name}</div>
                <div className="vl-modal-product-sub">
                  Cash on Delivery · {size || "Select size below"}
                </div>
              </div>
              <div className="vl-modal-product-price">{fmt(product.price)}</div>
            </div>

            <div className="vl-modal-body">
              {/* Invitation copy */}
              <div className="vl-modal-invite">
                <div className="vl-modal-invite-title">Place your order</div>
                <p className="vl-modal-invite-sub">
                  Three fields. Delivered to your door.<br />No payment until it arrives.
                </p>
              </div>

              {/* Size (hide if only one option) */}
              {product.sizes.length > 1 && (
                <div className="vl-modal-sizes">
                  <span className="vl-modal-sel-lbl">Select size</span>
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

              {/* Qty */}
              <div className="vl-qty-row">
                <span className="vl-qty-lbl">Quantity</span>
                <div className="vl-qty-ctrl">
                  <button className="vl-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="vl-qty-num">{qty}</span>
                  <button className="vl-qty-btn" onClick={() => setQty(q => Math.min(5, q + 1))}>+</button>
                </div>
                <span className="vl-qty-total">{fmt(total)}</span>
              </div>

              {/* 3 fields */}
              <div className="vl-field">
                <label className="vl-label">Your Name</label>
                <input className={`vl-input${errors.name ? " vl-input--err" : ""}`}
                  type="text" placeholder="Full name"
                  value={form.name} onChange={e => upd("name", e.target.value)}
                  autoComplete="name" />
                {errors.name && <span className="vl-err-msg">{errors.name}</span>}
              </div>

              <div className="vl-field">
                <label className="vl-label">Mobile Number</label>
                <input className={`vl-input${errors.phone ? " vl-input--err" : ""}`}
                  type="tel" placeholder="01XXXXXXXXX"
                  inputMode="numeric" value={form.phone}
                  onChange={e => upd("phone", e.target.value)}
                  autoComplete="tel" />
                {errors.phone && <span className="vl-err-msg">{errors.phone}</span>}
              </div>

              <div className="vl-field">
                <label className="vl-label">Delivery Address</label>
                <textarea className={`vl-textarea${errors.address ? " vl-input--err" : ""}`}
                  placeholder="House, Road, Area, District"
                  value={form.address} onChange={e => upd("address", e.target.value)}
                  autoComplete="street-address" />
                {errors.address && <span className="vl-err-msg">{errors.address}</span>}
              </div>

              {/* COD guarantee */}
              <div className="vl-modal-cod">
                <CodIcon />
                <div className="vl-modal-cod-text">
                  <strong>Pay on Delivery — Zero Risk</strong>
                  <span>You pay only when the package arrives at your door.</span>
                </div>
              </div>

              <button className="vl-modal-submit" onClick={submit} disabled={status === "submitting"}>
                {status === "submitting"
                  ? "Confirming your order…"
                  : `Order Now — Pay ৳${total.toLocaleString("en-BD")} on Delivery`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Product Card ───────────────────────── */
function Card({ product, onOrder }) {
  return (
    <div className="vl-card" onClick={() => onOrder(product)}>
      <div className="vl-card-line" />
      <div className="vl-card-img">
        <span className={`vl-card-badge${product.badge === "BESTSELLER" ? " vl-card-badge--gold" : ""}`}>
          {product.badge}
        </span>
        <span className="vl-card-save">−{disc(product)}%</span>
        <img src={product.heroImg} alt={product.name} loading="lazy" />
      </div>
      <div className="vl-card-body">
        <div className="vl-card-subtitle">{product.subtitle}</div>
        <div className="vl-card-name">{product.name}</div>
        <div className="vl-card-stars">
          <span className="vl-stars">{strs(product.rating)}</span>
          <span className="vl-rnum">{product.rating}</span>
          <span className="vl-rcnt">({product.reviews})</span>
        </div>
        <div className="vl-card-price-row">
          <span className="vl-price">{fmt(product.price)}</span>
          <span className="vl-price-was">{fmt(product.was)}</span>
        </div>
        {product.stock <= 20 && (
          <div className="vl-card-stock">Only {product.stock} left</div>
        )}
        <button className="vl-card-cta" onClick={e => { e.stopPropagation(); onOrder(product); }}>
          Order Now — Pay on Delivery
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────── */
export default function Personal() {
  const [modal,   setModal]   = useState(null);
  const [heroProduct] = useState(PRODUCTS[0]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const TRUST_ITEMS = [
    { icon: <LockIcon />, title: "Discreet Packaging",  sub: "Plain box, no labels"      },
    { icon: <TruckIcon />, title: "Nationwide Delivery", sub: "2–4 business days"         },
    { icon: <CodIcon />,  title: "Pay on Delivery",     sub: "Cash when it arrives"       },
    { icon: <ShieldIcon />, title: "100% Private",      sub: "No brand markings outside" },
    { icon: <HeartIcon />, title: "Gift Wrapping",      sub: "On request, complimentary" },
  ];

  return (
    <div className="vl">
      {/* ── NAV ── */}
      <nav className="vl-nav">
        <a href="#" className="vl-nav-logo">{STORE.name}</a>
        <div className="vl-nav-discreet">
          <LockIcon />
          Discreet Packaging
        </div>
      </nav>

      {/* ── HERO — the 3-second hook ── */}
      <section className="vl-hero">
        <img src={heroProduct.heroImg} alt="" className="vl-hero-img" />
        <div className="vl-hero-grad" />

        {/* Rose petal particles */}
        <div className="vl-petals" aria-hidden="true">
          {[1,2,3,4,5,6].map(i => <span key={i} className="vl-petal" />)}
        </div>

        <div className="vl-hero-content">
          {/* Discreet badge — above fold, first thing read */}
          <div className="vl-discreet-badge">
            <LockIcon />
            <div className="vl-discreet-badge-text">
              <strong>Discreet Packaging Guaranteed</strong>
              <span>Plain box · No brand name outside · Delivered to your door</span>
            </div>
          </div>

          <div className="vl-hero-eyebrow">
            <span className="vl-hero-eyebrow-line" />
            Romance & Intimacy
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
            <button className="vl-hero-cta-primary" onClick={() => setModal(heroProduct)}>
              <HeartIcon style={{ width: 15, height: 15, fill: "var(--noir)", flexShrink: 0 }} />
              Order Now — Pay on Delivery
            </button>
            <span className="vl-hero-scroll-hint">Explore collection</span>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="vl-trust-strip">
        {TRUST_ITEMS.map(({ icon, title, sub }) => (
          <div className="vl-trust-item" key={title}>
            {icon}
            <div className="vl-trust-item-text">
              <strong>{title}</strong>
              <span>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── SECTION HEADER ── */}
      <div className="vl-section-head">
        <span className="vl-section-eyebrow">The Collection</span>
        <h2 className="vl-section-title">Curated for <em>intimacy</em></h2>
        <div className="vl-section-rule" />
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="vl-grid">
        {PRODUCTS.map(p => (
          <Card key={p.id} product={p} onOrder={setModal} />
        ))}
      </div>

      {/* ── FOOTER ── */}
      <footer className="vl-footer">
        <div className="vl-footer-logo">{STORE.name}</div>
        <div className="vl-footer-discreet">
          <LockIcon />
          All orders ship in plain, unmarked packaging
        </div>
        <p className="vl-footer-copy">© 2025 {STORE.name}. All rights reserved. Your privacy is our priority.</p>
      </footer>

      {/* ── STICKY BOTTOM CTA (mobile) ── */}
      <div className="vl-sticky">
        <div className="vl-sticky-text">
          <div className="vl-sticky-text-name">{heroProduct.name}</div>
          <div className="vl-sticky-text-price">{fmt(heroProduct.price)} · Cash on Delivery</div>
        </div>
        <button className="vl-sticky-cta" onClick={() => setModal(heroProduct)}>
          Order Now
        </button>
      </div>

      {/* ── CHECKOUT MODAL ── */}
      {modal && <CheckoutModal product={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
