import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {trackPageView, type FbPixelFunction} from '~/lib/tracking';
import {getOrCreateVisitorId} from '~/lib/attribution';

interface MetaPixelProps {
  pixelId?: string;
  nonce?: string;
}

export function MetaPixel({pixelId = '123456789012345', nonce}: MetaPixelProps) {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize Meta Pixel if not already present
    if (!window.fbq) {
      const fbq: FbPixelFunction = Object.assign(
        function (...args: unknown[]) {
          fbq.queue.push(args);
        },
        {
          queue: [] as unknown[],
          loaded: true,
          version: '2.0',
        },
      );

      window.fbq = fbq;
      window._fbq = fbq;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      if (nonce) script.nonce = nonce;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript?.parentNode?.insertBefore(script, firstScript);

      const vid = getOrCreateVisitorId();
      if (vid) {
        fbq('init', pixelId, {external_id: vid});
      } else {
        fbq('init', pixelId);
      }
    }

    // Track PageView on route transitions
    trackPageView(window.location.href);
  }, [location.pathname, location.search, pixelId, nonce]);

  return null;
}
