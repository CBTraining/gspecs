/**
 * Unified barcode resolution logic for Google Sheets Column L formulas,
 * direct URLs, and UPC/SKU fallbacks.
 */

const SAFE_DATA_IMAGE_RE = /^data:image\/(png|jpeg|jpg|webp|gif|svg\+xml);/i;

const isSafeBarcodeUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://') || SAFE_DATA_IMAGE_RE.test(url);
};

/**
 * Resolves a displayable barcode image URL for a device/row
 * @param {object} deviceOrRow 
 * @returns {string}
 */
export function resolveBarcode(deviceOrRow) {
  if (!deviceOrRow) return '';

  const rawBarcode = (deviceOrRow.Barcode || deviceOrRow['Barcode'] || '').trim();

  // 1. Direct web URL or safe image data URI
  if (isSafeBarcodeUrl(rawBarcode)) {
    return rawBarcode;
  }

  // 2. Extracted from IMAGE("...") formula (e.g. from Google Sheet Column L)
  if (rawBarcode.startsWith('=IMAGE') || rawBarcode.startsWith('IMAGE')) {
    const match = rawBarcode.match(/IMAGE\s*\(\s*["']([^"']+)["']/i);
    if (match && match[1]) {
      const extracted = match[1].trim();
      if (isSafeBarcodeUrl(extracted)) {
        return extracted;
      }
    }
  }

  // 3. Raw barcode / UPC value in Column L
  if (rawBarcode && rawBarcode.toLowerCase() !== 'none') {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(rawBarcode)}&code=UPCA`;
  }

  // 4. Default TEC-IT generation using UPC or SKU
  const code = String(deviceOrRow.UPC || deviceOrRow['UPC'] || deviceOrRow.SKU || deviceOrRow['SKU'] || '').trim();
  if (code && code.toLowerCase() !== 'none') {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=UPCA`;
  }

  return '';
}
