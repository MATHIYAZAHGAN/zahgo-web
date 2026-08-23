import { Product } from '../models/product.model';
import { Coupon } from '../models/coupon.model';

// ============================================================================
// MOCK DATA - DEPRECATED - NOW USING BACKEND API
// ============================================================================
// This file contains mock data that was previously used for development.
// All data now comes from the backend API running on http://localhost:5041
// These exports are kept for reference only and should NOT be imported.
// ============================================================================

/* DEPRECATED - Use CategoryService to fetch from API
export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'Electronics', slug: 'electronics', icon: 'zap', itemCount: 128, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-2', name: 'Men Fashion', slug: 'men-fashion', icon: 'user', itemCount: 215, image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-3', name: 'Women Fashion', slug: 'women-fashion', icon: 'heart', itemCount: 340, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-4', name: 'Home & Living', slug: 'home-living', icon: 'home', itemCount: 95, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', icon: 'watch', itemCount: 180, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-6', name: 'Footwear', slug: 'footwear', icon: 'shopping-bag', itemCount: 142, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-7', name: 'Fragrance & Beauty', slug: 'beauty-fragrance', icon: 'sparkles', itemCount: 86, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80' },
  { id: 'cat-8', name: 'Sports & Fitness', slug: 'sports-fitness', icon: 'activity', itemCount: 110, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' }
];
*/

/* DEPRECATED - Use ProductService to fetch from API
export const MOCK_PRODUCTS: Product[] = [
  // 1. Electronics
  {
    id: 'zah-p1',
    name: 'ZAH SoundPro Wireless ANC Headphones',
    slug: 'zah-soundpro-wireless-anc-headphones',
    brand: 'ZAH Audio',
    category: 'Electronics',
    categoryId: 'cat-1',
    price: 4999,
    originalPrice: 7999,
    discountPercentage: 38,
    rating: 4.8,
    reviewCount: 342,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Immerse yourself in crystal-clear studio audio with active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.',
    shortDescription: 'Active Noise Cancelling Headphones with 40-Hour Playtime.',
    inStock: true,
    stockCount: 14,
    isNew: true,
    isBestSeller: true,
    isTrending: true,
    isFlashSale: true,
    availableColors: [
      { name: 'Midnight Black', hex: '#0f172a' },
      { name: 'Silver Slate', hex: '#94a3b8' },
      { name: 'Champagne Gold', hex: '#d4af37' }
    ],
    specifications: [
      { name: 'Bluetooth Version', value: '5.3' },
      { name: 'Battery Life', value: '40 Hours (ANC On)' },
      { name: 'Driver Size', value: '40mm Dynamic' },
      { name: 'Charging Port', value: 'USB Type-C Fast Charge' }
    ],
    reviews: [
      { id: 'r1', userName: 'Arjun K.', rating: 5, date: '12 Aug 2026', comment: 'Exceptional ANC quality and deep rich bass. Comparable to top luxury brands!', verifiedPurchase: true },
      { id: 'r2', userName: 'Priya S.', rating: 4.5, date: '05 Aug 2026', comment: 'Battery easily lasts 3+ days of heavy work calls.', verifiedPurchase: true }
    ]
  },
  {
    id: 'zah-p7',
    name: 'ZAH Horizon OLED Cinema Display 4K',
    slug: 'zah-horizon-oled-cinema-display-4k',
    brand: 'ZAH Tech',
    category: 'Electronics',
    categoryId: 'cat-1',
    price: 44999,
    originalPrice: 59999,
    discountPercentage: 25,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Self-lit OLED pixels delivering perfect blacks, 120Hz refresh rate, Dolby Vision IQ, and AI Atmos surround acoustics.',
    shortDescription: '55" Cinema 4K OLED TV with 120Hz Refresh Rate.',
    inStock: true,
    stockCount: 4,
    isBestSeller: true,
    specifications: [
      { name: 'Display Panel', value: '4K Ultra HD Self-Lit OLED' },
      { name: 'Refresh Rate', value: '120Hz Variable (VRR)' },
      { name: 'HDR Standards', value: 'Dolby Vision, HDR10+, HLG' }
    ]
  },
  {
    id: 'zah-p9',
    name: 'ZAH AirBuds Pro True Wireless Earbuds',
    slug: 'zah-airbuds-pro-true-wireless-earbuds',
    brand: 'ZAH Audio',
    category: 'Electronics',
    categoryId: 'cat-1',
    price: 2999,
    originalPrice: 4999,
    discountPercentage: 40,
    rating: 4.7,
    reviewCount: 285,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Compact spatial audio earbuds with adaptive transparency mode, IPX5 water resistance, and wireless charging case.',
    shortDescription: 'TWS Spatial Earbuds with Wireless Charging.',
    inStock: true,
    stockCount: 30,
    isFlashSale: true,
    availableColors: [
      { name: 'Pearl White', hex: '#f8fafc' },
      { name: 'Onyx Black', hex: '#0f172a' }
    ]
  },
  {
    id: 'zah-p10',
    name: 'ZAH Mechanical Gaming Keyboard RGB',
    slug: 'zah-mechanical-gaming-keyboard-rgb',
    brand: 'ZAH Tech',
    category: 'Electronics',
    categoryId: 'cat-1',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 194,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hot-swappable tactile mechanical switches, aircraft-grade aluminum top plate, and customizable per-key RGB backlighting.',
    shortDescription: 'Hot-Swappable Aluminum RGB Mechanical Keyboard.',
    inStock: true,
    stockCount: 18,
    isTrending: true
  },

  // 2. Accessories & Timepieces
  {
    id: 'zah-p2',
    name: 'ZAH Minimalist Luxe Chronograph Watch',
    slug: 'zah-minimalist-luxe-chronograph-watch',
    brand: 'ZAH Timepieces',
    category: 'Accessories',
    categoryId: 'cat-5',
    price: 6499,
    originalPrice: 9999,
    discountPercentage: 35,
    rating: 4.9,
    reviewCount: 218,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Precision Japanese quartz movement housed in scratch-resistant sapphire crystal casing with a genuine Italian leather strap.',
    shortDescription: 'Sapphire Crystal Quartz Watch with Italian Leather Strap.',
    inStock: true,
    stockCount: 8,
    isBestSeller: true,
    isTrending: true,
    availableColors: [
      { name: 'Classic Tan', hex: '#8b5cf6' },
      { name: 'Onyx Black', hex: '#18181b' }
    ],
    specifications: [
      { name: 'Movement', value: 'Japanese Quartz Chronograph' },
      { name: 'Water Resistance', value: '5 ATM / 50M' },
      { name: 'Case Diameter', value: '41mm' }
    ]
  },
  {
    id: 'zah-p8',
    name: 'ZAH Italian Full-Grain Leather Duffel',
    slug: 'zah-italian-full-grain-leather-duffel',
    brand: 'ZAH Leatherworks',
    category: 'Accessories',
    categoryId: 'cat-5',
    price: 9499,
    originalPrice: 14999,
    discountPercentage: 36,
    rating: 4.9,
    reviewCount: 167,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted weekend carry-all duffel bag made from vegetable-tanned Italian leather with solid brass YKK zippers.',
    shortDescription: 'Handcrafted Vegetable-Tanned Leather Duffel Bag.',
    inStock: true,
    stockCount: 9,
    isTrending: true
  },
  {
    id: 'zah-p11',
    name: 'ZAH Polarized Aviator Sunglasses',
    slug: 'zah-polarized-aviator-sunglasses',
    brand: 'ZAH Eyewear',
    category: 'Accessories',
    categoryId: 'cat-5',
    price: 2499,
    originalPrice: 3999,
    discountPercentage: 37,
    rating: 4.6,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hand-polished titanium metal frame with 100% UV400 anti-glare polarized lenses for optimal clarity and style.',
    shortDescription: 'Titanium Aviators with UV400 Polarized Lenses.',
    inStock: true,
    stockCount: 25,
    isNew: true
  },

  // 3. Men Fashion
  {
    id: 'zah-p3',
    name: 'ZAH Executive Merino Wool Blazer',
    slug: 'zah-executive-merino-wool-blazer',
    brand: 'ZAH Tailored',
    category: 'Men Fashion',
    categoryId: 'cat-2',
    price: 8999,
    originalPrice: 12999,
    discountPercentage: 30,
    rating: 4.7,
    reviewCount: 154,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted from 100% fine Merino wool, featuring a tailored modern fit, notch lapel, and pick-stitch details for refined formal dressing.',
    shortDescription: '100% Fine Merino Wool Tailored Blazer.',
    inStock: true,
    stockCount: 5,
    isNew: true,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Navy Blue', hex: '#1e3a8a' },
      { name: 'Charcoal Grey', hex: '#334155' }
    ]
  },
  {
    id: 'zah-p12',
    name: 'ZAH Egyptian Cotton Tuxedo Shirt',
    slug: 'zah-egyptian-cotton-tuxedo-shirt',
    brand: 'ZAH Tailored',
    category: 'Men Fashion',
    categoryId: 'cat-2',
    price: 3499,
    originalPrice: 4999,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80'
    ],
    description: '200-count double ply Egyptian cotton dress shirt with french cuffs and subtle pleated front detail.',
    shortDescription: '200-Count Egyptian Cotton French Cuff Shirt.',
    inStock: true,
    stockCount: 16,
    availableSizes: ['38', '40', '42', '44']
  },
  {
    id: 'zah-p13',
    name: 'ZAH Urban Suede Bomber Jacket',
    slug: 'zah-urban-suede-bomber-jacket',
    brand: 'ZAH Outerwear',
    category: 'Men Fashion',
    categoryId: 'cat-2',
    price: 7999,
    originalPrice: 11999,
    discountPercentage: 33,
    rating: 4.9,
    reviewCount: 176,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Butter-soft goat suede bomber jacket featuring ribbed wool cuffs, antique brass hardware, and satin lining.',
    shortDescription: 'Genuine Soft Suede Leather Bomber Jacket.',
    inStock: true,
    stockCount: 7,
    isBestSeller: true,
    availableSizes: ['M', 'L', 'XL']
  },

  // 4. Women Fashion
  {
    id: 'zah-p4',
    name: 'ZAH Aura Silk Evening Dress',
    slug: 'zah-aura-silk-evening-dress',
    brand: 'ZAH Couture',
    category: 'Women Fashion',
    categoryId: 'cat-3',
    price: 7499,
    originalPrice: 10999,
    discountPercentage: 32,
    rating: 4.9,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elegantly draped mulberry silk midi dress with cowl neckline and adjustable shoulder straps for special occasions.',
    shortDescription: '100% Mulberry Silk Draped Midi Dress.',
    inStock: true,
    stockCount: 12,
    isBestSeller: true,
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Emerald Green', hex: '#065f46' },
      { name: 'Ruby Red', hex: '#991b1b' },
      { name: 'Champagne', hex: '#d4af37' }
    ]
  },
  {
    id: 'zah-p14',
    name: 'ZAH Cashmere Knit Turtleneck Sweater',
    slug: 'zah-cashmere-knit-turtleneck-sweater',
    brand: 'ZAH Luxe Knitwear',
    category: 'Women Fashion',
    categoryId: 'cat-3',
    price: 5999,
    originalPrice: 8999,
    discountPercentage: 33,
    rating: 4.8,
    reviewCount: 134,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pure Mongolian 2-ply cashmere sweater with seamless rib-knit construction and ultra-soft plush feel.',
    shortDescription: '100% Pure Mongolian Cashmere Sweater.',
    inStock: true,
    stockCount: 15,
    isNew: true,
    availableSizes: ['S', 'M', 'L'],
    availableColors: [
      { name: 'Cream Oat', hex: '#fef3c7' },
      { name: 'Dusty Rose', hex: '#f43f5e' }
    ]
  },
  {
    id: 'zah-p15',
    name: 'ZAH Linen Resort Wrap Jumpsuit',
    slug: 'zah-linen-resort-wrap-jumpsuit',
    brand: 'ZAH Resortwear',
    category: 'Women Fashion',
    categoryId: 'cat-3',
    price: 4299,
    originalPrice: 5999,
    discountPercentage: 28,
    rating: 4.7,
    reviewCount: 91,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
    ],
    description: '100% French flax breathable linen jumpsuit with detachable sash belt and wide leg silhouette.',
    shortDescription: '100% French Flax Breathable Linen Jumpsuit.',
    inStock: true,
    stockCount: 11
  },

  // 5. Footwear
  {
    id: 'zah-p5',
    name: 'ZAH Velocity Running Sneakers',
    slug: 'zah-velocity-running-sneakers',
    brand: 'ZAH Athletic',
    category: 'Footwear',
    categoryId: 'cat-6',
    price: 3999,
    originalPrice: 5999,
    discountPercentage: 33,
    rating: 4.6,
    reviewCount: 420,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-lightweight mesh knit upper combined with responsive NITRO foam midsole for maximum energy return during marathons and daily runs.',
    shortDescription: 'Responsive Nitrogen-Infused Performance Runners.',
    inStock: true,
    stockCount: 22,
    isTrending: true,
    isFlashSale: true,
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11']
  },
  {
    id: 'zah-p16',
    name: 'ZAH Chelsea Goodyear Welted Boots',
    slug: 'zah-chelsea-goodyear-welted-boots',
    brand: 'ZAH Footwear',
    category: 'Footwear',
    categoryId: 'cat-6',
    price: 8499,
    originalPrice: 11999,
    discountPercentage: 29,
    rating: 4.9,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Crafted with Goodyear welt construction, full-grain Italian calfskin, and elastic side gussets for durable luxury footwear.',
    shortDescription: 'Handcrafted Goodyear Welted Leather Chelsea Boots.',
    inStock: true,
    stockCount: 9,
    isBestSeller: true,
    availableSizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10']
  },
  {
    id: 'zah-p17',
    name: 'ZAH Stiletto Leather Pumps',
    slug: 'zah-stiletto-leather-pumps',
    brand: 'ZAH Couture',
    category: 'Footwear',
    categoryId: 'cat-6',
    price: 5499,
    originalPrice: 7999,
    discountPercentage: 31,
    rating: 4.7,
    reviewCount: 118,
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Sleek 85mm pointed toe stiletto pumps with padded memory foam footbed and non-slip leather outsole.',
    shortDescription: '85mm Pointed Toe Italian Calfskin Stiletto Pumps.',
    inStock: true,
    stockCount: 14,
    availableSizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7']
  },

  // 6. Home & Living
  {
    id: 'zah-p6',
    name: 'ZAH Ceramic Espresso & Brew Station',
    slug: 'zah-ceramic-espresso-brew-station',
    brand: 'ZAH Living',
    category: 'Home & Living',
    categoryId: 'cat-4',
    price: 11999,
    originalPrice: 16999,
    discountPercentage: 29,
    rating: 4.8,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9eaa03afd2af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    description: '19-bar Italian pump espresso machine with integrated milk frother wand and precision thermoblock heating for coffee connoisseurs.',
    shortDescription: '19-Bar Italian Pump Professional Espresso Machine.',
    inStock: true,
    stockCount: 6,
    isNew: true
  },
  {
    id: 'zah-p18',
    name: 'ZAH Hand-Poured Scented Soy Candle Trio',
    slug: 'zah-hand-poured-scented-soy-candle-trio',
    brand: 'ZAH Living',
    category: 'Home & Living',
    categoryId: 'cat-4',
    price: 1999,
    originalPrice: 2999,
    discountPercentage: 33,
    rating: 4.9,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Set of 3 luxury aromatherapy candles (Amber Oud, Wild Fig, Sandalwood Vanilla) in matte ceramic vessels.',
    shortDescription: 'Aromatherapy Soy Wax Candle Set in Ceramic Vessels.',
    inStock: true,
    stockCount: 35,
    isTrending: true
  },
  {
    id: 'zah-p19',
    name: 'ZAH Egyptian Cotton 800-TC Sheet Set',
    slug: 'zah-egyptian-cotton-800-tc-sheet-set',
    brand: 'ZAH Living',
    category: 'Home & Living',
    categoryId: 'cat-4',
    price: 6999,
    originalPrice: 9999,
    discountPercentage: 30,
    rating: 4.8,
    reviewCount: 165,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
    ],
    description: '800-thread count extra-long staple Egyptian cotton sateen weave sheet set including fitted sheet, flat sheet, and 2 pillowcases.',
    shortDescription: '800 Thread Count Egyptian Cotton Sateen Bedding.',
    inStock: true,
    stockCount: 12
  },

  // 7. Fragrance & Beauty
  {
    id: 'zah-p20',
    name: 'ZAH Velvet Oud Eau De Parfum 100ml',
    slug: 'zah-velvet-oud-eau-de-parfum-100ml',
    brand: 'ZAH Parfums',
    category: 'Fragrance & Beauty',
    categoryId: 'cat-7',
    price: 4999,
    originalPrice: 6999,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 275,
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'An intoxicating blend of Cambodian agarwood, Damascus rose, and warm amber resin crafted in Grasse, France.',
    shortDescription: 'Luxurious Niche Oud & Rose Parfum 100ml.',
    inStock: true,
    stockCount: 20,
    isBestSeller: true,
    isFlashSale: true
  },
  {
    id: 'zah-p21',
    name: 'ZAH Radiance Vitamin C Botanical Serum',
    slug: 'zah-radiance-vitamin-c-botanical-serum',
    brand: 'ZAH Botanicals',
    category: 'Fragrance & Beauty',
    categoryId: 'cat-7',
    price: 1899,
    originalPrice: 2499,
    discountPercentage: 24,
    rating: 4.8,
    reviewCount: 310,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597266-c89a9f43f05b?auto=format&fit=crop&w=800&q=80'
    ],
    description: '20% active L-ascorbic acid blended with hyaluronic acid and ferulic acid for luminous collagen regeneration.',
    shortDescription: '20% Active Vitamin C & Hyaluronic Facial Serum.',
    inStock: true,
    stockCount: 40,
    isNew: true
  },

  // 8. Sports & Fitness
  {
    id: 'zah-p22',
    name: 'ZAH Pro-Form Adjustable Dumbbell Set',
    slug: 'zah-pro-form-adjustable-dumbbell-set',
    brand: 'ZAH Fitness',
    category: 'Sports & Fitness',
    categoryId: 'cat-8',
    price: 12999,
    originalPrice: 18999,
    discountPercentage: 31,
    rating: 4.8,
    reviewCount: 145,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Quick-dial weight selection system ranging from 2.5kg to 24kg per dumbbell with heavy-duty cast iron plates.',
    shortDescription: '2.5kg to 24kg Quick-Dial Adjustable Dumbbells.',
    inStock: true,
    stockCount: 8,
    isTrending: true
  },
  {
    id: 'zah-p23',
    name: 'ZAH Non-Slip Natural Rubber Yoga Mat',
    slug: 'zah-non-slip-natural-rubber-yoga-mat',
    brand: 'ZAH Wellness',
    category: 'Sports & Fitness',
    categoryId: 'cat-8',
    price: 2499,
    originalPrice: 3499,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 230,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Eco-friendly 5mm natural tree rubber yoga mat with alignment guidelines and ultra-grip polyurethane surface.',
    shortDescription: '5mm Eco Natural Rubber Alignment Yoga Mat.',
    inStock: true,
    stockCount: 19
  },
  {
    id: 'zah-p24',
    name: 'ZAH GPS Smart Fitness Tracker Watch',
    slug: 'zah-gps-smart-fitness-tracker-watch',
    brand: 'ZAH Tech',
    category: 'Sports & Fitness',
    categoryId: 'cat-8',
    price: 7999,
    originalPrice: 11999,
    discountPercentage: 33,
    rating: 4.7,
    reviewCount: 188,
    images: [
      'https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Integrated dual-frequency GPS, continuous heart rate & VO2 max monitoring, and 14-day battery stamina.',
    shortDescription: 'Dual GPS Sport Tracker Watch with VO2 Max Monitor.',
    inStock: true,
    stockCount: 15,
    isBestSeller: true
  }
];
*/

/* DEPRECATED - Coupons should come from backend API, but keeping export for backward compatibility until services are updated */
export const MOCK_COUPONS: Coupon[] = [
  { code: 'ZAH10', discountPercentage: 10, minOrderAmount: 999, description: '10% OFF on all orders above ₹999', expiryDate: '2026-12-31' },
  { code: 'WELCOME20', discountPercentage: 20, maxDiscount: 2000, minOrderAmount: 1999, description: '20% OFF for new ZAH members', expiryDate: '2026-12-31' },
  { code: 'LUXE15', discountPercentage: 15, maxDiscount: 3000, minOrderAmount: 4999, description: '15% OFF on luxury fashion & audio', expiryDate: '2026-12-31' },
  { code: 'FLASH25', discountPercentage: 25, maxDiscount: 5000, minOrderAmount: 9999, description: '25% OFF on flash sale electronics & watches', expiryDate: '2026-12-31' }
];

// Testimonials can remain as static content for now
export const MOCK_TESTIMONIALS = [
  { id: 1, name: 'Ananya Sharma', role: 'Fashion Consultant', text: 'ZAH has redefined online luxury shopping in India. Fast delivery, immaculate packaging, and premium craftsmanship.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', rating: 5 },
  { id: 2, name: 'Vikramaditya Roy', role: 'Tech Journalist', text: 'The ZAH SoundPro headphones surpassed my expectations. The user experience on the ZAH platform is seamlessly fluid.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', rating: 5 },
  { id: 3, name: 'Deepika Raman', role: 'Interior Architect', text: 'Ordered the Espresso Brew station. Arrived within 24 hours in pristine condition. Highly recommended!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', rating: 5 }
];
