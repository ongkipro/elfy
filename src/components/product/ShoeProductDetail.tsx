import React, { useState } from 'react';
import type { Product } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import { ShoppingBag, Star, Flame, Check, ChevronDown, RotateCcw, ArrowRight, Loader2, Gift, Lightbulb } from 'lucide-react';
import { parseShopifyDescription } from './ParsedProductDescription';

interface ShoeProductDetailProps {
  product: Product;
  locale?: string;
}

export function ShoeProductDetail({ product, locale = 'ms' }: ShoeProductDetailProps) {
  const firstAvailable =
    product.variants.nodes.find((v) => v.availableForSale) ||
    product.variants.nodes[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(firstAvailable?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    shipping: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const selectedVariant =
    product.variants.nodes.find((v) => v.id === selectedVariantId) ||
    product.variants.nodes[0];

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
          variantTitle: `Saiz EU ${selectedVariant.title}`,
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
          <span>ELFY Footwear • Kasut Lelaki</span>
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
          <span className="text-neutral-500 text-[11px]">(128+ Ulasan Kasut)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/60">
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          <span>Laris di Semenanjung &amp; Sabah/Sarawak</span>
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

      {/* SHOE SIZE SELECTOR GRID */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-neutral-950 uppercase tracking-wider">
            Pilih Saiz Kasut (EU)
          </span>
          <span className="text-[#B89768] font-bold">
            {selectedVariant?.title ? `Saiz Dipilih: EU ${selectedVariant.title}` : ''}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
          {product.variants.nodes.map((variant) => {
            const isSelected = variant.id === selectedVariantId;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`py-3 px-2 rounded-xl text-xs font-bold tracking-wide transition-all border cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'border-[#121212] bg-[#121212] text-white shadow-md scale-102 ring-2 ring-[#B89768]/40'
                    : variant.availableForSale
                    ? 'border-[#E8E3DA] bg-white text-neutral-900 hover:border-neutral-900 hover:bg-stone-50 hover:shadow-xs'
                    : 'border-dashed border-stone-300 text-stone-400 bg-stone-50 line-through cursor-not-allowed opacity-50'
                }`}
              >
                <span>EU {variant.title}</span>
                <span className={`text-[9px] font-normal ${isSelected ? 'text-stone-300' : 'text-neutral-500'}`}>
                  {variant.availableForSale ? 'Ada Stok' : 'Habis'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-start gap-1.5 text-[11px] text-neutral-600 bg-[#F7F4EC]/60 p-2.5 rounded-lg border border-[#E8E3DA]">
          <Lightbulb className="w-3.5 h-3.5 text-[#B89768] shrink-0 mt-0.5" />
          <p>
            <em>Tips Saiz: Ukuran mengikut saiz standard Malaysia. Jika tapak kaki jenis lebar, disyorkan pilih 1 saiz lebih besar.</em>
          </p>
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
              <span>{isAdding ? 'Memasukkan...' : !isAvailable ? 'Saiz Habis Stok' : 'Tambah ke Beg Pembelian'}</span>
            </>
          )}
        </button>
      </div>

      {/* Shoe-Specific Trust Pill */}
      <div className="p-3.5 bg-[#F7F4EC] rounded-xl border border-[#E8E3DA] flex items-center justify-between text-xs text-neutral-800">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#B89768] shrink-0" />
          <span className="font-semibold text-[11px]">Jaminan Tukar Saiz 7 Hari Percuma Jika Tak Muat</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">100% Selamat</span>
      </div>

      {/* SHOE MINIMALIST ACCORDION */}
      <div className="border-t border-b border-[#E8E3DA] divide-y divide-[#E8E3DA] text-neutral-800 pt-2">
        {/* 1. Detail Kasut & Panduan Insole (cm) */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('details')}
            className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
          >
            <span className="group-hover:text-[#B89768] transition-colors">
              Ciri-Ciri Kasut &amp; Panduan Insole (cm)
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openSections.details ? 'rotate-180 text-neutral-900' : ''}`} />
          </button>

          {openSections.details && (
            <div className="pt-4 pb-2 space-y-4 text-xs sm:text-[13px] text-neutral-700 leading-relaxed animate-fadeIn">
              {parsed.map((sec, idx) => {
                if (sec.type === 'intro' && sec.text) {
                  return <p key={idx} className="text-neutral-800">{sec.text}</p>;
                }
                if (sec.type === 'features' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2 pt-1">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase">{sec.title}</h5>
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
                if (sec.type === 'specs' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2 pt-1">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase">{sec.title}</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {sec.items.map((item, i) => (
                          <div key={i} className="p-2.5 bg-[#F7F4EC]/80 rounded-lg border border-[#E8E3DA] flex items-center justify-between text-xs">
                            <span className="text-neutral-600 font-medium">{item.label || item.value}</span>
                            {item.label && <span className="font-mono font-bold text-neutral-900">{item.value}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sec.type === 'package' && sec.items) {
                  return (
                    <div key={idx} className="space-y-2 pt-1">
                      <h5 className="font-bold text-neutral-950 text-xs uppercase flex items-center gap-1.5">
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

        {/* 2. Penghantaran Pos Laju / J&T */}
        <div className="py-4">
          <button
            type="button"
            onClick={() => toggle('shipping')}
            className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
          >
            <span className="group-hover:text-[#B89768] transition-colors">
              Penghantaran &amp; Polisi Pertukaran Saiz
            </span>
            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${openSections.shipping ? 'rotate-180 text-neutral-900' : ''}`} />
          </button>

          {openSections.shipping && (
            <div className="pt-4 pb-2 space-y-2.5 text-xs text-neutral-700 leading-relaxed animate-fadeIn">
              <p>
                <strong>Semenanjung:</strong> 2 – 3 hari bekerja via Pos Laju / J&amp;T Express. <span className="text-emerald-800 font-bold">Penghantaran Percuma untuk pesanan RM 150 ke atas</span>.
              </p>
              <p>
                <strong>Sabah &amp; Sarawak:</strong> 3 – 5 hari bekerja (Kadar rata RM 15.00).
              </p>
              <p>
                <strong>Tukar Saiz:</strong> Boleh tukar saiz dalam 7 hari jika kasut kurang muat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
