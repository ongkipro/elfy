import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import {Trash2} from 'lucide-react';
import type {
  CartApiQueryFragment,
  CartLineFragment,
} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * If the line is a parent line that has child components (like warranties or gift wrapping), they are
 * rendered nested below the parent line.
 */
export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  const priceAmount = parseFloat(line?.cost?.totalAmount?.amount || '0');
  const currencyCode = line?.cost?.totalAmount?.currencyCode || 'MYR';

  return (
    <li key={id} className="py-4 border-b border-[#EBE6DF] last:border-b-0">
      <div className="flex gap-3 sm:gap-4 items-start">
        {/* Product Thumbnail */}
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border border-[#EBE6DF] shrink-0 relative">
          {image ? (
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={80}
              width={80}
              loading="lazy"
              className="w-full h-full object-cover object-center brightness-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400 bg-[#FAF9F6]">
              ELFY
            </div>
          )}
        </div>

        {/* Details & Controls */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link
                prefetch="intent"
                to={lineItemUrl}
                onClick={() => {
                  if (layout === 'aside') {
                    close();
                  }
                }}
                className="group"
              >
                <h4 className="text-xs sm:text-sm font-bold text-[#191817] group-hover:text-[#B48344] transition-colors line-clamp-2 leading-tight">
                  {product.title}
                </h4>
              </Link>
              <div className="shrink-0">
                <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
              </div>
            </div>

            {/* Selected Options Pills */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {selectedOptions.map((option) => (
                <span
                  key={option.name}
                  className="inline-flex items-center text-[10px] font-medium bg-stone-100/90 text-stone-600 px-2 py-0.5 rounded-md border border-stone-200/50"
                >
                  <strong className="font-semibold text-stone-700 mr-1">{option.name}:</strong> {option.value}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Row: Price & Quantity Controls */}
          <div className="flex items-center justify-between mt-3 pt-2">
            <div className="text-xs sm:text-sm font-bold text-[#191817]">
              {currencyCode} {priceAmount.toFixed(2)}
            </div>

            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="mt-2 pl-6 border-l-2 border-stone-200">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="space-y-2">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg p-0.5 shadow-2xs">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Kurangkan kuantiti"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-7 h-7 rounded-md flex items-center justify-center text-stone-600 hover:text-[#191817] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent active:scale-90 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="text-sm font-bold leading-none">&#8722;</span>
        </button>
      </CartLineUpdateButton>

      <span className="w-8 text-center text-xs font-bold text-[#191817] select-none">
        {quantity}
      </span>

      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Tambah kuantiti"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-7 h-7 rounded-md flex items-center justify-center text-stone-600 hover:text-[#191817] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent active:scale-90 transition-all cursor-pointer disabled:cursor-not-allowed"
        >
          <span className="text-sm font-bold leading-none">&#43;</span>
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        aria-label="Padam item ini"
        className="w-7 h-7 rounded-lg text-stone-400 hover:text-[#A83232] hover:bg-red-50 active:scale-90 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
