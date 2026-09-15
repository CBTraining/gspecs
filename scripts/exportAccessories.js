import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BASKET_ITEM_DETAILS } from '../src/data/basketContext.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const titleCase = (s) => {
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const headers = ['Accessory', "Why it's great for the basket", 'Who looks for this'];
const rows = [headers];

for (const [key, val] of Object.entries(BASKET_ITEM_DETAILS)) {
  rows.push([titleCase(key), val.why, val.customer]);
}

// Generate CSV
const csvContent = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
const publicCsvPath = path.join(__dirname, '../public/accessories.csv');
fs.writeFileSync(publicCsvPath, csvContent, 'utf8');
console.log(`Saved ${rows.length - 1} accessories to ${publicCsvPath}`);

// Generate TSV (ideal for Google Sheets copy-pasting directly into A1)
const tsvContent = rows.map(r => r.join('\t')).join('\n');
const tsvPath = path.join(__dirname, '../public/accessories.tsv');
fs.writeFileSync(tsvPath, tsvContent, 'utf8');
console.log(`Saved TSV to ${tsvPath}`);
