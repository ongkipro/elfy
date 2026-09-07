import {useEffect} from 'react';
import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function BuyNowButton({
  analytics,
  children,
  disabled,
  lines,
  attributes,
  onClick,
  className,
  wrapperClassName = 'w-full',
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  attributes?: Array<{key: string; value: string}>;
  onClick?: () => void;
  className?: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`[&>form]:w-full ${wrapperClassName}`}>
      <CartForm
        route="/cart"
        inputs={{lines, attributes}}
        action={CartForm.ACTIONS.LinesAdd}
      >
        {(fetcher: FetcherWithComponents<any>) => {
          // Fallback client-side navigation if fetcher handles the response
          useEffect(() => {
            if (fetcher.data?.cart?.checkoutUrl) {
              try {
                const url = new URL(fetcher.data.cart.checkoutUrl);
                if (url.hostname.includes('myshopify.com') || url.hostname === 'elfy.my') {
                  url.hostname = 'checkout.elfy.my';
                }
                window.location.href = url.toString();
              } catch {
                window.location.href = fetcher.data.cart.checkoutUrl;
              }
            }
          }, [fetcher.data]);

          const isLoading = fetcher.state !== 'idle';

          return (
            <>
              <input
                name="analytics"
                type="hidden"
                value={JSON.stringify(analytics)}
              />
              {/* Tells /cart action to 303 redirect immediately to Shopify Checkout */}
              <input type="hidden" name="redirectTo" value="checkout" />
              <button
                type="submit"
                onClick={onClick}
                disabled={disabled || isLoading}
                className={className}
              >
                {children}
              </button>
            </>
          );
        }}
      </CartForm>
    </div>
  );
}
