import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Star, ArrowRight} from 'lucide-react';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
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
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - minPrice) / compareAtPrice) * 100)
    : 0;

  return (
    <Link
      to={variantUrl}
      key={product.id}
      prefetch="intent"
      className="group flex flex-col bg-white rounded-2xl border border-[#EBE6DF] overflow-hidden hover:shadow-lg active:scale-[0.99] transition-all duration-300"
    >
      {/* 1:1 Aspect Ratio Product Image (with Second Image Hover Reveal) */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {primaryImage ? (
          <>
            {/* Primary Image */}
            <Image
              alt={primaryImage.altText || product.title}
              aspectRatio="1/1"
              data={primaryImage}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] transition-all duration-500 ease-out ${
                secondaryImage
                  ? 'group-hover:opacity-0 group-hover:scale-105'
                  : 'group-hover:scale-105'
              }`}
            />

            {/* Secondary Image (Appears smoothly on card hover) */}
            {secondaryImage && (
              <Image
                alt={secondaryImage.altText || `${product.title} - angle 2`}
                aspectRatio="1/1"
                data={secondaryImage}
                loading="lazy"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-[1.02] contrast-[1.02] opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-105 transition-all duration-500 ease-out pointer-events-none"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs bg-[#FAF9F6]">
            ELFY
          </div>
        )}

        {/* Dynamic Discount or Curated Tag */}
        {hasDiscount && discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#A83232] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs pointer-events-none">
            Jimat {discountPercent}%
          </div>
        ) : (
          <div className="absolute top-2.5 left-2.5 z-10 bg-[#191817] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs pointer-events-none">
            Koleksi Terpilih
          </div>
        )}

        {/* Crisp Clean Shipping Guarantee Tag (Bright Frosted) */}
        <div className="absolute bottom-2.5 left-2.5 z-10 bg-white/95 backdrop-blur-xs text-[#191817] border border-stone-200/80 text-[10px] font-semibold px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F]" />
          <span>Pos 1-3 Hari</span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category / Rating */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[#B48344]">
              {(product as any).productType || 'Sartorial'}
            </span>
            <span className="flex items-center gap-0.5 text-amber-500 font-medium">
              <Star className="w-3 h-3 fill-amber-400" /> 4.9
            </span>
          </div>

          <h3 className="text-xs font-semibold text-[#191817] group-hover:text-[#B48344] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#191817] truncate">
              {currencyCode === 'MYR' ? 'RM' : currencyCode} {minPrice.toFixed(2)}
            </div>
            {hasDiscount && (
              <div className="text-[10px] sm:text-[11px] text-stone-400 line-through truncate">
                {currencyCode === 'MYR' ? 'RM' : currencyCode} {compareAtPrice.toFixed(2)}
              </div>
            )}
          </div>

          <span className="text-[11px] font-semibold text-stone-700 group-hover:text-[#B48344] transition-colors duration-200 inline-flex items-center gap-1 shrink-0">
            <span>Lihat Saiz</span>
            <ArrowRight className="w-3 h-3 text-[#B48344] shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}
