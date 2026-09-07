import {Truck, RefreshCw, ShieldCheck} from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#141312] text-[#FAF9F6] text-[11px] py-2 px-4 font-medium tracking-wide border-b border-stone-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-between text-center sm:text-left">
        {/* Left: Shipping Reassurance */}
        <div className="flex items-center justify-center sm:justify-start gap-2 text-stone-300">
          <Truck className="w-3.5 h-3.5 text-[#B48344] shrink-0" />
          <span>
            <strong className="font-semibold text-white">Penghantaran Percuma</strong> Semenanjung (RM150+) • <span className="text-stone-400">Tukar Saiz 7 Hari</span>
          </span>
        </div>

        {/* Center: Guarantee & Authenticity (Desktop only) */}
        <div className="hidden lg:flex items-center gap-6 text-stone-300">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#B48344]" />
            <span>7-Day Size Exchange (Pintu ke Pintu)</span>
          </div>
          <span className="text-stone-700">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B48344]" />
            <span>100% Produk Asli Dijamin</span>
          </div>
        </div>

        {/* Right: Currency */}
        <div className="hidden sm:flex items-center gap-4 text-stone-300">
          <span className="text-white font-semibold tracking-wider">MYR (RM)</span>
        </div>
      </div>
    </div>
  );
}
