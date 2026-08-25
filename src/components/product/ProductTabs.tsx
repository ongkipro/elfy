import React, { useState } from 'react';
import { Truck, ShieldCheck, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import { ParsedProductDescription } from './ParsedProductDescription';

interface ProductTabsProps {
  descriptionHtml: string;
  isShoe: boolean;
  isWatch: boolean;
  locale?: string;
}

export function ProductTabs({ descriptionHtml, isShoe, isWatch, locale = 'ms' }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'shipping' | 'warranty'>('desc');

  return (
    <div className="border border-[#E8E3DA] rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* Tabs Navigation Header */}
      <div className="flex border-b border-[#E8E3DA] bg-[#F7F4EC] text-xs font-bold uppercase tracking-wider overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('desc')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'desc'
              ? 'border-[#121212] text-neutral-950 bg-white shadow-xs'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{locale === 'ms' ? 'Deskripsi & Rekaan' : 'Description & Details'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'shipping'
              ? 'border-[#121212] text-neutral-950 bg-white shadow-xs'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>{locale === 'ms' ? 'Penghantaran & Kurier' : 'Shipping & Delivery'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warranty')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'warranty'
              ? 'border-[#121212] text-neutral-950 bg-white shadow-xs'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{locale === 'ms' ? 'Jaminan & Tukar Saiz' : 'Warranty & Exchange'}</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-5 sm:p-6 text-xs text-neutral-700 leading-relaxed">
        {activeTab === 'desc' && (
          <ParsedProductDescription html={descriptionHtml} locale={locale} />
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-neutral-950 text-xs uppercase tracking-wider block">
                  {locale === 'ms' ? 'Semenanjung Malaysia (West MY)' : 'Peninsular Malaysia'}
                </span>
                <p className="text-neutral-600 text-xs">
                  {locale === 'ms'
                    ? 'Tempoh: 2 - 3 hari bekerja. Percuma untuk pesanan RM 150 ke atas (Kadar biasa RM 8.00).'
                    : 'Duration: 2 - 3 business days. Free for orders above RM 150 (Flat RM 8.00 below).'}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span className="font-bold text-neutral-950 text-xs uppercase tracking-wider block">
                  {locale === 'ms' ? 'Sabah & Sarawak (East MY)' : 'East Malaysia'}
                </span>
                <p className="text-neutral-600 text-xs">
                  {locale === 'ms'
                    ? 'Tempoh: 3 - 5 hari bekerja melalui Pos Laju / J&T Express (Kadar rata RM 15.00).'
                    : 'Duration: 3 - 5 business days via Pos Laju / J&T Express (Flat RM 15.00).'}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 italic">
              {locale === 'ms'
                ? '*Nombor penjejakan (Tracking Number) akan dihantar secara automatik melalui SMS dan WhatsApp sebaik sahaja bungkusan diproses.'
                : '*Tracking numbers are sent automatically via SMS and WhatsApp upon order dispatch.'}
            </p>
          </div>
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <RotateCcw className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-emerald-950 text-xs mb-0.5">
                  {locale === 'ms' ? 'Polisi Pertukaran Saiz 7 Hari' : '7-Day Size Exchange Guarantee'}
                </h5>
                <p className="text-emerald-900 text-xs leading-relaxed">
                  {locale === 'ms'
                    ? 'Jika saiz kasut tidak muat atau kurang selesa, anda boleh membuat pertukaran saiz dalam tempoh 7 hari selepas menerima bungkusan tanpa sebarang cas tersembunyi.'
                    : 'If the shoes do not fit comfortably, exchange for another size within 7 days of delivery with zero hassle.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-amber-950 text-xs mb-0.5">
                  {locale === 'ms' ? 'Jaminan Kualiti & Ketulenan' : 'Authenticity & Craftsmanship Guarantee'}
                </h5>
                <p className="text-amber-900 text-xs leading-relaxed">
                  {locale === 'ms'
                    ? 'Setiap produk VELLUM dijamin menggunakan material asli berkualiti tinggi dan disertakan kad jaminan rasmi.'
                    : 'Every VELLUM piece is crafted with genuine high-grade materials and includes official warranty verification.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
