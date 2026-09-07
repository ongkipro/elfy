# Observability & Reliability Architecture — elfy.my

## 1. Performance Budgets & Core Web Vitals (CWV)

As a conversion-focused headless storefront, strict performance thresholds are enforced:

| Metric | Target | Measurement Strategy |
|---|---|---|
| **LCP (Largest Contentful Paint)** | < 1.8s | Hero image preloading, WebP/AVIF format, Cloudflare Edge cache |
| **INP (Interaction to Next Paint)** | < 150ms | Minimal client hydration, lightweight Cart Drawer state machine |
| **CLS (Cumulative Layout Shift)** | < 0.05 | Fixed aspect ratio for shoe/watch media, zero layout jumping on variant change |
| **TTFB (Time to First Byte)** | < 250ms | Oxygen / Cloudflare Workers edge caching (`stale-while-revalidate`) |

---

## 2. Server-Side Logging & Error Handling

- **Structured Edge Logs**:
  - Request ID correlation (`x-request-id`) passed across GraphQL requests to Shopify.
  - Edge server uncaught exceptions logged to Cloudflare Observability / Oxygen Log stream.
- **GraphQL Error Boundary**:
  - Catch Storefront API errors gracefully without crashing the UI.
  - Return friendly fallback states for missing product handles or sold-out variants.

---

## 3. Analytics & Signal Health Auditing

- **Console Validation**:
  - Development mode warnings for missing `event_id` or failed pixel dispatches.
- **Webhook Health**:
  - Monitor Shopify `orders/paid` webhook delivery status in Shopify Admin.
  - Validate that 100% of orders contain valid cart attributes (`_fbp`, `_fbc`, `_ga`).
