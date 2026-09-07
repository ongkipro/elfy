# ELFY (`elfy.my`) — Headless Shopify Storefront

> Modern Sartorial Footwear & Horology for the Malaysian Middle-Up Market. Built on Shopify Hydrogen (React Router 7 / Vite).

## Overview
- **Brand**: ELFY
- **Category**: Casual Luxury Shoes (Sneakers, Loafers) & Watches (Minimalist, Chronograph)
- **Market**: Full Malaysia (Semenanjung, Sabah & Sarawak)
- **Voice**: Strategic Hybrid English + Bahasa Melayu
- **Primary Goal**: Best Conversion Rate (CRO) via lightning-fast edge performance, mobile-first design, and seamless cross-domain attribution.
- **Backend**: Shopify Storefront GraphQL API (`vvxgev-3p.myshopify.com`)

---

## Canonical Specification Documents
- [**`PRD.md`**](./PRD.md): Product requirements, customer persona, market positioning, and core routes.
- [**`SITEMAP-DEV.md`**](./SITEMAP-DEV.md): Architecture navigation map, component tree, route index, and AI fast-path guide.
- [**`ARCHITECTURE.md`**](./ARCHITECTURE.md): System architecture, Hydrogen data flow, sub-request caching, and CSP.
- [**`UI-UX-GUIDELINES.md`**](./UI-UX-GUIDELINES.md): Visual tokens, design system, mobile CRO mechanics, and hybrid copywriting guide.
- [**`TRACKING-SIGNAL-ENGINE.md`**](./TRACKING-SIGNAL-ENGINE.md): Dual-funnel Meta Ads Pixel + CAPI deduplication, GTM, and cross-domain attribution handoff.
- [**`DECISIONS.md`**](./DECISIONS.md): Architectural Decision Records (ADR-001 to ADR-005).
- [**`OBSERVABILITY.md`**](./OBSERVABILITY.md): Core Web Vitals budgets, logging, and error boundaries.
- [**`STATUS.md`**](./STATUS.md): Real-time project status, specification audit records, and delivery ledger.
- [**`TASKS.md`**](./TASKS.md): Phased implementation checklist from setup to launch.
- [**`AGENTS.md`**](./AGENTS.md): Development boundaries and rules for coding agents.

---

## Quickstart (Development)

```bash
# 1. Install dependencies (once scaffolded)
npm install

# 2. Configure environment
cp .env.example .env
# Fill in your Shopify Storefront token and keys

# 3. Start local Hydrogen development server
npm run dev
```
