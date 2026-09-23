import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchDeviceData } from '../utils/fetchData';

/**
 * Custom hook to manage device catalog loading, live real-time sync,
 * deep linking via URL params, and comparison state.
 */
export function useDeviceCatalog() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonDevices, setComparisonDevices] = useState([]);

  const lastDataCheckRef = useRef(Date.now());

  // Handles updating devices and syncing active detail / compare views live
  const handleDataUpdate = useCallback((updatedData) => {
    if (!Array.isArray(updatedData) || updatedData.length === 0) return;
    setDevices(updatedData);

    // Live update currently viewed device specs if detail view is open
    setSelectedDevice((prev) => {
      if (!prev) return null;
      const matched = updatedData.find((d) => d.SKU === prev.SKU);
      return matched || prev;
    });

    // Live update devices currently in comparison bar or modal
    setComparisonDevices((prev) => {
      if (!prev || prev.length === 0) return prev;
      return prev.map((d) => updatedData.find((item) => item.SKU === d.SKU) || d);
    });
  }, []);

  const syncCatalogData = useCallback(async (force = false) => {
    lastDataCheckRef.current = Date.now();
    try {
      const data = await fetchDeviceData(handleDataUpdate, force);
      if (Array.isArray(data) && data.length > 0) {
        handleDataUpdate(data);
      }
    } catch (err) {
      console.warn('[Catalog] Background sync failed:', err);
    }
  }, [handleDataUpdate]);

  // Initial load & deep link resolution (?sku=...)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchDeviceData(handleDataUpdate);
        handleDataUpdate(data);
        setLoading(false);

        // Deep link: check for ?sku=SKU parameter on page load (case-insensitive match)
        const params = new URLSearchParams(window.location.search);
        const skuParam = params.get('sku');
        if (skuParam) {
          const deviceMatch = data.find(
            (d) => d.SKU?.toLowerCase() === skuParam.toLowerCase()
          );
          if (deviceMatch) {
            setSelectedDevice(deviceMatch);
          }
        }
      } catch (err) {
        console.error('[Catalog] Error fetching device data:', err);
        setError('Failed to load device data.');
        setLoading(false);
      }
    };

    loadInitialData();
  }, [handleDataUpdate]);

  // Sync selected device with URL query parameter & body overflow
  useEffect(() => {
    if (loading) return;

    const params = new URLSearchParams(window.location.search);
    if (selectedDevice) {
      document.body.style.overflow = 'hidden';
      params.set('sku', selectedDevice.SKU);
    } else {
      document.body.style.overflow = '';
      params.delete('sku');
    }

    const newQuery = params.toString() ? `?${params.toString()}` : '';
    const newPath = window.location.pathname + newQuery;
    window.history.replaceState({}, '', newPath);

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDevice, loading]);

  // Periodic background data sync every 2 minutes & on tab visibility/focus
  useEffect(() => {
    const interval = setInterval(() => {
      syncCatalogData(true);
    }, 2 * 60 * 1000);

    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastDataCheckRef.current > 90 * 1000
      ) {
        syncCatalogData(true);
      }
    };

    const handleFocus = () => {
      if (Date.now() - lastDataCheckRef.current > 90 * 1000) {
        syncCatalogData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncCatalogData]);

  // Comparison controls
  const toggleComparison = useCallback((device) => {
    setComparisonDevices((prev) => {
      if (prev.find((d) => d.SKU === device.SKU)) {
        return prev.filter((d) => d.SKU !== device.SKU);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 devices at a time.');
        return prev;
      }
      return [...prev, device];
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonDevices([]);
  }, []);

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    loading,
    error,
    comparisonDevices,
    toggleComparison,
    clearComparison,
    syncCatalogData
  };
}
