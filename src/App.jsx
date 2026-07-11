import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Moon, Sun, Laptop, ArrowLeft } from 'lucide-react';
import { fetchDeviceData } from './utils/fetchData';
import DeviceList from './components/DeviceList';
import DeviceDetail from './components/DeviceDetail';

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Theme state: load from localStorage, fallback to system preference
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('gspecs_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch (e) {
      // ignore
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document body and save to localStorage
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('gspecs_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDeviceData();
        setDevices(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load device data.");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  useEffect(() => {
    if (selectedDevice) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDevice]);

  return (
    <div className="app-container">

      <header className="app-header" style={{ zIndex: 150 }}>
        <div className="app-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AnimatePresence>
              {selectedDevice && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  exit={{ opacity: 0, scale: 0.8, width: 0 }}
                  className="btn-icon" 
                  onClick={() => setSelectedDevice(null)} 
                  aria-label="Go Back"
                  style={{ padding: 0 }}
                >
                  <ArrowLeft size={28} />
                </motion.button>
              )}
            </AnimatePresence>
            
            <div className="app-title">
              <img 
                src={theme === 'dark' ? '/gspecs_light.svg' : '/gspecs_dark.svg'} 
                alt="G-Specs" 
                style={{ height: '36px' }} 
              />
            </div>
          </div>

          <nav className="desktop-nav">
            <div className="nav-item active">
              <Laptop size={20} />
              <span>Gragglebook</span>
            </div>
          </nav>

          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </header>

      <motion.div 
        className="main-layout"
        animate={{
          filter: selectedDevice ? 'blur(12px)' : 'blur(0px)',
          opacity: selectedDevice ? 0.4 : 1,
          scale: selectedDevice ? 0.98 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ pointerEvents: selectedDevice ? 'none' : 'auto', paddingTop: '4rem' }}
      >
        
        <main className="container content-area">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
              Loading devices...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
              {error}
            </div>
          ) : (
            <DeviceList devices={devices} onSelectDevice={setSelectedDevice} />
          )}
        </main>

      </motion.div>

      <AnimatePresence>
        {selectedDevice && (
          <DeviceDetail 
            key="detail"
            device={selectedDevice} 
            onBack={() => setSelectedDevice(null)} 
          />
        )}
      </AnimatePresence>

      <nav className="bottom-nav" style={{ zIndex: 150 }}>
        <div className="nav-item active" onClick={() => setSelectedDevice(null)}>
          <Laptop size={24} />
          <span>Gragglebook</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
