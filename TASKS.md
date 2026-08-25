# TASKS — VELLUM Storefront (Headless Shopify Malaysia)

## Phase 1: Foundation & Shopify GraphQL SDK
- [x] **TASK-01**: Setup Astro 5 project with TypeScript, Tailwind CSS, and Lucide icons configured with VELLUM design tokens.
  - *Done when*: `pnpm dev` builds cleanly, Tailwind classes compile, and TypeScript passes `pnpm tsc --noEmit`.
- [x] **TASK-02**: Implement Shopify Storefront GraphQL Client (`src/lib/shopify/client.ts`).
  - *Done when*: Pinned to Storefront API `2025-01`, typed request/response handlers with error wrapping, `@inContext` support for `MS` and `EN`.
- [x] **TASK-03**: Create core Shopify GraphQL query operations (`products.ts`, `collections.ts`, `cart.ts`).
  - *Done when*: Type definitions map 100% of product variants, metafields (shoes EU/UK/CM, watch specs), and prices.

## Phase 2: Cart & Checkout Session Management
- [x] **TASK-04**: Build Astro Server Actions / Endpoints for Cart Mutations (`api/cart/*.ts`).
  - *Done when*: `cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, and `cartLinesRemove` update the Shopify cart and sync `cartId` in HttpOnly cookies.
- [x] **TASK-05**: Implement interactive `CartDrawer` island with Free Shipping progress bar (RM threshold) and Malaysian payment method badges.
  - *Done when*: Drawer slides open smoothly upon add-to-cart, updates quantities optimistically, and checkout button directs to Shopify checkout URL.

## Phase 3: Merchandising & Fashion Product Experience (VELLUM)
- [x] **TASK-06**: Build Shoe Size Converter & Sizing Guide Modal component.
  - *Done when*: Switcher displays EU, UK, US, and Foot Length in CM with clear fit recommendations (e.g. "True to size / Ambil 1 saiz lebih besar jika kaki lebar").
- [x] **TASK-07**: Build Watch Specification Sheet component.
  - *Done when*: Displays Case Diameter (mm), Lug Width, Movement Type, Crystal, and Water Resistance (ATM).
- [x] **TASK-08**: Build Mobile Product Gallery island with thumbnail navigation and swipe gestures.
  - *Done when*: Seamless touch swipe on mobile with sub-50ms visual response.

## Phase 4: Localization & Conversion Elements
- [x] **TASK-09**: Implement Dual-Locale Routing (`/en` and `/ms`) with subpath i18n middleware.
  - *Done when*: Switching locales switches UI strings and passes matching language code to Shopify `@inContext`.
- [x] **TASK-10**: Build Floating WhatsApp Concierge Order Button with auto-populated message.
  - *Done when*: Clicking sends pre-filled message: "Hai VELLUM, saya nak tanya pasal [Product Name] - [Variant] (RM XXX): [URL]".
- [x] **TASK-11**: Schema.org JSON-LD & OpenGraph Generator for Fashion PDPs.
  - *Done when*: Google Rich Results Test validates Product, Offer, and Availability schemas.
