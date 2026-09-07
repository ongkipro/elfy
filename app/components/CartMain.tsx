import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {FreeShippingBar} from '~/components/FreeShippingBar';
import {
  ShoppingBag,
  ShieldCheck,
  RefreshCw,
  Truck,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
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
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const subtotalAmount = parseFloat(cart?.cost?.subtotalAmount?.amount || '0');
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'MYR';

  // Empty state
  if (!linesCount || !cartHasItems) {
    return <CartEmpty layout={layout} />;
  }

  // Standalone Page Layout (Full-Width 2-Column Responsive Layout)
  if (layout === 'page') {
    return (
      <div className="space-y-8" aria-label="Cart page">
        <CartAttributionSync attributes={cart?.attributes} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Line Items & Reassurance */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Free Shipping Progress Indicator */}
            <FreeShippingBar
              subtotalAmount={subtotalAmount}
              currencyCode={currencyCode}
            />

            {/* Products Box */}
            <div className="bg-white rounded-2xl border border-[#EBE6DF] p-4 sm:p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#EBE6DF]">
                <h3 className="font-bold text-sm sm:text-base text-[#191817]">
                  Item Pesanan ({cart.totalQuantity})
                </h3>
                <Link
                  to="/collections/all"
                  className="text-xs font-semibold text-[#B48344] hover:text-[#916631] transition-colors"
                >
                  + Tambah Produk Lain
                </Link>
              </div>

              <ul className="divide-y divide-[#EBE6DF]">
                {(cart?.lines?.nodes ?? []).map((line) => {
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

            {/* Trust Assurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#EBE6DF] flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-[#B48344] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#191817]">
                    Tukar Saiz 7 Hari
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Percuma jika saiz tak muat
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#EBE6DF] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#B48344] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#191817]">
                    100% Produk Tulen
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    Jaminan kualiti rasmi
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-[#EBE6DF] flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#2B593F] shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-[#191817]">
                    Pos Laju Pantas
                  </h5>
                  <p className="text-[11px] text-stone-500">
                    1-3 hari sampai pintu
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Card (Sticky) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white rounded-2xl border border-[#EBE6DF] p-6 shadow-2xs space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#191817] pb-3 border-b border-[#EBE6DF]">
                Ringkasan Pesanan
              </h3>
              <CartSummary cart={cart} layout={layout} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Aside Drawer Layout (Compact for Side Panel)
  return (
    <section className="cart-main" aria-label="Cart drawer">
      <CartAttributionSync attributes={cart?.attributes} />
      <div className="cart-details">
        <FreeShippingBar
          subtotalAmount={subtotalAmount}
          currencyCode={currencyCode}
        />
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div className="px-5 sm:px-6">
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
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
        <CartSummary cart={cart} layout={layout} />
      </div>
    </section>
  );
}

function CartEmpty({layout = 'aside'}: {layout?: CartLayout}) {
  const {close} = useAside();

  if (layout === 'page') {
    return (
      <div className="bg-white rounded-2xl border border-[#EBE6DF] p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-2xs">
        <div className="w-18 h-18 rounded-full bg-stone-100/90 border border-stone-200 flex items-center justify-center mx-auto mb-5 text-[#B48344]">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#191817] mb-2">
          Beg Belanja Anda Masih Kosong
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
          Kelihatan anda belum menambah sebarang kasut kasual atau jam tangan. Jom terokai katalog pilihan kami untuk gaya hidup moden Malaysia.
        </p>

        {/* Quick Collection Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 text-left">
          <Link
            to="/collections/mens-sneakers"
            className="group p-4 rounded-xl border border-[#EBE6DF] hover:border-[#B48344] bg-[#FAF9F6] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#191817] group-hover:text-[#B48344] transition-colors block">
                Kasut Kasual
              </span>
              <span className="text-[11px] text-stone-500">Saiz 39-44</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/collections/mens-watches"
            className="group p-4 rounded-xl border border-[#EBE6DF] hover:border-[#B48344] bg-[#FAF9F6] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#191817] group-hover:text-[#B48344] transition-colors block">
                Jam Tangan Lelaki
              </span>
              <span className="text-[11px] text-stone-500">Keluli & Kulit</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            to="/collections/best-sellers"
            className="group p-4 rounded-xl border border-[#EBE6DF] hover:border-[#B48344] bg-[#FAF9F6] transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-bold text-[#191817] group-hover:text-[#B48344] transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#B48344]" /> Best Sellers
              </span>
              <span className="text-[11px] text-stone-500">Paling Laris</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <Link
          to="/collections/all"
          className="inline-flex items-center justify-center h-12 px-8 bg-[#191817] hover:bg-[#B48344] text-white rounded-xl text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shadow-sm hover:shadow-md"
        >
          Lihat Semua Koleksi ELFY &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-12 px-4">
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
        Lihat Koleksi Best Sellers &rarr;
      </Link>
    </div>
  );
}
