/**
 * Utility functions for Vietnamese number formatting
 * Converts decimal point (.) to comma (,) for Vietnamese locale
 */

/**
 * Format a number to Vietnamese locale with comma as decimal separator
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with comma as decimal separator
 */
export const formatVietnameseNumber = (value: number, decimals: number = 2): string => {
  if (isNaN(value) || !isFinite(value)) {
    return '0';
  }
  
  // Format the number with specified decimal places
  const formatted = value.toFixed(decimals);
  
  // Replace decimal point with comma
  return formatted.replace('.', ',');
};

/**
 * Parse a Vietnamese formatted number string (with comma) to JavaScript number
 * @param value - The string to parse (can have comma as decimal separator)
 * @returns The parsed number
 */
export const parseVietnameseNumber = (value: string): number => {
  if (!value || value.trim() === '') {
    return 0;
  }
  
  // Replace comma with dot for parsing
  const normalizedValue = value.replace(',', '.');
  
  const parsed = parseFloat(normalizedValue);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Format a number for display in input fields (allowing both comma and dot input)
 * @param value - The number value
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export const formatInputNumber = (value: number | undefined, decimals: number = 2): string => {
  if (value === undefined || isNaN(value)) {
    return '';
  }
  
  return formatVietnameseNumber(value, decimals);
};


