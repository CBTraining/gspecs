import Papa from 'papaparse';

const SHEET_URL = import.meta.env.BASE_URL + 'devices.csv';

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
  return new Promise((resolve, reject) => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out any rows that might be completely empty but not caught by skipEmptyLines
        // and convert any Google Drive links into direct image links
        const validData = results.data
          .filter(row => row['Device Name'])
          .map(row => ({
            ...row,
            'Device Image': convertDriveLink(row['Device Image'], row['Device Name'])
          }));
        resolve(validData);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
