import React from 'react';
import {Link} from 'react-router';

export interface CategoryPillItem {
  label: string;
  handle: string;
  to: string;
}

interface CategoryPillsProps {
  activeHandle?: string;
  categories?: CategoryPillItem[];
  theme?: 'dark' | 'light';
}

export const CATEGORIES: CategoryPillItem[] = [
  {
    label: 'Semua Koleksi',
    handle: 'all',
    to: '/collections/all',
  },
  {
    label: 'Kasut Kasual',
    handle: 'mens-sneakers',
    to: '/collections/mens-sneakers',
  },
  {
    label: 'Jam Tangan Lelaki',
    handle: 'mens-watches',
    to: '/collections/mens-watches',
  },
  {
    label: 'Jam Tangan Wanita',
    handle: 'womens-watches',
    to: '/collections/womens-watches',
  },
  {
    label: 'New Arrivals',
    handle: 'new-arrivals',
    to: '/collections/new-arrivals',
  },
  {
    label: 'Best Sellers',
    handle: 'best-sellers',
    to: '/collections/best-sellers',
  },
];

export function CategoryPills({activeHandle, categories, theme = 'dark'}: CategoryPillsProps) {
  const items = categories && categories.length > 0 ? categories : CATEGORIES;
  const isLight = theme === 'light';

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center px-4 sm:px-0 py-1">
      {items.map((cat) => {
        const isActive = activeHandle === cat.handle;
        return (
          <Link
            key={cat.handle}
            to={cat.to}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all select-none ${
              isActive
                ? isLight
                  ? 'bg-white text-[#191817] shadow-sm font-bold'
                  : 'bg-[#191817] text-white shadow-xs font-bold'
                : isLight
                  ? 'bg-black/50 backdrop-blur-md border border-white/20 text-stone-100 hover:bg-white/20 hover:border-white/40 shadow-xs active:scale-95'
                  : 'bg-white border border-[#EBE6DF] text-[#191817] hover:bg-[#191817] hover:text-white hover:border-[#191817] shadow-2xs active:scale-95'
            }`}
          >
            <span className={isActive ? (isLight ? 'text-[#191817]' : 'text-white') : ''}>
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
