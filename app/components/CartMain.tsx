import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from '~/components/FreeShippingBar';
import {ShoppingBag} from 'lucide-react';
import {CartAttributionSync} from '~/components/CartAttributionSync';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};
/** Returns a map of all line items and their children. */
function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      {cartHasItems && <CartAttributionSync attributes={cart?.attributes} />}
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        {cartHasItems && (
          <FreeShippingBar
            subtotalAmount={parseFloat(cart?.cost?.subtotalAmount?.amount || '0')}
            currencyCode={cart?.cost?.subtotalAmount?.currencyCode || 'MYR'}
          />
        )}
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div className="px-5 sm:px-6">
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              // we do not render non-parent lines at the root of the cart
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="text-center py-12 px-4">
      <div className="w-16 h-16 rounded-2xl bg-stone-100/80 border border-stone-200/60 flex items-center justify-center mx-auto mb-4 text-[#B48344]">
        <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-semibold text-base text-[#191817] mb-1">
        Beg Anda Masih Kosong
      </h3>
      <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6 leading-relaxed">
        Jom terokai koleksi kasut kasual sartorial dan jam tangan berkualiti tinggi dari ELFY.
      </p>
      <Link
        to="/collections/best-sellers"
        onClick={close}
        prefetch="viewport"
        className="inline-flex items-center justify-center h-11 px-6 bg-[#191817] hover:bg-[#B48344] text-white border border-[#191817] hover:border-[#B48344] text-xs font-semibold rounded-xl active:scale-95 transition-all shadow-xs hover:shadow-md"
      >
        Lihat Koleksi Best Sellers →
      </Link>
    </div>
  );
}
