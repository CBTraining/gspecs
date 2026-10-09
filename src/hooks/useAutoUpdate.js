import { useState, useEffect, useCallback, useRef } from 'react';

const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const CHECK_INTERVAL_MS = 2 * 60 * 1000; // Check every 2 minutes
const MIN_CHECK_GAP_MS = 30 * 1000; // Minimum 30 seconds between focus/visibility checks
const LAST_RELOAD_KEY = 'gspecs_last_reloaded_version';

export function useAutoUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const lastCheckRef = useRef(0);
  const isCheckingRef = useRef(false);

  const applyUpdate = useCallback((newVersion) => {
    setIsUpdating(true);
    try {
      // Clear localStorage cache for gspecs data and chunk retries
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('gspecs_') || key.startsWith('chunk_retry_'))) {
          localStorage.removeItem(key);
        }
      }

      // Clear CacheStorage (Service Worker / browser caches)
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        }).catch(() => {});
      }

      // Tell waiting service worker to activate immediately
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            if (reg.waiting) {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          }
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('[AutoUpdate] Error clearing cache before reload:', e);
    }

    // Force cache-busting navigation to guarantee the browser gets the latest index.html
    const targetVersion = newVersion || Date.now().toString();
    const url = new URL(window.location.href);
    url.searchParams.set('_v', targetVersion);
    window.location.replace(url.toString());
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

          // Guard against infinite reload loops if edge CDN serves stale HTML temporarily
          const lastReloadedVersion = sessionStorage.getItem(LAST_RELOAD_KEY);
          if (lastReloadedVersion !== data.version) {
            sessionStorage.setItem(LAST_RELOAD_KEY, data.version);
            setUpdateAvailable(true);
            applyUpdate(data.version);
          }
        } else if (data && data.version === APP_VERSION) {
          // Running the latest version, reset reload guard
          sessionStorage.removeItem(LAST_RELOAD_KEY);
        }
      }
    } catch (err) {
      console.warn('[AutoUpdate] Check failed:', err);
    } finally {
      isCheckingRef.current = false;
    }
  }, [applyUpdate]);

  // Clean up cache-busting `_v` query param from address bar on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('_v')) {
      params.delete('_v');
      const cleanQuery = params.toString() ? `?${params.toString()}` : '';
      const cleanUrl = window.location.pathname + cleanQuery + window.location.hash;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, []);

  useEffect(() => {
    // Immediate check on load/refresh (catches updates right away without delay)
    checkForUpdate();

    // Check service worker for updates on load/refresh
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.update().catch(() => {});
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      }).catch(() => {});

      const handleControllerChange = () => {
        checkForUpdate();
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      var cleanupSw = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }

    // Periodic check every 2 minutes
    const interval = setInterval(() => {
      checkForUpdate();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) {
            reg.update().catch(() => {});
          }
        }).catch(() => {});
      }
    }, CHECK_INTERVAL_MS);

    // Check on visibility change (e.g. user returns to this tab or unlocks screen)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastCheckRef.current > MIN_CHECK_GAP_MS) {
        checkForUpdate();
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
      clearInterval(interval);
      if (cleanupSw) cleanupSw();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [checkForUpdate]);

  return {
    updateAvailable,
    isUpdating,
    applyUpdate,
    checkForUpdate
  };
}
