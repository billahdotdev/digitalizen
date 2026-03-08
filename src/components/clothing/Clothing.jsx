// Clothing.jsx — আড়ং রেশম · Final Production · Vite + React + Pure CSS

import { useState, useEffect, useRef, useCallback } from "react";
import "./Clothing.css";
import {
  STORE_CONFIG,
  FORM_CONFIG,
  CATEGORIES,
  PRODUCTS,
  TESTIMONIALS,
} from "./Clothing.data.js";

/* ═══════════════════════════════════════
   ICONS
═══════════════════════════════════════ */
const Ic = {
  Bag:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Heart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  X:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Right: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Left:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  Shield:() => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Spin:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  Tag:   () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Lock:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
};

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const CUR = STORE_CONFIG.currency;
const disc = p => p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

function submitGoogleForm(data) {
  const id = "gf_" + Date.now();
  const fr = document.createElement("iframe");
  fr.name = id; fr.style.cssText = "display:none;position:fixed;";
  document.body.appendChild(fr);
  const fm = document.createElement("form");
  fm.method = "POST"; fm.action = FORM_CONFIG.ACTION_URL; fm.target = id; fm.style.display = "none";
  Object.entries(data).forEach(([k, v]) => {
    const i = document.createElement("input");
    i.type = "hidden"; i.name = FORM_CONFIG.FIELDS[k] || k; i.value = String(v ?? "");
    fm.appendChild(i);
  });
  document.body.appendChild(fm);
  fm.submit();
  setTimeout(() => { try { document.body.removeChild(fr); document.body.removeChild(fm); } catch {} }, 5000);
}

/* ═══════════════════════════════════════
   TICKER
═══════════════════════════════════════ */
const TICKS = [
  "বিনামূল্যে ডেলিভারি ১৫০০৳+ এ",
  "Free Delivery ৳1500+",
  "ক্যাশ অন ডেলিভারি",
  "Cash On Delivery",
  "৭ দিনের রিটার্ন",
  "7-Day Returns",
  "খাঁটি হ্যান্ডলুম ফ্যাব্রিক",
  "100% Authentic Fabric",
];

/* ═══════════════════════════════════════
   IMAGE GALLERY
═══════════════════════════════════════ */
function Gallery({ images, name }) {
  const [idx, setIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const imgRef = useRef(null);

  const go = (dir) => { setIdx(i => (i + dir + images.length) % images.length); setZoomed(false); };
  const pick = (i)  => { setIdx(i); setZoomed(false); };

  const handleClick = (e) => {
    if (!zoomed) {
      const r = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      setOrigin(`${x}% ${y}%`);
      setZoomed(true);
    } else {
      setZoomed(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!zoomed) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    if (imgRef.current) imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className="cl-gallery">
      <div
        className={`cl-gallery-main${zoomed ? " is-zoomed" : ""}`}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          ref={imgRef}
          src={images[idx]}
          alt={name}
          className={`cl-gal-img${zoomed ? " zoomed" : ""}`}
          style={zoomed ? { transformOrigin: origin } : {}}
          draggable={false}
        />
        {images.length > 1 && (
          <>
            <button className="cl-gal-arrow cl-gal-prev" onClick={e => { e.stopPropagation(); go(-1); }}><Ic.Left /></button>
            <button className="cl-gal-arrow cl-gal-next" onClick={e => { e.stopPropagation(); go(1);  }}><Ic.Right /></button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      <div className="cl-gal-dots">
        {images.map((_, i) => (
          <button key={i} className={`cl-gal-dot${idx === i ? " active" : ""}`} onClick={() => pick(i)} />
        ))}
      </div>

      {/* Thumbnails */}
      <div className="cl-gal-thumbs">
        {images.map((src, i) => (
          <div key={i} className={`cl-gal-thumb${idx === i ? " active" : ""}`} onClick={() => pick(i)}>
            <img src={src} alt={`${name} ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════ */
function ProductCard({ product, onOpen, wishlist, toggleWishlist }) {
  const wished = wishlist.has(product.id);
  const d = disc(product);

  return (
    <article className="cl-card" onClick={() => product.inStock && onOpen(product)}>
      <div className="cl-card-img-wrap">
        <img src={product.images[0]} alt={product.name} className="cl-img-main" loading="lazy" />
        <img src={product.images[1] || product.images[0]} alt={product.name} className="cl-img-hover" loading="lazy" />
        <div className="cl-card-grad" />

        {product.badge && (
          <span className={`cl-badge badge-${product.badge}`}>
            {{ bestseller: "বেস্টসেলার", exclusive: "এক্সক্লুসিভ", new: "নতুন", limited: "সীমিত" }[product.badge]}
          </span>
        )}

        <span className="cl-fabric-chip">{product.fabric}</span>

        <button
          className={`cl-wish-btn${wished ? " active" : ""}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          aria-label="Wishlist"
        >
          <Ic.Heart />
        </button>

        {!product.inStock && (
          <div className="cl-card-oos"><span>স্টক শেষ</span></div>
        )}
      </div>

      <div className="cl-card-body">
        <div className="cl-card-name">{product.name}</div>
        <div className="cl-card-en">{product.nameEn}</div>
        <div className="cl-price-row">
          <span className="cl-price">{CUR}{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="cl-price-was">{CUR}{product.originalPrice.toLocaleString()}</span>
          )}
          {d > 0 && <span className="cl-price-off">-{d}%</span>}
        </div>
        <div className="cl-card-dots">
          {product.colors.map(c => (
            <span key={c.hex} className="cl-dot" style={{ background: c.hex }} title={c.name} />
          ))}
        </div>
      </div>

      {product.inStock && (
        <button className="cl-card-cta" onClick={e => { e.stopPropagation(); onOpen(product); }}>
          <Ic.Bag /> অর্ডার করুন
        </button>
      )}
    </article>
  );
}

/* ═══════════════════════════════════════
   PRODUCT MODAL  (3 steps)
═══════════════════════════════════════ */
function ProductModal({ product, onClose, onAddToCart, toast }) {
  const [step,     setStep]     = useState("config"); // config | form | success
  const [color,    setColor]    = useState(product.colors[0]);
  const [size,     setSize]     = useState(product.sizes[0]);
  const [qty,      setQty]      = useState(1);
  const [delivery, setDelivery] = useState(STORE_CONFIG.deliveryAreas[0]);
  const [form,     setForm]     = useState({ name: "", phone: "", address: "", note: "" });
  const [loading,  setLoading]  = useState(false);

  const subtotal   = product.price * qty;
  const grandTotal = subtotal + delivery.fee;
  const canOrder   = !!size && !!color;

  const field = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const proceed = () => {
    if (!canOrder) { toast("রঙ ও সাইজ সিলেক্ট করুন"); return; }
    setStep("form");
    window.scrollTo(0, 0);
  };

  const handleAddToCart = () => {
    if (!canOrder) { toast("রঙ ও সাইজ সিলেক্ট করুন"); return; }
    onAddToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], color, size, qty });
    toast("ঝুড়িতে যোগ হয়েছে ✓");
    onClose();
  };

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast("সব ফিল্ড পূরণ করুন"); return;
    }
    setLoading(true);
    submitGoogleForm({
      name: form.name, phone: form.phone, address: form.address,
      product: `${product.name} (${product.nameEn})`,
      color: `${color.name} / ${color.nameEn}`,
      size, quantity: qty,
      delivery: `${delivery.label} — ${CUR}${delivery.fee}`,
      total: `${CUR}${grandTotal.toLocaleString()}`,
      note: form.note,
    });
    setTimeout(() => { setLoading(false); setStep("success"); }, 1000);
  };

  return (
    <div className="cl-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cl-sheet">
        <div className="cl-sheet-handle" />
        <div className="cl-sheet-bar">
          <button className="cl-close-btn" onClick={onClose}><Ic.X /></button>
        </div>

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div className="cl-success">
            <div className="cl-success-icon"><Ic.Check /></div>
            <div className="cl-success-h">অর্ডার হয়ে গেছে! 🎉</div>
            <div className="cl-success-p">
              আমরা শীঘ্রই <strong>{form.phone}</strong> নম্বরে কল করব এবং ডেলিভারি নিশ্চিত করব।<br/>ধন্যবাদ আড়ং রেশমকে বিশ্বাস করার জন্য।
            </div>
            <button className="cl-success-close" onClick={onClose}>কেনাকাটা চালিয়ে যান</button>
          </div>
        )}

        {/* ── ORDER FORM ── */}
        {step === "form" && (
          <div className="cl-form-step">
            <button className="cl-back-btn" onClick={() => setStep("config")}>
              <Ic.Left /> ফিরে যান
            </button>
            <div className="cl-form-title">অর্ডার তথ্য</div>
            <div className="cl-form-sub">আপনার তথ্য দিন — আমরা কল করব</div>

            <div className="cl-summary-pill">
              <img src={product.images[0]} alt={product.name} className="cl-sp-img" />
              <div className="cl-sp-info">
                <div className="cl-sp-name">{product.name}</div>
                <div className="cl-sp-meta">
                  {color.name} · {size} · ×{qty}<br/>
                  ডেলিভারি: {CUR}{delivery.fee}
                </div>
              </div>
              <div className="cl-sp-total">{CUR}{grandTotal.toLocaleString()}</div>
            </div>

            <div className="cl-fld">
              <label>আপনার নাম *</label>
              <input name="name" value={form.name} onChange={field} placeholder="পূর্ণ নাম লিখুন" />
            </div>
            <div className="cl-fld">
              <label>মোবাইল নম্বর *</label>
              <input name="phone" type="tel" value={form.phone} onChange={field} placeholder="01XXXXXXXXX" />
            </div>
            <div className="cl-fld">
              <label>ডেলিভারি ঠিকানা *</label>
              <textarea name="address" value={form.address} onChange={field} placeholder="বাড়ি/ফ্ল্যাট, রাস্তা, এলাকা, জেলা..." rows={3} />
            </div>
            <div className="cl-fld">
              <label>বিশেষ নোট (ঐচ্ছিক)</label>
              <input name="note" value={form.note} onChange={field} placeholder="কোনো নির্দিষ্ট নির্দেশনা..." />
            </div>

            <button className="cl-submit-btn" onClick={submit} disabled={loading}>
              {loading ? "প্রক্রিয়াকরণ..." : <><Ic.Check /> অর্ডার নিশ্চিত করুন</>}
            </button>
            <div className="cl-form-trust">
              <Ic.Lock /> ক্যাশ অন ডেলিভারি · কোনো অগ্রিম পেমেন্ট নেই
            </div>
          </div>
        )}

        {/* ── CONFIGURATOR ── */}
        {step === "config" && (
          <>
            <Gallery images={product.images} name={product.name} />

            <div className="cl-pinfo">
              <div className="cl-pinfo-badges">
                {product.badge && (
                  <span className={`cl-chip cl-badge badge-${product.badge}`}>
                    {{ bestseller: "বেস্টসেলার", exclusive: "এক্সক্লুসিভ", new: "নতুন", limited: "সীমিত" }[product.badge]}
                  </span>
                )}
                <span className="cl-chip chip-fabric">{product.fabric}</span>
              </div>
              <h2 className="cl-pname">{product.name}</h2>
              <div className="cl-pname-en">{product.nameEn}</div>
              <div className="cl-pprice-row">
                <span className="cl-pprice">{CUR}{product.price.toLocaleString()}</span>
                {product.originalPrice && <span className="cl-pprice-was">{CUR}{product.originalPrice.toLocaleString()}</span>}
                {disc(product) > 0 && <span className="cl-pprice-save">{disc(product)}% ছাড়</span>}
              </div>
              <p className="cl-pdesc">{product.description}</p>
            </div>

            <div className="cl-config">
              {/* Color */}
              <div className="cl-config-block">
                <div className="cl-config-lbl">রঙ <span className="sel">— {color.name}</span></div>
                <div className="cl-colors">
                  {product.colors.map(c => (
                    <div key={c.hex} className={`cl-color-opt${color.hex === c.hex ? " active" : ""}`} onClick={() => setColor(c)}>
                      <div className="cl-color-circle" style={{ background: c.hex }} />
                      <span className="cl-color-nm">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size */}
              {product.sizes.length > 1 && (
                <div className="cl-config-block">
                  <div className="cl-config-lbl">সাইজ <span className="sel">— {size}</span></div>
                  <div className="cl-sizes">
                    {product.sizes.map(s => (
                      <button key={s} className={`cl-size-btn${size === s ? " active" : ""}`} onClick={() => setSize(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="cl-config-block">
                <div className="cl-config-lbl">পরিমাণ</div>
                <div className="cl-qty">
                  <button className="cl-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="cl-qty-n">{qty}</span>
                  <button className="cl-qty-btn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
                </div>
              </div>

              {/* Delivery */}
              <div className="cl-config-block">
                <div className="cl-config-lbl">ডেলিভারি এলাকা</div>
                <div className="cl-delivery">
                  {STORE_CONFIG.deliveryAreas.map(a => (
                    <div key={a.fee} className={`cl-dlv${delivery.fee === a.fee ? " active" : ""}`} onClick={() => setDelivery(a)}>
                      <div className="cl-dlv-radio"><div className="cl-dlv-radio-dot" /></div>
                      <div className="cl-dlv-text">
                        <div className="cl-dlv-label">{a.label}</div>
                        <div className="cl-dlv-sub">{a.labelEn}</div>
                      </div>
                      <div className="cl-dlv-fee">{CUR}{a.fee}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost summary */}
              <div className="cl-cost-box">
                <div className="cl-cost-row">
                  <span className="cl-cost-k">পণ্যের দাম × {qty}</span>
                  <span className="cl-cost-v">{CUR}{subtotal.toLocaleString()}</span>
                </div>
                <div className="cl-cost-row">
                  <span className="cl-cost-k">ডেলিভারি চার্জ</span>
                  <span className="cl-cost-v">{CUR}{delivery.fee}</span>
                </div>
                <div className="cl-cost-sep" />
                <div className="cl-cost-row">
                  <span className="cl-cost-total-k">সর্বমোট</span>
                  <span className="cl-cost-total-v">{CUR}{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {product.inStock ? (
                <>
                  <button className="cl-order-btn" onClick={proceed}>
                    <Ic.Right /> এখনই অর্ডার করুন
                  </button>
                  <span className="cl-cart-link" onClick={handleAddToCart}>
                    + ঝুড়িতে রাখুন
                  </span>
                </>
              ) : (
                <button className="cl-order-btn" disabled>স্টক শেষ</button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CART DRAWER
═══════════════════════════════════════ */
function CartDrawer({ cart, open, onClose, onRemove }) {
  if (!open) return null;
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className="cl-drawer-wrap">
      <div className="cl-drawer-bg" onClick={onClose} />
      <aside className="cl-drawer">
        <div className="cl-drawer-head">
          <div>
            <div className="cl-drawer-title">আপনার ঝুড়ি</div>
            <div className="cl-drawer-count">{cart.length} টি পণ্য</div>
          </div>
          <button className="cl-drawer-close" onClick={onClose}><Ic.X /></button>
        </div>
        <div className="cl-drawer-body">
          {cart.length === 0 ? (
            <div className="cl-drawer-empty">
              <Ic.Bag /><span>ঝুড়ি এখন খালি</span>
            </div>
          ) : cart.map((item, i) => (
            <div className="cl-cart-item" key={i}>
              <img src={item.image} alt={item.name} className="cl-ci-img" />
              <div className="cl-ci-info">
                <div className="cl-ci-name">{item.name}</div>
                <div className="cl-ci-meta">{item.color?.name} · {item.size} · ×{item.qty}</div>
                <div className="cl-ci-price">{CUR}{(item.price * item.qty).toLocaleString()}</div>
              </div>
              <button className="cl-ci-rm" onClick={() => onRemove(i)}><Ic.Trash /></button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cl-drawer-foot">
            <div className="cl-total-row">
              <span className="cl-total-lbl">মোট</span>
              <span className="cl-total-val">{CUR}{total.toLocaleString()}</span>
            </div>
            <div className="cl-drawer-note">অর্ডার করতে পণ্যে ক্লিক করুন</div>
          </div>
        )}
      </aside>
    </div>
  );
}

/* ═══════════════════════════════════════
   TRUST STRIP
═══════════════════════════════════════ */
const TRUST = [
  { icon: <Ic.Truck />,   t: "দ্রুত ডেলিভারি",    s: "৩–৫ কার্যদিবসে" },
  { icon: <Ic.Shield />,  t: "ক্যাশ অন ডেলিভারি", s: "নিরাপদ পেমেন্ট" },
  { icon: <Ic.Spin />,    t: "৭ দিনের রিটার্ন",   s: "ঝামেলামুক্ত" },
  { icon: <Ic.Tag />,     t: "সেরা দাম",            s: "কোনো লুকানো চার্জ নেই" },
];

/* ═══════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function Toast({ msg, show }) {
  return <div className={`cl-toast${show ? " show" : ""}`}>{msg}</div>;
}

/* ═══════════════════════════════════════
   ROOT
═══════════════════════════════════════ */
export default function Clothing() {
  const [cat,      setCat]      = useState("all");
  const [modal,    setModal]    = useState(null);
  const [cart,     setCart]     = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [toast,    setToast]    = useState({ msg: "", show: false });

  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(s => ({ ...s, show: false })), 2500);
  }, []);

  const filtered = cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);

  const addToCart    = item  => setCart(c => [...c, item]);
  const removeCart   = idx   => setCart(c => c.filter((_, i) => i !== idx));
  const toggleWish   = id    => setWishlist(w => {
    const n = new Set(w);
    n.has(id)
      ? (n.delete(id), showToast("উইশলিস্ট থেকে সরানো হলো"))
      : (n.add(id),    showToast("উইশলিস্টে যোগ হলো ♥"));
    return n;
  });

  useEffect(() => {
    document.body.style.overflow = (modal || cartOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal, cartOpen]);

  return (
    <>
      {/* TICKER */}
      <div className="cl-ticker" aria-hidden>
        <div className="cl-ticker-track">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span className="cl-ticker-item" key={i}>{t}<span className="cl-ticker-dot">◆</span></span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="cl-header">
        <div className="cl-logo">
          <span className="cl-logo-bn">{STORE_CONFIG.name}</span>
          <span className="cl-logo-dot" />
          <span className="cl-logo-sub">Menswear</span>
        </div>
        <div className="cl-header-actions">
          <button
            className={`cl-hbtn${wishlist.size > 0 ? " active-heart" : ""}`}
            onClick={() => showToast(wishlist.size ? `উইশলিস্টে ${wishlist.size} টি পণ্য` : "উইশলিস্ট খালি")}
            aria-label="Wishlist"
          >
            <Ic.Heart />
            {wishlist.size > 0 && <span className="cl-badge-pill">{wishlist.size}</span>}
          </button>
          <button className="cl-hbtn" onClick={() => setCartOpen(true)} aria-label="Cart">
            <Ic.Bag />
            {cart.length > 0 && <span className="cl-badge-pill">{cart.length}</span>}
          </button>
        </div>
      </header>

      {/* CATEGORY NAV */}
      <nav className="cl-cats">
        {CATEGORIES.map(c => (
          <button key={c.id} className={`cl-cat${cat === c.id ? " active" : ""}`} onClick={() => setCat(c.id)}>
            <span className="lbl-bn">{c.label}</span>
            <span className="lbl-en">{c.labelEn}</span>
          </button>
        ))}
      </nav>

      {/* SECTION HEADER */}
      <div className="cl-section-top">
        <div>
          <span className="cl-section-eyebrow">
            {cat === "all" ? "সম্পূর্ণ সংগ্রহ" : "শ্রেণি"}
          </span>
          <h1 className="cl-section-h1">
            {cat === "all" ? "সব পণ্য" : CATEGORIES.find(c => c.id === cat)?.label}
          </h1>
        </div>
        <span className="cl-section-count">{filtered.length} টি পণ্য</span>
      </div>

      {/* GRID */}
      <main className="cl-grid">
        {filtered.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onOpen={setModal}
            wishlist={wishlist}
            toggleWishlist={toggleWish}
          />
        ))}
      </main>

      {/* TRUST */}
      <div className="cl-trust">
        {TRUST.map((t, i) => (
          <div className="cl-trust-cell" key={i}>
            <div className="cl-trust-icon">{t.icon}</div>
            <div className="cl-trust-txt">
              <strong>{t.t}</strong>
              <span>{t.s}</span>
            </div>
          </div>
        ))}
      </div>

      {/* REVIEWS */}
      <section className="cl-reviews">
        <div className="cl-reviews-top">
          <div className="cl-reviews-h">ক্রেতাদের কথা</div>
          <div className="cl-reviews-tag">সত্যিকারের রিভিউ</div>
        </div>
        <div className="cl-reviews-scroll">
          {TESTIMONIALS.map(r => (
            <div className="cl-rv" key={r.id}>
              <div className="cl-rv-stars">{Array.from({ length: r.rating }).map((_, i) => <span key={i} className="cl-rv-star">★</span>)}</div>
              <p className="cl-rv-text">"{r.text}"</p>
              <div className="cl-rv-product">{r.product}</div>
              <div className="cl-rv-author">
                <div className="cl-rv-av">{r.avatar}</div>
                <div>
                  <div className="cl-rv-name">{r.name}</div>
                  <div className="cl-rv-loc">{r.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="cl-footer">
        <div className="cl-footer-logo">{STORE_CONFIG.name}</div>
        <div className="cl-footer-tagline">{STORE_CONFIG.tagline}</div>
        <div className="cl-footer-grid">
          <div>
            <div className="cl-footer-col-h">পণ্য</div>
            {CATEGORIES.filter(c => c.id !== "all").map(c => (
              <span key={c.id} className="cl-footer-lnk" style={{ cursor:"pointer" }} onClick={() => { setCat(c.id); window.scrollTo(0,0); }}>
                {c.label}
              </span>
            ))}
          </div>
          <div>
            <div className="cl-footer-col-h">সহায়তা</div>
            {["ডেলিভারি তথ্য","রিটার্ন পলিসি","সাইজ গাইড","FAQ"].map(l => (
              <a href="#" key={l} className="cl-footer-lnk">{l}</a>
            ))}
          </div>
          <div>
            <div className="cl-footer-col-h">যোগাযোগ</div>
            <div className="cl-footer-contact">WhatsApp: <a href={`https://wa.me/${STORE_CONFIG.whatsapp}`}>{STORE_CONFIG.whatsapp}</a></div>
            <div className="cl-footer-contact">Instagram: <a href="#">{STORE_CONFIG.instagram}</a></div>
            <div className="cl-footer-contact">Facebook: <a href="#">{STORE_CONFIG.facebook}</a></div>
          </div>
          <div>
            <div className="cl-footer-col-h">নীতিমালা</div>
            {["গোপনীয়তা নীতি","শর্তাবলী","নিরাপদ কেনাকাটা"].map(l => (
              <a href="#" key={l} className="cl-footer-lnk">{l}</a>
            ))}
          </div>
        </div>
        <hr className="cl-footer-hr" />
        <div className="cl-footer-copy">© {new Date().getFullYear()} {STORE_CONFIG.nameEn} · সর্বস্বত্ব সংরক্ষিত</div>
      </footer>

      {/* MODAL */}
      {modal && (
        <ProductModal
          product={modal}
          onClose={() => setModal(null)}
          onAddToCart={addToCart}
          toast={showToast}
        />
      )}

      {/* CART */}
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeCart} />

      {/* TOAST */}
      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
