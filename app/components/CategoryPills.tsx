import React from 'react';
import {Link} from 'react-router';

interface CategoryPillsProps {
  activeHandle?: string;
}

export const CATEGORIES = [
  {
    label: 'Kasut Kasual (39-44)',
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
    label: 'Best Sellers',
    handle: 'best-sellers',
    to: '/collections/best-sellers',
  },
  {
    label: 'Semua Koleksi',
    handle: 'all',
    to: '/collections/all',
  },
];

export function CategoryPills({activeHandle}: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center px-4 sm:px-0 py-1">
      {CATEGORIES.map((cat) => {
        const isActive = activeHandle === cat.handle;
        return (
          <Link
            key={cat.handle}
            to={cat.to}
            className={`shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all select-none ${
              isActive
                ? 'bg-[#191817] text-white shadow-xs font-bold'
                : 'bg-white border border-[#EBE6DF] text-[#191817] hover:bg-[#191817] hover:text-white hover:border-[#191817] shadow-2xs active:scale-95'
            }`}
          >
            <span className={isActive ? 'text-white' : ''}>{cat.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
