import {useEffect, useRef, useState, useId} from 'react';
import {Link, useNavigate, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {
  Search,
  X,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Tag,
  ShieldCheck,
  RefreshCw,
  Clock,
  SearchX,
  Loader2,
} from 'lucide-react';
import {useAside} from '~/components/Aside';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';

const TRENDING_QUERIES = [
  'Sneakers',
  'Leather',
  'Watch',
  'K27',
  'K47',
  'Best Sellers',
];

const QUICK_CATEGORIES = [
  {
    title: 'Kasut Kasual Lelaki',
    handle: 'mens-sneakers',
    description: 'Saiz 39 - 44 (Asian Wide Fit)',
  },
  {
    title: 'Jam Tangan Lelaki',
    handle: 'mens-watches',
    description: 'Keluli Tahan Karat & Kulit Asli',
  },
  {
    title: 'Jam Tangan Wanita',
    handle: 'womens-watches',
    description: 'Koleksi Anggun & Minimalis',
  },
];

export function SearchModal() {
  const {type, open, close} = useAside();
  const isOpen = type === 'search';
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const [query, setQuery] = useState('');
  const searchId = useId();

  // Global keyboard shortcut: Cmd+K / Ctrl+K opens modal, ESC closes modal
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (isOpen) {
          close();
        } else {
          open('search');
        }
      } else if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        close();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, open, close]);

  // Handle body scroll lock & auto-focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = fetcher.data?.result ?? getEmptyPredictiveSearchResult();
  const {products, collections} = results.items;
  const total = results.total;
  const isLoading = fetcher.state === 'loading';

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      void fetcher.submit(
        {q: value.trim(), limit: 6, predictive: true},
        {method: 'GET', action: '/search'},
      );
    }
  }

  function handleSelectSuggestion(term: string) {
    setQuery(term);
    if (inputRef.current) {
      inputRef.current.value = term;
      inputRef.current.focus();
    }
    void fetcher.submit(
      {q: term, limit: 6, predictive: true},
      {method: 'GET', action: '/search'},
    );
  }

  function handleClear() {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      close();
      void navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={searchId}
      className="fixed inset-0 z-50 flex items-start justify-center p-0 md:p-6 lg:p-12"
    >
      {/* Dimmed Backdrop Overlay with Soft Blur */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={close}
      />

      {/* Modal Dialog Box */}
      <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[#FAF9F6] md:rounded-2xl shadow-2xl border-0 md:border md:border-stone-200 flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Header Bar (Clean Architectural Input) */}
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center px-4 sm:px-6 h-16 sm:h-18 bg-white border-b border-stone-200/80 shrink-0 gap-3"
        >
          {/* Search Icon / Animated Spinner */}
          <div className="flex items-center justify-center shrink-0 text-[#191817]">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#8C6527]" />
            ) : (
              <Search className="w-4 h-4 stroke-[1.5]" />
            )}
          </div>

          {/* Search Input Field */}
          <input
            id={searchId}
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            placeholder="Cari kasut kasual, jam tangan..."
            className="flex-1 h-full bg-transparent text-sm sm:text-base font-normal text-[#191817] placeholder:text-stone-400 outline-none pr-2"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Clear Button (Visible only when typing) */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="w-6 h-6 rounded-full hover:bg-stone-100 text-stone-400 hover:text-[#191817] flex items-center justify-center transition-colors cursor-pointer mr-1"
              title="Padam carian"
              aria-label="Padam carian"
            >
              <X className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>
          )}

          {/* Close Modal Button & ESC Shortcut Badge */}
          <div className="flex items-center gap-2.5 shrink-0 pl-2 border-l border-stone-200/80">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-50 border border-stone-200 rounded tracking-wider uppercase select-none">
              ESC
            </kbd>
            <button
              type="button"
              onClick={close}
              className="w-7 h-7 rounded-full hover:bg-stone-100 text-stone-500 hover:text-[#191817] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup carian"
              title="Tutup (ESC)"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </form>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">
          {/* 1. INITIAL STATE: User hasn't typed yet */}
          {query.trim().length === 0 && (
            <div className="space-y-6">
              {/* Trending Searches */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400 block">
                  Carian Popular
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_QUERIES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectSuggestion(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#191817] hover:text-white text-stone-700 border border-stone-200 hover:border-[#191817] text-xs font-medium transition-all active:scale-95 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories Navigation (Clean Luxury Grid) */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200/80">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400 block">
                  Koleksi Pilihan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {QUICK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.handle}
                      to={`/collections/${cat.handle}`}
                      onClick={close}
                      className="group p-3.5 rounded-lg bg-white border border-stone-200/80 hover:border-stone-400 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-medium text-xs text-[#191817] group-hover:text-[#8C6527] transition-colors flex items-center justify-between">
                          <span>{cat.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] text-stone-400 group-hover:text-[#8C6527] transition-colors" />
                        </h4>
                        <p className="text-[11px] text-stone-400 mt-1">
                          {cat.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. RESULTS STATE: User is typing */}
          {query.trim().length > 0 && (
            <div className="space-y-5">
              {/* Matched Collections (if any) */}
              {collections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400 block">
                    Kategori &amp; Koleksi
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {collections.map((collection) => {
                      const collectionUrl = urlWithTrackingParams({
                        baseUrl: `/collections/${collection.handle}`,
                        trackingParams: collection.trackingParameters,
                        term: query,
                      });
                      return (
                        <Link
                          key={collection.id}
                          to={collectionUrl}
                          onClick={close}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-[#191817] text-xs font-medium text-[#191817] transition-colors"
                        >
                          <span>{collection.title}</span>
                          <ArrowUpRight className="w-3 h-3 stroke-[1.5] text-stone-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matched Products (Frameless Luxury List) */}
              {products.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-200/80">
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400">
                      Produk Ditemui ({products.length})
                    </span>
                    <span className="text-[10px] text-stone-400 hidden sm:inline">
                      Tekan Enter untuk katalog penuh
                    </span>
                  </div>

                  <div className="divide-y divide-stone-100">
                    {products.map((product) => {
                      const productUrl = urlWithTrackingParams({
                        baseUrl: `/products/${product.handle}`,
                        trackingParams: product.trackingParameters,
                        term: query,
                      });
                      const variant = product.selectedOrFirstAvailableVariant;
                      const image = variant?.image;
                      const price = variant?.price;

                      return (
                        <Link
                          key={product.id}
                          to={productUrl}
                          onClick={close}
                          className="group p-2.5 rounded-lg hover:bg-white transition-colors flex items-center gap-3.5"
                        >
                          <div className="w-13 h-13 rounded-md overflow-hidden bg-[#F5F4F0] shrink-0">
                            {image ? (
                              <Image
                                data={image}
                                width={56}
                                height={56}
                                alt={image.altText || product.title}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300 text-[10px]">
                                ELFY
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs text-[#191817] group-hover:text-[#8C6527] transition-colors truncate">
                              {product.title}
                            </h4>
                            <div className="mt-0.5 flex items-baseline gap-2">
                              {price && (
                                <span className="text-xs font-semibold text-[#191817]">
                                  <Money data={price} />
                                </span>
                              )}
                              <span className="text-[10px] text-stone-400">
                                Sedia Pos KL
                              </span>
                            </div>
                          </div>

                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5] text-stone-300 group-hover:text-[#8C6527] transition-colors shrink-0 mr-1" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State when no items matched */}
              {!isLoading && total === 0 && (
                <div className="py-10 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                    <SearchX className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-[#191817]">
                      Tiada padanan ditemui untuk &ldquo;{query}&rdquo;
                    </h4>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Cuba gunakan kata kunci seperti &ldquo;kasut&rdquo;, &ldquo;sneakers&rdquo;, atau &ldquo;jam tangan&rdquo;.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/collections/all"
                      onClick={close}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#191817] hover:bg-stone-800 text-white text-xs font-medium transition-colors"
                    >
                      Lihat Semua Koleksi ELFY &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Action (When results exist) */}
        {query.trim().length > 0 && total > 0 && (
          <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200/80 flex items-center justify-between shrink-0 gap-3">
            <span className="text-xs text-stone-400 hidden sm:inline">
              Memaparkan {products.length} daripada {total} hasil carian
            </span>
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={close}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#191817] hover:bg-stone-800 text-white text-xs font-medium uppercase tracking-[0.1em] transition-colors"
            >
              <span>Lihat semua {total} keputusan untuk &ldquo;{query}&rdquo;</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
