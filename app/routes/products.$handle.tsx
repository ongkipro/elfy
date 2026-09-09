import {redirect, useLoaderData, useFetcher, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {useState, useEffect, useRef} from 'react';
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
import {ProductItem} from '~/components/ProductItem';
import {SizeRecommenderModal} from '~/components/SizeRecommenderModal';
import {StickyAddToCart} from '~/components/StickyAddToCart';
import {ProductAccordion} from '~/components/ProductAccordion';
import {Breadcrumb} from '~/components/Breadcrumb';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {trackViewContent, trackAddToCart, trackInitiateCheckout} from '~/lib/tracking';
import {getAttributionPayload, toCartAttributes} from '~/lib/attribution';
import {getProductSeo} from '~/lib/seo-catalog';
import {
  Star,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';

export const meta: Route.MetaFunction = ({data}) => {
  const product = data?.product;
  if (!product) {
    return [{title: 'Produk Tidak Ditemui - ELFY'}];
  }

  const seo = getProductSeo(product.handle, {
    title: product.title,
    seoTitle: product.seo?.title,
    description: product.seo?.description || product.description,
  });

  const title = seo.seoTitle;
  const description = seo.seoDescription;
  const canonicalUrl = `https://elfy.my/products/${product.handle}`;
  const imageUrl = product.featuredImage?.url || product.images?.nodes?.[0]?.url;
  const priceAmount = product.selectedOrFirstAvailableVariant?.price?.amount;
  const currencyCode =
    product.selectedOrFirstAvailableVariant?.price?.currencyCode || 'MYR';

  const effectiveImageUrl = imageUrl || 'https://elfy.my/hero-desktop.webp';

  return [
    {title},
    {name: 'description', content: description},
    {name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'product'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    {property: 'og:image', content: effectiveImageUrl},
    {property: 'og:image:alt', content: title},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: effectiveImageUrl},
    ...(priceAmount
      ? [
          {property: 'product:price:amount', content: priceAmount},
          {property: 'product:price:currency', content: currencyCode},
        ]
      : []),
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

  // Resolve primary collection for related products (random 4 products from same collection)
  const primaryCol = (product as any)?.collections?.nodes?.find(
    (c: any) =>
      c &&
      c.handle !== 'frontpage' &&
      c.handle !== 'best-sellers' &&
      c.handle !== 'new-arrivals' &&
      c.handle !== 'all',
  ) || (product as any)?.collections?.nodes?.find(
    (c: any) => c && c.handle !== 'frontpage',
  );

  const rawCandidates = ((primaryCol as any)?.products?.nodes || [])
    .filter((p: any) => p && p.id !== product.id && p.handle !== product.handle);

  // Fisher-Yates shuffle to randomize products from this collection
  const shuffledCandidates = [...rawCandidates];
  for (let i = shuffledCandidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledCandidates[i], shuffledCandidates[j]] = [shuffledCandidates[j], shuffledCandidates[i]];
  }
  const relatedProducts = shuffledCandidates.slice(0, 4);

  return {
    product,
    relatedProducts,
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
                selectedVariant,
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
                selectedVariant,
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
  const {product, relatedProducts: loaderRelated = []} = useLoaderData<typeof loader>();
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const {open} = useAside();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Check if product is non-variant or single default variant
  const isDefaultOrSingleVariant =
    !selectedVariant ||
    selectedVariant.title === 'Default Title' ||
    selectedVariant.selectedOptions.every(
      (opt: any) =>
        opt.name.toLowerCase() === 'title' ||
        opt.value.toLowerCase() === 'default title',
    );

  // Only pass meaningful options (e.g. Size, Color) to URL sync
  const realSelectedOptions = isDefaultOrSingleVariant
    ? []
    : selectedVariant.selectedOptions.filter(
        (opt: any) =>
          opt.name.toLowerCase() !== 'title' &&
          opt.value.toLowerCase() !== 'default title',
      );

  useSelectedOptionInUrlParam(realSelectedOptions);

  // Strip ?Title=Default+Title from address bar if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentParams = new URLSearchParams(window.location.search);
    let dirty = false;

    if (currentParams.has('Title')) {
      currentParams.delete('Title');
      dirty = true;
    }
    if (currentParams.has('title')) {
      currentParams.delete('title');
      dirty = true;
    }

    if (isDefaultOrSingleVariant) {
      for (const opt of selectedVariant?.selectedOptions || []) {
        if (currentParams.has(opt.name)) {
          currentParams.delete(opt.name);
          dirty = true;
        }
      }
    }

    if (dirty) {
      const remainingSearch = currentParams.toString();
      const cleanPath = remainingSearch
        ? `${window.location.pathname}?${remainingSearch}`
        : window.location.pathname;
      window.history.replaceState({}, '', cleanPath);
    }
  }, [isDefaultOrSingleVariant, selectedVariant]);

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

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const mobileGalleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 380);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileGalleryScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!el || !el.firstElementChild) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.firstElementChild.clientWidth + 12; // 12px gap-3
    const index = Math.round(scrollLeft / itemWidth);
    if (index >= 0 && index < images.length && index !== activeImageIndex) {
      setActiveImageIndex(index);
    }
  };

  const scrollToMobileImage = (idx: number) => {
    if (!mobileGalleryRef.current) return;
    const container = mobileGalleryRef.current;
    const targetChild = container.children[idx] as HTMLElement | undefined;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
      setActiveImageIndex(idx);
    }
  };

  const isSizeName = (name: string) => {
    const n = name.toLowerCase();
    return n.includes('size') || n.includes('saiz') || n.includes('ukuran');
  };

  const sizeOption = productOptions.find((opt: any) => isSizeName(opt.name));
  const selectedSizeValue = selectedVariant?.selectedOptions?.find((opt: any) =>
    isSizeName(opt.name),
  )?.value;

  const seo = getProductSeo(product.handle, {
    title: product.title,
    seoTitle: product.seo?.title,
    description: product.seo?.description || product.description,
  });
  const displayTitle = seo.brandedTitle;

  const isWatch =
    (product.productType || '').toLowerCase().includes('watch') ||
    product.handle.includes('jam-tangan') ||
    product.handle.includes('c27');
  const isWomenWatch = product.handle.includes('jam-tangan-wanita');

  const primaryCollection = (product as any)?.collections?.nodes?.find(
    (c: any) =>
      c &&
      c.handle !== 'frontpage' &&
      c.handle !== 'best-sellers' &&
      c.handle !== 'new-arrivals',
  ) || (product as any)?.collections?.nodes?.find(
    (c: any) => c && c.handle !== 'frontpage',
  );

  const fallbackCollection = {
    title: isWomenWatch
      ? "Women's Elegant Quartz Watches"
      : isWatch
      ? "Men's Luxury Analog & Quartz Watches"
      : "Men's Performance & Casual Sneakers",
    handle: isWomenWatch
      ? 'womens-watches'
      : isWatch
      ? 'mens-watches'
      : 'mens-sneakers',
    description: isWomenWatch
      ? 'Koleksi jam tangan wanita ELFY dengan siluet anggun dan rekaan kontemporari. Sedia pos dari Kuala Lumpur dengan jaminan rasmi 1 tahun.'
      : isWatch
      ? 'Jam tangan analog quartz dan chronograph eksekutif ELFY. Kemasan keluli tahan karat tahan calar, enjin jitu, dan kotak hadiah percuma. Dilengkapi waranti 1 tahun & penghantaran pantas 1-3 hari.'
      : 'Koleksi sneakers kasual lelaki ELFY menggabungkan kusyen tapak berdaya tahan tinggi dan fabrik bernafas untuk keselesaan harian. Sedia pos seluruh Malaysia dengan jaminan tukar saiz 7 hari & pilihan COD.',
    image: {
      url: isWomenWatch
        ? '/banners/womens-watches-3x2.webp'
        : isWatch
        ? '/banners/mens-watches-3x2.webp'
        : '/banners/mens-sneakers-3x2.webp',
      altText: 'Koleksi Rasmi ELFY',
    },
  };

  const activeCollection = primaryCollection || fallbackCollection;

  // 4 random products from this collection (from loader or safe fallback)
  const relatedProducts =
    loaderRelated && loaderRelated.length > 0
      ? loaderRelated
      : ((activeCollection as any)?.products?.nodes || [])
          .filter((p: any) => p && p.id !== product.id && p.handle !== product.handle)
          .slice(0, 4);

  // Signal: Track ViewContent with CAPI event_id deduplication
  useEffect(() => {
    trackViewContent({
      id: product.handle,
      title: displayTitle,
      price,
      currency: currencyCode,
      variantId: selectedVariant?.id,
      variantTitle: selectedVariant?.title,
      category: product.productType,
    });
  }, [product.handle, selectedVariant?.id, price, currencyCode, displayTitle, product.productType]);

  const handleSelectSizeFromModal = (size: string) => {
    // Locate the matching variant with this size value
    const matchedOption = product.options?.find((o: any) => isSizeName(o.name));
    const match = matchedOption?.optionValues?.find((v: any) => v.name.includes(size));

    if (match?.firstSelectableVariant?.id && matchedOption) {
      const url = new URL(window.location.href);
      url.searchParams.set(matchedOption.name, size);
      window.history.replaceState({}, '', url.toString());
      window.location.reload();
    }
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle,
    description: seo.seoDescription,
    image: images.map((img: any) => img.url),
    brand: {
      '@type': 'Brand',
      name: product.vendor || 'ELFY',
    },
    sku: selectedVariant?.sku || product.handle,
    offers: {
      '@type': 'Offer',
      url: `https://elfy.my/products/${product.handle}`,
      priceCurrency: currencyCode,
      price: price,
      availability: selectedVariant?.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'ELFY',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817]">
      {/* Google Rich Results Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(productSchema)}}
      />

      {/* Breadcrumb Navigation: [Home Icon] > [Nama Koleksi] > [Judul Produk] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <Breadcrumb
          items={[
            {label: 'Utama', to: '/'},
            {label: activeCollection.title, to: `/collections/${activeCollection.handle}`},
            {label: displayTitle},
          ]}
          currentUrl={`https://elfy.my/products/${product.handle}`}
        />
      </div>

      {/* Main PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
          {/* LEFT: 60fps Native CSS Scroll-Snap Gallery */}
          <div className="lg:col-span-7">
            {/* Mobile Horizontal Carousel */}
            <div className="lg:hidden relative">
              <div
                ref={mobileGalleryRef}
                onScroll={handleMobileGalleryScroll}
                className="flex snap-x snap-mandatory overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
              >
                {images.map((img: any, idx: number) => (
                  <div
                    key={img.id || idx}
                    className="snap-center shrink-0 w-[88vw] max-w-[420px] aspect-square rounded-2xl overflow-hidden bg-white border border-[#EBE6DF] shadow-xs relative"
                  >
                    <Image
                      data={img}
                      aspectRatio="1/1"
                      className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.02]"
                      sizes="(max-width: 480px) 88vw, 420px"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      decoding={idx === 0 ? 'sync' : 'async'}
                    />
                    {hasDiscount && idx === 0 && (
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-700 text-[10px] font-semibold px-2 py-0.5 rounded-xs uppercase tracking-[0.16em] shadow-2xs pointer-events-none">
                        Sale
                      </span>
                    )}
                    {/* Floating Image Counter (e.g. 1 / 6) */}
                    {images.length > 1 && (
                      <span className="absolute bottom-3 right-3 bg-black/55 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full select-none tracking-wider pointer-events-none">
                        {idx + 1} / {images.length}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Scroll-Tracking Indicator Dots with Accessible Hitbox */}
              {images.length > 1 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  {images.map((_: any, idx: number) => {
                    const isActive = idx === activeImageIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => scrollToMobileImage(idx)}
                        aria-label={`Lihat foto ${idx + 1} daripada ${images.length}`}
                        className="h-7 px-1 flex items-center justify-center cursor-pointer"
                      >
                        <span
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive
                              ? 'w-6 bg-[#191817]'
                              : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Desktop 2-Column Multi-Image Grid (Balanced 2-Column Precision) */}
            <div className="hidden lg:grid grid-cols-2 gap-3.5 sm:gap-4">
              {images.map((img: any, idx: number) => (
                <div
                  key={img.id || idx}
                  className={`aspect-square rounded-xl overflow-hidden bg-[#F5F4F0] border border-[#EBE6DF]/70 relative ${
                    images.length === 1 ? 'col-span-2' : 'col-span-1'
                  }`}
                >
                  <Image
                    data={img}
                    aspectRatio="1/1"
                    className="w-full h-full object-cover object-center hover:scale-[1.025] transition-transform duration-700 ease-out brightness-[1.01] contrast-[1.01]"
                    sizes="(min-width: 1024px) 28vw, 50vw"
                    loading="lazy"
                    fetchPriority="auto"
                    decoding="async"
                  />
                  {hasDiscount && idx === 0 && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-stone-700 text-[10px] font-semibold px-2.5 py-1 rounded-xs uppercase tracking-[0.16em] shadow-2xs pointer-events-none">
                      Sale
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
                    <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                    <span>4.9 <span className="hidden sm:inline">(128 Ulasan Malaysia)</span><span className="sm:hidden">(128)</span></span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817] leading-tight">
                  {displayTitle}
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
                    <span className="text-xs font-medium text-[#2B593F] tracking-tight">
                      (Jimat {discountPercent}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Buying Form (Frameless Luxury Layout) */}
              <div className="pt-1">
                <ProductForm
                  productOptions={productOptions}
                  selectedVariant={selectedVariant}
                  onOpenSizeGuide={() => setIsSizeModalOpen(true)}
                  productTitle={displayTitle}
                  productPrice={price}
                  currencyCode={currencyCode}
                />
              </div>

              {/* Product Accordion (Shipping, Specs, Warranty) */}
              <ProductAccordion
                productType={product.productType || 'Footwear'}
                descriptionHtml={product.descriptionHtml}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Related Products (4 Produk Aja — Random Sesuai Koleksi) */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 pb-20 sm:pb-16">
          <div className="flex items-end justify-between gap-3 pb-3.5 sm:pb-4 border-b border-[#EBE6DF]">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#191817]">
                Produk Berkaitan
              </h2>
            </div>

            <Link
              to={`/collections/${activeCollection.handle}`}
              className="group inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-stone-700 hover:text-[#B48344] transition-colors shrink-0 pb-0.5"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 pt-5 sm:pt-6">
            {relatedProducts.map((relProduct: any) => (
              <ProductItem key={relProduct.id} product={relProduct as any} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Add to Cart for Mobile (Smooth Slide-Up on Scroll) */}
      <StickyAddToCart
        title={displayTitle}
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
        visible={showSticky}
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
              title: displayTitle,
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
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 8) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    collections(first: 5) {
      nodes {
        id
        title
        handle
        description
        image {
          id
          url
          altText
          width
          height
        }
        products(first: 20) {
          nodes {
            id
            handle
            title
            productType
            featuredImage {
              id
              altText
              url
              width
              height
            }
            images(first: 2) {
              nodes {
                id
                altText
                url
                width
                height
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
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
