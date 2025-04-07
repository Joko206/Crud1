import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50">
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto py-5 px-4">
            <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">
              Al-Qur'an Digital
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<SurahList />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
          </Routes>
        </main>

        <footer className="text-center py-6 text-gray-500 text-sm">
          © by Joko Suprianto 12350110343 kelas A
        </footer>
      </div>
    </Router>
  );
}

export default App;