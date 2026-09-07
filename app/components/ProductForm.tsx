import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';
import {trackAddToCart} from '~/lib/tracking';
import {ShoppingBag, Ruler, Check, Truck} from 'lucide-react';
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

  const handleAddToCartClick = () => {
    if (selectedVariant && productTitle) {
      trackAddToCart({
        id: selectedVariant.product.handle,
        title: productTitle,
        price: productPrice || parseFloat(selectedVariant.price.amount),
        currency: currencyCode,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
      });
    }
    open('cart');
  };

  return (
    <div className="product-form space-y-6">
      {productOptions.map((option) => {
        const isSize =
          option.name.toLowerCase().includes('size') ||
          option.name.toLowerCase().includes('saiz');

        return (
          <div className="space-y-2.5" key={option.name}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#191817]">
                Pilih {option.name}:
              </span>
              {isSize && onOpenSizeGuide && (
                <button
                  type="button"
                  onClick={onOpenSizeGuide}
                  className="text-xs font-semibold text-[#B48344] hover:text-[#916631] flex items-center gap-1 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Panduan Saiz Kaki (CM)</span>
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

                const buttonClasses = `min-w-[50px] h-12 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center justify-center transition-all duration-200 select-none ${
                  selected
                    ? 'bg-[#191817] text-white border-[#191817] shadow-sm ring-2 ring-stone-900/10'
                    : 'bg-white text-[#191817] border-stone-200 hover:border-[#191817] hover:bg-[#191817] hover:text-white active:scale-95'
                } ${!available ? 'opacity-40 line-through cursor-not-allowed' : 'cursor-pointer'}`;

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

      {/* Add To Cart Button */}
      <div className="pt-2">
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={handleAddToCartClick}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
          attributes={
            typeof window !== 'undefined'
              ? toCartAttributes(getAttributionPayload())
              : undefined
          }
          className="group w-full h-14 bg-[#191817] hover:bg-[#B48344] active:scale-[0.98] text-white border-2 border-[#191817] hover:border-[#B48344] rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all duration-200 select-none"
        >
          <ShoppingBag className="w-4 h-4 text-[#B48344] shrink-0 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
          <span className="text-white">
            {selectedVariant?.availableForSale
              ? `Tambah ke Beg • ${currencyCode} ${parseFloat(
                  selectedVariant.price.amount,
                ).toFixed(2)}`
              : 'Habis Stok'}
          </span>
        </AddToCartButton>

        {/* Micro Reassurance */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <Truck className="w-3.5 h-3.5 text-[#2B593F]" />
          <span>Penghantaran Percuma Semenanjung untuk pesanan ini</span>
        </div>
      </div>
    </div>
  );
}
