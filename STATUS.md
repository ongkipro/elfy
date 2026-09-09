# Status & Delivery Ledger — elfy.my

## 1. Project Overview & Current State
- **Project**: ELFY (`elfy.my`) — Headless Shopify Storefront (Shopify Hydrogen / React Router 7 / Vite / Tailwind CSS v4)
- **Target Market**: Malaysian Middle-Up Market (Footwear & Horology)
- **Shopify Backend**: `vvxgev-3p.myshopify.com`
- **Current Status**: **PRODUCTION READY / LIVE DEPLOYED** (Phases 1 through 7 100% Executed, Verified & Deployed to Shopify Oxygen).

---

## 2. Phase Execution & Delivery Summary

| Phase | Description | Status | Verification Evidence |
|---|---|---|---|
| **Phase 1** | Scaffolding, Environment, CSP & Tailwind v4 | **DONE** | Vite + React Router 7 + `@tailwindcss/vite` configured. CSP hardened with nonces for Meta Ads & Google Tag Manager. |
| **Phase 2** | Global Layout, Mobile Navigation & Cart Drawer | **DONE** | Sticky Header, Announcement Bar, Mobile Drawer, Footer with SSM & payment rails, Slide-out Cart Drawer with dynamic RM150 Free Shipping progress bar. |
| **Phase 3** | High-Converting Storefront Routes | **DONE** | Homepage (`/`), PLP (`/collections/:handle`, `/collections/all`), PDP (`/products/:handle`) with 60fps CSS scroll-snap carousel & Bottom Sheet Size Recommender, Content Pages (`/pages/size-guide`, `/pages/warranty-returns`, `/pages/shipping-faq`). |
| **Phase 4** | Marketing Signal Engine & Attribution Bridge | **DONE** | Meta Pixel (`1251216460002426`) + GTM injected with CSP nonces; deterministic `event_id` deduplication; Cross-domain Cart Attributes (`_attribution_fbp`, `_fbc`, `_ga`, `_gclid`); Edge Meta CAPI Proxy (`/api/meta-events`). |
| **Phase 5** | Testing, Performance Audit & Launch Readiness | **DONE** | `npm run typecheck` passed (0 errors); `npm run build` passed (0 errors); MiniOxygen preview verified via HTTP 200 on all primary routes. |
| **Phase 6** | Merchandising, CRO, Catalog & Technical SEO Audit | **DONE** | 3:2 banners; minimalist text payment badges; 4 randomized related products grid; GMC-compliant `robots.txt`; cleaned sub-sitemaps (no foreign hreflang); complete OpenGraph 1200x630; Schema.org JSON-LD; **51/51 live product descriptions audited & revamped** (eliminated redundant shipping/warranty copy, structured into 3-pillar format with CM insole & horology dimensions). Deployed live to `https://elfy.my/`. |
| **Phase 7** | Google PageSpeed, Core Web Vitals & AI Crawler Optimization | **DONE** | Non-blocking CSS & Google Fonts swap; Vite static asset CDN bundling (hero mobile cut from 164KB to 88KB, banners cut >50%); 80px product intervals eliminating 77KB over-fetching; 2,000ms LCP render delay eliminated via async decoding & mobile native fallback; `llms.txt` + AI crawler directives in `robots.txt`; WCAG AA contrast; 0 console errors. Deployed live to Shopify Oxygen. |

---

## 3. Localization & Conversion Invariants Verified

- [x] **Currency & Locale**: Hard-locked to `MYR` (`RM XXX.XX`). Multi-currency conversion prohibited.
- [x] **Language & Copy**: Strict Strategic Hybrid English + Bahasa Melayu across all UI elements.
- [x] **Product Descriptions**: 100% free of duplicate shipping/warranty boilerplate (handled in `ProductAccordion.tsx`); structured into Product Essence, Craftsmanship/Material Knowledge, and Sizing/Dimensions (insole CM for shoes, dial/case/lug for watches).
- [x] **Logistics & SLAs**: Semenanjung (1-3 days, free shipping threshold RM150), Sabah & Sarawak (3-5 days, free shipping threshold RM220).
- [x] **Attribution Bridge**: Verified presence of cart attributes (`_attribution_fbp`, `_attribution_fbc`, `_attribution_ga`, `_attribution_gclid`) before checkout handoff.
- [x] **Mobile Ergonomics**: 48px minimum touch targets, thumb-zone sticky Add to Cart bar with iOS safe-area insets, zero cumulative layout shift (CLS = 0) with locked 1:1 image aspect ratios.
- [x] **Security**: Secrets (`META_CAPI_ACCESS_TOKEN`, `SESSION_SECRET`) strictly confined to edge server handlers.

---

## 4. Local Run & Verification Instructions
- **Start Dev Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Run Production Preview**: `npm run preview`
- **Run Typecheck**: `npm run typecheck`
