import {Link} from 'react-router';
import {ChevronRight, Home} from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentUrl?: string;
  className?: string;
  showHomeIcon?: boolean;
}

export function Breadcrumb({
  items,
  currentUrl,
  className = '',
  showHomeIcon = true,
}: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  const origin = 'https://elfy.my';

  // Construct Google-compliant Schema.org BreadcrumbList structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      let itemUrl: string | undefined;

      if (item.to) {
        itemUrl = item.to.startsWith('http')
          ? item.to
          : `${origin}${item.to.startsWith('/') ? '' : '/'}${item.to}`;
      } else if (isLast && currentUrl) {
        itemUrl = currentUrl.startsWith('http')
          ? currentUrl
          : `${origin}${currentUrl.startsWith('/') ? '' : '/'}${currentUrl}`;
      }

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(itemUrl ? {item: itemUrl} : {}),
      };
    }),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`w-full overflow-hidden ${className}`}
    >
      <ol className="flex items-center gap-1.5 text-xs text-stone-500 w-full overflow-hidden whitespace-nowrap select-none py-0.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li
              key={`${item.label}-${index}`}
              className={`flex items-center gap-1.5 ${
                isLast ? 'min-w-0 flex-1' : 'shrink-0'
              }`}
              {...(isLast ? {'aria-current': 'page'} : {})}
            >
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  title={item.label}
                  className="flex items-center gap-1 text-stone-500 hover:text-[#191817] transition-colors focus-visible:outline-hidden focus-visible:underline"
                >
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center justify-center p-0.5 hover:text-[#191817]" aria-label={item.label || 'Laman Utama'}>
                      <Home
                        className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 hover:text-[#191817] shrink-0"
                        aria-hidden="true"
                      />
                    </span>
                  ) : (
                    <span className="max-w-[120px] xs:max-w-[160px] sm:max-w-none truncate">
                      {item.label}
                    </span>
                  )}
                </Link>
              ) : (
                <span
                  className="font-normal text-stone-800 truncate block w-full min-w-0"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight
                  className="w-3 h-3 stroke-[1.5] text-stone-300 shrink-0 select-none"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* SEO Structured Data for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />
    </nav>
  );
}
