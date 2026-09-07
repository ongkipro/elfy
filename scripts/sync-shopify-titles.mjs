#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

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

const storeDomain = env.PUBLIC_STORE_DOMAIN || 'vvxgev-3p.myshopify.com';
const sfToken = env.PUBLIC_STOREFRONT_API_TOKEN;
if (!sfToken) {
  console.error('❌ Error: PUBLIC_STOREFRONT_API_TOKEN is missing in .env');
  process.exit(1);
}

const catalogPath = resolve(process.cwd(), 'scripts/catalog-optimized.json');
if (!existsSync(catalogPath)) {
  console.error('❌ catalog-optimized.json not found!');
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(catalogPath, 'utf-8'));

async function fetchProductGid(handle) {
  const res = await fetch(`https://${storeDomain}/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': sfToken,
    },
    body: JSON.stringify({
      query: `query getProduct($handle: String!) { product(handle: $handle) { id title handle } }`,
      variables: { handle },
    }),
  });
  const json = await res.json();
  return json?.data?.product;
}

const MUTATION_FILE = '/tmp/shopify-product-update.graphql';
const VARS_FILE = '/tmp/shopify-product-vars.json';

const UPDATE_MUTATION = `mutation updateProduct($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      handle
    }
    userErrors {
      field
      message
    }
  }
}
`;

writeFileSync(MUTATION_FILE, UPDATE_MUTATION, 'utf-8');

async function main() {
  console.log(`\n🚀 SYNCHRONIZING PRODUCT TITLES & SEO TO SHOPIFY [${storeDomain}]`);
  console.log(`Total Products in Queue: ${catalog.length}\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const prefix = `[${(i + 1).toString().padStart(2, ' ')}/${catalog.length}] ${item.handle}`;
    process.stdout.write(`${prefix.padEnd(52)} ... `);

    try {
      const liveProduct = await fetchProductGid(item.handle);
      if (!liveProduct?.id) {
        console.log(`⚠️  NOT FOUND on live store`);
        failCount++;
        continue;
      }

      const input = {
        id: liveProduct.id,
        title: item.newTitle,
        descriptionHtml: item.descriptionHtml,
        seo: {
          title: item.seoTitle,
          description: item.seoDescription,
        },
      };

      writeFileSync(VARS_FILE, JSON.stringify({ input }, null, 2), 'utf-8');

      const cmd = `npx shopify store execute --store ${storeDomain} --allow-mutations --query-file ${MUTATION_FILE} --variable-file ${VARS_FILE} --json`;
      const out = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });

      // Parse output JSON (ignoring npm notice lines if any)
      const jsonStart = out.indexOf('{');
      if (jsonStart === -1) {
        throw new Error('No JSON output returned from CLI');
      }
      const parsed = JSON.parse(out.slice(jsonStart));
      const userErrors = parsed?.productUpdate?.userErrors || [];

      if (userErrors.length > 0) {
        console.log(`❌ Error: ${userErrors.map((e) => e.message).join(', ')}`);
        failCount++;
      } else {
        const updated = parsed?.productUpdate?.product;
        console.log(`✅ "${updated?.title || item.newTitle}"`);
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
      failCount++;
    }

    // Rate-limit buffer (500ms)
    await new Promise((r) => setTimeout(r, 500));
  }

  // Cleanup temp files
  try {
    if (existsSync(MUTATION_FILE)) unlinkSync(MUTATION_FILE);
    if (existsSync(VARS_FILE)) unlinkSync(VARS_FILE);
  } catch {}

  console.log('\n======================================================================');
  console.log(`🎉 COMPLETED: ${successCount} products updated successfully, ${failCount} failed.`);
  console.log('======================================================================\n');
}

main();
