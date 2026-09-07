/**
 * Cross-Domain Attribution Bridge for elfy.my
 * Captures Meta Pixel (_fbp, _fbc), Google Analytics (_ga), and Click IDs (gclid, fbclid)
 * to attach them into Shopify Cart Attributes for checkout handoff.
 */

export interface AttributionData {
  _attribution_fbp?: string;
  _attribution_fbc?: string;
  _attribution_ga?: string;
  _attribution_gclid?: string;
  _attribution_fbclid?: string;
  _attribution_external_id?: string;
  _landing_page?: string;
}

export function setCookie(name: string, value: string, days: number = 30): void {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = '; expires=' + date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const storageKey = '_elfy_vid';
  let vid = '';
  try {
    vid = window.localStorage.getItem(storageKey) || '';
  } catch {}
  if (!vid) {
    vid = getCookieValue(storageKey) || '';
  }
  if (!vid) {
    const randomPart = Math.random().toString(36).substring(2, 10);
    const timePart = Date.now().toString(36);
    vid = `ev_${timePart}_${randomPart}`;
    try {
      window.localStorage.setItem(storageKey, vid);
    } catch {}
    setCookie(storageKey, vid, 365);
  }
  return vid;
}

export function getCookieValue(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : undefined;
}

export function getAttributionPayload(): AttributionData {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const fbp = getCookieValue('_fbp');
  let fbc = getCookieValue('_fbc');
  const ga = getCookieValue('_ga');
  const gclid = urlParams.get('gclid') || undefined;
  const fbclid = urlParams.get('fbclid') || undefined;

  // If fbclid is present in URL and _fbc cookie not yet set by pixel, format according to Meta spec:
  // fb.1.{creation_timestamp}.{fbclid}
  if (!fbc && fbclid) {
    fbc = `fb.1.${Date.now()}.${fbclid}`;
    setCookie('_fbc', fbc, 90);
  }

  const vid = getOrCreateVisitorId();

  const payload: AttributionData = {};
  if (fbp) payload._attribution_fbp = fbp;
  if (fbc) payload._attribution_fbc = fbc;
  if (ga) payload._attribution_ga = ga;
  if (gclid) payload._attribution_gclid = gclid;
  if (fbclid) payload._attribution_fbclid = fbclid;
  if (vid) payload._attribution_external_id = vid;
  payload._landing_page = window.location.pathname;
  return payload;
}

export function toCartAttributes(attribution: AttributionData): Array<{key: string; value: string}> {
  return Object.entries(attribution)
    .filter(([_, value]) => Boolean(value))
    .map(([key, value]) => ({
      key,
      value: String(value),
    }));
}
