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
      <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[#FAF9F6] md:rounded-2xl shadow-2xl border-0 md:border md:border-[#EBE6DF] flex flex-col z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Header Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="relative flex items-center px-4 sm:px-6 h-16 sm:h-18 bg-white border-b border-[#EBE6DF] shrink-0 gap-3"
        >
          {/* Search Icon / Animated Spinner */}
          <div className="w-9 h-9 rounded-full bg-stone-100/80 flex items-center justify-center shrink-0 text-[#B48344]">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#B48344]" />
            ) : (
              <Search className="w-4 h-4 stroke-[1.75]" />
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
            className="flex-1 h-full bg-transparent text-base font-medium text-[#191817] placeholder:text-stone-400 outline-none pr-2"
            autoComplete="off"
            spellCheck={false}
          />

          {/* Clear Button (Visible only when typing) */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-[#191817] flex items-center justify-center transition-colors cursor-pointer mr-1"
              title="Padam carian"
              aria-label="Padam carian"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Close Modal Button & ESC Shortcut Badge */}
          <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-stone-200/80">
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 bg-stone-100 border border-stone-200 rounded tracking-wider uppercase select-none">
              ESC
            </kbd>
            <button
              type="button"
              onClick={close}
              className="w-8 h-8 rounded-full bg-stone-100/80 hover:bg-stone-200/80 active:scale-95 text-stone-600 hover:text-[#191817] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Tutup carian"
              title="Tutup (ESC)"
            >
              <X className="w-4 h-4" />
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
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <TrendingUp className="w-3.5 h-3.5 text-[#B48344]" />
                  <span>Carian Popular Hari Ini</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {TRENDING_QUERIES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectSuggestion(tag)}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#191817] hover:text-white text-stone-700 border border-[#EBE6DF] hover:border-[#191817] text-xs font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5 group"
                    >
                      <Sparkles className="w-3 h-3 text-[#B48344] group-hover:text-[#B48344]" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories Navigation */}
              <div className="space-y-2.5 pt-2 border-t border-[#EBE6DF]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <Tag className="w-3.5 h-3.5 text-[#B48344]" />
                  <span>Koleksi Pilihan ELFY</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {QUICK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.handle}
                      to={`/collections/${cat.handle}`}
                      onClick={close}
                      className="group p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors flex items-center justify-between">
                          <span>{cat.title}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1">
                          {cat.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Trust Assurances Footer */}
              <div className="pt-4 border-t border-[#EBE6DF] grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-white/80 border border-[#EBE6DF] flex flex-col items-center">
                  <RefreshCw className="w-4 h-4 text-[#B48344] mb-1" />
                  <span className="text-[10px] font-bold text-[#191817]">Tukar Saiz 7 Hari</span>
                  <span className="text-[9px] text-stone-500">Percuma & Mudah</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-[#EBE6DF] flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-[#B48344] mb-1" />
                  <span className="text-[10px] font-bold text-[#191817]">100% Original</span>
                  <span className="text-[9px] text-stone-500">Jaminan Kualiti</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/80 border border-[#EBE6DF] flex flex-col items-center">
                  <Clock className="w-4 h-4 text-[#B48344] mb-1" />
                  <span className="text-[10px] font-bold text-[#191817]">Pos Laju Pantas</span>
                  <span className="text-[9px] text-stone-500">1-3 Hari Semenanjung</span>
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Kategori & Koleksi Sepadan:
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
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#EBE6DF] hover:border-[#B48344] text-xs font-semibold text-[#191817] hover:text-[#B48344] transition-all shadow-2xs"
                        >
                          <span>{collection.title}</span>
                          <ArrowUpRight className="w-3 h-3 text-stone-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Matched Products */}
              {products.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      Produk Ditemui ({products.length})
                    </span>
                    <span className="text-[10px] text-stone-400 hidden sm:inline">
                      Tekan Enter untuk katalog penuh
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                          className="group p-2.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            {image ? (
                              <Image
                                data={image}
                                width={64}
                                height={64}
                                alt={image.altText || product.title}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <Search className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors truncate">
                              {product.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-2">
                              {price && (
                                <span className="text-xs font-bold text-[#191817]">
                                  <Money data={price} />
                                </span>
                              )}
                              <span className="text-[10px] text-[#2B593F] font-semibold bg-[#2B593F]/10 px-1.5 py-0.2 rounded">
                                Ada Stok
                              </span>
                            </div>
                          </div>

                          <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#B48344] transition-colors shrink-0 mr-1" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty State when no items matched */}
              {!isLoading && total === 0 && (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400">
                    <SearchX className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#191817]">
                      Tiada padanan ditemui untuk &ldquo;{query}&rdquo;
                    </h4>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Cuba periksa ejaan atau gunakan kata kunci umum seperti &ldquo;kasut&rdquo;, &ldquo;jam tangan&rdquo;, atau &ldquo;sneakers&rdquo;.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/collections/all"
                      onClick={close}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-[#191817] hover:bg-[#B48344] text-white text-xs font-semibold transition-all shadow-sm"
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
          <div className="p-3 sm:p-4 bg-white border-t border-[#EBE6DF] flex items-center justify-between shrink-0 gap-3">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Memaparkan {products.length} daripada {total} hasil carian
            </span>
            <Link
              to={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={close}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#191817] hover:bg-[#B48344] text-white text-xs font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.99]"
            >
              <span>Lihat semua {total} keputusan untuk &ldquo;{query}&rdquo;</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
