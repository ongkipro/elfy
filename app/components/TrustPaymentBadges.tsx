import {ShieldCheck, Lock, RefreshCw, Truck, CheckCircle2} from 'lucide-react';

interface TrustPaymentBadgesProps {
  variant?: 'compact' | 'full';
}

export function TrustPaymentBadges({variant = 'compact'}: TrustPaymentBadgesProps) {
  if (variant === 'compact') {
    return (
      <div className="pt-3 border-t border-[#EBE6DF]">
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2.5">
          <span className="flex items-center gap-1.5 font-semibold text-stone-700">
            <Lock className="w-3.5 h-3.5 text-[#2B593F]" />
            <span>Pembayaran Selamat Dijamin</span>
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            FPX • TNG • GrabPay • Kad
          </span>
        </div>

        {/* Badges Row - Clean, Luxury Modern Micro-Pills */}
        <div className="grid grid-cols-5 gap-1.5 select-none">
          <div className="bg-white border border-[#EBE6DF] hover:border-stone-400 py-1.5 px-1 rounded-lg text-center shadow-2xs transition-colors flex items-center justify-center">
            <span className="text-[10px] font-black text-[#003B70] tracking-wider">
              FPX
            </span>
          </div>

          <div className="bg-[#005ABF]/5 border border-[#005ABF]/20 py-1.5 px-1 rounded-lg text-center flex items-center justify-center">
            <span className="text-[9.5px] font-bold text-[#005ABF] tracking-tight">
              TNG eWallet
            </span>
          </div>

          <div className="bg-[#00B14F]/5 border border-[#00B14F]/20 py-1.5 px-1 rounded-lg text-center flex items-center justify-center">
            <span className="text-[9.5px] font-bold text-[#00B14F] tracking-tight">
              GrabPay
            </span>
          </div>

          <div className="bg-white border border-[#EBE6DF] py-1.5 px-1 rounded-lg text-center flex items-center justify-center">
            <span className="text-[10px] font-black italic text-[#1A1F71] tracking-wider font-sans">
              VISA
            </span>
          </div>

          <div className="bg-white border border-[#EBE6DF] py-1.5 px-1 rounded-lg text-center flex items-center justify-center">
            <div className="flex items-center gap-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] inline-block -ml-1.5 mix-blend-multiply" />
              <span className="text-[9px] font-bold text-stone-700 tracking-tight hidden sm:inline ml-0.5">
                Mastercard
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-4 text-[10px] text-stone-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#2B593F]" /> 256-Bit SSL Encryption
          </span>
          <span className="text-stone-300">•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#B48344]" /> Bank Negara Regulated
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F6F2] border border-[#EBE6DF] rounded-2xl p-5 sm:p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <Truck className="w-4 h-4 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-bold text-[#191817]">Pos 24 Jam</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">1-3 hari Semenanjung (Pos Laju / J&T)</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <RefreshCw className="w-4 h-4 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-bold text-[#191817]">Tukar Saiz 7 Hari</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Jaminan penukaran saiz mudah</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <ShieldCheck className="w-4 h-4 text-[#B48344]" />
          </div>
          <h4 className="text-xs font-bold text-[#191817]">100% Produk Asli</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Kulit asli & jaminan rasmi ELFY</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EBE6DF]">
            <Lock className="w-4 h-4 text-[#2B593F]" />
          </div>
          <h4 className="text-xs font-bold text-[#191817]">FPX & eWallet</h4>
          <p className="text-[11px] text-stone-500 mt-0.5">Transaksi selamat berenkripsi</p>
        </div>
      </div>
    </div>
  );
}
