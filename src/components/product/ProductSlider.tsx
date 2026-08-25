import React, { useRef } from 'react';
import type { Product } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  categoryTag: string;
  collectionHandle: string;
  viewAllLabel?: string;
  products: Product[];
}

export function ProductSlider({
  title,
  subtitle,
  categoryTag,
  collectionHandle,
  viewAllLabel = 'Lihat Semua',
  products,
}: ProductSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const collectionUrl = `/collections/${collectionHandle}`;

  return (
    <section className="py-10 sm:py-18 border-b border-[#E8E3DA] bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header with Title & Slider Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89768] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{categoryTag}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl font-bold text-neutral-950 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-neutral-600 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <a
              href={collectionUrl}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#B89768] hover:text-[#917349] transition-colors"
            >
              <span>{viewAllLabel} ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            {/* Slider Arrows (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2.5 rounded-full border border-[#E8E3DA] bg-[#FDFBF7] text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer shadow-2xs"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2.5 rounded-full border border-[#E8E3DA] bg-[#FDFBF7] text-neutral-800 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all cursor-pointer shadow-2xs"
                aria-label="Next Products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 2-COLUMN ON MOBILE, 4-COLUMN ON DESKTOP CAROUSEL TRACK */}
        <div
          ref={sliderRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => {
            const productUrl = `/products/${product.handle}`;
            const minPrice = product.priceRange.minVariantPrice.amount;
            const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount;
            const hasDiscount = Boolean(comparePrice && parseFloat(comparePrice) > parseFloat(minPrice));
            const isShoe = product.productType === 'Shoes';

            return (
              <div
                key={product.id}
                className="w-[calc(50%-6px)] min-w-[150px] sm:min-w-[240px] sm:w-[280px] lg:w-[calc(25%-15px)] shrink-0 snap-start group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E8E3DA] overflow-hidden hover:border-neutral-400 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <a href={productUrl} className="relative aspect-square w-full overflow-hidden bg-stone-100 block">
                  <img
                    src={product.featuredImage?.url || '/images/placeholder.jpg'}
                    alt={product.featuredImage?.altText || product.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {hasDiscount && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#121212] text-stone-100 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs">
                      Best Value
                    </span>
                  )}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-full shadow-xs hidden sm:block">
                    <ArrowUpRight className="w-3 h-3 text-neutral-900" />
                  </div>
                </a>

                {/* Content */}
                <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3 bg-[#FDFBF7]/50">
                  <div className="space-y-0.5 sm:space-y-1">
                    <span className="text-[8px] sm:text-[10px] text-[#B89768] font-bold uppercase tracking-widest block">
                      {isShoe ? 'Footwear' : 'Horology'}
                    </span>
                    <h3 className="font-serif text-xs sm:text-sm font-bold text-neutral-950 line-clamp-1 group-hover:text-[#B89768] transition-colors">
                      <a href={productUrl}>{product.title}</a>
                    </h3>
                    {isShoe && product.variants.nodes.length > 1 && (
                      <p className="text-[9px] sm:text-[11px] text-neutral-500 font-mono">
                        Saiz EU 39–44
                      </p>
                    )}
                    {!isShoe && (
                      <p className="text-[9px] sm:text-[11px] text-neutral-500 line-clamp-1">
                        Kotak Hadiah Termasuk
                      </p>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="pt-1.5 sm:pt-2 border-t border-[#E8E3DA] flex items-center justify-between gap-1">
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs sm:text-sm lg:text-base font-bold text-neutral-950 truncate">
                        {formatRinggit(minPrice)}
                      </span>
                      {hasDiscount && comparePrice && (
                        <span className="font-mono text-[8px] sm:text-[10px] text-neutral-400 line-through truncate">
                          {formatRinggit(comparePrice)}
                        </span>
                      )}
                    </div>

                    <a
                      href={productUrl}
                      className="text-[9px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-900 bg-[#F7F4EC] hover:bg-neutral-900 hover:text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border border-[#E8E3DA] transition-colors shrink-0"
                    >
                      Lihat
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
