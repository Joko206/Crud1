// components/SurahDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const SurahDetail = () => {
  const { id } = useParams();
  const [verses, setVerses] = useState([]);
  const [surahInfo, setSurahInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch surah info
        const surahRes = await fetch(
          `https://api.quran.com/api/v4/chapters/${id}`
        );
        const surahData = await surahRes.json();
        setSurahInfo(surahData.chapter);

        // Fetch verses with translation
        const versesRes = await fetch(
          `https://api.quran.com/api/v4/verses/by_chapter/${id}?translations=33&fields=text_uthmani`
        );
        const versesData = await versesRes.json();
        setVerses(versesData.verses);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {surahInfo.name_simple}
        </h2>
        <p className="text-gray-600">
          {surahInfo.translated_name.name} - {surahInfo.revelation_place} -{' '}
          {surahInfo.verses_count} ayat
        </p>
      </div>

      <div className="space-y-6">
        {verses.map(verse => (
          <div
            key={verse.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Ayat {verse.verse_number}
              </span>
            </div>
            <div className="text-right text-2xl font-arabic mb-4 text-gray-800">
              {verse.text_uthmani}
            </div>
            <div className="text-gray-600 border-t pt-4">
              {verse.translations[0]?.text || 'Terjemahan tidak tersedia'}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          to="/"
          className="text-green-600 hover:text-green-700 font-medium"
        >
          ← Kembali ke Daftar Surah
        </Link>
      </div>
    </div>
  );
};

export default SurahDetail;