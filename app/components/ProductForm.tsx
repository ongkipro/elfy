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
            option.name.toLowerCase().includes('saiz') ||
            option.name.toLowerCase().includes('ukuran');

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

                  const buttonClasses = `min-w-[50px] h-11 px-3.5 rounded-lg border text-xs font-medium inline-flex items-center justify-center transition-all duration-200 select-none ${
                    selected
                      ? 'bg-[#191817] text-white border-[#191817] shadow-2xs'
                      : 'bg-white text-[#191817] border-stone-200 hover:border-[#191817] hover:bg-stone-50/70'
                  } ${!available ? 'opacity-35 line-through cursor-not-allowed bg-stone-50' : 'cursor-pointer'}`;

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

      {/* 2. UNIFIED ACTION MODULE: [Quantity] [Tambah ke Beg] + [Beli Sekarang] */}
      <div className="pt-2 border-t border-stone-200/80 space-y-2.5">
        {/* Availability Micro-Status (Zero Price Clutter) */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium uppercase tracking-[0.14em] text-stone-500">
            Kuantiti &amp; Beg
          </span>
          <span className="text-[11px] text-[#2B593F] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F]" />
            Stok Tersedia (KL Warehouse)
          </span>
        </div>

        {/* Row 1: [ Quantity Stepper ] + [ Tambah ke Beg ] */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Stepper Kuantiti (Compact & Precision Height h-12) */}
          <div className="inline-flex items-center border border-stone-300/80 rounded-lg h-12 px-1 bg-white shrink-0">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              aria-label="Kurangkan kuantiti"
              className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-[#191817] hover:bg-stone-100/70 rounded-md disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer disabled:cursor-not-allowed active:scale-90"
            >
              <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            <span className="w-9 text-center text-xs font-semibold text-[#191817] select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={increaseQuantity}
              disabled={quantity >= 10}
              aria-label="Tambah kuantiti"
              className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-[#191817] hover:bg-stone-100/70 rounded-md disabled:opacity-20 disabled:hover:bg-transparent transition-all duration-150 cursor-pointer disabled:cursor-not-allowed active:scale-90"
            >
              <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          </div>

          {/* Secondary CTA: Tambah ke Beg (Fills Remaining Space) */}
          <AddToCartButton
            disabled={!isAvailable}
            onClick={handleAddToCartClick}
            lines={lineItems}
            attributes={attributes}
            wrapperClassName="flex-1 min-w-0"
            className="group w-full h-12 bg-white hover:bg-stone-50/80 hover:border-[#191817] active:scale-[0.985] text-[#191817] border border-stone-300 rounded-lg font-medium text-xs uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {(fetcher) => {
              const isSubmitting = fetcher.state !== 'idle';
              return (
                <>
                  <ShoppingBag className="w-4 h-4 stroke-[1.5] text-[#191817] group-hover:scale-105 transition-transform duration-200 shrink-0" />
                  <span>{isSubmitting ? 'Menambah...' : 'Tambah ke Beg'}</span>
                </>
              );
            }}
          </AddToCartButton>
        </div>

        {/* Row 2: Beli Sekarang (Direct Checkout - Solid Luxury Black) */}
        <BuyNowButton
          disabled={!isAvailable}
          onClick={handleBuyNowClick}
          lines={lineItems}
          attributes={attributes}
          className="group w-full h-12 bg-[#191817] hover:bg-stone-800 active:scale-[0.985] text-white rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <Zap className="w-3.5 h-3.5 stroke-[1.5] fill-white text-white shrink-0 group-hover:scale-110 transition-transform duration-200" />
          <span>{isAvailable ? 'Beli Sekarang' : 'Habis Stok'}</span>
        </BuyNowButton>

        {/* Minimal Reassurance Micro-Row (No Boxes, Clean SVG) */}
        <div className="pt-2 flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 stroke-[1.5] text-stone-400 shrink-0" />
            <span>Tukar Saiz 7 Hari Percuma</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 stroke-[1.5] text-stone-400 shrink-0" />
            <span>Pos Percuma Semenanjung</span>
          </span>
        </div>
      </div>
    </div>
  );
}
