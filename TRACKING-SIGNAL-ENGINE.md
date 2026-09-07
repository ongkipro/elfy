# Tracking & Signal Engine Architecture — elfy.my

## 1. High-Precision Tracking Objectives

For `elfy.my`, marketing signals must be server-authoritative and dual-funnel deduplicated. Because users navigate from the headless Hydrogen storefront (`elfy.my`) to the hosted Shopify checkout domain, we must bridge tracking attribution across domains without losing `_fbp`, `_fbc`, `_ga`, or ad click IDs (`fbclid`, `gclid`).

---

## 2. Meta Ads Signal Engine (Pixel + CAPI Dual-Funnel)

### 2.1 Deduplication Formula
Each funnel interaction generates a deterministic `event_id`:
```typescript
// Deterministic Event ID generation example
export function generateEventId(eventName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${eventName}_${timestamp}_${randomStr}`;
}
```
- When the event fires in the browser:
  ```javascript
  window.fbq('track', 'AddToCart', {
    content_name: product.title,
    content_ids: [variant.id],
    content_type: 'product',
    value: parseFloat(variant.price.amount),
    currency: 'MYR'
  }, { eventID: eventId });
  ```
- If dispatched simultaneously via Hydrogen Server-Side CAPI:
  - Dispatches POST request to `https://graph.facebook.com/v20.0/{PUBLIC_META_PIXEL_ID}/events?access_token={META_CAPI_ACCESS_TOKEN}`.
  - Carries the exact same `event_id` and client context (`client_ip_address`, `client_user_agent`, `fbp`, `fbc`).
  - Result: Meta deduplicates to a single event with 10/10 Match Quality.

### 2.2 Preserving Attribution Across Checkout Handoff
Browsers running Safari ITP or privacy protections often drop third-party cookies when switching hostnames.
To guarantee server-side `Purchase` attribution:
1. When the user lands on `elfy.my`, extract:
   - `_fbp` (from cookie)
   - `_fbc` (from cookie or generated from `fbclid` query param)
   - `_ga` / `_gid` (from cookie)
   - `gclid` (from query param)
2. When creating or updating the cart via Hydrogen Cart API (`cartCreate` / `cartAttributesUpdate`), attach them as Cart Attributes:
   ```graphql
   mutation updateCartAttributes($cartId: ID!, $attributes: [AttributeInput!]!) {
     cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
       cart {
         id
         attributes {
           key
           value
         }
       }
     }
   }
   ```
3. Attributes attached (standardized naming across PRD and TASKS):
   - `[ { key: "_attribution_fbp", value: fbpCookie }, { key: "_attribution_fbc", value: fbcCookie }, { key: "_attribution_ga", value: gaCookie }, { key: "_attribution_gclid", value: gclidParam } ]`.
4. When checkout completes, Shopify emits an `orders/paid` or `orders/create` webhook carrying these attributes.
5. Server-side CAPI reads these attributes and dispatches the high-value `Purchase` event with complete attribution fidelity.

---

## 3. Google Ads & GTM Integration

### 3.1 GTM Architecture
- Inject Google Tag Manager container `PUBLIC_GTM_ID` into Hydrogen's `root.tsx` with nonce support:
  ```html
  <script
    nonce={nonce}
    dangerouslySetInnerHTML={{
      __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`
    }}
  />
  ```

### 3.2 GA4 Ecommerce Standard Events
- **`view_item`**: Fired on PDP mount with item price, id, name, and currency `MYR`.
- **`add_to_cart`**: Fired on variant selection + cart drawer open.
- **`begin_checkout`**: Fired on clicking the primary CTA in the Cart Drawer.

---

## 4. Consent Mode v2 & Privacy
- **Consent Banner Integration**: Ensure default states are configured:
  ```javascript
  gtag('consent', 'default', {
    'ad_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'analytics_storage': 'granted'
  });
  ```
- Whitelist tracking endpoints in Hydrogen's Content Security Policy (`CSP`).
