# System Architecture — elfy.my

## 1. High-Level Architecture Overview

`elfy.my` is built as a high-performance headless ecommerce storefront utilizing **Shopify Hydrogen** (powered by React Router 7 / Remix architecture) hosted on Cloudflare Workers / Oxygen edge runtime, querying the **Shopify Storefront GraphQL API**.

```
[ Urban Malaysian Shopper (Mobile / Desktop) ]
                     |
                     v
  [ Cloudflare Edge / Oxygen Runtime (elfy.my) ]
      |-- React Server Components & Sub-request Caching
      |-- Server-side Session Management & Cart Handlers
      |-- Hydrogen Analytics Middleware (Meta CAPI / GTM)
                     |
       +-------------+-------------+
       |                           |
       v                           v
[ Shopify Storefront API ]   [ Shopify Hosted Checkout ]
(vvxgev-3p.myshopify.com)    (Cart Attributes Handoff)
```

---

## 2. Technical Stack Specifications

- **Framework**: Shopify Hydrogen (`@shopify/hydrogen` latest stable, React Router 7 engine, Vite 8).
- **Language**: TypeScript with strict typing.
- **Styling & UI**: Tailwind CSS v4 + Lucide Icons + minimal bespoke motion tokens.
- **E-Commerce Backend**: Shopify Storefront GraphQL API (`2025-01` or `2026-04`).
- **Store Identifier**: `vvxgev-3p.myshopify.com`
- **Hosting Target**: Cloudflare Pages / Shopify Oxygen (V8 isolated edge runtime).
- **Session & Caching**: Cache-Control header strategy with `stale-while-revalidate` for collection & product queries.

---

## 3. Data Flow & Cart Lifecycle

### 3.1 Sub-Request Caching Strategy
- **Product & Collection Queries**: Cached at edge with short TTL (e.g., `CacheShort()`, 60s max-age, 300s stale-while-revalidate) to ensure price and inventory freshness while maintaining lightning-fast TTFB (<200ms).
- **Cart Queries & Mutations**: Strictly dynamic (`CacheNone()`), bypassing edge cache to prevent stale cart item counts or incorrect subtotal calculations.

### 3.2 Cart & Checkout Boundary
1. **Creation**: Cart is initialized via Hydrogen's `createCartHandler`.
2. **Attribution Attachment**:
   - First-party tracking cookies (`_fbp`, `_fbc`, `_ga`) and URL parameters (`gclid`, `fbclid`, `utm_*`) are retrieved from the client session.
   - Attached to the Shopify Cart object as custom `attributes`:
     - `_attribution_fbp`
     - `_attribution_fbc`
     - `_attribution_gclid`
     - `_attribution_ga`
3. **Checkout Handoff**:
   - The user clicks the primary CTA in the Cart Drawer.
   - Redirects to `cart.checkoutUrl` (hosted checkout on Shopify domain with customer branding).
   - All cart attributes flow directly into the created Shopify Order for downstream reconciliation.

---

## 4. Signal Engine & Analytics Integration

### 4.1 Dual-Funnel Event Tracking
```
Browser Event (fbq) ---------\
                              +---> Meta Ads Attribution Engine
Server Event (CAPI via DO) --/       (Deduplicated via event_id)
```
- **Event ID Generation**: A cryptographically random UUIDv4 or timestamp-hash is generated at the event source.
- **Client Side**: `fbq('track', eventName, payload, { eventID: event_id })`.
- **Server Side**: Hydrogen server handler or Shopify webhook dispatches the same `event_id` to Meta Graph API (`/v20.0/{pixel_id}/events`).

### 4.2 Content Security Policy (CSP)
Hydrogen strictly manages CSP via `createContentSecurityPolicy`. Allowed directives for tracking:
- `connect-src`: `'self'`, `https://*.myshopify.com`, `https://*.facebook.com`, `https://*.google-analytics.com`, `https://*.analytics.google.com`.
- `script-src`: `'self'`, `'unsafe-inline'` (with nonces), `https://connect.facebook.net`, `https://www.googletagmanager.com`.
- `img-src`: `'self'`, `data:`, `https://cdn.shopify.com`, `https://www.facebook.com`, `https://*.google-analytics.com`.

---

## 5. Security & Invariants

1. **Zero Secret Leakage**:
   - `SHOPIFY_ADMIN_API_TOKEN` and `META_CAPI_ACCESS_TOKEN` must NEVER be prefixed with `PUBLIC_` or bundled into client assets.
   - Secrets are injected only into server-side loaders/actions.
2. **Sanitized Inputs**:
   - All query params and cart attribute inputs are sanitized before being passed to GraphQL mutations to prevent injection.
3. **Immutable Currency**:
   - Storefront currency is hard-locked to `MYR` (`RM`). Multi-currency conversion is explicitly disabled to eliminate foreign exchange confusion for Malaysian buyers.
