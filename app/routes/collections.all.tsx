import type {Route} from './+types/collections.all';
import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {CategoryPills} from '~/components/CategoryPills';
import {Breadcrumb} from '~/components/Breadcrumb';
import {CollectionAssurancePillars} from '~/components/CollectionDescription';
import {getCollectionSeo} from '~/lib/seo-catalog';
import {getShopifyImageUrl, getShopifyImageSrcSet} from '~/lib/image';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  const seo = getCollectionSeo('all', {
    title: 'Semua Koleksi & Produk',
    description:
      'Koleksi lengkap kasut sneakers kasual dan jam tangan lelaki & wanita ELFY Malaysia. Sedia pos dari KL & jaminan tukar saiz 7 hari.',
  });
  const title = seo.title;
  const description = seo.description;
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
    pageBy: 24,
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
  const heroBgImage =
    (products?.nodes as any[])?.[0]?.featuredImage?.url ||
    '/banners/mens-sneakers-3x2.webp';

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] pb-20">
      {/* Full-Bleed Cinematic Collection Hero: Background = Catalog Featured Image */}
      <section className="relative w-full overflow-hidden bg-stone-950 text-white min-h-[360px] sm:min-h-[460px] lg:min-h-[500px] flex flex-col justify-between border-b border-[#2A2724]">
        {/* Background Featured Image */}
        {heroBgImage && (
          <img
            src={getShopifyImageUrl(heroBgImage, {width: 1600, format: 'webp'})}
            srcSet={getShopifyImageSrcSet(heroBgImage, [480, 768, 1024, 1440, 1920])}
            sizes="100vw"
            alt="Semua Koleksi ELFY"
            className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.50] sm:brightness-[0.55] transition-transform duration-1000 scale-[1.01]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
          />
        )}

        {/* Cinematic Vignette & Readability Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#151413] via-black/45 to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 pointer-events-none" />

        {/* Top: Breadcrumb Navigation */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
          <Breadcrumb
            items={[
              {label: 'Utama', to: '/'},
              {label: 'Semua Koleksi'},
            ]}
            currentUrl="https://elfy.my/collections/all"
            theme="light"
          />
        </div>

        {/* Center/Bottom: Editorial Typography & Quick Switcher */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-14 sm:pb-12 text-center flex flex-col items-center">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#D4AF37] block mb-2 sm:mb-3 drop-shadow-xs">
            Katalog Lengkap ELFY • Kuala Lumpur
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-3xl drop-shadow-md">
            Semua Koleksi Eksklusif
          </h1>

          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-stone-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow-xs">
            Terokai rangkaian penuh kasut kasual kulit premium dan jam tangan horologi moden dengan jaminan tukar saiz 7 hari percuma.
          </p>

          {/* Quick Category Switcher */}
          <div className="mt-6 sm:mt-8 w-full">
            <CategoryPills activeHandle="all" theme="light" />
          </div>
        </div>
      </section>

      {/* Assurance Pillars */}
      <CollectionAssurancePillars />

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
          resourcesClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12"
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
