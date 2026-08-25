import React from 'react';
import { Sparkles, Check, Gift, Layers, ShieldCheck, Zap } from 'lucide-react';

interface ParsedProductDescriptionProps {
  html: string;
  locale?: string;
}

export interface ParsedItem {
  label?: string;
  value: string;
}

export interface ParsedSection {
  type: 'intro' | 'features' | 'specs' | 'package' | 'raw';
  title: string;
  items?: ParsedItem[];
  text?: string;
}

export function parseShopifyDescription(html: string, locale: string = 'ms'): ParsedSection[] {
  if (!html) return [];

  const cleanHtml = html
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .trim();

  const sections: ParsedSection[] = [];

  // Split by <h3> or <h2> headers
  const headerRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  const parts = cleanHtml.split(headerRegex);

  // Intro overview paragraph
  if (parts[0] && parts[0].trim()) {
    const cleanIntro = parts[0]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleanIntro) {
      sections.push({
        type: 'intro',
        title: locale === 'ms' ? 'Ringkasan Rekaan' : 'Overview',
        text: cleanIntro,
      });
    }
  }

  for (let i = 1; i < parts.length; i += 2) {
    const headerRaw = parts[i]?.trim() || '';
    const contentRaw = parts[i + 1]?.trim() || '';
    const headerLower = headerRaw.toLowerCase();

    // Extract all <li> items
    const liMatches = Array.from(contentRaw.matchAll(/<li[^>]*>(.*?)<\/li>/gis));
    const items: ParsedItem[] = [];

    liMatches.forEach((m) => {
      let rawText = m[1]
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (rawText.includes(':')) {
        const colonIdx = rawText.indexOf(':');
        const label = rawText.slice(0, colonIdx).trim();
        const value = rawText.slice(colonIdx + 1).trim();
        if (value) {
          items.push({ label, value });
        } else {
          items.push({ value: label });
        }
      } else {
        if (rawText) {
          items.push({ value: rawText });
        }
      }
    });

    if (headerLower.includes('highlight') || headerLower.includes('feature') || headerLower.includes('keistimewaan') || headerLower.includes('ciri')) {
      sections.push({
        type: 'features',
        title: locale === 'ms' ? 'Ciri-Ciri Utama & Keistimewaan' : 'Key Highlights & Features',
        items,
      });
    } else if (headerLower.includes('package') || headerLower.includes('pakej') || headerLower.includes('termasuk')) {
      sections.push({
        type: 'package',
        title: locale === 'ms' ? 'Pakej Lengkap Termasuk' : 'Package Includes',
        items,
      });
    } else if (headerLower.includes('spec') || headerLower.includes('spesifikasi') || headerLower.includes('size guide') || headerLower.includes('saiz')) {
      sections.push({
        type: 'specs',
        title: locale === 'ms' ? 'Spesifikasi Teknikal & Ukuran' : 'Technical Specifications',
        items,
      });
    } else {
      sections.push({
        type: 'raw',
        title: headerRaw,
        text: contentRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
        items: items.length > 0 ? items : undefined,
      });
    }
  }

  return sections;
}
