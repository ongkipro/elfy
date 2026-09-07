import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  CheckCircle2,
  Package,
} from 'lucide-react';

/**
 * <PaginatedResourceSection> encapsulates luxury previous and next pagination behaviors with rich UX.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: (props: {node: NodesType; index: number}) => React.ReactElement | null;
  ariaLabel?: string;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, hasNextPage, hasPreviousPage, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div className="w-full">
            {/* Top / Previous Pagination */}
            {hasPreviousPage && (
              <div className="flex justify-center mb-8">
                <PreviousLink
                  className="group inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-[#EBE6DF] hover:border-[#191817] text-stone-700 hover:text-[#191817] rounded-full text-xs font-semibold shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B48344]" />
                      <span>Memuatkan...</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-3.5 h-3.5 text-[#B48344] group-hover:-translate-y-0.5 transition-transform" />
                      <span>Muat Produk Terdahulu</span>
                    </>
                  )}
                </PreviousLink>
              </div>
            )}

            {/* Main Resource Grid */}
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              <div>{resourcesMarkup}</div>
            )}

            {/* Bottom / Load More Pagination Module */}
            <div className="mt-12 sm:mt-16 flex flex-col items-center justify-center text-center">
              {hasNextPage ? (
                <div className="flex flex-col items-center max-w-sm w-full space-y-4">
                  {/* Informative Progress Header */}
                  <div className="w-full space-y-1.5 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 font-medium">
                      <Package className="w-3.5 h-3.5 text-[#B48344]" />
                      <span>
                        Menunjukkan <strong className="font-bold text-[#191817]">{nodes.length}</strong> produk
                      </span>
                    </div>
                  </div>

                  {/* Primary Luxury Load More Action */}
                  <NextLink
                    className="group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#191817] hover:bg-stone-800 active:scale-[0.985] text-white rounded-lg font-medium text-xs uppercase tracking-[0.14em] shadow-xs transition-all duration-200 select-none cursor-pointer w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white shrink-0" />
                        <span>Memuatkan Koleksi...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-105 transition-transform shrink-0" />
                        <span>Muat Lagi Produk</span>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-white group-hover:translate-y-0.5 transition-all shrink-0" />
                      </>
                    )}
                  </NextLink>
                </div>
              ) : (
                /* All Products Loaded - Elegant End of Catalog State */
                nodes.length > 0 && (
                  <div className="flex flex-col items-center justify-center py-6 px-4 max-w-md mx-auto text-center border-t border-[#EBE6DF]/80 w-full pt-8">
                    <div className="w-9 h-9 rounded-full bg-[#2B593F]/10 border border-[#2B593F]/20 flex items-center justify-center mb-2.5 shadow-2xs">
                      <CheckCircle2 className="w-4.5 h-4.5 text-[#2B593F]" />
                    </div>
                    <span className="text-xs font-bold text-[#191817] uppercase tracking-wider">
                      Semua {nodes.length} Produk Telah Dipaparkan
                    </span>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs leading-relaxed">
                      Anda telah menerokai keseluruhan koleksi rasmi ini.
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
