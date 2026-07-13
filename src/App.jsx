import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Laptop, ArrowLeft, BookOpen, Trash2, GitCompare, X, Smartphone } from 'lucide-react';
import { fetchDeviceData } from './utils/fetchData';
import DeviceList from './components/DeviceList';
import DeviceDetail from './components/DeviceDetail';
import GlossaryView from './components/GlossaryView';
import CompareModal from './components/CompareModal';
import QuizModal from './components/QuizModal';

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('gragglebook'); // 'gragglebook' | 'glossary'
  
  // Comparison state
  const [comparisonDevices, setComparisonDevices] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const toggleComparison = (device) => {
    setComparisonDevices(prev => {
      if (prev.find(d => d.SKU === device.SKU)) {
        return prev.filter(d => d.SKU !== device.SKU);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 devices at a time.");
        return prev;
      }
      return [...prev, device];
    });
  };

  const clearComparison = () => {
    setComparisonDevices([]);
  };
  
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

        // Deep link: check for ?sku=SKU parameter on page load (case-insensitive match)
        const params = new URLSearchParams(window.location.search);
        const skuParam = params.get('sku');
        if (skuParam) {
          const deviceMatch = data.find(d => d.SKU?.toLowerCase() === skuParam.toLowerCase());
          if (deviceMatch) {
            setSelectedDevice(deviceMatch);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load device data.");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait until catalog data is fully loaded to prevent wiping out params on cold boot
    
    const params = new URLSearchParams(window.location.search);
    if (selectedDevice) {
      document.body.style.overflow = 'hidden';
      params.set('sku', selectedDevice.SKU);
    } else {
      document.body.style.overflow = '';
      params.delete('sku');
    }
    const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.replaceState({}, '', newRelativePathQuery);

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDevice, loading]);

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
                style={{ height: '28px' }} 
              />
            </div>
          </div>

          <nav className="desktop-nav">
            <div 
              className={`nav-item ${activeTab === 'gragglebook' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('gragglebook');
                setSelectedDevice(null);
              }}
            >
              <Laptop size={20} />
              <span>Gragglebook</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'glossary' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('glossary');
                setSelectedDevice(null);
              }}
            >
              <BookOpen size={20} />
              <span>Glossary</span>
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
          ) : activeTab === 'glossary' ? (
            <GlossaryView />
          ) : (
            <DeviceList 
              devices={devices} 
              onSelectDevice={setSelectedDevice} 
              comparisonDevices={comparisonDevices}
              onToggleComparison={toggleComparison}
              onOpenQuiz={() => setQuizOpen(true)}
            />
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

      {/* Floating Comparison Bar */}
      <AnimatePresence>
        {comparisonDevices.length > 0 && !selectedDevice && activeTab !== 'glossary' && (
          <motion.div
            className="compare-bar"
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 100, x: '-50%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Thumbnails list */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {comparisonDevices.map(device => {
                const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');
                return (
                  <div 
                    key={device.SKU} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.4rem',
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '1.5rem',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                  >
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {device['Device Image'] ? (
                        <img 
                          src={device['Device Image']} 
                          alt="" 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        isLaptop ? <Laptop size={14} /> : <Smartphone size={14} />
                      )}
                    </div>
                    <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {device['Device Name']}
                    </span>
                    <button 
                      onClick={() => toggleComparison(device)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        padding: 0, 
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      aria-label="Remove from compare"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={clearComparison}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem' }}
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
              <button 
                onClick={() => setIsComparing(true)}
                className="btn-primary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem' }}
                disabled={comparisonDevices.length < 2}
              >
                <GitCompare size={14} />
                <span>Compare ({comparisonDevices.length})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal 
        isOpen={isComparing} 
        onClose={() => setIsComparing(false)} 
        devices={comparisonDevices} 
      />

      <QuizModal 
        isOpen={quizOpen} 
        onClose={() => setQuizOpen(false)} 
        devices={devices} 
        onSelectDevice={setSelectedDevice} 
      />

      <nav className="bottom-nav" style={{ zIndex: 150 }}>
        <div 
          className={`nav-item ${activeTab === 'gragglebook' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('gragglebook');
            setSelectedDevice(null);
          }}
        >
          <Laptop size={24} />
          <span>Gragglebook</span>
        </div>
        <div 
          className={`nav-item ${activeTab === 'glossary' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('glossary');
            setSelectedDevice(null);
          }}
        >
          <BookOpen size={24} />
          <span>Glossary</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
