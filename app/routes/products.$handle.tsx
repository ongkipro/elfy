import {redirect, useLoaderData, useFetcher, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {useState, useEffect} from 'react';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
  Image,
  CartForm,
} from '@shopify/hydrogen';
import {ProductForm} from '~/components/ProductForm';
import {SizeRecommenderModal} from '~/components/SizeRecommenderModal';
import {StickyAddToCart} from '~/components/StickyAddToCart';
import {ProductAccordion} from '~/components/ProductAccordion';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {trackViewContent, trackAddToCart, trackInitiateCheckout} from '~/lib/tracking';
import {getAttributionPayload, toCartAttributes} from '~/lib/attribution';
import {
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) {
    return [{title: 'Produk Tidak Ditemui | ELFY'}];
  }

  const title = product.seo?.title || `${product.title} | ELFY Official`;
  const description =
    product.seo?.description ||
    product.description ||
    'Kasut kasual sartorial & jam tangan berkualiti tinggi dari ELFY Malaysia.';
  const canonicalUrl = `https://elfy.my/products/${product.handle}`;
  const imageUrl = product.images?.nodes?.[0]?.url;
  const priceAmount = product.selectedOrFirstAvailableVariant?.price?.amount;
  const currencyCode =
    product.selectedOrFirstAvailableVariant?.price?.currencyCode || 'MYR';

  return [
    {title},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'product'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl
      ? [
          {property: 'og:image', content: imageUrl},
          {name: 'twitter:image', content: imageUrl},
        ]
      : []),
    ...(priceAmount
      ? [
          {property: 'product:price:amount', content: priceAmount},
          {property: 'product:price:currency', content: currencyCode},
        ]
      : []),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const cartFetcher = useFetcher<any>();

  // Redirect to Shopify Checkout if buy now checkoutUrl is returned
  useEffect(() => {
    if (cartFetcher.data?.cart?.checkoutUrl) {
      try {
        const url = new URL(cartFetcher.data.cart.checkoutUrl);
        if (url.hostname.includes('myshopify.com') || url.hostname === 'elfy.my') {
          url.hostname = 'checkout.elfy.my';
        }
        window.location.href = url.toString();
      } catch {
        window.location.href = cartFetcher.data.cart.checkoutUrl;
      }
    }
  }, [cartFetcher.data]);

  const handleStickyAddToCart = () => {
    if (!selectedVariant) return;

    trackAddToCart({
      id: selectedVariant.product.handle,
      title: product.title,
      price: price || parseFloat(selectedVariant.price.amount),
      currency: currencyCode,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
    });

    const attributes =
      typeof window !== 'undefined'
        ? toCartAttributes(getAttributionPayload())
        : undefined;

    cartFetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ],
            attributes,
          },
        }),
      },
      {method: 'POST', action: '/cart'},
    );

    open('cart');
  };

  const handleStickyBuyNow = () => {
    if (!selectedVariant) return;

    const unitPrice = price || parseFloat(selectedVariant.price.amount);
    trackAddToCart({
      id: selectedVariant.product.handle,
      title: product.title,
      price: unitPrice,
      currency: currencyCode,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
    });
    trackInitiateCheckout(unitPrice, 1);

    const attributes =
      typeof window !== 'undefined'
        ? toCartAttributes(getAttributionPayload())
        : undefined;

    cartFetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: selectedVariant.id,
                quantity: 1,
              },
            ],
            attributes,
          },
        }),
        redirectTo: 'checkout',
      },
      {method: 'POST', action: '/cart'},
    );
  };
  const {product} = useLoaderData<typeof loader>();
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const {open} = useAside();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const price = parseFloat(selectedVariant?.price?.amount || '0');
  const compareAt = parseFloat(selectedVariant?.compareAtPrice?.amount || '0');
  const currencyCode = selectedVariant?.price?.currencyCode || 'MYR';
  const hasDiscount = compareAt > price;
  const discountAmount = compareAt - price;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / compareAt) * 100)
    : 0;

  const images = product.images?.nodes?.length
    ? product.images.nodes
    : selectedVariant?.image
    ? [selectedVariant.image]
    : [];

  const sizeOption = productOptions.find(
    (opt) =>
      opt.name.toLowerCase().includes('size') ||
      opt.name.toLowerCase().includes('saiz'),
  );
  const selectedSizeValue = selectedVariant?.selectedOptions?.find(
    (opt) =>
      opt.name.toLowerCase().includes('size') ||
      opt.name.toLowerCase().includes('saiz'),
  )?.value;

  // Signal: Track ViewContent with CAPI event_id deduplication
  useEffect(() => {
    trackViewContent({
      id: product.handle,
      title: product.title,
      price,
      currency: currencyCode,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      category: product.productType,
    });
  }, [product.handle, selectedVariant?.id, price, currencyCode, product.title, product.productType]);

  const handleSelectSizeFromModal = (size: string) => {
    // Locate the matching variant with this size value
    const match = product.options
      ?.find(
        (o) =>
          o.name.toLowerCase().includes('size') ||
          o.name.toLowerCase().includes('saiz'),
      )
      ?.optionValues?.find((v) => v.name.includes(size));

    if (match?.firstSelectableVariant?.id) {
      const url = new URL(window.location.href);
      url.searchParams.set('Size', size);
      window.history.replaceState({}, '', url.toString());
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#191817] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT: 60fps Native CSS Scroll-Snap Gallery */}
          <div className="lg:col-span-7">
            {/* Mobile Horizontal Carousel */}
            <div className="lg:hidden">
              <div className="flex snap-x snap-mandatory overflow-x-auto gap-3 pb-4 no-scrollbar">
                {images.map((img: any, idx: number) => (
                  <div
                    key={img.id || idx}
                    className="snap-center shrink-0 w-[88vw] max-w-[400px] aspect-square rounded-2xl overflow-hidden bg-white border border-[#EBE6DF] shadow-xs relative"
                  >
                    <Image
                      data={img}
                      aspectRatio="1/1"
                      className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.02]"
                      sizes="88vw"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                    {hasDiscount && idx === 0 && (
                      <span className="absolute top-3 left-3 bg-[#A83232] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Diskaun {discountPercent}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-1">
                {images.map((_: any, idx: number) => (
                  <span
                    key={idx}
                    className="w-2 h-2 rounded-full bg-stone-300 first:bg-[#191817]"
                  />
                ))}
              </div>
            </div>

            {/* Desktop Multi-Image Grid */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {images.map((img: any, idx: number) => (
                <div
                  key={img.id || idx}
                  className={`aspect-square rounded-2xl overflow-hidden bg-white border border-[#EBE6DF] shadow-xs relative ${
                    idx === 0 ? 'col-span-2' : 'col-span-1'
                  }`}
                >
                  <Image
                    data={img}
                    aspectRatio="1/1"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 brightness-[1.03] contrast-[1.02]"
                    sizes={idx === 0 ? '50vw' : '25vw'}
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                  {hasDiscount && idx === 0 && (
                    <span className="absolute top-4 left-4 bg-[#A83232] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Diskaun {discountPercent}% • Jimat {currencyCode}{' '}
                      {discountAmount.toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details & Buying Module */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="sticky top-24 space-y-6">
              {/* Product Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B48344]">
                    ELFY Kuala Lumpur
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>4.9 <span className="hidden sm:inline">(128 Ulasan Malaysia)</span><span className="sm:hidden">(128)</span></span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817] leading-tight">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#191817]">
                    {currencyCode} {price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-base text-stone-400 line-through">
                      {currencyCode} {compareAt.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-[#2B593F]/10 text-[#2B593F] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Jimat {discountPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Reassurance Badge */}
              <div className="bg-[#FAF9F6] border border-[#EBE6DF] rounded-xl p-3.5 flex items-center gap-3 text-xs text-stone-700 shadow-2xs">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center shrink-0 shadow-2xs">
                  <Truck className="w-4.5 h-4.5 text-[#B48344]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="font-bold text-[#191817]">
                      Pos Pantas 1-3 Hari Semenanjung
                    </strong>
                    <span className="text-[10px] font-semibold text-[#2B593F] bg-[#2B593F]/10 px-1.5 py-0.5 rounded">
                      Percuma RM150+
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Kurier rasmi J&T Express & Pos Laju terus dari gudang Kuala Lumpur.
                  </p>
                </div>
              </div>

              {/* Buying Form */}
              <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-xs">
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                  onOpenSizeGuide={() => setIsSizeModalOpen(true)}
                  productTitle={product.title}
                  productPrice={price}
                  currencyCode={currencyCode}
                />
              </div>

              {/* Trust Badges */}
              <TrustPaymentBadges variant="compact" />

              {/* Product Accordion (Shipping, Specs, Warranty) */}
              <ProductAccordion
                productType={product.productType || 'Footwear'}
                descriptionHtml={product.descriptionHtml}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <StickyAddToCart
        title={product.title}
        price={price.toFixed(2)}
        currencyCode={currencyCode}
        imageUrl={selectedVariant?.image?.url || images[0]?.url}
        selectedVariant={selectedVariant}
        availableForSale={selectedVariant?.availableForSale}
        hasSizes={Boolean(sizeOption)}
        selectedSize={selectedSizeValue}
        onAddToCart={handleStickyAddToCart}
        onBuyNow={handleStickyBuyNow}
        onOpenSizePicker={() => setIsSizeModalOpen(true)}
      />

      {/* Size Recommender Modal */}
      <SizeRecommenderModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        onSelectSize={handleSelectSizeFromModal}
        selectedSize={selectedSizeValue}
      />

      {/* Hydrogen Built-in ProductView Analytics */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    productType
    descriptionHtml
    description
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;
