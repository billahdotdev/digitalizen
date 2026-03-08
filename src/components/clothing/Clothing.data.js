// Clothing.data.js — আড়ং রেশম · Final Production Data

export const STORE_CONFIG = {
  name: "আড়ং রেশম",
  nameEn: "Aarong Resham",
  tagline: "পুরুষের পোশাকে নতুন সংজ্ঞা",
  currency: "৳",
  whatsapp: "+8801700000000",
  instagram: "@aarongresham",
  facebook: "fb.com/aarongresham",
  deliveryAreas: [
    { label: "ঢাকার ভেতরে", labelEn: "Inside Dhaka",   fee: 60  },
    { label: "ঢাকার বাইরে", labelEn: "Outside Dhaka",  fee: 120 },
    { label: "প্রত্যন্ত অঞ্চল", labelEn: "Remote Area", fee: 180 },
  ],
};

export const FORM_CONFIG = {
  ACTION_URL: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
  FIELDS: {
    name:     "entry.111111111",
    phone:    "entry.222222222",
    address:  "entry.333333333",
    product:  "entry.444444444",
    color:    "entry.555555555",
    size:     "entry.666666666",
    quantity: "entry.777777777",
    delivery: "entry.888888888",
    total:    "entry.999999999",
    note:     "entry.101010101",
  },
};

export const CATEGORIES = [
  { id: "all",    label: "সব",         labelEn: "All",     icon: "◈" },
  { id: "shirt",  label: "শার্ট",      labelEn: "Shirt",   icon: "◈" },
  { id: "pant",   label: "প্যান্ট",    labelEn: "Pant",    icon: "◈" },
  { id: "polo",   label: "পোলো শার্ট", labelEn: "Polo",    icon: "◈" },
  { id: "tshirt", label: "টি-শার্ট",   labelEn: "T-Shirt", icon: "◈" },
];

export const PRODUCTS = [
  // ── SHIRTS ──
  {
    id: 1, category: "shirt",
    name: "অক্সফোর্ড ফর্মাল শার্ট", nameEn: "Oxford Formal Shirt",
    price: 1850, originalPrice: 2400, badge: "bestseller",
    fabric: "১০০% কটন অক্সফোর্ড",
    description: "অফিস থেকে ডিনার — সব জায়গায় মানানসই। প্রিমিয়াম অক্সফোর্ড কটনে তৈরি, বোতাম-ডাউন কলার, রেগুলার ফিট।",
    images: [
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&q=80",
      "https://images.unsplash.com/photo-1563630423918-b58bef0bf951?w=600&q=80",
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4f63?w=600&q=80",
    ],
    colors: [
      { name: "সাদা",       nameEn: "White",      hex: "#F5F3EF" },
      { name: "আকাশি নীল",  nameEn: "Sky Blue",   hex: "#7BAFD4" },
      { name: "হালকা ধূসর", nameEn: "Light Grey", hex: "#C8C8C8" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 2, category: "shirt",
    name: "লিনেন কাজুয়াল শার্ট", nameEn: "Linen Casual Shirt",
    price: 2200, originalPrice: 2800, badge: "new",
    fabric: "খাঁটি লিনেন",
    description: "গরমে আরামদায়ক লিনেন শার্ট। ক্যাজুয়াল কাটায় স্মার্ট লুক, ঘামের দিনেও ফ্রেশ থাকুন।",
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
      "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=600&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
      "https://images.unsplash.com/photo-1530743932532-f6d7cc9e4e3a?w=600&q=80",
    ],
    colors: [
      { name: "বালি",      nameEn: "Sand",       hex: "#D4B896" },
      { name: "সাগর সবুজ", nameEn: "Sage",       hex: "#8BAF89" },
      { name: "টেরাকোটা",  nameEn: "Terracotta", hex: "#C47B5A" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 3, category: "shirt",
    name: "চেক ফ্ল্যানেল শার্ট", nameEn: "Check Flannel Shirt",
    price: 1650, originalPrice: null, badge: null,
    fabric: "ফ্ল্যানেল কটন",
    description: "ক্লাসিক চেক প্যাটার্নে মডার্ন কাট। শীতের দিনে জ্যাকেটের ভেতরেও পরুন — দুটোতেই চমৎকার।",
    images: [
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1619603364930-26f7eaf4efee?w=600&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
      "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=600&q=80",
    ],
    colors: [
      { name: "লাল-নেভি", nameEn: "Red Navy",   hex: "#8B2030" },
      { name: "সবুজ-নীল", nameEn: "Green Blue",  hex: "#2A4A5A" },
    ],
    sizes: ["M", "L", "XL", "XXL"], inStock: true,
  },

  // ── PANTS ──
  {
    id: 4, category: "pant",
    name: "স্লিম ফিট চিনো প্যান্ট", nameEn: "Slim Fit Chino Pant",
    price: 2400, originalPrice: 3000, badge: "bestseller",
    fabric: "স্ট্রেচ চিনো",
    description: "অফিস-ক্যাজুয়াল পার্ফেক্ট। স্লিম ফিট কাট, স্ট্রেচ ফ্যাব্রিক — সারাদিন পরলেও আরাম কমে না।",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
    ],
    colors: [
      { name: "নেভি ব্লু",  nameEn: "Navy",     hex: "#1E2D4E" },
      { name: "খাকি",       nameEn: "Khaki",    hex: "#C4A265" },
      { name: "অলিভ",       nameEn: "Olive",    hex: "#5A6A2A" },
      { name: "চারকোল",     nameEn: "Charcoal", hex: "#3A3A3A" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"], inStock: true,
  },
  {
    id: 5, category: "pant",
    name: "কার্গো প্যান্ট", nameEn: "Cargo Pant",
    price: 2800, originalPrice: 3400, badge: "new",
    fabric: "রিপস্টপ কটন",
    description: "স্টাইল আর ফাংশনালিটির মিলন। ৬টি পকেট, টেপার্ড লেগ — স্ট্রিটওয়্যার থেকে ক্যাম্পাস সব জায়গায়।",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
    ],
    colors: [
      { name: "অলিভ গ্রিন", nameEn: "Olive",  hex: "#5A6A2A" },
      { name: "বেজ",         nameEn: "Beige",  hex: "#D4B896" },
      { name: "ব্ল্যাক",     nameEn: "Black",  hex: "#1A1A1A" },
    ],
    sizes: ["28", "30", "32", "34", "36"], inStock: true,
  },
  {
    id: 6, category: "pant",
    name: "ফরমাল ট্রাউজার", nameEn: "Formal Trouser",
    price: 2100, originalPrice: 2600, badge: null,
    fabric: "পলি-ভিসকোজ",
    description: "অফিসের জন্য আদর্শ। ক্রিজ লাইন, ফ্ল্যাট ফ্রন্ট ডিজাইন — সব ফর্মাল শার্টের সাথে মানানসই।",
    images: [
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600&q=80",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&q=80",
    ],
    colors: [
      { name: "চারকোল",    nameEn: "Charcoal", hex: "#3A3A3A" },
      { name: "নেভি",      nameEn: "Navy",     hex: "#1E2D4E" },
      { name: "স্টোন গ্রে", nameEn: "Stone",   hex: "#9A9490" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"], inStock: true,
  },

  // ── POLO ──
  {
    id: 7, category: "polo",
    name: "পিকে পোলো শার্ট", nameEn: "Pique Polo Shirt",
    price: 1400, originalPrice: 1800, badge: "bestseller",
    fabric: "পিকে কটন",
    description: "স্মার্ট ক্যাজুয়ালের সেরা পছন্দ। ক্লাসিক পিকে ফ্যাব্রিক, ২ বোতাম প্ল্যাকেট — গরমেও ফ্রেশ।",
    images: [
      "https://images.unsplash.com/photo-1625910513596-cf67be9ff60e?w=600&q=80",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=600&q=80",
      "https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?w=600&q=80",
      "https://images.unsplash.com/photo-1572495641004-28421ae1b0b4?w=600&q=80",
    ],
    colors: [
      { name: "সাদা",      nameEn: "White",    hex: "#F5F3EF" },
      { name: "নেভি",      nameEn: "Navy",     hex: "#1E2D4E" },
      { name: "বোতল সবুজ", nameEn: "Bottle",  hex: "#1E4030" },
      { name: "বারগান্ডি", nameEn: "Burgundy", hex: "#6E1E30" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 8, category: "polo",
    name: "স্লিম ফিট পোলো", nameEn: "Slim Fit Polo",
    price: 1600, originalPrice: 2000, badge: "new",
    fabric: "মার্সেরাইজড কটন",
    description: "বডি-ফিট কাটায় আধুনিক পোলো। প্রিমিয়াম মার্সেরাইজড কটন — পরলে শরীরে লাগে রেশমের মতো।",
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
      "https://images.unsplash.com/photo-1625910513596-cf67be9ff60e?w=600&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=600&q=80",
      "https://images.unsplash.com/photo-1572495641004-28421ae1b0b4?w=600&q=80",
      "https://images.unsplash.com/photo-1523381140794-a1eef18a37c7?w=600&q=80",
    ],
    colors: [
      { name: "স্কাই ব্লু", nameEn: "Sky",      hex: "#7BAFD4" },
      { name: "মিন্ট",      nameEn: "Mint",     hex: "#7DBFAA" },
      { name: "লাভেন্ডার",  nameEn: "Lavender", hex: "#9A8CBD" },
    ],
    sizes: ["S", "M", "L", "XL"], inStock: true,
  },

  // ── T-SHIRTS ──
  {
    id: 9, category: "tshirt",
    name: "ক্লাসিক ক্রু-নেক টি", nameEn: "Classic Crew-Neck Tee",
    price: 750, originalPrice: 1000, badge: "bestseller",
    fabric: "১৮০ GSM কটন",
    description: "ওয়ার্ডরোবের সবচেয়ে দরকারি পিস। হেভিওয়েট ১৮০ GSM কটন — ওয়াশের পরেও আকার নষ্ট হয় না।",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80",
    ],
    colors: [
      { name: "ব্ল্যাক",     nameEn: "Black",  hex: "#1A1A1A" },
      { name: "সাদা",        nameEn: "White",  hex: "#F5F3EF" },
      { name: "নেভি",        nameEn: "Navy",   hex: "#1E2D4E" },
      { name: "আর্মি গ্রিন", nameEn: "Army",   hex: "#4A5A30" },
      { name: "মেরুন",       nameEn: "Maroon", hex: "#6E1E30" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 10, category: "tshirt",
    name: "গ্রাফিক প্রিন্ট টি-শার্ট", nameEn: "Graphic Print Tee",
    price: 950, originalPrice: 1200, badge: "new",
    fabric: "সফট জার্সি কটন",
    description: "আর্টিস্টিক গ্রাফিক প্রিন্ট, ওভারসাইজড ফিট। বাংলাদেশি শিল্পীদের ডিজাইনে — প্রতিটা পিস ইউনিক।",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    ],
    colors: [
      { name: "ব্ল্যাক",     nameEn: "Black",   hex: "#1A1A1A" },
      { name: "অফ হোয়াইট",  nameEn: "Ecru",    hex: "#EDE8DC" },
      { name: "ওয়াশড ব্লু",  nameEn: "Washed",  hex: "#7A9AB8" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 11, category: "tshirt",
    name: "ওভারসাইজ ড্রপ শোল্ডার", nameEn: "Oversized Drop Shoulder",
    price: 1100, originalPrice: 1400, badge: "limited",
    fabric: "ব্রাশড কটন",
    description: "স্ট্রিটওয়্যার ভাইব। ড্রপ শোল্ডার কাট, ওভারসাইজড বডি — তরুণ প্রজন্মের ফেভারিট।",
    images: [
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    ],
    colors: [
      { name: "আশ গ্রে",  nameEn: "Ash",   hex: "#B0ABA4" },
      { name: "ক্রিম",    nameEn: "Cream", hex: "#EDE8DC" },
      { name: "বেবি ব্লু", nameEn: "Baby",  hex: "#A8C8E0" },
    ],
    sizes: ["M", "L", "XL", "XXL"], inStock: true,
  },
  {
    id: 12, category: "tshirt",
    name: "পকেট টি-শার্ট", nameEn: "Pocket Tee",
    price: 680, originalPrice: null, badge: null,
    fabric: "স্লাব কটন",
    description: "সিম্পল ইজ বেস্ট। বাঁ-বুকে ছোট পকেট, স্লাব কটনের প্রাকৃতিক টেক্সচার — মিনিমালিস্টের পছন্দ।",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    ],
    colors: [
      { name: "ন্যাচারাল", nameEn: "Natural", hex: "#D8CFC0" },
      { name: "স্লেট",     nameEn: "Slate",   hex: "#708090" },
      { name: "পিচ",       nameEn: "Peach",   hex: "#FFCBA4" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"], inStock: false,
  },
];

export const TESTIMONIALS = [
  {
    id: 1, name: "রাফি আহমেদ", location: "ঢাকা", avatar: "রা",
    text: "অক্সফোর্ড শার্টটা হাতে পেয়ে অবাক হলাম। এই দামে এই মান সত্যিই অবিশ্বাস্য। দ্বিতীয়বার অর্ডার করেছি।",
    rating: 5, product: "অক্সফোর্ড ফর্মাল শার্ট",
  },
  {
    id: 2, name: "তানভীর হাসান", location: "চট্টগ্রাম", avatar: "তা",
    text: "চিনো প্যান্ট পরে অফিসে গেলাম, সবাই জিজ্ঞেস করল কোথা থেকে কিনলাম! ডেলিভারিও অনেক দ্রুত।",
    rating: 5, product: "স্লিম ফিট চিনো প্যান্ট",
  },
  {
    id: 3, name: "ইমরান খান", location: "সিলেট", avatar: "ই",
    text: "পোলো শার্টের ফ্যাব্রিক এত ভালো যে গরমেও ঘাম হয় না। অবশ্যই আবার কিনব।",
    rating: 5, product: "পিকে পোলো শার্ট",
  },
  {
    id: 4, name: "সাজ্জাদ হোসেন", location: "রাজশাহী", avatar: "সা",
    text: "ক্লাসিক টি-শার্ট ১০ বার ধোয়ার পরেও আকার একই আছে। কোয়ালিটিতে কোনো আপস নেই।",
    rating: 5, product: "ক্লাসিক ক্রু-নেক টি",
  },
];
