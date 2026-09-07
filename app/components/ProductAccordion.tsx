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
  FileText,
} from 'lucide-react';

interface ProductAccordionProps {
  productType?: string;
  descriptionHtml?: string;
}

export function ProductAccordion({
  productType = "Men's Shoes",
  descriptionHtml,
}: ProductAccordionProps) {
  // Default first tab (Product Details & Specs) open on load
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  const toggle = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const isWatch = productType.toLowerCase().includes('watch');
  const hasDescriptionHtml = Boolean(descriptionHtml && descriptionHtml.trim().length > 0);

  const items = [
    {
      title: 'Butiran Produk',
      icon: <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" />,
      content: hasDescriptionHtml ? (
        <div
          className="product-description-content py-1"
          dangerouslySetInnerHTML={{__html: descriptionHtml!}}
        />
      ) : (
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed py-1">
          {isWatch ? (
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Bodi:</strong> 316L Surgical Grade Stainless Steel tahan karat &amp; kakisan peluh harian.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Cermin:</strong> Sapphire Crystal Glass tahan calar dengan salutan anti-pantulan cahaya.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Enjin:</strong> Precision Japanese Caliber dengan ketepatan masa maksimum.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Ketahanan Air:</strong> 5ATM – 10ATM (Selamat untuk wuduk, hujan lebat, dan kegunaan harian).
                </span>
              </li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Bahan Atas:</strong> Full-Grain Leather lembut, tahan kedut &amp; mudah dijaga.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Bantalan Insole:</strong> High-density Ergonomic Memory Foam dengan Arch Support selesa jalan jauh.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Tapak Luar:</strong> Getah asli berkualiti tinggi dengan cengkaman anti-gelincir pada lantai basah.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">Potongan Selesa:</strong> Asian Wide-Fit (E-width) khas keselesaan kaki lelaki Malaysia.
                </span>
              </li>
            </ul>
          )}
        </div>
      ),
    },
    {
      title: 'Penghantaran & Saiz',
      icon: <Truck className="w-3.5 h-3.5 stroke-[1.5]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-3 leading-relaxed py-1">
          {/* Semenanjung */}
          <div className="flex items-start gap-2.5">
            <Clock className="w-3.5 h-3.5 stroke-[1.5] text-[#8C6527] shrink-0 mt-0.5" />
            <div>
              <strong className="font-medium text-[#191817] block">
                Semenanjung Malaysia (1 – 3 Hari Bekerja)
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Penghantaran pantas via <strong>J&amp;T Express</strong> / <strong>Pos Laju</strong> terus dari gudang Kuala Lumpur. Pos percuma untuk pesanan RM150 ke atas.
              </p>
            </div>
          </div>

          {/* Sabah & Sarawak */}
          <div className="flex items-start gap-2.5">
            <Package className="w-3.5 h-3.5 stroke-[1.5] text-[#8C6527] shrink-0 mt-0.5" />
            <div>
              <strong className="font-medium text-[#191817] block">
                Sabah &amp; Sarawak (3 – 5 Hari Bekerja)
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Penerbangan Pos Laju Air Freight terus dari Kuala Lumpur ke alamat anda.
              </p>
            </div>
          </div>

          {/* Size Exchange Reassurance */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-stone-100">
            <RefreshCw className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
            <div>
              <strong className="font-medium text-[#191817] block">
                Jaminan Tukar Saiz 7 Hari Percuma
              </strong>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Salah saiz? Hubungi kami dalam tempoh 7 hari selepas barang sampai, kami uruskan proses penukaran saiz baru terus ke pintu rumah anda.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Jaminan & Waranti',
      icon: <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />,
      content: (
        <div className="text-xs text-stone-600 space-y-2 leading-relaxed py-1">
          <ul className="space-y-2">
            {isWatch && (
              <li className="flex items-start gap-2.5">
                <Award className="w-3.5 h-3.5 stroke-[1.5] text-[#8C6527] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#191817] font-medium">1-Tahun Waranti Enjin:</strong> Perlindungan kerosakan pergerakan kuarza dari tarikh pembelian.
                </span>
              </li>
            )}
            <li className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#191817] font-medium">Jaminan 100% Asli:</strong> Produk eksklusif ELFY dengan piawaian kualiti ketat tanpa kompromi bahan.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#191817] font-medium">Perniagaan Berdaftar SSM:</strong> Pembelian rasmi dan sah di bawah Suruhanjaya Syarikat Malaysia.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="border-t border-b border-stone-200/80 divide-y divide-stone-200/80 my-6">
      {items.map((item, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div key={idx} className="transition-colors">
            <button
              type="button"
              id={`accordion-btn-${idx}`}
              aria-controls={`accordion-panel-${idx}`}
              aria-expanded={isOpen}
              onClick={() => toggle(idx)}
              className="w-full py-3.5 flex items-center justify-between text-left group cursor-pointer select-none"
            >
              <span className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#191817] group-hover:text-[#8C6527] transition-colors">
                <span className="text-stone-500 group-hover:text-[#8C6527] transition-colors">
                  {item.icon}
                </span>
                <span>{item.title}</span>
              </span>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors group-hover:bg-stone-100 ${
                  isOpen ? 'text-[#191817]' : 'text-stone-400'
                }`}
              >
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[1.5] transition-transform duration-300 ease-out ${
                    isOpen ? 'rotate-180 text-[#191817]' : ''
                  }`}
                />
              </span>
            </button>
            {isOpen && (
              <div
                id={`accordion-panel-${idx}`}
                role="region"
                aria-labelledby={`accordion-btn-${idx}`}
                className="pb-3.5 pt-0.5 animate-in fade-in duration-200"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
