import React, { useState } from 'react';
import { ChevronDown, Gift } from 'lucide-react';
import { parseShopifyDescription } from './ParsedProductDescription';

interface ProductAccordionProps {
  descriptionHtml: string;
  locale?: string;
}

export function ProductAccordion({ descriptionHtml, locale = 'ms' }: ProductAccordionProps) {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    shipping: false,
    warranty: false,
  });

  const toggle = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const parsed = parseShopifyDescription(descriptionHtml, locale);

  return (
    <div className="border-t border-b border-[#E8E3DA] divide-y divide-[#E8E3DA] text-neutral-800">
      {/* 1. DESKRIPSI & SPESIFIKASI (TERMASUK PANDUAN SAIZ & INSOLE) */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle('details')}
          className="w-full flex items-center justify-between text-left font-serif text-sm sm:text-base font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
        >
          <span className="group-hover:text-[#B89768] transition-colors">
            {locale === 'ms' ? 'Deskripsi, Saiz & Spesifikasi' : 'Details, Sizing & Specifications'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
              openSections.details ? 'rotate-180 text-neutral-900' : ''
            }`}
          />
        </button>

        {openSections.details && (
          <div className="pt-4 pb-2 space-y-6 text-xs sm:text-[13px] text-neutral-700 leading-relaxed animate-fadeIn">
            {parsed.map((sec, idx) => {
              if (sec.type === 'intro' && sec.text) {
                return (
                  <p key={idx} className="text-neutral-800 leading-relaxed font-normal">
                    {sec.text}
                  </p>
                );
              }

              if (sec.type === 'features' && sec.items) {
                return (
                  <div key={idx} className="space-y-2.5 pt-2">
                    <h5 className="font-bold text-neutral-950 text-xs tracking-wider uppercase">
                      {sec.title}
                    </h5>
                    <ul className="space-y-2 pl-0.5">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B89768] mt-1.5 shrink-0" />
                          <span className="text-neutral-700">
                            {item.label && <strong className="text-neutral-950 font-semibold">{item.label}: </strong>}
                            {item.value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              if (sec.type === 'specs' && sec.items) {
                return (
                  <div key={idx} className="space-y-2.5 pt-2">
                    <h5 className="font-bold text-neutral-950 text-xs tracking-wider uppercase">
                      {sec.title}
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sec.items.map((item, i) => (
                        <div
                          key={i}
                          className="p-2.5 bg-[#F7F4EC]/70 rounded-lg border border-[#E8E3DA] flex items-center justify-between text-xs"
                        >
                          <span className="text-neutral-600 font-medium">{item.label || item.value}</span>
                          {item.label && <span className="font-mono font-bold text-neutral-900">{item.value}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sec.type === 'package' && sec.items) {
                return (
                  <div key={idx} className="space-y-2.5 pt-2">
                    <h5 className="font-bold text-neutral-950 text-xs tracking-wider uppercase flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-[#B89768]" />
                      <span>{sec.title}</span>
                    </h5>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {sec.items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100/80 rounded-lg text-neutral-800 border border-stone-200"
                        >
                          <span className="w-1 h-1 rounded-full bg-neutral-900" />
                          <span>{item.value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              }

              if (sec.type === 'raw' && sec.text) {
                return (
                  <div key={idx} className="space-y-1 pt-1">
                    {sec.title && <h5 className="font-bold text-neutral-950 text-xs uppercase">{sec.title}</h5>}
                    <p className="text-neutral-700">{sec.text}</p>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* 2. PENGHANTARAN & KURIER */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle('shipping')}
          className="w-full flex items-center justify-between text-left font-serif text-sm sm:text-base font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
        >
          <span className="group-hover:text-[#B89768] transition-colors">
            {locale === 'ms' ? 'Penghantaran & Kurier' : 'Shipping & Delivery'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
              openSections.shipping ? 'rotate-180 text-neutral-900' : ''
            }`}
          />
        </button>

        {openSections.shipping && (
          <div className="pt-4 pb-2 space-y-3 text-xs sm:text-[13px] text-neutral-700 leading-relaxed animate-fadeIn">
            <div className="space-y-2">
              <p>
                <strong className="text-neutral-950 font-semibold">Semenanjung Malaysia (West MY):</strong>{' '}
                2 – 3 hari bekerja via Pos Laju / J&T Express.{' '}
                <span className="text-emerald-800 font-bold">Penghantaran Percuma untuk pesanan RM 150 ke atas</span> (Kadar biasa RM 8.00).
              </p>
              <p>
                <strong className="text-neutral-950 font-semibold">Sabah & Sarawak (East MY):</strong>{' '}
                3 – 5 hari bekerja (Kadar rata RM 15.00).
              </p>
            </div>
            <p className="text-[11px] text-neutral-500 italic">
              *Nombor tracking akan dihantar secara automatik melalui SMS & WhatsApp sebaik bungkusan dihantar dari Hub KL.
            </p>
          </div>
        )}
      </div>

      {/* 3. JAMINAN & TUKAR SAIZ */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => toggle('warranty')}
          className="w-full flex items-center justify-between text-left font-serif text-sm sm:text-base font-bold text-neutral-950 uppercase tracking-wider group cursor-pointer"
        >
          <span className="group-hover:text-[#B89768] transition-colors">
            {locale === 'ms' ? 'Jaminan & Pertukaran Saiz 7 Hari' : 'Warranty & 7-Day Size Exchange'}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
              openSections.warranty ? 'rotate-180 text-neutral-900' : ''
            }`}
          />
        </button>

        {openSections.warranty && (
          <div className="pt-4 pb-2 space-y-2.5 text-xs sm:text-[13px] text-neutral-700 leading-relaxed animate-fadeIn">
            <p>
              <strong className="text-neutral-950 font-semibold">Pertukaran Saiz Tanpa Kerumitan:</strong>{' '}
              {locale === 'ms'
                ? 'Jika saiz kasut tidak muat atau kurang selesa, anda boleh membuat pertukaran saiz dalam tempoh 7 hari selepas menerima pesanan.'
                : 'If your shoes do not fit comfortably, exchange for another size within 7 days of delivery.'}
            </p>
            <p>
              <strong className="text-neutral-950 font-semibold">100% Jaminan Ketulenan:</strong>{' '}
              {locale === 'ms'
                ? 'Semua produk dijamin tulen, melepasi kawalan kualiti ketat dan disertakan kad jaminan rasmi ELFY.'
                : 'Every piece is guaranteed 100% authentic and covered by ELFY standard warranty.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
