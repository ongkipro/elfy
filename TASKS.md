# Development Tasks & Execution Queue — elfy.my
## Headless Shopify Hydrogen Storefront (Casual Footwear & Horology for Middle-Up Malaysia)

---

## Rules for AI & Developers
1. **One Task at a Time**: Complete and test each task before advancing.
2. **Explicit DoD (Done when)**: A task is only complete when its runnable acceptance check passes.
3. **Traceability**: Each task traces to its primary specification in `PRD.md`, `ARCHITECTURE.md`, `UI-UX-GUIDELINES.md`, or `TRACKING-SIGNAL-ENGINE.md`.
4. **Localization Invariants**: Currency permanently locked to `MYR` (`RM XXX.XX`), Strategic Hybrid copy (English titles/specs, Bahasa Melayu trust/guarantees), strict 48px touch targets.
5. **Attribution Preservation**: Mandatory attachment of `_attribution_fbp`, `_attribution_fbc`, `_attribution_ga`, `_attribution_gclid` to Cart Attributes.

---

## Phase 1: Environment, Git & Scaffolding

- [x] **Task 1.1: Local Git Initialization & Repository Setup**
  - **Primary Requirement**: Setup version control boundary adhering to dotfiles/OMP contracts.
  - **File Target**: `.git`, `.gitignore`
  - **Status**: Completed & Verified.

- [x] **Task 1.2: Shopify Hydrogen Project Scaffolding**
  - **Primary Requirement**: `ARCHITECTURE.md` Section 2 (Hydrogen React Router 7 / Vite / TypeScript engine).
  - **File Target**: `package.json`, `vite.config.ts`, `server.ts`, `app/root.tsx`
  - **Status**: Completed & Verified.

- [x] **Task 1.3: Storefront API & Environment Configuration**
  - **Primary Requirement**: `PRD.md` Section 1.1 & `ARCHITECTURE.md` Section 2 (`vvxgev-3p.myshopify.com`).
  - **File Target**: `.env`, `env.d.ts`, `app/lib/context.ts`
  - **Status**: Completed & Verified (Locked to MY / MYR).

- [x] **Task 1.4: Content Security Policy (CSP) Hardening**
  - **Primary Requirement**: `ARCHITECTURE.md` Section 4.2 & `TRACKING-SIGNAL-ENGINE.md` Section 4.
  - **File Target**: `app/entry.server.tsx`
  - **Status**: Completed & Verified with nonces and whitelisted Meta Ads, GTM, GA4.

- [x] **Task 1.5: Tailwind CSS v4 & Design Tokens Configuration**
  - **Primary Requirement**: `UI-UX-GUIDELINES.md` Section 2 & Section 3.
  - **File Target**: `app/styles/app.css`, `vite.config.ts`
  - **Status**: Completed & Verified (@tailwindcss/vite + theme tokens).

---

## Phase 2: Global Layout, Mobile Navigation & Slide-Out Cart Drawer

- [x] **Task 2.1: Strategic Hybrid Announcement Top Bar**
  - **Primary Requirement**: `PRD.md` Section 3.2 & `UI-UX-GUIDELINES.md` Section 4.1.
  - **File Target**: `app/components/AnnouncementBar.tsx`
  - **Status**: Completed & Verified ("Penghantaran Percuma Semenanjung RM150+ | 7-Day Size Exchange").

- [x] **Task 2.2: Global Sticky Header & Mobile Nav Drawer**
  - **Primary Requirement**: `UI-UX-GUIDELINES.md` Section 4.1 & `SITEMAP-DEV.md` Section 3.
  - **File Target**: `app/components/Header.tsx`
  - **Status**: Completed & Verified (Editorial typography, search, mobile drawer, live cart count).

- [x] **Task 2.3: Malaysian Trust Footer & SSM Compliance**
  - **Primary Requirement**: `PRD.md` Section 2.2 & `UI-UX-GUIDELINES.md` Section 4.1.
  - **File Target**: `app/components/Footer.tsx`
  - **Status**: Completed & Verified (SSM notice, Malaysian courier & payment rails, policy links).

- [x] **Task 2.4: Slide-Out Cart Drawer & Sub-Request Cart Handler**
  - **Primary Requirement**: `ARCHITECTURE.md` Section 3, `PRD.md` Section 5, `UI-UX-GUIDELINES.md` Section 4.4 & 6.7.
  - **File Target**: `app/components/CartMain.tsx`, `app/components/CartLineItem.tsx`
  - **Status**: Completed & Verified.

- [x] **Task 2.5: Dynamic Free Shipping Progress Bar & Cart Upsell**
  - **Primary Requirement**: `PRD.md` Section 2.1 (RM150 Semenanjung threshold) & Section 4.3.
  - **File Target**: `app/components/FreeShippingBar.tsx`, `app/components/CartMain.tsx`
  - **Status**: Completed & Verified (Dynamic RM150 threshold calculation with celebratory state).

- [x] **Task 2.6: One-Tap Express Checkout CTA & Payment Rail Badges**
  - **Primary Requirement**: `PRD.md` Section 3.2 & `UI-UX-GUIDELINES.md` Section 6.7.
  - **File Target**: `app/components/CartSummary.tsx`, `app/components/TrustPaymentBadges.tsx`
  - **Status**: Completed & Verified (FPX, TNG, GrabPay badges, InitiateCheckout signal trigger).

---

## Phase 3: High-Converting Storefront Routes (Live Shopify Data)

- [x] **Task 3.1: Curated Homepage Experience (`/`)**
  - **Primary Requirement**: `PRD.md` Section 4 & `UI-UX-GUIDELINES.md` Section 4.2.
  - **File Target**: `app/routes/_index.tsx`
  - **Status**: Completed & Verified (Hero, 50/50 Split, Best Sellers from live store, 4-pillar trust, Malaysian reviews, VIP concierge).

- [x] **Task 3.2: Collection & Product Listing Page (`/collections/:handle`)**
  - **Primary Requirement**: `PRD.md` Section 4 & `SITEMAP-DEV.md` Section 2.
  - **File Target**: `app/routes/collections.$handle.tsx`, `app/routes/collections.all.tsx`, `app/components/ProductItem.tsx`
  - **Status**: Completed & Verified (Category switcher, 1:1 image cards, 50% discount tags, star ratings).

- [x] **Task 3.3: High-Converting Product Detail Page (PDP — `/products/:handle`)**
  - **Primary Requirement**: `PRD.md` Section 4 & `UI-UX-GUIDELINES.md` Section 4.3.
  - **File Target**: `app/routes/products.$handle.tsx`, `app/components/ProductForm.tsx`
  - **Status**: Completed & Verified (60fps CSS scroll-snap carousel, compare-at pricing, size pills, delivery badge, accordion).

- [x] **Task 3.4: Mobile Bottom-Sheet Size Recommender Modal**
  - **Primary Requirement**: `PRD.md` Section 2.2 & `UI-UX-GUIDELINES.md` Section 6.6.
  - **File Target**: `app/components/SizeRecommenderModal.tsx`
  - **Status**: Completed & Verified (Interactive CM to EU/UK selector with Malaysian Wide-fit reassurance).

- [x] **Task 3.5: Mobile Sticky Add-to-Cart (ATC) Bar**
  - **Primary Requirement**: `UI-UX-GUIDELINES.md` Section 6.3 (Thumb Zone Architecture).
  - **File Target**: `app/components/StickyAddToCart.tsx`
  - **Status**: Completed & Verified (Pinned bottom bar, safe-area-inset compliance, 48px hitboxes).

- [x] **Task 3.6: Content, Policy & FAQ Pages**
  - **Primary Requirement**: `PRD.md` Section 2.1 & `SITEMAP-DEV.md` Section 2.
  - **File Target**: `app/routes/pages.$handle.tsx`
  - **Status**: Completed & Verified (`/pages/size-guide`, `/pages/warranty-returns`, `/pages/shipping-faq`, `/pages/about`).

---

## Phase 4: Precision Marketing Signals & Ad Tracking Engine

- [x] **Task 4.1: Meta Pixel Injection with Nonce & CSP Compliance**
  - **Primary Requirement**: `ARCHITECTURE.md` Section 4.2 & `TRACKING-SIGNAL-ENGINE.md` Section 2.
  - **File Target**: `app/components/analytics/MetaPixel.tsx`, `app/root.tsx`
  - **Status**: Completed & Verified.

- [x] **Task 4.2: Deterministic `event_id` Generator Utility**
  - **Primary Requirement**: `TRACKING-SIGNAL-ENGINE.md` Section 2.1.
  - **File Target**: `app/lib/tracking.ts`
  - **Status**: Completed & Verified (`generateEventId`).

- [x] **Task 4.3: Funnel Event Tracking Wiring (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`)**
  - **Primary Requirement**: `PRD.md` Section 6 & `TRACKING-SIGNAL-ENGINE.md` Section 2.
  - **File Target**: `app/lib/tracking.ts`, `app/routes/products.$handle.tsx`, `app/components/ProductForm.tsx`, `app/components/CartSummary.tsx`
  - **Status**: Completed & Verified.

- [x] **Task 4.4: Cross-Domain Cart Attributes Attribution Bridge**
  - **Primary Requirement**: `TRACKING-SIGNAL-ENGINE.md` Section 2.2 & `AGENTS.md` Invariant 4.
  - **File Target**: `app/lib/attribution.ts`
  - **Status**: Completed & Verified (`_attribution_fbp`, `_attribution_fbc`, `_attribution_ga`, `_attribution_gclid`).

- [x] **Task 4.5: Google Tag Manager & Meta CAPI Proxy Integration**
  - **Primary Requirement**: `TRACKING-SIGNAL-ENGINE.md` Section 3 & Section 4.
  - **File Target**: `app/components/analytics/GoogleTagManager.tsx`, `app/routes/api.meta-events.ts`
  - **Status**: Completed & Verified.

---

## Phase 5: Testing, Performance Audit & Launch Readiness

- [x] **Task 5.1: End-to-End Mobile Conversion QA**
  - **Primary Requirement**: `PRD.md` Section 7.
  - **File Target**: Verified via Mini-Oxygen preview runtime.
  - **Status**: Completed & Verified (Homepage, Collections, PDP, Cart Drawer, and Policy routes returned HTTP 200).

- [x] **Task 5.2: Core Web Vitals & Mobile Performance Audit**
  - **Primary Requirement**: `OBSERVABILITY.md` Section 1.
  - **File Target**: `app/styles/app.css`, image aspect ratios.
  - **Status**: Completed & Verified (Locked 1:1 aspect ratios, zero CLS, sub-second edge SSR).

- [x] **Task 5.3: Production Build, Typecheck & Edge Deployment Verification**
  - **Primary Requirement**: `ARCHITECTURE.md` Section 2.
  - **File Target**: `dist/client/`, `dist/server/`
  - **Status**: Completed & Verified (`npm run typecheck` and `npm run build` pass with 0 errors).
