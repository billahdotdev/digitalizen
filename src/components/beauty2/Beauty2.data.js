// ─── Beauty.data.js ─────────────────────────────────────────────────────────
// Lumière Skin — Store Config + Product Catalogue
//
// ⚠️  SETUP: Replace the placeholder values below before going live.
//     To find Google Form field IDs:
//     1. Open your Google Form → Preview
//     2. Right-click any input → Inspect → find name="entry.XXXXXXXXX"
//     3. Copy that ID into the fields object below

export const STORE = {
  name:      "Lumière",
  handle:    "@lumiere.skin",
  tagline:   "Science meets softness.",

  // ── WhatsApp ──────────────────────────────────────────
  // Country code + number, NO + or spaces (e.g. "8801712345678")
  whatsapp: "8801XXXXXXXXX",

  // ── Google Form ───────────────────────────────────────
  formAction: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
  fields: {
    productName: "entry.111111111",
    shade:       "entry.222222222",
    qty:         "entry.333333333",
    price:       "entry.444444444",
    total:       "entry.555555555",
    name:        "entry.666666666",
    phone:       "entry.777777777",
    address:     "entry.888888888",
    note:        "entry.999999999",
  },
};

// ── Shade gradient presets ─────────────────────────────
// Each shade shifts the entire canvas background — this is the signature effect
const G = {
  petal:  "linear-gradient(155deg, #FDE8EE 0%, #F5C6D0 48%, #E8A8B8 100%)",
  ivory:  "linear-gradient(155deg, #FDF6EC 0%, #F5E6D0 48%, #E8D0B0 100%)",
  mauve:  "linear-gradient(155deg, #F2E4F0 0%, #DEC0DC 48%, #C49AC0 100%)",
  rose:   "linear-gradient(155deg, #F5E0E4 0%, #D8A0AC 48%, #B87080 100%)",
  nude:   "linear-gradient(155deg, #F8F0EC 0%, #E8D0C4 48%, #D0B0A0 100%)",
  berry:  "linear-gradient(155deg, #EDE0F2 0%, #C8A0D8 48%, #A070C0 100%)",
  sage:   "linear-gradient(155deg, #E8F2EC 0%, #C4D8C8 48%, #A0C0A8 100%)",
};

export const PRODUCTS = [
  {
    id: 1,
    name: "Velvet Glow Serum",
    subtitle: "24H Luminous Hydration",
    category: "Serum · 30ml",
    price: 2890,
    was: 4200,
    rating: 4.9,
    reviews: 1248,
    badge: "BESTSELLER",
    badgeTone: "gold",
    imgs: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=90&fit=crop",
    ],
    shades: [
      { name: "Petal Dew",   hex: "#F5C6D0", grad: G.petal },
      { name: "Ivory Glow",  hex: "#F5E6D0", grad: G.ivory },
      { name: "Mauve Mist",  hex: "#DEC0DC", grad: G.mauve },
      { name: "Rosewood",    hex: "#D8A0AC", grad: G.rose  },
      { name: "Nude Velvet", hex: "#E8D0C4", grad: G.nude  },
    ],
    tagline: "Wake up glowing. Every single day.",
    description: "Weightless hyaluronic complex fused with 24K gold micro-particles and rosa damascena extract. Absorbs in 8 seconds. Leaves skin luminous, plump, and impossibly soft.",
    howToUse: "Apply 3 drops to clean skin. Press gently with fingertips in upward motions. Use morning & night before moisturiser. Follow with SPF in the AM.",
    benefits: ["24H moisture lock", "Visible glow in 7 days", "Zero pilling", "All skin types"],
    ingredients: "Aqua, Sodium Hyaluronate (3%), Rosa Damascena Flower Water, 24K Gold (Aurum), Niacinamide 10%, Panthenol, Glycerin, Centella Asiatica Extract, Ceramide NP, Squalane, Allantoin, Phenoxyethanol.",
    sustain: [
      { icon: "🌿", label: "Vegan & Cruelty-Free" },
      { icon: "♻️", label: "FSC-certified glass bottle" },
      { icon: "🌸", label: "1% for coral reef restoration" },
      { icon: "✨", label: "Refillable packaging available" },
    ],
  },
  {
    id: 2,
    name: "Cloud Cream SPF 40",
    subtitle: "Airy Moisturiser + Sun Shield",
    category: "Moisturiser · 50ml",
    price: 2490,
    was: 3600,
    rating: 4.8,
    reviews: 892,
    badge: "NEW ARRIVAL",
    badgeTone: "blush",
    imgs: [
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=90&fit=crop",
    ],
    shades: [
      { name: "Ivory Glow",  hex: "#F5E6D0", grad: G.ivory },
      { name: "Nude Velvet", hex: "#E8D0C4", grad: G.nude  },
      { name: "Petal Dew",   hex: "#F5C6D0", grad: G.petal },
    ],
    tagline: "SPF 40 that actually feels invisible.",
    description: "Feather-light whipped texture with broad-spectrum SPF 40. No white cast. No greasy finish. Reef-safe formula that protects and nourishes all day long.",
    howToUse: "Apply as the last step of your AM routine. Blend 1–2 pumps across face and neck. Reapply every 2 hours in direct sunlight.",
    benefits: ["Broad-spectrum SPF 40", "Zero white cast", "Reef-safe actives", "24H hydration"],
    ingredients: "Aqua, Homosalate, Ethylhexyl Salicylate, Zinc Oxide (nano-free), Niacinamide 5%, Hyaluronic Acid, Shea Butter Extract, Green Tea Extract, Vitamin E, Ceramide NP.",
    sustain: [
      { icon: "🐠", label: "Reef-safe formula" },
      { icon: "🌿", label: "Vegan & Cruelty-Free" },
      { icon: "🧴", label: "BPA-free airless pump" },
      { icon: "💧", label: "Ocean-bound plastic packaging" },
    ],
  },
  {
    id: 3,
    name: "Petal Lip Treatment",
    subtitle: "Tinted Overnight Repair",
    category: "Lip Care · 8g",
    price: 1490,
    was: 2200,
    rating: 4.9,
    reviews: 2103,
    badge: "FAN FAVOURITE",
    badgeTone: "mauve",
    imgs: [
      "https://images.unsplash.com/photo-1631214499178-aef3d420eb30?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1586495777744-4e6232bf2f9a?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1599733589046-833f3220fe81?w=900&q=90&fit=crop",
    ],
    shades: [
      { name: "Petal Dew",   hex: "#F5C6D0", grad: G.petal },
      { name: "Rosewood",    hex: "#D8A0AC", grad: G.rose  },
      { name: "Berry Crush", hex: "#C8A0D8", grad: G.berry },
      { name: "Mauve Mist",  hex: "#DEC0DC", grad: G.mauve },
    ],
    tagline: "Sleep in it. Wake up with perfect lips.",
    description: "Ultra-rich peptide lip balm with tinted micro-pigments. Repairs, plumps, and tints overnight. Sheer by day, treatment by night.",
    howToUse: "Apply generously before bed. In the AM, enjoy visibly plumped and soft lips with a natural flush of colour. Layer for deeper tint.",
    benefits: ["Overnight lip repair", "Peptide plumping complex", "Sheer buildable tint", "Honey + ceramide barrier"],
    ingredients: "Petrolatum, Caprylic/Capric Triglyceride, Cera Alba, Mel Extract (Honey), Ceramide NP, Palmitoyl Tripeptide-5, CI 15850, CI 45410, Tocopherol.",
    sustain: [
      { icon: "🐝", label: "Ethically-sourced beeswax" },
      { icon: "🌿", label: "Cruelty-Free Certified" },
      { icon: "📦", label: "Compostable outer packaging" },
      { icon: "🌸", label: "Refill pod available" },
    ],
  },
  {
    id: 4,
    name: "Glass Skin Essence",
    subtitle: "Pore-Refining Prep Treatment",
    category: "Essence · 150ml",
    price: 1990,
    was: 2800,
    rating: 4.7,
    reviews: 614,
    badge: "TRENDING",
    badgeTone: "sage",
    imgs: [
      "https://images.unsplash.com/photo-1617897903246-719242758050?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=90&fit=crop",
      "https://images.unsplash.com/photo-1601049676869-702ea24cfd58?w=900&q=90&fit=crop",
    ],
    shades: [
      { name: "Sage Dew",   hex: "#C4D8C8", grad: G.sage  },
      { name: "Ivory Glow", hex: "#F5E6D0", grad: G.ivory },
    ],
    tagline: "The K-beauty secret. Finally, yours.",
    description: "Lightweight, water-thin essence with 95% naturally derived ingredients. Preps skin to absorb 80% more of your subsequent skincare. Fermented rice water + galactomyces at 1000ppm.",
    howToUse: "After cleansing, pour a coin-sized amount into palms. Press gently into skin in upward sweeping motions. Apply before serum and moisturiser.",
    benefits: ["Pore refinement", "+80% ingredient absorption", "Fermented rice water", "pH balanced at 5.5"],
    ingredients: "Galactomyces Ferment Filtrate (57%), Niacinamide 5%, Oryza Sativa (Rice) Ferment Filtrate, Bifida Ferment Lysate, Panthenol, Adenosine, Allantoin, Centella Asiatica.",
    sustain: [
      { icon: "🌾", label: "Rice farm co-operative sourced" },
      { icon: "🌿", label: "Vegan & Cruelty-Free" },
      { icon: "🔬", label: "Microbiome-tested formula" },
      { icon: "♻️", label: "Post-consumer recycled bottle" },
    ],
  },
];
