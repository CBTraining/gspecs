import Papa from 'papaparse';
import { setDynamicBasketDetails } from '../data/basketContext';

const appVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';
const SPREADSHEET_ID = '1Y_xjXxEWVQpXJ-RWqRCScVWhnn4woeac9Phy-bCJXCA';
const LIVE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
const LIVE_ACCESSORIES_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=515499313`;
const FALLBACK_SHEET_URL = `${import.meta.env.BASE_URL}devices.csv?v=${appVersion}`;
const FALLBACK_ACCESSORIES_URL = `${import.meta.env.BASE_URL}accessories.csv?v=${appVersion}`;

const CACHE_KEY = `gspecs_devices_cache_${appVersion}`;
const ACCESSORIES_CACHE_KEY = `gspecs_accessories_cache_${appVersion}`;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes for aggressive freshness

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
  if (!url) return { image: url, driveThumbnail: null };
  
  // If it's a direct web image (e.g. Best Buy, web CDN)
  if (url.startsWith('http') && !url.includes('drive.google.com')) {
    return { image: url, driveThumbnail: null };
  }

  // Extract file ID from /file/d/ID or ?id=ID
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    const driveId = match[1];
    const driveThumbnail = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
    if (deviceName) {
      const safeTitle = deviceName.replace(/[^a-zA-Z0-9 -]/g, '').trim();
      return {
        image: `${import.meta.env.BASE_URL}images/${safeTitle}_image.jpg`,
        driveThumbnail
      };
    }
    return { image: driveThumbnail, driveThumbnail };
  }
  
  // If it's already just a filename (e.g. img1.jpg), use it from local cache
  if (!url.startsWith('http')) {
    return { image: `${import.meta.env.BASE_URL}images/${url}`, driveThumbnail: null };
  }
  
  return { image: url, driveThumbnail: null };
};

const fetchCsvContent = async (liveUrl, fallbackUrl, validatorKeyword = '') => {
  const fetchOptions = {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };

  try {
    const separator = liveUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${liveUrl}${separator}_t=${Date.now()}`, fetchOptions);
    if (res.ok) {
      const text = await res.text();
      if (text && text.length > 50 && (!validatorKeyword || text.includes(validatorKeyword))) {
        return text;
      }
    }
  } catch (err) {
    console.warn('Direct Google Sheet fetch failed, falling back to local CSV:', err);
  }

  const fallbackSep = fallbackUrl.includes('?') ? '&' : '?';
  const fallbackRes = await fetch(`${fallbackUrl}${fallbackSep}_t=${Date.now()}`, fetchOptions);
  return fallbackRes.text();
};

export const fetchAccessoriesData = async (forceNetwork = false) => {
  try {
    const cached = localStorage.getItem(ACCESSORIES_CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (!forceNetwork && Date.now() - timestamp < CACHE_TTL_MS && data && typeof data === 'object') {
        setDynamicBasketDetails(data);
        return data;
      }
      if (data && typeof data === 'object') {
        // Stale data available, use it immediately
        setDynamicBasketDetails(data);
      }
    }
  } catch {
    // Ignore cache error
  }

  try {
    const csvText = await fetchCsvContent(LIVE_ACCESSORIES_URL, FALLBACK_ACCESSORIES_URL, 'Accessory');
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });

    const details = {};
    if (parsed && parsed.data) {
      parsed.data.forEach(row => {
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
    return details;
  } catch {
    return {};
  }
};

export const fetchDeviceData = (onBackgroundUpdate, forceNetwork = false) => {
  // Concurrently fetch accessory data in background
  fetchAccessoriesData(forceNetwork).catch(() => {});

  let staleData = null;
  let isCacheFresh = false;

  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Array.isArray(data) && data.length > 0) {
        staleData = data;
        if (!forceNetwork && Date.now() - timestamp < CACHE_TTL_MS) {
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

  const networkFetch = (async () => {
    try {
      const csvText = await fetchCsvContent(LIVE_SHEET_URL, FALLBACK_SHEET_URL, 'Device');
      const results = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true
      });

      const isDeviceActive = (row) => {
        const keys = Object.keys(row);
        const currentKey = keys.find(k => k.trim().toLowerCase() === 'current') || keys[2];
        const val = currentKey ? row[currentKey] : row['Current'];
        if (!val) return false;
        return String(val).trim().toUpperCase() === 'TRUE';
      };

      const resolveBarcode = (row) => {
        let val = (row['Barcode'] || '').trim();
        if (val.startsWith('=IMAGE') || val.startsWith('IMAGE')) {
          const m = val.match(/IMAGE\s*\(\s*["']([^"']+)["']/i);
          if (m && m[1]) return m[1];
        }
        if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('data:')) {
          return val;
        }
        if (val && val.toLowerCase() !== 'none') {
          return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(val)}&code=UPCA`;
        }
        // Column L in Google Sheet: =IMAGE("https://barcode.tec-it.com/barcode.ashx?data=" & ENCODEURL(J2) & "&code=UPCA")
        const code = String(row['UPC'] || row['SKU'] || '').trim();
        if (code && code.toLowerCase() !== 'none') {
          return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=UPCA`;
        }
        return '';
      };

      const validData = results.data
        .filter(row => row['Device Name'] && isDeviceActive(row))
        .map(row => {
          const { image, driveThumbnail } = convertDriveLink(row['Device Image'], row['Device Name']);
          return {
            ...row,
            'Device Image': image,
            'Drive Thumbnail': driveThumbnail,
            'Barcode': resolveBarcode(row) || row['Barcode']
          };
        });

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          timestamp: Date.now(),
          data: validData
        }));
      } catch {
        // Ignore quota errors
      }

      if (staleData && onBackgroundUpdate) {
        onBackgroundUpdate(validData);
      }

      return validData;
    } catch (error) {
      if (staleData) return staleData;
      throw error;
    }
  })();

  if (staleData) {
    networkFetch.catch(() => {});
    return Promise.resolve(staleData);
  }

  return networkFetch;
};
