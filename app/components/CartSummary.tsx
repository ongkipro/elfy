import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import {useId} from 'react';
import {trackInitiateCheckout} from '~/lib/tracking';
import {ArrowRight} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();

  return (
    <div aria-labelledby={summaryId} className={className}>
      <div className="space-y-2 pb-3 mb-3 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600">Subtotal</span>
          <span className="text-sm sm:text-base font-bold text-[#191817]">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Penghantaran (Semenanjung)</span>
          <span className="text-[#2B593F] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F]" />
            Percuma
          </span>
        </div>
      </div>

      <CartCheckoutActions
        checkoutUrl={cart?.checkoutUrl}
        totalAmount={parseFloat(cart?.cost?.subtotalAmount?.amount || '0')}
        totalQuantity={cart?.totalQuantity || 1}
      />
    </div>
  );
}

function CartCheckoutActions({
  checkoutUrl,
  totalAmount = 0,
  totalQuantity = 1,
}: {
  checkoutUrl?: string;
  totalAmount?: number;
  totalQuantity?: number;
}) {
  if (!checkoutUrl) return null;

  const resolvedCheckoutUrl = (() => {
    try {
      const url = new URL(checkoutUrl);
      if (url.hostname.includes('myshopify.com') || url.hostname === 'elfy.my') {
        url.hostname = 'checkout.elfy.my';
      }
      return url.toString();
    } catch {
      return checkoutUrl;
    }
  })();

  const handleClick = () => {
    trackInitiateCheckout(totalAmount, totalQuantity);
  };

  return (
    <div className="mt-4 pt-3 border-t border-stone-200">
      <a
        href={resolvedCheckoutUrl}
        target="_self"
        onClick={handleClick}
        className="group w-full h-12 bg-[#191817] hover:bg-[#B48344] active:scale-[0.98] text-white border-2 border-[#191817] hover:border-[#B48344] rounded-xl font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all duration-200 select-none"
      >
        <span className="text-white">Teruskan ke Pembayaran (Checkout)</span>
        <ArrowRight className="w-4 h-4 text-[#B48344] shrink-0 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-200" />
      </a>
    </div>
  );
}
