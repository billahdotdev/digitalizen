import { useState, useCallback, useRef } from "react";
import "./Beauty.css";
import { PRODUCTS, FORM_CONFIG } from "./Beauty.data";

/* ─── Helpers ─────────────────────────────────────── */
const fmt = (n) => "৳" + n.toLocaleString("en-BD");
const save = (p) => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* ─── Sub-components ──────────────────────────────── */
function Stars({ rating, reviews }) {
  return (
    <div className="bty-card-rating">
      <span className="bty-stars">{stars(rating)}</span>
      <span className="bty-rating-num">{rating}</span>
      <span className="bty-rating-cnt">({reviews})</span>
    </div>
  );
}

/* Image gallery with zoom + thumbnails */
function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMainClick = (e) => {
    if (!zoomed) {
      setZoomed(true);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const prev = (e) => {
    e.stopPropagation();
    setZoomed(false);
    setActive((a) => (a - 1 + images.length) % images.length);
  };
  const next = (e) => {
    e.stopPropagation();
    setZoomed(false);
    setActive((a) => (a + 1) % images.length);
  };

  return (
    <div className="bty-gallery">
      <div
        className="bty-gallery-main"
        onClick={handleMainClick}
        style={
          zoomed
            ? { cursor: "zoom-out" }
            : { cursor: "zoom-in" }
        }
      >
        <img
          src={images[active]}
          alt=""
          className="bty-gallery-img"
          style={
            zoomed
              ? {
                  transform: `scale(2) translate(${(50 - zoomPos.x) * 0.5}%, ${(50 - zoomPos.y) * 0.5}%)`,
                  transition: "transform .2s ease",
                }
              : {}
          }
          draggable={false}
        />
        {!zoomed && (
          <span className="bty-gallery-zoom-hint">🔍 Click to zoom</span>
        )}
        <button className="bty-gallery-nav bty-gallery-nav--prev" onClick={prev}>‹</button>
        <button className="bty-gallery-nav bty-gallery-nav--next" onClick={next}>›</button>
      </div>

      {/* Thumbnails */}
      <div className="bty-gallery-dots" style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {images.map((src, i) => (
          <button
            key={i}
            className={`bty-gallery-thumb${i === active ? " bty-gallery-thumb--active" : ""}`}
            onClick={() => { setActive(i); setZoomed(false); }}
          >
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* Product detail modal */
function ProductModal({ product, onClose, onBuy }) {
  if (!product) return null;

  return (
    <div className="bty-modal-overlay" onClick={onClose}>
      <div className="bty-modal" onClick={(e) => e.stopPropagation()}>
        <div className="bty-modal-close">
          <button className="bty-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <Gallery images={product.images} />

        <div className="bty-modal-info">
          <div className="bty-modal-cat">{product.category}</div>
          <div className="bty-modal-name">{product.name}</div>
          <div className="bty-modal-tagline">{product.tagline}</div>

          <div className="bty-modal-rating-row">
            <span className="bty-stars">{stars(product.rating)}</span>
            <span className="bty-rating-num">{product.rating}</span>
            <span className="bty-rating-cnt">({product.reviews} reviews)</span>
          </div>

          <div className="bty-modal-price-row">
            <span className="bty-modal-price">{fmt(product.price)}</span>
            <span className="bty-modal-orig">{fmt(product.originalPrice)}</span>
            <span className="bty-modal-save">Save {save(product)}%</span>
          </div>

          <div className="bty-modal-meta">
            <span className="bty-meta-chip">📦 <strong>{product.volume}</strong></span>
            {product.shade && (
              <span className="bty-meta-chip">🎨 <strong>{product.shade}</strong></span>
            )}
            <span className="bty-meta-chip">✅ Cash on Delivery</span>
          </div>

          <p className="bty-modal-desc">{product.description}</p>

          <ul className="bty-highlights">
            {product.highlights.map((h, i) => (
              <li key={i}>
                <span className="bty-hl-dot" />
                {h}
              </li>
            ))}
          </ul>

          <div className="bty-modal-buy-row">
            <button
              className="bty-modal-buy"
              onClick={() => { onClose(); onBuy(product); }}
            >
              🛒 Order Now — {fmt(product.price)}
            </button>
            <button className="bty-modal-details-btn" onClick={onClose}>← Back</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Order Drawer ────────────────────────────────── */
function OrderDrawer({ product, onClose }) {
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | done
  const iframeRef = useRef(null);

  if (!product) return null;
  const total = product.price * qty;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "নাম দিন";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) e.phone = "সঠিক নম্বর দিন";
    if (!form.address.trim()) e.address = "ঠিকানা দিন";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setStatus("submitting");

    // Build form URL for hidden iframe submit (no redirect, no CORS)
    const params = new URLSearchParams({
      [FORM_CONFIG.fields.name]:     form.name.trim(),
      [FORM_CONFIG.fields.phone]:    form.phone.trim(),
      [FORM_CONFIG.fields.address]:  form.address.trim(),
      [FORM_CONFIG.fields.product]:  `${product.name} (${product.shade || product.volume})`,
      [FORM_CONFIG.fields.quantity]: String(qty),
      [FORM_CONFIG.fields.total]:    `${fmt(total)} BDT`,
      [FORM_CONFIG.fields.note]:     form.note.trim(),
    });

    // Inject hidden form + iframe trick — fully serverless
    const formEl = document.createElement("form");
    formEl.method = "POST";
    formEl.action = FORM_CONFIG.action;
    formEl.target = "hidden-submit-iframe";
    formEl.style.display = "none";

    params.forEach((val, key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = val;
      formEl.appendChild(input);
    });

    document.body.appendChild(formEl);
    formEl.submit();
    setTimeout(() => {
      document.body.removeChild(formEl);
      setStatus("done");
    }, 1200);
  };

  const field = (key, label, placeholder, type = "text") => (
    <div className="bty-form-group">
      <label className="bty-form-label">{label} {errors[key] && <span style={{ color: "var(--rose)" }}>— {errors[key]}</span>}</label>
      <input
        className="bty-form-input"
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
        style={errors[key] ? { borderColor: "var(--rose)" } : {}}
      />
    </div>
  );

  return (
    <div className="bty-order-overlay" onClick={onClose}>
      {/* hidden iframe target for Google Form submit */}
      <iframe name="hidden-submit-iframe" ref={iframeRef} style={{ display: "none" }} title="form-target" />

      <div className="bty-order-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="bty-order-head">
          <span className="bty-order-title">
            {status === "done" ? "Order Placed! 🎉" : "Place Your Order"}
          </span>
          <button className="bty-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {status === "done" ? (
          <div className="bty-success">
            <div className="bty-success-icon">✓</div>
            <div className="bty-success-title">অর্ডার কনফার্ম হয়েছে!</div>
            <p className="bty-success-msg">
              ধন্যবাদ <strong>{form.name}</strong>! আপনার অর্ডার পাওয়া গেছে।<br />
              আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে ✨<br />
              <span style={{ fontSize: ".8rem", color: "var(--rose)", fontWeight: 600 }}>
                ডেলিভারির সময় ক্যাশ পেমেন্ট করুন 💰
              </span>
            </p>
            <button className="bty-success-close" onClick={onClose}>কেনাকাটা চালিয়ে যান →</button>
          </div>
        ) : (
          <div className="bty-order-body">
            {/* Summary */}
            <div className="bty-order-summary">
              <img src={product.images[0]} alt={product.name} className="bty-order-summary-img" />
              <div className="bty-order-summary-info">
                <div className="bty-order-summary-name">{product.name}</div>
                <div className="bty-order-summary-sub">
                  {product.shade || product.volume} · {product.category}
                </div>
              </div>
              <div className="bty-order-summary-price">{fmt(product.price)}</div>
            </div>

            {/* Quantity */}
            <div className="bty-qty-row">
              <span className="bty-qty-label">পরিমাণ:</span>
              <div className="bty-qty-ctrl">
                <button className="bty-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="bty-qty-num">{qty}</span>
                <button className="bty-qty-btn" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
              <span className="bty-qty-total">মোট: {fmt(total)}</span>
            </div>

            {/* COD badge */}
            <div className="bty-cod-badge">
              <span className="bty-cod-icon">💵</span>
              <div className="bty-cod-text">
                <strong>ক্যাশ অন ডেলিভারি</strong>
                <span>পণ্য পেলে টাকা দিন — আগে কোনো পেমেন্ট নেই</span>
              </div>
            </div>

            {/* Form */}
            {field("name", "আপনার নাম *", "যেমন: রাহেলা খানম")}
            {field("phone", "মোবাইল নম্বর *", "01XXXXXXXXX", "tel")}
            {field("address", "ডেলিভারি ঠিকানা *", "বাড়ি, রাস্তা, এলাকা, জেলা")}

            <div className="bty-form-group">
              <label className="bty-form-label">বিশেষ নোট (ঐচ্ছিক)</label>
              <textarea
                className="bty-form-textarea"
                placeholder="কোনো বিশেষ নির্দেশনা থাকলে লিখুন..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button
              className="bty-order-submit"
              onClick={handleSubmit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>⏳ সাবমিট হচ্ছে...</>
              ) : (
                <>✓ অর্ডার কনফার্ম করুন — {fmt(total)}</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Product Card ────────────────────────────────── */
function ProductCard({ product, onView, onBuy }) {
  return (
    <div className="bty-card" onClick={() => onView(product)}>
      <div className="bty-card-img-wrap">
        <span
          className="bty-card-badge"
          style={{ background: product.badgeColor }}
        >
          {product.badge}
        </span>
        <img
          src={product.images[0]}
          alt={product.name}
          className="bty-card-img"
          loading="lazy"
        />
        <button
          className="bty-card-quick"
          onClick={(e) => { e.stopPropagation(); onView(product); }}
          title="Quick View"
        >
          👁
        </button>
      </div>

      <div className="bty-card-body">
        <div className="bty-card-cat">{product.category}</div>
        <div className="bty-card-name">{product.name}</div>
        <div className="bty-card-tagline">{product.tagline}</div>
        <Stars rating={product.rating} reviews={product.reviews} />

        <div className="bty-card-footer">
          <div>
            <div className="bty-price-group">
              <span className="bty-price">{fmt(product.price)}</span>
              <span className="bty-price-orig">{fmt(product.originalPrice)}</span>
            </div>
            <span className="bty-price-save">Save {save(product)}%</span>
          </div>
          <button
            className="bty-card-buy"
            onClick={(e) => { e.stopPropagation(); onBuy(product); }}
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────── */
const CATEGORIES = ["All", "Lips", "Skincare", "Face", "Eyes", "Body"];

export default function Beauty() {
  const [activeTab, setActiveTab] = useState("All");
  const [viewProduct, setViewProduct] = useState(null);
  const [orderProduct, setOrderProduct] = useState(null);

  const filtered = activeTab === "All"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeTab);

  const scrollToProducts = () => {
    document.getElementById("bty-products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bty-page">
      {/* NAV */}
      <nav className="bty-nav">
        <a href="#" className="bty-nav-logo">
          <span className="bty-nav-logo-mark">Lumière</span>
          <span className="bty-nav-logo-dot" />
        </a>
        <div className="bty-nav-right">
          <span className="bty-nav-tag">🚚 Free Delivery</span>
          <button className="bty-nav-cta" onClick={scrollToProducts}>Shop Now</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="bty-hero">
        <div className="bty-hero-noise" />
        <div className="bty-hero-glow" />
        <div className="bty-hero-inner">
          <div className="bty-hero-eyebrow">New Collection 2025</div>
          <h1 className="bty-hero-title">
            Beauty That<br /><em>Speaks</em> For You
          </h1>
          <p className="bty-hero-sub">
            Curated cosmetics. Dermatologist approved.<br />
            <strong>Delivered to your door. Pay only when it arrives.</strong>
          </p>
          <div className="bty-hero-actions">
            <button className="bty-btn-hero" onClick={scrollToProducts}>
              Explore Collection ↓
            </button>
          </div>
          <div className="bty-hero-trust">
            <span>💅 Premium Quality</span>
            <span>✅ 100% Authentic</span>
            <span>💵 Cash on Delivery</span>
            <span>🚚 Dhaka + Nationwide</span>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="bty-trust-bar">
        {[
          { icon: "🚚", strong: "Free Delivery", sub: "Orders over ৳999" },
          { icon: "💵", strong: "Cash on Delivery", sub: "Pay when you get it" },
          { icon: "✅", strong: "100% Original", sub: "Authenticity guaranteed" },
          { icon: "🔄", strong: "Easy Returns", sub: "7-day hassle-free" },
        ].map((t) => (
          <div className="bty-trust-item" key={t.strong}>
            <div className="bty-trust-icon">{t.icon}</div>
            <div className="bty-trust-text">
              <strong>{t.strong}</strong>
              <span>{t.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <div id="bty-products">
        <div className="bty-section-header">
          <span className="bty-section-label">Our Products</span>
          <h2 className="bty-section-title">Discover Your Glow</h2>
        </div>

        {/* Category Tabs */}
        <div className="bty-tabs-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`bty-tab${activeTab === cat ? " bty-tab--active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="bty-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={setViewProduct}
              onBuy={setOrderProduct}
            />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bty-footer">
        <div className="bty-footer-inner">
          <span className="bty-footer-brand">Lumière Beauty</span>
          <span className="bty-footer-copy">© 2025 · All rights reserved</span>
        </div>
        <div className="bty-footer-note">
          🔒 Secure ordering · Cash on Delivery only · No advance payment required
        </div>
      </footer>

      {/* MODALS */}
      {viewProduct && (
        <ProductModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onBuy={(p) => { setViewProduct(null); setOrderProduct(p); }}
        />
      )}

      {orderProduct && (
        <OrderDrawer
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
        />
      )}
    </div>
  );
}
