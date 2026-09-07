import React, {useState} from 'react';
import {
  ChevronDown,
  Truck,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Check,
  Package,
  Award,
  Clock,
} from 'lucide-react';

interface ProductAccordionProps {
  productType?: string;
  descriptionHtml?: string;
}

export function ProductAccordion({
  productType = "Men's Shoes",
  descriptionHtml,
}: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const isWatch = productType.toLowerCase().includes('watch');

  const items = [
    {
      title: 'Penghantaran & Jaminan Tukar Saiz (1-3 Hari)',
      icon: <Truck className="w-4 h-4 text-[#B48344]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-3 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF]">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] mb-1">
                <Clock className="w-3.5 h-3.5 text-[#B48344]" />
                <span>Semenanjung Malaysia</span>
              </div>
              <p className="text-[11px] text-stone-600">
                1 – 3 hari bekerja via <strong>J&T Express</strong> atau <strong>Pos Laju</strong>. Pos percuma untuk pembelian RM150 ke atas.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#EBE6DF]">
              <div className="flex items-center gap-1.5 font-bold text-[#191817] mb-1">
                <Package className="w-3.5 h-3.5 text-[#B48344]" />
                <span>Sabah & Sarawak</span>
              </div>
              <p className="text-[11px] text-stone-600">
                3 – 5 hari bekerja (Penerbangan Pos Laju Air Freight terus dari Kuala Lumpur).
              </p>
            </div>
          </div>

          {/* Size Exchange Reassurance Card - Clean Lucide Icon, Zero Emojis */}
          <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-stone-800 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white border border-amber-200 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 text-[#B48344]" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-[#191817] mb-0.5">
                Jaminan Tukar Saiz 7 Hari Percuma
              </strong>
              <p className="text-[11px] text-stone-600 leading-normal">
                Jangan risau jika tersalah saiz. Hubungi khidmat sokongan kami dalam tempoh 7 hari selepas barang sampai, kami uruskan proses penukaran terus ke pintu rumah anda.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: isWatch
        ? 'Spesifikasi Horologi & Kaca Sapphire'
        : 'Kualiti Kulit Asli & Keselesaan Sol',
      icon: <Sparkles className="w-4 h-4 text-[#B48344]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
          {isWatch ? (
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Bodi:</strong> 316L Surgical Grade Stainless Steel tahan karat dan kakisan peluh harian.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Kaca:</strong> Sapphire Crystal Glass tahan calar dengan salutan anti-pantulan cahaya.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Enjin:</strong> Precision Japanese Miyota / Seiko Caliber dengan ketepatan masa maksimum.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Ketahanan Air:</strong> 5ATM – 10ATM (Selamat untuk wuduk, hujan lebat, dan kegunaan harian).
                </span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Bahan Atas:</strong> Full-Grain Calfskin Leather lembut, tahan kedut, dan mudah dijaga.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Bantalan Insole:</strong> High-density Ergonomic Memory Foam dengan sokongan lengkung kaki (Arch Support).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Tapak Luar:</strong> Getah asli berkualiti tinggi dengan cengkaman anti-gelincir pada lantai basah.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong>Potongan Selesa:</strong> Asian Wide-Fit (E-width) yang direka khas untuk keselesaan kaki lelaki Malaysia.
                </span>
              </li>
            </ul>
          )}
        </div>
      ),
    },
    {
      title: 'Jaminan 100% Original & Waranti',
      icon: <ShieldCheck className="w-4 h-4 text-[#2B593F]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-2.5 leading-relaxed">
          <p className="text-[11px] text-stone-500">
            Setiap produk ELFY didatangkan dengan kad jaminan rasmi dan pembungkusan kotak eksklusif.
          </p>
          <ul className="space-y-2">
            {isWatch && (
              <li className="flex items-start gap-2">
                <Award className="w-3.5 h-3.5 text-[#B48344] shrink-0 mt-0.5" />
                <span>
                  <strong>1-Tahun Waranti Enjin:</strong> Perlindungan kerosakan enjin jam dari tarikh pembelian.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
              <span>
                <strong>Jaminan 100% Asli:</strong> Rekaan rekaan eksklusif berkualiti tinggi tanpa kompromi bahan.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#2B593F] shrink-0 mt-0.5" />
              <span>
                <strong>Perniagaan Berdaftar SSM:</strong> Pembelian sah di bawah undang-undang pengguna Malaysia.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="border-t border-[#EBE6DF] divide-y divide-[#EBE6DF] my-6">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-3.5">
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left group cursor-pointer"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold text-[#191817] group-hover:text-[#B48344] transition-colors">
                {item.icon}
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#191817]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="pt-3 pb-1 animate-in fade-in duration-150">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
