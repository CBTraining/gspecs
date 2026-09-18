import Papa from 'papaparse';
import { setDynamicBasketDetails } from '../data/basketContext';

const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const SHEET_URL = `${import.meta.env.BASE_URL}devices.csv?v=${appVersion}`;
const ACCESSORIES_URL = `${import.meta.env.BASE_URL}accessories.csv?v=${appVersion}`;
const CACHE_KEY = `gspecs_devices_cache_${appVersion}`;
const ACCESSORIES_CACHE_KEY = `gspecs_accessories_cache_${appVersion}`;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Clean up previous version caches from localStorage
try {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('gspecs_devices_cache_') || key.startsWith('gspecs_accessories_cache_'))) {
      if (key !== CACHE_KEY && key !== ACCESSORIES_CACHE_KEY) {
        localStorage.removeItem(key);
      }
    }
  }
} catch {
  // Ignore localStorage access issues
}

const convertDriveLink = (url, deviceName) => {
  if (!url) return url;
  
  // Extract file ID from /file/d/ID or ?id=ID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1] && deviceName) {
    const safeTitle = deviceName.replace(/[^a-zA-Z0-9 -]/g, '').trim();
    // Return the path to the locally cached image
    return `${import.meta.env.BASE_URL}images/${safeTitle}_image.jpg`;
  }
  
  // If it's already just a filename (e.g. img1.jpg), use it from local cache
  if (!url.startsWith('http')) {
    return `${import.meta.env.BASE_URL}images/${url}`;
  }
  
  return url;
};

export const fetchAccessoriesData = () => {
  try {
    const cached = localStorage.getItem(ACCESSORIES_CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS && data && typeof data === 'object') {
        setDynamicBasketDetails(data);
        return Promise.resolve(data);
      }
      if (data && typeof data === 'object') {
        // Stale data available, use it immediately and revalidate in background
        setDynamicBasketDetails(data);
      }
    }
  } catch {
    // Ignore cache error
  }

  return new Promise((resolve) => {
    Papa.parse(ACCESSORIES_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const details = {};
        if (results && results.data) {
          results.data.forEach(row => {
            const name = row['Accessory'] || row['accessory'] || row['Item'] || row['item'] || row['Name'] || row['name'];
            const why = row["Why it's great for the basket"] || row['Why'] || row['why'] || row['Rationale'] || row['rationale'];
            const customer = row['Who looks for this'] || row['Customer'] || row['customer'] || row['Who'] || row['who'];
            if (name && (why || customer)) {
              details[name.trim().toLowerCase()] = {
                why: (why || '').trim(),
                customer: (customer || '').trim()
              };
            }
          });
        }

        try {
          localStorage.setItem(ACCESSORIES_CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: details
          }));
        } catch {
          // Ignore storage quota
        }

        setDynamicBasketDetails(details);
        resolve(details);
      },
      error: () => {
        resolve({});
      }
    });
  });
};

export const fetchDeviceData = (onBackgroundUpdate) => {
  // Concurrently fetch accessory data in background
  fetchAccessoriesData().catch(() => {});

  let staleData = null;
  let isCacheFresh = false;

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Array.isArray(data) && data.length > 0) {
        staleData = data;
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          isCacheFresh = true;
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  // If cache is fresh, resolve immediately
  if (isCacheFresh && staleData) {
    return Promise.resolve(staleData);
  }

  // If stale cache exists, we will return it immediately via promise, but also trigger background revalidation
  const networkFetch = new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const isDeviceActive = (row) => {
          const keys = Object.keys(row);
          const currentKey = keys.find(k => k.trim().toLowerCase() === 'current') || keys[2];
          const val = currentKey ? row[currentKey] : row['Current'];
          if (!val) return false;
          return String(val).trim().toUpperCase() === 'TRUE';
        };

        const validData = results.data
          .filter(row => row['Device Name'] && isDeviceActive(row))
          .map(row => ({
            ...row,
            'Device Image': convertDriveLink(row['Device Image'], row['Device Name'])
          }));

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: validData
          }));
        } catch {
          // Ignore quota errors
        }

        // Notify caller if fresh data arrived after stale data was returned
        if (staleData && onBackgroundUpdate) {
          onBackgroundUpdate(validData);
        }

        resolve(validData);
      },
      error: (error) => {
        if (staleData) {
          // Fall back to stale data on network error
          resolve(staleData);
        } else {
          reject(error);
        }
      }
    });
  });

  // If we have stale data, resolve with it immediately for instant render, and let networkFetch run in background
  if (staleData) {
    networkFetch.catch(() => {});
    return Promise.resolve(staleData);
  }

  return networkFetch;
};
