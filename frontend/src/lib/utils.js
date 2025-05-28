/**
 * Combines multiple class names into a single string
 * @param {string[]} inputs - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format price in currency format
 * @param {number} price - Price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted price
 */
export function formatPrice(price, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, length = 50) {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
} 