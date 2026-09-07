import React, {useState} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  Ruler,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

interface SplitAtelierHeroProps {
  featuredShoe?: any;
  featuredWatch?: any;
}

export function SplitAtelierHero({
  featuredShoe,
  featuredWatch,
}: SplitAtelierHeroProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'both' | 'shoes' | 'watches'>('both');

  const shoePrice = parseFloat(
    featuredShoe?.priceRange?.minVariantPrice?.amount || '169.00',
  );
  const shoeCompareAt = parseFloat(
    featuredShoe?.compareAtPriceRange?.minVariantPrice?.amount || '338.00',
  );
  const shoeCurrency =
    featuredShoe?.priceRange?.minVariantPrice?.currencyCode || 'MYR';

  const watchPrice = parseFloat(
    featuredWatch?.priceRange?.minVariantPrice?.amount || '149.00',
  );
  const watchCompareAt = parseFloat(
    featuredWatch?.compareAtPriceRange?.minVariantPrice?.amount || '298.00',
  );
  const watchCurrency =
    featuredWatch?.priceRange?.minVariantPrice?.currencyCode || 'MYR';

  // Best imagery: Lifestyle model onlook or clean cover hero
  const shoeImage =
    featuredShoe?.images?.nodes?.[1] ||
    featuredShoe?.featuredImage ||
    featuredShoe?.images?.nodes?.[0];

  const watchImage =
    featuredWatch?.images?.nodes?.[1] ||
    featuredWatch?.featuredImage ||
    featuredWatch?.images?.nodes?.[0];

  const sizes = ['39', '40', '41', '42', '43', '44'];

  return (
    <section className="relative bg-gradient-to-b from-[#F5F2EB] via-[#FAF9F6] to-[#FAF9F6] text-[#191817] border-b border-[#EBE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
        {/* Top Centered Brand Statement */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EBE6DF] text-[#B48344] text-[11px] font-semibold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Koleksi Rasmi Kuala Lumpur 2026</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191817] leading-[1.12]">
            Sartorial Ease for <span className="italic text-[#B48344]">Modern Living</span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Koleksi kasut kasual berlapik empuk Asian Wide-Fit & jam tangan eksekutif rekaan kontemporari. Direka teliti untuk gaya hidup aktif di iklim Malaysia.
          </p>

          {/* Mobile Quick Category Toggles */}
          <div className="flex md:hidden items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'both'
                  ? 'bg-[#191817] text-white'
                  : 'bg-white text-stone-600 border border-[#EBE6DF]'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shoes')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'shoes'
                  ? 'bg-[#191817] text-white'
                  : 'bg-white text-stone-600 border border-[#EBE6DF]'
              }`}
            >
              Kasut (39-44)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('watches')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'watches'
                  ? 'bg-[#191817] text-white'
                  : 'bg-white text-stone-600 border border-[#EBE6DF]'
              }`}
            >
              Jam Tangan
            </button>
          </div>
        </div>

        {/* 50/50 DUAL EDITORIAL ATELIER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* PANEL KIRI: KASUT KASUAL & SNEAKERS (Asian Wide-Fit) */}
          <div
            className={`group relative rounded-3xl bg-white border border-[#EBE6DF] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${
              activeTab === 'watches' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Top Info & Micro Badges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B48344] bg-[#B48344]/10 px-3 py-1 rounded-full">
                  Asian Wide-Fit • Kasut Kasual
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-stone-700">4.9 (128 Ulasan KL)</span>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817] group-hover:text-[#B48344] transition-colors leading-snug">
                  Keselesaan Berjalan Sepanjang Hari
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Tapak berlapik kusyen elastik menyerap hentakan. Potongan luas di bahagian depan kaki mengelakkan melecet dan rasa sempit.
                </p>
              </div>

              {/* Instant Interactive Size Selector */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-xs mb-2 font-semibold">
                  <span className="text-stone-700">Pilih Saiz Kaki (EU):</span>
                  <Link
                    to="/pages/size-guide"
                    className="text-[#B48344] hover:text-[#916631] flex items-center gap-1 text-[11px]"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Ukur Kaki (CM)</span>
                  </Link>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`h-9 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#191817] text-white border-[#191817] shadow-xs'
                          : 'bg-[#FAF9F6] text-stone-800 border-stone-200 hover:border-[#B48344]/60'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Product Showcase */}
            <div className="relative my-6 aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF9F6] border border-stone-200/80 group-hover:scale-[1.01] transition-transform duration-500">
              {shoeImage ? (
                <Image
                  data={shoeImage}
                  alt={featuredShoe?.title || 'Kasut Kasual ELFY'}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 500px, 90vw"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  ELFY Kasut
                </div>
              )}

              {/* Status Pill Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-stone-200/80 px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#191817] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2B593F]" />
                <span>Ready Stock Kuala Lumpur</span>
              </div>

              {shoeCompareAt > shoePrice && (
                <div className="absolute top-3 right-3 bg-[#A83232] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Jimat {Math.round(((shoeCompareAt - shoePrice) / shoeCompareAt) * 100)}%
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-[#191817]/90 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-md">
                Tukar Saiz 7 Hari Percuma
              </div>
            </div>

            {/* Bottom Pricing & Call To Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                  Harga Pengenalan Rasmi
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#191817]">
                    {shoeCurrency} {shoePrice.toFixed(2)}
                  </span>
                  {shoeCompareAt > shoePrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {shoeCurrency} {shoeCompareAt.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={
                  selectedSize
                    ? `/collections/mens-sneakers?size=${selectedSize}`
                    : `/products/${featuredShoe?.handle || 'sepatu-pria-k52-sneakers-sport-casual'}`
                }
                className="h-12 px-6 bg-[#191817] hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-[0.98] shrink-0"
              >
                <span>{selectedSize ? `Pilih Saiz ${selectedSize} →` : 'Lihat Kasut →'}</span>
              </Link>
            </div>
          </div>

          {/* PANEL KANAN: PRECISION HOROLOGY (Jam Tangan Eksekutif) */}
          <div
            className={`group relative rounded-3xl bg-white border border-[#EBE6DF] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 sm:p-8 ${
              activeTab === 'shoes' ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Top Info & Micro Badges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B48344] bg-[#B48344]/10 px-3 py-1 rounded-full">
                  Precision Horology • Jam Tangan
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="text-stone-700">4.9 (86 Ulasan KL)</span>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817] group-hover:text-[#B48344] transition-colors leading-snug">
                  Ketepatan Masa & Gaya Eksekutif
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  Kaca kristal mineral tahan calar, keluli tahan karat berkilat tinggi, dan kalis air harian. Sesuai untuk pejabat & majlis santai.
                </p>
              </div>

              {/* Key Specs Pills */}
              <div className="pt-1">
                <span className="text-xs font-semibold text-stone-700 block mb-2">
                  Spesifikasi & Jaminan Rasmi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-[11px] font-semibold text-stone-800 border border-stone-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B48344]" /> 1-Tahun Waranti
                  </span>
                  <span className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-[11px] font-semibold text-stone-800 border border-stone-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#B48344]" /> Kaca Kristal Mineral
                  </span>
                  <span className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-[11px] font-semibold text-stone-800 border border-stone-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2B593F]" /> Kalis Air Harian
                  </span>
                  <span className="px-2.5 py-1.5 rounded-lg bg-stone-100 text-[11px] font-semibold text-stone-800 border border-stone-200">
                    Kotak Hadiah Percuma
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Product Showcase */}
            <div className="relative my-6 aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF9F6] border border-stone-200/80 group-hover:scale-[1.01] transition-transform duration-500">
              {watchImage ? (
                <Image
                  data={watchImage}
                  alt={featuredWatch?.title || 'Jam Tangan ELFY'}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 500px, 90vw"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400">
                  ELFY Horology
                </div>
              )}

              {/* Status Pill Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md border border-stone-200/80 px-3 py-1 rounded-full shadow-xs text-[11px] font-semibold text-[#191817] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B48344]" />
                <span>Kad Waranti Rasmi Disertakan</span>
              </div>

              {watchCompareAt > watchPrice && (
                <div className="absolute top-3 right-3 bg-[#A83232] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  Jimat {Math.round(((watchCompareAt - watchPrice) / watchCompareAt) * 100)}%
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-[#191817]/90 backdrop-blur-xs text-white text-[10px] font-medium px-2.5 py-1 rounded-md">
                Keluli Tahan Karat Premium
              </div>
            </div>

            {/* Bottom Pricing & Call To Action */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                  Harga Pengenalan Rasmi
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-[#191817]">
                    {watchCurrency} {watchPrice.toFixed(2)}
                  </span>
                  {watchCompareAt > watchPrice && (
                    <span className="text-xs text-stone-400 line-through">
                      {watchCurrency} {watchCompareAt.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <Link
                to={`/products/${featuredWatch?.handle || 'jam-tangan-pria-c27-analog-quartz'}`}
                className="h-12 px-6 bg-[#191817] hover:bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all active:scale-[0.98] shrink-0"
              >
                <span>Lihat Jam Tangan &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 REASSURANCE PILLARS STRIP */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-stone-200/60 shadow-2xs">
            <Truck className="w-5 h-5 text-[#B48344] shrink-0" />
            <div>
              <strong className="block text-[#191817] font-semibold text-xs">Pos 1-3 Hari</strong>
              <span className="text-[11px] text-stone-500">Semenanjung (Pos Laju/J&T)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-stone-200/60 shadow-2xs">
            <RefreshCw className="w-5 h-5 text-[#B48344] shrink-0" />
            <div>
              <strong className="block text-[#191817] font-semibold text-xs">Tukar Saiz 7 Hari</strong>
              <span className="text-[11px] text-stone-500">Pintu ke pintu tanpa caj</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-stone-200/60 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-[#B48344] shrink-0" />
            <div>
              <strong className="block text-[#191817] font-semibold text-xs">1-Tahun Waranti</strong>
              <span className="text-[11px] text-stone-500">100% Asli & Kad Jaminan</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/70 p-3.5 rounded-2xl border border-stone-200/60 shadow-2xs">
            <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
            <div>
              <strong className="block text-[#191817] font-semibold text-xs">Bantuan WhatsApp</strong>
              <span className="text-[11px] text-stone-500">Respons pantas dalam 5 minit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
