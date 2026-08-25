import React, { useState, useEffect } from 'react';
import type { Product } from '../../lib/shopify/types';
import { formatRinggit } from '../../lib/utils/currency';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface StickyAddToCartProps {
  product: Product;
}

export function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const selectedVariant = product.variants.nodes[0];
  const isAvailable = selectedVariant?.availableForSale ?? true;
  const currentPrice = selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount;

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 420px
      if (window.scrollY > 420) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedVariant || !isAvailable) return;
    window.dispatchEvent(
      new CustomEvent('add-to-cart', {
        detail: {
          variantId: selectedVariant.id,
          title: product.title,
          variantTitle: selectedVariant.title,
          price: currentPrice,
          image: selectedVariant.image?.url || product.featuredImage.url,
        },
      })
    );
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-lg border-t border-[#E8E3DA] p-3 sm:hidden shadow-2xl animate-slideUp">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={product.featuredImage?.url || '/images/placeholder.jpg'}
            alt={product.title}
            className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0 border border-[#E8E3DA]"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-neutral-950 truncate block">
              {product.title}
            </span>
            <span className="font-mono text-xs font-bold text-[#B89768]">
              {formatRinggit(currentPrice)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="bg-[#121212] hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 shrink-0 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#B89768]" />
          <span>{isAvailable ? 'Tambah' : 'Habis'}</span>
        </button>
      </div>
    </div>
  );
}
