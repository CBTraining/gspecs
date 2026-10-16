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
  isFilterOpen = false,
  setIsFilterOpen,
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
    isFilterOpen,
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
      isFilterOpen,
      isScanning,
      notFoundBarcode,
      cameraError
    };
  });

  // Flags to coordinate programmatic history cleanup vs user back navigation
  const isPopstateHandlingRef = useRef(false);
  const ignoreNextPopstateRef = useRef(0);
  const isExitingRef = useRef(false);

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
    } else if (currentState.level === 'root') {
      window.history.pushState({ gspecsApp: true, level: 'home' }, '');
    }
  }, []);

  // Listen for browser/system back navigation (Android back gesture)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (isExitingRef.current) {
        return;
      }

      if (ignoreNextPopstateRef.current > 0) {
        ignoreNextPopstateRef.current -= 1;
        return;
      }

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
      } else if (current.isFilterOpen && setIsFilterOpen) {
        setIsFilterOpen(false);
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
          isExitingRef.current = true;
          lastBackPressRef.current = 0;
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
    setIsFilterOpen,
    setQuizOpen,
    setIsComparing,
    setSelectedDevice,
    setActiveTab
  ]);

  // Helper to handle user-triggered UI back/close actions (e.g. Header back button or modal X)
  const handleBack = useCallback(() => {
    const current = stateRef.current;
    if (current.cameraError) {
      setCameraError(null);
    } else if (current.notFoundBarcode) {
      setNotFoundBarcode(null);
    } else if (current.isScanning) {
      stopScan();
    } else if (current.isFilterOpen && setIsFilterOpen) {
      setIsFilterOpen(false);
    } else if (current.quizOpen) {
      setQuizOpen(false);
    } else if (current.isComparing) {
      setIsComparing(false);
    } else if (current.selectedDevice) {
      setSelectedDevice(null);
    } else if (current.activeTab !== 'devices') {
      setActiveTab('devices');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [
    setCameraError,
    setNotFoundBarcode,
    stopScan,
    setIsFilterOpen,
    setQuizOpen,
    setIsComparing,
    setSelectedDevice,
    setActiveTab
  ]);

  // Synchronize browser history depth with active subviews/modals
  const activeSubviewCount =
    (cameraError ? 1 : 0) +
    (notFoundBarcode ? 1 : 0) +
    (isScanning ? 1 : 0) +
    (isFilterOpen ? 1 : 0) +
    (quizOpen ? 1 : 0) +
    (isComparing ? 1 : 0) +
    (selectedDevice ? 1 : 0) +
    (activeTab !== 'devices' ? 1 : 0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (activeSubviewCount > historyDepthRef.current) {
      const toPush = activeSubviewCount - historyDepthRef.current;
      for (let i = 0; i < toPush; i++) {
        window.history.pushState({ gspecsApp: true, level: 'subview' }, '');
      }
      historyDepthRef.current = activeSubviewCount;
    } else if (activeSubviewCount < historyDepthRef.current) {
      if (!isPopstateHandlingRef.current) {
        const toPop = historyDepthRef.current - activeSubviewCount;
        historyDepthRef.current = activeSubviewCount;
        ignoreNextPopstateRef.current += 1;
        window.history.go(-toPop);
      } else {
        historyDepthRef.current = activeSubviewCount;
      }
    }
  }, [activeSubviewCount]);

  return {
    showExitToast,
    handleBack
  };
}
