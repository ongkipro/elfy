/**
 * Precision Tracking & Signal Engine for elfy.my
 * Dual-Funnel Meta Pixel (browser) + GTM DataLayer with deterministic event_id deduplication.
 */

import {getAttributionPayload} from '~/lib/attribution';

export interface FbPixelFunction {
  (...args: unknown[]): void;
  queue: unknown[];
  loaded: boolean;
  version: string;
}

declare global {
  interface Window {
    fbq?: FbPixelFunction;
    _fbq?: FbPixelFunction;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function generateEventId(eventName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${eventName}_${timestamp}_${random}`;
}
export function formatCatalogContentId(id?: string): string {
  if (!id) return '';
  if (id.startsWith('gid://shopify/ProductVariant/')) {
    return id.replace('gid://shopify/ProductVariant/', '');
  }
  if (id.startsWith('gid://shopify/Product/')) {
    return id.replace('gid://shopify/Product/', '');
  }
  return id;
}

async function dispatchMetaCapi(params: {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
}): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const attribution = getAttributionPayload();
    const body = {
      event_name: params.event_name,
      event_id: params.event_id,
      event_source_url: params.event_source_url || window.location.href,
      fbp: attribution._attribution_fbp,
      fbc: attribution._attribution_fbc,
      external_id: attribution._attribution_external_id,
      custom_data: params.custom_data,
    };

    fetch('/api/meta-events', {
      method: 'POST',
      keepalive: true,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    }).catch(() => {
      // Non-blocking catch for edge network failures
    });
  } catch {}
}

export interface TrackingProductPayload {
  id: string;
  title: string;
  price: number;
  currency?: string;
  variantId?: string;
  variantTitle?: string;
  category?: string;
}

export function trackPageView(url?: string) {
  if (typeof window === 'undefined') return;
  const eventId = generateEventId('PageView');

  // Meta Pixel (browser)
  if (window.fbq) {
    window.fbq('track', 'PageView', {}, {eventID: eventId});
  }

  // Meta CAPI (server proxy with matching eventID)
  dispatchMetaCapi({
    event_name: 'PageView',
    event_id: eventId,
    event_source_url: url,
  });

  // Google Analytics / GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_location: url || window.location.href,
      page_path: window.location.pathname,
      event_id: eventId,
    });
  }
}

export function trackViewContent(product: TrackingProductPayload) {
  if (typeof window === 'undefined') return;
  const eventId = generateEventId('ViewContent');

  // Meta Pixel
  const canonicalContentId = formatCatalogContentId(product.variantId || product.id);
  const customData: Record<string, unknown> = {
    content_name: product.title,
    content_ids: [canonicalContentId],
    content_type: 'product',
    content_category: product.category || 'Footwear & Horology',
    value: product.price,
    currency: product.currency || 'MYR',
  };

  // Meta Pixel (browser)
  if (window.fbq) {
    window.fbq('track', 'ViewContent', customData, {eventID: eventId});
  }

  // Meta CAPI (server proxy with matching eventID)
  dispatchMetaCapi({
    event_name: 'ViewContent',
    event_id: eventId,
    custom_data: customData,
  });

  // GA4 / GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'view_item',
      event_id: eventId,
      ecommerce: {
        currency: product.currency || 'MYR',
        value: product.price,
        items: [
          {
            item_id: product.variantId || product.id,
            item_name: product.title,
            item_category: product.category || 'Footwear & Horology',
            item_variant: product.variantTitle,
            price: product.price,
            quantity: 1,
          },
        ],
      },
    });
  }
}

export function trackAddToCart(product: TrackingProductPayload, quantity: number = 1) {
  if (typeof window === 'undefined') return;
  const eventId = generateEventId('AddToCart');

  // Meta Pixel
  const canonicalContentId = formatCatalogContentId(product.variantId || product.id);
  const customData: Record<string, unknown> = {
    content_name: product.title,
    content_ids: [canonicalContentId],
    content_type: 'product',
    value: product.price * quantity,
    currency: product.currency || 'MYR',
  };

  // Meta Pixel (browser)
  if (window.fbq) {
    window.fbq('track', 'AddToCart', customData, {eventID: eventId});
  }

  // Meta CAPI (server proxy with matching eventID)
  dispatchMetaCapi({
    event_name: 'AddToCart',
    event_id: eventId,
    custom_data: customData,
  });

  // GA4 / GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'add_to_cart',
      event_id: eventId,
      ecommerce: {
        currency: product.currency || 'MYR',
        value: product.price * quantity,
        items: [
          {
            item_id: product.variantId || product.id,
            item_name: product.title,
            item_category: product.category || 'Footwear & Horology',
            item_variant: product.variantTitle,
            price: product.price,
            quantity,
          },
        ],
      },
    });
  }
}

export function trackInitiateCheckout(totalValue: number, itemsCount: number) {
  if (typeof window === 'undefined') return;
  const eventId = generateEventId('InitiateCheckout');

  const customData: Record<string, unknown> = {
    value: totalValue,
    currency: 'MYR',
    num_items: itemsCount,
  };

  // Meta Pixel (browser)
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', customData, {eventID: eventId});
  }

  // Meta CAPI (server proxy with matching eventID)
  dispatchMetaCapi({
    event_name: 'InitiateCheckout',
    event_id: eventId,
    custom_data: customData,
  });

  // GA4 / GTM
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'begin_checkout',
      event_id: eventId,
      ecommerce: {
        currency: 'MYR',
        value: totalValue,
      },
    });
  }
}
