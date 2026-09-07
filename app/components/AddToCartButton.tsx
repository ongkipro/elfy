import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  attributes,
  onClick,
  className,
  wrapperClassName = 'flex-1 min-w-0',
}: {
  analytics?: unknown;
  children:
    | React.ReactNode
    | ((fetcher: FetcherWithComponents<unknown>) => React.ReactNode);
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
        {(fetcher: FetcherWithComponents<unknown>) => (
          <>
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? fetcher.state !== 'idle'}
              className={className}
            >
              {typeof children === 'function' ? children(fetcher) : children}
            </button>
          </>
        )}
      </CartForm>
    </div>
  );
}
