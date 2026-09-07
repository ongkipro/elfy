import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue, Link} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {
  Search,
  ShoppingBag,
  Menu,
  User,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  return (
    <div className="sticky top-0 z-40">
      <AnnouncementBar />
      <header className="bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#EBE6DF] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <HeaderMenuMobileToggle />
            <Link to="/" className="flex flex-col group py-1">
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-[0.22em] text-2xl font-bold text-[#191817] group-hover:text-[#B48344] transition-colors leading-none">
                  ELFY
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B48344]" />
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.3em] text-stone-500 font-semibold mt-1">
                Kuala Lumpur
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" role="navigation">
            <NavLink
              to="/collections/mens-sneakers"
              className={({isActive}) =>
                `relative py-2 text-xs uppercase tracking-[0.16em] font-semibold transition-colors hover:text-[#B48344] ${
                  isActive ? 'text-[#191817]' : 'text-stone-700'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span>Kasut Kasual</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B48344] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/collections/mens-watches"
              className={({isActive}) =>
                `relative py-2 text-xs uppercase tracking-[0.16em] font-semibold transition-colors hover:text-[#B48344] ${
                  isActive ? 'text-[#191817]' : 'text-stone-700'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span>Jam Tangan</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B48344] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/collections/best-sellers"
              className={({isActive}) =>
                `relative py-2 text-xs uppercase tracking-[0.16em] font-semibold transition-colors hover:text-[#B48344] flex items-center gap-1.5 ${
                  isActive ? 'text-[#191817]' : 'text-stone-700'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <Sparkles className="w-3 h-3 text-[#B48344]" />
                  <span>Best Sellers</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B48344] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/collections/all"
              className={({isActive}) =>
                `relative py-2 text-xs uppercase tracking-[0.16em] font-semibold transition-colors hover:text-[#B48344] ${
                  isActive ? 'text-[#191817]' : 'text-stone-700'
                }`
              }
            >
              {({isActive}) => (
                <>
                  <span>Semua Koleksi</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#B48344] rounded-full animate-in fade-in duration-200" />
                  )}
                </>
              )}
            </NavLink>
          </nav>

          {/* Right: Actions (Search, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger Button */}
            <SearchToggle />

            {/* Customer Account Icon */}
            <AccountToggle isLoggedIn={isLoggedIn} />

            {/* Shopping Cart Drawer Toggle */}
            <CartToggle cart={cart} />
          </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu?: HeaderProps['header']['menu'];
  primaryDomainUrl?: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <nav className="flex flex-col p-6 space-y-6 text-sm" role="navigation">
      {/* Brand Header Inside Drawer */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-200">
        <span className="font-serif text-xl font-bold tracking-[0.2em] text-[#191817]">
          ELFY
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#B48344]" />
        <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold ml-auto">
          Kuala Lumpur
        </span>
      </div>

      {/* Category Navigation Tiles */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block px-1">
          Kategori Utama
        </span>

        <Link
          to="/collections/mens-sneakers"
          onClick={close}
          className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs transition-all"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors">
              Kasut Kasual & Sneakers
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">Asian Wide-Fit (EU 39–44)</span>
          </div>
          <span className="text-[10px] font-bold bg-[#B48344]/10 text-[#B48344] px-2 py-0.5 rounded-md">
            Paling Laris
          </span>
        </Link>

        <Link
          to="/collections/mens-watches"
          onClick={close}
          className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs transition-all"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors">
              Jam Tangan Lelaki (Watches)
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">Kaca Kristal & Keluli Tahan Karat</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/collections/womens-watches"
          onClick={close}
          className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs transition-all"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors">
              Jam Tangan Wanita
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">Koleksi Anggun & Minimalis</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/collections/best-sellers"
          onClick={close}
          className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs transition-all"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B48344]" /> Best Sellers & Trending
            </span>
            <span className="text-[10px] text-stone-500 mt-0.5">Pilihan ramai pengguna Malaysia</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/collections/all"
          onClick={close}
          className="group flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#EBE6DF] hover:border-[#B48344]/50 shadow-2xs transition-all"
        >
          <span className="font-semibold text-xs text-[#191817] group-hover:text-[#B48344] transition-colors">
            Semua Koleksi (Katalog Lengkap)
          </span>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#B48344] group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Customer Service & Guarantees */}
      <div className="space-y-2 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block px-1">
          Bantuan & Jaminan
        </span>

        <Link
          to="/pages/warranty-returns"
          onClick={close}
          className="flex items-center gap-2.5 p-2.5 text-xs text-stone-700 hover:text-[#191817] transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-[#B48344]" />
          <span>Jaminan Tukar Saiz 7 Hari & Waranti</span>
        </Link>

        <Link
          to="/pages/shipping-faq"
          onClick={close}
          className="flex items-center gap-2.5 p-2.5 text-xs text-stone-700 hover:text-[#191817] transition-colors"
        >
          <Truck className="w-4 h-4 text-[#B48344]" />
          <span>Kadar & Masa Penghantaran Pos</span>
        </Link>
      </div>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden w-11 h-11 inline-flex items-center justify-center text-[#191817] hover:bg-stone-200/70 rounded-full active:scale-95 transition-all duration-200 cursor-pointer"
      onClick={() => open('mobile')}
      aria-label="Menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      type="button"
      className="w-10 h-10 sm:w-11 sm:h-11 inline-flex items-center justify-center text-stone-700 hover:text-[#191817] hover:bg-stone-200/70 rounded-full active:scale-95 transition-all duration-200 cursor-pointer"
      onClick={() => open('search')}
      aria-label="Cari produk"
      title="Cari produk (⌘K)"
    >
      <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );
}

function AccountToggle({isLoggedIn}: {isLoggedIn: Promise<boolean>}) {
  return (
    <Link
      to="/account"
      className="hidden sm:inline-flex w-11 h-11 items-center justify-center text-stone-700 hover:text-[#191817] hover:bg-stone-200/70 rounded-full active:scale-95 transition-all duration-200"
      aria-label="Akaun"
      title="Akaun Saya"
    >
      <User className="w-4 h-4" />
    </Link>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="group h-10 px-3.5 sm:px-4 bg-[#191817] hover:bg-stone-800 text-white rounded-full inline-flex items-center gap-2 sm:gap-2.5 active:scale-[0.985] transition-all duration-200 shadow-xs shrink-0 select-none cursor-pointer"
      aria-label={`Troli (${count})`}
    >
      <ShoppingBag className="w-4 h-4 text-[#D4AF37] group-hover:scale-105 transition-transform duration-200 shrink-0" />
      <span className="text-white text-xs font-medium tracking-wider hidden sm:inline">Beg</span>
      <span className="w-5 h-5 rounded-full bg-stone-800 group-hover:bg-[#D4AF37] text-stone-200 group-hover:text-[#191817] text-[10px] font-bold inline-flex items-center justify-center font-mono leading-none transition-colors duration-200">
        {count}
      </span>
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
