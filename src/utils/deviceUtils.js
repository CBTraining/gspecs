/**
 * Shared device utilities to eliminate duplicate logic across components
 */

/**
 * Determines whether a device is a laptop form factor (Clamshell or Convertible)
 * @param {object|string} deviceOrFormfactor 
 * @returns {boolean}
 */
export function isLaptopDevice(deviceOrFormfactor) {
  if (!deviceOrFormfactor) return true;
  const formfactor = typeof deviceOrFormfactor === 'string' 
    ? deviceOrFormfactor 
    : deviceOrFormfactor.Formfactor;
    
  if (!formfactor) return true;
  const normalized = formfactor.toLowerCase();
  return normalized.includes('clamshell') || normalized.includes('convertible');
}

/**
 * Sanitizes a SKU for use in local file paths or query params
 * @param {string|number} sku 
 * @returns {string}
 */
export function cleanSku(sku) {
  if (!sku) return '';
  return String(sku).replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Sanitizes a device title for safe local asset filenames
 * @param {string} title 
 * @returns {string}
 */
export function cleanDeviceTitle(title) {
  if (!title) return '';
  return title.replace(/[^a-zA-Z0-9 -]/g, '').trim();
}
