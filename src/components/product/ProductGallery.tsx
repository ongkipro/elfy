import React, { useState, useRef } from 'react';
import type { Image } from '../../lib/shopify/types';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface ProductGalleryProps {
  images: Image[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  const activeImage = images[activeIndex] || images[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:sticky lg:top-24">
      {/* Main Large Image Display */}
      <div
        className="relative aspect-square w-full bg-stone-100 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E3DA] shadow-xs group select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={activeImage.url}
          alt={activeImage.altText || `${title} view ${activeIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300 pointer-events-none"
        />

        {/* Brand Tag Overlay */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/75 backdrop-blur-md text-stone-100 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-sm">
          <Sparkles className="w-3 h-3 text-[#B89768]" />
          <span>VELLUM Atelier</span>
        </div>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-neutral-900 items-center justify-center shadow-md hover:bg-white transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm text-neutral-900 items-center justify-center shadow-md hover:bg-white transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Mobile Dot Indicators */}
        {images.length > 1 && (
          <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-4 bg-[#B89768]' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop Counter Badge */}
        {images.length > 1 && (
          <div className="hidden sm:block absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-md">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square w-16 sm:w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'border-[#121212] ring-2 ring-[#B89768]/40 opacity-100 scale-95'
                  : 'border-[#E8E3DA] opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.altText || `${title} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
