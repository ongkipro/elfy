import type {Route} from './+types/collections.all';
import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {CategoryPills} from '~/components/CategoryPills';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  const title = 'Semua Koleksi Kasut & Jam Tangan | ELFY Official';
  const description =
    'Koleksi lengkap kasut kasual, loafers kulit asli, dan jam tangan lelaki rekaan Malaysia. Penghantaran percuma Semenanjung & jaminan tukar saiz 7 hari.';
  const canonicalUrl = 'https://elfy.my/collections/all';

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

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function CollectionAll() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] pb-20">
      {/* Editorial Header (Bright & Luxurious) */}
      <div className="bg-gradient-to-b from-[#F4F0E8] via-[#FAF9F6] to-[#FAF9F6] text-[#191817] py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B48344] block mb-2.5">
            Katalog Lengkap ELFY • Kuala Lumpur
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#191817]">
            Semua Koleksi Eksklusif
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Terokai rangkaian penuh kasut kasual kulit premium dan jam tangan horologi moden dengan jaminan tukar saiz 7 hari percuma.
          </p>

          {/* Quick Category Switcher */}
          <div className="mt-8">
            <CategoryPills activeHandle="all" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EBE6DF] text-xs text-stone-500">
          <span>Koleksi Rasmi ELFY Kuala Lumpur</span>
          <span className="font-semibold text-[#191817]">
            {products?.nodes?.length || 0} Produk Sedia Pos
          </span>
        </div>

        <PaginatedResourceSection<CollectionItemFragment>
          connection={products}
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

        {/* Trust Badges */}
        <div className="mt-16">
          <TrustPaymentBadges variant="full" />
        </div>
      </div>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
