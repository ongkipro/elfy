import React, {useState, useEffect} from 'react';
import {Link} from 'react-router';
import {
  BookOpen,
  Clock,
  ArrowRight,
  X,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface RelatedPost {
  id: string;
  category: string;
  title: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
  content: {
    lead: string;
    sections: {
      heading: string;
      body: string[];
    }[];
    tips: string[];
    actionCta?: {
      label: string;
      to: string;
      isExternal?: boolean;
    };
  };
}

const FOOTWEAR_POSTS: RelatedPost[] = [
  {
    id: 'wide-fit-sizing-guide',
    category: 'Panduan Saiz & Ergonomik',
    title: 'Panduan Memilih Saiz Kasut Kaki Lebar (Wide-Fit) di Malaysia',
    readTime: '3 min bacaan',
    date: 'Mac 2026',
    excerpt:
      'Ketahui cara tepat mengukur insole tapak kaki dalam CM dan kelebihan potongan Asian Wide-Fit (EU 39–44) tanpa rasa sempit atau melecet.',
    image: '/banners/mens-sneakers-3x2.webp',
    content: {
      lead:
        'Ramai lelaki di Malaysia berdepan masalah jari kaki melecet atau bahagian sisi tapak terasa tertekan bila memakai kasut standard Eropah yang tirus. Kasut ELFY direka khas dengan potongan Asian Wide-Fit (E-Width) untuk memberi ruang ergonomik pada jari kaki anda.',
      sections: [
        {
          heading: '1. Cara Tepat Mengukur Panjang Kaki (CM)',
          body: [
            'Pijak di atas sehelai kertas A4 yang diletakkan rapat ke dinding.',
            'Tandakan titik hujung jari kaki paling panjang menggunakan pensel bersudut 90 darjah.',
            'Ukur jarak dari dinding ke tanda tersebut dalam sentimeter (CM). Bandingkan dengan jadual saiz EU 39 hingga EU 44.',
          ],
        },
        {
          heading: '2. Tip Tambahan untuk Kaki Berisi atau Instep Tinggi',
          body: [
            'Jika anda mempunyai tapak kaki jenis kembang (wide flat) atau bahagian atas kaki (instep) tinggi, kami cadangkan memilih 1 saiz lebih besar (contoh: dari EU 41 ke EU 42) untuk keselesaan stoking tebal.',
            'ELFY menyediakan Jaminan Tukar Saiz 7 Hari Percuma ke pintu rumah anda sekiranya saiz yang diterima kurang padan.',
          ],
        },
      ],
      tips: [
        'Ukur kaki pada waktu petang kerana saiz kaki cenderung sedikit mengembang selepas seharian beraktiviti.',
        'Sentiasa pakai jenis stoking yang biasa anda gunakan semasa mengukur.',
      ],
      actionCta: {
        label: 'Lihat Jadual Panduan Saiz Lengkap (CM)',
        to: '/pages/size-guide',
      },
    },
  },
  {
    id: 'leather-care-malaysia',
    category: 'Penjagaan Material',
    title: '5 Tip Penjagaan Kasut Kulit Kasual Agar Tahan Bertahun-Tahun',
    readTime: '4 min bacaan',
    date: 'Mac 2026',
    excerpt:
      'Petua praktikal membersihkan kotoran harian, menjaga kelenturan kulit lembut, dan mengelakkan bau lembap dalam cuaca tropika Malaysia.',
    image: '/hero-desktop.webp',
    content: {
      lead:
        'Iklim Malaysia yang panas dan kerap hujan memerlukan penjagaan kasut yang betul agar material kulit kekal anjal, tapak getah tidak reput, dan insole sentiasa segar bebas bau.',
      sections: [
        {
          heading: '1. Bersihkan Habuk Selepas Dipakai',
          body: [
            'Gunakan kain microfiber lembap atau berus bulu lembut untuk menyapu kotoran debu jalanan. Elakkan merendam kasut di dalam air secara terus.',
            'Lap segera bahagian tapak getah jika terkena lumpur basah agar warna getah kekal cerah.',
          ],
        },
        {
          heading: '2. Cara Keringkan Kasut yang Terkena Hujan',
          body: [
            'Jangan sesekali menjemur kasut kulit di bawah matahari terik secara terus kerana sinaran UV berlebihan boleh meretakkan lapisan kulit.',
            'Masukkan gumpalan kertas tisu atau surat khabar ke dalam kasut untuk menyerap kelembapan dan angin-anginkan di tempat teduh bersirkulasi baik.',
          ],
        },
      ],
      tips: [
        'Gunakan pelindung kasut kalis air (waterproof spray) sebulan sekali untuk perlindungan titisan air hujan.',
        'Gilirkan pemakaian kasut setiap dua hari agar kusyen insole dapat mengembang semula sepenuhnya.',
      ],
      actionCta: {
        label: 'Ketahui Polisi Jaminan & Waranti ELFY',
        to: '/pages/warranty-returns',
      },
    },
  },
  {
    id: 'smart-casual-styling-guide',
    category: 'Inspirasi Gaya & OOTD',
    title: 'Gaya Smart-Casual: Padanan Kasut Sneakers Kulit ke Pejabat & Hujung Minggu',
    readTime: '3 min bacaan',
    date: 'Februari 2026',
    excerpt:
      'Panduan padanan warna kasut kasual kulit bersama seluar chino, slack, dan kemeja untuk gaya eksekutif muda yang kemas, maskulin dan sofistikated.',
    image: '/banners/best-sellers-3x2.webp',
    content: {
      lead:
        'Trend pakaian kerja kontemporari di Kuala Lumpur kini beralih kepada gaya Smart-Casual yang mengutamakan keselesaan mobiliti tanpa mengorbankan imej profesional. Kasut sneakers kulit minimalist adalah teras utama gaya ini.',
      sections: [
        {
          heading: '1. Padanan Pejabat: Kemeja & Chino Slim-Straight',
          body: [
            'Padankan sneakers kulit berwarna neutral (Hitam, Coklat Gelap, atau Putih Bersih) bersama seluar chino khaki atau navy.',
            'Pastikan potongan labuh seluar tidak bertindih tebal di atas lidah kasut (no-break atau slight-break) untuk siluet kaki yang kemas dan tinggi.',
          ],
        },
        {
          heading: '2. Padanan Santai Hujung Minggu: Polo & Seluar Linen',
          body: [
            'Untuk lepak di kafe atau acara keluarga, padankan kasut dengan baju kemeja linen berlengan pendek dan seluar slack potongan santai.',
            'Gunakan stoking pendek jenis no-show socks untuk penampilan buku lali yang kemas dan moden.',
          ],
        },
      ],
      tips: [
        'Padankan tona warna kasut dengan warna tali pinggang atau tali jam tangan anda untuk perincian sartorial yang harmoni.',
        'Sentiasa pastikan bahagian midsole kasut bersih sebelum ke mesyuarat penting.',
      ],
      actionCta: {
        label: 'Terokai Koleksi Sneakers Kasual Penuh',
        to: '/collections/mens-sneakers',
      },
    },
  },
];

const WATCH_POSTS: RelatedPost[] = [
  {
    id: 'watch-crystal-maintenance',
    category: 'Panduan Horologi',
    title: 'Penjagaan Kaca Kristal & Keluli Tahan Karat Jam Tangan Eksekutif',
    readTime: '3 min bacaan',
    date: 'Mac 2026',
    excerpt:
      'Cara menjaga kilauan bezel keluli, membersihkan kesan peluh harian, dan panduan ketahanan kalis air 3ATM semasa wuduk dan hujan renyai.',
    image: '/banners/mens-watches-3x2.webp',
    content: {
      lead:
        'Jam tangan eksekutif ELFY dibina menggunakan kaca kristal mineral tahan calar dan keluli tahan karat berkualiti tinggi. Penjagaan berkala yang mudah akan memastikan kilauan mewah jam anda bertahan berdekad lamanya.',
      sections: [
        {
          heading: '1. Membersihkan Kesan Peluh Harian',
          body: [
            'Peluh dan asid semulajadi kulit boleh mengurangkan kilauan keluli jika dibiarkan terlalu lama.',
            'Lap bahagian belakang casing dan pautan rantai keluli menggunakan kain microfiber lembut yang kering setiap kali selesai bekerja.',
          ],
        },
        {
          heading: '2. Memahami Ketahanan Kalis Air (Water Resistant)',
          body: [
            'Jam tangan ELFY direka untuk ketahanan kalis air harian (percikan air hujan, cuci tangan, dan wuduk).',
            'Elakkan menekan butang chronograph semasa jam basah dan jangan memakai jam ketika mandi air panas atau sauna.',
          ],
        },
      ],
      tips: [
        'Simpan jam tangan di dalam kotak eksklusif berlapik baldu yang dibekalkan percuma semasa pembelian.',
        'Jauhkan jam daripada medan magnet kuat seperti pembesar suara besar untuk menjaga ketepatan enjin quartz.',
      ],
      actionCta: {
        label: 'Ketahui Butiran 1-Tahun Waranti Jam Tangan',
        to: '/pages/warranty-returns',
      },
    },
  },
  {
    id: 'watch-case-diameter-guide',
    category: 'Panduan Pembeli',
    title: 'Panduan Saiz Diameter Jam Tangan Mengikut Pergelangan Tangan',
    readTime: '4 min bacaan',
    date: 'Mac 2026',
    excerpt:
      'Ketahui kesesuaian saiz dial 40mm–42mm agar terletak kemas pada pergelangan tangan lelaki Malaysia tanpa kelihatan terlalu besar atau kecil.',
    image: '/banners/womens-watches-3x2.webp',
    content: {
      lead:
        'Memilih saiz jam tangan yang betul adalah kunci kepada penampilan maskulin yang seimbang. Jam tangan yang terlalu besar tampak janggal, manakala yang terlalu kecil mungkin kurang menyerlahkan karisma.',
      sections: [
        {
          heading: '1. Panduan Ukuran Diameter Dial',
          body: [
            'Pergelangan tangan 15cm – 17cm (Kecil ke Sederhana): Diameter 38mm hingga 40mm adalah saiz klasik paling sempurna.',
            'Pergelangan tangan 17cm – 19cm (Sederhana ke Besar): Diameter 40mm hingga 42mm memberikan kehadiran visual yang tegap dan eksekutif.',
          ],
        },
        {
          heading: '2. Jarak Lug-to-Lug Adalah Penentu Utama',
          body: [
            'Bukan hanya diameter, jarak hujung tangkai (lug-to-lug) tidak sepatutnya melebihi lebar pergelangan tangan anda.',
            'Model jam ELFY direka dengan lug melengkung mengikut anatomi pergelangan tangan agar terletak rapat dan selesa.',
          ],
        },
      ],
      tips: [
        'Gunakan pita pengukur kain untuk mengukur lilitan pergelangan tangan anda tepat di atas tulang pergelangan tangan.',
        'Rantai keluli jam tangan ELFY boleh dilaraskan dengan mudah mengikut saiz pergelangan tangan anda.',
      ],
      actionCta: {
        label: 'Tanya Cadangan Saiz Jam di WhatsApp',
        to: 'https://wa.me/601111111111?text=Hi%20ELFY,%20tolong%20cadangkan%20saiz%20jam%20tangan',
        isExternal: true,
      },
    },
  },
  {
    id: 'horology-dress-code',
    category: 'Gaya Eksekutif',
    title: 'Etika Pemakaian Jam Tangan: Mesyuarat Korporat hingga Acara Santai',
    readTime: '3 min bacaan',
    date: 'Februari 2026',
    excerpt:
      'Bila patut pakai strap kulit dan bila sesuai rantai keluli. Tingkatkan keyakinan dan karisma anda dalam setiap pertemuan penting.',
    image: '/hero-desktop.webp',
    content: {
      lead:
        'Jam tangan adalah satu-satunya perhiasan peribadi paling berkuasa bagi seorang lelaki. Memilih jam yang tepat mengikut kod etika pakaian mencerminkan ketelitian dan disiplin peribadi anda.',
      sections: [
        {
          heading: '1. Acara Formal & Mesyuarat Lembaga Pengarah',
          body: [
            'Pilih jam tangan dengan dial minimal dan profil nipis agar mudah menggelongsor ke dalam manset kemeja tangan panjang.',
            'Tali kulit hitam atau coklat gelap melambangkan ketertiban dan penghormatan kepada majlis.',
          ],
        },
        {
          heading: '2. Urusan Perniagaan Harian & Majlis Santai',
          body: [
            'Jam tangan rantai keluli tahan karat (stainless steel bracelet) menawarkan fleksibiliti maksimum dari bilik mesyuarat terus ke makan malam santai.',
            'Kemasan keluli dua-tona memberikan sentuhan mewah moden tanpa kelihatan berlebihan.',
          ],
        },
      ],
      tips: [
        'Padankan warna logam jam (perak, emas, atau rose gold) dengan kepala tali pinggang atau butang manset anda.',
        'Pastikan jam sentiasa diselaraskan pada masa yang tepat setiap pagi.',
      ],
      actionCta: {
        label: 'Lihat Semua Koleksi Jam Tangan Lelaki',
        to: '/collections/mens-watches',
      },
    },
  },
];

interface ProductRelatedPostsProps {
  productType?: string;
  productTitle?: string;
}

export function ProductRelatedPosts({
  productType = 'footwear',
  productTitle,
}: ProductRelatedPostsProps) {
  const isWatch =
    productType.toLowerCase().includes('watch') ||
    productType.toLowerCase().includes('jam');

  const posts = isWatch ? WATCH_POSTS : FOOTWEAR_POSTS;
  const [activePost, setActivePost] = useState<RelatedPost | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePost(null);
      }
    };
    if (activePost) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activePost]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#EBE6DF]">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B48344] mb-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ELFY Journal &amp; Style Guide</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#191817]">
            Panduan Gaya &amp; Penjagaan Berkaitan
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Tip praktikal pemilihan saiz, cara penjagaan material, dan inspirasi padanan gaya sartorial untuk produk anda.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-stone-500 shrink-0">
          <span>Panduan Rasmi</span>
          <span className="text-stone-300">•</span>
          <span className="font-semibold text-[#191817]">3 Artikel Pilihan</span>
        </div>
      </div>

      {/* Posts 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-8">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActivePost(post)}
            className="group flex flex-col justify-between bg-white rounded-2xl border border-[#EBE6DF] hover:border-stone-400 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div>
              {/* Image Container */}
              <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#191817] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                  {post.category}
                </div>
              </div>

              {/* Card Meta & Title */}
              <div className="p-5 sm:p-6 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{post.readTime}</span>
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[#191817] group-hover:text-[#B48344] transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Read Link Action */}
            <div className="px-5 sm:px-6 pb-5 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#191817] group-hover:text-[#B48344] transition-colors">
                <span>Baca Panduan Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Article Reading Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl border border-[#EBE6DF] shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[#EBE6DF] bg-[#FAF9F6]">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#B48344]">
                  <span>{activePost.category}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-[#191817] leading-snug">
                  {activePost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                aria-label="Tutup panduan"
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {/* Featured Thumbnail */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lead Paragraph */}
              <p className="font-medium text-stone-900 leading-relaxed bg-[#F8F6F2] p-4 rounded-xl border border-[#EBE6DF]">
                {activePost.content.lead}
              </p>

              {/* Article Sections */}
              {activePost.content.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-2">
                  <h4 className="font-bold text-sm sm:text-base text-[#191817]">
                    {section.heading}
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-stone-600">
                    {section.body.map((item, bIdx) => (
                      <li key={bIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Tips Box */}
              {activePost.content.tips.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Tip Tambahan Pakar ELFY</span>
                  </span>
                  <ul className="space-y-1 text-xs text-amber-900/90 list-disc list-inside">
                    {activePost.content.tips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-[#EBE6DF] bg-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-3">
              <a
                href="https://wa.me/601111111111?text=Hi%20ELFY,%20saya%20ada%20pertanyaan%20tentang%20produk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto h-11 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Konsultasi Percuma di WhatsApp</span>
              </a>

              {activePost.content.actionCta && (
                activePost.content.actionCta.isExternal ? (
                  <a
                    href={activePost.content.actionCta.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto h-11 px-5 bg-[#191817] hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{activePost.content.actionCta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Link
                    to={activePost.content.actionCta.to}
                    onClick={() => setActivePost(null)}
                    className="w-full sm:w-auto h-11 px-5 bg-[#191817] hover:bg-stone-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>{activePost.content.actionCta.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
