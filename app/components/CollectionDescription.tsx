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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
      <div className="bg-white border border-[#EBE6DF] rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B48344]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#191817]">
              Ciri Khas & Piawaian Koleksi
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs font-semibold text-[#B48344] hover:text-[#8f642e] flex items-center gap-1 transition-colors"
          >
            <span>{isOpen ? 'Tutup Rincian' : 'Ketahui Keistimewaan'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Highlights Grid */}
        {isOpen && (
          <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
            {highlights.map((item, idx) => (
              <div key={idx} className="bg-[#FAF9F6] p-3.5 rounded-xl border border-stone-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#191817] mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2B593F] shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
