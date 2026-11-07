/**
 * Demonstration fixtures for Oivaly.
 *
 * NOTE: These are presentation-only demonstration items used to establish
 * the editorial Scandinavian layout patterns. When live marketplace data
 * is available from the backend API, real items are prioritized.
 */

export interface DemoProductItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  vatRate: number;
  vatIncluded: boolean;
  storeName: string;
  storeCity: string;
  storeId: string;
  categoryName: string;
  categorySlug: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  isReturnEligible: boolean;
  rating?: number;
  reviewCount?: number;
  freeShipping?: boolean;
}

export interface DemoSellerItem {
  id: string;
  name: string;
  city: string;
  region: string;
  specialty: string;
  description: string;
  itemCount: number;
  avatarUrl: string;
  bannerUrl: string;
  joinedYear: number;
  rating?: number;
  reviewCount?: number;
  featuredProducts?: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  }>;
}

export interface DemoCollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  imageUrl: string;
  itemCount: number;
  tag: string;
}

export interface DemoReviewItem {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  productPrice: number;
  productImageUrl: string;
  productSlug: string;
  storeName: string;
}

export const DEMO_FEATURED_PRODUCTS: DemoProductItem[] = [
  {
    id: "demo-p1",
    name: "Handcrafted Ceramic Coffee Mug",
    slug: "handcrafted-ceramic-coffee-mug",
    price: 34.0,
    originalPrice: 40.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Kupittaa Ceramics",
    storeCity: "Turku",
    storeId: "store-kupittaa",
    categoryName: "Home & Living",
    categorySlug: "home-living",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Handcrafted ceramic mug with rustic matte glaze",
    badge: "Bestseller",
    isReturnEligible: true,
    rating: 4.9,
    reviewCount: 142,
    freeShipping: true,
  },
  {
    id: "demo-p2",
    name: "Pure Washed Linen Tablecloth (100% Linen)",
    slug: "pure-washed-linen-tablecloth",
    price: 78.0,
    originalPrice: 92.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Lapland Linen Studio",
    storeCity: "Rovaniemi",
    storeId: "store-lapin-pellava",
    categoryName: "Home & Living",
    categorySlug: "home-living",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Sand-grey washed linen tablecloth laid on rustic dining table",
    badge: "100% Linen",
    isReturnEligible: true,
    rating: 4.9,
    reviewCount: 88,
    freeShipping: true,
  },
  {
    id: "demo-p3",
    name: "Carved Solid Oak Serving Board",
    slug: "carved-solid-oak-serving-board",
    price: 52.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Helsinki Woodcraft",
    storeCity: "Helsinki",
    storeId: "store-hki-wood",
    categoryName: "Home & Living",
    categorySlug: "home-living",
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Hand-carved solid oak serving board with organic oiled finish",
    badge: "Handmade",
    isReturnEligible: true,
    rating: 5.0,
    reviewCount: 64,
    freeShipping: false,
  },
  {
    id: "demo-p4",
    name: "Natural Finnsheep Wool Blanket",
    slug: "natural-finnsheep-wool-blanket",
    price: 125.0,
    originalPrice: 145.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Nordic Wool Co.",
    storeCity: "Oulu",
    storeId: "store-pohjolan-villa",
    categoryName: "Home & Living",
    categorySlug: "home-living",
    imageUrl: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Soft domestic wool blanket draped over armchair",
    badge: "Pure Wool",
    isReturnEligible: true,
    rating: 4.8,
    reviewCount: 39,
    freeShipping: true,
  },
  {
    id: "demo-p5",
    name: "Soy Wax Candle 'Forest Mist' (Pine & Juniper)",
    slug: "soy-wax-candle-forest-mist",
    price: 24.5,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Aura Botanical",
    storeCity: "Naantali",
    storeId: "store-aura-botanical",
    categoryName: "Nordic Living",
    categorySlug: "nordic-living",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Hand-poured soy wax candle in amber glass jar",
    badge: "Organic",
    isReturnEligible: true,
    rating: 4.9,
    reviewCount: 95,
    freeShipping: false,
  },
  {
    id: "demo-p6",
    name: "Hand-Forged Sterling Silver Ring",
    slug: "hand-forged-sterling-silver-ring",
    price: 89.0,
    originalPrice: 110.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Kallio Silversmiths",
    storeCity: "Helsinki",
    storeId: "store-kallio-silver",
    categoryName: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Forged 925 sterling silver band ring with textured finish",
    badge: "Eco Silver",
    isReturnEligible: true,
    rating: 5.0,
    reviewCount: 52,
    freeShipping: true,
  },
  {
    id: "demo-p7",
    name: "Mouth-Blown Minimalist Glass Vase",
    slug: "mouth-blown-glass-vase",
    price: 64.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Nuutajärvi Glassworks",
    storeCity: "Urjala",
    storeId: "store-nuutajarvi",
    categoryName: "Art & Ceramics",
    categorySlug: "art-ceramics",
    imageUrl: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Forest-green mouth-blown glass vase bathed in natural light",
    badge: "Unique",
    isReturnEligible: true,
    rating: 4.8,
    reviewCount: 27,
    freeShipping: true,
  },
  {
    id: "demo-p8",
    name: "Vegetable-Tanned Leather Card Holder",
    slug: "vegetable-tanned-leather-card-holder",
    price: 45.0,
    vatRate: 25.5,
    vatIncluded: true,
    storeName: "Saimaa Leather Works",
    storeCity: "Savonlinna",
    storeId: "store-saimaa-leather",
    categoryName: "Jewelry & Accessories",
    categorySlug: "jewelry-accessories",
    imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Vegetable-tanned hand-stitched minimal leather card wallet",
    badge: "Crafted",
    isReturnEligible: true,
    rating: 4.9,
    reviewCount: 71,
    freeShipping: false,
  },
];

export const DEMO_FEATURED_SELLERS: DemoSellerItem[] = [
  {
    id: "store-kupittaa",
    name: "Kupittaa Ceramics",
    city: "Turku",
    region: "Southwest Finland",
    specialty: "Hand-thrown stoneware & studio glazes",
    description: "Crafting everyday ceramic wares in my riverside studio. Each cup and bowl is an individual piece combining function and Scandinavian form.",
    itemCount: 24,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=600&auto=format&fit=crop",
    joinedYear: 2024,
    rating: 4.9,
    reviewCount: 184,
    featuredProducts: [
      {
        id: "p-kup-1",
        name: "Stoneware Cup",
        price: 34.0,
        imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
        slug: "handcrafted-ceramic-coffee-mug",
      },
      {
        id: "p-kup-2",
        name: "Textured Bowl",
        price: 42.0,
        imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=300&auto=format&fit=crop",
        slug: "textured-ceramic-bowl",
      },
      {
        id: "p-kup-3",
        name: "Glazed Pitcher",
        price: 58.0,
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=300&auto=format&fit=crop",
        slug: "glazed-ceramic-pitcher",
      },
    ],
  },
  {
    id: "store-hki-wood",
    name: "Helsinki Woodcraft",
    city: "Helsinki",
    region: "Uusimaa",
    specialty: "Nordic solid hardwood joinery",
    description: "Sustainable woodwork made from Finnish oak, birch, and ash. Finished with food-safe natural cold-pressed oils.",
    itemCount: 18,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=600&auto=format&fit=crop",
    joinedYear: 2023,
    rating: 5.0,
    reviewCount: 128,
    featuredProducts: [
      {
        id: "p-wood-1",
        name: "Oak Board",
        price: 52.0,
        imageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=300&auto=format&fit=crop",
        slug: "carved-solid-oak-serving-board",
      },
      {
        id: "p-wood-2",
        name: "Birch Spoon Set",
        price: 28.0,
        imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=300&auto=format&fit=crop",
        slug: "carved-birch-spoon-set",
      },
      {
        id: "p-wood-3",
        name: "Ash Coasters",
        price: 36.0,
        imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=300&auto=format&fit=crop",
        slug: "ash-wood-coasters-set",
      },
    ],
  },
  {
    id: "store-lapin-pellava",
    name: "Lapland Linen Studio",
    city: "Rovaniemi",
    region: "Lapland",
    specialty: "Artisanal pure linen textiles",
    description: "Timeless, softened linen goods for dining, home, and sauna rituals. Natural linen crafted to endure for generations.",
    itemCount: 32,
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop",
    joinedYear: 2024,
    rating: 4.9,
    reviewCount: 210,
    featuredProducts: [
      {
        id: "p-lin-1",
        name: "Tablecloth",
        price: 78.0,
        imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=300&auto=format&fit=crop",
        slug: "pure-washed-linen-tablecloth",
      },
      {
        id: "p-lin-2",
        name: "Sauna Towel",
        price: 46.0,
        imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=300&auto=format&fit=crop",
        slug: "waffle-linen-sauna-towel",
      },
      {
        id: "p-lin-3",
        name: "Napkin Set (4)",
        price: 38.0,
        imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=300&auto=format&fit=crop",
        slug: "pure-linen-napkin-set",
      },
    ],
  },
  {
    id: "store-pohjolan-villa",
    name: "Nordic Wool Co.",
    city: "Oulu",
    region: "Northern Ostrobothnia",
    specialty: "100% natural Finnsheep wool",
    description: "Blankets, beanies, and wool scarves spun and woven from regional heritage flocks without harsh synthetic chemicals.",
    itemCount: 15,
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1528458876885-b152d13ecb34?q=80&w=600&auto=format&fit=crop",
    joinedYear: 2025,
    rating: 4.8,
    reviewCount: 96,
    featuredProducts: [
      {
        id: "p-wool-1",
        name: "Wool Throw",
        price: 125.0,
        imageUrl: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=300&auto=format&fit=crop",
        slug: "natural-finnsheep-wool-blanket",
      },
      {
        id: "p-wool-2",
        name: "Knit Beanie",
        price: 48.0,
        imageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=300&auto=format&fit=crop",
        slug: "finnsheep-ribbed-wool-beanie",
      },
      {
        id: "p-wool-3",
        name: "Wool Mittens",
        price: 42.0,
        imageUrl: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=300&auto=format&fit=crop",
        slug: "hand-knitted-wool-mittens",
      },
    ],
  },
];

export const DEMO_CURATED_COLLECTIONS: DemoCollectionItem[] = [
  {
    id: "col-kitchen",
    title: "The Nordic Dining Table",
    subtitle: "Artisanal Tableware",
    description: "Oak boards, stoneware ceramics, and washed linen textiles for slow breakfasts and shared dinners.",
    slug: "home-living",
    imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=800&auto=format&fit=crop",
    itemCount: 48,
    tag: "Dining & Living",
  },
  {
    id: "col-warmth",
    title: "Natural Comfort & Hygge",
    subtitle: "Tactile Warmth",
    description: "Pure Finnsheep wool throws, hand-poured botanical candles, and natural textures designed for cozy evenings.",
    slug: "nordic-living",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop",
    itemCount: 36,
    tag: "Hygge & Home",
  },
  {
    id: "col-artisan",
    title: "The Artisan's Atelier",
    subtitle: "Studio Craft & Pottery",
    description: "Unique small-batch creations, forged silver jewelry, and mouth-blown glassware from independent studios.",
    slug: "art-ceramics",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=800&auto=format&fit=crop",
    itemCount: 52,
    tag: "Studio Craft",
  },
];

export const DEMO_CUSTOMER_REVIEWS: DemoReviewItem[] = [
  {
    id: "rev-1",
    author: "Sofia L.",
    city: "Helsinki",
    rating: 5,
    date: "2 days ago",
    comment: "The ceramic mug has such a comforting weight, and the matte glaze is simply exquisite. It arrived with a handwritten note from the Turku studio. Truly special.",
    productName: "Handcrafted Ceramic Coffee Mug",
    productPrice: 34.0,
    productImageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
    productSlug: "handcrafted-ceramic-coffee-mug",
    storeName: "Kupittaa Ceramics",
  },
  {
    id: "rev-2",
    author: "Mikko K.",
    city: "Tampere",
    rating: 5,
    date: "1 week ago",
    comment: "The washed linen tablecloth transformed our dining room. Soft, heavy drape, and washes beautifully without losing its organic texture. High quality European flax.",
    productName: "Pure Washed Linen Tablecloth",
    productPrice: 78.0,
    productImageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=300&auto=format&fit=crop",
    productSlug: "pure-washed-linen-tablecloth",
    storeName: "Lapland Linen Studio",
  },
  {
    id: "rev-3",
    author: "Elena S.",
    city: "Espoo",
    rating: 5,
    date: "2 weeks ago",
    comment: "Exceptional woodwork quality! The grain of the solid Finnish oak is stunning, and knowing it came straight from a workshop in Helsinki makes all the difference.",
    productName: "Carved Solid Oak Serving Board",
    productPrice: 52.0,
    productImageUrl: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=300&auto=format&fit=crop",
    productSlug: "carved-solid-oak-serving-board",
    storeName: "Helsinki Woodcraft",
  },
];
