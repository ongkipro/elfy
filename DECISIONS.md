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
