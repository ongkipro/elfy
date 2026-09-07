import React from 'react';
import {ShieldCheck, Lock, RefreshCw, Truck} from 'lucide-react';

interface TrustPaymentBadgesProps {
  variant?: 'compact' | 'full';
}

export function TrustPaymentBadges({variant = 'compact'}: TrustPaymentBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className="pt-2 border-t border-[#EBE6DF]">
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
          <span className="flex items-center gap-1 font-medium text-stone-600">
            <Lock className="w-3 h-3 text-[#2B593F]" /> Pembayaran Selamat Dijamin
          </span>
          <span>FPX • TNG • GrabPay • Kad</span>
        </div>

        {/* Badges Row */}
        <div className="flex items-center justify-between gap-1.5 opacity-80">
          <div className="bg-white border border-stone-200 px-2 py-1 rounded text-[10px] font-bold text-blue-700 tracking-wider">
            FPX
          </div>
          <div className="bg-[#005ABF] text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider">
            TNG eWallet
          </div>
          <div className="bg-[#00B14F] text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider">
            GrabPay
          </div>
          <div className="bg-[#1A1F71] text-white px-2 py-1 rounded text-[10px] font-bold italic tracking-wider">
            VISA
          </div>
          <div className="bg-[#EB001B] text-white px-2 py-1 rounded text-[10px] font-bold tracking-wider">
            Mastercard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F2] border border-[#EBE6DF] rounded-2xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <Truck className="w-5 h-5 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-semibold text-[#191817]">Pos 24 Jam</h4>
          <p className="text-[11px] text-stone-500">1-3 hari Semenanjung (Pos Laju/J&T)</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <RefreshCw className="w-5 h-5 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-semibold text-[#191817]">7-Day Size Exchange</h4>
          <p className="text-[11px] text-stone-500">Jaminan tukar saiz percuma</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <ShieldCheck className="w-5 h-5 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-semibold text-[#191817]">100% Original</h4>
          <p className="text-[11px] text-stone-500">Kulit asli & 1 tahun jaminan enjin</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <Lock className="w-5 h-5 text-[#2B593F]" />
          </div>
          <h4 className="text-xs font-semibold text-[#191817]">FPX & eWallet</h4>
          <p className="text-[11px] text-stone-500">Transaksi selamat berenkripsi</p>
        </div>
      </div>
    </div>
  );
}
