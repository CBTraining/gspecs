import Papa from 'papaparse';
import { setDynamicBasketDetails } from '../data/basketContext';

const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const SHEET_URL = `${import.meta.env.BASE_URL}devices.csv?v=${appVersion}`;
const ACCESSORIES_URL = `${import.meta.env.BASE_URL}accessories.csv?v=${appVersion}`;
const CACHE_KEY = `gspecs_devices_cache_${appVersion}`;
const ACCESSORIES_CACHE_KEY = `gspecs_accessories_cache_${appVersion}`;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes


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
    const cached = sessionStorage.getItem(ACCESSORIES_CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS && data && typeof data === 'object') {
        setDynamicBasketDetails(data);
        return Promise.resolve(data);
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
          sessionStorage.setItem(ACCESSORIES_CACHE_KEY, JSON.stringify({
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

export const fetchDeviceData = () => {
  // Concurrently fetch accessory data in background
  fetchAccessoriesData().catch(() => {});

  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL_MS && Array.isArray(data) && data.length > 0) {
        return Promise.resolve(data);
      }
    }
  } catch {
    // Ignore storage parse errors and proceed to fresh fetch
  }

  return new Promise((resolve, reject) => {
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
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: validData
          }));
        } catch {
          // Ignore quota errors
        }

        resolve(validData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
