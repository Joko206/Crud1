import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-blue-100">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Al-Qur'an Digital
              </h1>
              <p className="text-blue-600/80 text-lg font-light">
                Membaca dan Memahami Kitab Suci
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<SurahList />} />
            <Route path="/surah/:id" element={<SurahDetail />} />
          </Routes>
        </main>

        <footer className="mt-16 bg-blue-900/90 text-blue-100 py-6 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm font-light">
              © {new Date().getFullYear()} Al-Qur'an Digital • oleh Joko Suprianto (12350110343)
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;