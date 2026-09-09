import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {GrandAtelierHero} from '~/components/GrandAtelierHero';
import {CategoryPills} from '~/components/CategoryPills';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  Star,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import heroDesktopWebp from '~/assets/hero-desktop.webp';
import heroMobileWebp from '~/assets/hero-mobile.webp';
import mensSneakersWebp from '~/assets/banners/mens-sneakers-3x2.webp';
import mensWatchesWebp from '~/assets/banners/mens-watches-3x2.webp';

export const links: Route.LinksFunction = () => {
  return [
    {
      rel: 'preload',
      as: 'image',
      href: heroDesktopWebp,
      media: '(min-width: 768px)',
      type: 'image/webp',
      fetchPriority: 'high',
      fetchpriority: 'high',
    } as any,
    {
      rel: 'preload',
      as: 'image',
      href: heroMobileWebp,
      media: '(max-width: 767px)',
      type: 'image/webp',
      fetchPriority: 'high',
      fetchpriority: 'high',
    } as any,
  ];
};

export const meta: Route.MetaFunction = () => {
  const title = 'ELFY - Kasut Kasual & Jam Tangan Lelaki Malaysia (Official)';
  const description =
    'Jenama kasut kasual kulit asli & jam tangan sartorial rekaan moden Malaysia. Nikmati penghantaran percuma Semenanjung dan jaminan tukar saiz 7 hari percuma.';
  const canonicalUrl = 'https://elfy.my';
  const ogImageUrl = heroDesktopWebp;

  return [
    {title},
    {name: 'description', content: description},
    {name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    {property: 'og:image', content: ogImageUrl},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {property: 'og:image:alt', content: 'ELFY Malaysia - Kasut Kasual & Jam Tangan Lelaki'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: ogImageUrl},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{products}] = await Promise.all([
    context.storefront.query(HOMEPAGE_BEST_SELLERS_QUERY, {
      cache: context.storefront.CacheShort(),
    }),
  ]);

  return {
    bestSellers: products.nodes,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const featuredWatches = context.storefront
    .query(HOMEPAGE_WATCHES_QUERY, {
      cache: context.storefront.CacheShort(),
    })
    .then((res) => res.products.nodes)
    .catch((error: Error) => {
      console.error(error);
      return [];
    });

  return {
    featuredWatches,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  const featuredShoe = (data.bestSellers as any[]).find(
    (p: any) =>
      p.handle.includes('k') ||
      p.handle.includes('sepatu') ||
      p.handle.includes('sneaker'),
  );
  const featuredWatch = (data.bestSellers as any[]).find(
    (p: any) =>
      p.handle.includes('jam') ||
      p.handle.includes('watch') ||
      p.handle.includes('c27'),
  );

  const homeSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://elfy.my/#organization',
        name: 'ELFY',
        url: 'https://elfy.my',
        logo: 'https://elfy.my/favicon.svg',
        description:
          'Jenama kasut kasual kulit asli & jam tangan sartorial rekaan moden Malaysia.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Kuala Lumpur',
          addressCountry: 'MY',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://elfy.my/#website',
        url: 'https://elfy.my',
        name: 'ELFY Malaysia',
        publisher: {'@id': 'https://elfy.my/#organization'},
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://elfy.my/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <div className="bg-[#FAF9F6] text-[#191817] min-h-screen">
      {/* Search & Organization Structured Data for Google Sitelinks */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(homeSchema)}}
      />

      {/* 1. GRAND ATELIER HERO (Cinematic Showcase with Interactive Engineering Hotspots) */}
      <GrandAtelierHero
        featuredShoe={featuredShoe}
        featuredWatch={featuredWatch}
      />

      {/* 2. DUAL CATEGORY SPOTLIGHT (Footwear & Horology) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C5E24] block mb-2">
            Kategori Utama
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
            Direka Teliti Untuk Gaya & Keselesaan Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Footwear */}
          <Link
            to="/collections/mens-sneakers"
            className="group relative rounded-2xl overflow-hidden border border-[#EBE6DF] hover:border-stone-400 bg-stone-900 aspect-[4/3] sm:aspect-[16/10] transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
          >
            <picture>
              <source srcSet={mensSneakersWebp} type="image/webp" />
              <img
                src={mensSneakersWebp}
                alt="Koleksi Kasut Kulit ELFY"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9] group-hover:brightness-[0.95]"
                loading="lazy"
                decoding="async"
                width={848}
                height={568}
              />
            </picture>
            {/* Subtle Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1.5">
                Koleksi Kasut Kulit (39–44)
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Kasut Kasual Kulit Lembut
              </h3>
              <p className="text-xs text-stone-200 mt-2 max-w-md line-clamp-2">
                Potongan wide-fit selesa khas kaki Malaysia, tapak anti-gelincir dan kusyen empuk tahan seharian.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#191817] group-hover:bg-[#191817] group-hover:text-white font-medium text-xs uppercase tracking-wider transition-all duration-200">
                  <span>Terokai Kasut</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Watches */}
          <Link
            to="/collections/mens-watches"
            className="group relative rounded-2xl overflow-hidden border border-[#EBE6DF] hover:border-stone-400 bg-stone-900 aspect-[4/3] sm:aspect-[16/10] transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
          >
            <picture>
              <source srcSet={mensWatchesWebp} type="image/webp" />
              <img
                src={mensWatchesWebp}
                alt="Koleksi Jam Tangan ELFY"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9] group-hover:brightness-[0.95]"
                loading="lazy"
                decoding="async"
                width={848}
                height={568}
              />
            </picture>
            {/* Subtle Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1.5">
                Horologi Sartorial
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Jam Tangan Chrono &amp; Klasik
              </h3>
              <p className="text-xs text-stone-200 mt-2 max-w-md line-clamp-2">
                Enjin kuarza jitu, cermin sapphire-coated tahan calar, serta waranti enjin 1-tahun rasmi bertarikh.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#191817] group-hover:bg-[#191817] group-hover:text-white font-medium text-xs uppercase tracking-wider transition-all duration-200">
                  <span>Terokai Jam Tangan</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. CURATED BEST SELLERS GRID */}
      <section className="bg-white py-16 border-y border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C5E24] block mb-2">
                Paling Diminati
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
                Koleksi Pilihan Best Sellers
              </h2>
            </div>
            <Link
              to="/collections/all"
              className="group mt-3 sm:mt-0 text-xs font-semibold text-[#191817] hover:text-[#8C5E24] inline-flex items-center gap-1.5 transition-colors duration-200"
            >
              <span>Lihat Semua Koleksi ({data.bestSellers.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Quick Collection Filters */}
          <div className="mb-8">
            <CategoryPills activeHandle="best-sellers" />
          </div>

          {/* Product Grid using unified ProductItem */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12">
            {data.bestSellers.map((product: any) => (
              <ProductItem key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE ELFY STANDARDS: FRAMELESS ARCHITECTURAL REASSURANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8C5E24] block mb-2">
            The ELFY Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
            Komitmen Kualiti Tanpa Kompromi
          </h2>
          <p className="mt-2 text-xs text-stone-500 max-w-md mx-auto">
            Direka teliti untuk pasaran Malaysia dengan piawaian material terpilih dan ketelusan khidmat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center mb-3.5 text-[#8C6527]">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-[#191817] mb-1.5 tracking-tight">Pos 1–3 Hari Bekerja</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Pesanan diproses dalam 24 jam bekerja melalui J&amp;T Express &amp; Pos Laju. Percuma seluruh Semenanjung untuk pesanan RM150+.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center mb-3.5 text-[#8C6527]">
              <RefreshCw className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-[#191817] mb-1.5 tracking-tight">Tukar Saiz 7 Hari Percuma</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Kasut tak muat atau tersalah saiz? Kami gantikan saiz baru terus ke pintu rumah tanpa sebarang kerumitan.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center mb-3.5 text-[#8C6527]">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-[#191817] mb-1.5 tracking-tight">1-Tahun Waranti Enjin</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Semua jam tangan ELFY dilindungi waranti pergerakan kuarza rasmi berserta kad jaminan bertarikh.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center mb-3.5 text-[#2B593F]">
              <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-semibold text-[#191817] mb-1.5 tracking-tight">Perniagaan Berdaftar SSM</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Entiti sah Malaysia dengan sokongan FPX tempatan (Maybank2u, CIMB Clicks), TNG eWallet, GrabPay, dan Kad Kredit.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED EDITORIAL CUSTOMER FEEDBACK */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
              Pengalaman Pelanggan di Malaysia
            </h2>
            <p className="text-xs text-stone-500 mt-1.5">
              Maklum balas tulen daripada pembeli terverifikasi dari Semenanjung, Sabah &amp; Sarawak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-stone-200/80">
            <div className="pt-6 md:pt-0 md:px-6 first:pl-0 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                &ldquo;Kulit kasut sangat lembut, pakai dari pagi meeting sampai petang langsung tak melecet tumit. Potongan wide-fit dia memang ngam untuk kaki saya yang lebar.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817] font-medium">Hafiz Zulkifli</strong>
                <span className="text-stone-600 font-medium">Bangsar, KL</span>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                &ldquo;Order hari Selasa, hari Rabu petang Pos Laju dah sampai depan rumah di Penang. Jam tangan berat sedap di pergelangan, kemasan keluli memang kemas.&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817] font-medium">Khairul Anuar</strong>
                <span className="text-stone-600 font-medium">Georgetown, Penang</span>
              </div>
            </div>

            <div className="pt-6 md:pt-0 md:px-6 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              </div>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                &ldquo;Mula-mula tersalah pilih saiz 41, customer service WhatsApp sangat pantas tolong uruskan tukar ke saiz 42 tanpa sebarang kerenah. Servis terbaik!&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817] font-medium">Raymond Tan</strong>
                <span className="text-stone-600 font-medium">Johor Bahru</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

const HOMEPAGE_BEST_SELLERS_QUERY = `#graphql
  query HomepageBestSellers($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        productType
        priceRange {
          minVariantPrice {
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
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 3) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;

const HOMEPAGE_WATCHES_QUERY = `#graphql
  query HomepageWatches($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 6, query: "product_type:Watch OR product_type:Watches") {
      nodes {
        id
        title
        handle
        productType
        priceRange {
          minVariantPrice {
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
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 3) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
` as const;
