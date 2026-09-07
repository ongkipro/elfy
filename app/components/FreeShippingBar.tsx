import React from 'react';
import {Truck, CheckCircle2} from 'lucide-react';

interface FreeShippingBarProps {
  subtotalAmount: number;
  currencyCode?: string;
  threshold?: number; // default RM 150
}

export function FreeShippingBar({
  subtotalAmount,
  currencyCode = 'MYR',
  threshold = 150,
}: FreeShippingBarProps) {
  const percentage = Math.min(Math.max((subtotalAmount / threshold) * 100, 0), 100);
  const remaining = Math.max(threshold - subtotalAmount, 0);
  const isUnlocked = subtotalAmount >= threshold;

  return (
    <div className="bg-[#F8F6F2] border border-[#EBE6DF] rounded-xl p-3.5 my-3">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 font-medium text-[#191817]">
          {isUnlocked ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#2B593F]" />
              <span className="text-[#2B593F] font-semibold">
                Tahniah! Anda Layak Dapat Free Shipping (Semenanjung)
              </span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-[#B48344]" />
              <span>
                Tambah <strong className="text-[#191817] font-semibold">RM {remaining.toFixed(2)}</strong> lagi untuk{' '}
                <strong className="text-[#2B593F]">Free Shipping</strong>
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-medium text-stone-500">
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-stone-200/80 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${
            isUnlocked ? 'bg-[#2B593F]' : 'bg-[#B48344]'
          }`}
          style={{width: `${percentage}%`}}
        />
      </div>
    </div>
  );
}
