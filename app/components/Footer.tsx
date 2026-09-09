import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {
  Truck,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  Footprints,
  Watch,
  Sparkles,
  TrendingUp,
  Layers,
  Ruler,
  Mail,
} from 'lucide-react';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <footer className="bg-[#151413] text-[#FAF9F6] pt-16 pb-12 border-t border-[#2A2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#B48344]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">Pantas 1-3 Hari</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Semenanjung (Pos Laju & J&T)</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-[#B48344]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">7-Day Free Exchange</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Jaminan tukar saiz ke pintu rumah</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#B48344]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">100% Original</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Kulit asli & 1 tahun waranti enjin</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-white">Bantuan WhatsApp</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Khidmat pelanggan mesra & responsif</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif tracking-[0.25em] text-3xl font-bold text-white">
                ELFY
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-[#B48344] font-medium mt-1">
                Kuala Lumpur
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed">
              Kasut kasual sartorial dan jam tangan berkelas untuk gaya hidup urban Malaysia. Gabungan keselesaan berpanjangan dan kualiti material premium.
            </p>
            <div className="pt-2 text-[11px] text-stone-300">
              <span className="inline-block border border-stone-700 rounded px-2 py-1 bg-stone-900/90 text-stone-300">
                Perniagaan Berdaftar SSM
              </span>
            </div>
          </div>

          {/* Nav Col 1: Koleksi Produk */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Koleksi Produk
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link
                  to="/collections/mens-sneakers"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Footprints className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Kasut Kasual &amp; Sneakers</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/mens-watches"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Watch className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Jam Tangan Lelaki (Watches)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/womens-watches"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Jam Tangan Wanita</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/new-arrivals"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>New Arrivals &amp; Latest Drops</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/best-sellers"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Best Sellers &amp; Trending</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/all"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Semua Koleksi (All Products)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Bantuan & Jaminan */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Bantuan &amp; Jaminan
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link
                  to="/pages/size-guide"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Panduan Saiz Kaki Malaysia (CM)</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/warranty-returns"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Jaminan Tukar Saiz 7 Hari Percuma</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/shipping-faq"
                  className="group flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Truck className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 group-hover:text-[#B48344] transition-colors shrink-0" />
                  <span>Kadar &amp; Masa Pos Semenanjung / Sabah</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/601111111111?text=Hi%20ELFY,%20saya%20nak%20tanya%20tentang%20pesanan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 hover:text-[#25D366] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 stroke-[1.5] text-[#25D366] shrink-0" />
                  <span>Hubungi Kami di WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Reassurance Col */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Kelebihan ELFY
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Dapatkan diskaun RM 20 untuk pembelian pertama dan jemputan awal koleksi drop baharu.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Emel anda..."
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg pl-8 pr-3 py-2 text-base sm:text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#B48344]"
                />
                <Mail className="w-3.5 h-3.5 stroke-[1.5] text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="button"
                className="bg-white hover:bg-stone-200 text-[#191817] text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 inline-flex items-center justify-center select-none cursor-pointer"
              >
                Langgan
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Payment & Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="text-stone-400">
            © {new Date().getFullYear()} ELFY (elfy.my). Hak Cipta Terpelihara.
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="bg-stone-900 px-2 py-0.5 rounded text-stone-400 font-medium">FPX</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded text-stone-400 font-medium">TNG eWallet</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded text-stone-400 font-medium">GrabPay</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded text-stone-400 font-medium">VISA / MC</span>
            <span className="bg-stone-900 px-2 py-0.5 rounded text-stone-400 font-medium">J&T / Pos Laju</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
