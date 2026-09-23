import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import Papa from 'papaparse';
import bwipjs from 'bwip-js';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPREADSHEET_ID = '1Y_xjXxEWVQpXJ-RWqRCScVWhnn4woeac9Phy-bCJXCA';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv`;
const BASKET_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=515499313`;
const IMAGES_DIR = path.join(__dirname, '../public/images');
const BARCODES_DIR = path.join(__dirname, '../public/barcodes');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(BARCODES_DIR)) fs.mkdirSync(BARCODES_DIR, { recursive: true });

const extractDriveId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

const fetchWithTimeout = async (url, timeoutMs = 8000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    // Resilient fallback using https module for local environments with custom CA/proxies
    return new Promise((resolve, reject) => {
      const makeReq = (targetUrl) => {
        const req = https.get(targetUrl, { rejectUnauthorized: false }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            makeReq(res.headers.location);
            return;
          }
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              text: async () => buffer.toString('utf8'),
              arrayBuffer: async () => buffer.buffer,
              statusText: res.statusMessage
            });
          });
        });
        req.on('error', reject);
        req.setTimeout(timeoutMs, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
      };
      makeReq(url);
    });
  }
};

const optimizeAndSaveImage = async (buffer, filepath) => {
  try {
    const optimized = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true })
      .toBuffer();
    fs.writeFileSync(filepath, optimized);
    console.log(`Saved optimized image to ${filepath} (${Math.round(optimized.length / 1024)} KB)`);
  } catch (e) {
    fs.writeFileSync(filepath, buffer);
    console.log(`Saved raw image to ${filepath}`);
  }
};

const downloadImage = async (url, filepath) => {
  try {
    console.log(`Downloading ${url}...`);
    const response = await fetchWithTimeout(url, 8000);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await optimizeAndSaveImage(buffer, filepath);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
};

const generateBarcode = async (code, filepath) => {
  const cleanCode = String(code).trim();
  // Try fetching the exact Column L barcode image from tec-it
  try {
    const tecItUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(cleanCode)}&code=UPCA`;
    const res = await fetchWithTimeout(tecItUrl, 5000);
    if (res.ok) {
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
      console.log(`Saved Column L barcode for ${cleanCode} to ${filepath}`);
      return;
    }
  } catch (err) {
    console.warn(`Could not download tec-it barcode for ${cleanCode}, generating locally:`, err.message);
  }

  // Fallback to bwipjs generator
  return new Promise((resolve) => {
    const digitsOnly = cleanCode.replace(/[^0-9]/g, '');
    const isUpc = digitsOnly.length >= 11 && digitsOnly.length <= 12;
    bwipjs.toBuffer({
      bcid: isUpc ? 'upca' : 'code128',
      text: isUpc ? digitsOnly : cleanCode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) {
        console.error(`Error generating barcode for ${cleanCode}:`, err);
        resolve();
      } else {
        fs.writeFileSync(filepath, png);
        resolve();
      }
    });
  });
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
  // Column L formula in Google Sheet: =IMAGE("https://barcode.tec-it.com/barcode.ashx?data=" & ENCODEURL(J2) & "&code=UPCA")
  const code = String(row['UPC'] || row['SKU'] || '').trim();
  if (code && code.toLowerCase() !== 'none') {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=UPCA`;
  }
  return '';
};

const syncImages = async () => {
  console.log('Fetching Google Sheet...');
  const publicDir = path.join(__dirname, '../public');
  const csvPath = path.join(publicDir, 'devices.csv');
  const accessoriesCsvPath = path.join(publicDir, 'accessories.csv');

  let csvText;
  try {
    const response = await fetchWithTimeout(SHEET_URL, 5000);
    csvText = await response.text();
  } catch (err) {
    console.warn('Could not fetch remote Google Sheet (using local devices.csv if present):', err.message);
    if (fs.existsSync(csvPath)) {
      csvText = fs.readFileSync(csvPath, 'utf8');
    } else {
      console.error('No local devices.csv available!');
      return;
    }
  }

  // Sync Basket tab from Google Sheet
  const accessoriesSheetUrl = process.env.ACCESSORIES_SHEET_URL || 
    (process.env.ACCESSORIES_GID ? `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${process.env.ACCESSORIES_GID}` : BASKET_SHEET_URL);

  if (accessoriesSheetUrl) {
    try {
      console.log('Fetching Basket / Accessories Sheet...');
      const accResponse = await fetchWithTimeout(accessoriesSheetUrl, 5000);
      const accText = await accResponse.text();
      if (accText && accText.includes('Accessory')) {
        fs.writeFileSync(accessoriesCsvPath, accText);
        console.log('Saved CSV to public/accessories.csv');
      }
    } catch (err) {
      console.warn('Could not fetch remote accessories sheet (using local accessories.csv if present):', err.message);
    }
  }

  await new Promise((resolve) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // Populate Barcode column with Column L barcode URL
        results.data.forEach(row => {
          row['Barcode'] = resolveBarcode(row);
        });

        // Save CSV with resolved Column L barcodes
        const updatedCsv = Papa.unparse(results.data);
        fs.writeFileSync(csvPath, updatedCsv, 'utf8');
        console.log('Saved CSV with Column L barcodes to public/devices.csv');

        const isDeviceActive = (row) => {
          const keys = Object.keys(row);
          const currentKey = keys.find(k => k.trim().toLowerCase() === 'current') || keys[2];
          const val = currentKey ? row[currentKey] : row['Current'];
          if (!val) return false;
          return String(val).trim().toUpperCase() === 'TRUE';
        };

        const rows = results.data.filter(row => row['Device Name'] && isDeviceActive(row));
        
        for (const row of rows) {
          const imageVal = row['Device Image'];
          const sku = row.SKU;
          const barcodeCode = row['UPC'] || row['SKU'];
          
          // Generate/download Column L barcode
          if (sku && barcodeCode) {
            const barcodePath = path.join(BARCODES_DIR, `${sku.replace(/[^a-zA-Z0-9_-]/g, '')}.png`);
            await generateBarcode(barcodeCode, barcodePath);
          }

          // Download image
          if (!imageVal) continue;
          const driveId = extractDriveId(imageVal);
          if (driveId) {
            const safeTitle = row['Device Name'].replace(/[^a-zA-Z0-9 -]/g, '').trim();
            const filename = `${safeTitle}_image.jpg`;
            const filepath = path.join(IMAGES_DIR, filename);
            
            if (!fs.existsSync(filepath)) {
              const downloadUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;
              await downloadImage(downloadUrl, filepath);
            }
          }
        }
        console.log('Sync complete!');
        resolve();
      }
    });
  });
};

syncImages();
