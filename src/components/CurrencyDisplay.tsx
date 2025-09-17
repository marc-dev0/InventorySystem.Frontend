/**
 * Currency Display Component
 * A reusable component for displaying currency values with consistent formatting
 */

import React from 'react'
import { useCurrency } from '../hooks/useCurrency'

interface CurrencyDisplayProps {
  value: number | string
  type?: 'price' | 'total' | 'compact' | 'currency'
  className?: string
  showSymbol?: boolean
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  type = 'price',
  className = '',
  showSymbol = true
}) => {
  const currency = useCurrency()

  const formatValue = () => {
    switch (type) {
      case 'price':
        return currency.price(value)
      case 'total':
        return currency.total(value)
      case 'compact':
        return currency.compact(value)
      case 'currency':
      default:
        return currency.currency(value)
    }
  }

  return (
    <span className={className}>
      {formatValue()}
    </span>
  )
}

// Utility components for specific use cases
export const PriceDisplay: React.FC<Omit<CurrencyDisplayProps, 'type'>> = (props) => (
  <CurrencyDisplay {...props} type="price" />
)

export const TotalDisplay: React.FC<Omit<CurrencyDisplayProps, 'type'>> = (props) => (
  <CurrencyDisplay {...props} type="total" />
)

export const CompactCurrencyDisplay: React.FC<Omit<CurrencyDisplayProps, 'type'>> = (props) => (
  <CurrencyDisplay {...props} type="compact" />
)