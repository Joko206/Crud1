// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Quran App
            </h1>
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<SurahList />} />
          <Route path="/surah/:id" element={<SurahDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;