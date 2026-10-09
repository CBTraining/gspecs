import React, { useState, useCallback, lazy, Suspense } from 'react';
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
import PwaInstallBanner from './components/common/PwaInstallBanner';
import ScanningIndicator from './components/scanner/ScanningIndicator';
import BarcodeNotFoundModal from './components/scanner/BarcodeNotFoundModal';
import CameraErrorModal from './components/scanner/CameraErrorModal';

import { useBarcodeScanner } from './hooks/useBarcodeScanner';
import { useBackNavigation } from './hooks/useBackNavigation';
import { useIsDesktop } from './hooks/useIsDesktop';
import BackExitToast from './components/common/BackExitToast';
import { findDeviceByBarcode } from './utils/barcodeMatcher';
import { Laptop } from 'lucide-react';
import './styles/scanner.css';

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
    isUpdating
  } = useAutoUpdate();

  const [notFoundBarcode, setNotFoundBarcode] = useState(null);

  const isDesktop = useIsDesktop(1024);

  const handleBarcodeScanned = useCallback(
    (code) => {
      const matched = findDeviceByBarcode(devices, code);
      if (matched) {
        setIsComparing(false);
        setQuizOpen(false);
        setNotFoundBarcode(null);
        setSelectedDevice(matched);
        if (isDesktop) setActiveTab('devices');
      } else {
        setNotFoundBarcode(code);
      }
    },
    [devices, setSelectedDevice, isDesktop]
  );

  const {
    isScanning,
    cameraError,
    setCameraError,
    startScan,
    stopScan
  } = useBarcodeScanner(handleBarcodeScanned);

  const handleToggleScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      setNotFoundBarcode(null);
      startScan();
    }
  };

  const {
    showExitToast,
    handleBack
  } = useBackNavigation({
    selectedDevice,
    setSelectedDevice,
    activeTab,
    setActiveTab,
    isComparing,
    setIsComparing,
    quizOpen,
    setQuizOpen,
    isScanning,
    stopScan,
    notFoundBarcode,
    setNotFoundBarcode,
    cameraError,
    setCameraError
  });

  const handleTabChange = (tab) => {
    if (tab === 'devices' && activeTab !== 'devices') {
      handleBack();
      return;
    }
    setActiveTab(tab);
    setSelectedDevice(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="app-container">
      <Header 
        selectedDevice={selectedDevice}
        onBack={handleBack}
        theme={theme}
        toggleTheme={toggleTheme}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isScanning={isScanning}
        onToggleScan={handleToggleScan}
        isDesktop={isDesktop}
      />

      <ScanningIndicator 
        isScanning={isScanning} 
        onCancel={handleBack} 
      />

      <motion.div 
        className="main-layout"
        animate={{
          filter: (!isDesktop && selectedDevice) ? 'blur(12px)' : 'blur(0px)',
          opacity: (!isDesktop && selectedDevice) ? 0.4 : 1,
          scale: (!isDesktop && selectedDevice) ? 0.98 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ pointerEvents: (!isDesktop && selectedDevice) ? 'none' : 'auto', paddingTop: '4rem' }}
      >
        <main className={`container content-area ${isDesktop && activeTab === 'devices' ? 'content-area-split' : ''}`}>
          <PwaInstallBanner />
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
                className="tab-content-wrapper"
              >
                {activeTab === 'glossary' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading Glossary...</div>}>
                    <GlossaryView />
                  </Suspense>
                ) : activeTab === 'stepup' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading Step Up Guide...</div>}>
                    <StepUpChart 
                      devices={devices} 
                      onSelectDevice={(dev) => {
                        setSelectedDevice(dev);
                        if (isDesktop) setActiveTab('devices');
                      }} 
                    />
                  </Suspense>
                ) : activeTab === 'appindex' ? (
                  <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading App Index...</div>}>
                    <AppIndexView />
                  </Suspense>
                ) : (
                  isDesktop ? (
                    <div className="desktop-split-layout">
                      <div className="desktop-gallery-pane">
                        <DeviceList 
                          devices={devices} 
                          onSelectDevice={setSelectedDevice} 
                          selectedDevice={selectedDevice}
                          comparisonDevices={comparisonDevices}
                          onToggleComparison={toggleComparison}
                          onOpenQuiz={() => setQuizOpen(true)}
                        />
                      </div>
                      <aside className="desktop-detail-pane">
                        {selectedDevice ? (
                          <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading Device Details...</div>}>
                            <DeviceDetail 
                              device={selectedDevice} 
                              onBack={() => setSelectedDevice(null)} 
                              embedded={true}
                            />
                          </Suspense>
                        ) : (
                          <div className="desktop-detail-placeholder glass-panel">
                            <div className="placeholder-icon-wrap">
                              <Laptop size={36} />
                            </div>
                            <h3 className="placeholder-title">Select a Device</h3>
                            <p className="placeholder-text">
                              Click any Googlebook or Chromebook from the gallery on the left to inspect full hardware specifications, retail guidance, and basket add-ons.
                            </p>
                            <div className="placeholder-pill">
                              <span>Ready for inspection</span>
                            </div>
                          </div>
                        )}
                      </aside>
                    </div>
                  ) : (
                    <DeviceList 
                      devices={devices} 
                      onSelectDevice={setSelectedDevice} 
                      selectedDevice={selectedDevice}
                      comparisonDevices={comparisonDevices}
                      onToggleComparison={toggleComparison}
                      onOpenQuiz={() => setQuizOpen(true)}
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </motion.div>

      {/* Mobile Full-Screen Overlay View (only on non-desktop) */}
      <AnimatePresence>
        {!isDesktop && selectedDevice && (
          <Suspense fallback={null}>
            <DeviceDetail 
              key="detail"
              device={selectedDevice} 
              onBack={handleBack} 
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
            onClose={handleBack} 
            devices={comparisonDevices} 
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {quizOpen && (
          <QuizModal 
            isOpen={quizOpen} 
            onClose={handleBack} 
            devices={devices} 
            onSelectDevice={setSelectedDevice} 
          />
        )}
      </Suspense>

      <UpdateNotification 
        show={updateAvailable || isUpdating}
        isUpdating={isUpdating}
      />

      <BarcodeNotFoundModal 
        isOpen={!!notFoundBarcode}
        scannedCode={notFoundBarcode}
        onClose={handleBack}
        onScanAgain={() => {
          setNotFoundBarcode(null);
          startScan();
        }}
      />

      <CameraErrorModal 
        isOpen={!!cameraError}
        error={cameraError}
        onClose={handleBack}
      />

      <BackExitToast show={showExitToast} />

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;
