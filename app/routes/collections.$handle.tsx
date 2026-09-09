import {redirect, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {CategoryPills} from '~/components/CategoryPills';
import {
  CollectionHeroDescription,
  CollectionHighlightsBar,
  CollectionAssurancePillars,
} from '~/components/CollectionDescription';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {Truck, RefreshCw, ShieldCheck} from 'lucide-react';
import {getShopifyImageUrl, getShopifyImageSrcSet} from '~/lib/image';
import {Breadcrumb} from '~/components/Breadcrumb';
import {getCollectionSeo} from '~/lib/seo-catalog';

export const meta: Route.MetaFunction = ({data}) => {
  const collection = data?.collection;
  if (!collection) {
    return [{title: 'Koleksi Tidak Ditemui - ELFY'}];
  }

  const seo = getCollectionSeo(collection.handle, {
    title: collection.title,
    seoTitle: collection.seo?.title,
    description: collection.seo?.description || collection.description,
  });

  const title = seo.title;
  const description = seo.description;
  const canonicalUrl = `https://elfy.my/collections/${collection.handle}`;
  const imageUrl = collection.image?.url;

  return [
    {title},
    {name: 'description', content: description},
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl
      ? [
          {property: 'og:image', content: imageUrl},
          {property: 'og:image:alt', content: title},
          {name: 'twitter:image', content: imageUrl},
        ]
      : [
          {property: 'og:image', content: 'https://elfy.my/hero-desktop.webp'},
          {property: 'og:image:width', content: '1200'},
          {property: 'og:image:height', content: '630'},
          {property: 'og:image:alt', content: title},
          {name: 'twitter:image', content: 'https://elfy.my/hero-desktop.webp'},
        ]),
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 24,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      cache: storefront.CacheShort(),
      variables: {handle, ...paginationVariables},
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const heroBgImage =
    collection.image?.url ||
    (collection.products?.nodes as any[])?.[0]?.featuredImage?.url;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.title,
    description: collection.description || undefined,
    url: `https://elfy.my/collections/${collection.handle}`,
    ...(collection.products?.nodes?.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: collection.products.nodes.map(
              (product: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `https://elfy.my/products/${product.handle}`,
                name: product.title,
              }),
            ),
          },
        }
      : {}),
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(collectionSchema)}}
      />
      {/* Full-Bleed Cinematic Collection Hero: Background = Collection Featured Image */}
      <section className="relative w-full overflow-hidden bg-stone-950 text-white min-h-[360px] sm:min-h-[460px] lg:min-h-[500px] flex flex-col justify-between border-b border-[#2A2724]">
        {/* Background Featured Image from Shopify */}
        {heroBgImage && (
          <img
            src={getShopifyImageUrl(heroBgImage, {width: 1600, format: 'webp'})}
            srcSet={getShopifyImageSrcSet(heroBgImage, [480, 768, 1024, 1440, 1920])}
            sizes="100vw"
            alt={collection.image?.altText || collection.title}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.50] sm:brightness-[0.55] transition-transform duration-1000 scale-[1.01]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
          />
        )}

        {/* Cinematic Vignette & High-Contrast Readability Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151413] via-black/45 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

        {/* Top: Breadcrumb Navigation */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
          <Breadcrumb
            items={[
              {label: 'Utama', to: '/'},
              {label: 'Semua Koleksi', to: '/collections/all'},
              {label: collection.title},
            ]}
            currentUrl={`https://elfy.my/collections/${collection.handle}`}
            theme="light"
          />
        </div>

        {/* Center/Bottom: Editorial Typography & Quick Switcher */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-14 sm:pb-12 text-center flex flex-col items-center">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-2 sm:mb-3 drop-shadow-xs">
            Koleksi Rasmi ELFY • Kuala Lumpur
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl drop-shadow-md">
            {collection.title}
          </h1>

          {collection.description && (
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xs">
              {collection.description}
            </p>
          )}

          {/* Quick Category Switcher Pills */}
          <div className="mt-6 sm:mt-8 w-full">
            <CategoryPills activeHandle={collection.handle} theme="light" />
          </div>
        </div>
      </section>

      {/* Assurance Pillars */}
      <CollectionAssurancePillars />

      {/* Main Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EBE6DF] text-xs text-stone-500">
          <span>Menunjukkan koleksi produk berkualiti tinggi</span>
          <span className="font-semibold text-[#191817]">
            {collection.products?.nodes?.length || 0} Produk Sedia Pos
          </span>
        </div>

        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>

        {/* Bottom Trust Row */}
        <div className="mt-16">
          <TrustPaymentBadges variant="full" />
        </div>
      </div>

      {/* Analytics Collection View */}
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      seo {
        description
        title
      }
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
