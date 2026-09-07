import React, {useState, useEffect, useCallback} from 'react';
import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  PhoneCall,
  Ruler,
} from 'lucide-react';

interface HeroSliderProps {
  featuredShoe?: any;
  featuredWatch?: any;
}

export function HeroSlider({featuredShoe, featuredWatch}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // High-converting slides tailored specifically for Middle-Up Malaysian buyers
  const slides = [
    {
      id: 'shoes',
      tabLabel: '01 Kasut Kasual (39-44)',
      badge: 'Koleksi Kasut Kasual • Asian Wide-Fit (EU 39–44)',
      badgeIcon: Sparkles,
      title: (
        <>
          Keselesaan Luar Biasa untuk{' '}
          <span className="italic text-[#B48344]">Langkah Harian Anda</span>
        </>
      ),
      description:
        'Tapak kusyen ergonomik menyerap hentakan untuk keselesaan berjalan sepanjang hari di iklim Malaysia. Potongan selesa Asian Wide-Fit tanpa rasa sempit atau melecet di jari kaki.',
      primaryCtaText: 'Koleksi Kasut Kasual',
      primaryCtaLink: '/collections/mens-sneakers',
      secondaryCtaText: 'Panduan Saiz (CM)',
      secondaryCtaLink: '/pages/size-guide',
      guarantees: [
        {icon: Truck, text: 'Pos 1-3 Hari Semenanjung'},
        {icon: RefreshCw, text: 'Tukar Saiz 7 Hari Percuma'},
        {icon: ShieldCheck, text: 'Stok Asli Kuala Lumpur'},
        {icon: CheckCircle2, text: 'FPX & Kad Diterima'},
      ],
      product: featuredShoe,
      productTitle:
        featuredShoe?.title || 'Kasut Kasual Kulit Asian Wide-Fit',
      productLink: `/products/${featuredShoe?.handle || 'sepatu-pria-k52-sneakers-sport-casual'}`,
      price: shoePrice,
      compareAt: shoeCompareAt,
      currency: shoeCurrency,
      floatingTagTop: 'Ready Stock • Kuala Lumpur',
      floatingTagBottom: 'Asian Wide-Fit (EU 39–44) Sedia Pos',
      ratingText: '4.9 (128 Ulasan Pembeli Malaysia)',
    },
    {
      id: 'watches',
      tabLabel: '02 Jam Tangan (Horology)',
      badge: 'Precision Horology • Gaya Eksekutif Moden',
      badgeIcon: Clock,
      title: (
        <>
          Ketepatan Masa & Karisma{' '}
          <span className="italic text-[#B48344]">Gaya Eksekutif</span>
        </>
      ),
      description:
        'Kaca kristal mineral tahan calar, keluli tahan karat berkilat tinggi, dan kalis air harian. Rekaan kemas berprestij sesuai untuk pejabat, mesyuarat korporat, dan acara santai.',
      primaryCtaText: 'Koleksi Jam Tangan',
      primaryCtaLink: '/collections/mens-watches',
      secondaryCtaText: 'Jam Tangan Wanita',
      secondaryCtaLink: '/collections/womens-watches',
      guarantees: [
        {icon: ShieldCheck, text: '1-Tahun Waranti Enjin'},
        {icon: Clock, text: 'Kaca Kristal Tahan Calar'},
        {icon: Truck, text: 'Kotak Eksklusif Percuma'},
        {icon: CheckCircle2, text: 'Kad Jaminan Rasmi'},
      ],
      product: featuredWatch,
      productTitle:
        featuredWatch?.title || 'Executive Chronograph Quartz Watch',
      productLink: `/products/${featuredWatch?.handle || 'jam-tangan-pria-c27-analog-quartz'}`,
      price: watchPrice,
      compareAt: watchCompareAt,
      currency: watchCurrency,
      floatingTagTop: '1-Tahun Waranti Enjin Rasmi',
      floatingTagBottom: 'Kaca Kristal Mineral & Keluli Tahan Karat',
      ratingText: '4.9 (86 Ulasan Pembeli Malaysia)',
    },
    {
      id: 'guarantee',
      tabLabel: '03 Jaminan Tukar Saiz',
      badge: 'Beli Tanpa Ragu • Zero-Risk Customer Protection',
      badgeIcon: ShieldCheck,
      title: (
        <>
          Jaminan Tukar Saiz 7 Hari{' '}
          <span className="italic text-[#B48344]">Pintu ke Pintu</span>
        </>
      ),
      description:
        'Tersalah pilih saiz kasut? Usah risau. Kami uruskan pertukaran saiz terus ke pintu rumah anda di seluruh Semenanjung Malaysia. Khidmat peribadi WhatsApp kami sedia membantu dalam 5 minit.',
      primaryCtaText: 'Terokai Semua Koleksi',
      primaryCtaLink: '/collections/all',
      secondaryCtaText: 'Chat WhatsApp VIP',
      secondaryCtaLink:
        'https://wa.me/601111111111?text=Hi%20ELFY,%20saya%20nak%20minta%20cadangan%20saiz%20kasut',
      isWhatsApp: true,
      guarantees: [
        {icon: RefreshCw, text: 'Tukar Saiz Pintu ke Pintu'},
        {icon: Truck, text: 'Percuma Pos RM150+'},
        {icon: PhoneCall, text: 'Konsultasi Saiz WhatsApp'},
        {icon: CheckCircle2, text: 'Perniagaan Berdaftar SSM'},
      ],
      product: featuredShoe,
      productTitle: 'Jaminan Bebas Risiko Pelanggan ELFY',
      productLink: '/pages/warranty-returns',
      price: shoePrice,
      compareAt: shoeCompareAt,
      currency: shoeCurrency,
      floatingTagTop: 'Jaminan 100% Kepuasan Pelanggan',
      floatingTagBottom: 'Pertukaran Saiz Pantas Tanpa Kerenah',
      ratingText: 'Khidmat Pelanggan Rating 4.9/5',
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-advance carousel every 6 seconds if not hovered
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const slide = slides[currentSlide];
  const BadgeIcon = slide.badgeIcon;
  const image =
    slide.product?.images?.nodes?.[1] ||
    slide.product?.featuredImage ||
    slide.product?.images?.nodes?.[0];

  return (
    <section
      className="relative bg-gradient-to-b from-[#F5F2EB] via-[#FAF9F6] to-[#FAF9F6] text-[#191817] overflow-hidden border-b border-[#EBE6DF]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
        {/* TOP INTERACTIVE TAB SWITCHER (For instant category selection) */}
        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-8 sm:mb-10 overflow-x-auto no-scrollbar pb-1">
          {slides.map((s, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`relative px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#191817] text-white shadow-md'
                    : 'bg-white/80 hover:bg-white text-stone-600 hover:text-[#191817] border border-[#EBE6DF] shadow-2xs'
                }`}
              >
                <span>{s.tabLabel}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#B48344] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* SLIDE CONTENT: 2-COLUMN LUXURY EDITORIAL SHOWCASE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          {/* LEFT: Editorial Content & Conversion Hooks (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-300">
            {/* Top Pill with Icon */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EBE6DF] text-[#B48344] text-[11px] font-semibold tracking-widest uppercase mb-4 sm:mb-5 shadow-2xs">
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{slide.badge}</span>
            </div>

            {/* Dynamic Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#191817] leading-[1.12]">
              {slide.title}
            </h1>

            {/* Dynamic Subtitle */}
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-stone-600 max-w-xl leading-relaxed font-normal">
              {slide.description}
            </p>

            {/* Dual CTAs (Primary & Secondary) */}
            <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-3.5 w-full sm:w-auto">
              <Link
                to={slide.primaryCtaLink}
                className="h-12 px-8 bg-[#191817] hover:bg-black text-white rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-[#B48344]" />
              </Link>

              {slide.isWhatsApp ? (
                <a
                  href={slide.secondaryCtaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-7 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{slide.secondaryCtaText}</span>
                </a>
              ) : (
                <Link
                  to={slide.secondaryCtaLink}
                  className="h-12 px-7 bg-white hover:bg-stone-50 text-[#191817] border border-[#EBE6DF] rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-[0.98]"
                >
                  <span>{slide.secondaryCtaText}</span>
                  <ChevronRight className="w-4 h-4 text-stone-500" />
                </Link>
              )}
            </div>

            {/* 4 Micro Trust Pillars */}
            <div className="mt-9 sm:mt-10 pt-6 border-t border-stone-200/80 w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600">
              {slide.guarantees.map((g, idx) => {
                const IconComponent = g.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-center lg:justify-start gap-2"
                  >
                    <IconComponent className="w-4 h-4 text-[#B48344] shrink-0" />
                    <span className="text-[11px] sm:text-xs font-medium truncate">
                      {g.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: High-Impact Visual Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square sm:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#EBE6DF] shadow-xl group">
              {image ? (
                <Image
                  data={image}
                  alt={slide.productTitle}
                  aspectRatio="4/5"
                  className="w-full h-full object-cover object-center brightness-[1.03] contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
                  sizes="(min-width: 1024px) 450px, 90vw"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-50">
                  ELFY Kuala Lumpur
                </div>
              )}

              {/* Floating Top Pill Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-stone-200/80 px-3.5 py-1.5 rounded-full shadow-md text-[11px] font-semibold text-[#191817] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2B593F]" />
                <span>{slide.floatingTagTop}</span>
              </div>

              {/* Dynamic Discount Tag (if available) */}
              {slide.compareAt > slide.price && (
                <div className="absolute top-4 right-4 bg-[#A83232] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Jimat {Math.round(((slide.compareAt - slide.price) / slide.compareAt) * 100)}%
                </div>
              )}

              {/* Floating Bottom Action Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-stone-200/90 p-4 rounded-2xl shadow-lg flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-[11px] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-stone-700">{slide.ratingText}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#191817]">
                      {slide.currency} {slide.price.toFixed(2)}
                    </div>
                    {slide.compareAt > slide.price && (
                      <div className="text-[10px] text-stone-400 line-through">
                        {slide.currency} {slide.compareAt.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#B48344] font-bold block truncate">
                      {slide.floatingTagBottom}
                    </span>
                    <strong className="text-xs text-[#191817] block font-semibold truncate">
                      {slide.productTitle}
                    </strong>
                  </div>
                  <Link
                    to={slide.productLink}
                    className="h-8 px-3.5 bg-[#191817] hover:bg-black text-white text-xs font-semibold rounded-xl shrink-0 flex items-center justify-center transition-colors shadow-xs"
                  >
                    Beli Segera &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Slider Navigation Arrows & Dot Controls */}
            <div className="flex items-center justify-between w-full max-w-md mt-4 px-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-[#EBE6DF] text-stone-700 flex items-center justify-center transition-all active:scale-95 shadow-2xs"
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 border border-[#EBE6DF] text-stone-700 flex items-center justify-center transition-all active:scale-95 shadow-2xs"
                  aria-label="Slide seterusnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentSlide
                        ? 'w-6 bg-[#191817]'
                        : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Pindah ke slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Auto-Slide Indicator */}
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-medium font-mono">
                {currentSlide + 1} / {totalSlides}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
