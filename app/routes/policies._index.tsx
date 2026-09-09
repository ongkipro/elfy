import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Polisi Rasmi - ELFY Official'},
    {
      name: 'description',
      content:
        'Ketahui maklumat lengkap mengenai polisi privasi, polisi penghantaran, dan polisi pulangan jenama ELFY Malaysia.',
    },
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {tagName: 'link', rel: 'canonical', href: 'https://elfy.my/policies'},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: 'Polisi Rasmi - ELFY Official'},
    {
      property: 'og:description',
      content:
        'Ketahui maklumat lengkap mengenai polisi privasi, polisi penghantaran, dan polisi pulangan jenama ELFY Malaysia.',
    },
    {property: 'og:url', content: 'https://elfy.my/policies'},
    {property: 'og:image', content: 'https://elfy.my/hero-desktop.webp'},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {property: 'og:image:alt', content: 'Polisi Rasmi - ELFY Official'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: 'Polisi Rasmi - ELFY Official'},
    {
      name: 'twitter:description',
      content:
        'Ketahui maklumat lengkap mengenai polisi privasi, polisi penghantaran, dan polisi pulangan jenama ELFY Malaysia.',
    },
    {name: 'twitter:image', content: 'https://elfy.my/hero-desktop.webp'},
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY, {
    cache: context.storefront.CacheLong(),
  });

  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="policies">
      <h1>Policies</h1>
      <div>
        {policies.map((policy) => (
          <fieldset key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
