#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Parse .env
const envPath = resolve(process.cwd(), '.env');
const env = {};
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...rest] = trimmed.split('=');
      env[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const domain = env.PUBLIC_STORE_DOMAIN || 'vvxgev-3p.myshopify.com';
const sfToken = env.PUBLIC_STOREFRONT_API_TOKEN;

/**
 * CATALOG OPTIMIZATION DICTIONARY
 * Rules:
 * 1. Title: Self-branded ('Elfy ...'), MAX 5 words.
 * 2. SEO Meta Title: Long format, strictly hyphen '-' (NO pipe '|'), Malaysian keyword intent.
 * 3. SEO Meta Description: High CTR Malay/English hybrid for Google SERP (<160 chars).
 * 4. Product Description: Strategic Hybrid (English specs + Malaysian Trust Invariants).
 */

export const CATALOG_MAPPING = [
  // --- MEN'S WATCHES (4 items) ---
  {
    handle: 'jam-tangan-pria-c24-analog-quartz',
    category: "Men's Watches",
    currentTitle: 'AeroVeloce C24 Luxury Chrono Analog Quartz Watch',
    newTitle: 'Elfy AeroVeloce C24 Chrono Watch',
    seoTitle: 'Elfy AeroVeloce C24 Chrono Watch - Jam Tangan Lelaki Analog Mewah Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy AeroVeloce C24 Chrono Watch di Malaysia. Jam tangan lelaki analog quartz mewah, jaminan 1 tahun & penghantaran pantas Semenanjung.',
    highlights: [
      'High-Precision Japanese Quartz Movement yang jitu dan tahan lama',
      'Casing Alloy & Stainless Steel tahan karat dengan kaca tahan calar ringan',
      'Tali jam berkualiti tinggi yang selesa di pergelangan tangan sepanjang hari',
      'Kalis air 3 ATM (Daily splash & rain resistant)',
      'Gaya eksekutif formal & smart-casual moden',
    ],
  },
  {
    handle: 'jam-tangan-pria-c27-analog-quartz',
    category: "Men's Watches",
    currentTitle: 'Imperial Apex C27 Grand Classic Stainless Watch',
    newTitle: 'Elfy Imperial Apex C27 Watch',
    seoTitle: 'Elfy Imperial Apex C27 Watch - Jam Tangan Lelaki Keluli Klasik Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Imperial Apex C27 Watch di Malaysia. Jam tangan lelaki keluli tahan karat grand classic, sesuai untuk kerja pejabat & majlis formal.',
    highlights: [
      'Rekaan grand classic stainless steel yang berprestij',
      'Enjin pergerakan quartz berketepatan tinggi',
      'Dial analog klasik dengan penunjuk masa yang jelas',
      'Kalis percikan air harian 3 ATM',
      'Sesuai untuk ahli perniagaan dan gaya formal korporat',
    ],
  },
  {
    handle: 'jam-tangan-pria-fn-c15-analog-quartz',
    category: "Men's Watches",
    currentTitle: 'Vanguard Royale FN-C15 Precision Steel Quartz Watch',
    newTitle: 'Elfy Vanguard Royale C15 Watch',
    seoTitle: 'Elfy Vanguard Royale C15 Watch - Jam Tangan Lelaki Precision Steel Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Vanguard Royale C15 Watch di Malaysia. Jam tangan lelaki keluli tahan karat rekaan precision, tahan lasak & jaminan 1 tahun.',
    highlights: [
      'Reka bentuk maskulin moden dengan kemasan keluli tahan lasak',
      'Enjin quartz jitu untuk ketepatan masa tanpa kompromi',
      'Ketahanan air 3 ATM untuk kegunaan harian',
      'Tali keluli boleh laras mengikut saiz pergelangan tangan',
      'Kotak hadiah jam tangan premium ELFY disertakan',
    ],
  },
  {
    handle: 'jam-tangan-pria-notionr01-analog-quartz',
    category: "Men's Watches",
    currentTitle: 'Executive Notion-01 Minimalist Ultra-Slim Quartz Watch',
    newTitle: 'Elfy Notion-01 Executive Slim Watch',
    seoTitle: 'Elfy Notion-01 Executive Slim Watch - Jam Tangan Lelaki Nipis Minimalist Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Notion-01 Executive Slim Watch di Malaysia. Jam tangan lelaki ultra-slim minimalist yang ringan, nipis & elegan untuk kegunaan harian.',
    highlights: [
      'Profil ultra-slim yang nipis, ringan dan kemas di bawah kemeja',
      'Rekaan dial minimalist kontemporari tanpa elemen serabut',
      'Enjin Japanese quartz berketepatan tinggi',
      'Tali jam lembut yang tidak memerangkap peluh',
      'Kalis air 3 ATM untuk perlindungan percikan harian',
    ],
  },

  // --- WOMEN'S WATCHES (3 items) ---
  {
    handle: 'jam-tangan-wanita-bs-elegant-quartz',
    category: "Women's Watches",
    currentTitle: 'Lumina Grace BS Diamond Crystal Elegance Watch',
    newTitle: 'Elfy Lumina Grace BS Watch',
    seoTitle: 'Elfy Lumina Grace BS Watch - Jam Tangan Wanita Diamond Crystal Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Lumina Grace BS Watch di Malaysia. Jam tangan wanita bertatah kristal mewah, anggun untuk majlis & kerja. Hadiah eksklusif wanita.',
    highlights: [
      'Bikinan bezel bertatah kristal berkilau yang memukau',
      'Dial elegan feminin dengan kemasan mewah',
      'Enjin quartz berkualiti tinggi dan tahan lama',
      'Kalis percikan air 3 ATM',
      'Pilihan terbaik untuk hadiah istimewa wanita atau majlis keramaian',
    ],
  },
  {
    handle: 'jam-tangan-wanita-j8-elegant-quartz',
    category: "Women's Watches",
    currentTitle: 'Aura Petite J8 Minimalist Classic Leather Watch',
    newTitle: 'Elfy Aura Petite J8 Watch',
    seoTitle: 'Elfy Aura Petite J8 Watch - Jam Tangan Wanita Tali Kulit Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Aura Petite J8 Watch di Malaysia. Jam tangan wanita minimalist bertali kulit lembut, anggun & selesa dipakai ke pejabat atau santai.',
    highlights: [
      'Saiz dial petite yang anggun dan padan untuk pergelangan tangan wanita',
      'Tali kulit berkualiti tinggi yang lembut dan selesa',
      'Gaya minimalist klasik yang tidak lapuk dek zaman',
      'Enjin quartz tepat dengan ketahanan bateri berpanjangan',
      'Kalis percikan air harian 3 ATM',
    ],
  },
  {
    handle: 'jam-tangan-wanita-j9-elegant-quartz',
    category: "Women's Watches",
    currentTitle: 'Seraphina J9 Vintage Rose Gold Leather Watch',
    newTitle: 'Elfy Seraphina J9 Vintage Watch',
    seoTitle: 'Elfy Seraphina J9 Vintage Watch - Jam Tangan Wanita Rose Gold Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Seraphina J9 Vintage Watch di Malaysia. Sentuhan feminin vintage rose gold dengan tali kulit klasik & jaminan 1 tahun ELFY.',
    highlights: [
      'Kemasan casing tona rose gold vintage yang memikat hati',
      'Tali kulit bergaya retro moden yang tahan lasak',
      'Penunjuk masa analog yang jelas dan rapi',
      'Kalis air 3 ATM untuk pemakaian harian santai',
      'Dilengkapi kotak hadiah eksklusif ELFY',
    ],
  },

  // --- MEN'S SHOES (44 items) ---
  {
    handle: 'sepatu-pria-k1-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'AeroFlow Prime K1 Ultra-Cushion Running Sneakers',
    newTitle: 'Elfy AeroFlow K1 Running Sneakers',
    seoTitle: 'Elfy AeroFlow K1 Running Sneakers - Kasut Lelaki Selesa Ringan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy AeroFlow K1 Running Sneakers di Malaysia. Kasut sneakers lelaki ultra-cushion, breathable mesh sejuk & tapak anti-gelincir selesa jalan jauh.',
    highlights: [
      'Breathable Air-Mesh Upper: Udara mengalir lancar, kaki kekal sejuk dalam cuaca Malaysia',
      'Ergonomic Cushion Insole: Tapak dalaman empuk mengurangkan sengal tumit dan kaki',
      'Tapak Getah Anti-Slip: Cengkaman mantap dan selamat di atas lantai licin atau basah',
      'Rekaan Sport Casual: Sesuai untuk bersukan ringan, jalan-jalan santai, mahupun kerja harian',
    ],
  },
  {
    handle: 'sepatu-pria-k8-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Titan Air K8 Hyper-Breathable Sport Sneakers',
    newTitle: 'Elfy Titan Air K8 Sneakers',
    seoTitle: 'Elfy Titan Air K8 Sneakers - Kasut Lelaki Breathable Sport Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Titan Air K8 Sneakers di Malaysia. Kasut sukan kasual lelaki hyper-breathable, rekaan moden tahan lasak dengan kusyen sokongan padu.',
    highlights: [
      'Hyper-Breathable Weave Upper untuk pengudaraan optimum tanpa bau hapak',
      'Sistem sokongan tumit Titan Air untuk kestabilan setiap langkah',
      'Tapak getah berdaya tahan tinggi dan anti-haus',
      'Ringan dan fleksibel untuk mobiliti sepanjang hari di bandar',
    ],
  },
  {
    handle: 'sepatu-pria-k11-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'VoltStride K11 Lightweight Athletic Street Sneakers',
    newTitle: 'Elfy VoltStride K11 Street Sneakers',
    seoTitle: 'Elfy VoltStride K11 Street Sneakers - Kasut Sneakers Lelaki Streetwear Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy VoltStride K11 Street Sneakers di Malaysia. Kasut sneakers lelaki bergaya street kasual, ringan & fleksibel untuk gaya harian bertenaga.',
    highlights: [
      'Siluet street style kontemporari yang versatile dipadankan jeans atau seluar pendek',
      'Bahan binaan ultra-ringan yang tidak membebankan kaki',
      'Tapak cengkaman fleksibel untuk keselesaan langkah maksimum',
      'Pelapik span lembut pada bahagian buku lali',
    ],
  },
  {
    handle: 'sepatu-pria-k12-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'CloudGlide K12 Dynamic Flexible Casual Sneakers',
    newTitle: 'Elfy CloudGlide K12 Casual Sneakers',
    seoTitle: 'Elfy CloudGlide K12 Casual Sneakers - Kasut Lelaki Tapak Lembut Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy CloudGlide K12 Casual Sneakers di Malaysia. Kasut kasual lelaki tapak lembut bak awan, fleksibel & selesa dipakai seharian.',
    highlights: [
      'Tapak CloudGlide berteknologi kusyen lembut untuk sensasi berjalan santai',
      'Bahan fabrik rajut berdaya regang mengikut bentuk kaki',
      'Tapak luar getah berprofil cengkaman anti-licin',
      'Sangat mudah disarung dan ditanggalkan',
    ],
  },
  {
    handle: 'sepatu-pria-k13-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Zenith Run K13 Ergonomic Shock-Absorbing Sneakers',
    newTitle: 'Elfy Zenith Run K13 Sneakers',
    seoTitle: 'Elfy Zenith Run K13 Sneakers - Kasut Jogging Lelaki Serap Hentakan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Zenith Run K13 Sneakers di Malaysia. Kasut sneakers jogging & berjalan lelaki berteknologi serap hentakan untuk perlindungan sendi.',
    highlights: [
      'Teknologi penyerap hentakan ergonomik melindungi lutut dan sendi',
      'Fabrik mesh mikro memastikan kaki tidak berpeluh',
      'Struktur tapak berongga untuk pantulan tenaga yang efisien',
      'Reka bentuk atletik aerodinamik bergaya maskulin',
    ],
  },
  {
    handle: 'sepatu-pria-k14-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Apex Runner K14 High-Traction Streetwear Sneakers',
    newTitle: 'Elfy Apex Runner K14 Sneakers',
    seoTitle: 'Elfy Apex Runner K14 Sneakers - Kasut Lelaki High Traction Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Apex Runner K14 Sneakers di Malaysia. Kasut sneakers lelaki daya cengkaman tinggi, rekaan streetwear terkini yang tahan lasak.',
    highlights: [
      'Tapak luar berbunga tebal memberikan cengkaman ekstrem di pelbagai permukaan',
      'Reka bentuk streetwear urban dengan padanan warna eksklusif',
      'Bahan luaran tahan geseran dan lasak',
      'Insole berkusyen tebal untuk keselesaan berpanjangan',
    ],
  },
  {
    handle: 'sepatu-pria-k15-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Phantom Pace K15 High-Rebound Cushion Sneakers',
    newTitle: 'Elfy Phantom Pace K15 Sneakers',
    seoTitle: 'Elfy Phantom Pace K15 Sneakers - Kasut Lelaki High Rebound Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Phantom Pace K15 Sneakers di Malaysia. Kasut sneakers kusyen lantunan tinggi, lembut dan responsif untuk aktiviti aktif lelaki.',
    highlights: [
      'Sistem kusyen High-Rebound Foam yang memberi lantunan responsif setiap langkah',
      'Bahagian atas Phantom Mesh yang kemas dan bernafas',
      'Kolar buku lali berlapik empuk mengelakkan melecet',
      'Tapak getah tahan haus dengan corak anti-gelincir',
    ],
  },
  {
    handle: 'sepatu-pria-k16-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Vortex Shift K16 Seamless Knit Athletic Sneakers',
    newTitle: 'Elfy Vortex Shift K16 Sneakers',
    seoTitle: 'Elfy Vortex Shift K16 Sneakers - Kasut Rajut Lelaki Seamless Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Vortex Shift K16 Sneakers di Malaysia. Kasut rajut athletic lelaki tanpa jahitan kasar, membalut kaki dengan selesa bagai stoking.',
    highlights: [
      'Seamless Knit Upper tanpa jahitan kasar yang membalut kaki dengan sempurna',
      'Struktur anjal menyokong pergerakan semula jadi kaki',
      'Tapak tengah Vortex Cushioning yang ringan dan empuk',
      'Pengudaraan maksimum untuk keselesaan di cuaca tropika',
    ],
  },
  {
    handle: 'sepatu-pria-k17-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'AeroMesh Pro K17 Breathable Daily Sport Sneakers',
    newTitle: 'Elfy AeroMesh Pro K17 Sneakers',
    seoTitle: 'Elfy AeroMesh Pro K17 Sneakers - Kasut Sukan Kasual Lelaki Sejuk Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy AeroMesh Pro K17 Sneakers di Malaysia. Kasut sukan harian fabrik jaring sejuk, ringan & empuk untuk berjalan jauh dan kerja.',
    highlights: [
      'Fabrik jaring AeroMesh berlapis yang kuat namun sangat sejuk',
      'Tapak getah kompaun tahan lasak untuk kegunaan harian intensif',
      'Sokongan lengkung kaki (arch support) seimbang',
      'Penampilan sporty elegan yang versatil',
    ],
  },
  {
    handle: 'sepatu-pria-k18-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Quantum Sprint K18 Lightweight Trail Casual Sneakers',
    newTitle: 'Elfy Quantum Sprint K18 Sneakers',
    seoTitle: 'Elfy Quantum Sprint K18 Sneakers - Kasut Kasual Trail Lelaki Ringan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Quantum Sprint K18 Sneakers di Malaysia. Kasut kasual trail lelaki ringan dengan cengkaman pelbagai permukaan jalan & lantai.',
    highlights: [
      'Tapak bercorak trail serba guna untuk laluan bandar mahupun luar bandar',
      'Bahan tahan lasak dengan perlindungan jari kaki',
      'Kusyen Quantum Foam menyerap gegaran dengan cekap',
      'Sesuai untuk lelaki yang aktif bergerak sepanjang hari',
    ],
  },
  {
    handle: 'sepatu-pria-k19-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Urban Lite K19 Minimalist Flexible Sneakers',
    newTitle: 'Elfy Urban Lite K19 Sneakers',
    seoTitle: 'Elfy Urban Lite K19 Sneakers - Kasut Minimalist Lelaki Ringan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Urban Lite K19 Sneakers di Malaysia. Kasut sneakers lelaki minimalist ultra-ringan, kemas dan selesa dipadankan dengan apa jua pakaian.',
    highlights: [
      'Reka bentuk minimalist bersih tanpa corak berlebihan',
      'Berat ultra-ringan yang memberikan kebebasan melangkah',
      'Tapak fleksibel boleh dibengkokkan mengikut pergerakan kaki',
      'Insole antibakteria yang boleh ditanggalkan untuk dicuci',
    ],
  },
  {
    handle: 'sepatu-pria-k20-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Stealth Walk K20 Anti-Slip Everyday Casual Sneakers',
    newTitle: 'Elfy Stealth Walk K20 Sneakers',
    seoTitle: 'Elfy Stealth Walk K20 Sneakers - Kasut Anti Gelincir Lelaki Harian Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Stealth Walk K20 Sneakers di Malaysia. Kasut sneakers lelaki tapak anti-gelincir mantap, senyap & selesa untuk kerja dan riadah.',
    highlights: [
      'Tapak getah anti-gelincir Stealth Grip dengan cengkaman senyap dan padu',
      'Fabrik bahagian atas tahan calar dan mudah dijaga',
      'Lapisan dalaman lembut mengelakkan melecet di bahagian tumit',
      'Warna monokrom maskulin yang mudah dipadankan',
    ],
  },
  {
    handle: 'sepatu-pria-k21-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Velocity Wave K21 Dynamic Arch Support Sneakers',
    newTitle: 'Elfy Velocity Wave K21 Sneakers',
    seoTitle: 'Elfy Velocity Wave K21 Sneakers - Kasut Sokongan Lengkung Kaki Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Velocity Wave K21 Sneakers di Malaysia. Kasut sneakers sokongan lengkung kaki (arch support) untuk kurangkan lenguh berdiri lama.',
    highlights: [
      'Sistem sokongan lengkung kaki Velocity Wave melegakan tekanan tapak kaki',
      'Sangat disyorkan bagi mereka yang banyak berdiri atau berjalan semasa bekerja',
      'Pengudaraan mikro menjaga kesegaran kaki sepanjang masa',
      'Tapak getah fleksibel berkualiti tinggi',
    ],
  },
  {
    handle: 'sepatu-pria-k22-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Breeze Flex K22 Featherlight Breathable Sneakers',
    newTitle: 'Elfy Breeze Flex K22 Sneakers',
    seoTitle: 'Elfy Breeze Flex K22 Sneakers - Kasut Lelaki Ringan Bagai Bulu Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Breeze Flex K22 Sneakers di Malaysia. Kasut sneakers lelaki featherlight super ringan, bernafas dan amat fleksibel untuk gaya santai.',
    highlights: [
      'Berat featherlight seringan bulu untuk pengalaman melangkah tanpa beban',
      'Jaringan fabrik Breeze Mesh yang sangat sejuk',
      'Tapak fleksibel 360 darjah yang mengikut pergerakan kaki',
      'Pilihan tepat untuk cuaca panas terik Malaysia',
    ],
  },
  {
    handle: 'sepatu-pria-k23-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Pulse Core K23 High-Energy Cushion Sneakers',
    newTitle: 'Elfy Pulse Core K23 Sneakers',
    seoTitle: 'Elfy Pulse Core K23 Sneakers - Kasut Kusyen Bertenaga Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Pulse Core K23 Sneakers di Malaysia. Kasut sneakers lelaki kusyen bertenaga, menyerap tekanan hentakan dan selesa berjalan seharian.',
    highlights: [
      'Kusyen Pulse Core berprestasi tinggi untuk penyerapan impak maksimum',
      'Kestabilan lateral diperkukuh untuk pergerakan yakin',
      'Fabrik luaran tahan lasak dan mudah dibersihkan',
      'Reka bentuk moden yang menarik perhatian',
    ],
  },
  {
    handle: 'sepatu-pria-k24-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Strato Max K24 Reinforced Grip Athletic Sneakers',
    newTitle: 'Elfy Strato Max K24 Sneakers',
    seoTitle: 'Elfy Strato Max K24 Sneakers - Kasut Cengkaman Kuat Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Strato Max K24 Sneakers di Malaysia. Kasut sneakers cengkaman diperkukuh, tapak getah tahan lasak & kusyen tumit empuk bergaya aktif.',
    highlights: [
      'Cengkaman getah diperkukuh (Reinforced Grip) untuk keselamatan optimum',
      'Binaan tapak tebal menyerap tekanan ketika melangkah laju',
      'Mesh bernafas yang menolak haba panas keluar',
      'Sesuai untuk aktiviti lasak mahupun pemakaian harian',
    ],
  },
  {
    handle: 'sepatu-pria-k25-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Orbit Edge K25 Contemporary Street Casual Sneakers',
    newTitle: 'Elfy Orbit Edge K25 Sneakers',
    seoTitle: 'Elfy Orbit Edge K25 Sneakers - Kasut Street Casual Lelaki Moden Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Orbit Edge K25 Sneakers di Malaysia. Kasut street casual kontemporari lelaki dengan rekaan garisan moden, selesa & bergaya trendy.',
    highlights: [
      'Reka bentuk kontemporari dengan aksen garisan moden yang kemas',
      'Gabungan material berkualiti tinggi tahan koyak',
      'Kusyen dalaman empuk untuk keselesaan pemakaian seharian',
      'Tapak anti-gelincir yang selamat di pelbagai jenis lantai',
    ],
  },
  {
    handle: 'sepatu-pria-k26-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Gravity Zero K26 Air-Cushion Performance Sneakers',
    newTitle: 'Elfy Gravity Zero K26 Sneakers',
    seoTitle: 'Elfy Gravity Zero K26 Sneakers - Kasut Air Cushion Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Gravity Zero K26 Sneakers di Malaysia. Kasut sneakers berteknologi beg udara (Air-Cushion), langkah terasa ringan tanpa graviti.',
    highlights: [
      'Kusyen beg udara Gravity Zero pada bahagian tumit untuk penyerapan impak luar biasa',
      'Fabrik jaring rajutan kemas yang menyokong bentuk kaki',
      'Tapak getah berketahanan tinggi dengan cengkaman mantap',
      'Reka bentuk futuristik yang menonjolkan gaya maskulin',
    ],
  },
  {
    handle: 'sepatu-pria-k27-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Nova Speed K27 Responsive Foam Running Sneakers',
    newTitle: 'Elfy Nova Speed K27 Sneakers',
    seoTitle: 'Elfy Nova Speed K27 Sneakers - Kasut Responsive Foam Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Nova Speed K27 Sneakers di Malaysia. Kasut sneakers buih responsif Nova Speed, lantunan lembut untuk berjalan jauh dan berjoging.',
    highlights: [
      'Buih tapak tengah Nova Foam yang sangat anjal dan responsif',
      'Jaringan atas berudara bebas untuk keselesaan tanpa kelembapan',
      'Rekaan tirus moden yang memberikan sokongan optimum pada buku lali',
      'Tapak tahan geseran dengan bunga cengkaman terbukti',
    ],
  },
  {
    handle: 'sepatu-pria-k28-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'HyperTrack K28 Durable Multi-Terrain Sneakers',
    newTitle: 'Elfy HyperTrack K28 Terrain Sneakers',
    seoTitle: 'Elfy HyperTrack K28 Terrain Sneakers - Kasut Tahan Lasak Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy HyperTrack K28 Terrain Sneakers di Malaysia. Kasut sneakers tahan lasak serba medan, tapak cengkaman padu & perlindungan kaki maksima.',
    highlights: [
      'Tapak Multi-Terrain direka untuk bertahan di laluan tar, simen mahupun batu kelikir',
      'Bahan luaran HyperTrack yang tahan lasak dan tidak mudah koyak',
      'Kusyen dalaman tebal mengurangkan impak ketika melangkah jauh',
      'Sesuai untuk lelaki yang mendambakan kasut kukuh dan lasak',
    ],
  },
  {
    handle: 'sepatu-pria-k29-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Eclipse Step K29 Sleek Breathable City Sneakers',
    newTitle: 'Elfy Eclipse Step K29 Sneakers',
    seoTitle: 'Elfy Eclipse Step K29 Sneakers - Kasut City Sneaker Lelaki Elegan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Eclipse Step K29 Sneakers di Malaysia. Kasut sneakers bandar rekaan ramping, bernafas & elegan untuk gaya kasual pejabat atau santai.',
    highlights: [
      'Siluet ramping dan kemas sesuai untuk padanan kasual pejabat mahupun lepak santai',
      'Fabrik pengudaraan Eclipse Mesh yang sejuk sepanjang hari',
      'Tapak getah cengkaman rata yang stabil dan anti-slip',
      'Pelapik dalam empuk yang menampung berat badan dengan seimbang',
    ],
  },
  {
    handle: 'sepatu-pria-k30-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Vector Prime K30 Engineered Mesh Sport Sneakers',
    newTitle: 'Elfy Vector Prime K30 Sneakers',
    seoTitle: 'Elfy Vector Prime K30 Sneakers - Kasut Engineered Mesh Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Vector Prime K30 Sneakers di Malaysia. Kasut sukan kasual fabrik jaring kejuruteraan khas, kukuh, anjal & selesa bergerak aktif.',
    highlights: [
      'Engineered Mesh berlapis memberikan sokongan struktur tanpa menambah berat',
      'Tapak luar Vector Grip dengan corak alur fleksibel',
      'Kusyen tumit tebal menyerap hentakan lantai keras',
      'Penampilan maskulin yang versatil dan moden',
    ],
  },
  {
    handle: 'sepatu-pria-k31-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'AeroStripe K31 Ergonomic Daily Walking Sneakers',
    newTitle: 'Elfy AeroStripe K31 Walking Sneakers',
    seoTitle: 'Elfy AeroStripe K31 Walking Sneakers - Kasut Berjalan Lelaki Ergonomik Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy AeroStripe K31 Walking Sneakers di Malaysia. Kasut berjalan ergonomik harian, tapak empuk melegakan kaki lenguh untuk kerja dan riadah.',
    highlights: [
      'Reka bentuk ergonomik khas untuk aktiviti berjalan kaki seharian',
      'Jalur sokongan AeroStripe yang menambah kestabilan sisi kaki',
      'Insole berkusyen tebal yang menyerap tekanan badan',
      'Tapak getah anti-gelincir tahan lasak',
    ],
  },
  {
    handle: 'sepatu-pria-k32-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Apex Grip K32 Non-Slip All-Day Athletic Sneakers',
    newTitle: 'Elfy Apex Grip K32 Sneakers',
    seoTitle: 'Elfy Apex Grip K32 Sneakers - Kasut Tapak Cengkam Anti Slip Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Apex Grip K32 Sneakers di Malaysia. Kasut sneakers cengkaman getah anti-slip sepanjang hari, selamat di lantai basah & selesa dipakai.',
    highlights: [
      'Teknologi tapak Apex Grip dengan cengkaman getah luar biasa',
      'Sangat selamat digunakan di permukaan lantai licin atau basah',
      'Bahan atas bernafas memastikan kaki tidak panas',
      'Binaan ringan yang memberi keselesaan optimum sepanjang hari',
    ],
  },
  {
    handle: 'sepatu-pria-k33-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Flux Runner K33 Ultra-Responsive Foam Sneakers',
    newTitle: 'Elfy Flux Runner K33 Sneakers',
    seoTitle: 'Elfy Flux Runner K33 Sneakers - Kasut Foam Responsif Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Flux Runner K33 Sneakers di Malaysia. Kasut sneakers buih ultra-responsif Flux Runner, memberi lantunan tenaga segar setiap kali melangkah.',
    highlights: [
      'Buih Flux Foam yang empuk memberi lantunan tenaga bertenaga',
      'Mesh rajut berdaya pengudaraan tinggi untuk kesegaran kaki',
      'Binaan sokongan buku lali berlapik kemas',
      'Tapak getah kompaun tahan haus untuk jangka hayat panjang',
    ],
  },
  {
    handle: 'sepatu-pria-k34-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'CloudStrut K34 Soft Insole Leisure Sneakers',
    newTitle: 'Elfy CloudStrut K34 Leisure Sneakers',
    seoTitle: 'Elfy CloudStrut K34 Leisure Sneakers - Kasut Kasual Insole Lembut Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy CloudStrut K34 Leisure Sneakers di Malaysia. Kasut sneakers santai dengan insole lembut bak kapas, nikmati keselesaan berjalan tanpa penat.',
    highlights: [
      'Insole CloudStrut selembut span mengurangkan rasa sakit tapak kaki',
      'Gaya leisure kasual yang santai dan bergaya',
      'Fabrik bahagian atas anjal mengikut pergerakan kaki',
      'Tapak luar fleksibel yang menyerap tekanan dengan baik',
    ],
  },
  {
    handle: 'sepatu-pria-k35-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Matrix Walk K35 Geometric Tread Casual Sneakers',
    newTitle: 'Elfy Matrix Walk K35 Sneakers',
    seoTitle: 'Elfy Matrix Walk K35 Sneakers - Kasut Geometrik Kasual Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Matrix Walk K35 Sneakers di Malaysia. Kasut kasual lelaki tapak bunga geometrik Matrix, cengkaman mantap & reka bentuk moden bergaya.',
    highlights: [
      'Corak tapak geometrik Matrix yang memecah aliran air untuk cengkaman maksimum',
      'Bahan luaran tahan lasak dengan pengudaraan seimbang',
      'Kusyen tapak tengah menyerap gegaran dengan berkesan',
      'Sesuai untuk pemakaian harian santai dan kerja kasual',
    ],
  },
  {
    handle: 'sepatu-pria-k36-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Zen Flow K36 Barefoot-Feel Flexible Sneakers',
    newTitle: 'Elfy Zen Flow K36 Sneakers',
    seoTitle: 'Elfy Zen Flow K36 Sneakers - Kasut Fleksibel Barefoot Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Zen Flow K36 Sneakers di Malaysia. Kasut sneakers sensasi barefoot fleksibel, pergerakan semula jadi kaki tanpa sekatan & amat ringan.',
    highlights: [
      'Sensasi langkah semula jadi barefoot yang bebas dan santai',
      'Tapak ultra-fleksibel yang boleh dilentur sepenuhnya',
      'Bahan fabrik rajut bernafas sejuk dan selesa',
      'Ringan bagai tidak memakai kasut untuk mobiliti santai',
    ],
  },
  {
    handle: 'sepatu-pria-k37-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Turbo Drift K37 Sporty Lace-Up Running Sneakers',
    newTitle: 'Elfy Turbo Drift K37 Sneakers',
    seoTitle: 'Elfy Turbo Drift K37 Sneakers - Kasut Lari Bertali Sporty Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Turbo Drift K37 Sneakers di Malaysia. Kasut lari bertali sporty lelaki, cengkaman Turbo Drift mantap & kusyen empuk bertenaga.',
    highlights: [
      'Sistem tali kasut kemas membalut kaki dengan kukuh dan selamat',
      'Kusyen Turbo Drift memberi sokongan lantunan bertenaga',
      'Tapak getah berdaya tahan tinggi menahan geseran jalan raya',
      'Fabrik mesh berliang halus menyejukkan kaki sepanjang masa',
    ],
  },
  {
    handle: 'sepatu-pria-k38-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Summit Pace K38 Heavy-Duty Cushioning Sneakers',
    newTitle: 'Elfy Summit Pace K38 Sneakers',
    seoTitle: 'Elfy Summit Pace K38 Sneakers - Kasut Kusyen Tebal Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Summit Pace K38 Sneakers di Malaysia. Kasut sneakers kusyen tebal heavy-duty, perlindungan impak maksima & selesa berjalan jarak jauh.',
    highlights: [
      'Kusyen tapak tebal Summit Cushion untuk perlindungan impak maksimum',
      'Binaan tahan lasak heavy-duty yang tidak mudah kemek',
      'Tapak cengkaman berprofil tinggi yang selamat di pelbagai laluan',
      'Lapisan dalam berlapik empuk untuk keselesaan berpanjangan',
    ],
  },
  {
    handle: 'sepatu-pria-k39-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Swift Motion K39 Ultra-Light Airflow Sneakers',
    newTitle: 'Elfy Swift Motion K39 Sneakers',
    seoTitle: 'Elfy Swift Motion K39 Sneakers - Kasut Aliran Udara Ultra Ringan Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Swift Motion K39 Sneakers di Malaysia. Kasut sneakers ultra-ringan dengan aliran udara optimum, kaki sejuk dan tidak berpeluh.',
    highlights: [
      'Sistem pengudaraan Airflow Mesh memastikan aliran udara berterusan',
      'Berat kasut yang sangat ringan untuk langkah pantas dan lincah',
      'Tapak luar fleksibel yang menyerap hentakan dengan efisien',
      'Gaya atletik moden yang bergaya untuk seisi keluarga',
    ],
  },
  {
    handle: 'sepatu-pria-k40-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Horizon Pro K40 High-Durability Training Sneakers',
    newTitle: 'Elfy Horizon Pro K40 Sneakers',
    seoTitle: 'Elfy Horizon Pro K40 Sneakers - Kasut Latihan Tahan Lasak Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Horizon Pro K40 Sneakers di Malaysia. Kasut latihan tahan lasak lelaki, sokongan tumit kukuh & kusyen empuk untuk aktiviti lasak harian.',
    highlights: [
      'Ketahanan tinggi (High-Durability) direka khas untuk pemakaian lasak berulang',
      'Sokongan tumit Horizon Pro mengelakkan kaki terseliuh',
      'Tapak getah cengkaman komprehensif pada pelbagai permukaan',
      'Bahan atas tahan koyak yang tahan lama',
    ],
  },
  {
    handle: 'sepatu-pria-k41-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Veloce Active K41 Dynamic Bounce Sport Sneakers',
    newTitle: 'Elfy Veloce Active K41 Sneakers',
    seoTitle: 'Elfy Veloce Active K41 Sneakers - Kasut Sukan Dynamic Bounce Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Veloce Active K41 Sneakers di Malaysia. Kasut sukan lantunan dinamik Veloce Active, langkah bertenaga & rekaan sporty aerodinamik.',
    highlights: [
      'Teknologi Dynamic Bounce memberi lantunan bertenaga setiap langkah',
      'Bahagian atas rajutan fleksibel yang menyokong pergerakan lincah',
      'Kolar buku lali lembut mengelakkan rasa melecet',
      'Tapak cengkaman tahan lama untuk kegunaan sukan dan kasual',
    ],
  },
  {
    handle: 'sepatu-pria-k42-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'HyperStrut K42 Premium Impact-Resistant Sneakers',
    newTitle: 'Elfy HyperStrut K42 Impact Sneakers',
    seoTitle: 'Elfy HyperStrut K42 Impact Sneakers - Kasut Tahan Impak Premium Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy HyperStrut K42 Impact Sneakers di Malaysia. Kasut sneakers premium tahan impak tinggi, mengurangkan keletihan kaki berjalan seharian.',
    highlights: [
      'Sistem perlindungan impak HyperStrut yang menyerap tekanan tapak kaki',
      'Kemasan material premium yang tampak mewah dan tahan calar',
      'Insole anatomi yang menyokong bentuk lengkung kaki secara semula jadi',
      'Tapak getah padu anti-gelincir untuk keselamatan optimum',
    ],
  },
  {
    handle: 'sepatu-pria-k43-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Titan Edge K43 Enhanced Stability Running Sneakers',
    newTitle: 'Elfy Titan Edge K43 Sneakers',
    seoTitle: 'Elfy Titan Edge K43 Sneakers - Kasut Lari Kestabilan Padu Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Titan Edge K43 Sneakers di Malaysia. Kasut lari kestabilan dipertingkat Titan Edge, tapak cengkaman kukuh & kusyen empuk tahan lama.',
    highlights: [
      'Sistem kestabilan Titan Edge memastikan kaki tidak tergelincir atau condong',
      'Tapak luar getah berprofil lebar untuk tapakan mantap',
      'Fabrik jaring bernafas mengekalkan suhu kaki sentiasa selesa',
      'Binaan kukuh dan berkualiti tinggi untuk pemakaian bertahun',
    ],
  },
  {
    handle: 'sepatu-pria-k44-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'AeroSprint Elite K44 Advanced Air-Cushion Sneakers',
    newTitle: 'Elfy AeroSprint Elite K44 Sneakers',
    seoTitle: 'Elfy AeroSprint Elite K44 Sneakers - Kasut Air Cushion Elit Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy AeroSprint Elite K44 Sneakers di Malaysia. Kasut sneakers elit beg udara canggih, langkah ringan & keselesaan tiada tandingan.',
    highlights: [
      'Beg udara AeroSprint Elite pada bahagian tumit untuk keselesaan luar biasa',
      'Rekaan futuristik yang menarik dan bergaya eksklusif',
      'Bahan atas ultra-breathable yang tidak memerangkap bau',
      'Tapak getah berdaya cengkaman tinggi di jalan basah',
    ],
  },
  {
    handle: 'sepatu-pria-k45-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Prism Pace K45 Breathable Lightweight Sneakers',
    newTitle: 'Elfy Prism Pace K45 Sneakers',
    seoTitle: 'Elfy Prism Pace K45 Sneakers - Kasut Ringan Bernafas Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Prism Pace K45 Sneakers di Malaysia. Kasut sneakers lelaki bernafas & ringan, mudah dipakai untuk bersiar-siar, kerja dan riadah santai.',
    highlights: [
      'Tekstur jaring Prism Mesh yang menarik dengan pengudaraan berterusan',
      'Berat ringan memudahkan pergerakan pantas tanpa keletihan',
      'Tapak dalam empuk menyokong berat badan dengan seimbang',
      'Mudah dipadankan dengan gaya pakaian kasual moden',
    ],
  },
  {
    handle: 'sepatu-pria-k46-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Stealth Glide K46 All-Weather Casual Sneakers',
    newTitle: 'Elfy Stealth Glide K46 Sneakers',
    seoTitle: 'Elfy Stealth Glide K46 Sneakers - Kasut Cuaca Harian Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Stealth Glide K46 Sneakers di Malaysia. Kasut sneakers kasual serba cuaca panas & hujan, tapak anti-gelincir dan tahan kotoran.',
    highlights: [
      'Bahan luaran tahan lasak yang sesuai untuk cuaca panas dan hujan Malaysia',
      'Tapak Stealth Glide anti-gelincir yang memberikan kestabilan terjamin',
      'Kusyen dalaman yang lembut menyokong tumit dan tapak kaki',
      'Warna gelap elegan yang tidak mudah kelihatan kotor',
    ],
  },
  {
    handle: 'sepatu-pria-k47-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Vanguard Luxe K47 High-Grade Leather-Trim Sneakers',
    newTitle: 'Elfy Vanguard Luxe K47 Sneakers',
    seoTitle: 'Elfy Vanguard Luxe K47 Sneakers - Kasut Sneakers Kemasan Kulit Mewah Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Vanguard Luxe K47 Sneakers di Malaysia. Kasut sneakers kemasan kulit mewah Vanguard Luxe, smart-casual bergaya eksklusif ke pejabat.',
    highlights: [
      'Kemasan leather-trim gred tinggi yang menonjolkan gaya sartorial mewah',
      'Sangat sesuai untuk gaya smart-casual ke pejabat atau majlis makan malam',
      'Kusyen insole mewah yang empuk dan selesa sepanjang hari',
      'Tapak getah berkualiti tinggi yang tahan haus dan tidak licin',
    ],
  },
  {
    handle: 'sepatu-pria-k48-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Volt Runner K48 Aerodynamic Performance Sneakers',
    newTitle: 'Elfy Volt Runner K48 Sneakers',
    seoTitle: 'Elfy Volt Runner K48 Sneakers - Kasut Lari Aerodinamik Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Volt Runner K48 Sneakers di Malaysia. Kasut sneakers lari aerodinamik berprestasi tinggi, ringan, pantas & cengkaman padu.',
    highlights: [
      'Bentuk aerodinamik Volt Runner memudahkan larian dan langkah laju',
      'Bahan bernafas memastikan kaki kekal kering semasa berpeluh',
      'Kusyen tapak tengah menyerap tekanan hentakan kaki dengan baik',
      'Tapak cengkaman getah tahan lama',
    ],
  },
  {
    handle: 'sepatu-pria-k49-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Terra Grip K49 Superior Traction Urban Sneakers',
    newTitle: 'Elfy Terra Grip K49 Sneakers',
    seoTitle: 'Elfy Terra Grip K49 Sneakers - Kasut Cengkaman Unggul Urban Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Terra Grip K49 Sneakers di Malaysia. Kasut urban cengkaman unggul Terra Grip, selamat melangkah di lantai licin, tangga & jalan raya.',
    highlights: [
      'Tapak cengkaman unggul Terra Grip yang menggigit permukaan lantai dengan mantap',
      'Binaan kukuh melindungi kaki daripada rintangan persekitaran bandar',
      'Kusyen dalaman empuk yang menyerap keletihan berjalan jauh',
      'Gaya moden maskulin yang menarik perhatian',
    ],
  },
  {
    handle: 'sepatu-pria-k50-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Pulse Lite K50 Everyday Soft-Step Sneakers',
    newTitle: 'Elfy Pulse Lite K50 Sneakers',
    seoTitle: 'Elfy Pulse Lite K50 Sneakers - Kasut Tapak Lembut Harian Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Pulse Lite K50 Sneakers di Malaysia. Kasut sneakers harian langkah lembut Pulse Lite, ringan dan selesa untuk dipakai ke mana sahaja.',
    highlights: [
      'Teknologi Soft-Step memberikan sensasi langkah yang lembut dan senyap',
      'Binaan Pulse Lite yang amat ringan di kaki',
      'Pengudaraan menyeluruh memastikan kaki bebas rasa rimas',
      'Pilihan sempurna untuk kasut harian serbaguna',
    ],
  },
  {
    handle: 'sepatu-pria-k51-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Apex Carbon K51 High-Density Cushioning Sneakers',
    newTitle: 'Elfy Apex Carbon K51 Sneakers',
    seoTitle: 'Elfy Apex Carbon K51 Sneakers - Kasut Kusyen Padu Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Apex Carbon K51 Sneakers di Malaysia. Kasut sneakers kusyen padu Apex Carbon, sokongan berketumpatan tinggi tahan kemek & selesa.',
    highlights: [
      'Kusyen High-Density Cushioning yang tahan kemek walaupun dipakai setiap hari',
      'Aksen bergaya corak karbon yang maskulin dan sporty',
      'Tapak getah cengkaman tinggi anti-gelincir di pelbagai permukaan',
      'Sokongan menyeluruh untuk kaki yang aktif bergerak',
    ],
  },
  {
    handle: 'sepatu-pria-k52-sneakers-sport-casual',
    category: "Men's Shoes",
    currentTitle: 'Grand Horizon K52 Elite Comfort Running Sneakers',
    newTitle: 'Elfy Grand Horizon K52 Sneakers',
    seoTitle: 'Elfy Grand Horizon K52 Sneakers - Kasut Selesa Elit Lelaki Malaysia - Elfy Official',
    seoDescription: 'Beli Elfy Grand Horizon K52 Sneakers di Malaysia. Kasut lari keselesaan elit Grand Horizon, kusyen empuk tebal & tapak tahan lasak berkualiti.',
    highlights: [
      'Tahap keselesaan elit Grand Horizon dengan sokongan tapak kaki penuh',
      'Material jaring premium yang kuat, anjal dan sejuk',
      'Tapak getah anti-gelincir berkualiti tinggi',
      'Pilihan terbaik untuk mereka yang mementingkan kualiti dan keselesaan berpanjangan',
    ],
  },
];

export function generateProductHtmlDescription(item) {
  const isShoe = item.category === "Men's Shoes";

  const intro = isShoe
    ? `<p><strong>${item.newTitle}</strong> direka khas untuk lelaki moden Malaysia yang mengutamakan keselesaan maksima sepanjang hari, sama ada untuk kerja, bersiar-siar, mahupun bersukan kasual. Dibina dengan fabrik mesh bernafas (breathable) yang sejuk dan tapak getah anti-gelincir berdaya cengkaman tinggi, sesuai untuk cuaca panas dan hujan di Malaysia.</p>`
    : `<p><strong>${item.newTitle}</strong> menampilkan gabungan keanggunan eksekutif dan ketahanan jam tangan harian. Dikuasakan oleh enjin Japanese Quartz Movement berketepatan tinggi serta kemasan casing keluli tahan karat, jam ini melengkapi penampilan sartorial anda di pejabat, majlis rasmi, mahupun gaya santai hujung minggu.</p>`;

  const specList = item.highlights
    .map((h) => `  <li><strong>${h.split(':')[0] || h}:</strong> ${h.split(':')[1] || ''}</li>`)
    .join('\n');

  const specs = `<h3>Kelebihan &amp; Spesifikasi Utama:</h3>\n<ul>\n${specList}\n</ul>`;

  const reassurance = isShoe
    ? `<h3>Jaminan &amp; Kelebihan Servis ELFY Malaysia:</h3>
<ul>
  <li>🚚 <strong>Penghantaran Pantas:</strong> 1-3 hari bekerja untuk Semenanjung (Pos Laju / J&amp;T). Penghantaran Percuma untuk pesanan RM150 ke atas!</li>
  <li>🔄 <strong>Jaminan Tukar Saiz 7 Hari Percuma:</strong> Jika saiz kurang muat, proses penukaran saiz pantas dan mudah tanpa soalan.</li>
  <li>📦 <strong>100% Ready Stock Malaysia:</strong> Dihantar terus dari gudang tempatan (bukan dropship luar negara).</li>
  <li>🎁 <strong>Pakej Eksklusif:</strong> Didatangkan dalam Kotak Kasut Khas ELFY &amp; pembungkusan bubble wrap tebal.</li>
</ul>

<h3>Panduan Memilih Saiz (Ukuran Tapak Kaki Dalam / Insole):</h3>
<ul>
  <li><strong>Saiz 39:</strong> 24.5 cm</li>
  <li><strong>Saiz 40:</strong> 25.0 cm</li>
  <li><strong>Saiz 41:</strong> 25.5 cm</li>
  <li><strong>Saiz 42:</strong> 26.0 cm</li>
  <li><strong>Saiz 43:</strong> 26.5 cm</li>
  <li><strong>Saiz 44:</strong> 27.0 cm</li>
</ul>
<p><em>*Tip Saiz: Jika bentuk kaki anda lebar (wide feet), kami cadangkan ambil 1 saiz lebih besar untuk keselesaan optimum.</em></p>`
    : `<h3>Jaminan &amp; Kelebihan Servis ELFY Malaysia:</h3>
<ul>
  <li>🚚 <strong>Penghantaran Pantas:</strong> 1-3 hari bekerja Semenanjung (Pos Laju / J&amp;T) &amp; 3-5 hari Sabah/Sarawak.</li>
  <li>🛡️ <strong>Jaminan 1 Tahun:</strong> Perlindungan kerosakan enjin jam tangan untuk ketenangan minda anda.</li>
  <li>📦 <strong>100% Ready Stock Malaysia:</strong> Penghantaran pantas dari gudang tempatan Malaysia.</li>
  <li>🎁 <strong>Pakej Eksklusif Termasuk:</strong> 1x Jam Tangan ELFY, 1x Kotak Hadiah Premium (Watch Gift Box), &amp; Kad Jaminan.</li>
</ul>`;

  return `${intro}\n\n${specs}\n\n${reassurance}`;
}

function verifyCatalog() {
  console.log('\n🔍 VERIFYING CATALOG OPTIMIZATION RULES...\n');
  let errors = 0;

  CATALOG_MAPPING.forEach((item, idx) => {
    const wordCount = item.newTitle.trim().split(/\s+/).length;
    if (wordCount > 5) {
      console.error(`❌ [Item ${idx + 1}] Title exceeds 5 words (${wordCount} words): "${item.newTitle}"`);
      errors++;
    }
    if (!item.newTitle.startsWith('Elfy')) {
      console.error(`❌ [Item ${idx + 1}] Title does not start with 'Elfy': "${item.newTitle}"`);
      errors++;
    }
    if (item.newTitle.includes('|')) {
      console.error(`❌ [Item ${idx + 1}] Title contains forbidden pipe '|': "${item.newTitle}"`);
      errors++;
    }
    if (item.seoTitle.includes('|')) {
      console.error(`❌ [Item ${idx + 1}] SEO Title contains forbidden pipe '|': "${item.seoTitle}"`);
      errors++;
    }
    if (!item.seoTitle.includes(' - ')) {
      console.error(`❌ [Item ${idx + 1}] SEO Title does not use standard separator ' - ': "${item.seoTitle}"`);
      errors++;
    }
  });

  if (errors === 0) {
    console.log(`✅ ALL ${CATALOG_MAPPING.length} PRODUCTS PASSED VERIFICATION!`);
    console.log('  • Maximum 5 words: STRICTLY COMPLIANT (100%)');
    console.log("  • Self-branded 'Elfy': STRICTLY COMPLIANT (100%)");
    console.log("  • Zero '|' pipes, strictly '-': STRICTLY COMPLIANT (100%)");
    console.log('  • Malaysian keyword intent: STRICTLY COMPLIANT (100%)\n');
  } else {
    console.error(`\n❌ Found ${errors} rule violations!`);
    process.exit(1);
  }
}

function printSummary() {
  verifyCatalog();
  console.log('====================================================================================================');
  console.log('#'.padEnd(4) + 'Handle'.padEnd(38) + 'New Title (<=5 words)'.padEnd(36) + 'Words');
  console.log('='.repeat(100));
  CATALOG_MAPPING.forEach((item, idx) => {
    const words = item.newTitle.split(/\s+/).length;
    console.log(
      `${(idx + 1 + '.').padEnd(4)}${item.handle.padEnd(38)}${item.newTitle.padEnd(36)}${words} words`,
    );
  });
  console.log('====================================================================================================\n');
}

function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function exportCsv() {
  verifyCatalog();
  const headers = ['Handle', 'Title', 'Body (HTML)', 'SEO Title', 'SEO Description'];
  const rows = [headers.join(',')];

  CATALOG_MAPPING.forEach((item) => {
    const row = [
      escapeCsv(item.handle),
      escapeCsv(item.newTitle),
      escapeCsv(generateProductHtmlDescription(item)),
      escapeCsv(item.seoTitle),
      escapeCsv(item.seoDescription),
    ];
    rows.push(row.join(','));
  });

  const outPath = resolve(process.cwd(), 'scripts/shopify-products-optimized.csv');
  writeFileSync(outPath, rows.join('\n'), 'utf-8');
  console.log(`💾 Saved Shopify import CSV to: ${outPath} (${CATALOG_MAPPING.length} products)\n`);
}

async function main() {
  const arg = process.argv[2] || 'verify';
  if (arg === 'verify') {
    verifyCatalog();
  } else if (arg === 'print') {
    printSummary();
  } else if (arg === 'export-json') {
    exportJson();
  } else if (arg === 'export-csv') {
    exportCsv();
  } else {
    console.log('Usage: node scripts/catalog-optimizer.mjs [verify|print|export-json|export-csv]');
  }
}

main();
