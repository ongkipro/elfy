import React from 'react';
import {ShoppingBag, ChevronUp, Zap} from 'lucide-react';

interface StickyAddToCartProps {
  title: string;
  price: string;
  currencyCode?: string;
  imageUrl?: string;
  selectedVariant?: any;
  availableForSale?: boolean;
  onAddToCart: () => void;
  onBuyNow?: () => void;
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
  onBuyNow,
  onOpenSizePicker,
  hasSizes = false,
  selectedSize,
}: StickyAddToCartProps) {
  const needsSize = hasSizes && !selectedSize;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF9F6] border-t border-[#EBE6DF] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3 sm:px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] transition-transform duration-300">
      <div className="flex items-center justify-between gap-2.5">
        {/* Left: Thumbnail & Price Info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={title}
              className="w-11 h-11 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
            />
          )}
          <div className="min-w-0">
            <h4 className="text-[11px] font-semibold text-[#191817] truncate leading-tight">
              {title}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-[#191817]">
                {currencyCode} {parseFloat(price).toFixed(2)}
              </span>
              {selectedSize && (
                <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-semibold">
                  {selectedSize}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: CTA Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {availableForSale ? (
            <>
              {/* If needs size, prompt to pick size first */}
              {needsSize ? (
                <button
                  type="button"
                  onClick={onOpenSizePicker}
                  className="h-11 px-4 bg-[#191817] active:scale-[0.98] text-white rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-sm select-none cursor-pointer"
                >
                  <span>Pilih Saiz</span>
                  <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                </button>
              ) : (
                <>
                  {/* Add to Bag Icon Button */}
                  <button
                    type="button"
                    onClick={onAddToCart}
                    className="w-11 h-11 bg-white border border-[#191817] text-[#191817] active:scale-95 rounded-xl flex items-center justify-center shadow-2xs select-none cursor-pointer"
                    title="Tambah ke Beg"
                    aria-label="Tambah ke Beg"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>

                  {/* Beli Sekarang Direct Checkout Button */}
                  <button
                    type="button"
                    onClick={onBuyNow || onAddToCart}
                    className="h-11 px-4 bg-[#B48344] active:scale-[0.98] text-white rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-1.5 shadow-md select-none cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Beli Sekarang</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              disabled
              className="h-11 px-4 bg-stone-200 text-stone-400 rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center cursor-not-allowed select-none"
            >
              <span>Habis Stok</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
