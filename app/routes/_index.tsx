import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {GrandAtelierHero} from '~/components/GrandAtelierHero';
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
  PhoneCall,
} from 'lucide-react';

export const meta: Route.MetaFunction = () => {
  const title = 'ELFY | Kasut Kasual & Jam Tangan Lelaki Malaysia (Official)';
  const description =
    'Jenama kasut kasual kulit asli & jam tangan sartorial rekaan moden Malaysia. Nikmati penghantaran percuma Semenanjung dan jaminan tukar saiz 7 hari percuma.';
  const canonicalUrl = 'https://elfy.my';

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

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{products}] = await Promise.all([
    context.storefront.query(HOMEPAGE_BEST_SELLERS_QUERY),
  ]);

  return {
    bestSellers: products.nodes,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const featuredWatches = context.storefront
    .query(HOMEPAGE_WATCHES_QUERY)
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

  return (
    <div className="bg-[#FAF9F6] text-[#191817] min-h-screen">
      {/* 1. GRAND ATELIER HERO (Cinematic Showcase with Interactive Engineering Hotspots) */}
      <GrandAtelierHero
        featuredShoe={featuredShoe}
        featuredWatch={featuredWatch}
      />

      {/* 2. DUAL CATEGORY SPOTLIGHT (Footwear & Horology) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B48344] block mb-2">
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
            className="group relative rounded-3xl overflow-hidden border border-[#EBE6DF] bg-stone-900 aspect-[4/3] sm:aspect-[16/10] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
          >
            <img
              src="/banners/mens-sneakers-3x2.jpg"
              alt="Koleksi Kasut Kulit ELFY"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9] group-hover:brightness-[0.95]"
              loading="lazy"
            />
            {/* Subtle Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3 h-3 text-[#B48344]" />
                Koleksi Kasut Kulit (39-44)
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Kasut Kasual Kulit Lembut
              </h3>
              <p className="text-xs text-stone-200 mt-2 max-w-md line-clamp-2">
                Potongan wide-fit selesa khas kaki Malaysia, tapak anti-gelincir dan kusyen empuk tahan seharian.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#191817] group-hover:bg-[#B48344] group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md">
                  <span>Terokai Kasut</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: Watches */}
          <Link
            to="/collections/mens-watches"
            className="group relative rounded-3xl overflow-hidden border border-[#EBE6DF] bg-stone-900 aspect-[4/3] sm:aspect-[16/10] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
          >
            <img
              src="/banners/mens-watches-3x2.jpg"
              alt="Koleksi Jam Tangan ELFY"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-[0.9] group-hover:brightness-[0.95]"
              loading="lazy"
            />
            {/* Subtle Gradient Overlay for High Contrast Text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5 pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3 h-3 text-[#B48344]" />
                Horologi Sartorial
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                Jam Tangan Chrono & Klasik
              </h3>
              <p className="text-xs text-stone-200 mt-2 max-w-md line-clamp-2">
                Enjin kuarza jitu, cermin sapphire-coated tahan calar, serta waranti enjin 1-tahun rasmi bertarikh.
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#191817] group-hover:bg-[#B48344] group-hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md">
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
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B48344] block mb-2">
                Paling Diminati
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
                Koleksi Pilihan Best Sellers
              </h2>
            </div>
            <Link
              to="/collections/all"
              className="group mt-3 sm:mt-0 text-xs font-semibold text-[#191817] hover:text-[#B48344] inline-flex items-center gap-1.5 transition-colors duration-200"
            >
              <span>Lihat Semua Koleksi ({data.bestSellers.length}+)</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Product Grid using unified ProductItem */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {data.bestSellers.map((product: any) => (
              <ProductItem key={product.id} product={product as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE ELFY STANDARDS: 4-PILLAR REASSURANCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B48344] block mb-2">
            The ELFY Standards
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
            Komitmen Kualiti Tanpa Kompromi
          </h2>
          <p className="mt-2 text-xs text-stone-600">
            Direka teliti untuk pasaran Malaysia dengan piawaian material terpilih.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF] flex items-center justify-center mb-4 text-[#B48344]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#191817] mb-1">Pos Pantas 1-3 Hari</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pesanan diproses dalam 24 jam bekerja melalui J&T Express & Pos Laju. Percuma seluruh Semenanjung RM150+.
            </p>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF] flex items-center justify-center mb-4 text-[#B48344]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#191817] mb-1">7-Day Size Exchange</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Kasut tak muat atau tersalah saiz? Kami gantikan saiz baru dengan pantas ke depan pintu rumah anda.
            </p>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF] flex items-center justify-center mb-4 text-[#B48344]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#191817] mb-1">1-Tahun Waranti Enjin</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Semua jam tangan ELFY dilindungi waranti pergerakan enjin rasmi berserta kad jaminan bertarikh.
            </p>
          </div>

          <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF] flex items-center justify-center mb-4 text-[#2B593F]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#191817] mb-1">Pembayaran Tempatan Selamat</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sokongan penuh FPX (Maybank2u, CIMB Clicks, dll), Touch &apos;n Go eWallet, GrabPay, dan Kad Kredit berenkripsi.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED REVIEWS FROM MALAYSIAN CUSTOMERS */}
      <section className="bg-[#F3EFEA] py-16 border-t border-[#EBE6DF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#191817]">
              Apa Kata Pelanggan Kami di Malaysia
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Lebih 2,400+ pelanggan berpuas hati dari seluruh Semenanjung, Sabah & Sarawak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Kulit kasut sangat lembut, pakai dari pagi meeting sampai petang langsung tak melecet tumit. Potongan wide-fit dia memang ngam untuk kaki saya yang lebar.&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817]">Hafiz Zulkifli</strong>
                <span className="text-stone-400">Bangsar, KL • Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Order hari Selasa, hari Rabu petang Pos Laju dah sampai depan rumah di Penang. Jam tangan berat sedap di pergelangan, nampak macam jam RM1k+. Berbaloi sangat!&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817]">Khairul Anuar</strong>
                <span className="text-stone-400">Georgetown, Penang • Verified Buyer</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <p className="text-xs text-stone-700 leading-relaxed italic">
                &ldquo;Mula-mula tersalah pilih saiz 41, customer service WhatsApp sangat pantas tolong uruskan tukar ke saiz 42 tanpa sebarang kerenah. Servis terbaik!&rdquo;
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <strong className="text-[#191817]">Dr. Raymond Tan</strong>
                <span className="text-stone-400">Johor Bahru • Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP VIP CONCIERGE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#191817] text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-[#B48344] font-semibold">
              Perlukan Bantuan Memilih Saiz?
            </span>
            <h3 className="font-serif text-2xl font-bold">
              Khidmat Konsultasi VIP WhatsApp
            </h3>
            <p className="text-xs text-stone-300 max-w-lg leading-relaxed">
              Hantar gambar atau ukuran kaki anda, staf peribadi ELFY sedia mencadangkan saiz dan model paling sesuai untuk anda dalam masa kurang 5 minit.
            </p>
          </div>
          <a
            href="https://wa.me/601111111111?text=Hi%20ELFY,%20saya%20nak%20minta%20cadangan%20saiz%20kasut"
            target="_blank"
            rel="noopener noreferrer"
            className="group h-12 px-6 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2.5 shrink-0 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg select-none"
          >
            <PhoneCall className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <span>Chat WhatsApp Sekarang</span>
          </a>
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
