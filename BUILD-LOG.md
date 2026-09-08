# Build & Technical Execution Log — elfy.my

This document serves as the chronological build ledger tracking technical architecture implementations, design decisions, optimizations, and deployment milestones for the ELFY headless storefront.

---

## [2026-09-07] Phase 1: Architecture Scaffolding, Toolchain & Security Baseline
- **Objective**: Establish the foundation for a sub-second headless e-commerce storefront for the Malaysian market.
- **Key Deliverables**:
  - Initialized repository with standard conventions.
  - Configured Shopify Hydrogen on modern React Router 7 / Remix architecture, Vite, and strict TypeScript.
  - Integrated Tailwind CSS v4 via `@tailwindcss/vite` with Warm Alabaster aesthetic tokens (`#FAF9F6`, `#EBE6DF`, `#B48344`, `#191817`).
  - Hardened Content Security Policy (CSP) in `app/entry.server.tsx` with dynamic cryptographic nonces for script and style evaluation.
  - Hard-locked store locale and currency to `MYR` (`RM XXX.XX`).

---

## [2026-09-07] Phase 2: Global Mobile Ergonomics, Layout & Cart Drawer
- **Objective**: Build an instant, frictionless conversion container tailored for mobile shoppers.
- **Key Deliverables**:
  - Implemented `AnnouncementBar.tsx` featuring localized free shipping threshold and 7-day size exchange guarantee.
  - Designed `Header.tsx` with sticky behavior, mobile navigation drawer, integrated search modal, and live cart count.
  - Constructed `CartMain.tsx` slide-out drawer replacing full-page cart redirects, featuring:
    - Real-time `FreeShippingBar.tsx` calculating progress toward RM150 Semenanjung threshold.
    - Direct quantity steppers and subtotal calculations via Hydrogen Cart mutations.
    - One-tap express checkout CTA linking directly to Shopify Hosted Checkout.
  - Implemented `Footer.tsx` with official SSM compliance notices, Malaysian courier trust pillars, and payment rail disclosures.

---

## [2026-09-07] Phase 3: Storefront Routes & Live Catalog Integration
- **Objective**: Deliver high-converting customer touchpoints querying live Shopify Storefront GraphQL data (`vvxgev-3p.myshopify.com`).
- **Key Deliverables**:
  - **Homepage (`app/routes/_index.tsx`)**: Full-bleed cinematic hero, 50/50 dual collection split (Sneakers vs Watches), dynamic Best Sellers carousel, 4-pillar trust badges, verified Malaysian customer reviews, and WhatsApp concierge.
  - **Collection & PLP (`app/routes/collections.$handle.tsx`, `collections.all.tsx`, `collections._index.tsx`)**: Dynamic category switcher pills, 1:1 locked aspect ratio product cards, discount badges, and price display.
  - **Product Detail Page (`app/routes/products.$handle.tsx`)**:
    - 60fps CSS scroll-snap gallery with zero layout shift (CLS = 0).
    - Variant selection pills (EU 39–44).
    - Mobile sticky bottom Add to Cart bar with iOS Safe Area Insets.
    - Interactive `SizeRecommenderModal.tsx` converting CM foot length to Malaysian sizing with Asian wide-fit reassurance.
    - Comprehensive accordion tabs covering craft specs, delivery timelines, and exchange guarantees.
  - **Policy & Content Pages (`app/routes/pages.$handle.tsx`)**: Curated static templates for `/pages/size-guide`, `/pages/warranty-returns`, `/pages/shipping-faq`, `/pages/about`, and `/pages/contact`.

---

## [2026-09-07] Phase 4: Marketing Signal Engine & Attribution Bridge
- **Objective**: Eliminate attribution decay across domain boundaries (`elfy.my` -> Shopify Hosted Checkout).
- **Key Deliverables**:
  - Implemented dual-funnel Meta Ads signal model:
    - Client-side Meta Pixel (`PUBLIC_META_PIXEL_ID` = `1251216460002426`) with CSP nonce support and `<noscript>` fallback.
    - Deterministic `event_id` generation (`eventName_timestamp_random`) ensuring 1:1 deduplication between browser `fbq` and server CAPI.
  - Configured Google Tag Manager (`PUBLIC_GTM_ID`) and GA4 ecommerce events (`view_item`, `add_to_cart`, `begin_checkout`).
  - Implemented Cross-Domain Attribution Bridge: Extracting first-party cookies (`_fbp`, `_fbc`, `_ga`) and ad query params (`gclid`, `fbclid`) and attaching them as Shopify Cart Attributes (`_attribution_fbp`, `_attribution_fbc`, `_attribution_ga`, `_attribution_gclid`) before checkout handoff.
  - Added edge server CAPI proxy at `/api/meta-events`.

---

## [2026-09-07] Phase 5: Verification, Core Web Vitals & Production Readiness
- **Objective**: Audit code quality, edge performance, and accessibility.
- **Key Deliverables**:
  - Verified `npm run typecheck` and `npm run build` pass with 0 errors.
  - Confirmed sub-second edge TTFB (<200ms) with `stale-while-revalidate` caching strategy on catalog queries.
  - Verified zero CLS with aspect-ratio locked media containers and preloaded hero webp images.

---

## [2026-09-07 — 2026-09-08] Phase 6: Catalog Optimization, CRO Modernization & Technical SEO
- **Objective**: Refine catalog merchandising, elevate visual micro-elements, and execute a comprehensive technical SEO and rich snippet overhaul.
- **Key Deliverables**:
  - **Banner Redesign**: Replaced cluttered overlays with clean 3:2 aspect ratio photography across all 5 active collections.
  - **Product Descriptions**: Streamlined 51 live product descriptions via Shopify Admin GraphQL mutation scripts, removing duplicate warranty boilerplate and structuring content into Essence, Materials, and Sizing Advisory.
  - **Related Products Grid**: Replaced heavy promotional blocks on PDP with a clean, randomized 4-product grid (`Produk Berkaitan`) from the same category.
  - **Minimalist Payment Badges**: Replaced external image logos with unified, high-contrast text micro-pill badges (`FPX`, `TNG eWallet`, `GrabPay`, `VISA / MC`) in `TrustPaymentBadges.tsx`.
  - **Dynamic Robots.txt (`app/routes/[robots.txt].tsx`)**:
    - Removed `Disallow: /policies/` to ensure full compliance with Google Merchant Center (GMC) and Google Ads return policy crawling requirements.
    - Maintained disallow rules for `/cart`, `/account`, `/search`, and internal parameter permutations.
    - Linked canonical sitemap index (`https://elfy.my/sitemap.xml`).
  - **Sub-Sitemap Clean Up (`app/routes/sitemap.$type.$page[.xml].tsx`)**:
    - Purged foreign hreflang boilerplate (`locales: []`), outputting clean canonical URLs exclusively for Malaysian store paths.
  - **Explicit Index vs Noindex Directives**:
    - Public storefront routes (`_index`, `products.$handle`, `collections.*`, `pages.$handle`, `policies.*`, `blogs.*`): Explicit `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`.
    - Internal search & cart (`search.tsx`, `cart.tsx`): `noindex, follow` (crawl waste & duplicate penalty prevention).
    - Customer portal (`account.tsx`): `noindex, nofollow` (private customer data protection).
  - **Social Sharing OpenGraph (1200x630)**:
    - Added full `og:image`, `og:image:width: '1200'`, `og:image:height: '630'`, `og:image:alt`, and `twitter:card: 'summary_large_image'` across every route with high-fidelity fallbacks.
  - **Google Schema.org Rich Results (JSON-LD)**:
    - Injected `Organization` & `WebSite` graph at root level.
    - Injected `Product` schema with live prices in `MYR`, inventory status, and `AggregateRating`.
    - Injected `CollectionPage` and `ItemList` schemas across category and catalog routes.
    - Injected `FAQPage` schema on `/pages/shipping-faq` and `/pages/warranty-returns` for Google SERP accordion rich results.
    - Injected `BlogPosting` schema on journal article pages.
    - Integrated `BreadcrumbList` schema across all detail pages.
  - **Lighthouse Accessibility Compliance**:
    - Removed `maximum-scale=1` constraint from root viewport meta tag in `app/root.tsx`.
  - **Deployment**:
    - Changes verified via `npm run typecheck` (0 errors) and `npm run build` (clean SSR bundle).
    - Committed under commit `6f469f6`, pushed to `origin main`, and deployed to Shopify Oxygen in 40s.
