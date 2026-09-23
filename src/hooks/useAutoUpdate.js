import { useState, useEffect, useCallback, useRef } from 'react';

const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const CHECK_INTERVAL_MS = 2 * 60 * 1000; // Check every 2 minutes
const MIN_CHECK_GAP_MS = 60 * 1000; // Minimum 1 minute between focus/visibility checks

export function useAutoUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const lastCheckRef = useRef(0);
  const isCheckingRef = useRef(false);

  const applyUpdate = useCallback(() => {
    setIsUpdating(true);
    try {
      // Clear localStorage cache for gspecs data and chunk retries
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('gspecs_') || key.startsWith('chunk_retry_'))) {
          localStorage.removeItem(key);
        }
      }
      sessionStorage.clear();

      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('[AutoUpdate] Error clearing cache before reload:', e);
    }

    // Reload with query params preserved (e.g. ?sku=...)
    window.location.reload();
  }, []);

  const checkForUpdate = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    lastCheckRef.current = Date.now();

    try {
      const versionUrl = `${import.meta.env.BASE_URL}version.json?_t=${Date.now()}`;
      const res = await fetch(versionUrl, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.version && data.version !== APP_VERSION && data.version !== 'initial' && APP_VERSION !== 'dev') {
          console.log(`[AutoUpdate] New version detected: ${data.version} (current: ${APP_VERSION})`);
          setUpdateAvailable(true);

          // If the user is currently not viewing the tab (tab is in background), update immediately
          if (document.visibilityState === 'hidden') {
            applyUpdate();
          }
        }
      }
    } catch (err) {
      console.warn('[AutoUpdate] Check failed:', err);
    } finally {
      isCheckingRef.current = false;
    }
  }, [applyUpdate]);

  useEffect(() => {
    // Initial check shortly after load
    const initialTimer = setTimeout(() => {
      checkForUpdate();
    }, 4000);

    // Periodic check every 2 minutes
    const interval = setInterval(() => {
      checkForUpdate();
    }, CHECK_INTERVAL_MS);

    // Check on visibility change (e.g. user returns to this tab or unlocks screen)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (updateAvailable) {
          applyUpdate();
          return;
        }
        if (Date.now() - lastCheckRef.current > MIN_CHECK_GAP_MS) {
          checkForUpdate();
        }
      }
    };

    // Check on window focus
    const handleFocus = () => {
      if (Date.now() - lastCheckRef.current > MIN_CHECK_GAP_MS) {
        checkForUpdate();
      }
    };

    // Check when network reconnects
    const handleOnline = () => {
      checkForUpdate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [checkForUpdate, updateAvailable, applyUpdate]);

  // When update is available and user is looking at the screen, run a gentle countdown
  useEffect(() => {
    if (!updateAvailable || isPaused) return;

    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return 5;
        if (prev <= 1) {
          clearInterval(timer);
          applyUpdate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [updateAvailable, isPaused, applyUpdate]);

  const pauseCountdown = useCallback(() => {
    setIsPaused(true);
  }, []);

  return {
    updateAvailable,
    isUpdating,
    countdown,
    isPaused,
    pauseCountdown,
    applyUpdate,
    checkForUpdate
  };
}
