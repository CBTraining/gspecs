import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import bwipjs from 'bwip-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Y_xjXxEWVQpXJ-RWqRCScVWhnn4woeac9Phy-bCJXCA/export?format=csv';
const IMAGES_DIR = path.join(__dirname, '../public/images');
const BARCODES_DIR = path.join(__dirname, '../public/barcodes');

// Ensure directories exist
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
if (!fs.existsSync(BARCODES_DIR)) fs.mkdirSync(BARCODES_DIR, { recursive: true });

const extractDriveId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

const fetchWithTimeout = async (url, timeoutMs = 5000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res;
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

const downloadImage = async (url, filepath) => {
  try {
    console.log(`Downloading ${url}...`);
    const response = await fetchWithTimeout(url, 5000);
    if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
    console.log(`Saved to ${filepath}`);
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
  }
};

const generateBarcode = (sku, filepath) => {
  return new Promise((resolve) => {
    bwipjs.toBuffer({
      bcid: 'code128',
      text: sku,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center',
    }, (err, png) => {
      if (err) {
        console.error(`Error generating barcode for ${sku}:`, err);
        resolve();
      } else {
        fs.writeFileSync(filepath, png);
        resolve();
      }
    });
  });
};

const syncImages = async () => {
  console.log('Fetching Google Sheet...');
  const publicDir = path.join(__dirname, '../public');
  const csvPath = path.join(publicDir, 'devices.csv');

  let csvText;
  try {
    const response = await fetchWithTimeout(SHEET_URL, 5000);
    csvText = await response.text();
    fs.writeFileSync(csvPath, csvText);
    console.log('Saved CSV to public/devices.csv');
  } catch (err) {
    console.warn('Could not fetch remote Google Sheet (using local devices.csv if present):', err.message);
    if (fs.existsSync(csvPath)) {
      csvText = fs.readFileSync(csvPath, 'utf8');
    } else {
      console.error('No local devices.csv available!');
      return;
    }
  }

  Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data.filter(row => row['Device Name']);
      
      for (const row of rows) {
        const imageVal = row['Device Image'];
        const sku = row.SKU;
        
        // Generate barcode
        if (sku) {
          const barcodePath = path.join(BARCODES_DIR, `${sku.replace(/[^a-zA-Z0-9_-]/g, '')}.png`);
          if (!fs.existsSync(barcodePath)) {
            console.log(`Generating barcode for ${sku}...`);
            await generateBarcode(sku, barcodePath);
          }
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
    }
  });
};

syncImages();
