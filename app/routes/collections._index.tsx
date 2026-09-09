import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {Breadcrumb} from '~/components/Breadcrumb';
import {CategoryPills} from '~/components/CategoryPills';
import {CollectionAssurancePillars} from '~/components/CollectionDescription';
import {TrustPaymentBadges} from '~/components/TrustPaymentBadges';
import {ArrowRight, Sparkles} from 'lucide-react';
import {getShopifyImageUrl, getShopifyImageSrcSet} from '~/lib/image';

export const meta: Route.MetaFunction = () => {
  const title = 'Direktori Koleksi Eksklusif - ELFY Official';
  const description =
    'Terokai direktori koleksi kasut kasual kulit lembut dan jam tangan sartorial ELFY Malaysia. Sedia pos seluruh negara & jaminan tukar saiz 7 hari percuma.';
  const canonicalUrl = 'https://elfy.my/collections';

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
    {property: 'og:image', content: 'https://elfy.my/hero-desktop.webp'},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {property: 'og:image:alt', content: title},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: 'https://elfy.my/hero-desktop.webp'},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const {storefront} = args.context;

  const [{collections}] = await Promise.all([
    storefront.query(STORE_COLLECTIONS_DIRECTORY_QUERY),
  ]);

  // Filter out internal empty frontpage collection
  const activeCollections = (collections?.nodes || []).filter(
    (c: any) => c.handle !== 'frontpage',
  );

  return {collections: activeCollections};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  const directorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Direktori Koleksi Eksklusif - ELFY Official',
    description:
      'Terokai direktori koleksi kasut kasual kulit lembut dan jam tangan sartorial ELFY Malaysia.',
    url: 'https://elfy.my/collections',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collections.map((col: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://elfy.my/collections/${col.handle}`,
        name: col.title,
      })),
    },
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(directorySchema)}}
      />
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-2">
        <Breadcrumb
          items={[
            {label: 'Utama', to: '/'},
            {label: 'Semua Koleksi'},
          ]}
          currentUrl="https://elfy.my/collections"
        />
      </div>

      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-4 sm:pb-6">
        <div className="bg-gradient-to-b from-[#F4F0E8] via-[#FAF9F6] to-[#FAF9F6] rounded-2xl sm:rounded-3xl text-[#191817] py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border border-[#EBE6DF] text-center">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#8C5E24] block mb-2 sm:mb-2.5">
            Koleksi Rasmi ELFY • Kuala Lumpur
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#191817]">
            Direktori Koleksi Eksklusif
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Pilihan kasut kasual kulit lembut dan jam tangan sartorial yang direka teliti untuk gaya hidup urban Malaysia. Sedia pos pantas dari KL.
          </p>
        </div>

        {/* Quick Category Switcher */}
        <div className="mt-4 sm:mt-6">
          <CategoryPills activeHandle="all" />
        </div>
      </div>

      {/* Reassurance Pillars */}
      <CollectionAssurancePillars />

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EBE6DF] text-xs text-stone-500">
          <span>Koleksi Rasmi Terbitan Shopify</span>
          <span className="font-semibold text-[#191817]">
            {collections.length} Koleksi Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection: any) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="group relative rounded-2xl overflow-hidden border border-[#EBE6DF] hover:border-stone-400 bg-stone-900 aspect-[16/11] transition-all duration-300 flex flex-col justify-end p-6 sm:p-7 shadow-xs hover:shadow-md"
            >
              {collection.image ? (
                <img
                  src={getShopifyImageUrl(collection.image.url, {width: 800, format: 'webp'})}
                  srcSet={getShopifyImageSrcSet(collection.image.url, [360, 480, 640, 800, 1024])}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  alt={collection.image.altText || collection.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.80] group-hover:brightness-[0.85]"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={550}
                />
              ) : (
                <div className="absolute inset-0 bg-stone-900" />
              )}
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                  Koleksi ELFY
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                  {collection.title}
                </h3>
                {collection.description && (
                  <p className="text-xs text-stone-200 mt-1.5 line-clamp-2 leading-relaxed">
                    {collection.description}
                  </p>
                )}
                <div className="mt-3.5">
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/95 text-[#191817] group-hover:bg-[#B48344] group-hover:text-white font-medium text-xs uppercase tracking-wider transition-all duration-200">
                    <span>Terokai Koleksi</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Full Catalog Card */}
          <Link
            to="/collections/all"
            className="group relative rounded-2xl overflow-hidden border border-[#EBE6DF] hover:border-stone-400 bg-gradient-to-br from-stone-900 via-stone-950 to-[#191817] aspect-[16/11] transition-all duration-300 flex flex-col justify-end p-6 sm:p-7 shadow-xs hover:shadow-md"
          >
            <div className="relative z-10">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Katalog Penuh</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
                Semua Koleksi &amp; Produk
              </h3>
              <p className="text-xs text-stone-300 mt-1.5 line-clamp-2 leading-relaxed">
                Lihat kesemua 51+ model kasut kasual kulit dan jam tangan mewah sedia pos dari Kuala Lumpur.
              </p>
              <div className="mt-3.5">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B48344] text-white group-hover:bg-white group-hover:text-[#191817] font-medium text-xs uppercase tracking-wider transition-all duration-200">
                  <span>Lihat Semua Produk</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Bottom Trust Row */}
        <div className="mt-16">
          <TrustPaymentBadges variant="full" />
        </div>
      </div>
    </div>
  );
}

const STORE_COLLECTIONS_DIRECTORY_QUERY = `#graphql
  query StoreCollectionsDirectory(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collections(first: 10) {
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
      }
    }
  }
` as const;
