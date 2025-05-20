/**
 * Format a number as currency
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: 'VND')
 * @param {string} locale - The locale (default: 'vi-VN')
 * @returns {string} The formatted currency value
 */
export const formatCurrency = (value, currency = 'VND', locale = 'vi-VN') => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return value?.toString() || '';
  }
};

/**
 * Format a number with thousands separators
 * @param {number} value - The value to format
 * @param {string} locale - The locale (default: 'vi-VN')
 * @returns {string} The formatted number
 */
export const formatNumber = (value, locale = 'vi-VN') => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    return new Intl.NumberFormat(locale).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value?.toString() || '';
  }
};

/**
 * Format a percentage value
 * @param {number} value - The value to format (0.1 = 10%)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} The formatted percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  try {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    return `${(value * 100).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return value?.toString() || '';
  }
}; 