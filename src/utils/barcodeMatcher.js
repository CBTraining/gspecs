/**
 * Barcode to Device matching utility.
 * Matches a scanned barcode string against catalog devices by SKU or UPC,
 * supporting UPC-A vs EAN-13 leading zeros and URLs containing SKUs.
 */

export function findDeviceByBarcode(devices, rawCode) {
  if (!rawCode || !Array.isArray(devices) || devices.length === 0) {
    return null;
  }

  const cleanCode = String(rawCode).trim();
  if (!cleanCode) return null;

  // 1. Direct match by SKU or UPC (exact string match or case-insensitive)
  let matched = devices.find((d) => {
    const sku = String(d.SKU || '').trim();
    const upc = String(d.UPC || '').trim();
    return (
      (sku && sku.toLowerCase() === cleanCode.toLowerCase()) ||
      (upc && upc.toLowerCase() === cleanCode.toLowerCase())
    );
  });
  if (matched) return matched;

  // 2. Numeric match stripping leading zeros (e.g. UPC-A 12-digit vs EAN-13 13-digit)
  const numericScanned = cleanCode.replace(/^0+/, '');
  if (numericScanned) {
    matched = devices.find((d) => {
      const sku = String(d.SKU || '').trim().replace(/^0+/, '');
      const upc = String(d.UPC || '').trim().replace(/^0+/, '');
      return (
        (sku && sku === numericScanned) ||
        (upc && upc === numericScanned)
      );
    });
    if (matched) return matched;
  }

  // 3. If barcode was a URL (e.g. QR code pointing to bestbuy or g-specs with sku)
  const urlSkuMatch = cleanCode.match(/(?:sku[=/]|sku=)(\d+)/i) || cleanCode.match(/\/product\/sku\/(\d+)/i);
  if (urlSkuMatch && urlSkuMatch[1]) {
    const extractedSku = urlSkuMatch[1];
    matched = devices.find((d) => String(d.SKU || '').trim() === extractedSku);
    if (matched) return matched;
  }

  // 4. Try matching standalone 7 to 14 digit sequence in code if surrounded by symbols
  const digitsMatch = cleanCode.match(/\b\d{7,14}\b/);
  if (digitsMatch) {
    const candidate = digitsMatch[0];
    const candidateStripped = candidate.replace(/^0+/, '');
    matched = devices.find((d) => {
      const sku = String(d.SKU || '').trim();
      const upc = String(d.UPC || '').trim();
      return (
        sku === candidate ||
        upc === candidate ||
        sku.replace(/^0+/, '') === candidateStripped ||
        upc.replace(/^0+/, '') === candidateStripped
      );
    });
    if (matched) return matched;
  }

  return null;
}
