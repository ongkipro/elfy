import { ms } from './ms';
import { en } from './en';

export type Locale = 'ms' | 'en';

export function getTranslations(locale?: string) {
  if (locale === 'en') {
    return en;
  }
  return ms; // Default to Bahasa Melayu
}
