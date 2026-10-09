import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useBackNavigation
 * Handles Android system back gesture and hardware back button navigation in PWA/browser.
 * Prevents accidental app exit and navigates back to the homescreen/catalog.
 */
export function useBackNavigation({
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
}) {
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressRef = useRef(0);
  const toastTimeoutRef = useRef(null);

  // References to keep current state fresh in popstate event listener
  const stateRef = useRef({
    selectedDevice,
    activeTab,
    isComparing,
    quizOpen,
    isScanning,
    notFoundBarcode,
    cameraError
  });

  useEffect(() => {
    stateRef.current = {
      selectedDevice,
      activeTab,
      isComparing,
      quizOpen,
      isScanning,
      notFoundBarcode,
      cameraError
    };
  });

  // Flag to know when a state change was caused by popstate (to avoid pushing redundant history)
  const isPopstateHandlingRef = useRef(false);

  // Track currently active subview depth in browser history
  const historyDepthRef = useRef(0);

  // Initialize base history state on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set a root marker so we know where the app history begins
    const currentState = window.history.state;
    if (!currentState || !currentState.gspecsApp) {
      window.history.replaceState({ gspecsApp: true, level: 'root' }, '');
      window.history.pushState({ gspecsApp: true, level: 'home' }, '');
    }
  }, []);

  // Listen for browser/system back navigation (Android back gesture)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const current = stateRef.current;
      isPopstateHandlingRef.current = true;

      // Decrement history depth tracker if positive
      if (historyDepthRef.current > 0) {
        historyDepthRef.current -= 1;
      }

      // 1. Modals (highest priority)
      if (current.cameraError) {
        setCameraError(null);
      } else if (current.notFoundBarcode) {
        setNotFoundBarcode(null);
      } else if (current.isScanning) {
        stopScan();
      } else if (current.quizOpen) {
        setQuizOpen(false);
      } else if (current.isComparing) {
        setIsComparing(false);
      }
      // 2. Device detail view
      else if (current.selectedDevice) {
        setSelectedDevice(null);
      }
      // 3. Secondary tab -> navigate back to Homescreen ('devices')
      else if (current.activeTab !== 'devices') {
        setActiveTab('devices');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      // 4. Homescreen with nothing open -> Double back to exit
      else {
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          // User swiped back twice within 2 seconds: allow exit
          window.history.back();
          return;
        }

        // First back swipe on homescreen: prevent accidental exit
        lastBackPressRef.current = now;
        window.history.pushState({ gspecsApp: true, level: 'home' }, '');

        setShowExitToast(true);
        clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setShowExitToast(false);
        }, 2000);
      }

      setTimeout(() => {
        isPopstateHandlingRef.current = false;
      }, 50);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(toastTimeoutRef.current);
    };
  }, [
    setCameraError,
    setNotFoundBarcode,
    stopScan,
    setQuizOpen,
    setIsComparing,
    setSelectedDevice,
    setActiveTab
  ]);

  // Helper to push history entry when entering a subview
  const pushSubview = useCallback((type) => {
    if (isPopstateHandlingRef.current) return;
    historyDepthRef.current += 1;
    window.history.pushState({ gspecsApp: true, level: 'subview', type }, '');
  }, []);

  // Helper to handle user-triggered back action (e.g. Header back button or backdrop click)
  const handleBack = useCallback(() => {
    if (historyDepthRef.current > 0) {
      window.history.back();
    } else {
      // Fallback if no history entry was pushed
      const current = stateRef.current;
      if (current.selectedDevice) {
        setSelectedDevice(null);
      } else if (current.activeTab !== 'devices') {
        setActiveTab('devices');
      } else if (current.isComparing) {
        setIsComparing(false);
      } else if (current.quizOpen) {
        setQuizOpen(false);
      } else if (current.isScanning) {
        stopScan();
      }
    }
  }, [setSelectedDevice, setActiveTab, setIsComparing, setQuizOpen, stopScan]);

  // Track transitions for selectedDevice
  const prevDeviceRef = useRef(selectedDevice);
  useEffect(() => {
    if (!prevDeviceRef.current && selectedDevice && !isPopstateHandlingRef.current) {
      pushSubview('detail');
    }
    prevDeviceRef.current = selectedDevice;
  }, [selectedDevice, pushSubview]);

  // Track transitions for activeTab
  const prevTabRef = useRef(activeTab);
  useEffect(() => {
    if (prevTabRef.current === 'devices' && activeTab !== 'devices' && !isPopstateHandlingRef.current) {
      pushSubview('tab');
    } else if (prevTabRef.current !== 'devices' && activeTab !== 'devices' && !isPopstateHandlingRef.current) {
      // Switching between secondary tabs: replace state so only 1 back swipe is needed to return to homescreen
      window.history.replaceState({ gspecsApp: true, level: 'subview', type: 'tab', tab: activeTab }, '');
    }
    prevTabRef.current = activeTab;
  }, [activeTab, pushSubview]);

  // Track transitions for modals
  const prevComparingRef = useRef(isComparing);
  useEffect(() => {
    if (!prevComparingRef.current && isComparing && !isPopstateHandlingRef.current) {
      pushSubview('compare');
    }
    prevComparingRef.current = isComparing;
  }, [isComparing, pushSubview]);

  const prevQuizRef = useRef(quizOpen);
  useEffect(() => {
    if (!prevQuizRef.current && quizOpen && !isPopstateHandlingRef.current) {
      pushSubview('quiz');
    }
    prevQuizRef.current = quizOpen;
  }, [quizOpen, pushSubview]);

  const prevScanningRef = useRef(isScanning);
  useEffect(() => {
    if (!prevScanningRef.current && isScanning && !isPopstateHandlingRef.current) {
      pushSubview('scan');
    }
    prevScanningRef.current = isScanning;
  }, [isScanning, pushSubview]);

  const prevNotFoundRef = useRef(notFoundBarcode);
  useEffect(() => {
    if (!prevNotFoundRef.current && notFoundBarcode && !isPopstateHandlingRef.current) {
      pushSubview('notFound');
    }
    prevNotFoundRef.current = notFoundBarcode;
  }, [notFoundBarcode, pushSubview]);

  const prevCameraErrorRef = useRef(cameraError);
  useEffect(() => {
    if (!prevCameraErrorRef.current && cameraError && !isPopstateHandlingRef.current) {
      pushSubview('cameraError');
    }
    prevCameraErrorRef.current = cameraError;
  }, [cameraError, pushSubview]);

  return {
    showExitToast,
    handleBack
  };
}
