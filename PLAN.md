# Development Kit — VELLUM Storefront (Astro 5 + TypeScript + Tailwind + Lucide)

## 1. Project Directory Structure

```text
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
├── src/
│   ├── env.d.ts
│   ├── layouts/
│   │   └── Layout.astro
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro (VELLUM brand identity)
│   │   │   ├── Footer.astro (Payment trust badges)
│   │   │   ├── WhatsAppFloating.astro
│   │   │   └── LocaleSwitcher.astro
│   │   ├── product/
│   │   │   ├── ProductCard.astro
│   │   │   ├── ProductGallery.tsx (React Island for Swipe/Zoom)
│   │   │   ├── VariantPicker.tsx (React Island for Real-time Selection)
│   │   │   ├── ShoeSizeGuide.astro
│   │   │   ├── WatchSpecSheet.astro
│   │   │   └── StickyAddToCart.astro
│   │   └── cart/
│   │       ├── CartDrawer.tsx (React Island for Client Cart)
│   │       └── FreeShippingBar.tsx
│   ├── lib/
│   │   ├── shopify/
│   │   │   ├── client.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── utils/
│   │   │   ├── currency.ts
│   │   │   └── whatsapp.ts
│   │   └── i18n/
│   │       ├── en.ts
│   │       ├── ms.ts
│   │       └── index.ts
│   └── pages/
│       ├── index.astro (redirects to /[defaultLocale])
│       ├── [locale]/
│       │   ├── index.astro
│       │   ├── collections/
│       │   │   └── [handle].astro
│       │   └── products/
│       │       └── [handle].astro
│       └── api/
│           └── cart/
│               ├── add.ts
│               ├── update.ts
│               └── remove.ts
```

---

## 2. Core Implementation Files

### 2.1 `src/lib/shopify/types.ts`
```typescript
export type CurrencyCode = 'MYR';
export type SupportedLanguage = 'EN' | 'MS';
export type SupportedCountry = 'MY';

export interface Money {
  amount: string;
  currencyCode: CurrencyCode;
}

export interface Image {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  compareAtPrice: Money | null;
  image: Image | null;
  quantityAvailable?: number;
}

export interface Metafield {
  key: string;
  value: string;
  namespace: string;
}

export interface ShoeSizingMetafield {
  euSize: string;
  ukSize: string;
  usSize: string;
  footLengthCm: string;
}

export interface WatchSpecsMetafield {
  caseDiameterMm: string;
  lugWidthMm: string;
  movementType: 'Quartz' | 'Automatic' | 'Solar' | 'Mechanical';
  glassType: 'Sapphire Crystal' | 'Mineral Glass' | 'Hardlex';
  waterResistance: string; // e.g. "5 ATM (50m)"
  caseMaterial: string;
  strapMaterial: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: 'Shoes' | 'Watches' | string;
  tags: string[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  featuredImage: Image | null;
  images: {
    nodes: Image[];
  };
  options: {
    id: string;
    name: string;
    values: string[];
  }[];
  variants: {
    nodes: ProductVariant[];
  };
  metafields: Metafield[];
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      title: string;
      handle: string;
      featuredImage: Image | null;
    };
    selectedOptions: SelectedOption[];
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: {
    nodes: CartLine[];
  };
}
```

### 2.2 `src/lib/shopify/client.ts`
```typescript
import type { SupportedLanguage, SupportedCountry } from './types';

const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const STOREFRONT_ACCESS_TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = '2025-01';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, unknown>;
  language?: SupportedLanguage;
  country?: SupportedCountry;
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  language = 'EN',
  country = 'MY',
}: ShopifyFetchParams): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      'Accept-Language': language === 'MS' ? 'ms-MY' : 'en-MY',
    },
    body: JSON.stringify({
      query,
      variables: {
        ...variables,
        language,
        country,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`[VELLUM Shopify API Error] ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('[VELLUM Shopify GraphQL Error Details]:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL Query Execution Failed');
  }

  return json.data as T;
}
```

### 2.3 `src/lib/shopify/queries.ts`
```typescript
export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      handle
      title
      descriptionHtml
      availableForSale
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
      metafields(identifiers: [
        {namespace: "custom", key: "shoe_size_guide"},
        {namespace: "custom", key: "watch_specifications"},
        {namespace: "custom", key: "care_instructions"}
      ]) {
        key
        namespace
        value
      }
    }
  }
`;

export const CART_FRAGMENT = `
  fragment CartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            selectedOptions {
              name
              value
            }
            product {
              title
              handle
              featuredImage {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_MUTATION = `
  mutation CreateCart($input: CartInput!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    cartCreate(input: $input) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_CART_MUTATION = `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartDetails
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;
```

### 2.4 Malaysian Currency & WhatsApp Helpers (`src/lib/utils/`)

```typescript
// src/lib/utils/currency.ts
export function formatRinggit(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

// src/lib/utils/whatsapp.ts
interface WhatsAppOrderParams {
  phone: string; // e.g. "60123456789"
  productTitle: string;
  variantTitle?: string;
  price: string;
  productUrl: string;
  language?: 'EN' | 'MS';
}

export function generateWhatsAppOrderUrl({
  phone,
  productTitle,
  variantTitle,
  price,
  productUrl,
  language = 'MS',
}: WhatsAppOrderParams): string {
  const text =
    language === 'MS'
      ? `Hai VELLUM! Saya berminat nak order:\n\n*${productTitle}*\n${variantTitle ? `Variasi/Saiz: ${variantTitle}\n` : ''}Harga: ${formatRinggit(price)}\nLink: ${productUrl}\n\nAda stok lagi ke?`
      : `Hi VELLUM! I would like to enquire / order:\n\n*${productTitle}*\n${variantTitle ? `Variant/Size: ${variantTitle}\n` : ''}Price: ${formatRinggit(price)}\nLink: ${productUrl}\n\nIs this available?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
```

### 2.5 Fashion Sizing & Spec Sheet Components

#### Shoe Sizing Guide (`src/components/product/ShoeSizeGuide.astro`)
```astro
---
import { Ruler, CheckCircle2 } from 'lucide-astro';

interface Props {
  locale?: 'en' | 'ms';
}

const { locale = 'ms' } = Astro.props;

const sizeChart = [
  { eu: '39', uk: '5.5', us: '6.5', cm: '24.5' },
  { eu: '40', uk: '6.5', us: '7.5', cm: '25.0' },
  { eu: '41', uk: '7.5', us: '8.5', cm: '26.0' },
  { eu: '42', uk: '8.0', us: '9.0', cm: '26.5' },
  { eu: '43', uk: '9.0', us: '10.0', cm: '27.5' },
  { eu: '44', uk: '9.5', us: '10.5', cm: '28.0' },
  { eu: '45', uk: '10.5', us: '11.5', cm: '29.0' },
];
---

<div class="border border-neutral-200 rounded-xl p-5 bg-stone-50/50">
  <div class="flex items-center gap-2 mb-3">
    <Ruler class="w-5 h-5 text-neutral-800" />
    <h3 class="font-semibold text-neutral-900 text-sm tracking-wide uppercase">
      {locale === 'ms' ? 'Panduan Saiz Kasut (Size Chart)' : 'Shoe Sizing Guide'}
    </h3>
  </div>

  <div class="overflow-x-auto">
    <table class="w-full text-xs text-left border-collapse">
      <thead>
        <tr class="border-b border-neutral-200 text-neutral-500 font-medium">
          <th class="py-2 px-3">EU</th>
          <th class="py-2 px-3">UK</th>
          <th class="py-2 px-3">US</th>
          <th class="py-2 px-3">Panjang Kaki (CM)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-200">
        {sizeChart.map((row) => (
          <tr class="hover:bg-white transition-colors">
            <td class="py-2.5 px-3 font-semibold text-neutral-900">{row.eu}</td>
            <td class="py-2.5 px-3 text-neutral-600">{row.uk}</td>
            <td class="py-2.5 px-3 text-neutral-600">{row.us}</td>
            <td class="py-2.5 px-3 text-neutral-900 font-mono">{row.cm} cm</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div class="mt-3 flex items-start gap-2 text-xs text-neutral-600 bg-white p-3 rounded-lg border border-neutral-100">
    <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
    <p>
      {locale === 'ms'
        ? 'Tips: Ukur dari tumit hingga hujung ibu jari kaki. Jika tapak kaki anda jenis lebar, kami syorkan pilih 1 saiz lebih besar.'
        : 'Tip: Measure from heel to longest toe. If you have wider feet, we recommend choosing 1 size up.'}
    </p>
  </div>
</div>
```

#### Watch Specification Sheet (`src/components/product/WatchSpecSheet.astro`)
```astro
---
import { Watch, ShieldCheck, Droplets, Sparkles } from 'lucide-astro';

interface Props {
  caseDiameter?: string;
  lugWidth?: string;
  movement?: string;
  glass?: string;
  waterResistance?: string;
  strap?: string;
  locale?: 'en' | 'ms';
}

const {
  caseDiameter = '40mm',
  lugWidth = '20mm',
  movement = 'Japanese Quartz / Automatic',
  glass = 'Sapphire Crystal (Anti-Scratch)',
  waterResistance = '5 ATM / 50 Metres',
  strap = 'Genuine Italian Leather / 316L Stainless Steel',
  locale = 'ms',
} = Astro.props;

const specs = [
  { label: locale === 'ms' ? 'Diameter Kerangka' : 'Case Diameter', value: caseDiameter, icon: Watch },
  { label: locale === 'ms' ? 'Lebar Tali (Lug Width)' : 'Lug Width', value: lugWidth, icon: Watch },
  { label: locale === 'ms' ? 'Enjin / Pergerakan' : 'Movement', value: movement, icon: Sparkles },
  { label: locale === 'ms' ? 'Jenis Kaca' : 'Glass Type', value: glass, icon: ShieldCheck },
  { label: locale === 'ms' ? 'Ketahanan Air' : 'Water Resistance', value: waterResistance, icon: Droplets },
  { label: locale === 'ms' ? 'Bahan Tali' : 'Strap Material', value: strap, icon: Watch },
];
---

<div class="border border-neutral-200 rounded-xl p-5 bg-white shadow-xs">
  <h3 class="font-semibold text-neutral-900 text-sm tracking-wide uppercase mb-4">
    {locale === 'ms' ? 'Spesifikasi Jam Tangan' : 'Technical Specifications'}
  </h3>

  <dl class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
    {specs.map((item) => (
      <div class="p-3 bg-stone-50 rounded-lg border border-stone-100 flex flex-col justify-between">
        <dt class="text-neutral-500 font-medium mb-1">{item.label}</dt>
        <dd class="text-neutral-900 font-semibold">{item.value}</dd>
      </div>
    ))}
  </dl>
</div>
```

---

## 3. Environment Configuration (`.env.example`)

```bash
# Shopify Storefront API Credentials
PUBLIC_SHOPIFY_STORE_DOMAIN="vellum-my.myshopify.com"
PUBLIC_SHOPIFY_STOREFRONT_TOKEN="your_public_storefront_access_token"

# Localization & Merchant Contact
PUBLIC_STORE_NAME="VELLUM"
PUBLIC_DEFAULT_LOCALE="ms"
PUBLIC_SUPPORTED_LOCALES="ms,en"
PUBLIC_WHATSAPP_NUMBER="60123456789"
PUBLIC_FREE_SHIPPING_THRESHOLD_MYR="150"
```
