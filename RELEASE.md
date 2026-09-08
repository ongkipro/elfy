# Production Release Record — elfy.my

## Active Production Release: v1.1.0-seo-cro

- **Release Date**: 2026-09-08
- **Live URL**: [`https://elfy.my/`](https://elfy.my/)
- **Target Edge Infrastructure**: Shopify Oxygen (Cloudflare V8 Isolates)
- **Storefront ID**: `1000178284`
- **Shopify Admin**: `vvxgev-3p.myshopify.com`
- **Git Commit HEAD**: `6f469f6` (`feat(seo): complete technical SEO, robots, sitemap, OpenGraph, and Schema.org audit`)

---

## 1. Release Changelog & Delivered Scope

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
