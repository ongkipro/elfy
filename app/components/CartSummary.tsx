import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {trackInitiateCheckout} from '~/lib/tracking';
import {ArrowRight, Lock} from 'lucide-react';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

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
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />
      <CartGiftCard
        giftCardCodes={cart?.appliedGiftCards}
        giftCardHeadingId={giftCardHeadingId}
        giftCardInputId={giftCardInputId}
      />
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
      <div className="mt-3">
        <TrustPaymentBadges variant="compact" />
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label="Discounts">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId}>Discounts</dt>
          <UpdateDiscountForm>
            <div
              className="cart-discount"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button
                type="submit"
                aria-label="Remove discount"
                className="text-xs font-semibold text-[#A83232] hover:text-red-700 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor={discountCodeInputId} className="sr-only">
            Discount code
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Kod diskaun..."
            className="flex-1 h-10 px-3 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#191817]"
          />
          <button
            type="submit"
            aria-label="Apply discount code"
            className="h-10 px-4 bg-[#191817] hover:bg-[#B48344] text-white border border-[#191817] hover:border-[#B48344] rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label="Gift cards">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId}>Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id} className="cart-discount">
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <code>***{giftCard.lastCharacters}</code>
                &nbsp;
                <Money data={giftCard.amountUsed} />
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex items-center gap-2 mt-2">
          <label htmlFor={giftCardInputId} className="sr-only">
            Gift card code
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder="Kad hadiah / voucher..."
            ref={giftCardCodeInput}
            className="flex-1 h-10 px-3 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-[#191817]"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            aria-label="Apply gift card code"
            className="h-10 px-4 bg-[#191817] hover:bg-[#B48344] text-white border border-[#191817] hover:border-[#B48344] rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
          >
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      &nbsp;
      <button
        type="submit"
        aria-label={`Remove gift card ending in ${lastCharacters}`}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        Remove
      </button>
    </CartForm>
  );
}
