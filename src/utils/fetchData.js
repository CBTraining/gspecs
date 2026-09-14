import Papa from 'papaparse';

const SHEET_URL = import.meta.env.BASE_URL + 'devices.csv';
const CACHE_KEY = 'gspecs_devices_cache_v1';
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

export const fetchDeviceData = () => {
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
        const validData = results.data
          .filter(row => row['Device Name'])
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
