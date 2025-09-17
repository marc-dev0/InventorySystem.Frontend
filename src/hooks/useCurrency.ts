/**
 * Currency formatting hook - Similar to Angular pipes
 * Provides reusable currency formatting functions for the entire app
 */

import { useCallback } from 'react'

export const useCurrency = () => {
  // Base formatter function
  const formatCurrency = useCallback((
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
      return showSymbol ? 'S/0.00' : '0.00'
    }

    const formattedNumber = numericValue.toLocaleString('es-PE', {
      minimumFractionDigits,
      maximumFractionDigits
    })

    return showSymbol ? `S/${formattedNumber}` : formattedNumber
  }, [])

  // Specific formatter functions (like Angular pipes)
  const currencyPipe = useCallback((value: number | string): string => {
    return formatCurrency(value, { minimumFractionDigits: 2 })
  }, [formatCurrency])

  const pricePipe = useCallback((value: number | string): string => {
    return formatCurrency(value, { minimumFractionDigits: 2 })
  }, [formatCurrency])

  const totalPipe = useCallback((value: number | string): string => {
    return formatCurrency(value, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })
  }, [formatCurrency])

  const compactPipe = useCallback((value: number | string): string => {
    return formatCurrency(value, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }, [formatCurrency])

  return {
    formatCurrency,
    currencyPipe,
    pricePipe,
    totalPipe,
    compactPipe,
    // Alias for easier access
    currency: currencyPipe,
    price: pricePipe,
    total: totalPipe,
    compact: compactPipe
  }
}