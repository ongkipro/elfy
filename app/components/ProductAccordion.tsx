import React, {useState} from 'react';
import {ChevronDown, Truck, ShieldCheck, RefreshCw, Sparkles} from 'lucide-react';

interface ProductAccordionProps {
  productType?: string;
  descriptionHtml?: string;
}

export function ProductAccordion({productType = 'Men\'s Shoes', descriptionHtml}: ProductAccordionProps) {
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
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
          <p>
            <strong>Semenanjung Malaysia:</strong> 1 – 3 hari bekerja via <strong>J&T Express</strong> atau <strong>Pos Laju</strong>. Penghantaran percuma untuk pesanan RM150 ke atas.
          </p>
          <p>
            <strong>Sabah & Sarawak:</strong> 3 – 5 hari bekerja (Penerbangan Pos Laju Air Freight).
          </p>
          <p className="bg-[#FAF9F6] p-2.5 rounded-lg border border-[#EBE6DF] text-stone-800">
            <strong>🔄 Jaminan Tukar Saiz 7 Hari Percuma:</strong> Jangan risau jika tersalah saiz. Hubungi kami dalam tempoh 7 hari selepas barang sampai, kami uruskan penukaran 1-ke-1 terus ke pintu rumah anda.
          </p>
        </div>
      ),
    },
    {
      title: isWatch ? 'Spesifikasi Horologi & Kaca Sapphire' : 'Kualiti Kulit Asli & Keselesaan Sol',
      icon: <Sparkles className="w-4 h-4 text-[#B48344]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
          {isWatch ? (
            <>
              <p>• <strong>Bodi:</strong> 316L Surgical Grade Stainless Steel (Tahan karat & kakisan peluh).</p>
              <p>• <strong>Kaca:</strong> Sapphire Crystal Glass tahan calar dengan lapisan anti-pantulan.</p>
              <p>• <strong>Mesin:</strong> Precision Japanese Miyota / Seiko Caliber (Ketepatan masa terjamin).</p>
              <p>• <strong>Ketahanan Air:</strong> 5ATM – 10ATM (Aman untuk wudhu, hujan lebat, dan aktiviti harian).</p>
            </>
          ) : (
            <>
              <p>• <strong>Bahan Atas:</strong> Full-Grain Calfskin Leather lembut, tahan kedut, dan mudah dijaga.</p>
              <p>• <strong>Bantalan Insole:</strong> High-density Ergonomic Memory Foam dengan sokongan lengkung kaki (Arch Support).</p>
              <p>• <strong>Tapak Luar:</strong> Getah asli berkualiti tinggi dengan cengkaman anti-gelincir pada lantai basah.</p>
              <p>• <strong>Potongan Selesa:</strong> Asian Wide-Fit (E-width) yang direka khas untuk bentuk kaki lelaki Malaysia.</p>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Jaminan 100% Original & Waranti',
      icon: <ShieldCheck className="w-4 h-4 text-[#2B593F]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
          <p>
            Setiap produk ELFY didatangkan dengan kad jaminan rasmi dan pembungkusan kotak eksklusif.
          </p>
          {isWatch && (
            <p>
              • <strong>1-Tahun Waranti Enjin:</strong> Perlindungan kerosakan enjin jam dari tarikh pembelian.
            </p>
          )}
          <p>
            • <strong>Entiti Berdaftar SSM:</strong> Perniagaan sah berdaftar di Malaysia untuk transaksi yang 100% selamat.
          </p>
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
              className="w-full flex items-center justify-between text-left group"
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
