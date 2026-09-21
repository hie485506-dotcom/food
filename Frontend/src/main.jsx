import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import Preloader from './components/Preloader/Preloader.jsx'

function Root() {
  const [loading, setLoading] = useState(true);

  const openWebsite = () => {
    setLoading(false);
  };

  if (loading) {
    return (
      <Preloader
        onContinue={openWebsite}
        onCancel={openWebsite}
      />
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)