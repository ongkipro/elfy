import React, {useEffect} from 'react';

interface GoogleTagManagerProps {
  gtmId?: string;
  nonce?: string;
}

export function GoogleTagManager({gtmId = 'GTM-ELFYMY', nonce}: GoogleTagManagerProps) {
  useEffect(() => {
    if (typeof window === 'undefined' || !gtmId) return;

    window.dataLayer = window.dataLayer || [];

    // Check if GTM script is already injected
    if (document.getElementById('gtm-script')) return;

    const script = document.createElement('script');
    script.id = 'gtm-script';
    script.async = true;
    if (nonce) script.nonce = nonce;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  }, [gtmId, nonce]);

  return null;
}
