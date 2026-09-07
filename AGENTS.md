# Agent Guidelines & Repository Boundaries — elfy.my

## 1. Operating Profile & Role
- You are working on **ELFY** (`elfy.my`), a headless Shopify storefront built with **Shopify Hydrogen** targeting the middle-up Malaysian market for casual shoes and watches.
- Primary North Star: **Best Mobile Conversion Rate (CRO)**, sub-second edge performance, and precision marketing signals.

---

## 2. Hard Boundaries & Invariants

1. **Language & Copywriting**:
   - Strictly follow the **Strategic Hybrid English + Bahasa Melayu** formula detailed in `UI-UX-GUIDELINES.md`.
   - Never invent arbitrary Bahasa Indonesia translations (e.g., use "Beg" or "Troli" not "Keranjang"; use "Semenanjung / Sabah / Sarawak" not "Jabodetabek / Jawa"; use "RM" / "Ringgit Malaysia" not "IDR / Rupiah").
   - Product titles and technical horology/leather specs remain in English. Customer guarantees and delivery assurances use natural Malaysian Bahasa Melayu.

2. **Currency & Localization**:
   - Currency is locked to `MYR` (`RM XXX.XX`).
   - Phone format: Malaysian (+60).
   - Delivery references: Semenanjung (1-3 hari) & Sabah/Sarawak (3-5 hari).

3. **Shopify Integration**:
   - Store: `vvxgev-3p.myshopify.com` (`https://admin.shopify.com/store/vvxgev-3p/`).
   - Storefront API version: `2025-01` or latest stable `2026-04`.
   - Checkout is fully hosted by Shopify. Never attempt to rewrite or custom-host the Shopify payment or checkout processing DOM.

4. **Marketing & Tracking Signals**:
   - Every funnel interaction (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`) must support deterministic `event_id` generation for Meta Pixel + CAPI deduplication.
   - Preserving `_fbp`, `_fbc`, `_ga`, and `gclid` in Cart Attributes is mandatory for checkout attribution.

5. **Secrets & Security**:
   - Private tokens (`SHOPIFY_ADMIN_API_TOKEN`, `META_CAPI_ACCESS_TOKEN`, `SESSION_SECRET`) must never be exposed to browser bundles or client-side components.
   - Use `secrets.env` / process environment variables on the server.

---

## 3. Development Navigation & Fast-Path
- Consult [**`SITEMAP-DEV.md`**](./SITEMAP-DEV.md) before writing or locating any components, GraphQL queries, route loaders, or tracking integrations.
- Always check [**`TASKS.md`**](./TASKS.md) for the active task phase before implementing code.
- Follow [**`UI-UX-GUIDELINES.md`**](./UI-UX-GUIDELINES.md) for color tokens, mobile ergonomics (Section 6), and copywriting.

