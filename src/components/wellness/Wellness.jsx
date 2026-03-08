import { useState, useEffect, useCallback, useRef } from "react";
import "./Wellness.css";
import { WL_PRODUCTS, WL_CONFIG } from "./Wellness.data";

/* ─── Helpers ─────────────────────────────────────── */
const fmt   = (n) => "৳" + n.toLocaleString("en-BD");
const saves = (p) => Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

const waLink = (product, qty = 1) => {
  const msg = encodeURIComponent(
    `${WL_CONFIG.whatsappMessage}\n\n*${product.name}*\nপরিমাণ: ${qty}টি\nমোট: ${fmt(product.price * qty)}\n\nআমার ঠিকানা:`
  );
  return `https://wa.me/${WL_CONFIG.whatsapp}?text=${msg}`;
};

const MARQUEE_ITEMS = [
  "🌿 100% Natural", "✦ No Preservatives", "🌱 Farm Sourced",
  "✦ Lab Tested", "🍃 Organic Certified", "✦ Cash on Delivery",
  "🌿 100% Natural", "✦ No Preservatives", "🌱 Farm Sourced",
  "✦ Lab Tested", "🍃 Organic Certified", "✦ Cash on Delivery",
];

const INGREDIENTS = [
  { emoji: "🌿", name: "Holy Basil (Tulsi)" },
  { emoji: "🫚", name: "Black Seed Oil" },
  { emoji: "🍯", name: "Raw Sidr Honey" },
  { emoji: "🌼", name: "Lavender" },
  { emoji: "🫛", name: "Moringa Leaf" },
  { emoji: "🌱", name: "Ashwagandha Root" },
  { emoji: "🫖", name: "Valerian Root" },
  { emoji: "🌸", name: "Bergamot Oil" },
  { emoji: "🌾", name: "Frankincense" },
  { emoji: "🧄", name: "Ginger Root" },
  { emoji: "🍋", name: "Clary Sage" },
  { emoji: "🫙", name: "Jojoba Oil" },
];

const CATS = ["All", "Immunity", "Sleep", "Nutrition", "Digestion", "Stress"];

/* ─── Leaf Cursor Trail ───────────────────────────── */
function useLeafTrail() {
  useEffect(() => {
    const leaves = ["🍃", "🌿", "🍀", "☘️"];
    let last = 0;

    const onMove = (e) => {
      const now = Date.now();
      if (now - last < 120) return;
      last = now;

      const el = document.createElement("div");
      el.className = "wl-leaf-trail";
      el.textContent = leaves[Math.floor(Math.random() * leaves.length)];
      el.style.left = e.clientX + "px";
      el.style.top  = e.clientY + "px";
      el.style.fontSize = (12 + Math.random() * 8) + "px";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
}

/* ─── Gallery ─────────────────────────────────────── */
function WlGallery({ images }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zPos, setZPos] = useState({ x: 50, y: 50 });

  const handleClick = (e) => {
    if (!zoomed) { setZoomed(true); return; }
    const r = e.currentTarget.getBoundingClientRect();
    setZPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top)  / r.height) * 100,
    });
  };

  const nav = (dir, e) => {
    e.stopPropagation();
    setZoomed(false);
    setActive((a) => (a + dir + images.length) % images.length);
  };

  return (
    <div className="wl-mg">
      <div
        className="wl-mg-main"
        onClick={handleClick}
        style={{ cursor: zoomed ? "zoom-out" : "zoom-in" }}
      >
        <img
          src={images[active]}
          alt=""
          className="wl-mg-img"
          style={
            zoomed
              ? {
                  transform: `scale(2.1) translate(${(50 - zPos.x) * 0.48}%, ${(50 - zPos.y) * 0.48}%)`,
                  transition: "transform .2s ease",
                }
              : {}
          }
          draggable={false}
        />
        {!zoomed && <span className="wl-mg-zoom-hint">🔍 Click to zoom</span>}
        <button className="wl-mg-nav wl-mg-prev" onClick={(e) => nav(-1, e)}>‹</button>
        <button className="wl-mg-nav wl-mg-next" onClick={(e) => nav(+1, e)}>›</button>
      </div>

      <div className="wl-mg-thumbs">
        {images.map((src, i) => (
          <button
            key={i}
            className={`wl-mg-thumb${i === active ? " wl-mg-thumb--on" : ""}`}
            onClick={() => { setActive(i); setZoomed(false); }}
          >
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Product Modal ───────────────────────────────── */
function ProductModal({ product, onClose, onOrder }) {
  if (!product) return null;
  const waUrl = waLink(product);

  return (
    <div className="wl-overlay" onClick={onClose}>
      <div className="wl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wl-modal-topbar">
          <button className="wl-modal-x" onClick={onClose}>✕</button>
        </div>

        <WlGallery images={product.images} />

        <div className="wl-mi">
          <div className="wl-mi-cat">{product.category}</div>
          <div className="wl-mi-name">{product.name}</div>
          <div className="wl-mi-subtitle">{product.subtitle}</div>
          <div className="wl-mi-tagline">"{product.tagline}"</div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <span className="wl-stars">{stars(product.rating)}</span>
            <span className="wl-rnum">{product.rating}</span>
            <span className="wl-rcnt">({product.reviews} reviews)</span>
          </div>

          <div className="wl-mi-price-row">
            <span className="wl-mi-price">{fmt(product.price)}</span>
            <span className="wl-mi-orig">{fmt(product.originalPrice)}</span>
            <span className="wl-mi-save">Save {saves(product)}%</span>
          </div>

          <div className="wl-mi-meta">
            <span className="wl-mi-chip">📦 {product.volume}</span>
            <span className="wl-mi-chip">💵 Cash on Delivery</span>
            <span className="wl-mi-chip">🚚 Free above ৳999</span>
          </div>

          <p className="wl-mi-desc">{product.desc}</p>

          <div className="wl-mi-usage">
            🌿 <strong>How to use:</strong> {product.usage}
          </div>

          <ul className="wl-mi-benefits">
            {product.benefits.map((b, i) => (
              <li key={i}>
                <span className="wl-mi-dot" />
                {b}
              </li>
            ))}
          </ul>

          <div className="wl-mi-actions">
            <button
              className="wl-mi-order"
              onClick={() => { onClose(); onOrder(product); }}
            >
              🛒 Order Now
            </button>
            <a
              className="wl-mi-wa"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <span>💬</span> WhatsApp
            </a>
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
  const [status, setStatus] = useState("idle");

  if (!product) return null;
  const total = product.price * qty;

  const validate = () => {
    const e = {};
    if (!form.name.trim())                       e.name    = "প্রয়োজন";
    if (!/^01[3-9]\d{8}$/.test(form.phone.trim())) e.phone   = "সঠিক নম্বর";
    if (!form.address.trim())                    e.address = "প্রয়োজন";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setStatus("submitting");

    const params = new URLSearchParams({
      [WL_CONFIG.form.fields.name]:     form.name.trim(),
      [WL_CONFIG.form.fields.phone]:    form.phone.trim(),
      [WL_CONFIG.form.fields.address]:  form.address.trim(),
      [WL_CONFIG.form.fields.product]:  `${product.name} (${product.volume})`,
      [WL_CONFIG.form.fields.quantity]: String(qty),
      [WL_CONFIG.form.fields.total]:    `${fmt(total)} BDT`,
      [WL_CONFIG.form.fields.note]:     form.note.trim(),
    });

    const f = document.createElement("form");
    f.method = "POST";
    f.action = WL_CONFIG.form.action;
    f.target = "wl-hidden-iframe";
    f.style.display = "none";
    params.forEach((v, k) => {
      const inp = document.createElement("input");
      inp.type = "hidden"; inp.name = k; inp.value = v;
      f.appendChild(inp);
    });
    document.body.appendChild(f);
    f.submit();
    setTimeout(() => { document.body.removeChild(f); setStatus("done"); }, 1300);
  };

  const err = (key) =>
    errors[key] ? (
      <span style={{ color: "#C47A1E", fontWeight: 700, fontSize: ".72rem" }}>
        {" "}— {errors[key]}
      </span>
    ) : null;

  const inp = (key, label, ph, type = "text") => (
    <div className="wl-fg">
      <label className="wl-fl">{label}{err(key)}</label>
      <input
        className="wl-fi"
        type={type}
        placeholder={ph}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
        style={errors[key] ? { borderColor: "var(--amber)" } : {}}
      />
    </div>
  );

  return (
    <div className="wl-order-overlay" onClick={onClose}>
      <iframe name="wl-hidden-iframe" style={{ display: "none" }} title="submit-target" />
      <div className="wl-order-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="wl-order-head">
          <span className="wl-order-head-title">
            {status === "done" ? "অর্ডার নিশ্চিত 🌿" : "অর্ডার করুন"}
          </span>
          <button className="wl-modal-x" onClick={onClose}>✕</button>
        </div>

        {status === "done" ? (
          <div className="wl-success">
            <div className="wl-success-icon">✓</div>
            <div className="wl-success-title">ধন্যবাদ, {form.name}!</div>
            <p className="wl-success-msg">
              আপনার অর্ডার পেয়েছি 🌿<br />
              আমাদের টিম শীঘ্রই কনফার্ম করবে।<br />
              <span style={{ color: "var(--amber)", fontWeight: 700, fontSize: ".82rem" }}>
                পণ্য পাওয়ার পর টাকা দিন 💵
              </span>
            </p>
            <button className="wl-success-back" onClick={onClose}>আরো দেখুন →</button>
          </div>
        ) : (
          <div className="wl-order-body">
            {/* Summary */}
            <div className="wl-order-summary">
              <img src={product.images[0]} alt={product.name} className="wl-order-summary-img" />
              <div className="wl-order-summary-info">
                <div className="wl-order-summary-name">{product.name}</div>
                <div className="wl-order-summary-sub">{product.volume} · {product.category}</div>
              </div>
              <div className="wl-order-summary-price">{fmt(product.price)}</div>
            </div>

            {/* Qty */}
            <div className="wl-qty-row">
              <span className="wl-qty-label">পরিমাণ:</span>
              <div className="wl-qty-ctrl">
                <button className="wl-qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="wl-qty-num">{qty}</span>
                <button className="wl-qty-btn" onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
              <span className="wl-qty-total">মোট: {fmt(total)}</span>
            </div>

            {/* COD */}
            <div className="wl-cod">
              <span className="wl-cod-icon">💵</span>
              <div className="wl-cod-text">
                <strong>ক্যাশ অন ডেলিভারি</strong>
                <span>পণ্য হাতে পেয়ে টাকা দিন — আগাম কিছু নয়</span>
              </div>
            </div>

            {inp("name",    "আপনার নাম *",             "যেমন: সুমাইয়া আক্তার")}
            {inp("phone",   "মোবাইল নম্বর *",          "01XXXXXXXXX", "tel")}
            {inp("address", "ডেলিভারি ঠিকানা *",       "বাড়ি, রাস্তা, উপজেলা, জেলা")}

            <div className="wl-fg">
              <label className="wl-fl">বিশেষ নোট (ঐচ্ছিক)</label>
              <textarea
                className="wl-fta"
                placeholder="কোনো নির্দেশনা থাকলে লিখুন..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button
              className="wl-submit"
              onClick={submit}
              disabled={status === "submitting"}
            >
              {status === "submitting" ? "⏳ পাঠানো হচ্ছে..." : `✓ অর্ডার কনফার্ম — ${fmt(total)}`}
            </button>

            <a
              className="wl-submit-wa"
              href={waLink(product, qty)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>💬</span> WhatsApp-এ অর্ডার করুন
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Product Card ────────────────────────────────── */
function WlCard({ product, onView, onOrder }) {
  const waUrl = waLink(product);
  return (
    <div className="wl-card" onClick={() => onView(product)}>
      <div className="wl-card-img-wrap">
        <span className="wl-card-badge">{product.badge}</span>
        <img src={product.images[0]} alt={product.name} className="wl-card-img" loading="lazy" />
        <span className="wl-card-emoji">{product.emoji}</span>
      </div>

      <div className="wl-card-body">
        <div className="wl-card-cat">{product.category}</div>
        <div className="wl-card-name">{product.name}</div>
        <div className="wl-card-subtitle">{product.subtitle}</div>
        <div className="wl-card-tagline">"{product.tagline}"</div>

        <div className="wl-card-rating">
          <span className="wl-stars">{stars(product.rating)}</span>
          <span className="wl-rnum">{product.rating}</span>
          <span className="wl-rcnt">({product.reviews})</span>
        </div>

        <div className="wl-card-footer">
          <div className="wl-price-group">
            <span className="wl-price">{fmt(product.price)}</span>
            <div className="wl-price-sub">
              <span className="wl-price-orig">{fmt(product.originalPrice)}</span>
              <span className="wl-price-save">-{saves(product)}%</span>
            </div>
          </div>
          <div className="wl-card-btns">
            <button
              className="wl-card-buy"
              onClick={(e) => { e.stopPropagation(); onOrder(product); }}
            >
              অর্ডার
            </button>
            <a
              className="wl-card-wa"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="WhatsApp-এ অর্ডার"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────── */
export default function Wellness() {
  useLeafTrail();

  const [cat, setCat] = useState("All");
  const [viewP, setViewP] = useState(null);
  const [orderP, setOrderP] = useState(null);

  const filtered = cat === "All" ? WL_PRODUCTS : WL_PRODUCTS.filter((p) => p.category === cat);

  const scrollToShop = () =>
    document.getElementById("wl-shop")?.scrollIntoView({ behavior: "smooth" });

  const globalWaUrl = `https://wa.me/${WL_CONFIG.whatsapp}?text=${encodeURIComponent("আমি অর্ডার করতে চাই। আপনার পণ্যের তালিকা দেখাবেন?")}`;

  return (
    <div className="wl-page">
      {/* NAV */}
      <nav className="wl-nav">
        <a href="#" className="wl-logo">
          <span className="wl-logo-leaf">🌿</span>
          <span>
            <span className="wl-logo-text">Nirjhar</span>
            <span className="wl-logo-sub">Natural Wellness</span>
          </span>
        </a>
        <div className="wl-nav-right">
          <a className="wl-nav-wa" href={globalWaUrl} target="_blank" rel="noopener noreferrer">
            💬 <span>WhatsApp</span>
          </a>
          <button className="wl-nav-shop" onClick={scrollToShop}>Shop Now</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="wl-hero">
        <div className="wl-hero-texture" />
        <div className="wl-hero-orb wl-hero-orb--1" />
        <div className="wl-hero-orb wl-hero-orb--2" />
        <div className="wl-hero-inner">
          <div className="wl-hero-eyebrow">Pure · Potent · Proven</div>
          <h1 className="wl-hero-title">
            Nature Heals.<br /><em>If You Let It.</em>
          </h1>
          <div className="wl-hero-divider">
            <span>🌿</span>
          </div>
          <p className="wl-hero-sub">
            Handcrafted herbal remedies from certified organic farms.<br />
            <strong>No shortcuts. No synthetics. Just pure earth.</strong>
          </p>
          <div className="wl-hero-btns">
            <button className="wl-btn-primary" onClick={scrollToShop}>
              Explore Remedies ↓
            </button>
            <a className="wl-btn-wa-hero" href={globalWaUrl} target="_blank" rel="noopener noreferrer">
              💬 Chat on WhatsApp
            </a>
          </div>
          <div className="wl-hero-bottom">
            <span className="wl-hero-pill">🌱 Farm-to-bottle</span>
            <span className="wl-hero-pill">💵 Cash on Delivery</span>
            <span className="wl-hero-pill">🔬 Lab tested</span>
            <span className="wl-hero-pill">🚚 Nationwide Delivery</span>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="wl-marquee-wrap">
        <div className="wl-marquee-track">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="wl-marquee-item">
              {item}
              <span className="wl-marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div id="wl-shop">
        <div className="wl-section-top">
          <span className="wl-section-eyebrow">Our Remedies</span>
          <h2 className="wl-section-title">
            Ancient Wisdom,<br /><em>Modern Purity</em>
          </h2>
        </div>

        {/* Filter */}
        <div className="wl-filter-wrap">
          {CATS.map((c) => (
            <button
              key={c}
              className={`wl-filter-btn${cat === c ? " wl-filter-btn--active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="wl-grid">
          {filtered.map((p) => (
            <WlCard
              key={p.id}
              product={p}
              onView={setViewP}
              onOrder={setOrderP}
            />
          ))}
        </div>
      </div>

      {/* INGREDIENT STRIP */}
      <div className="wl-ingredients">
        <div className="wl-ing-inner">
          <span className="wl-ing-label">What Goes In</span>
          <h3 className="wl-ing-title">Every ingredient has a reason to be there.</h3>
          <div className="wl-ing-grid">
            {INGREDIENTS.map((ing) => (
              <div className="wl-ing-item" key={ing.name}>
                <span className="wl-ing-emoji">{ing.emoji}</span>
                {ing.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="wl-footer">
        <div className="wl-footer-inner">
          <span className="wl-footer-brand">🌿 Nirjhar Natural Wellness</span>
          <div className="wl-footer-right">
            <a
              href={globalWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: ".8rem", fontWeight: 700, color: "#25D366",
                textDecoration: "none"
              }}
            >
              💬 Chat with us on WhatsApp
            </a>
            <span className="wl-footer-copy">© 2025 · All rights reserved</span>
          </div>
        </div>
        <div className="wl-footer-note">
          🔒 Cash on Delivery only · No advance payment · 7-day return guarantee
        </div>
      </footer>

      {/* FLOATING WA BUBBLE */}
      <div className="wl-wa-float">
        <span className="wl-wa-tooltip">অর্ডার করুন WhatsApp-এ</span>
        <a className="wl-wa-bubble" href={globalWaUrl} target="_blank" rel="noopener noreferrer" title="WhatsApp">
          💬
        </a>
      </div>

      {/* MODALS */}
      {viewP && (
        <ProductModal
          product={viewP}
          onClose={() => setViewP(null)}
          onOrder={(p) => { setViewP(null); setOrderP(p); }}
        />
      )}

      {orderP && (
        <OrderDrawer
          product={orderP}
          onClose={() => setOrderP(null)}
        />
      )}
    </div>
  );
}
