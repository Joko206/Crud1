import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    juz: '',
    revelationType: '',
    verseCount: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Pembagian Juz berdasarkan surah (diperbarui)
  const juzToSurah = {
    1: { start: 1, end: 2 },
    2: { start: 2, end: 2 },
    3: { start: 2, end: 3 },
    4: { start: 3, end: 4 },
    5: { start: 4, end: 5 },
    6: { start: 5, end: 6 },
    7: { start: 6, end: 7 },
    8: { start: 7, end: 8 },
    9: { start: 8, end: 9 },
    10: { start: 9, end: 11 },
    11: { start: 11, end: 12 },
    12: { start: 12, end: 14 },
    13: { start: 15, end: 16 },
    14: { start: 17, end: 18 },
    15: { start: 19, end: 21 },
    16: { start: 22, end: 24 },
    17: { start: 25, end: 27 },
    18: { start: 28, end: 29 },
    19: { start: 30, end: 33 },
    20: { start: 34, end: 36 },
    21: { start: 37, end: 39 },
    22: { start: 40, end: 42 },
    23: { start: 43, end: 45 },
    24: { start: 46, end: 48 },
    25: { start: 49, end: 51 },
    26: { start: 52, end: 55 },
    27: { start: 56, end: 59 },
    28: { start: 60, end: 64 },
    29: { start: 65, end: 69 },
    30: { start: 70, end: 114 }
  };

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

  const filteredSurahs = surahs.filter(surah => {
    const matchesSearch = surah.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         surah.translated_name.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const juzNumber = Number(filters.juz);
    const matchesJuz = !filters.juz || 
                      (surah.id >= juzToSurah[juzNumber].start && 
                       surah.id <= juzToSurah[juzNumber].end);
    
    const matchesRevelation = !filters.revelationType || 
                             (filters.revelationType === 'makkah' && surah.revelation_place === 'makkah') ||
                             (filters.revelationType === 'madina' && 
                              (surah.revelation_place === 'madina' || surah.revelation_place === 'madinah'));
    
    const matchesVerseCount = !filters.verseCount || 
                             (filters.verseCount === 'short' && surah.verses_count < 50) ||
                             (filters.verseCount === 'medium' && surah.verses_count >= 50 && surah.verses_count < 100) ||
                             (filters.verseCount === 'long' && surah.verses_count >= 100);
    
    return matchesSearch && matchesJuz && matchesRevelation && matchesVerseCount;
  });

  const resetFilters = () => {
    setFilters({
      juz: '',
      revelationType: '',
      verseCount: ''
    });
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Memuat surah...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 bg-blue-50">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari surah atau terjemahan..."
            className="w-full p-4 pl-12 text-lg rounded-xl border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm 
                     focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100
                     shadow-sm transition-all duration-200 placeholder:text-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-400 absolute left-4 top-5" />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white/80 backdrop-blur-md rounded-xl border-2 border-blue-200/50 text-blue-600 hover:bg-blue-50 transition-all"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filter Surah</span>
          </button>

          {(Object.values(filters).some(Boolean) || searchTerm) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-blue-200/50 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Juz</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.juz}
                  onChange={(e) => setFilters({...filters, juz: e.target.value})}
                >
                  <option value="">Semua Juz</option>
                  {Array.from({length: 30}, (_, i) => i + 1).map(juz => (
                    <option key={juz} value={juz}>Juz {juz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tempat Turun</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.revelationType}
                  onChange={(e) => setFilters({...filters, revelationType: e.target.value})}
                >
                  <option value="">Semua</option>
                  <option value="makkah">Makkiyah</option>
                  <option value="madina">Madaniyah</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panjang Surah</label>
                <select
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.verseCount}
                  onChange={(e) => setFilters({...filters, verseCount: e.target.value})}
                >
                  <option value="">Semua</option>
                  <option value="short">Pendek (&lt;50 ayat)</option>
                  <option value="medium">Sedang (50-100 ayat)</option>
                  <option value="long">Panjang (&gt;100 ayat)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-blue-600/80 font-medium">
        Menampilkan {filteredSurahs.length} dari {surahs.length} surah
      </div>

      {filteredSurahs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurahs.map(surah => (
            <Link
              to={`/surah/${surah.id}`}
              key={surah.id}
              className="group bg-white/90 backdrop-blur-sm p-5 rounded-xl shadow-sm hover:shadow-lg 
                       border-2 border-blue-100/50 transition-all duration-300 hover:border-blue-200
                       hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg 
                                bg-blue-600/10 text-blue-600 font-medium">
                    {surah.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 group-hover:text-blue-700">
                      {surah.name_simple}
                    </h3>
                    <p className="text-sm text-blue-500/90 mt-1">
                      {surah.translated_name.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-blue-600 bg-blue-100/50 px-2 py-1 rounded-md">
                    {surah.verses_count} ayat
                  </p>
                  <p className="text-[0.7rem] text-blue-400/80 mt-1 uppercase tracking-wide font-medium">
                    {surah.revelation_place === 'makkah' ? 'Makkiyah' : 'Madaniyah'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/50 rounded-xl border-2 border-dashed border-blue-200">
          <div className="text-blue-400 mb-2">Tidak ada surah yang ditemukan</div>
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SurahList;