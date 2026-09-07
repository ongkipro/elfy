import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {
  Ruler,
  Truck,
  RefreshCw,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import {Breadcrumb} from '~/components/Breadcrumb';
import {getPageSeo} from '~/lib/seo-catalog';

export const meta: Route.MetaFunction = ({data}) => {
  const page = data?.page;
  if (!page) {
    return [{title: 'Halaman Tidak Ditemui - ELFY'}];
  }

  const seo = getPageSeo(page.handle, {
    title: page.title,
    seoTitle: page.seo?.title,
    description: page.seo?.description,
  });

  const title = seo.title;
  const description = seo.description;
  const canonicalUrl = `https://elfy.my/pages/${page.handle}`;

  return [
    {title},
    {name: 'description', content: description},
    {tagName: 'link', rel: 'canonical', href: canonicalUrl},
    {property: 'og:site_name', content: 'ELFY'},
    {property: 'og:locale', content: 'ms_MY'},
    {property: 'og:type', content: 'website'},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
  ];
};

const STATIC_PAGES: Record<string, {title: string; type: string}> = {
  'size-guide': {title: 'Panduan Saiz Kaki Malaysia (CM)', type: 'size-guide'},
  'warranty-returns': {title: 'Jaminan Tukar Saiz 7 Hari & Waranti', type: 'warranty-returns'},
  'shipping-faq': {title: 'Kadar & Masa Penghantaran Pos', type: 'shipping-faq'},
  about: {title: 'Tentang Jenama ELFY', type: 'about'},
};

export async function loader(args: Route.LoaderArgs) {
  const {params, context, request} = args;
  const handle = params.handle;

  if (!handle) {
    throw new Error('Missing page handle');
  }

  type PageData = {
    handle: string;
    id: string;
    title: string;
    body: string;
    isCustomStatic?: boolean;
    staticType?: string;
    seo?: {title?: string | null; description?: string | null} | null;
  };

  let page: PageData | null = null;
  try {
    const res = await context.storefront.query(PAGE_QUERY, {
      variables: {handle},
    });
    if (res.page) {
      page = res.page;
    }
  } catch {
    // Page query might fail or page may not exist yet in admin
  }

  if (!page && STATIC_PAGES[handle]) {
    page = {
      handle,
      id: `static-${handle}`,
      title: STATIC_PAGES[handle].title,
      body: '',
      isCustomStatic: true,
      staticType: STATIC_PAGES[handle].type,
      seo: {title: STATIC_PAGES[handle].title, description: null},
    };
  }

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  if (!page.isCustomStatic) {
    redirectIfHandleIsLocalized(request, {handle: page.handle, data: page});
  }

  return {page};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-[#191817] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb
            items={[
              {label: 'Utama', to: '/'},
              {label: page.title},
            ]}
            currentUrl={`https://elfy.my/pages/${page.handle}`}
          />
        </div>

        {/* Header */}
        <header className="pb-8 border-b border-[#EBE6DF]">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#B48344] block mb-2">
            ELFY Customer Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#191817]">
            {page.title}
          </h1>
        </header>

        {/* Content Body */}
        <main className="pt-8">
          {page.isCustomStatic ? (
            <RenderStaticPageContent type={page.staticType || ''} />
          ) : (
            <div
              className="prose prose-stone max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{__html: page.body}}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function RenderStaticPageContent({type}: {type: string}) {
  if (type === 'size-guide') {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-[#191817] flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#B48344]" />
            <span>Cara Mengukur Panjang Kaki Anda (CM)</span>
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <li>Letakkan sehelai kertas A4 di atas lantai yang rata, rapat ke dinding.</li>
            <li>Pijak di atas kertas dengan tumit menyentuh dinding.</li>
            <li>Tandakan hujung jari kaki anda yang paling panjang menggunakan pensel.</li>
            <li>Ukur jarak dari dinding ke tanda tersebut dalam sentimeter (CM).</li>
            <li>Bandingkan ukuran CM anda dengan jadual saiz di bawah.</li>
          </ol>
        </div>

        {/* Size Chart Table */}
        <div className="bg-white border border-[#EBE6DF] rounded-2xl overflow-hidden shadow-xs">
          <div className="px-6 py-4 bg-[#F8F6F2] border-b border-[#EBE6DF]">
            <h3 className="text-sm font-bold text-[#191817]">Jadual Penukaran Saiz Kasut ELFY</h3>
            <p className="text-xs text-stone-500 mt-0.5">Potongan Asian Wide-Fit (E-Width) Standard Malaysia</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF9F6] border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Panjang Kaki (CM)</th>
                  <th className="px-6 py-3 font-semibold">Saiz EU (Malaysia)</th>
                  <th className="px-6 py-3 font-semibold">Saiz UK</th>
                  <th className="px-6 py-3 font-semibold">Saiz US</th>
                  <th className="px-6 py-3 font-semibold">Status Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                <tr>
                  <td className="px-6 py-3.5 font-medium">24.5 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 39</td>
                  <td className="px-6 py-3.5">UK 5.5</td>
                  <td className="px-6 py-3.5">US 6.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium">25.0 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 40</td>
                  <td className="px-6 py-3.5">UK 6.5</td>
                  <td className="px-6 py-3.5">US 7.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium">25.5 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 41</td>
                  <td className="px-6 py-3.5">UK 7.5</td>
                  <td className="px-6 py-3.5">US 8.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium">26.0 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 42</td>
                  <td className="px-6 py-3.5">UK 8.5</td>
                  <td className="px-6 py-3.5">US 9.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium">26.5 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 43</td>
                  <td className="px-6 py-3.5">UK 9.5</td>
                  <td className="px-6 py-3.5">US 10.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-medium">27.0 cm</td>
                  <td className="px-6 py-3.5 font-bold text-[#191817]">EU 44</td>
                  <td className="px-6 py-3.5">UK 10.5</td>
                  <td className="px-6 py-3.5">US 11.5</td>
                  <td className="px-6 py-3.5 text-[#2B593F] font-semibold">Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* WhatsApp Consultation Prompt */}
        <div className="bg-[#191817] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-sm">Masih ragu-ragu tentang saiz anda?</h4>
            <p className="text-xs text-stone-300 mt-0.5">Hantar gambar kaki anda ke WhatsApp kami untuk cadangan saiz segera.</p>
          </div>
          <a
            href="https://wa.me/601111111111?text=Hi%20ELFY,%20tolong%20cadangkan%20saiz%20kasut"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  if (type === 'warranty-returns') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#B48344]">
            <RefreshCw className="w-6 h-6" />
            <h2 className="text-base font-bold text-[#191817]">Jaminan Tukar Saiz 7 Hari Percuma</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Kami faham membeli kasut secara atas talian memerlukan kepastian. Jika kasut yang anda terima tidak muat atau tersalah saiz, anda berhak menukar saiz dalam tempoh <strong>7 hari</strong> selepas bungkusan diterima.
          </p>
          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 space-y-2 text-xs text-stone-800">
            <h4 className="font-bold">Syarat Penukaran:</h4>
            <ul className="list-disc list-inside space-y-1 text-stone-600">
              <li>Kasut belum dipakai di luar rumah (tapak masih bersih).</li>
              <li>Kotak dan tag asal berada dalam keadaan baik.</li>
              <li>Proses penukaran diuruskan secara terus 1-ke-1 melalui WhatsApp rasmi.</li>
            </ul>
          </div>
        </div>

        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#B48344]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-base font-bold text-[#191817]">1-Tahun Waranti Rasmi Jam Tangan</h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            Setiap jam tangan ELFY disertakan dengan kad waranti rasmi bertarikh. Waranti ini meliputi kerosakan teknikal pergerakan enjin (movement caliber) selama 12 bulan dari tarikh pembelian.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'shipping-faq') {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-[#B48344]">
            <Truck className="w-6 h-6" />
            <h2 className="text-base font-bold text-[#191817]">Kadar & Masa Penghantaran Pos</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
              <h3 className="font-bold text-xs text-[#191817] mb-1">Semenanjung Malaysia</h3>
              <p className="text-xs text-stone-600">
                • <strong>Masa Sampai:</strong> 1 hingga 3 hari bekerja.
                <br />
                • <strong>Kadar:</strong> Percuma untuk pesanan RM150 ke atas (RM8 jika bawah RM150).
                <br />
                • <strong>Kurir:</strong> J&T Express & Pos Laju.
              </p>
            </div>
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-200">
              <h3 className="font-bold text-xs text-[#191817] mb-1">Sabah & Sarawak</h3>
              <p className="text-xs text-stone-600">
                • <strong>Masa Sampai:</strong> 3 hingga 5 hari bekerja.
                <br />
                • <strong>Kadar:</strong> RM18 rata (Percuma untuk pesanan RM220+).
                <br />
                • <strong>Kurir:</strong> Pos Laju Air Freight berinsurans.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default About Page
  return (
    <div className="bg-white border border-[#EBE6DF] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed">
      <h2 className="text-base font-bold text-[#191817]">Tentang ELFY Kuala Lumpur</h2>
      <p>
        Dilahirkan di tengah kesibukan Kuala Lumpur, ELFY didedikasikan untuk menghasilkan barangan fesyen kasual sartorial yang menyeimbangkan estetika sofistikated dan keselesaan harian.
      </p>
      <p>
        Fokus kami tertumpu pada kasut kulit tulen dengan potongan Asian Wide-Fit dan jam tangan berkaca Sapphire Crystal berketepatan tinggi.
      </p>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
