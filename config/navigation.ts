/**
 * Global navigation and category configuration for Oivaly.
 */

export interface NavCategory {
  title: string;
  titleEn: string;
  slug: string;
  href: string;
  description?: string;
  isFeatured?: boolean;
}

export interface FooterLink {
  title: string;
  href: string;
  isExternal?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

/**
 * Marketplace categories for desktop and mobile navigation.
 */
export const PROVISIONAL_CATEGORIES: NavCategory[] = [
  {
    title: 'Home & Living',
    titleEn: 'Home & Living',
    slug: 'home-living',
    href: '/categories/home-living',
    description: 'Nordic design, textiles, lighting, and thoughtful home accessories.',
    isFeatured: true,
  },
  {
    title: 'Jewelry & Accessories',
    titleEn: 'Jewelry & Accessories',
    slug: 'jewelry-accessories',
    href: '/categories/jewelry-accessories',
    description: 'Handcrafted jewelry, scarves, leather goods, and bags.',
    isFeatured: true,
  },
  {
    title: 'Clothing & Shoes',
    titleEn: 'Clothing & Shoes',
    slug: 'clothing-shoes',
    href: '/categories/clothing-shoes',
    description: 'Sustainable Nordic fashion made from premium natural materials.',
  },
  {
    title: 'Art & Ceramics',
    titleEn: 'Art & Ceramics',
    slug: 'art-ceramics',
    href: '/categories/art-ceramics',
    description: 'Unique studio ceramics, fine art prints, and glass sculptures.',
    isFeatured: true,
  },
  {
    title: 'Craft & Supplies',
    titleEn: 'Craft & Supplies',
    slug: 'craft-supplies',
    href: '/categories/craft-supplies',
    description: 'Yarns, woodwork materials, and traditional artisan craft supplies.',
  },
  {
    title: 'Gifts & Seasonal',
    titleEn: 'Gifts & Seasonal',
    slug: 'gifts-seasonal',
    href: '/categories/gifts-seasonal',
    description: 'Meaningful, memorable gifts for celebrations and special occasions.',
  },
  {
    title: 'Vintage & Collectibles',
    titleEn: 'Vintage & Collectibles',
    slug: 'vintage-collectibles',
    href: '/categories/vintage-collectibles',
    description: 'Classic Scandinavian mid-century design and rare heritage finds.',
  },
  {
    title: 'Nordic Living',
    titleEn: 'Nordic Living',
    slug: 'nordic-living',
    href: '/categories/nordic-living',
    description: 'Botanical self-care, sauna essentials, and hand-poured candles.',
  },
];

/**
 * Planned navigation links for the global header.
 */
export const HEADER_NAV_CONFIG = {
  announcement: 'Discover unique pieces from independent Nordic makers and small studios.',
  announcementEn: 'Discover unique pieces from independent Nordic makers and small studios.',
  searchPlaceholder: 'Search products, gifts and makers...',
  routes: {
    home: '/',
    search: '/search',
    wishlist: '/wishlist',
    cart: '/cart',
    login: '/login',
    register: '/register',
    account: '/account',
    orders: '/account/orders',
    sell: '/seller/signup',
    sellerLogin: '/seller/login',
    sellerSignup: '/seller/signup',
  },
};

/**
 * Global footer sections with planned marketplace routes.
 */
export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Shopping',
    links: [
      { title: 'All Categories', href: '/categories' },
      { title: 'New Arrivals', href: '/new-arrivals' },
      { title: 'Gift Ideas', href: '/gifts' },
      { title: 'Independent Makers', href: '/makers' },
      { title: 'Sustainability', href: '/sustainability' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { title: 'Help Center & FAQ', href: '/help' },
      { title: 'Shipping Information', href: '/shipping' },
      { title: 'Returns & Refunds', href: '/returns' },
      { title: 'Buyer Protection', href: '/buyer-protection' },
      { title: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'For Sellers',
    links: [
      { title: 'Become a Seller', href: '/seller/signup' },
      { title: 'Seller Portal Login', href: '/seller/login' },
      { title: 'Seller Handbook', href: '/seller-guide' },
      { title: 'Seller Terms', href: '/seller-terms' },
    ],
  },
  {
    title: 'About & Legal',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Preferences', href: '/cookies' },
    ],
  },
];
