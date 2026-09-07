import React, {useState} from 'react';
import {X, Check, Ruler, Info} from 'lucide-react';

interface SizeRecommenderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  selectedSize?: string;
}

const SIZE_CHART = [
  {cm: '24.5', eu: '39', uk: '5.5', us: '6.5'},
  {cm: '25.0', eu: '40', uk: '6.5', us: '7.5'},
  {cm: '25.5', eu: '41', uk: '7.5', us: '8.5'},
  {cm: '26.0', eu: '42', uk: '8.5', us: '9.5'},
  {cm: '26.5', eu: '43', uk: '9.5', us: '10.5'},
  {cm: '27.0', eu: '44', uk: '10.5', us: '11.5'},
];

export function SizeRecommenderModal({
  isOpen,
  onClose,
  onSelectSize,
  selectedSize,
}: SizeRecommenderModalProps) {
  const [activeCm, setActiveCm] = useState<string>('26.0');

  if (!isOpen) return null;

  const currentMatch = SIZE_CHART.find((item) => item.cm === activeCm) || SIZE_CHART[3];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container / Bottom Sheet */}
      <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-[#EBE6DF]">
        {/* Mobile Pull-Down Handle */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DF]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#B48344]" />
            <div>
              <h3 className="font-semibold text-base text-[#191817]">Panduan Saiz Kaki Malaysia</h3>
              <p className="text-xs text-stone-500">Ukur panjang kaki dari tumit ke jari terpanjang (CM)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/60 flex items-center justify-center text-stone-700 hover:bg-stone-300 active:scale-95 transition-all"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive CM Selector */}
        <div className="my-5">
          <label className="block text-xs font-semibold text-[#191817] mb-2 uppercase tracking-wider">
            Pilih Panjang Kaki Anda (CM):
          </label>
          <div className="grid grid-cols-6 gap-2">
            {SIZE_CHART.map((item) => {
              const isSelected = activeCm === item.cm;
              return (
                <button
                  key={item.cm}
                  type="button"
                  onClick={() => setActiveCm(item.cm)}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#191817] text-white border-[#191817] shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {item.cm}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendation Result Card */}
        <div className="bg-white border-2 border-[#B48344]/30 rounded-xl p-4 my-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              Cadangan Saiz Sesuai:
            </span>
            <div className="text-2xl font-bold text-[#191817] mt-0.5">
              EU {currentMatch.eu} <span className="text-sm font-medium text-stone-500">/ UK {currentMatch.uk}</span>
            </div>
            <span className="text-[11px] text-[#2B593F] font-medium flex items-center gap-1 mt-1">
              <Check className="w-3.5 h-3.5" /> Potongan Standard Wide-Fit Malaysia
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSelectSize(currentMatch.eu);
              onClose();
            }}
            className="bg-[#191817] hover:bg-[#B48344] text-white border border-[#191817] hover:border-[#B48344] text-xs font-semibold px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            Pilih Saiz {currentMatch.eu}
          </button>
        </div>

        {/* Local Reassurance Note */}
        <div className="bg-[#F3EFEA] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-stone-700">
          <Info className="w-4 h-4 text-[#B48344] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Jaminan Tukar Saiz 7 Hari Percuma:</strong> Jika kasut yang diterima terlalu ketat atau longgar, kami akan gantikan saiz baru tanpa sebarang caj tambahan.
          </p>
        </div>
      </div>
    </div>
  );
}
