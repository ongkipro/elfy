import {ChevronUp, Zap} from 'lucide-react';

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
  visible?: boolean;
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
  visible = true,
}: StickyAddToCartProps) {
  const needsSize = hasSizes && !selectedSize;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#EBE6DF] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-3.5 sm:px-4 pt-2.5 pb-[max(12px,env(safe-area-inset-bottom))] transition-all duration-300 ease-out ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
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

        {/* Right: Single High-Impact Action Button (48px Touch Target) */}
        <div className="shrink-0">
          {availableForSale ? (
            needsSize ? (
              <button
                type="button"
                onClick={onOpenSizePicker}
                className="group h-12 px-4.5 sm:px-5 bg-[#191817] hover:bg-stone-800 active:scale-[0.985] text-white rounded-lg font-medium text-xs uppercase tracking-[0.12em] inline-flex items-center justify-center gap-1.5 transition-all duration-200 select-none cursor-pointer shadow-xs"
              >
                <span>Pilih Saiz</span>
                <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-200 stroke-[1.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onBuyNow || onAddToCart}
                className="group h-12 px-5 sm:px-6 bg-[#191817] hover:bg-stone-800 active:scale-[0.985] text-white rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 stroke-[1.5] fill-white text-white group-hover:scale-110 transition-transform duration-200" />
                <span>Beli Sekarang</span>
              </button>
            )
          ) : (
            <button
              disabled
              className="h-12 px-4.5 bg-stone-200 text-stone-400 rounded-lg font-medium text-xs uppercase tracking-[0.12em] inline-flex items-center justify-center cursor-not-allowed select-none"
            >
              <span>Habis Stok</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
