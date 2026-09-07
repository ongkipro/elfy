# UI / UX Guidelines & Visual System — elfy.my

## 1. Visual Direction: "Modern Sartorial Minimalist"
- **Style Archetype**: Refined, warm, understated luxury (comparable to Aritzia, Common Projects, or Oliver Cabell, tailored for Kuala Lumpur / urban Malaysia).
- **Core Aesthetic**:
  - Warm off-white canvases instead of sterile clinical whites.
  - Charcoal and deep slate typography instead of pure `#000000`.
  - Subtle sand/taupe borders with crisp 1px lines.
  - Restrained micro-interactions and smooth, purposeful transitions.
  - Zero cluttered banners, zero flashing sale stickers, zero aggressive popups.

---

## 2. Color Palette & Design Tokens

```css
:root {
  /* Canvas & Backgrounds */
  --color-canvas-bg: #FAF9F6;       /* Warm Alabaster / Eggshell */
  --color-surface: #FFFFFF;         /* Crisp White Card/Drawer Surface */
  --color-surface-muted: #F3EFEA;   /* Soft Sand for secondary containers */

  /* Text & Typography */
  --color-text-primary: #191817;     /* Deep Espresso Charcoal */
  --color-text-secondary: #605C56;   /* Warm Slate Grey */
  --color-text-muted: #918C85;       /* Subdued Caption / Meta */

  /* Borders & Dividers */
  --color-border-subtle: #EBE6DF;    /* Hairline Sand Border */
  --color-border-strong: #D6CFBF;    /* Active / Focused Outline */

  /* Accent & Action */
  --color-primary: #1F2421;          /* Sartorial Deep Obsidian */
  --color-primary-hover: #0E1110;    /* Darkened hover state */
  --color-accent-amber: #B48344;     /* Heritage Gold/Amber for Horology details */
  --color-badge-green: #2B593F;      /* Forest Green for "In Stock" / "Free Shipping" */
  --color-sale-red: #A83232;         /* Restrained Crimson for markdown prices */
}
```

---

## 3. Typography System

- **Headline Font**: Editorial Serif or Sharp Neo-Grotesque (`Playfair Display` or `Cabinet Grotesk` or clean `Plus Jakarta Sans`).
  - *H1 / Hero*: 32px – 44px (Mobile), 48px – 64px (Desktop). Tight tracking (`-0.02em`), leading-tight.
  - *H2 / Section Title*: 24px – 32px (Mobile), 36px – 44px (Desktop).
- **Body & Controls**: Modern, legible geometric sans (`Inter` or `Plus Jakarta Sans`).
  - *Body*: 15px – 16px, line-height 1.6.
  - *Metadata / Captions*: 12px – 13px, uppercase tracking (`0.05em`) for categories and technical specs.
  - *Buttons & Pills*: 14px – 15px, font-medium or semi-bold.

---

## 4. Malaysian Market CRO Mechanics & Page Structure

### 4.1 Header & Top Bar
- **Announcement Bar**:
  - Text: *"Penghantaran Percuma Seluruh Semenanjung dengan pembelian RM150+ | 7-Day Size Exchange"*
  - Subtle rotating ticker or single high-impact value proposition.
- **Main Nav**:
  - Left: Clean logo (`ELFY` in tracked uppercase serif or bold grotesk).
  - Center: Men's Shoes, Watches, Collections, About.
  - Right: Search toggle, Malaysia currency badge (`MYR / RM`), Cart Trigger with live count pill.

### 4.2 Homepage Structure
1. **Hero Banner**:
   - High-resolution editorial photography (e.g., leather sneaker paired with tailored trousers, or a wrist shot wearing a minimalist watch in an urban KL cafe/street setting).
   - Headline: *"Effortless Sartorial Comfort for Modern Living."*
   - Dual CTAs: `[ Explore Shoes ]` `[ Explore Watches ]`.
2. **Category Split Feature**:
   - 50/50 visual split showcasing Footwear and Horology with immediate direct links.
3. **Curated Best Sellers**:
   - Clean 4-column desktop / 2-column mobile grid.
   - Immediate display of price in `RM XXX`, colorway dots, and quick view.
4. **The ELFY Standards (Trust & Quality Grid)**:
   - 4 Pillars with bespoke minimal icons:
     - 👞 *Full-Grain Genuine Leather & Ergonomic Insoles*
     - ⌚ *Japanese Movement & Sapphire Crystal Glass*
     - 🚚 *Pantas: 1-3 Hari Semenanjung (Pos Laju / J&T)*
     - 🔄 *Jaminan Tukar Saiz 7 Hari Tanpa Soalan*
5. **Customer Social Proof**:
   - Verified buyer quotes with city tags (`"Selesa gila pakai kerja sehari suntuk kat KL" — Daniel K., Bangsar`).

### 4.3 Product Detail Page (PDP) — Conversion Engine
- **Media Gallery**:
  - Mobile swipeable carousel with clear pagination dots.
  - Desktop 2-column sticky layout.
- **Product Title & Rating**:
  - Title in English (`The Sartorial Minimalist Sneaker - Chalk White`).
  - Verified rating stars (`4.9 ★ (184 Reviews)`).
- **Pricing**:
  - Current price in bold: `RM 289.00`.
  - Compare-at price: `RM 380.00` (Strikethrough) + `[ Save 24% ]`.
- **Variant Selector**:
  - **Shoes**: EU Size pills (`39`, `40`, `41`, `42`, `43`, `44`, `45`) with clear size recommender modal ("Ukuran Saiz Kaki Malaysia").
  - **Watches**: Dial color / strap option selector.
- **Action Buttons**:
  - Primary CTA: Full-width high-contrast button `[ Tambah ke Beg - RM 289 ]`.
  - **Sticky ATC on Mobile**: Always pinned to screen bottom when scrolling past main button, showing selected size, price, and instant CTA.
- **Reassurance Accordion**:
  - 📦 *Penghantaran & Pulangan (Free Semenanjung shipping RM150+, Sabah/Sarawak RM220+, 1-3 hari)*
  - 📏 *Panduan Saiz (Size Chart with foot length in CM)*
  - 🛠 *Spesifikasi & Material (Bahan kulit, tapak getah, jaminan enjin jam 1 tahun)*

### 4.4 Cart Drawer (Slide-Out)
- **Free Shipping Progress Bar**:
  - Dynamic indicator: *"Tambah RM30 lagi untuk nikmati Penghantaran Percuma!"* or *"Tahniah! Anda dapat Free Shipping!"*
- **Order Breakdown**:
  - Item thumbnail, title, selected size/variant, stepper (`- 1 +`), remove icon.
- **Local Trust Badges directly above Checkout CTA**:
  - Mini logos: FPX, Touch 'n Go eWallet, GrabPay, Visa, Mastercard.
- **Checkout CTA**:
  - Prominent button: `[ Teruskan ke Pembayaran (Checkout) -> ]`.

---

## 5. Copywriting Formula: Strategic Hybrid

| Element | English Base | Bahasa Melayu Nuance | Best-Converting Hybrid |
|---|---|---|---|
| Top Bar | Free Shipping over RM150 | Penghantaran Percuma RM150 ke atas | **Penghantaran Percuma Semenanjung RM150+ \| Tukar Saiz Mudah** |
| Product Title | Minimalist Leather Sneaker | Kasut Kulit Kasual | **The Sartorial Sneaker (Full Grain Leather)** |
| Add to Cart | Add to Bag | Tambah ke Beg | **Tambah ke Beg • RM 289** |
| Size Guide | Find Your Size | Cari Saiz Anda | **Panduan Saiz Malaysia (CM / EU)** |
| Guarantee | 7-Day Free Size Exchange | Jaminan Tukar Saiz 7 Hari | **Jaminan Tukar Saiz 7 Hari Percuma** |
| Out of Stock | Sold Out | Kehabisan Stok | **Habis Stok (Restock Segera)** |
| Delivery | 1-3 Days Delivery | Sampai dalam 1-3 Hari | **Pantas: 1-3 Hari Bekerja (J&T / Ninja Van)** |

---

## 6. Mobile View Precision Engineering (Ergonomics, Touch Targets & Viewport Specs)

> Over 85% of Malaysian e-commerce sessions occur on smartphones (via Instagram, TikTok, and Meta Ads). The mobile view is not an afterthought; it is our **Primary Flagship Experience**.

### 6.1 Viewport & Breakpoint Matrix
| Breakpoint | Target Devices | Layout Constraints |
|---|---|---|
| **Compact (`360px – 389px`)** | Budget/Standard Android (e.g. Galaxy A-series) | 16px horizontal screen padding. Single-column card layouts, 2-up compact product grids with 10px gutters. |
| **Standard (`390px – 429px`)** | Standard iPhone (13/14/15/16) & Pixel | 20px horizontal screen padding. Generous whitespace, comfortable typography. |
| **Large Phablet (`430px – 767px`)** | iPhone Pro Max, Galaxy S Ultra | Preserves single-thumb reachability with centered action containers. |

### 6.2 Thumb Zone Architecture (One-Handed Mobile Commerce)
```
+-----------------------------+
|    [ Passive Info Zone ]    |  <- Top Bar, Logo, Announcement (Reach: Hard)
|                             |
|                             |
|    [ Viewing Canvas ]       |  <- Product Imagery, Editorial Text (Reach: Natural Viewing)
|                             |
|                             |
|  [ Primary Action Zone ]    |  <- Size Pills, Variant Switcher, Stepper (Reach: Comfortable)
|                             |
|  [ STICKY ADD TO CART BAR ] |  <- Pinned to bottom (Reach: Easiest 1-Thumb Click)
+-----------------------------+
```
- **Bottom 40% Viewport Priority**: All high-velocity actions (Variant selection, Sticky Add-to-Cart, Cart Drawer Checkout CTA, Size Recommender trigger) sit squarely within the natural thumb sweep.
- **Safe Area Inset Compliance**: All pinned bottom bars must include `padding-bottom: max(16px, env(safe-area-inset-bottom))` to prevent overlap with the iOS home indicator bar.

### 6.3 Sticky Add-to-Cart (ATC) Micro-Specification
- **Trigger**: Appears seamlessly via a smooth slide-up animation (`translate-y-0`) the moment the user scrolls past the main static "Tambah ke Beg" button on the PDP.
- **Bar Height**: Fixed `68px` content + `env(safe-area-inset-bottom)`.
- **Anatomy**:
  - Left: Thumbnail (44x44px rounded) + Product Title & Active Variant Price in bold (`RM 289.00`).
  - Right: High-contrast primary button `[ Tambah ke Beg ]` (min touch target: 48px height, 140px width).
- **Zero-Friction Size Picker**: If no size is selected yet, tapping the button instantly triggers an unobtrusive micro bottom sheet to pick the size in 1 tap, avoiding the need to scroll back up to the top.

### 6.4 Touch Target Ergonomics & Tap Feedback
- **Strict 48px Minimum**: Every interactive touchpoint (Size Pills, Quantity `+` / `-` steppers, Drawer close `✕` buttons, navigation links) has an active hitbox of at least **48 × 48px**.
- **Tactile Visual Response**: All interactive buttons utilize an active compression state (`active:scale-[0.98] transition-transform duration-75`) to give instant tactile visual confirmation to mobile taps.

### 6.5 Mobile Media Carousel & Swipe Mechanics
- **Native 60fps CSS Scroll Snap**:
  - Implemented using pure CSS `scroll-snap-type: x mandatory` and `-webkit-overflow-scrolling: touch` for buttery smooth native iOS/Android swipe physics without bulky JavaScript touch listeners.
- **Aspect Ratio Locking (Zero CLS)**:
  - Shoes: Locked to `aspect-ratio: 4/5` or `1/1`.
  - Watches: Locked to `aspect-ratio: 1/1` for macro detail view.
  - Image containers reserve exact height before download to guarantee **Cumulative Layout Shift (CLS) = 0.00**.
- **Visual Pagination**: Floating pill counter at the bottom-right of the image (`1/5` with semi-transparent frosted glass backdrop `backdrop-blur-md bg-black/40 text-white text-xs px-2.5 py-1 rounded-full`).

### 6.6 Bottom-Sheet Size Recommender Modal
- **Behavior**: Opens from the bottom of the screen as a native sheet drawer with a drag-handle indicator at the top.
- **Interactive Foot Measurement Calculator**:
  - User can slide or select their foot length in Centimeters (e.g. `26.5 cm`).
  - Automatically highlights the matching Malaysian EU/UK size (`EU 42 / UK 8`) with a reassurance badge: *"Sesuai untuk saiz standard kaki Malaysia (Standard Width)"*.
- **Dismissal**: Smooth swipe-down gesture or tap on backdrop.

### 6.7 Mobile Cart Drawer & Express Checkout Handoff
- **Full-Width Slide-Over**: Occupies 100% of mobile viewport width on `< 430px` screens, slide-over on tablets.
- **Keyboard Avoidance**: Prevents viewport zooming or layout distortion when typing discount codes by locking body scroll (`overflow: hidden; touch-action: none`).
- **One-Tap Checkout CTA**: Sticky full-width button at drawer base directly displaying total Ringgit amount and supported payment logos (FPX, TNG, GrabPay, Visa/Mastercard).

