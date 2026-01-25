import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Chatbot from './components/Chatbot';
import About from './components/About';
import DataTable from './components/DataTable';
import Footer from './components/Footer';
import Weather from './components/wheather';
import MarketPrices from './components/MarketPrices';
import AgriEye from './components/AgriEye';
import type { SensorData } from './types';

import { fetchSensorData } from './components/test'; // ✅ single fetch

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSensorData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSensorData(); // returns [current, ...history]
        if (isMounted) {
          setSensorData(data);
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSensorData();
    const interval = setInterval(loadSensorData, 1000 * 60); // refresh every 5s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // GLOBAL GOOGLE BANNER REMOVAL
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const banner = document.querySelector('.goog-te-banner-frame');
      const frame = document.querySelector('.skiptranslate');

      if (banner) {
        banner.remove();
        document.body.style.top = '0px';
        document.body.style.position = 'static';
      }

      // Remove iframe only if it's the banner, not the widget wrapper (if any)
      if (frame && frame.tagName === 'IFRAME' && frame.classList.contains('goog-te-banner-frame')) {
        frame.remove();
        document.body.style.top = '0px';
        document.body.style.position = 'static';
      }

      // Always force body top 0 if Google messes with it
      if (document.body.style.top !== '0px' && document.body.style.top !== '') {
        document.body.style.top = '0px';
        document.body.style.position = 'static';
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard sensorData={sensorData} isLoading={isLoading} />;
      case 'analytics':
        return <Analytics sensorData={sensorData} />;
      case 'chatbot':
        return <Chatbot sensorData={sensorData} />;
      case 'about':
        return <About />;
      case 'weather':
        return <Weather />;
      case 'data':
        return <DataTable sensorData={sensorData} />;
      case 'marketPrices':
        return <MarketPrices />;
      case 'agriEye':
        return <AgriEye />;
      default:
        return <Hero onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="transition-all duration-500 ease-in-out">
        {renderContent()}
      </main>
      <Footer onNavigate={setActiveSection} />
    </div>
  );
}

export default App;
