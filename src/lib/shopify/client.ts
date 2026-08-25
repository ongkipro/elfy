import type { SupportedLanguage, SupportedCountry, Product, Collection } from './types';
import liveFallbackData from './live-products.json';

const SHOPIFY_DOMAIN = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN || 'vvxgev-3p.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN || 'd19296e111796d6877f879956789185d';
const API_VERSION = '2025-01';

const GRAPHQL_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

interface ShopifyFetchParams {
  query: string;
  variables?: Record<string, unknown>;
  language?: SupportedLanguage;
  country?: SupportedCountry;
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  language = 'MS',
  country = 'MY',
}: ShopifyFetchParams): Promise<T | null> {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
        'Accept-Language': language === 'MS' ? 'ms-MY' : 'en-MY',
      },
      body: JSON.stringify({
        query,
        variables: {
          ...variables,
          language,
          country,
        },
      }),
    });

    if (!response.ok) {
      console.warn(`[Shopify API Status ${response.status}] Falling back to stored snapshot.`);
      return null;
    }

    const json = await response.json();
    if (json.errors) {
      console.warn('[Shopify GraphQL Error]:', json.errors[0]?.message);
      return null;
    }

    return json.data as T;
  } catch (error) {
    console.warn('[Shopify Fetch Failed]:', error);
    return null;
  }
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int = 50, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        descriptionHtml
        productType
        tags
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 10) {
          nodes {
            url
            altText
            width
            height
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

const SINGLE_PRODUCT_QUERY = `
  query GetProductByHandle($handle: String!, $language: LanguageCode, $country: CountryCode)
  @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      productType
      tags
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

function transformProduct(p: any): Product {
  const isShoe =
    p.productType?.toLowerCase().includes('shoe') ||
    p.handle?.startsWith('sepatu-') ||
    p.tags?.some((t: string) => t.toLowerCase().includes('shoe') || t.toLowerCase().includes('sneaker'));

  const isWatch =
    p.productType?.toLowerCase().includes('watch') ||
    p.handle?.startsWith('jam-tangan-') ||
    p.tags?.some((t: string) => t.toLowerCase().includes('watch'));

  const normalizedType = isShoe ? 'Shoes' : isWatch ? 'Watches' : (p.productType || 'Fashion');

  return {
    ...p,
    productType: normalizedType,
    featuredImage: p.featuredImage || p.images?.nodes?.[0] || {
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      altText: p.title,
      width: 800,
      height: 800,
    },
    watchSpecs: isWatch
      ? {
          caseDiameter: '41.0 mm',
          lugWidth: '20.0 mm',
          movement: 'Precision Japanese Quartz Movement',
          glass: 'Scratch-Resistant Mineral Crystal',
          waterResistance: '3 ATM / 30 Metres (Daily Splash Resistant)',
          strap: 'Stainless Steel / Durable Alloy Bracelet',
        }
      : undefined,
  };
}

export async function getProducts(category?: string, language: SupportedLanguage = 'MS'): Promise<Product[]> {
  const result = await shopifyFetch<{ products: { nodes: any[] } }>({
    query: PRODUCTS_QUERY,
    language,
    country: 'MY',
  });

  let rawList = result?.products?.nodes;
  if (!rawList || rawList.length === 0) {
    rawList = (liveFallbackData as any).data?.products?.nodes || [];
  }

  const transformed = rawList.map(transformProduct);

  if (category) {
    const cat = category.toLowerCase();
    if (cat === 'shoes' || cat === 'kasut' || cat === 'sepatu') {
      return transformed.filter((p) => p.productType === 'Shoes');
    }
    if (cat === 'watches' || cat === 'jam-tangan') {
      return transformed.filter((p) => p.productType === 'Watches');
    }
  }

  return transformed;
}

export async function getProductByHandle(handle: string, language: SupportedLanguage = 'MS'): Promise<Product | undefined> {
  const result = await shopifyFetch<{ product: any }>({
    query: SINGLE_PRODUCT_QUERY,
    variables: { handle },
    language,
    country: 'MY',
  });

  if (result?.product) {
    return transformProduct(result.product);
  }

  const fallbackList = (liveFallbackData as any).data?.products?.nodes || [];
  const found = fallbackList.find((p: any) => p.handle === handle);
  if (found) {
    return transformProduct(found);
  }

  return undefined;
}

export async function getCollections(): Promise<Collection[]> {
  const allProducts = await getProducts();
  const shoeCount = allProducts.filter((p) => p.productType === 'Shoes').length;
  const watchCount = allProducts.filter((p) => p.productType === 'Watches').length;

  return [
    {
      id: 'col-shoes',
      handle: 'shoes',
      title: 'Footwear & Sneakers',
      titleMs: 'Koleksi Kasut & Sneakers',
      description: 'Engineered for comfort, lightweight support and all-day urban versatility.',
      descriptionMs: 'Direka untuk keselesaan sepanjang hari, tapak kusyen anti-gelincir dan gaya kasual harian.',
      image: {
        url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80',
        altText: 'Koleksi Kasut ELFY',
      },
      productCount: shoeCount,
    },
    {
      id: 'col-watches',
      handle: 'watches',
      title: 'Precision Timepieces',
      titleMs: 'Koleksi Jam Tangan Eksklusif',
      description: 'Sophisticated analog chrono, precision quartz and classic timepieces with scratchproof glass.',
      descriptionMs: 'Koleksi jam tangan mewah analog kronograf dan quartz dengan kaca kalis calar.',
      image: {
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
        altText: 'Koleksi Jam Tangan ELFY',
      },
      productCount: watchCount,
    },
    {
      id: 'col-all',
      handle: 'all',
      title: 'All Collections',
      titleMs: 'Semua Koleksi ELFY',
      description: 'Explore our complete catalog of curated footwear and timepieces.',
      descriptionMs: 'Lihat keseluruhan katalog kasut dan jam tangan eksklusif ELFY.',
      image: {
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        altText: 'Semua Koleksi ELFY',
      },
      productCount: allProducts.length,
    },
  ];
}
