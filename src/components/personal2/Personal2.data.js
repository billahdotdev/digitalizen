// ─── Personal.data.js ──────────────────────────────────────────────────────
// VELOUR — Romance & Intimacy Store
// ⚠️  Replace ALL entry.XXXXXXXXX values with your actual Google Form field IDs
//     To find them: preview your form → right-click any input → Inspect → find name="entry.XXXXXXXX"

export const STORE = {
  name:    "Velour",
  tagline: "For your most intimate moments.",

  // ↓ Your Google Form's formResponse endpoint
  formAction: "https://docs.google.com/forms/d/e/YOUR_FORM_ID_HERE/formResponse",

  // Map each data point to its Google Form entry ID
  fields: {
    productId:   "entry.111111111",   // hidden — product numeric ID
    productName: "entry.222222222",   // e.g. "Silk Intimacy Set (M / L)"
    price:       "entry.333333333",   // unit price, e.g. "৳2,490"
    qty:         "entry.444444444",   // quantity ordered
    total:       "entry.555555555",   // total, e.g. "৳4,980 BDT"
    name:        "entry.666666666",   // customer full name
    phone:       "entry.777777777",   // WhatsApp / mobile number
    address:     "entry.888888888",   // delivery address
    note:        "entry.999999999",   // optional customer note
  },
};

export const PRODUCTS = [
  {
    id: 1,
    name: "Silk Intimacy Set",
    subtitle: "The Signature Collection",
    badge: "BESTSELLER",
    badgeGold: true,
    price: 2490,
    was:   3800,
    stock: 9,
    desc:  "Pure 22-momme silk. Cut close, feels like nothing at all. A gift you give yourself — or someone you love deeply. Hand-finished edges, arrives in matte black packaging.",
    details: ["22-momme Mulberry Silk", "Hand-finished edges", "Discreet matte packaging", "Complimentary gift card"],
    sizes: ["XS / S", "M / L", "XL / XXL"],
    colors: ["Blush Rose", "Midnight Black", "Ivory Pearl"],
    // High-res portrait image for full-width card
    heroImg: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4bca0c?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=90&fit=crop",
    ],
    reviews: 284, rating: 4.9,
  },
  {
    id: 2,
    name: "Noir Lace Robe",
    subtitle: "Limited Edition",
    badge: "NEW",
    badgeGold: false,
    price: 1890,
    was:   2800,
    stock: 14,
    desc:  "French Chantilly lace, floor-length silhouette, satin tie waist. The kind of piece that changes the atmosphere of a room the moment you walk in.",
    details: ["French Chantilly Lace", "Floor-length silhouette", "Satin tie waist", "Discreet matte packaging"],
    sizes: ["XS / S", "M / L", "XL / XXL"],
    colors: ["Noir", "Deep Burgundy", "Ivory"],
    heroImg: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=900&q=90&fit=crop",
    ],
    reviews: 127, rating: 4.8,
  },
  {
    id: 3,
    name: "Velvet Desire Candle Set",
    subtitle: "Mood Ritual",
    badge: "GIFT READY",
    badgeGold: false,
    price: 1290,
    was:   1900,
    stock: 22,
    desc:  "Three hand-poured soy candles. 40-hour burn each. Oud, rose and amber — the scent that sets the scene. Arrives sealed in a black gift box, ribbon-tied.",
    details: ["100% Soy wax", "40-hour burn each", "Hand-poured artisan", "Sealed black gift box"],
    sizes: ["Set of 3"],
    colors: ["Signature Blend"],
    heroImg: "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=90&fit=crop",
    ],
    reviews: 391, rating: 4.9,
  },
  {
    id: 4,
    name: "Intimate Massage Oil",
    subtitle: "Warming Formula",
    badge: "COUPLES PICK",
    badgeGold: false,
    price: 990,
    was:   1500,
    stock: 31,
    desc:  "Warm-to-touch formula. Absorbs without residue. Ylang-ylang and vanilla — a scent designed to slow everything down and bring you closer.",
    details: ["Warming on contact", "100ml airless bottle", "No residue formula", "Plain sealed packaging"],
    sizes: ["100ml"],
    colors: ["Single variant"],
    heroImg: "https://images.unsplash.com/photo-1552693673-1bf958298935?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1552693673-1bf958298935?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=900&q=90&fit=crop",
    ],
    reviews: 512, rating: 4.8,
  },
  {
    id: 5,
    name: "Rose Petal Bath Ritual",
    subtitle: "The Experience",
    badge: "ANNIVERSARY GIFT",
    badgeGold: true,
    price: 1590,
    was:   2400,
    stock: 18,
    desc:  "Dried Bulgarian rose petals, Himalayan bath salts, two soy tealights. Everything needed for a night that becomes a memory. Arrives in a ribbon-sealed box.",
    details: ["Dried Bulgarian roses", "Himalayan bath salts", "2 soy tealights", "Ribbon-sealed gift box"],
    sizes: ["One size"],
    colors: ["Rose Gold box"],
    heroImg: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=90&fit=crop",
    ],
    reviews: 203, rating: 4.9,
  },
  {
    id: 6,
    name: "Satin Eye Mask & Cuffs",
    subtitle: "Playful Luxury",
    badge: "COUPLE'S CHOICE",
    badgeGold: false,
    price: 890,
    was:   1400,
    stock: 27,
    desc:  "Heavyweight 4-ply satin. Adjustable velcro, no elastic pressure. The small addition that makes an ordinary night feel deeply intentional.",
    details: ["4-ply heavyweight satin", "Adjustable velcro", "No elastic pressure", "Plain sealed envelope"],
    sizes: ["One size fits all"],
    colors: ["Midnight Black", "Deep Rose"],
    heroImg: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&q=90&fit=crop",
    imgs: [
      "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=900&q=90&fit=crop",
    ],
    reviews: 448, rating: 4.7,
  },
];
