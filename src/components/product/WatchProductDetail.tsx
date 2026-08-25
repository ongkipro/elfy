import React, { useState } from 'react';
import type { Product } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import {
  ShoppingBag,
  Star,
  Check,
  ChevronDown,
  Watch,
  Sparkles,
  Gift,
  ArrowRight,
  Loader2,
  Droplets,
  Gauge,
  Shield,
  Layers,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { parseShopifyDescription } from './ParsedProductDescription';

interface WatchProductDetailProps {
  product: Product;
  locale?: string;
}

export function WatchProductDetail({ product, locale = 'ms' }: WatchProductDetailProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    specs: true,
    care: false,
    shipping: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedVariant = product.variants.nodes[0];
  const isAvailable = selectedVariant?.availableForSale ?? true;
  const currentPrice = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const comparePrice = selectedVariant?.compareAtPrice?.amount;
  const hasDiscount = Boolean(comparePrice && parseFloat(comparePrice) > parseFloat(currentPrice));

  const parsed = parseShopifyDescription(product.descriptionHtml, locale);

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;
    setIsAdding(true);

    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: {
          variantId: selectedVariant.id,
          title: product.title,
          variantTitle: 'Edisi Lengkap + Kotak Jam Hadiah',
          price: currentPrice,
          image: selectedVariant.image?.url || product.featuredImage.url,
        },
      })
    );

    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      window.dispatchEvent(new CustomEvent('open-cart'));
      setTimeout(() => setJustAdded(false), 2500);
    }, 350);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !isAvailable || isBuyingNow) return;
    setIsBuyingNow(true);

    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: [{ merchandiseId: selectedVariant.id, quantity: 1 }],
        }),
      });
      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const rawId = selectedVariant.id.split('/').pop();
        window.location.href = `https://vvxgev-3p.myshopify.com/cart/${rawId}:1`;
      }
    } catch {
      const rawId = selectedVariant.id.split('/').pop();
      window.location.href = `https://vvxgev-3p.myshopify.com/cart/${rawId}:1`;
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tag & Title */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B89768] mb-1">
          <Watch className="w-3.5 h-3.5" />
          <span>VELLUM Horology • Jam Tangan Eksklusif</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950 leading-tight">
          {product.title}
        </h1>
      </div>

      {/* Social Proof Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-bold text-neutral-900 ml-1">4.9/5.0</span>
          <span className="text-neutral-500 text-[11px]">(96+ Ulasan Jam Tangan)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-800 bg-[#F7F4EC] px-2.5 py-1 rounded-md border border-[#E8E3DA]">
          <Sparkles className="w-3.5 h-3.5 text-[#B89768]" />
          <span>Kualiti Enjin Jepun &amp; Kaca Kalis Calar</span>
        </div>
      </div>

      {/* Price Header */}
      <div className="flex items-baseline gap-3 pb-4 border-b border-[#E8E3DA]">
        <span className="font-mono text-3xl sm:text-4xl font-bold text-neutral-950">
          {formatRinggit(currentPrice)}
        </span>
        {hasDiscount && comparePrice && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-base text-neutral-400 line-through">
              {formatRinggit(comparePrice)}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
              -{Math.round(((parseFloat(comparePrice) - parseFloat(currentPrice)) / parseFloat(comparePrice)) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* HOROLOGY QUICK METRIC STRIP (WITH LUCIDE ICONS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-3 bg-[#F7F4EC]/80 rounded-xl border border-[#E8E3DA] flex flex-col items-center text-center">
          <Gauge className="w-4 h-4 text-[#B89768] mb-1" />
          <span className="text-[9px] uppercase font-bold text-neutral-500 block">Movement</span>
          <span className="font-semibold text-neutral-950 text-xs mt-0.5 block">Quartz / Japan</span>
        </div>

        <div className="p-3 bg-[#F7F4EC]/80 rounded-xl border border-[#E8E3DA] flex flex-col items-center text-center">
          <Shield className="w-4 h-4 text-[#B89768] mb-1" />
          <span className="text-[9px] uppercase font-bold text-neutral-500 block">Kaca</span>
          <span className="font-semibold text-neutral-950 text-xs mt-0.5 block">Anti-Calar</span>
        </div>

        <div className="p-3 bg-[#F7F4EC]/80 rounded-xl border border-[#E8E3DA] flex flex-col items-center text-center">
          <Droplets className="w-4 h-4 text-[#B89768] mb-1" />
          <span className="text-[9px] uppercase font-bold text-neutral-500 block">Kalis Air</span>
          <span className="font-semibold text-neutral-950 text-xs mt-0.5 block">3 ATM Splash</span>
        </div>

        <div className="p-3 bg-[#F7F4EC]/80 rounded-xl border border-[#E8E3DA] flex flex-col items-center text-center">
          <Watch className="w-4 h-4 text-[#B89768] mb-1" />
          <span className="text-[9px] uppercase font-bold text-neutral-500 block">Kerangka</span>
          <span className="font-semibold text-neutral-950 text-xs mt-0.5 block">Alloy / Steel</span>
        </div>
      </div>

      {/* PACKAGE INCLUSION BANNER WITH LUXURY GLASS EFFECT */}
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-neutral-950/90 via-stone-900/85 to-neutral-950/90 backdrop-blur-xl border border-[#B89768]/30 shadow-xl text-stone-100">
        {/* Ambient Glass Light Accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#B89768]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#B89768]/15 border border-[#B89768]/30 text-[#B89768] shrink-0 backdrop-blur-md shadow-xs">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-stone-100 block tracking-wide">
                Pakej Hadiah Jam Mewah Termasuk
              </span>
              <span className="text-xs text-stone-300 mt-0.5 block">
                Disertakan Kotak Hadiah Eksklusif &amp; Kad Jaminan Ketulenan
              </span>
            </div>
          </div>

          {/* Glass Effect Ready Stock Badge */}
          <div className="self-start sm:self-center shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 backdrop-blur-md shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ready Stock</span>
            </span>
          </div>
        </div>
      </div>

      {/* LUXURY HOVER ACTION BUTTONS */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Direct Checkout Button (Primary Gold Glow Hover) */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={!isAvailable || isBuyingNow}
          className="group relative w-full bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-[0.18em] py-4 px-6 rounded-xl flex items-center justify-center gap-2 border border-neutral-900 hover:border-[#B89768]/60 shadow-md hover:shadow-xl hover:shadow-[#B89768]/15 active:scale-[0.99] transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Subtle Shimmer Hover Wave */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></span>

          {isBuyingNow ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#B89768]" />
              <span>Menyediakan Pembayaran...</span>
            </>
          ) : (
            <>
              <span className="group-hover:text-stone-100 transition-colors">
                Beli Terus (Bayaran Selamat)
              </span>
              <ArrowRight className="w-4 h-4 text-[#B89768] group-hover:translate-x-1 transition-transform duration-300" />
            </>
          )}
        </button>

        {/* Add to Bag Button (Secondary Invert Hover) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`group w-full font-bold text-xs uppercase tracking-[0.15em] py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 border-2 transition-all duration-300 cursor-pointer active:scale-[0.99] ${
            justAdded
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-500/30'
              : 'bg-white hover:bg-neutral-950 text-neutral-950 hover:text-white border-neutral-950 hover:border-neutral-950 shadow-2xs hover:shadow-lg'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300 animate-scaleIn" />
              <span>Ditambah ke Beg!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#B89768] group-hover:scale-110 group-hover:text-[#B89768] transition-transform duration-300" />
              <span>{isAdding ? 'Memasukkan...' : 'Tambah ke Beg Pembelian'}</span>
            </>
          )}
        </button>
      </div>

      {/* WATCH MINIMALIST ACCORDION */}
      <div className="border-t border-b border-[#E8E3DA] divide-y divide-[#E8E3DA] text-neutral-800 pt-2">
        {/* 1. Spesifikasi Teknikal & Rekaan Jam */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('specs')}
            className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
          >
            <span className="group-hover:text-[#B89768] transition-colors flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B89768]" />
              <span>Spesifikasi Teknikal &amp; Rekaan Jam</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openSections.specs ? 'rotate-180 text-neutral-900' : ''}`} />
          </button>

          {openSections.specs && (
            <div className="pt-4 pb-2 space-y-4 text-xs sm:text-[13px] text-neutral-700 leading-relaxed animate-fadeIn">
              {parsed.map((sec, idx) => {
                if (sec.type === 'intro' && sec.text) {
                  return (
                    <p key={idx} className="text-neutral-800 leading-relaxed">
                      {sec.text}
                    </p>
                  );
                }

                // RENDER WATCH SPECIFICATIONS AS CLEAN 2-COLUMN TABLE
                if (sec.type === 'specs' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2.5 pt-2">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase tracking-wider">
                        {sec.title}
                      </h5>
                      <div className="border border-[#E8E3DA] rounded-xl overflow-hidden divide-y divide-[#E8E3DA] bg-white">
                        {sec.items.map((item, i) => (
                          <div
                            key={i}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 text-xs gap-1 sm:gap-4 ${
                              i % 2 === 0 ? 'bg-[#FDFBF7]' : 'bg-white'
                            }`}
                          >
                            <span className="font-semibold text-neutral-900 sm:w-1/3 shrink-0">
                              {item.label || 'Spesifikasi'}
                            </span>
                            <span className="text-neutral-700 sm:w-2/3 sm:text-right font-normal">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (sec.type === 'features' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2 pt-2">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase tracking-wider">
                        {sec.title}
                      </h5>
                      <ul className="space-y-1.5 pl-0.5">
                        {sec.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B89768] mt-1.5 shrink-0" />
                            <span>
                              {item.label && <strong className="text-neutral-950 font-semibold">{item.label}: </strong>}
                              {item.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                if (sec.type === 'package' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2 pt-2">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#B89768]" />
                        <span>{sec.title}</span>
                      </h5>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {sec.items.map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-lg text-neutral-800 border border-stone-200">
                            <span className="w-1 h-1 rounded-full bg-neutral-900" />
                            <span>{item.value}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>

        {/* 2. Ketahanan Air & Penjagaan Jam */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('care')}
            className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
          >
            <span className="group-hover:text-[#B89768] transition-colors flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#B89768]" />
              <span>Ketahanan Air (3 ATM) &amp; Cara Penjagaan</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openSections.care ? 'rotate-180 text-neutral-900' : ''}`} />
          </button>

          {openSections.care && (
            <div className="pt-4 pb-2 space-y-2.5 text-xs text-neutral-700 leading-relaxed animate-fadeIn">
              <p>
                <strong>Ketahanan Percikan Harian (3 ATM):</strong> Tahan terhadap percikan air hujan, basuh tangan dan peluh. Elakkan menekan butang kronograf semasa berada di dalam air.
              </p>
              <p>
                <strong>Penjagaan Kaca:</strong> Kaca mineral kristal kalis calar boleh dibersihkan menggunakan kain mikrofiber lembut.
              </p>
            </div>
          )}
        </div>

        {/* 3. Penghantaran & Jaminan Enjin */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('shipping')}
            className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
          >
            <span className="group-hover:text-[#B89768] transition-colors flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B89768]" />
              <span>Penghantaran Selamat &amp; Jaminan Ketulenan</span>
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openSections.shipping ? 'rotate-180 text-neutral-900' : ''}`} />
          </button>

          {openSections.shipping && (
            <div className="pt-4 pb-2 space-y-2.5 text-xs text-neutral-700 leading-relaxed animate-fadeIn">
              <p>
                <strong>Penghantaran:</strong> Dibalut dengan perlindungan gelembung tebal (extra bubble wrap). 2–3 hari Semenanjung (Percuma RM 150+), 3–5 hari Sabah/Sarawak.
              </p>
              <p>
                <strong>Jaminan 100% Tulen:</strong> Setiap jam tangan melalui ujian ketepatan masa sebelum dibungkus.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
