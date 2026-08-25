import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { formatRinggit } from '../../lib/utils/currency';

interface CartItem {
  variantId: string;
  title: string;
  variantTitle?: string;
  price: string;
  image?: string;
  quantity: number;
}

interface CartDrawerProps {
  locale?: string;
}

const FREE_SHIPPING_THRESHOLD = 150;

export function CartDrawer({ locale = 'ms' }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Calculate Subtotal
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const amountAway = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Sync cart badge in header
  useEffect(() => {
    const badge = document.getElementById('cart-badge-count');
    if (badge) {
      badge.textContent = totalQuantity.toString();
    }
  }, [totalQuantity]);

  // Listen to custom events
  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleOpen = () => setIsOpen(true);
    const handleAdd = (e: Event) => {
      const customEvent = e as CustomEvent<Omit<CartItem, 'quantity'>>;
      const newItem = customEvent.detail;
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.variantId === newItem.variantId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += 1;
          return updated;
        }
        return [...prev, { ...newItem, quantity: 1 }];
      });
    };

    window.addEventListener('toggle-cart', handleToggle);
    window.addEventListener('open-cart', handleOpen);
    window.addEventListener('add-to-cart', handleAdd);

    return () => {
      window.removeEventListener('toggle-cart', handleToggle);
      window.removeEventListener('open-cart', handleOpen);
      window.removeEventListener('add-to-cart', handleAdd);
    };
  }, []);

  const updateQuantity = (variantId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.variantId === variantId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleCheckout = async () => {
    if (items.length === 0 || isCheckingOut) return;
    setIsCheckingOut(true);

    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lines: items.map((i) => ({
            merchandiseId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        const variantParams = items.map((i) => `${i.variantId.split('/').pop()}:${i.quantity}`).join(',');
        window.location.href = `https://vvxgev-3p.myshopify.com/cart/${variantParams}`;
      }
    } catch (err) {
      console.error('Checkout redirect failed:', err);
      const variantParams = items.map((i) => `${i.variantId.split('/').pop()}:${i.quantity}`).join(',');
      window.location.href = `https://vvxgev-3p.myshopify.com/cart/${variantParams}`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col z-10 border-l border-[#E8E3DA]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8E3DA] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="font-serif text-base font-bold text-neutral-950 uppercase tracking-wider">
              {locale === 'ms' ? 'Beg Pembelian Anda' : 'Your Shopping Bag'}
            </h2>
            <span className="text-xs font-bold text-[#B89768] font-mono">
              ({totalQuantity})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="p-4 bg-[#F7F4EC] border-b border-[#E8E3DA]">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-neutral-800 flex items-center gap-1.5">
              {amountAway === 0 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#B89768]" />
                  <span className="font-bold text-emerald-800">
                    {locale === 'ms' ? 'Penghantaran Percuma Diaktifkan' : 'Free Express Shipping Unlocked'}
                  </span>
                </>
              ) : (
                <span>
                  {locale === 'ms'
                    ? `Tambah ${formatRinggit(amountAway)} lagi untuk Penghantaran Percuma`
                    : `Add ${formatRinggit(amountAway)} more for Free Shipping`}
                </span>
              )}
            </span>
            <span className="font-mono font-bold text-neutral-700">
              {Math.round(shippingProgress)}%
            </span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B89768] transition-all duration-500 rounded-full"
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Line Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 stroke-1" />
              <p className="text-sm font-medium">
                {locale === 'ms' ? 'Beg pembelian anda masih kosong.' : 'Your shopping bag is empty.'}
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold uppercase tracking-widest text-[#B89768] hover:underline cursor-pointer"
              >
                {locale === 'ms' ? 'Lihat Koleksi' : 'Explore Collections'}
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-4 p-3 bg-white rounded-xl border border-[#E8E3DA] shadow-2xs"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {item.title}
                    </h4>
                    {item.variantTitle && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.variantTitle}
                      </p>
                    )}
                    <span className="font-mono text-xs font-bold text-neutral-900 mt-1 block">
                      {formatRinggit(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, -1)}
                        className="p-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.variantId, 1)}
                        className="p-1 text-stone-600 hover:text-stone-900 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Buang / Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E3DA] bg-white space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                {locale === 'ms' ? 'Jumlah Kecil' : 'Subtotal'}
              </span>
              <span className="font-mono text-xl font-bold text-neutral-950">
                {formatRinggit(subtotal)}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 text-center">
              {locale === 'ms'
                ? 'Penghantaran & kaedah bayaran (FPX / DuitNow) diproses di gerbang pembayaran selamat.'
                : 'Taxes, shipping & local payment methods processed at secure checkout.'}
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-[#121212] hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#B89768]" />
                  <span>{locale === 'ms' ? 'Menyediakan Pembayaran...' : 'Preparing Checkout...'}</span>
                </>
              ) : (
                <>
                  <span>{locale === 'ms' ? 'Terus ke Pembayaran Selamat' : 'Proceed to Secure Checkout'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Local Malaysian Payment Trust Icons */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FPX • DuitNow • TNG • GrabPay • SPayLater</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
