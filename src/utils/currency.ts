/**
 * Currency formatting utilities for the application
 */

/**
 * Formats a number as Peruvian Soles (PEN) currency
 * @param value - The numeric value to format
 * @param options - Additional formatting options
 * @returns Formatted currency string (e.g., "S/1,234.56")
 */
export const formatCurrency = (
  value: number | string,
  options: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    showSymbol?: boolean
  } = {}
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showSymbol = true
  } = options

  const numericValue = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(numericValue)) {
    return showSymbol ? '$0' : '0'
  }

  // Force Peruvian Sol format regardless of system locale
  const formatter = new Intl.NumberFormat('es-PE', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'PEN',
    minimumFractionDigits,
    maximumFractionDigits
  })

  if (showSymbol) {
    // Use the full currency formatter
    return formatter.format(numericValue)
  } else {
    // Use decimal formatter for numbers without symbol
    return formatter.format(numericValue)
  }
}

/**
 * Formats currency for display in tables and cards
 * @param value - The numeric value to format
 * @returns Formatted currency string with 2 decimal places
 */
export const formatPrice = (value: number | string): string => {
  return formatCurrency(value, { minimumFractionDigits: 2 })
}

/**
 * Formats currency for large amounts (like totals) with no decimal places
 * @param value - The numeric value to format
 * @returns Formatted currency string with no decimal places
 */
export const formatTotal = (value: number | string): string => {
  return formatCurrency(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

/**
 * Formats currency for compact display (like in summaries)
 * @param value - The numeric value to format
 * @returns Formatted currency string with up to 2 decimal places
 */
export const formatCompactCurrency = (value: number | string): string => {
  return formatCurrency(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}