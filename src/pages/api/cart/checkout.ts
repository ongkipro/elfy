import type { APIRoute } from 'astro';

const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || 'vvxgev-3p.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'd19296e111796d6877f879956789185d';
const API_VERSION = '2025-01';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

const CREATE_CART_MUTATION = `
  mutation CreateCart($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const lines = body.lines; // array of { merchandiseId: string, quantity: number }

    if (!lines || lines.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: CREATE_CART_MUTATION,
        variables: {
          lines,
        },
      }),
    });

    const json = await response.json();

    if (json.errors || json.data?.cartCreate?.userErrors?.length > 0) {
      console.warn('[Shopify Checkout Create Error]:', json.errors || json.data?.cartCreate?.userErrors);
      // Fallback direct checkout link with variants
      const queryParam = lines.map((l: any) => `${l.merchandiseId.split('/').pop()}:${l.quantity}`).join(',');
      const fallbackUrl = `https://${SHOPIFY_DOMAIN}/cart/${queryParam}`;
      return new Response(JSON.stringify({ checkoutUrl: fallbackUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const checkoutUrl = json.data?.cartCreate?.cart?.checkoutUrl;

    return new Response(JSON.stringify({ checkoutUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[Checkout API Endpoint Error]:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
