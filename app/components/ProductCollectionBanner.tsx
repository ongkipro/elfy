import React from 'react';
import {Link} from 'react-router';
import {ArrowRight} from 'lucide-react';
import {getShopifyImageUrl, getShopifyImageSrcSet} from '~/lib/image';

export interface CollectionData {
  id?: string;
  title: string;
  handle: string;
  description?: string | null;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
}

interface ProductCollectionBannerProps {
  collection: CollectionData;
  productType?: string;
}

const DEFAULT_BANNERS: Record<string, string> = {
  'mens-sneakers': '/banners/mens-sneakers-3x2.webp',
  'mens-watches': '/banners/mens-watches-3x2.webp',
  'womens-watches': '/banners/womens-watches-3x2.webp',
  'new-arrivals': '/banners/new-arrivals-3x2.webp',
  'best-sellers': '/banners/best-sellers-3x2.webp',
  all: '/banners/mens-sneakers-3x2.webp',
};

export function ProductCollectionBanner({
  collection,
  productType,
}: ProductCollectionBannerProps) {
  if (!collection || !collection.handle || collection.handle === 'frontpage') {
    return null;
  }

  // Resolve banner image (Shopify collection image or high-res WebP banner fallback)
  const rawImageUrl =
    collection.image?.url ||
    DEFAULT_BANNERS[collection.handle] ||
    '/banners/mens-sneakers-3x2.webp';

  const optimizedBg = getShopifyImageUrl(rawImageUrl, {
    width: 1400,
    format: 'webp',
  });

  const srcSet = getShopifyImageSrcSet(rawImageUrl, [480, 768, 1024, 1440]);

  const description =
    collection.description ||
    'Pilihan rekaan kasual dan sartorial yang direka khas untuk keselesaan dan gaya hidup moden Malaysia.';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
      <div className="relative rounded-2xl overflow-hidden bg-[#191817] text-white p-5 sm:p-8 lg:p-10 border border-[#2E2B27] shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 group">
        {/* Full-Bleed WebP Photography Background */}
        <img
          src={optimizedBg}
          srcSet={srcSet}
          sizes="(min-width: 1280px) 1200px, 100vw"
          alt={collection.image?.altText || collection.title}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.35] group-hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
          loading="lazy"
          decoding="async"
          width={1400}
          height={700}
        />

        {/* Modern Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/65 to-black/35 pointer-events-none" />

        {/* Left: Typography */}
        <div className="relative z-10 max-w-xl">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#B48344] block mb-1">
            Koleksi Rasmi ELFY
          </span>
          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
            {collection.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1.5 line-clamp-2 font-normal leading-relaxed">
            {description}
          </p>
        </div>

        {/* Right: Minimalist Modern Action */}
        <div className="relative z-10 shrink-0">
          <Link
            to={`/collections/${collection.handle}`}
            className="inline-flex items-center justify-center gap-2 w-full md:w-auto h-11 px-5 sm:px-6 rounded-xl bg-white hover:bg-stone-100 text-[#191817] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-[0.98] group/btn cursor-pointer"
          >
            <span>Terokai Siri Penuh</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
