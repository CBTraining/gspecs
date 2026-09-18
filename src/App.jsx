import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchDeviceData } from './utils/fetchData';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { useTheme } from './hooks/useTheme';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import CompareBar from './components/comparison/CompareBar';
import DeviceList from './components/DeviceList';
import DeviceDetail from './components/DeviceDetail';

const GlossaryView = lazy(lazyWithRetry(() => import('./components/GlossaryView')));
const CompareModal = lazy(lazyWithRetry(() => import('./components/CompareModal')));
const QuizModal = lazy(lazyWithRetry(() => import('./components/QuizModal')));
const StepUpChart = lazy(lazyWithRetry(() => import('./components/StepUpChart')));

const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: 'blur(4px)'
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: [0.25, 1, 0.5, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(4px)',
    transition: {
      duration: 0.14,
      ease: 'easeIn'
    }
  }
};

function App() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'stepup' | 'glossary'

  const { theme, toggleTheme } = useTheme();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedDevice(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  
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
      <Header 
        selectedDevice={selectedDevice}
        onBack={() => setSelectedDevice(null)}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageTransitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {activeTab === 'glossary' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading Glossary...</div>}>
                    <GlossaryView />
                  </Suspense>
                ) : activeTab === 'stepup' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading Step Up Guide...</div>}>
                    <StepUpChart devices={devices} onSelectDevice={setSelectedDevice} />
                  </Suspense>
                ) : (
                  <DeviceList 
                    devices={devices} 
                    onSelectDevice={setSelectedDevice} 
                    comparisonDevices={comparisonDevices}
                    onToggleComparison={toggleComparison}
                    onOpenQuiz={() => setQuizOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
          <CompareBar 
            comparisonDevices={comparisonDevices}
            onToggleComparison={toggleComparison}
            onClear={clearComparison}
            onCompare={() => setIsComparing(true)}
          />
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        {isComparing && (
          <CompareModal 
            isOpen={isComparing} 
            onClose={() => setIsComparing(false)} 
            devices={comparisonDevices} 
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {quizOpen && (
          <QuizModal 
            isOpen={quizOpen} 
            onClose={() => setQuizOpen(false)} 
            devices={devices} 
            onSelectDevice={setSelectedDevice} 
          />
        )}
      </Suspense>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
