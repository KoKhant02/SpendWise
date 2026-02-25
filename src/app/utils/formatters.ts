/**
 * Formatting utilities for consistent display across the app
 * Eliminates duplicate formatting logic
 */

/**
 * Formats a number as currency with 2 decimal places
 * @param amount - The amount to format
 * @param currency - Currency symbol/code (e.g., "THB", "USD")
 * @param includeSymbol - Whether to include the currency symbol
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number, 
  currency?: string,
  includeSymbol: boolean = true
): string => {
  const formatted = amount.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });
  
  return includeSymbol && currency ? `${formatted} ${currency}` : formatted;
};

/**
 * Formats a date string to a readable format
 * @param date - ISO date string (YYYY-MM-DD)
 * @param format - Format type: "short" | "long" | "month-year"
 * @returns Formatted date string
 */
export const formatDate = (
  date: string, 
  format: "short" | "long" | "month-year" = "short"
): string => {
  const dateObj = new Date(date);
  
  switch (format) {
    case "short":
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    case "long":
      return dateObj.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    case "month-year":
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    default:
      return date;
  }
};

/**
 * Formats a number with no decimals
 * @param num - Number to format
 * @returns Formatted number string with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};
