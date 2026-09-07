import React from 'react';
import {ShoppingBag, ChevronUp} from 'lucide-react';

interface StickyAddToCartProps {
  title: string;
  price: string;
  currencyCode?: string;
  imageUrl?: string;
  selectedVariant?: any;
  availableForSale?: boolean;
  onAddToCart: () => void;
  onOpenSizePicker?: () => void;
  hasSizes?: boolean;
  selectedSize?: string;
}

export function StickyAddToCart({
  title,
  price,
  currencyCode = 'MYR',
  imageUrl,
  selectedVariant,
  availableForSale = true,
  onAddToCart,
  onOpenSizePicker,
  hasSizes = false,
  selectedSize,
}: StickyAddToCartProps) {
  const needsSize = hasSizes && !selectedSize;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF9F6] border-t border-[#EBE6DF] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Price Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-11 h-11 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
            />
          )}
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#191817] truncate leading-tight">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-[#191817]">
                {currencyCode} {parseFloat(price).toFixed(2)}
              </span>
              {selectedSize && (
                <span className="text-[11px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-medium">
                  Saiz {selectedSize}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: CTA Button */}
        <div>
          {availableForSale ? (
            <button
              type="button"
              onClick={() => {
                if (needsSize && onOpenSizePicker) {
                  onOpenSizePicker();
                } else {
                  onAddToCart();
                }
              }}
              className="group h-12 px-4 sm:px-5 bg-[#191817] hover:bg-[#B48344] active:scale-[0.98] text-white border-2 border-[#191817] hover:border-[#B48344] rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 shrink-0 select-none"
            >
              <ShoppingBag className="w-4 h-4 text-[#B48344] shrink-0 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
              <span className="text-white shrink-0">{needsSize ? 'Pilih Saiz' : 'Tambah ke Beg'}</span>
              {needsSize && <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-white transition-colors duration-200 shrink-0" />}
            </button>
          ) : (
            <button
              disabled
              className="h-12 px-4 sm:px-5 bg-stone-200 text-stone-400 border-2 border-stone-200 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center cursor-not-allowed shrink-0 select-none"
            >
              <span className="shrink-0">Habis Stok</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
