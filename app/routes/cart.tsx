import {useLoaderData, data, type HeadersFunction, Link} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {AttributeInput} from '@shopify/hydrogen/storefront-api-types';
import {CartMain} from '~/components/CartMain';
import {ChevronLeft} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  return [
    {title: `Beg Belanja | ELFY Kuala Lumpur`},
    {
      name: 'description',
      content:
        'Semak beg belanja dan teruskan ke pembayaran selamat rasmi ELFY.',
    },
  ];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      if (inputs.attributes && Array.isArray(inputs.attributes) && inputs.attributes.length > 0) {
        result = await cart.updateAttributes(inputs.attributes as AttributeInput[]);
      }
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;

      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    case CartForm.ACTIONS.AttributesUpdateInput: {
      result = await cart.updateAttributes(inputs.attributes as AttributeInput[]);
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  let targetUrl: string | null = null;
  if (redirectTo === 'checkout' && cartResult?.checkoutUrl) {
    targetUrl = cartResult.checkoutUrl;
  } else if (typeof redirectTo === 'string') {
    targetUrl = redirectTo;
  }

  if (targetUrl) {
    status = 303;
    try {
      const parsed = new URL(targetUrl);
      if (parsed.hostname.includes('myshopify.com') || parsed.hostname === 'elfy.my') {
        parsed.hostname = 'checkout.elfy.my';
      }
      targetUrl = parsed.toString();
    } catch {
      // Keep original targetUrl
    }
    headers.set('Location', targetUrl);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#191817] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sambung Membeli-belah</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-[#EBE6DF] pb-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B48344] block mb-1">
              Pesanan Anda
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#191817]">
              Beg Belanja
            </h1>
          </div>
          {cart?.totalQuantity ? (
            <span className="text-xs text-stone-500 font-medium">
              Jumlah:{' '}
              <strong className="text-[#191817] font-bold">
                {cart.totalQuantity} item
              </strong>
            </span>
          ) : null}
        </div>

        {/* Cart Main Content */}
        <CartMain layout="page" cart={cart} />
      </div>
    </div>
  );
}
