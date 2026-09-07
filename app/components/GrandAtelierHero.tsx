import React from 'react';
import {Link} from 'react-router';
import {ArrowRight, Truck, RefreshCw, ShieldCheck, CheckCircle2, Star} from 'lucide-react';

interface GrandAtelierHeroProps {
  featuredShoe?: any;
  featuredWatch?: any;
}

export function GrandAtelierHero({}: GrandAtelierHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#EBE6DF] bg-[#FAF9F6]">
      {/* 1. CINEMATIC AUTHENTIC LIFESTYLE BACKGROUND */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/hero-mobile.webp"
            type="image/webp"
          />
          <source media="(max-width: 767px)" srcSet="/hero-mobile.jpg" />
          <source srcSet="/hero-desktop.webp" type="image/webp" />
          <img
            src="/hero-desktop.jpg"
            alt="ELFY Malaysia - Kasut Kasual & Jam Tangan Minimalist"
            className="w-full h-full object-cover object-[75%_center] md:object-right-center opacity-95 transition-all duration-700"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1376}
            height={768}
          />
        </picture>

        {/* Minimal Subtle Scrim for Clean Text Contrast */}
        {/* Desktop: Soft warm off-white fade on the left 40% only, keeping the photo clear */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/85 via-40% to-transparent" />
        
        {/* Mobile: Smooth vertical fade for bottom thumb-zone CTAs */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/85 via-50% to-transparent" />
      </div>

      {/* 2. MINIMALIST EDITORIAL HERO CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between pt-10 sm:pt-16 pb-8 z-10">
        {/* Top Minimal Trust Pill */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EBE6DF] text-[11px] font-medium text-[#191817]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F]" />
            <span>Koleksi Eksklusif Malaysia • Ready Stock KL</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EBE6DF]">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            </div>
            <span className="font-semibold text-[#191817]">4.9/5</span>
            <span className="text-stone-300">•</span>
            <span className="text-stone-500">2,400+ Lelaki di Malaysia</span>
          </div>
        </div>

        {/* Center-Left Bold Minimal Hero Headline & Dual CTAs */}
        <div className="max-w-xl space-y-6 my-auto pt-8 pb-4">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B48344] block">
              Sartorial Footwear &amp; Horology
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191817] leading-[1.08]">
              Langkah Selesa.<br />
              <span className="italic font-normal text-[#B48344]">Karisma Bergaya.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#605C56] max-w-md leading-relaxed font-normal">
              Kasut kulit kasual potongan Asian Wide-Fit (EU 39–44) dan jam tangan minimalist untuk gaya hidup moden Malaysia.
            </p>
          </div>

          {/* Dual Action Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              to="/collections/mens-sneakers"
              className="group h-12 px-7 bg-[#191817] hover:bg-[#2e2b29] active:scale-[0.99] text-white rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer"
            >
              <span>Terokai Kasut</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
            </Link>

            <Link
              to="/collections/mens-watches"
              className="group h-12 px-7 bg-white hover:bg-stone-50 active:scale-[0.99] text-[#191817] border border-stone-300 hover:border-stone-400 rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 select-none cursor-pointer"
            >
              <span>Koleksi Jam Tangan</span>
            </Link>
          </div>

          {/* Quick Micro Reassurance */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#B48344]" />
              <span>Pos Percuma RM150+</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#B48344]" />
              <span>7-Day Size Exchange</span>
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B48344]" />
              <span>1-Tahun Waranti</span>
            </span>
          </div>
        </div>

        {/* 3. SUBTLE BOTTOM TRUST BAR */}
        <div className="pt-6 border-t border-stone-200/60 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs text-stone-700">
          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center shrink-0 text-[#B48344] shadow-2xs">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <strong className="block text-[#191817] font-semibold text-xs leading-none truncate">
                Pos 1-3 Hari
              </strong>
              <span className="text-[10.5px] sm:text-[11px] text-stone-500 truncate block mt-0.5">
                Semenanjung (J&T / Pos)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center shrink-0 text-[#B48344] shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <strong className="block text-[#191817] font-semibold text-xs leading-none truncate">
                Tukar Saiz 7 Hari
              </strong>
              <span className="text-[10.5px] sm:text-[11px] text-stone-500 truncate block mt-0.5">
                Gantian terus ke pintu
              </span>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center shrink-0 text-[#B48344] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <strong className="block text-[#191817] font-semibold text-xs leading-none truncate">
                1-Tahun Waranti
              </strong>
              <span className="text-[10.5px] sm:text-[11px] text-stone-500 truncate block mt-0.5">
                Kad jaminan rasmi
              </span>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 text-left">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE6DF] flex items-center justify-center shrink-0 text-[#2B593F] shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <strong className="block text-[#191817] font-semibold text-xs leading-none truncate">
                Bayaran Selamat
              </strong>
              <span className="text-[10.5px] sm:text-[11px] text-stone-500 truncate block mt-0.5">
                FPX, TNG, GrabPay, Kad
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
