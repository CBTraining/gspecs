import React, { useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { lazyWithRetry } from './utils/lazyWithRetry';
import { useTheme } from './hooks/useTheme';
import { useAutoUpdate } from './hooks/useAutoUpdate';
import { useDeviceCatalog } from './hooks/useDeviceCatalog';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import CompareBar from './components/comparison/CompareBar';
import DeviceList from './components/DeviceList';
import UpdateNotification from './components/common/UpdateNotification';

const DeviceDetail = lazy(lazyWithRetry(() => import('./components/DeviceDetail')));
const GlossaryView = lazy(lazyWithRetry(() => import('./components/GlossaryView')));
const CompareModal = lazy(lazyWithRetry(() => import('./components/CompareModal')));
const QuizModal = lazy(lazyWithRetry(() => import('./components/QuizModal')));
const StepUpChart = lazy(lazyWithRetry(() => import('./components/StepUpChart')));
const AppIndexView = lazy(lazyWithRetry(() => import('./components/AppIndexView')));

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
  const {
    devices,
    selectedDevice,
    setSelectedDevice,
    loading,
    error,
    comparisonDevices,
    toggleComparison,
    clearComparison
  } = useDeviceCatalog();

  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'stepup' | 'glossary' | 'appindex'
  const [isComparing, setIsComparing] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const {
    updateAvailable,
    isUpdating,
    countdown,
    isPaused,
    pauseCountdown,
    applyUpdate
  } = useAutoUpdate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedDevice(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

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
                ) : activeTab === 'appindex' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading App Index...</div>}>
                    <AppIndexView />
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
          <Suspense fallback={null}>
            <DeviceDetail 
              key="detail"
              device={selectedDevice} 
              onBack={() => setSelectedDevice(null)} 
            />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Floating Comparison Bar */}
      <AnimatePresence>
        {comparisonDevices.length > 0 && !selectedDevice && activeTab !== 'glossary' && activeTab !== 'appindex' && (
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

      <UpdateNotification 
        show={updateAvailable}
        countdown={countdown}
        isUpdating={isUpdating}
        isPaused={isPaused}
        onUpdateNow={applyUpdate}
        onPause={pauseCountdown}
      />

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
