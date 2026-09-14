import { useState, useEffect, useCallback } from 'react';

const CURRENT_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

export const checkServerVersion = async () => {
  if (CURRENT_VERSION === 'dev') return false;

  try {
    const res = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!res.ok) return false;

    const data = await res.json();
    if (data && data.version && data.version !== CURRENT_VERSION) {
      return true;
    }
  } catch {
    // Ignore network errors
  }
  return false;
};

export const useVersionChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const check = useCallback(async () => {
    const hasUpdate = await checkServerVersion();
    if (hasUpdate) {
      setUpdateAvailable(true);
    }
  }, []);

  useEffect(() => {
    // Initial check after short delay
    const initialTimer = setTimeout(check, 10000);

    // Periodic interval
    const interval = setInterval(check, CHECK_INTERVAL_MS);

    // Check when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        check();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', check);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', check);
    };
  }, [check]);

  const reloadApp = () => {
    window.location.reload();
  };

  return { updateAvailable, reloadApp };
};
