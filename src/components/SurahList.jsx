import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

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
    return <div className="text-center py-8">Memuat surah...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari surah..."
          className="w-full p-4 pl-12 text-lg rounded-xl border border-emerald-100 bg-white/50 backdrop-blur-sm 
                   focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                   shadow-sm transition-all duration-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSurahs.map(surah => (
          <Link
            to={`/surah/${surah.id}`}
            key={surah.id}
            className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm hover:shadow-lg 
                     border border-white transition-all duration-200 hover:border-emerald-100
                     hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-full 
                              bg-emerald-500/10 text-emerald-600 font-medium">
                  {surah.id}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-emerald-700">
                    {surah.name_simple}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {surah.translated_name.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">
                  {surah.verses_count} ayat
                </p>
                <p className="text-xs text-gray-400 mt-1 capitalize">
                  {surah.revelation_place}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SurahList;