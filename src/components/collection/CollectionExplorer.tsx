import React, { useState, useMemo } from 'react';
import type { Product } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import {
  LayoutGrid,
  Footprints,
  Watch,
  Sparkles,
  ArrowUpRight,
  ArrowUpDown,
  Grid2X2,
  Grid3X3,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  PackageCheck,
  MessageCircle,
} from 'lucide-react';

interface CollectionExplorerProps {
  initialProducts: Product[];
  currentHandle: string;
  shoeCount: number;
  watchCount: number;
  totalCount: number;
  title: string;
  subtitle: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'title-asc';
type GridDensity = '3-col' | '4-col';

export default function CollectionExplorer({
  initialProducts,
  currentHandle,
  shoeCount,
  watchCount,
  totalCount,
  title,
  subtitle,
}: CollectionExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(currentHandle);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridDensity, setGridDensity] = useState<GridDensity>('4-col');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'shoes') {
      return initialProducts.filter((p) => p.productType === 'Shoes');
    }
    if (selectedCategory === 'watches') {
      return initialProducts.filter((p) => p.productType === 'Watches');
    }
    return initialProducts;
  }, [initialProducts, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort(
          (a, b) =>
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
        );
      case 'price-desc':
        return list.sort(
          (a, b) =>
            parseFloat(b.priceRange.minVariantPrice.amount) -
            parseFloat(a.priceRange.minVariantPrice.amount)
        );
      case 'title-asc':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'featured':
      default:
        return list;
    }
  }, [filteredProducts, sortBy]);

  const activeCategoryTitle =
    selectedCategory === 'shoes'
      ? 'Koleksi Footwear & Sneakers'
      : selectedCategory === 'watches'
        ? 'Koleksi Timepieces & Jam Tangan'
        : 'Semua Koleksi';

  const activeCategorySubtitle =
    selectedCategory === 'shoes'
      ? 'Rekaan kasut sukan dan kasual dengan kusyen ergonomik lembut, tapak anti-slip, dan bahan tahan lasak.'
      : selectedCategory === 'watches'
        ? 'Koleksi jam tangan analog & quartz eksklusif berketepatan tinggi disertakan kotak hadiah premium percuma.'
        : 'Jelajahi rekaan penuh kasut lelaki sartorial dan jam tangan eksklusif ELFY Kuala Lumpur.';
  return (
    <div class="min-h-screen bg-[#FDFBF7] text-neutral-950">
      {/* 1. Breadcrumbs Header */}
      <div class="border-b border-[#E8E3DA] bg-[#F7F4EC]/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav class="flex items-center gap-2 text-[11px] sm:text-xs text-neutral-500 font-medium">
            <a href="/" class="hover:text-neutral-950 transition-colors">
              Utama
            </a>
            <ChevronRight class="w-3 h-3 text-neutral-400" />
            <a href="/collections/all" class="hover:text-neutral-950 transition-colors">
              Koleksi
            </a>
            <ChevronRight class="w-3 h-3 text-neutral-400" />
            <span class="text-neutral-900 font-bold font-serif">{activeCategoryTitle}</span>
          </nav>
        </div>
      </div>

      {/* 2. Editorial Luxury Hero Banner */}
      <div class="relative bg-gradient-to-b from-[#181818] via-[#141414] to-[#0D0D0D] text-white border-b border-neutral-800 overflow-hidden">
        {/* Subtle Decorative Luxury Glow */}
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-[#B89768]/10 rounded-full blur-3xl pointer-events-none" />
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-[#B89768]/5 rounded-full blur-3xl pointer-events-none" />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 relative z-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Title & Description */}
            <div class="lg:col-span-7 space-y-4 text-left">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B89768]/15 border border-[#B89768]/30 text-[#D4AF37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles class="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Koleksi Eksklusif Kuala Lumpur 2025</span>
              </div>

              <h1 class="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-stone-100 leading-[1.1]">
                {activeCategoryTitle}
              </h1>

              <p class="text-xs sm:text-sm lg:text-base text-stone-300 max-w-2xl leading-relaxed font-light">
                {activeCategorySubtitle}
              </p>

              {/* Meta Stats Chips */}
              <div class="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-mono text-stone-300">
                <span class="inline-flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                  <CheckCircle2 class="w-3.5 h-3.5 text-[#B89768]" />
                  <span>{sortedProducts.length} Rekaan Tersedia</span>
                </span>
                <span class="inline-flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                  <PackageCheck class="w-3.5 h-3.5 text-[#B89768]" />
                  <span>Ready Stock Lembah Klang</span>
                </span>
                <span class="inline-flex items-center gap-1.5 bg-neutral-900/80 px-3 py-1.5 rounded-lg border border-neutral-800">
                  <Truck class="w-3.5 h-3.5 text-[#B89768]" />
                  <span>Penghantaran 1–3 Hari</span>
                </span>
              </div>
            </div>

            {/* Right Column: Desktop Editorial Guarantee Box */}
            <div class="hidden lg:block lg:col-span-5">
              <div class="bg-neutral-900/60 backdrop-blur-md rounded-2xl border border-neutral-800/80 p-6 space-y-4 shadow-xl">
                <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span class="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                    Standard Jaminan ELFY
                  </span>
                  <span class="text-[10px] text-stone-300 font-mono">KL Express</span>
                </div>

                <div class="space-y-3.5 text-xs text-stone-200">
                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-[#B89768]/15 border border-[#B89768]/30 text-[#D4AF37] shrink-0 mt-0.5">
                      <Truck class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="font-bold text-stone-100">Penghantaran Percuma Semenanjung</p>
                      <p class="text-stone-300 text-[11px] leading-relaxed">
                        Nikmati pos percuma untuk semua pesanan bernilai RM 150 ke atas via kurier terpantas.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-[#B89768]/15 border border-[#B89768]/30 text-[#D4AF37] shrink-0 mt-0.5">
                      <RotateCcw class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="font-bold text-stone-100">Jaminan Pertukaran Saiz 7 Hari</p>
                      <p class="text-stone-300 text-[11px] leading-relaxed">
                        Kasut tidak muat? Tukar saiz dengan mudah dan pantas melalui khidmat pelanggan kami.
                      </p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3">
                    <div class="p-2 rounded-lg bg-[#B89768]/15 border border-[#B89768]/30 text-[#D4AF37] shrink-0 mt-0.5">
                      <ShieldCheck class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="font-bold text-stone-100">100% Rekaan Terpilih & QC Ketat</p>
                      <p class="text-stone-300 text-[11px] leading-relaxed">
                        Setiap kasut dan jam tangan diperiksa rapi sebelum dibungkus dalam kotak eksklusif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sticky Filter & Sorting Toolbar */}
      <div class="bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E3DA] sticky top-20 z-30 shadow-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            {/* Category Navigation Pills */}
            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                class={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-[#E8E3DA] hover:bg-stone-100 hover:border-neutral-400'
                }`}
              >
                <LayoutGrid class="w-3.5 h-3.5" />
                <span>Semua</span>
                <span
                  class={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === 'all'
                      ? 'bg-neutral-800 text-stone-200'
                      : 'bg-stone-100 text-neutral-600'
                  }`}
                >
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('shoes')}
                class={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  selectedCategory === 'shoes'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-[#E8E3DA] hover:bg-stone-100 hover:border-neutral-400'
                }`}
              >
                <Footprints class="w-3.5 h-3.5" />
                <span>Footwear & Sneakers</span>
                <span
                  class={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === 'shoes'
                      ? 'bg-neutral-800 text-stone-200'
                      : 'bg-stone-100 text-neutral-600'
                  }`}
                >
                  {shoeCount}
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('watches')}
                class={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  selectedCategory === 'watches'
                    ? 'bg-[#121212] text-white shadow-sm'
                    : 'bg-white text-neutral-700 border border-[#E8E3DA] hover:bg-stone-100 hover:border-neutral-400'
                }`}
              >
                <Watch class="w-3.5 h-3.5" />
                <span>Timepieces & Jam</span>
                <span
                  class={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === 'watches'
                      ? 'bg-neutral-800 text-stone-200'
                      : 'bg-stone-100 text-neutral-600'
                  }`}
                >
                  {watchCount}
                </span>
              </button>
            </div>

            {/* Desktop Sort & View Density Controls */}
            <div class="flex items-center justify-between md:justify-end gap-3 sm:gap-4 shrink-0">
              {/* Product Counter Display */}
              <span class="text-xs text-neutral-500 font-mono hidden sm:inline-block">
                Menunjukkan <strong class="text-neutral-900 font-bold">{sortedProducts.length}</strong> rekaan
              </span>

              {/* Sorting Selector */}
              <div class="relative flex items-center bg-white border border-[#E8E3DA] rounded-xl px-3 py-1.5 hover:border-neutral-400 transition-colors shadow-2xs">
                <ArrowUpDown class="w-3.5 h-3.5 text-[#B89768] mr-2 shrink-0" />
                <label for="sort-select" class="sr-only">
                  Susun mengikut
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  class="bg-transparent text-xs font-bold text-neutral-800 tracking-wide focus:outline-hidden cursor-pointer pr-1"
                >
                  <option value="featured">Pilihan Disyorkan</option>
                  <option value="price-asc">Harga: Rendah ke Tinggi</option>
                  <option value="price-desc">Harga: Tinggi ke Rendah</option>
                  <option value="title-asc">Nama: A ke Z</option>
                </select>
              </div>

              {/* Grid Density Toggle (Desktop Only) */}
              <div class="hidden lg:flex items-center bg-white border border-[#E8E3DA] rounded-xl p-1 shadow-2xs gap-0.5">
                <button
                  type="button"
                  onClick={() => setGridDensity('3-col')}
                  title="Paparan 3 Kolum (Spacious)"
                  class={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    gridDensity === '3-col'
                      ? 'bg-[#121212] text-white shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-stone-100'
                  }`}
                >
                  <Grid2X2 class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setGridDensity('4-col')}
                  title="Paparan 4 Kolum (Compact)"
                  class={`p-1.5 rounded-lg transition-all cursor-pointer ${
                    gridDensity === '4-col'
                      ? 'bg-[#121212] text-white shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-stone-100'
                  }`}
                >
                  <Grid3X3 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Main Product Catalog Grid */}
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {sortedProducts.length === 0 ? (
          <div class="text-center py-20 bg-white rounded-2xl border border-[#E8E3DA] p-8 max-w-lg mx-auto shadow-xs">
            <SlidersHorizontal class="w-12 h-12 text-[#B89768] mx-auto mb-3 stroke-[1.5]" />
            <h3 class="font-serif text-xl font-bold text-neutral-900 mb-1">
              Tiada Rekaan Dijumpai
            </h3>
            <p class="text-xs text-neutral-500 mb-6">
              Sila cuba tukar pilihan kategori atau kriteria penapisan anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSortBy('featured');
              }}
              class="px-6 py-2.5 bg-[#121212] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Set Semula Penapis
            </button>
          </div>
        ) : (
          <div
            class={`grid gap-3 sm:gap-6 ${
              gridDensity === '3-col'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}
          >
            {sortedProducts.map((product) => {
              const productUrl = `/products/${product.handle}`;
              const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
              const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount
                ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                : null;
              const hasDiscount = Boolean(comparePrice && comparePrice > minPrice);
              const discountPercent =
                hasDiscount && comparePrice
                  ? Math.round(((comparePrice - minPrice) / comparePrice) * 100)
                  : 0;

              const isShoe = product.productType === 'Shoes';
              const isHovered = hoveredCard === product.id;
              const images = product.images?.nodes || [];
              const primaryImage = product.featuredImage?.url || images[0]?.url || '/images/placeholder.jpg';
              const secondaryImage = images[1]?.url || primaryImage;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredCard(product.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  class="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E8E3DA] overflow-hidden hover:border-neutral-900 hover:shadow-xl transition-all duration-300 w-full"
                >
                  {/* Product Image Area with Smooth Reveal */}
                  <a href={productUrl} class="relative aspect-square w-full overflow-hidden bg-stone-100 block">
                    {/* Primary Image */}
                    <img
                      src={primaryImage}
                      alt={product.featuredImage?.altText || product.title}
                      class={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ${
                        isHovered && images.length > 1 ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
                      }`}
                      loading="lazy"
                    />

                    {/* Secondary Image (Hover on Desktop) */}
                    {images.length > 1 && (
                      <img
                        src={secondaryImage}
                        alt={`${product.title} view 2`}
                        class={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-500 ${
                          isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}
                        loading="lazy"
                      />
                    )}

                    {/* Luxury Badges on Top Left */}
                    <div class="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 pointer-events-none">
                      {hasDiscount && (
                        <span class="bg-[#121212] text-[#E8C58D] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md border border-[#B89768]/30">
                          Jimat {discountPercent}%
                        </span>
                      )}
                      <span class="bg-white/95 backdrop-blur-xs text-neutral-800 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#E8E3DA] shadow-2xs">
                        {isShoe ? 'Footwear' : 'Horology'}
                      </span>
                    </div>

                    {/* Quick View Button on Desktop Hover */}
                    <div class="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div class="w-full py-2 bg-neutral-900/90 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider rounded-xl text-center flex items-center justify-center gap-1.5 shadow-lg hover:bg-neutral-950">
                        <span>Lihat Rekaan</span>
                        <ArrowUpRight class="w-3.5 h-3.5 text-[#B89768]" />
                      </div>
                    </div>
                  </a>

                  {/* Card Editorial Info */}
                  <div class="p-3 sm:p-4.5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 bg-[#FDFBF7]/40">
                    <div class="space-y-1">
                      {/* Micro Brand Header */}
                      <div class="flex items-center gap-1 text-[9px] sm:text-[10px] text-[#B89768] font-bold uppercase tracking-widest">
                        <Sparkles class="w-2.5 h-2.5 text-[#B89768]" />
                        <span>ELFY KL</span>
                      </div>

                      {/* Product Title */}
                      <h3 class="font-serif text-xs sm:text-sm font-bold text-neutral-950 line-clamp-1 group-hover:text-[#B89768] transition-colors leading-snug">
                        <a href={productUrl}>{product.title}</a>
                      </h3>

                      {/* Sizing Matrix or Specs */}
                      {isShoe ? (
                        <div class="pt-0.5">
                          <p class="text-[9px] sm:text-[11px] text-neutral-500 font-mono flex items-center gap-1">
                            <span>Saiz:</span>
                            <span class="text-neutral-800 font-bold">EU 39–44</span>
                            <span class="text-neutral-400 font-normal">(6 Pilihan)</span>
                          </p>
                        </div>
                      ) : (
                        <div class="pt-0.5">
                          <p class="text-[9px] sm:text-[11px] text-neutral-500 line-clamp-1 flex items-center gap-1">
                            <span class="text-[#B89768]">✦</span>
                            <span>Kotak Hadiah Premium Termasuk</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price & Action Section */}
                    <div class="pt-2 border-t border-[#E8E3DA] flex items-center justify-between gap-1">
                      <div class="flex flex-col min-w-0">
                        <span class="font-mono text-xs sm:text-base font-bold text-neutral-950 truncate">
                          {formatRinggit(minPrice)}
                        </span>
                        {hasDiscount && comparePrice && (
                          <span class="font-mono text-[9px] sm:text-[11px] text-neutral-400 line-through truncate">
                            {formatRinggit(comparePrice)}
                          </span>
                        )}
                      </div>

                      <a
                        href={productUrl}
                        class="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-neutral-900 bg-white hover:bg-neutral-900 hover:text-white px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-[#E8E3DA] hover:border-neutral-900 transition-all shrink-0 shadow-2xs flex items-center gap-1"
                      >
                        <span>Pilih</span>
                        <ArrowUpRight class="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Editorial Reassurance & VIP Concierge Footer Banner */}
      <div class="border-t border-[#E8E3DA] bg-white py-12 sm:py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div class="flex items-start gap-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E3DA]">
              <div class="p-3 rounded-xl bg-[#121212] text-[#B89768] shrink-0">
                <Truck class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif text-sm font-bold text-neutral-900">
                  Penghantaran Percuma Semenanjung
                </h4>
                <p class="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Pesanan melebihi RM 150 layak untuk pos percuma ke seluruh Semenanjung Malaysia dalam 1-3 hari bekerja.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E3DA]">
              <div class="p-3 rounded-xl bg-[#121212] text-[#B89768] shrink-0">
                <RotateCcw class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif text-sm font-bold text-neutral-900">
                  Pertukaran Saiz 7 Hari Mudah
                </h4>
                <p class="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Jaminan penggantian saiz tanpa syarat rumit sekiranya kasut yang diterima tidak selesa atau padan.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4 p-5 rounded-2xl bg-[#FDFBF7] border border-[#E8E3DA]">
              <div class="p-3 rounded-xl bg-[#121212] text-[#B89768] shrink-0">
                <MessageCircle class="w-5 h-5" />
              </div>
              <div>
                <h4 class="font-serif text-sm font-bold text-neutral-900">
                  Khidmat VIP Concierge WhatsApp
                </h4>
                <p class="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Perlukan cadangan gaya atau bantuan saiz? Hubungi stylist peribadi ELFY secara langsung di WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
