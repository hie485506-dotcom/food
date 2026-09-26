import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Recipes from './pages/Recipes/Recipes';
import NotFound from './pages/NotFound/NotFound';

import './App.css';

function App() {
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          'https://food-us-1backend-6kf2.vercel.app/health'
        );

        if (!response.ok) {
          throw new Error('Backend request failed');
        }

        const data = await response.json();

        console.log('Backend connected:', data);
      } catch (error) {
        console.error('Backend connection failed:', error);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="app-shell">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;