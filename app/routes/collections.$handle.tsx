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
} from '~/components/CollectionDescription';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {Truck, RefreshCw, ShieldCheck} from 'lucide-react';
import {Breadcrumb} from '~/components/Breadcrumb';

export const meta: Route.MetaFunction = ({data}) => {
  const collection = data?.collection;
  if (!collection) {
    return [{title: 'Koleksi Tidak Ditemui | ELFY'}];
  }

  const title =
    collection.seo?.title || `${collection.title} | ELFY Official`;
  const description =
    collection.seo?.description ||
    collection.description ||
    'Terokai koleksi kasut kasual kulit asli & jam tangan sartorial dari ELFY Malaysia.';
  const canonicalUrl = `https://elfy.my/collections/${collection.handle}`;
  const imageUrl = collection.image?.url;

  return [
    {title},
    {name: 'description', content: description},
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
          {name: 'twitter:image', content: imageUrl},
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
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

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] pb-20">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-1">
        <Breadcrumb
          items={[
            {label: 'Utama', to: '/'},
            {label: 'Semua Koleksi', to: '/collections/all'},
            {label: collection.title},
          ]}
          currentUrl={`https://elfy.my/collections/${collection.handle}`}
        />
      </div>

      {/* Editorial Category Header (Bright & Luxurious) */}
      <div className="bg-gradient-to-b from-[#F4F0E8] via-[#FAF9F6] to-[#FAF9F6] text-[#191817] py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B48344] block mb-2.5">
            Koleksi Rasmi ELFY • Kuala Lumpur
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191817]">
            {collection.title}
          </h1>
          {collection.description && (
            <CollectionHeroDescription description={collection.description} />
          )}

          {/* Quick Category Switcher Pills */}
          <div className="mt-8">
            <CategoryPills activeHandle={collection.handle} />
          </div>
        </div>
      </div>

      {/* Structured Collection Highlights */}
      {collection.description && (
        <CollectionHighlightsBar description={collection.description} />
      )}

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
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
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
