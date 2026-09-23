/**
 * Common formatting and parsing utilities
 */

/**
 * Parses a price string into a numeric value (e.g. "$1,299.99" -> 1299.99)
 * @param {string|number} priceStr 
 * @returns {number}
 */
export function parsePrice(priceStr) {
  if (priceStr === null || priceStr === undefined || priceStr === '') return 0;
  if (typeof priceStr === 'number') return isNaN(priceStr) ? 0 : priceStr;
  const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a number as a USD currency string (e.g. 1299 -> "$1,299")
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  return `$${Math.round(amount).toLocaleString()}`;
}
