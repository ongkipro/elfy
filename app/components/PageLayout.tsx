import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';
import {Search} from 'lucide-react';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="Beg Belanja Anda">
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-stone-500">
            Memuatkan beg belanja...
          </div>
        }
      >
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();

  return (
    <Aside type="search" heading="Cari Koleksi ELFY">
      <div className="p-6 space-y-6">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="space-y-4">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="Cari kasut kasual, jam tangan..."
                  ref={inputRef}
                  type="search"
                  list={queriesDatalistId}
                  className="w-full h-12 pl-11 pr-24 bg-white border border-[#EBE6DF] focus:border-[#B48344] focus:ring-2 focus:ring-[#B48344]/20 rounded-xl text-xs text-[#191817] placeholder:text-stone-400 outline-none transition-all shadow-2xs"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={goToSearch}
                  className="absolute right-2 h-8 px-3.5 bg-[#191817] hover:bg-[#B48344] text-white border border-[#191817] hover:border-[#B48344] rounded-lg text-xs font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  Cari
                </button>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Carian Popular:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Kasut Kasual',
                    'Jam Tangan Lelaki',
                    'Jam Tangan Wanita',
                    'Sneakers K8',
                    'Chronograph',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = tag;
                          fetchResults({target: {value: tag}} as any);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {collections, products} = items;

            if (state === 'loading' && term.current) {
              return (
                <div className="py-8 text-center text-xs text-stone-500 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-stone-300 border-t-[#B48344] rounded-full animate-spin" />
                  <span>Mencari produk...</span>
                </div>
              );
            }

            if (!total && term.current) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            if (!total) {
              return null;
            }

            return (
              <div className="space-y-4 pt-2">
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                    className="block text-center py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-[#191817] rounded-xl transition-colors"
                  >
                    Lihat semua {total} keputusan untuk &ldquo;{term.current}&rdquo; &rarr;
                  </Link>
                ) : null}
              </div>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    <Aside type="mobile" heading="Menu ELFY">
      <HeaderMenu
        menu={header?.menu}
        viewport="mobile"
        primaryDomainUrl={header?.shop?.primaryDomain?.url || ''}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside>
  );
}
