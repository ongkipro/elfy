/**
 * Image Optimization Utilities for ELFY Storefront (elfy.my)
 * - Enforces modern WebP compression for sub-second page loads
 * - Handles Shopify CDN dynamic on-the-fly transformations (format=webp, width, height, crop)
 * - Converts local static asset paths (.jpg/.png) to .webp
 * - Generates responsive srcSet attributes to eliminate network bloat & maximize Google PageSpeed
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'avif' | 'pjpg';
  crop?: 'top' | 'bottom' | 'center' | 'left' | 'right';
  scale?: 1 | 2 | 3;
  quality?: number;
}

/**
 * Transforms any Shopify CDN or local asset URL into an optimized WebP format with precise dimensions.
 *
 * Example input:  https://cdn.shopify.com/s/files/.../shoe.jpg?v=123
 * Example output: https://cdn.shopify.com/s/files/.../shoe.jpg?v=123&format=webp&width=800
 */
export function getShopifyImageUrl(
  src?: string | null,
  options?: ImageOptimizationOptions,
): string {
  if (!src || typeof src !== 'string') return '';

  const {width, height, format = 'webp', crop, scale} = options || {};

  // 1. Local static assets in public/ directory
  if (src.startsWith('/')) {
    // Automatically use the .webp sibling file
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  // 2. Shopify CDN Assets (cdn.shopify.com)
  if (src.includes('cdn.shopify.com')) {
    try {
      const url = new URL(src);
      url.searchParams.set('format', format);
      if (width) url.searchParams.set('width', String(Math.round(width)));
      if (height) url.searchParams.set('height', String(Math.round(height)));
      if (crop) url.searchParams.set('crop', crop);
      if (scale) url.searchParams.set('scale', String(scale));
      return url.toString();
    } catch {
      // Fallback query append if string is not a full URL
      const sep = src.includes('?') ? '&' : '?';
      let transformed = `${src}${sep}format=${format}`;
      if (width) transformed += `&width=${Math.round(width)}`;
      if (height) transformed += `&height=${Math.round(height)}`;
      if (crop) transformed += `&crop=${crop}`;
      return transformed;
    }
  }

  return src;
}

/**
 * Generates a standard responsive `srcSet` attribute string for high-DPI displays & mobile screens.
 */
export function getShopifyImageSrcSet(
  src?: string | null,
  widths: number[] = [360, 480, 640, 768, 1024, 1280, 1600],
  options?: Omit<ImageOptimizationOptions, 'width'>,
): string {
  if (!src) return '';

  // Local assets: return single webp url if not a dynamic CDN
  if (src.startsWith('/') && !src.includes('cdn.shopify.com')) {
    return `${getShopifyImageUrl(src, options)}`;
  }

  return widths
    .map((w) => `${getShopifyImageUrl(src, {...options, width: w})} ${w}w`)
    .join(', ');
}
