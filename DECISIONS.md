# Architecture Decision Records (ADR) — elfy.my

## ADR-001: Headless Architecture with Shopify Hydrogen (Remix / React Router 7)
- **Status**: Accepted
- **Context**: The brand requires a bespoke, high-converting, sub-second speed storefront for the Malaysian middle-up market. Traditional Shopify Liquid themes impose strict constraints on rendering logic, client-side interactions, and custom dual-funnel tracking signals.
- **Decision**: Adopt Shopify Hydrogen framework running on modern edge infrastructure (Cloudflare / Oxygen).
- **Consequences**:
  - Full control over DOM, routing, caching, and instant Cart Drawer interactions.
  - Requires maintaining frontend deployment and Content Security Policies.
  - Checkout remains hosted by Shopify to guarantee PCI-DSS compliance and seamless integration with Malaysian payment gateways (FPX, GrabPay, TNG, cards).

---

## ADR-002: Dual-Funnel Deduplication and Cross-Domain Attribution Handoff
- **Status**: Accepted
- **Context**: Moving from a custom domain (`elfy.my`) to Shopify Checkout risks attribution decay and cookie dropping under modern browser privacy restrictions (Safari ITP).
- **Decision**:
  - Implement a dual-funnel Meta Ads tracking model using both client-side Pixel (`fbq`) and server-side Conversions API (CAPI).
  - Use deterministic `event_id` generation for 1:1 deduplication.
  - Persist first-party cookies (`_fbp`, `_fbc`, `_ga`) and marketing parameters (`gclid`, `fbclid`) into Shopify Cart Attributes before checkout redirection.
- **Consequences**:
  - Guarantees that downstream `orders/paid` webhooks receive full attribution parameters for server-side `Purchase` event delivery.
  - Meta Event Match Quality (EMQ) remains high (>8.0).

---

## ADR-003: Strategic Hybrid Copywriting (English + Bahasa Melayu)
- **Status**: Accepted
- **Context**: The Malaysian middle-up demographic frequently navigates between English and Bahasa Melayu in daily communication and digital shopping. Monolingual Malay can feel overly formal or mass-market; pure English can feel distant and lack localized purchase reassurance.
- **Decision**: Standardize on a Strategic Hybrid approach:
  - English is the primary medium for product names, aesthetic descriptions, technical horology/leather specifications, and primary navigation.
  - Bahasa Melayu is actively used for customer reassurance, guarantees ("Jaminan Tukar Saiz 7 Hari Percuma"), shipping timelines ("Pantas 1-3 Hari Semenanjung"), and WhatsApp customer service.
- **Consequences**:
  - Elevates brand perception to a premium tier while maximizing emotional trust and conversion in the local market.

---

## ADR-004: Mobile-First Checkout Funnel & Sticky Action Drawer
- **Status**: Accepted
- **Context**: >85% of Malaysian e-commerce traffic originates from mobile devices (via Meta Ads and Instagram/TikTok referral).
- **Decision**:
  - The Cart is designed as a persistent slide-out drawer (Cart Drawer) rather than a separate full page.
  - PDP features an always-visible Sticky Add to Cart bar on mobile viewports.
  - Free Shipping threshold (RM150) is dynamically tracked with an animated progress bar inside the drawer.
- **Consequences**:
  - Reduces friction and steps to checkout, directly lifting mobile conversion rates.

---

## ADR-005: Strict Currency Locking to Malaysian Ringgit (MYR)
- **Status**: Accepted
- **Context**: Operating exclusively in the Malaysian market.
- **Decision**: Lock storefront currency to `MYR` formatted as `RM XXX.XX`. Disable automated geo-currency converters.
- **Consequences**:
  - Simplifies checkout calculations, eliminates currency exchange surprises, and reinforces local presence.

---

## ADR-006: Minimalist Precision Text-Only Payment Rails
- **Status**: Accepted
- **Context**: Inconsistent, blurry third-party PNG/SVG logos (FPX, VISA, Mastercard, GrabPay, TNG) introduce visual noise, layout asymmetry, and contrast issues across dark and light themes, degrading the premium aesthetic.
- **Decision**: Replace external logo images with clean, unified, text-only micro-pill badges (`FPX`, `TNG eWallet`, `GrabPay`, `VISA / MC`) rendered with high-contrast typography, subtle neutral borders, and micro letter-spacing in `TrustPaymentBadges.tsx`.
- **Consequences**:
  - Zero external image assets loaded for payment icons (0 kB network overhead).
  - Pristine visual hierarchy that matches luxury fashion house aesthetics while clearly communicating Malaysian payment methods.

---

## ADR-007: Single-Market Technical SEO, Sub-Sitemap Isolation, and Schema.org Architecture
- **Status**: Accepted
- **Context**: Hydrogen's default boilerplate includes multi-market hreflang alternates (`EN-US`, `EN-CA`, `FR-CA`) which generate non-existent URLs and errors in Google Search Console for a single-market store. Additionally, Google Merchant Center (GMC) requires policy pages to be crawlable, and rich search snippets require structured JSON-LD.
- **Decision**:
  - Purge boilerplate foreign locales (`locales: []`) in `sitemap.$type.$page[.xml].tsx` and output pure canonical Malaysian URLs.
  - Remove `Disallow: /policies/` from `robots.txt` to allow full GMC and Google Ads compliance crawling while maintaining disallow rules on `/cart`, `/account`, and `/search`.
  - Implement comprehensive Google Schema.org JSON-LD across the entire storefront: `Organization`, `WebSite` (with Sitelinks Searchbox), `Product` (with `Offer` and `AggregateRating`), `CollectionPage` + `ItemList`, `FAQPage` (accordion rich snippets), `BlogPosting`, and `BreadcrumbList`.
  - Standardize 1200x630 OpenGraph and Twitter cards with high-fidelity fallbacks.
- **Consequences**:
  - Zero crawl waste or duplicate content penalties in Google Search Console.
  - Maximum SERP rich result real estate (stars, pricing, stock, FAQs, breadcrumbs).
  - Seamless GMC product feed and return policy validation.

