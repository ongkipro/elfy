import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {getAttributionPayload, toCartAttributes} from '~/lib/attribution';

interface CartAttributionSyncProps {
  attributes?: Array<{key: string; value?: string | null}> | null;
}

export function CartAttributionSync({attributes}: CartAttributionSyncProps) {
  const fetcher = useFetcher();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || hasSyncedRef.current) return;

    const payload = getAttributionPayload();
    const desiredAttributes = toCartAttributes(payload);
    if (desiredAttributes.length === 0) return;

    const existingLookup: Record<string, string> = Object.fromEntries(
      (attributes || []).map((a) => [a.key, a.value ?? '']),
    );

    const needsSync = desiredAttributes.some(
      (attr) => existingLookup[attr.key] !== attr.value,
    );
    if (needsSync && fetcher.state === 'idle') {
      hasSyncedRef.current = true;
      fetcher.submit(
        {
          [CartForm.INPUT_NAME]: JSON.stringify({
            action: CartForm.ACTIONS.AttributesUpdateInput,
            inputs: {attributes: desiredAttributes},
          }),
        },
        {method: 'POST', action: '/cart'},
      );
    }
  }, [attributes, fetcher]);

  return null;
}
