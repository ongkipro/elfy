import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

/**
 * Editorial category & micro-spec classifier for luxury hierarchy
 */
function getEditorialMeta(handle: string, productType?: string | null): {
  category: string;
  specHint: string;
} {
  const h = handle.toLowerCase();
  const pt = (productType || '').toLowerCase();

  if (h.includes('jam-tangan-wanita') || pt.includes('women')) {
    return {
      category: "Women's Horology",
      specHint: 'Waranti 1 Tahun • Sedia Pos KL',
    };
  }
  if (h.includes('jam-tangan') || pt.includes('watch')) {
    return {
      category: "Men's Horology",
      specHint: 'Enjin Kuarza Jitu • Waranti 1 Thn',
    };
  }
  if (
    h.includes('sneaker') ||
    h.includes('sepatu') ||
    pt.includes('shoe') ||
    pt.includes('sneaker')
  ) {
    return {
      category: "Men's Footwear",
      specHint: 'Wide Fit (39–44) • Pos 1-3 Hari',
    };
  }
  return {
    category: productType || 'ELFY Sartorial',
    specHint: 'Ready Stock KL • Pos Pantas',
  };
}

export function ProductItem({
  product,
  loading = 'lazy',
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const displayTitle = product.title || 'Produk ELFY';
  const primaryImage = product.featuredImage;

  // Extract distinct second image for smooth luxury hover reveal
  const imageNodes = (product as any).images?.nodes || [];
  const secondaryImage =
    imageNodes.find(
      (img: any) =>
        img &&
        img.id !== primaryImage?.id &&
        img.url !== primaryImage?.url,
    ) || (imageNodes.length > 1 ? imageNodes[1] : null);

  const minPrice = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
  const currencyCode = product.priceRange?.minVariantPrice?.currencyCode || 'MYR';

  // Check compareAt if available in fragment
  const compareAtAmount =
    (product as any).compareAtPriceRange?.minVariantPrice?.amount ||
    (product as any).compareAtPriceRange?.maxVariantPrice?.amount;
  const compareAtPrice = compareAtAmount ? parseFloat(compareAtAmount) : 0;
  const hasDiscount = compareAtPrice > minPrice;

  const {category, specHint} = getEditorialMeta(
    product.handle,
    (product as any).productType,
  );

  return (
    <Link
      to={variantUrl}
      key={product.id}
      prefetch="intent"
      className="group flex flex-col w-full text-left"
    >
      {/* 1:1 Aspect Ratio Canvas (Frameless, Unobstructed Photography) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F5F4F0]">
        {primaryImage ? (
          <>
            {/* Primary Image */}
            <Image
              alt={primaryImage.altText || displayTitle}
              aspectRatio="1/1"
              data={primaryImage}
              loading={loading}
              decoding="async"
              sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 45vw"
              className={`w-full h-full object-cover object-center brightness-[1.01] contrast-[1.01] transition-all duration-700 ease-out ${
                secondaryImage
                  ? 'group-hover:opacity-0 group-hover:scale-[1.03]'
                  : 'group-hover:scale-[1.03]'
              }`}
            />

            {/* Secondary Image (Smooth opacity crossfade on card hover) */}
            {secondaryImage && (
              <Image
                alt={secondaryImage.altText || `${displayTitle} - Alternate Angle`}
                aspectRatio="1/1"
                data={secondaryImage}
                loading="lazy"
                decoding="async"
                sizes="(min-width: 1280px) 280px, (min-width: 768px) 33vw, 45vw"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[1.01] contrast-[1.01] opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-[1.03] transition-all duration-700 ease-out pointer-events-none"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs font-serif tracking-widest bg-[#F5F4F0]">
            ELFY
          </div>
        )}

        {/* Discreet Luxury Sale Tag (Zero neon stickers / Zero AI slop) */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[9px] tracking-[0.16em] uppercase font-semibold text-stone-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-xs pointer-events-none shadow-2xs">
            Sale
          </span>
        )}
      </div>

      {/* Editorial Typography Block (Precision Spacing & Alignment) */}
      <div className="mt-3 sm:mt-3.5 flex flex-col gap-0.5">
        {/* Micro-Category Line */}
        <span className="text-[10px] tracking-[0.15em] uppercase font-medium text-stone-600 truncate">
          {category}
        </span>

        {/* Branded Product Title */}
        <h3 className="text-xs sm:text-[13px] font-medium text-[#191817] group-hover:text-[#8C6527] transition-colors duration-200 leading-snug line-clamp-1">
          {displayTitle}
        </h3>

        {/* Pricing Line */}
        <div className="flex items-baseline gap-1.5 pt-0.5">
          <span className="text-xs sm:text-sm font-semibold text-[#191817] tracking-tight">
            {currencyCode === 'MYR' ? 'RM' : currencyCode} {minPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-stone-600 line-through font-normal">
              {currencyCode === 'MYR' ? 'RM' : currencyCode} {compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Sub-line Trust & Specification Hint */}
        <span className="text-[10px] text-stone-600 tracking-wide font-normal pt-0.5 line-clamp-1">
          {specHint}
        </span>
      </div>
    </Link>
  );
}

