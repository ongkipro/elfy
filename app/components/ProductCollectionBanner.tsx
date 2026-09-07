import React from 'react';
import {Link} from 'react-router';
import {ArrowRight, Sparkles, CheckCircle2, Truck, RefreshCw, ShieldCheck} from 'lucide-react';
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
    width: 1600,
    format: 'webp',
  });

  const srcSet = getShopifyImageSrcSet(rawImageUrl, [480, 768, 1024, 1440, 1920]);

  // Clean description fallback
  const description =
    collection.description ||
    'Pilihan rekaan fesyen kasual dan aksesori sartorial yang direka khas untuk gaya hidup moden Malaysia. Nikmati penghantaran percuma Semenanjung dan jaminan tukar saiz 7 hari percuma.';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-950 text-white min-h-[320px] sm:min-h-[380px] flex flex-col justify-between p-6 sm:p-10 lg:p-12 border border-[#2A2724] shadow-md group">
        {/* Full-Bleed WebP Photography Background */}
        <img
          src={optimizedBg}
          srcSet={srcSet}
          sizes="(min-width: 1280px) 1200px, 100vw"
          alt={collection.image?.altText || collection.title}
          className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.42] sm:brightness-[0.48] group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70 pointer-events-none" />

        {/* Top: Collection Category Pill & Ready Stock Status */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-medium text-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Koleksi Rasmi ELFY • Kuala Lumpur</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-300 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            <span>Ready Stock KL • Sedia Pos Pantas</span>
          </div>
        </div>

        {/* Center/Bottom: Typography & CTA */}
        <div className="relative z-10 max-w-2xl pt-8 pb-2">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37] block mb-2 drop-shadow-xs">
            Terokai Siri Penuh
          </span>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight drop-shadow-md">
            {collection.title}
          </h2>

          <p className="mt-2.5 sm:mt-3.5 text-xs sm:text-sm text-stone-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-xs font-normal max-w-xl">
            {description}
          </p>

          {/* Value Assurances Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs text-stone-300 pt-4 pb-6 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pos Percuma RM150+</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Tukar Saiz 7 Hari</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Jaminan Asli ELFY</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to={`/collections/${collection.handle}`}
              className="h-11 sm:h-12 px-6 bg-white hover:bg-stone-100 active:scale-[0.99] text-[#191817] rounded-xl font-semibold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all shadow-md group/btn cursor-pointer"
            >
              <span>Lihat Semua Produk Koleksi Ini</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200 shrink-0" />
            </Link>

            <Link
              to="/collections/all"
              className="h-11 sm:h-12 px-5 bg-black/40 hover:bg-white/10 active:scale-[0.99] text-stone-200 hover:text-white border border-white/20 rounded-xl font-medium text-xs uppercase tracking-wider inline-flex items-center justify-center transition-all cursor-pointer"
            >
              <span>Semua Koleksi ELFY</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
