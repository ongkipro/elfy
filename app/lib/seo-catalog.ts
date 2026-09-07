/**
 * Dynamic SEO & Content Helpers — elfy.my
 * 
 * 1:1 Dynamic synchronization with Shopify Storefront API:
 * - Content & titles are fetched live from Shopify (zero hardcoded dictionaries).
 * - Prioritizes Shopify Admin Search Engine Listing (product.seo.title, product.seo.description).
 * - Clean fallbacks with brand-aligned Malaysian context when SEO fields are empty.
 */

export interface FallbackSeoInput {
  title?: string | null;
  seoTitle?: string | null;
  description?: string | null;
}

export interface DynamicSeoResult {
  brandedTitle: string;
  seoTitle: string;
  seoDescription: string;
}

export interface GenericSeoResult {
  title: string;
  description: string;
}

/**
 * Normalizes SEO Title: replaces pipes '|' with hyphens '-', collapses excess whitespace.
 */
export function cleanSeoTitle(rawTitle?: string | null, fallbackSuffix = 'ELFY Official'): string {
  if (!rawTitle || !rawTitle.trim()) {
    return fallbackSuffix;
  }
  const cleaned = rawTitle
    .replace(/\|/g, '-')
    .replace(/\s+-\s+/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();

  // If title doesn't contain brand suffix and is short enough, append brand suffix
  if (!cleaned.toLowerCase().includes('elfy') && cleaned.length < 50) {
    return `${cleaned} - ${fallbackSuffix}`;
  }
  return cleaned;
}

/**
 * Normalizes Meta Description: strips HTML tags, removes excess whitespace, truncates <= 160 chars.
 */
export function cleanSeoDescription(
  rawDesc?: string | null,
  fallback = 'Jenama kasut kasual kulit asli & jam tangan sartorial rekaan moden Malaysia. Waranti 1 tahun & jaminan tukar saiz 7 hari percuma.',
): string {
  if (!rawDesc || !rawDesc.trim()) {
    return fallback;
  }
  const plainText = rawDesc
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) return fallback;
  if (plainText.length <= 160) return plainText;
  return `${plainText.slice(0, 157).trim()}...`;
}

/**
 * Dynamic Product SEO Resolver
 * Dynamically resolves titles and metadata directly from Shopify data:
 * 1. Branded Title: directly from product.title
 * 2. SEO Title: product.seo.title -> fallback to `${product.title} - ELFY Official`
 * 3. Meta Description: product.seo.description -> product.description -> fallback copy
 */
export function getProductSeo(
  handle: string,
  fallback?: FallbackSeoInput,
): DynamicSeoResult {
  const baseTitle = fallback?.title?.trim() || 'Produk ELFY';

  const rawSeoTitle = fallback?.seoTitle?.trim() || `${baseTitle} - ELFY Official`;
  const seoTitle = cleanSeoTitle(rawSeoTitle);

  const fallbackDesc = `Beli ${baseTitle} di ELFY Malaysia. Sedia pos dari KL, jaminan 1 tahun & tukar saiz 7 hari percuma.`;
  const seoDescription = cleanSeoDescription(fallback?.description, fallbackDesc);

  return {
    brandedTitle: baseTitle,
    seoTitle,
    seoDescription,
  };
}

/**
 * Dynamic Collection SEO Resolver
 */
export function getCollectionSeo(
  handle: string,
  fallback?: FallbackSeoInput,
): GenericSeoResult {
  const baseTitle = fallback?.title?.trim() || 'Koleksi';

  const rawSeoTitle = fallback?.seoTitle?.trim() || `${baseTitle} - ELFY Official`;
  const seoTitle = cleanSeoTitle(rawSeoTitle);

  const fallbackDesc = `Koleksi ${baseTitle} rasmi ELFY Malaysia. Kasut kasual premium dan jam tangan berkualiti tinggi. Sedia pos dari KL & jaminan tukar saiz.`;
  const description = cleanSeoDescription(fallback?.description, fallbackDesc);

  return {
    title: seoTitle,
    description,
  };
}

/**
 * Dynamic Static Page SEO Resolver
 */
export function getPageSeo(
  handle: string,
  fallback?: FallbackSeoInput,
): GenericSeoResult {
  const baseTitle = fallback?.title?.trim() || 'Maklumat';

  const rawSeoTitle = fallback?.seoTitle?.trim() || `${baseTitle} - ELFY Official`;
  const seoTitle = cleanSeoTitle(rawSeoTitle);

  const fallbackDesc =
    'Maklumat rasmi berkaitan ELFY Kuala Lumpur — kasut kulit asli dan jam tangan sartorial berkualiti tinggi.';
  const description = cleanSeoDescription(fallback?.description, fallbackDesc);

  return {
    title: seoTitle,
    description,
  };
}
