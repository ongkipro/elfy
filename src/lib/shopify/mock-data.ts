import type { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'gid://shopify/Product/1001',
    handle: 'the-executive-penny-loafer',
    title: 'The Executive Penny Loafer (Black Calfskin)',
    titleMs: 'Kasut Penny Loafer Eksekutif (Kulit Anak Lembu Hitam)',
    descriptionHtml: `
      <p>Handcrafted from full-grain French calfskin leather with a Blake-stitched leather sole. Designed for effortless transitions between corporate boardrooms in KL and evening galas.</p>
      <ul>
        <li>Full-grain calfskin leather upper</li>
        <li>Breathable calf leather lining & cushioned memory insole</li>
        <li>Hand-burnished finish with anti-slip rubber heel tap</li>
      </ul>
    `,
    descriptionHtmlMs: `
      <p>Diperbuat daripada kulit anak lembu Perancis asli dengan jahitan tapak Blake. Direka khas untuk keselesaan sepanjang hari dari pejabat ke majlis makan malam.</p>
      <ul>
        <li>Kemasan kulit premium berkilat semula jadi</li>
        <li>Lapisan dalam kulit lembut & tapak kusyen ergonomik</li>
        <li>Tapak luar kulit asli dengan pelindung getah anti-gelincir</li>
      </ul>
    `,
    availableForSale: true,
    productType: 'Shoes',
    tags: ['Shoes', 'Loafers', 'Formal', 'Best Seller'],
    priceRange: {
      minVariantPrice: { amount: '349.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '349.00', currencyCode: 'MYR' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '429.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '429.00', currencyCode: 'MYR' },
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=80',
      altText: 'The Executive Penny Loafer in Black Calfskin',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Executive Penny Loafer Front View',
          width: 1000,
          height: 1000,
        },
        {
          url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Executive Penny Loafer Sole & Detail',
          width: 1000,
          height: 1000,
        },
      ],
    },
    options: [
      {
        id: 'opt-size',
        name: 'Size (EU)',
        values: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1001-40',
          title: 'EU 40',
          availableForSale: true,
          price: { amount: '349.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '429.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 40' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1001-41',
          title: 'EU 41',
          availableForSale: true,
          price: { amount: '349.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '429.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 41' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1001-42',
          title: 'EU 42',
          availableForSale: true,
          price: { amount: '349.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '429.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 42' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1001-43',
          title: 'EU 43',
          availableForSale: true,
          price: { amount: '349.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '429.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 43' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1001-44',
          title: 'EU 44',
          availableForSale: false,
          price: { amount: '349.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '429.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 44' }],
          image: null,
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1002',
    handle: 'the-meridian-automatic-39mm',
    title: 'The Meridian Automatic 39mm (Sunburst Champagne)',
    titleMs: 'Jam Tangan Meridian Automatik 39mm (Champagne Sunburst)',
    descriptionHtml: `
      <p>A masterclass in horological balance. Features an ultra-reliable Japanese 24-jewel automatic mechanical movement with 41 hours power reserve, protected by double-domed scratchproof Sapphire Crystal.</p>
      <ul>
        <li>316L Surgical-grade stainless steel case</li>
        <li>Double-domed anti-reflective Sapphire crystal</li>
        <li>Italian vintage brown calfskin leather quick-release strap</li>
      </ul>
    `,
    descriptionHtmlMs: `
      <p>Koleksi jam mekanikal automatik berprestij dengan enjin buatan Jepun 24-jewel yang tidak memerlukan bateri (kuasa rizab 41 jam), dilindungi kaca Sapphire anti-calar.</p>
      <ul>
        <li>Kerangka keluli tahan karat gred pembedahan 316L</li>
        <li>Cermin Sapphire dwidom dengan salutan anti-pantulan</li>
        <li>Tali kulit Itali asli dengan sistem klip pantas (quick-release)</li>
      </ul>
    `,
    availableForSale: true,
    productType: 'Watches',
    tags: ['Watches', 'Automatic', 'Luxury', 'Best Seller'],
    priceRange: {
      minVariantPrice: { amount: '589.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '589.00', currencyCode: 'MYR' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '699.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '699.00', currencyCode: 'MYR' },
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
      altText: 'The Meridian Automatic 39mm Watch',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Meridian Automatic Dial View',
          width: 1000,
          height: 1000,
        },
        {
          url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Meridian Automatic on Wrist',
          width: 1000,
          height: 1000,
        },
      ],
    },
    options: [
      {
        id: 'opt-strap',
        name: 'Strap Material',
        values: ['Italian Leather (Espresso)', '316L Jubilee Steel Bracelet'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1002-leather',
          title: 'Italian Leather (Espresso)',
          availableForSale: true,
          price: { amount: '589.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '699.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Strap Material', value: 'Italian Leather (Espresso)' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1002-steel',
          title: '316L Jubilee Steel Bracelet',
          availableForSale: true,
          price: { amount: '649.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '759.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Strap Material', value: '316L Jubilee Steel Bracelet' }],
          image: null,
        },
      ],
    },
    watchSpecs: {
      caseDiameter: '39.0 mm',
      lugWidth: '20.0 mm',
      movement: 'Seiko NH35A Automatic (24 Jewels, 41h Reserve)',
      glass: 'Double-Domed Sapphire with Anti-Reflective AR Coating',
      waterResistance: '5 ATM / 50 Metres (Shower & Splash Proof)',
      strap: 'Top-Grain Italian Calfskin or 316L Solid Stainless Steel',
    },
  },
  {
    id: 'gid://shopify/Product/1003',
    handle: 'the-chelsea-suede-boot',
    title: 'The Chelsea Suede Boot (Desert Sand)',
    titleMs: 'Kasut But Chelsea Suede (Desert Sand)',
    descriptionHtml: `
      <p>Crafted from Italian water-resistant suede with elastic side gussets and a dual-density rubber crepe sole. Effortless to slip on, built for all-day urban comfort.</p>
    `,
    descriptionHtmlMs: `
      <p>Dihasilkan daripada kulit suede Itali kalis percikan air dengan getah tepi elastik dan tapak getah crepe fleksibel. Mudah disarung dan sangat bergaya.</p>
    `,
    availableForSale: true,
    productType: 'Shoes',
    tags: ['Shoes', 'Boots', 'Casual'],
    priceRange: {
      minVariantPrice: { amount: '389.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '389.00', currencyCode: 'MYR' },
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      altText: 'The Chelsea Suede Boot',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Chelsea Suede Boot Profile',
          width: 1000,
          height: 1000,
        },
      ],
    },
    options: [
      {
        id: 'opt-size',
        name: 'Size (EU)',
        values: ['EU 40', 'EU 41', 'EU 42', 'EU 43'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1003-40',
          title: 'EU 40',
          availableForSale: true,
          price: { amount: '389.00', currencyCode: 'MYR' },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 40' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1003-41',
          title: 'EU 41',
          availableForSale: true,
          price: { amount: '389.00', currencyCode: 'MYR' },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 41' }],
          image: null,
        },
        {
          id: 'gid://shopify/ProductVariant/1003-42',
          title: 'EU 42',
          availableForSale: true,
          price: { amount: '389.00', currencyCode: 'MYR' },
          compareAtPrice: null,
          selectedOptions: [{ name: 'Size (EU)', value: 'EU 42' }],
          image: null,
        },
      ],
    },
  },
  {
    id: 'gid://shopify/Product/1004',
    handle: 'the-chronograph-heritage-41mm',
    title: 'The Heritage Chronograph 41mm (Obsidian Black)',
    titleMs: 'Jam Tangan Kronograf Heritage 41mm (Obsidian Black)',
    descriptionHtml: `
      <p>Precision meca-quartz chronograph offering sweeping mechanical stopwatch action with the supreme accuracy of quartz timekeeping. Tachymeter bezel with polished chamfers.</p>
    `,
    descriptionHtmlMs: `
      <p>Kronograf meca-quartz berketepatan tinggi dengan fungsi henti-masa mekanikal dan ketepatan masa quartz. Dilengkapi bezel tachymeter dan kaca Sapphire.</p>
    `,
    availableForSale: true,
    productType: 'Watches',
    tags: ['Watches', 'Chronograph', 'Sport'],
    priceRange: {
      minVariantPrice: { amount: '489.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '489.00', currencyCode: 'MYR' },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: '569.00', currencyCode: 'MYR' },
      maxVariantPrice: { amount: '569.00', currencyCode: 'MYR' },
    },
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      altText: 'The Heritage Chronograph 41mm',
      width: 1000,
      height: 1000,
    },
    images: {
      nodes: [
        {
          url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
          altText: 'The Heritage Chronograph 41mm View',
          width: 1000,
          height: 1000,
        },
      ],
    },
    options: [
      {
        id: 'opt-edition',
        name: 'Edition',
        values: ['Standard Edition', 'Collectors Wooden Box Edition'],
      },
    ],
    variants: {
      nodes: [
        {
          id: 'gid://shopify/ProductVariant/1004-std',
          title: 'Standard Edition',
          availableForSale: true,
          price: { amount: '489.00', currencyCode: 'MYR' },
          compareAtPrice: { amount: '569.00', currencyCode: 'MYR' },
          selectedOptions: [{ name: 'Edition', value: 'Standard Edition' }],
          image: null,
        },
      ],
    },
    watchSpecs: {
      caseDiameter: '41.0 mm',
      lugWidth: '20.0 mm',
      movement: 'Seiko VK64 Meca-Quartz Chronograph',
      glass: 'Flat Sapphire Crystal with Beveled Edge',
      waterResistance: '10 ATM / 100 Metres (Swim Proof)',
      strap: '316L Solid Stainless Steel with Safety Deployant Clasp',
    },
  },
];
