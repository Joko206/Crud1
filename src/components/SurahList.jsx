// components/SurahList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.quran.com/api/v4/chapters');
        const data = await response.json();
        setSurahs(data.chapters);
      } catch (error) {
        console.error('Error fetching surahs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const filteredSurahs = surahs.filter(surah =>
    surah.name_simple.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari surah..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map(surah => (
          <Link
            to={`/surah/${surah.id}`}
            key={surah.id}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-gray-500 w-8">{surah.id}.</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {surah.name_simple}
                  </h3>
                  <p className="text-gray-600">{surah.translated_name.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500">{surah.verses_count} ayat</p>
                <p className="text-sm text-gray-400">{surah.revelation_place}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SurahList;