import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import DOMPurify from 'dompurify';

const SurahDetail = () => {
  const { id } = useParams();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reciters, setReciters] = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [currentJuz, setCurrentJuz] = useState(null);
  const verseRefs = useRef([]);

  const sanitizeTranslation = (text) => {
    if (!text) return '';
    return DOMPurify.sanitize(
      text.replace(/<sup[^>]*>.*?<\/sup>/g, ''),
      { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [surahRes, versesRes, juzRes] = await Promise.all([
          fetch(`https://api.quran.com/api/v4/chapters/${id}`),
          fetch(`https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=33&fields=text_uthmani,verse_key&per_page=286`),
          fetch('https://api.quran.com/api/v4/juzs') 
        ]);

        if (!surahRes.ok || !versesRes.ok || !juzRes.ok) {
          throw new Error('Gagal memuat data');
        }

        const [surahData, versesData, juzData] = await Promise.all([
          surahRes.json(),
          versesRes.json(),
          juzRes.json()
        ]);

        setSurahInfo(surahData.chapter);
        setVerses(versesData.verses);

        const foundJuz = juzData.juzs.find(juz => 
          Object.keys(juz.verse_mapping).some(range => range.startsWith(`${id}:`))
        );

        setCurrentJuz(foundJuz); 

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    fetch("https://api.quran.com/api/v4/resources/recitations")
      .then((response) => response.json())
      .then((data) => setReciters(data.recitations))
      .catch((error) => console.error("Error fetching reciters:", error));
  }, []);

  useEffect(() => {
    if (selectedReciter) {
      fetch(`https://api.quran.com/api/v4/chapter_recitations/${selectedReciter}/${id}`)
        .then((response) => response.json())
        .then((data) => setAudioUrl(data.audio_file.audio_url))
        .catch((error) => console.error("Error fetching audio:", error));
    }
  }, [selectedReciter, id]);

  const handleReciterChange = (event) => {
    setSelectedReciter(event.target.value);
  };

  const scrollToVerse = (index) => {
    if (verseRefs.current[index]) {
      verseRefs.current[index].scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
        <div className="animate -spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 animate-pulse">Memuat Surah...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100/50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
            
            {surahInfo && (
              <div className="text-center">
                <h1 className="text-2xl font-bold text-blue-900">{surahInfo.name_simple}</h1>
                <div className="flex items-center justify-center space-x-3 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    {surahInfo.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
                  </span>
                  <span className="text-blue-300">•</span>
                  <span className="text-blue-600/90 text-sm">{surahInfo.verses_count} Ayat</span>
                  {currentJuz && (
                    <>
                      <span className="text-blue-300">•</span>
                      <span className="flex items-center text-sm text-blue-600">
                        <BookmarkIcon className="h-4 w-4 mr-1" />
                        Juz {currentJuz.id}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Surah Title Arabic */}
        <div className="mb-12 text-center space-y-8">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-sm border-2 border-blue-100/50">
            <span className="text-5xl font-arabic text-blue-800 tracking-wide leading-tight">
              {surahInfo?.name_arabic}
            </span>
          </div>
          
          {/* Audio Player Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-xs">
              <select 
                onChange={handleReciterChange}
                className="w-full border-2 border-blue-200/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white/80 backdrop-blur-sm"
              >
                <option value="">Pilih Qari...</option>
                {reciters.map((reciter) => (
                  <option key={reciter.id} value={reciter.id}>
                    {reciter.reciter_name}
                  </option>
                ))}
              </select>
            </div>
            
            {audioUrl && (
              <div className="w-full max-w-lg bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border-2 border-blue-100/50">
                <audio controls className="w-full">
                  <source src={audioUrl} type="audio/mpeg" />
                  Browser tidak mendukung pemutar audio
                </audio>
              </div>
            )}
          </div>
        </div>

        {/* Verses List */}
        <div className="space-y-6">
          {verses.map((verse, index) => (
            <div
              key={verse.id}
              ref={(el) => (verseRefs.current[index] = el)}
              className="group bg-white/90 backdrop-blur-sm p-6 rounded -2xl shadow-xs hover:shadow-sm 
                       border-2 border-blue-100/50 hover:border-blue-200 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-blue-100">
                <span className="text-sm text-blue-600/80 font-medium">
                  Ayat {verse.verse_number}
                </span>
                <span className="text-sm text-blue-400/80 font-mono">{verse.verse_key}</span>
              </div>

              <div className=" text-right text-3xl font-arabic leading-[3.5rem] text-blue-900 mb-6 tracking-wide">
                {verse.text_uthmani}
              </div>

              <div className="relative pt-6 before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-blue-100 before:to-transparent">
                <div className="text-blue-800/90 text-justify leading-relaxed text-lg bg-blue-50/50 p-4 rounded-xl">
                  <span className="block text-sm text-blue-600 font-medium mb-2">
                    Terjemahan:
                  </span>
                  {verse.translations[0]?.text ? (
                    <div className="text-justify">
                      "{sanitizeTranslation(verse.translations[0].text)}"
                    </div>
                  ) : (
                    <span className="text-blue-400/80">Terjemahan tidak tersedia</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SurahDetail;