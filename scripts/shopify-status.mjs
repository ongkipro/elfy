#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Parse .env
const envPath = resolve(process.cwd(), '.env');
const env = {};
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...rest] = trimmed.split('=');
      env[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
}

const domain = env.PUBLIC_STORE_DOMAIN || 'vvxgev-3p.myshopify.com';
const sfToken = env.PUBLIC_STOREFRONT_API_TOKEN;
const command = process.argv[2] || 'all';

if (!sfToken) {
  console.error('Error: PUBLIC_STOREFRONT_API_TOKEN is missing in .env');
  process.exit(1);
}

async function queryStorefront(query) {
  const res = await fetch(`https://${domain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': sfToken,
    },
    body: JSON.stringify({ query }),
  });
  return res.json();
}

async function main() {
  console.log(`\n🛍️  Shopify Storefront CLI [${domain}]\n`);

  if (command === 'shop' || command === 'all') {
    const data = await queryStorefront(`{
      shop {
        name
        description
        primaryDomain { host url }
        paymentSettings { currencyCode countryCode }
      }
    }`);
    console.log('📌 Shop Details:');
    console.log(JSON.stringify(data.data?.shop, null, 2));
    console.log('');
  }

  if (command === 'collections' || command === 'all') {
    const data = await queryStorefront(`{
      collections(first: 10) {
        nodes {
          id
          title
          handle
        }
      }
    }`);
    console.log('📁 Collections:');
    const cols = data.data?.collections?.nodes || [];
    cols.forEach((c) => {
      console.log(`  • ${c.title} (/${c.handle})`);
    });
    console.log('');
  }

  if (command === 'products' || command === 'all') {
    const data = await queryStorefront(`{
      products(first: 10) {
        nodes {
          id
          title
          handle
          productType
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }`);
    console.log('📦 Products Sample:');
    const prods = data.data?.products?.nodes || [];
    prods.forEach((p) => {
      const price = p.priceRange?.minVariantPrice;
      console.log(`  • ${p.title} - ${price?.currencyCode} ${parseFloat(price?.amount || 0).toFixed(2)} (/${p.handle})`);
    });
    console.log('');
  }
}

main().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
