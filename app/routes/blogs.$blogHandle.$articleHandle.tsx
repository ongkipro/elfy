import {useLoaderData, useParams} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {Breadcrumb} from '~/components/Breadcrumb';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data, params}) => {
  const article = data?.article;
  if (!article) {
    return [{title: 'Artikel Tidak Ditemui - ELFY'}];
  }

  const rawTitle = article.seo?.title || `${article.title} - ELFY Journal`;
  const title = rawTitle.replace(/\s*\|\s*/g, ' - ');
  const description =
    article.seo?.description ||
    'Koleksi artikel sartorial, penjagaan kasut kulit asli, dan gaya horologi moden dari ELFY Malaysia.';
  const canonicalUrl = `https://elfy.my/blogs/${params.blogHandle}/${article.handle}`;
  const imageUrl = article.image?.url;

  return [
    {title},
    {name: 'description', content: description},
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY Journal'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'article'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl
      ? [
          {property: 'og:image', content: imageUrl},
          {property: 'og:image:alt', content: title},
          {name: 'twitter:image', content: imageUrl},
        ]
      : [
          {property: 'og:image', content: 'https://elfy.my/hero-desktop.webp'},
          {property: 'og:image:width', content: '1200'},
          {property: 'og:image:height', content: '630'},
          {property: 'og:image:alt', content: title},
          {name: 'twitter:image', content: 'https://elfy.my/hero-desktop.webp'},
        ]),
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {blogHandle} = useParams();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    image: image?.url || 'https://elfy.my/hero-desktop.webp',
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Person',
      name: author?.name || 'ELFY Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ELFY',
      logo: {
        '@type': 'ImageObject',
        url: 'https://elfy.my/favicon.svg',
      },
    },
    description: article.seo?.description || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://elfy.my/blogs/${blogHandle || 'journal'}/${article.handle}`,
    },
  };

  return (
    <div className="article max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(articleSchema)}}
      />
      <div className="mb-6">
        <Breadcrumb
          items={[
            {label: 'Utama', to: '/'},
            {label: 'Jurnal ELFY', to: `/blogs/${blogHandle || 'journal'}`},
            {label: title},
          ]}
          currentUrl={`https://elfy.my/blogs/${blogHandle || 'journal'}/${article.handle}`}
        />
      </div>

      <h1>
        {title}
        <div>
          <time dateTime={article.publishedAt}>{publishedDate}</time> &middot;{' '}
          <address>{author?.name}</address>
        </div>
      </h1>

      {image && <Image data={image} sizes="90vw" loading="eager" />}
      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="article"
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
