/**
 * Unified barcode resolution logic for Google Sheets Column L formulas,
 * direct URLs, and UPC/SKU fallbacks.
 */

/**
 * Resolves a displayable barcode image URL for a device/row
 * @param {object} deviceOrRow 
 * @returns {string}
 */
export function resolveBarcode(deviceOrRow) {
  if (!deviceOrRow) return '';

  const rawBarcode = (deviceOrRow.Barcode || deviceOrRow['Barcode'] || '').trim();

  // 1. Direct web URL or data URI
  if (rawBarcode.startsWith('http://') || rawBarcode.startsWith('https://') || rawBarcode.startsWith('data:')) {
    return rawBarcode;
  }

  // 2. Extracted from IMAGE("...") formula (e.g. from Google Sheet Column L)
  if (rawBarcode.startsWith('=IMAGE') || rawBarcode.startsWith('IMAGE')) {
    const match = rawBarcode.match(/IMAGE\s*\(\s*["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
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
