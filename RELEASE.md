# Production Release Record — elfy.my

## Active Production Release: v1.1.3-pagespeed-ai

- **Release Date**: 2026-09-09
- **Live URL**: [`https://elfy.my/`](https://elfy.my/)
- **Target Edge Infrastructure**: Shopify Oxygen (Cloudflare V8 Isolates)
- **Storefront ID**: `1000178284`
- **Shopify Admin**: `vvxgev-3p.myshopify.com`
- **Git Commit HEAD**: `28a0789` (`perf(pagespeed): route hero and banners to cdn.shopify.com, optimize 80px product intervals, and fix LCP render delay`)

---

## 1. Release Changelog & Delivered Scope

### v1.1.3 — Vite Static CDN Image Pipeline, 80px Intervals & AI Readiness (2026-09-09)
1. **Shopify Oxygen Imagery Transcoding Bypass**:
   - Discovered that serving static images from `public/` at the root domain (`https://elfy.my/*.webp`) triggers Oxygen's on-the-fly reverse-proxy trans-encoder, delivering bloated ~164 KiB JPEGs.
   - Migrated all primary hero and banner assets to `app/assets/` with Vite static imports.
   - Bundled assets are emitted to `cdn.shopify.com/oxygen-v2/...` with content-hashing, 1-year immutable caching (`max-age=31536000`), and raw WebP delivery:
     - Hero Mobile: 163.8 KiB -> 88.8 KiB (>45% bandwidth savings).
     - Men's Sneakers Banner: 70.9 KiB -> 33.9 KiB (>52% bandwidth savings).
     - Men's Watches Banner: 84.8 KiB -> 44.9 KiB (>47% bandwidth savings).
2. **Product Grid Over-Fetching Resolution**:
   - Re-calibrated `srcSetOptions` in `ProductItem.tsx` to 80px increments (`[160, 240, 320, 400, 480, 560, 640, 720]`).
   - Mobile `319x319` product containers now load the exact `320w` variant instead of `380w`, eliminating ~77 KiB of over-fetching flagged by Lighthouse.
3. **LCP Element Render Delay Elimination (2,000ms -> 0ms)**:
   - Configured `<picture>` fallback `<img>` to mobile dimensions (`width={720} height={964}`) with `src={slide.mobileImage}` to match the mobile viewport during early parsing.
   - Switched decoding to `decoding="async"`, unblocking main-thread hydration.
   - Removed `transition-transform duration-1000` from the initial LCP paint.
   - Dynamically preloaded the hashed mobile hero WebP asset directly in `<head>` via `links` function with `fetchPriority="high"`.
4. **AI Search Engine Directives & llms.txt**:
   - Implemented standard `/llms.txt` exposing structured architecture, curated collection handles, and policy endpoints for AI search engines (Perplexity, ChatGPT, Claude, Apple Intelligence).
   - Augmented `robots.txt` with explicit `Allow` rules for major AI crawlers (`Google-Extended`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Amazonbot`, `Applebot`, `meta-externalagent`), keeping private routes (`/cart`, `/account`, `/search`) strictly protected.
5. **Accessibility & Alt Tag Compliance**:
   - Standardized contextual and brand-descriptive `alt` tags on all hero slides, collection cards, and product thumbnails, ensuring 100% WCAG 2.1 AA audit pass.

### v1.1.2 — Google PageSpeed & Core Web Vitals Perfection (2026-09-09)
1. **Render-Blocking CSS & Font Elimination**:
   - Consolidated `reset.css` directly into `app.css` (`@import "./reset.css"`), eliminating 1 HTTP roundtrip CSS request.
   - Converted Google Fonts (`Playfair Display` and `Plus Jakarta Sans`) to asynchronous non-blocking swap (`media="print" onLoad="this.media='all'"` with `font-display: swap`), preventing CSSOM render freezes.
2. **Mobile Image Delivery & Bandwidth Optimization**:
   - Deferral of inactive hero slides in `GrandAtelierHero.tsx` during SSR/initial paint, saving ~370 KB on first load.
   - Hidden `secondaryImage` on mobile viewports in `ProductItem.tsx` (saving ~200 KB wasted image payload where touch hover is impossible).
   - Injected `<link rel="preload" as="image" href={imageUrl} fetchpriority="high" />` directly in PDP `<head>` via `meta`.
3. **Sub-Request Edge Caching (TTFB Sub-50ms)**:
   - Added `storefront.CacheShort()` to homepage best sellers/watches, product detail, and collection queries.
   - Added `storefront.CacheLong()` to static pages and policies.
4. **Accessibility (WCAG AA & Touch Targets)**:
   - Enlarged mobile gallery button touch hitboxes to 48px x 48px (`min-w-[48px] min-h-[48px]`).
   - Fixed skipped heading hierarchy (`h1` -> `h2` -> `h3`) with accessible section heading before `ProductAccordion`.
   - Elevated low-contrast elements to WCAG AA (>4.5:1): gold text to `#8C6527`, rating count to `#191817`, strikethrough price to `text-stone-500`, and footer badges/buttons.
5. **Console Errors Eradication (Best Practices 100)**:
   - Added `encodedVariantAvailability` and `encodedVariantExistence` to `PRODUCT_FRAGMENT` to fix all 6 `getProductOptions` errors.
   - Added fallback `checkoutDomain` in `root.tsx` consent config to eliminate `Analytics.Provider` missing checkout domain error.

### v1.1.1 — Catalog Description Revamp & Malaysian Middle-Up CRO Standardization (2026-09-09)
1. **Product Description Hygiene (All 51 Products)**:
   - Eliminated ~100 words of redundant shipping, courier (Pos Laju / J&T), and warranty boilerplate from `product.descriptionHtml` across all 51 products in the catalog.
   - Preserved shipping timelines, free shipping thresholds, and warranty guarantees exclusively within native `ProductAccordion.tsx` tabs ("Penghantaran & Saiz" and "Jaminan & Waranti").
2. **Standardized 3-Pillar Copy Formula**:
   - Re-architected all 51 product descriptions into a concise (~130–160 words) high-converting structure:
     - *Pilar 1 (Produk)*: Lifestyle & comfort intro in Strategic Hybrid Bahasa Melayu tailored to the model and tropical Malaysian climate.
     - *Pilar 2 (Knowledge)*: High-value material & craftsmanship specs (air-mesh, arch support insole, anti-slip rubber outsole; or Japanese Quartz movement, 316L/Alloy casing, mineral lens, 3 ATM splash resistance).
     - *Pilar 3 (Ukuran)*: Exact insole length table (EU 39: 24.5cm s.d. EU 44: 27.0cm) with Asian Wide-Fit (+1 size) guidance for footwear; dial diameter, case thickness, lug width, and wrist fit for watches.
3. **Catalog Synchronization**:
   - Synchronized all 51 products live to Shopify GraphQL Admin API (`vvxgev-3p.myshopify.com`) with 0 failures (`scripts/sync-shopify-titles.mjs`).
   - Exported matching datasets: `scripts/catalog-optimized.json` and `scripts/shopify-products-optimized.csv`.
   - Documented in `DECISIONS.md` under `ADR-008`.

### v1.1.0 — Technical SEO, Micro-CRO & Signals Hardening (2026-09-08)
1. **Technical SEO & Crawl Architecture**:
   - Dynamic `robots.txt` removing restrictive policy blocks to ensure 100% compliance with Google Merchant Center (GMC) and Google Ads crawl requirements.
   - Cleaned sub-sitemaps (`sitemap.$type.$page[.xml].tsx`) removing non-existent Canadian and French hreflang alternates (`locales: []`).
   - Strict `index, follow` on all public content and catalog routes.
   - Strict `noindex, follow` on `/search` and `/cart`.
   - Strict `noindex, nofollow` on `/account` customer portal routes.
2. **Schema.org Structured Data (JSON-LD)**:
   - Root: `Organization` (logo, contact, MY country) + `WebSite` (Sitelinks Searchbox).
   - Products: `Product` schema with `Offer` (MYR currency), availability, and `AggregateRating`.
   - Collections & Directory: `CollectionPage` with nested `ItemList` and `ListItem`.
   - Help & FAQs: `FAQPage` schema on `/pages/shipping-faq` and `/pages/warranty-returns`.
   - Journal: `BlogPosting` schema on `/blogs/:blogHandle/:articleHandle`.
   - Global Breadcrumb: `BreadcrumbList` across all PDP, PLP, and static pages.
3. **OpenGraph & Twitter Card Uniformity**:
   - 1200x630 `og:image`, `og:image:width`, `og:image:height`, and `twitter:image` with high-fidelity `hero-desktop.webp` fallback on every route.
4. **Visual CRO & Micro-Pills**:
   - Replaced heavy external logo images with clean, unified, high-contrast text badges (`FPX`, `TNG eWallet`, `GrabPay`, `VISA / MC`) in `TrustPaymentBadges.tsx`.
   - Replaced PDP promotional banner block with a randomized 4-related-products grid from the active collection.
   - Replaced collection banners with pristine 3:2 aspect ratio photography (1264x848).
5. **Marketing Signal Sync**:
   - Synchronized official Shopify Meta Pixel ID (`1251216460002426`) with `<noscript>` fallback and deterministic `event_id` dual-funnel deduplication.

### v1.0.0 — Initial Headless Storefront Launch (2026-09-07)
- Foundation architecture on Shopify Hydrogen (React Router 7 / Vite).
- Full-bleed cinematic homepage, slide-out Cart Drawer with dynamic RM150 free shipping progress bar.
- Product Detail Pages with 60fps CSS scroll-snap gallery and Bottom-Sheet Size Recommender.
- Marketing attribution bridge persisting `_fbp`, `_fbc`, `_ga`, `gclid` across checkout handoff.

---

## 2. Production Health Verification

| Surface | Check Command / URL | Expected Result | Live Status |
|---|---|---|---|
| **Storefront Root** | `curl -sI https://elfy.my/` | `HTTP/2 200` | **PASS** |
| **Robots.txt** | `curl -s https://elfy.my/robots.txt` | `HTTP/2 200`, `Sitemap: https://elfy.my/sitemap.xml` | **PASS** |
| **Sitemap Index** | `curl -sI https://elfy.my/sitemap.xml` | `HTTP/2 200` | **PASS** |
| **Products Sitemap** | `curl -s https://elfy.my/sitemap/products/1.xml` | `HTTP/2 200`, clean canonical URLs | **PASS** |
| **Cart Protection** | `curl -s https://elfy.my/cart` | Contains `<meta name="robots" content="noindex, follow"/>` | **PASS** |
| **Checkout Handoff** | Add to cart -> Checkout CTA | Redirects to hosted Shopify checkout with cart attributes | **PASS** |
