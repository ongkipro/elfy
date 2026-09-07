import {useState} from 'react';
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import {AddToCartButton} from './AddToCartButton';
import {BuyNowButton} from './BuyNowButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {trackAddToCart, trackInitiateCheckout} from '~/lib/tracking';
import {
  ShoppingBag,
  Ruler,
  Check,
  Truck,
  Zap,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
} from 'lucide-react';
import {getAttributionPayload, toCartAttributes} from '~/lib/attribution';

export function ProductForm({
  productOptions,
  selectedVariant,
  onOpenSizeGuide,
  productTitle,
  productPrice,
  currencyCode = 'MYR',
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  onOpenSizeGuide?: () => void;
  productTitle?: string;
  productPrice?: number;
  currencyCode?: string;
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);

  const unitPrice = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : productPrice || 0;
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(10, prev + 1));
  };

  const handleAddToCartClick = () => {
    if (selectedVariant && productTitle) {
      trackAddToCart({
        id: selectedVariant.product.handle,
        title: productTitle,
        price: unitPrice,
        currency: currencyCode,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
      });
    }
    open('cart');
  };

  const handleBuyNowClick = () => {
    if (selectedVariant && productTitle) {
      trackAddToCart({
        id: selectedVariant.product.handle,
        title: productTitle,
        price: unitPrice,
        currency: currencyCode,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
      });
      trackInitiateCheckout(unitPrice * quantity, quantity);
    }
  };

  const lineItems = selectedVariant
    ? [
        {
          merchandiseId: selectedVariant.id,
          quantity,
          selectedVariant,
        },
      ]
    : [];

  const attributes =
    typeof window !== 'undefined'
      ? toCartAttributes(getAttributionPayload())
      : undefined;

  const isAvailable = Boolean(selectedVariant && selectedVariant.availableForSale);

  return (
    <div className="product-form space-y-6">
      {/* 1. VARIANT SELECTORS (Hidden for single-variant or non-variant products) */}
      {productOptions
        .filter(
          (option) =>
            option.optionValues.length > 1 &&
            option.optionValues[0]?.name !== 'Default Title' &&
            option.name.toLowerCase() !== 'title',
        )
        .map((option) => {
          const isSize =
            option.name.toLowerCase().includes('size') ||
            option.name.toLowerCase().includes('saiz');

          const activeValue = option.optionValues.find((v) => v.selected)?.name;

          return (
            <div className="space-y-2.5" key={option.name}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#191817] flex items-center gap-1.5">
                  <span>Pilih {option.name}:</span>
                  {activeValue && (
                    <span className="font-semibold text-[#B48344] normal-case">
                      {activeValue}
                    </span>
                  )}
                </span>
                {isSize && onOpenSizeGuide && (
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs font-semibold text-[#B48344] hover:text-[#916631] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Panduan Saiz (CM)</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                  } = value;

                  const buttonClasses = `min-w-[54px] h-12 px-4 rounded-xl border text-xs font-bold inline-flex items-center justify-center transition-all duration-200 select-none ${
                    selected
                      ? 'bg-[#191817] text-white border-[#191817] shadow-sm ring-2 ring-stone-900/10 scale-[1.02]'
                      : 'bg-white text-[#191817] border-stone-200 hover:border-[#191817] hover:bg-stone-50 active:scale-95'
                  } ${!available ? 'opacity-40 line-through cursor-not-allowed bg-stone-50' : 'cursor-pointer'}`;

                  if (isDifferentProduct) {
                    return (
                      <Link
                        className={buttonClasses}
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                      >
                        {name}
                      </Link>
                    );
                  }

                  return (
                    <button
                      type="button"
                      className={buttonClasses}
                      key={option.name + name}
                      disabled={!exists || !available}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* 2. QUANTITY & SUB-TOTAL MODULE */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#191817]">
            Kuantiti:
          </span>
          <span className="text-[11px] text-[#2B593F] font-semibold flex items-center gap-1.5 bg-[#2B593F]/10 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F] animate-pulse" />
            Stok Tersedia (KL Warehouse)
          </span>
        </div>

        <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-stone-50/80 border border-[#EBE6DF]">
          {/* Stepper Control */}
          <div className="inline-flex items-center bg-white border border-[#EBE6DF] rounded-lg p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Kurangkan kuantiti"
              className="w-9 h-9 rounded-md flex items-center justify-center text-stone-600 hover:text-[#191817] hover:bg-stone-100 disabled:opacity-30 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-10 text-center text-sm font-bold text-[#191817] select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= 10}
              aria-label="Tambah kuantiti"
              className="w-9 h-9 rounded-md flex items-center justify-center text-stone-600 hover:text-[#191817] hover:bg-stone-100 disabled:opacity-30 active:scale-95 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
              Jumlah Pesanan
            </span>
            <span className="text-base font-bold text-[#191817]">
              {currencyCode} {totalPrice}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DUAL ACTION BUTTONS (BELI SEKARANG & TAMBAH KE BEG) */}
      <div className="space-y-3 pt-2">
        {/* Primary CTA: Beli Sekarang (Direct Checkout) */}
        <BuyNowButton
          disabled={!isAvailable}
          onClick={handleBuyNowClick}
          lines={lineItems}
          attributes={attributes}
          className="group w-full h-13 sm:h-14 bg-[#B48344] hover:bg-[#9a6e36] active:scale-[0.98] text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4 fill-white text-white shrink-0 group-hover:scale-110 transition-transform" />
          <span>
            {isAvailable
              ? `Beli Sekarang • ${currencyCode} ${totalPrice}`
              : 'Habis Stok'}
          </span>
        </BuyNowButton>

        {/* Secondary CTA: Tambah ke Beg (Add to Cart Drawer) */}
        <AddToCartButton
          disabled={!isAvailable}
          onClick={handleAddToCartClick}
          lines={lineItems}
          attributes={attributes}
          className="group w-full h-12 bg-white hover:bg-stone-50 active:scale-[0.98] text-[#191817] border-2 border-[#191817] rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="w-4 h-4 text-[#191817] shrink-0 group-hover:scale-110 transition-transform" />
          <span>Tambah ke Beg Belanja</span>
        </AddToCartButton>

        {/* Reassurance Guarantees Cards */}
        <div className="pt-2.5 grid grid-cols-2 gap-2 text-[11px] border-t border-[#EBE6DF]/80 mt-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50/80 border border-[#EBE6DF]/60 text-stone-700">
            <RefreshCw className="w-3.5 h-3.5 text-[#B48344] shrink-0" />
            <span className="font-medium">Tukar Saiz 7 Hari Percuma</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-50/80 border border-[#EBE6DF]/60 text-stone-700">
            <Truck className="w-3.5 h-3.5 text-[#2B593F] shrink-0" />
            <span className="font-medium">Pos Percuma Semenanjung</span>
          </div>
        </div>
      </div>
    </div>
  );
}
