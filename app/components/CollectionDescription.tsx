import React, {useState} from 'react';
import {Sparkles, ChevronDown, ChevronUp, CheckCircle2} from 'lucide-react';

interface CollectionDescriptionProps {
  description: string;
}

export function parseCollectionDescription(rawText: string) {
  if (!rawText) return {intro: '', highlights: []};

  // Common delimiter patterns found in Shopify collection descriptions
  const sectionKeywords = [
    'Engineered Highlights:',
    'Craftsmanship Features:',
    'Exquisite Details:',
    'Why These Are Customer Favorites:',
    "What's New:",
  ];

  let intro = rawText;
  let highlightsText = '';

  for (const keyword of sectionKeywords) {
    if (rawText.includes(keyword)) {
      const parts = rawText.split(keyword);
      intro = parts[0].trim();
      highlightsText = parts[1].trim();
      break;
    }
  }

  // Parse highlights into individual items if present
  // Highlights often look like: "Ergonomic Cushioning: Advanced ... Breathable Mesh: Lightweight ..."
  const highlights: Array<{title: string; text: string}> = [];

  if (highlightsText) {
    // Split by sentences or known sub-headers
    // Look for patterns like "Word Word: "
    const regex = /([A-Za-z0-9\s&]+):\s*([^:]+?)(?=(?:[A-Za-z0-9\s&]+:|$))/g;
    let match;
    while ((match = regex.exec(highlightsText)) !== null) {
      const title = match[1].trim();
      const text = match[2].trim();
      if (title && text && title.length < 40) {
        highlights.push({title, text});
      }
    }
  }

  return {
    intro,
    highlights,
  };
}

export function CollectionHeroDescription({description}: CollectionDescriptionProps) {
  const {intro} = parseCollectionDescription(description);

  if (!intro) return null;

  return (
    <p className="mt-4 text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed font-normal">
      {intro}
    </p>
  );
}

export function CollectionHighlightsBar({description}: CollectionDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {highlights} = parseCollectionDescription(description);

  if (!highlights.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      <div className="border-t border-b border-stone-200/80 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#191817]">
            <Sparkles className="w-3.5 h-3.5 stroke-[1.5] text-[#8C6527]" />
            <span>Piawaian &amp; Keistimewaan Koleksi</span>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-medium text-stone-600 hover:text-[#191817] flex items-center gap-1.5 transition-colors cursor-pointer select-none"
          >
            <span>{isOpen ? 'Tutup Rincian' : 'Ketahui Keistimewaan'}</span>
            {isOpen ? (
              <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
            )}
          </button>
        </div>

        {/* Highlights Grid */}
        {isOpen && (
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in fade-in duration-200">
            {highlights.map((item, idx) => (
              <div key={idx} className="py-2 flex items-start gap-2.5">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5] text-[#2B593F] shrink-0 mt-0.5" />
                <div className="text-xs text-stone-600 leading-relaxed">
                  <strong className="text-[#191817] font-semibold mr-1">
                    {item.title}:
                  </strong>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
