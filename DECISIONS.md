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

---

## ADR-008: Elimination of Shipping Boilerplate from Product Descriptions in Favor of Dedicated PDP Accordions
- **Status**: Accepted
- **Context**: Product descriptions imported from legacy catalogs contained ~100 words of repetitive boilerplate detailing Pos Laju, J&T, delivery timeframes (1-3 days Semenanjung, 3-5 days Sabah/Sarawak), free shipping thresholds, and warranty terms. Concurrently, the headless storefront's PDP component (`ProductAccordion.tsx`) already features dedicated interactive tabs for "Penghantaran & Saiz" (Tab 2) and "Jaminan & Waranti" (Tab 3). Having this text in `descriptionHtml` caused 100% duplicate copy, expanded mobile scroll height unnecessarily, and signaled low-tier dropshipping to middle-up Malaysian shoppers.
- **Decision**:
  - Strip all shipping, courier, and warranty mentions from `product.descriptionHtml` across all products.
  - Standardize product descriptions into a clean, 3-Pillar structure (~130–160 words):
    1. *Product Essence*: 2-3 sentence lifestyle and comfort summary tailored to the model and Malaysian urban climate.
    2. *Knowledge & Craftsmanship*: High-value material specs (breathable mesh, ergonomic arch support insole, anti-slip rubber; or Japanese Quartz Caliber, 316L/Alloy casing, mineral lens, 3 ATM splash resistance).
    3. *Fit & Sizing*: Precise CM insole measurements (EU 39: 24.5cm s.d. EU 44: 27.0cm) with Asian Wide-Fit advisory for footwear; dial diameter, case thickness, lug width, and wrist fit for watches.
  - Trust, delivery logistics, and SSM guarantees are exclusively owned by the native accordion tabs.
- **Consequences**:
  - Eliminates ~60% of unnecessary DOM bloat on PDP descriptions.
  - Elevates brand perception to a modern sartorial luxury tier (Aritzia / Common Projects standard).
  - Keeps PDP mobile viewports compact, scannable, and focused squarely on product desire and accurate sizing.

---

## ADR-009: Vite Asset Bundling for Static Imagery to Bypass Oxygen Reverse-Proxy Transcoding
- **Status**: Accepted
- **Context**: Serving static imagery (hero slides and collection banners) from the `public/` directory at the root domain (`https://elfy.my/*.webp`) resulted in unexpected image bloating. Shopify Oxygen's edge infrastructure automatically proxies root-domain image requests through its dynamic image trans-encoder, which defaults to serving converted JPEGs (~164 KiB) instead of original WebP binaries (~88 KiB), triggering Google PageSpeed "Improve image delivery" penalties and degrading mobile LCP.
- **Decision**:
  - Relocate primary static imagery from `public/` to `app/assets/`.
  - Import image assets directly into TypeScript/React route modules (`import heroMobileWebp from '~/assets/hero-mobile.webp'`).
  - Vite automatically bundles and hashes these assets, resolving their URLs to Shopify's primary CDN (`https://cdn.shopify.com/oxygen-v2/...`).
- **Consequences**:
  - Assets bypass Oxygen's on-the-fly reverse-proxy re-encoding, preserving exact WebP compression and quality.
  - Image payloads are reduced by 45–52% across mobile hero and collection banners.
  - Assets gain 1-year immutable caching (`cache-control: public, max-age=31536000`).
  - LCP assets can be preloaded via `<link rel="preload">` in `<head>` linking directly to preconnected `cdn.shopify.com`.

---

## ADR-010: LLMs.txt Protocol and Curated AI Search Crawler Directives
- **Status**: Accepted
- **Context**: AI-driven discovery and search agents (Perplexity, ChatGPT Search, Claude, Apple Intelligence, Gemini) increasingly drive qualified product search traffic. Without a structured machine-readable index, AI bots waste crawl tokens parsing heavy client-side DOM or get blocked by legacy bot rules.
- **Decision**:
  - Implement `/llms.txt` following the standard LLMs specification at the domain root (`public/llms.txt`), summarizing ELFY's brand positioning, catalog categories, sizing systems, customer service rails, and markdown endpoints.
  - Update dynamic `robots.txt` (`app/routes/[robots.txt].tsx`) with explicit `Allow` directives for reputable AI user-agents: `Google-Extended`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Amazonbot`, `Applebot`, and `meta-externalagent`.
  - Enforce strict exclusion of private paths (`/cart`, `/account`, `/search`) across all crawlers.
- **Consequences**:
  - Ensures accurate brand citations, product specifications, and sizing recommendations when Malaysian shoppers query AI search assistants.
  - Zero risk of indexing private customer carts or session states.
