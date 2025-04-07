import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';

const SurahDetail = () => {
  const { id } = useParams();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi sanitasi
  const sanitizeTranslation = (text) => {
    if (!text) return '';
    const cleaned = text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
    return DOMPurify.sanitize(cleaned, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [surahRes, versesRes] = await Promise.all([
          fetch(`https://api.quran.com/api/v4/chapters/${id}`),
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=33&fields=text_uthmani,verse_key`)
        ]);

        if (!surahRes.ok || !versesRes.ok) throw new Error('Gagal memuat data');

        const [surahData, versesData] = await Promise.all([
          surahRes.json(),
          versesRes.json()
        ]);

        setSurahInfo(surahData.chapter);
        setVerses(versesData.verses);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 animate-pulse">Memuat Surah...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-red-50/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Gagal Memuat Data
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Kembali ke Daftar Surah</span>
          </Link>
        </div>
      </div>
    );
  }

  // Main render setelah data tersedia
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Daftar Surah</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {surahInfo?.name_simple}
              </h1>
              <div className="flex items-center justify-center space-x-3 mt-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                  {surahInfo?.revelation_place}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 text-sm">
                  {surahInfo?.verses_count} Ayat
                </span>
              </div>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Konten Utama */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nama Arab */}
        {surahInfo && (
          <div className="mb-12 text-center">
            <div className="inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-4xl font-arabic text-emerald-600 tracking-wide">
                {surahInfo.name_arabic}
              </span>
            </div>
          </div>
        )}

        {/* Daftar Ayat */}
        <div className="space-y-5">
          {verses.map((verse) => (
            <div
              key={verse.id}
              className="group bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xs hover:shadow-sm border border-gray-100 hover:border-emerald-100 transition-all duration-200 ease-out"
            >
              {/* Header Ayat */}
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 font-medium text-sm">
                    {verse.verse_number}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Ayat {verse.verse_number}
                  </span>
                </div>
                <span className="text-sm text-gray-400 font-mono">
                  {verse.verse_key}
                </span>
              </div>

              {/* Teks Arab */}
              <div className="text-right text-3xl font-arabic leading-[3.5rem] text-gray-800 mb-6 tracking-wide">
                {verse.text_uthmani}
              </div>

              {/* Terjemahan */}
              <div className="relative pt-6 before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-emerald-100 before:to-transparent">
                <div className="text-gray-600 text-justify leading-relaxed text-lg bg-emerald-50/50 p-4 rounded-xl">
                  <span className="block text-sm text-emerald-600 font-medium mb-2">
                    Terjemahan:
                  </span>
                  {verse.translations[0]?.text ? (
                    <div className="text-justify">
                      "{sanitizeTranslation(verse.translations[0].text)}"
                    </div>
                  ) : (
                    <span className="text-gray-400">Terjemahan tidak tersedia</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Back Button */}
        <div className="fixed bottom-8 right-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg hover:shadow-md text-emerald-600 hover:text-emerald-700 border border-gray-100 hover:border-emerald-100 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Kembali</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SurahDetail;