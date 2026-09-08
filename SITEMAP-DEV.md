# Development Map & System Sitemap — elfy.my
> Peta Navigasi Arsitektur, Struktur Rute, Komponen, dan Alur Data untuk Pengembang & AI Agent.

---

## 1. Peta Dokumen & Otoritas Spesifikasi (Documentation Index)

Gunakan tabel ini untuk mengetahui dokumen mana yang menjadi *single source of truth* untuk setiap kebutuhan:

```
                          [ ELFY.MY ROOT ]
                                 |
       +-------------------------+-------------------------+
       |                         |                         |
  [ BISNIS & CRO ]        [ DESAIN & UI/UX ]       [ TEKNIS & RUNTIME ]
       |                         |                         |
  * PRD.md                  * UI-UX-GUIDELINES.md     * ARCHITECTURE.md
  * DECISIONS.md            * SITEMAP-DEV.md (Peta)   * TRACKING-SIGNAL-ENGINE.md
  * TASKS.md                                          * OBSERVABILITY.md
  * STATUS.md                                         * AGENTS.md
  * BUILD-LOG.md                                      * RELEASE.md
                                                      * .env.example
```

| Domain | Dokumen Sumber | Isi Utama |
|---|---|---|
| **Visi & Persona** | [**`PRD.md`**](./PRD.md) | Persona Malaysia middle-up, katalog sepatu & jam tangan, matriks logistik, strategi bahasa hybrid. |
| **Peta Arsitektur & Rute** | [**`SITEMAP-DEV.md`**](./SITEMAP-DEV.md) | Dokumen ini: Peta rute URL, hirarki komponen, fragmen GraphQL, dan panduan cepat AI. |
| **Desain, Warna & Mobile** | [**`UI-UX-GUIDELINES.md`**](./UI-UX-GUIDELINES.md) | Palet Warm Alabaster, tipografi, spesifikasi Sticky ATC, Bottom Sheet Size Recommender, touch target 48px. |
| **Arsitektur Teknis** | [**`ARCHITECTURE.md`**](./ARCHITECTURE.md) | Shopify Hydrogen runtime, caching sub-request, CSP whitelist, dan integrasi Storefront API. |
| **Pelacakan & Ads Signal** | [**`TRACKING-SIGNAL-ENGINE.md`**](./TRACKING-SIGNAL-ENGINE.md) | Dual-funnel Meta Pixel + CAPI, GTM/Google Ads, deduplikasi `event_id`, Cart Attributes handoff. |
| **Keputusan Teknis (ADR)** | [**`DECISIONS.md`**](./DECISIONS.md) | ADR-001 s/d ADR-007 (Hydrogen, MYR, hybrid copy, minimalist badges, technical SEO & schema). |
| **Antrean Pekerjaan** | [**`TASKS.md`**](./TASKS.md) | Checklist pengerjaan Phase 1 (Setup) s/d Phase 6 (Merchandising, CRO & Technical SEO). |
| **Aturan Main AI Agent** | [**`AGENTS.md`**](./AGENTS.md) | Batasan teknis (*invariants*), larangan istilah Indonesia sembarangan, proteksi rahasia token. |
| **Status & Delivery Ledger** | [**`STATUS.md`**](./STATUS.md) | Catatan status pengerjaan real-time, ringkasan audit spesifikasi, dan delivery gates. |
| **Log Build & Riwayat** | [**`BUILD-LOG.md`**](./BUILD-LOG.md) | Kronologi detail build, refactoring, audit, dan perubahan teknis antar versi. |
| **Catatan Rilis Produksi** | [**`RELEASE.md`**](./RELEASE.md) | Versi rilis produksi, commit HEAD, status verifikasi live, dan rincian deployment Oxygen. |
| **Monitoring & CWV** | [**`OBSERVABILITY.md`**](./OBSERVABILITY.md) | Ambang batas Core Web Vitals (LCP < 1.5s, CLS = 0.00), penanganan error GraphQL. |

---

## 2. Peta Rute Storefront (URL Architecture & Route Map)

Berikut adalah struktur rute aplikasi Shopify Hydrogen pada direktori `app/routes/`:

```
elfy.my
│
├── /                                   -> [Homepage] Hero, Kategori 50/50, Best Sellers, The ELFY Standards
├── /collections                        -> [Collection Index] Semua kategori
│   ├── /all                            -> [PLP Semua Produk] Filter sepatu vs jam, ukuran, harga
│   ├── /mens-sneakers                  -> [PLP Sepatu] Khusus sepatu kasual & sneakers (Ukuran 39-44)
│   ├── /mens-watches                   -> [PLP Jam Pria] Jam tangan analog & quartz kasual
│   ├── /womens-watches                 -> [PLP Jam Wanita] Jam tangan elegan
│   ├── /best-sellers                   -> [PLP Best Sellers] Produk terlaris
│   └── /new-arrivals                   -> [PLP Rilis Terbaru] Koleksi terkini
│
├── /products/:handle                   -> [PDP] Galeri mobile 60fps, Size Recommender, Sticky ATC, Accordion, 4 Related Products
│
├── /search                             -> [Search] Full-text search (noindex, follow)
├── /cart                               -> [Cart Route / Fallback] (noindex, follow; Primer: Slide-out Cart Drawer)
│
├── /pages                              -> [Content & Policy Pages] (Schema: WebPage + FAQPage)
│   ├── /size-guide                     -> Panduan ukuran kaki Malaysia (CM, EU, UK, US)
│   ├── /warranty-returns               -> Kebijakan Jaminan Tukar Saiz 7 Hari & Garansi Jam 1 Tahun
│   ├── /shipping-faq                   -> Rincian kurir J&T/Pos Laju, SLA Semenanjung & Sabah/Sarawak
│   ├── /about                          -> Cerita brand ELFY & standar pengerjaan
│   └── /contact                        -> Layanan pelanggan & concierge WhatsApp
│
├── /policies                           -> [Shopify Legal Policies] (Crawlable for GMC)
│   ├── /privacy-policy                 -> Kebijakan Privasi Rasmi
│   ├── /shipping-policy                -> Polisi Penghantaran
│   ├── /terms-of-service               -> Terma Perkhidmatan
│   └── /refund-policy                  -> Polisi Pulangan & Bayaran Balik
│
├── /blogs                              -> [ELFY Journal] Panduan gaya & artikel horologi/sepatu
│   └── /:blogHandle/:articleHandle     -> [Article Detail] (Schema: BlogPosting)
│
├── /account                            -> [Customer Portal] (noindex, nofollow)
│   ├── /orders                         -> Riwayat pesanan
│   └── /profile                        -> Profil pelanggan
│
├── /robots.txt                         -> [Dynamic Robots.txt] GMC policy crawl allowed, cart/account/search protected
├── /sitemap.xml                        -> [Sitemap Index] Root sitemap
├── /sitemap/:type/:page.xml            -> [Sub-Sitemaps] Canonical-only URLs murni Malaysia (locales: [])
│
└── /api                                -> [Internal Resource Endpoints]
    ├── /meta-events                    -> Server-side Meta CAPI edge proxy
    └── /predictive-search              -> Pencarian produk instan
```

---

## 3. Hirarki & Struktur Komponen (Component Tree)

```
app/
├── root.tsx                            -> Layout Utama: HTML, Head, NonceProvider, CartProvider, GTM, Meta Pixel
│
├── components/
│   ├── layout/
│   │   ├── AnnouncementBar.tsx         -> Top banner hybrid ("Penghantaran Percuma Semenanjung RM150+...")
│   │   ├── Header.tsx                  -> Sticky Nav, Logo ELFY, Search, Cart Trigger
│   │   ├── MobileNavDrawer.tsx         -> Slide-out menu samping mobile (Kategori, MYR badge, WhatsApp)
│   │   └── Footer.tsx                  -> Badge SSM, Ikon pembayaran (FPX, TNG), Link garansi
│   │
│   ├── cart/
│   │   ├── CartDrawer.tsx              -> Slide-out keranjang belanja samping
│   │   ├── FreeShippingBar.tsx         -> Meteran progresif gratis ongkir (RM150 Semenanjung)
│   │   ├── CartLineItem.tsx            -> Stepper kuantitas (+ / -), thumbnail, varian ukuran
│   │   ├── CartUpsell.tsx              -> Modul 1-klik tambah produk pelengkap (Shoe Care / Strap)
│   │   └── CheckoutButton.tsx          -> Tombol checkout instan + deretan logo FPX, TNG, GrabPay
│   │
│   ├── product/
│   │   ├── ProductCard.tsx             -> Kartu produk katalog: Foto 1:1, hover gambar kedua, badge diskon
│   │   ├── ProductGallery.tsx          -> Mobile 60fps Carousel (CSS Scroll Snap, rasio terkunci, counter 1/5)
│   │   ├── VariantSelector.tsx         -> Pil ukuran sepatu EU 39–44 dengan status stok
│   │   ├── SizeRecommenderModal.tsx    -> Native Bottom Sheet: Kalkulator CM ke ukuran Malaysia
│   │   ├── StickyAddToCart.tsx         -> Bar melayang di bawah layar HP (Safe Area Inset compliance)
│   │   └── ProductAccordion.tsx        -> Tab lipat jaminan kurir, pemulangan, dan spesifikasi bahan
│   │
│   ├── home/
│   │   ├── HeroBanner.tsx              -> Lifestyle hero visual + dual CTA (Shoes & Watches)
│   │   ├── SplitCategoryGrid.tsx       -> Blok pemisah 50/50 Sepatu vs Jam Tangan
│   │   ├── FeaturedCollection.tsx      -> Grid produk terlaris dari live Shopify Storefront API
│   │   ├── StandardsTrustGrid.tsx      -> 4 Pilar ELFY (Kulit Asli, Safir, 1-3 Hari, 7-Day Exchange)
│   │   └── MalaysianSocialProof.tsx    -> Ulasan pembeli kota-kota Malaysia (KL, Penang, JB)
│   │
│   ├── common/
│   │   ├── Button.tsx                  -> Tombol standar dengan efek tactile press (active:scale-[0.98])
│   │   ├── Price.tsx                   -> Format harga resmi Ringgit Malaysia (`RM XXX.XX` + coret)
│   │   ├── Badge.tsx                   -> Label stok / promo / garansi
│   │   └── WhatsAppFloat.tsx           -> Tombol melayang konsultasi ukuran VIP
│   │
│   └── analytics/
│       ├── MetaPixel.tsx               -> Script Pixel client-side dengan nonce CSP
│       ├── GoogleTagManager.tsx        -> Script container GTM dengan nonce CSP
│       └── AttributionBridge.tsx       -> Helper penyuntik _fbp, _fbc, _ga ke Cart Attributes
│
├── graphql/
│   ├── fragments/
│   │   ├── ProductCardFragment.ts      -> Query ringkas untuk grid katalog (ID, judul, harga, cover)
│   │   ├── ProductDetailFragment.ts    -> Query lengkap PDP (5 gambar, varian ukuran, deskripsi)
│   │   └── CartFragment.ts             -> Query keranjang belanja & Cart Attributes
│   │
│   ├── queries/
│   │   ├── CollectionQuery.ts          -> Ambil produk berdasarkan handle koleksi
│   │   ├── ProductQuery.ts             -> Ambil detail produk berdasarkan handle
│   │   └── SearchQuery.ts              -> Ambil hasil pencarian kata kunci
│   │
│   └── mutations/
│       └── CartMutations.ts            -> cartCreate, cartLinesAdd, cartLinesUpdate, cartAttributesUpdate
│
└── styles/
    └── app.css                         -> Tailwind v4 theme, font tokens, CSS Scroll Snap rules
```

---

## 4. Peta Alur Data & Mutasi Cart (Data Flow Map)

```
[ User Action: Klik Tambah ke Beg ]
                 |
                 v
   [ VariantSelector / StickyATC ]
                 |
                 v
      [ cartLinesAdd Mutation ]
                 |
                 +---> [ Tambahkan Line Item Produk ke Shopify Cart ]
                 |
                 +---> [ AttributionBridge: Ekstraksi _fbp, _fbc, _ga ]
                 |        |
                 |        v
                 |     [ cartAttributesUpdate Mutation ]
                 |     (Menempelkan Atribut Tracking ke Cart)
                 |
                 +---> [ Emisi Event Dual-Funnel ]
                          |-- Client: fbq('track', 'AddToCart', {...}, {eventID})
                          |-- Server: CAPI event_id matching
                 |
                 v
        [ CartDrawer Terbuka ]
        - FreeShippingBar ter-update
        - Subtotal terhitung instan
                 |
                 v
   [ User Klik: Checkout Button ]
                 |
                 v
 [ Redirect ke: cart.checkoutUrl ]
 (Atribut _fbp/_fbc/_ga dibawa ke Order Shopify secara utuh)
```

---

## 5. Panduan Navigasi Cepat AI (Fast-Path Reference for Coding Agents)

Bagi AI coding assistant atau developer yang akan mengubah kode di repositori ini, gunakan rute pintas berikut:

| Kebutuhan Anda | File / Direktori yang Wajib Dibuka |
|---|---|
| **Mengubah teks banner / jaminan / copy toko** | Periksa dulu [**`UI-UX-GUIDELINES.md`**](./UI-UX-GUIDELINES.md) (Kamus Copy Hybrid), lalu edit di `app/components/layout/AnnouncementBar.tsx` atau `app/components/product/ProductAccordion.tsx`. |
| **Menyesuaikan warna tema, background, atau font** | [**`UI-UX-GUIDELINES.md`**](./UI-UX-GUIDELINES.md) & `app/styles/app.css`. |
| **Menambah atau mengubah integrasi Pixel / CAPI / GTM** | [**`TRACKING-SIGNAL-ENGINE.md`**](./TRACKING-SIGNAL-ENGINE.md) & `app/components/analytics/`. |
| **Mengubah logika sticky bar di HP** | [**`UI-UX-GUIDELINES.md` (Section 6)**](./UI-UX-GUIDELINES.md#L129-L193) & `app/components/product/StickyAddToCart.tsx`. |
| **Mengubah logika perhitungan gratis ongkir** | `app/components/cart/FreeShippingBar.tsx` (Target threshold: RM 150 Semenanjung, RM 220 Sabah/Sarawak). |
| **Menambah query / fragmen GraphQL produk** | `app/graphql/fragments/` dan `app/graphql/queries/`. |
| **Melihat urutan task pengerjaan** | [**`TASKS.md`**](./TASKS.md). |
| **Memeriksa aturan dilarang / invariants** | [**`AGENTS.md`**](./AGENTS.md). |
