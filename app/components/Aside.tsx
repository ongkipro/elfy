import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {useId} from 'react';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const id = useId();

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      // Prevent body scrolling while aside is open
      document.body.style.overflow = 'hidden';

      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      abortController.abort();
    };
  }, [close, expanded]);

  if (!expanded) return null;

  return (
    <div
      aria-modal
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-labelledby={id}
    >
      {/* Dimmed Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 transition-opacity"
        onClick={close}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#FAF9F6] h-full shadow-2xl flex flex-col z-10 border-l border-[#EBE6DF] animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-[#EBE6DF] flex items-center justify-between bg-white shrink-0">
          <h3
            id={id}
            className="font-serif text-base font-bold text-[#191817] tracking-wider uppercase"
          >
            {heading}
          </h3>
          <button
            onClick={close}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 hover:text-[#191817] flex items-center justify-center transition-all"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
