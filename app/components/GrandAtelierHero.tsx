import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Link} from 'react-router';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Truck,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  Star,
  Sparkles,
} from 'lucide-react';

interface GrandAtelierHeroProps {
  featuredShoe?: any;
  featuredWatch?: any;
}

interface HeroSlide {
  id: string;
  badge: string;
  category: string;
  title: string;
  titleEmphasis: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'atelier-lifestyle',
    badge: 'Koleksi Eksklusif Malaysia • Ready Stock KL',
    category: 'Sartorial Footwear & Horology',
    title: 'Langkah Selesa.',
    titleEmphasis: 'Karisma Bergaya.',
    description:
      'Kasut kulit kasual potongan Asian Wide-Fit (EU 39–44) dan jam tangan minimalist untuk gaya hidup moden Malaysia.',
    primaryCtaText: 'Terokai Kasut',
    primaryCtaLink: '/collections/mens-sneakers',
    secondaryCtaText: 'Koleksi Jam Tangan',
    secondaryCtaLink: '/collections/mens-watches',
    desktopImage: '/hero-desktop.webp',
    mobileImage: '/hero-mobile.webp',
    alt: 'ELFY Malaysia - Kasut Kasual & Jam Tangan Minimalist',
  },
  {
    id: 'mens-sneakers',
    badge: 'Asian Wide-Fit (EU 39–44) • Kusyen Ergonomik',
    category: 'Kasut Kasual Kulit Lelaki',
    title: 'Tapak Kusyen Empuk.',
    titleEmphasis: 'Bebas Sakit & Melecet.',
    description:
      'Tapak kusyen ergonomik menyerap hentakan untuk keselesaan berjalan sepanjang hari. Potongan selesa khas bentuk kaki Malaysia.',
    primaryCtaText: 'Beli Kasut Lelaki',
    primaryCtaLink: '/collections/mens-sneakers',
    secondaryCtaText: 'Panduan Saiz (CM)',
    secondaryCtaLink: '/pages/size-guide',
    desktopImage: '/banners/mens-sneakers-3x2.webp',
    mobileImage: '/banners/mens-sneakers-3x2.webp',
    alt: 'Koleksi Kasut Kasual Kulit ELFY',
  },
  {
    id: 'mens-watches',
    badge: 'Precision Horology • 1-Tahun Waranti Enjin',
    category: 'Executive Horology Collection',
    title: 'Ketepatan Masa.',
    titleEmphasis: 'Gaya Eksekutif Moden.',
    description:
      'Kaca kristal mineral tahan calar, keluli tahan karat berkilat, dan kalis air harian. Dihantar bersama kotak eksklusif percuma.',
    primaryCtaText: 'Koleksi Jam Tangan',
    primaryCtaLink: '/collections/mens-watches',
    secondaryCtaText: 'Jam Tangan Wanita',
    secondaryCtaLink: '/collections/womens-watches',
    desktopImage: '/banners/mens-watches-3x2.webp',
    mobileImage: '/banners/mens-watches-3x2.webp',
    alt: 'Koleksi Jam Tangan Eksekutif ELFY',
  },
  {
    id: 'new-arrivals',
    badge: 'Keluaran Terkini • Edisi Terhad 2026',
    category: 'New Arrivals & Latest Drops',
    title: 'Keluaran Terbaru.',
    titleEmphasis: 'Rekaan Paling Segar.',
    description:
      'Drop eksklusif kasut kasual dan jam tangan gaya kontemporari. Kualiti pembuatan kemas, sedia dipos terus dari Kuala Lumpur.',
    primaryCtaText: 'Lihat New Arrivals',
    primaryCtaLink: '/collections/new-arrivals',
    secondaryCtaText: 'Semua Koleksi',
    secondaryCtaLink: '/collections/all',
    desktopImage: '/banners/new-arrivals-3x2.webp',
    mobileImage: '/banners/new-arrivals-3x2.webp',
    alt: 'Koleksi New Arrivals ELFY',
  },
  {
    id: 'best-sellers',
    badge: 'Pilihan Ramai • Jaminan Tukar Saiz 7 Hari',
    category: 'Best Sellers & Trending Styles',
    title: 'Pilihan 2,400+ Lelaki.',
    titleEmphasis: 'Jaminan Tukar Saiz 7 Hari.',
    description:
      'Model paling digemari pelanggan di seluruh Semenanjung Malaysia. Jaminan tukar saiz percuma pintu ke pintu tanpa kerumitan.',
    primaryCtaText: 'Terokai Best Sellers',
    primaryCtaLink: '/collections/best-sellers',
    secondaryCtaText: 'Jaminan & Waranti',
    secondaryCtaLink: '/pages/warranty-returns',
    desktopImage: '/banners/best-sellers-3x2.webp',
    mobileImage: '/banners/best-sellers-3x2.webp',
    alt: 'Koleksi Best Sellers ELFY',
  },
];

const SLIDE_DURATION = 5500; // 5.5s continuous auto-slider

export function GrandAtelierHero({}: GrandAtelierHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Continuous Auto-Slider (Pauses on user hover/touch)
  useEffect(() => {
    // Respect accessibility: prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative overflow-hidden border-b border-[#EBE6DF] bg-[#FAF9F6] select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Koleksi Pilihan ELFY"
    >
      {/* 1. CINEMATIC BACKGROUND SLIDER (All WebP, LCP-optimized) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          const isLcp = index === 0;
          // Defer non-critical slides on initial SSR/HTML to eliminate bandwidth contention for LCP.
          // On client, mount active slide and adjacent next slide to buffer smoothly.
          const shouldRenderImage =
            isLcp ||
            (isMounted && (isActive || index === (currentSlide + 1) % totalSlides));

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              {shouldRenderImage && (
                <picture>
                  {slide.mobileImage !== slide.desktopImage && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobileImage}
                      type="image/webp"
                      width={720}
                      height={964}
                    />
                  )}
                  <source
                    media="(min-width: 768px)"
                    srcSet={slide.desktopImage}
                    type="image/webp"
                    width={1376}
                    height={768}
                  />
                  <img
                    src={slide.desktopImage}
                    alt={slide.alt}
                    className="w-full h-full object-cover object-[75%_center] md:object-right-center opacity-95 transition-transform duration-1000 ease-out"
                    loading={isLcp ? 'eager' : 'lazy'}
                    fetchPriority={isLcp ? 'high' : 'low'}
                    decoding={isLcp ? 'sync' : 'async'}
                    width={1376}
                    height={768}
                  />
                </picture>
              )}
            </div>
          );
        })}

        {/* Minimal Subtle Scrim for Clean Text Contrast */}
        {/* Desktop: Soft warm off-white fade on the left 45% only, keeping the photography clear */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/90 via-45% to-transparent pointer-events-none" />

        {/* Mobile: Smooth vertical fade for bottom thumb-zone CTAs */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/90 via-55% to-transparent pointer-events-none" />
      </div>

      {/* 2. EDITORIAL CONTENT & INTERACTIVE SLIDER CONTROLS */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex flex-col justify-between pt-10 sm:pt-14 pb-6 sm:pb-8 z-10">
        {/* Top Trust Pill & Review Metric */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#EBE6DF] text-[11px] font-medium text-[#191817] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B593F]" />
            <span className="transition-all duration-300">{activeSlide.badge}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-600 bg-white/85 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EBE6DF] shadow-2xs">
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

        {/* Center-Left Hero Headline & Dual Action CTAs */}
        <div className="max-w-xl space-y-6 my-auto pt-6 pb-2 sm:pt-8 sm:pb-4">
          <div className="space-y-3 transition-opacity duration-300">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B48344] block">
              {activeSlide.category}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#191817] leading-[1.1]">
              {activeSlide.title}
              <br />
              <span className="italic font-normal text-[#B48344]">
                {activeSlide.titleEmphasis}
              </span>
            </h1>
            <p className="text-xs sm:text-base text-[#605C56] max-w-md leading-relaxed font-normal min-h-[48px]">
              {activeSlide.description}
            </p>
          </div>

          {/* Dual Action Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              to={activeSlide.primaryCtaLink}
              className="group h-12 px-7 bg-[#191817] hover:bg-[#2e2b29] active:scale-[0.99] text-white rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-xs"
            >
              <span>{activeSlide.primaryCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
            </Link>

            <Link
              to={activeSlide.secondaryCtaLink}
              className="group h-12 px-7 bg-white hover:bg-stone-50 active:scale-[0.99] text-[#191817] border border-stone-300 hover:border-stone-400 rounded-lg font-medium text-xs uppercase tracking-[0.14em] inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-2xs"
            >
              <span>{activeSlide.secondaryCtaText}</span>
            </Link>
          </div>

          {/* Micro Reassurance Highlights */}
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

        {/* 3. SLIDER CONTROLS & CONTINUOUS PROGRESS BAR */}
        <div className="pt-4 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200/60">
          {/* Slide Indicator Progress Bars */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className="group py-2 px-1 flex items-center cursor-pointer flex-1 sm:flex-initial"
                  aria-label={`Pergi ke slaid ${idx + 1}: ${slide.title}`}
                >
                  <div className="h-1.5 w-full sm:w-12 rounded-full bg-stone-200 overflow-hidden relative transition-all duration-300">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isActive
                          ? 'w-full bg-[#191817]'
                          : 'w-0 group-hover:w-full group-hover:bg-stone-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Controls: Counter & Prev / Next Arrows */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-[11px] font-mono tracking-widest text-stone-500">
              0{currentSlide + 1} / 0{totalSlides}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Slaid Sebelumnya"
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-[#EBE6DF] flex items-center justify-center text-[#191817] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slaid Seterusnya"
                className="w-8 h-8 rounded-lg bg-white/80 hover:bg-white border border-[#EBE6DF] flex items-center justify-center text-[#191817] shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4. SUBTLE BOTTOM TRUST BAR */}
        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs text-stone-700">
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
