import React, { useState, useEffect } from 'react';
import type { Product, ProductVariant } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import { generateWhatsAppOrderUrl } from '../../lib/utils/whatsapp';
import { ShoppingBag, MessageCircle, Star, Flame, Check, Gift } from 'lucide-react';

interface VariantPickerProps {
  product: Product;
  locale?: string;
}

export function VariantPicker({ product, locale = 'ms' }: VariantPickerProps) {
  // Find first available variant or fallback to first
  const firstAvailable =
    product.variants.nodes.find((v) => v.availableForSale) ||
    product.variants.nodes[0];

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    firstAvailable?.id || ''
  );
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const selectedVariant =
    product.variants.nodes.find((v) => v.id === selectedVariantId) ||
    product.variants.nodes[0];

  const isAvailable = selectedVariant?.availableForSale ?? true;
  const currentPrice = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;
  const comparePrice = selectedVariant?.compareAtPrice?.amount;
  const hasDiscount = Boolean(comparePrice && parseFloat(comparePrice) > parseFloat(currentPrice));

  const isShoe =
    product.productType === 'Shoes' ||
    product.handle.startsWith('sepatu-') ||
    product.options.some((o) => o.name.toLowerCase().includes('ukuran') || o.name.toLowerCase().includes('size'));

  const isSingleDefaultVariant =
    product.variants.nodes.length === 1 &&
    product.variants.nodes[0]?.title.toLowerCase() === 'default title';

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;
    setIsAdding(true);

    const displayVariantTitle = isSingleDefaultVariant
      ? (locale === 'ms' ? 'Edisi Lengkap (Kotak Jam Hadiah)' : 'Standard Edition (Gift Box)')
      : isShoe
      ? `Saiz EU ${selectedVariant.title}`
      : selectedVariant.title;

    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: {
          variantId: selectedVariant.id,
          title: product.title,
          variantTitle: displayVariantTitle,
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

  const whatsappDisplayTitle = isSingleDefaultVariant
    ? (locale === 'ms' ? 'Edisi Lengkap' : 'Standard Edition')
    : isShoe
    ? `Saiz EU ${selectedVariant?.title}`
    : selectedVariant?.title;

  const whatsappUrl = generateWhatsAppOrderUrl({
    phone: '601123456789',
    productTitle: product.title,
    variantTitle: whatsappDisplayTitle,
    price: currentPrice,
    productUrl: typeof window !== 'undefined' ? window.location.href : '',
    locale,
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Social Proof Rating & Fast Shipping Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-amber-500 bg-amber-50/80 px-2.5 py-1 rounded-md border border-amber-200/60">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-bold text-neutral-900 ml-1">4.9/5.0</span>
          <span className="text-neutral-500 text-[11px]">(128+ {locale === 'ms' ? 'Ulasan' : 'Reviews'})</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/60">
          <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
          <span>{locale === 'ms' ? '🔥 Permintaan Tinggi di Malaysia' : '🔥 Trending in Malaysia'}</span>
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
              -
              {Math.round(
                ((parseFloat(comparePrice) - parseFloat(currentPrice)) /
                  parseFloat(comparePrice)) *
                  100
              )}
              %
            </span>
          </div>
        )}
      </div>

      {/* Variant Selection Options */}
      {isSingleDefaultVariant ? (
        <div className="p-3.5 bg-[#F7F4EC] rounded-xl border border-[#E8E3DA] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Gift className="w-4 h-4 text-[#B89768] shrink-0" />
            <div>
              <span className="font-bold text-neutral-900 block">
                {locale === 'ms' ? 'Pakej Lengkap Edisi Eksklusif' : 'Exclusive Package Edition'}
              </span>
              <span className="text-[11px] text-neutral-600">
                {locale === 'ms'
                  ? 'Termasuk Kotak Hadiah Premium & Kad Jaminan ELFY'
                  : 'Includes Luxury Gift Box & Official Warranty Card'}
              </span>
            </div>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
            {locale === 'ms' ? 'Sedia Pos' : 'Ready Stock'}
          </span>
        </div>
      ) : (
        product.options.map((option) => (
          <div key={option.id} className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-900 uppercase tracking-wider">
                {option.name.toLowerCase().includes('ukuran') || option.name.toLowerCase().includes('size')
                  ? (locale === 'ms' ? 'Pilih Saiz Kasut (EU)' : 'Select Shoe Size (EU)')
                  : option.name}
              </span>
              <span className="text-[#B89768] font-bold">
                {selectedVariant?.title
                  ? `${locale === 'ms' ? 'Saiz Terpilih: EU ' : 'Selected: EU '} ${selectedVariant.title}`
                  : ''}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {product.variants.nodes.map((variant) => {
                const isSelected = variant.id === selectedVariantId;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`py-3 px-3 rounded-xl text-xs font-bold tracking-wide transition-all border cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'border-[#121212] bg-[#121212] text-white shadow-md scale-102 ring-2 ring-[#B89768]/30'
                        : variant.availableForSale
                        ? 'border-[#E8E3DA] bg-white text-neutral-900 hover:border-neutral-400 hover:bg-stone-50'
                        : 'border-dashed border-stone-300 text-stone-400 bg-stone-50 line-through cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>EU {variant.title}</span>
                    <span className={`text-[9px] font-normal ${isSelected ? 'text-stone-300' : 'text-neutral-500'}`}>
                      {variant.availableForSale
                        ? (locale === 'ms' ? 'Ada Stok' : 'In Stock')
                        : (locale === 'ms' ? 'Habis' : 'Sold Out')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Stock Availability Badge */}
      <div className="flex items-center gap-2 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200">
        {isAvailable ? (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-neutral-800 font-medium">
              {locale === 'ms'
                ? `Saiz ${isSingleDefaultVariant ? '' : `EU ${selectedVariant?.title}`} Sedia Dihantar dari Hub Kuala Lumpur (Pos dalam 24 Jam)`
                : `Size ${isSingleDefaultVariant ? '' : `EU ${selectedVariant?.title}`} In Stock at Kuala Lumpur Hub (Dispatches within 24 hours)`}
            </span>
          </>
        ) : (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
            <span className="text-rose-700 font-medium">
              {locale === 'ms'
                ? `Saiz EU ${selectedVariant?.title} habis stok buat sementara waktu`
                : `Size EU ${selectedVariant?.title} is temporarily out of stock`}
            </span>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {/* Main Add to Bag Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding}
          className={`flex-1 font-bold text-xs uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
            justAdded
              ? 'bg-emerald-700 text-white'
              : 'bg-[#121212] hover:bg-neutral-800 text-white hover:shadow-md'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>{locale === 'ms' ? 'Ditambah ke Beg!' : 'Added to Bag!'}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#B89768]" />
              <span>
                {isAdding
                  ? (locale === 'ms' ? 'Memasukkan...' : 'Adding...')
                  : !isAvailable
                  ? (locale === 'ms' ? 'Saiz Habis Stok' : 'Size Sold Out')
                  : (locale === 'ms' ? 'Tambah ke Beg Pembelian' : 'Add to Shopping Bag')}
              </span>
            </>
          )}
        </button>

        {/* WhatsApp Order Direct Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 font-semibold text-xs tracking-wide py-4 px-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
          <span>{locale === 'ms' ? 'Pesan via WhatsApp' : 'Order via WhatsApp'}</span>
        </a>
      </div>

      {/* WhatsApp Online Concierge Micro-Card */}
      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="font-medium text-[11px]">
            {locale === 'ms'
              ? 'Khidmat Pelanggan ELFY Online • Balas Segera < 5 Minit'
              : 'ELFY Concierge Online • Quick Response < 5 Mins'}
          </span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline text-[11px] text-emerald-800 hover:text-emerald-950"
        >
          {locale === 'ms' ? 'Tanya Saiz' : 'Ask Size'}
        </a>
      </div>
    </div>
  );
}
