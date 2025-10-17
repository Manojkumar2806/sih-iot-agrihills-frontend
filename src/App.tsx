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
    const interval = setInterval(loadSensorData, 1000*60); // refresh every 5s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
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
