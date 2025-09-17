import { useState, useEffect, useCallback } from 'react'
import { productsService } from '../services/api'

interface ProductStats {
  TotalProducts: number
  ActiveProducts: number
  LowStockProducts: number
  OutOfStockProducts: number
  TotalValue: number
}

export const useProductStats = (search = '', categoryId = '') => {
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📊 Fetching product stats with filters:', { search, categoryId })
      const generalStats = await productsService.getStats(search, categoryId)
      console.log('✅ Product stats received:', generalStats)
      setStats(generalStats)
    } catch (err: any) {
      console.error('❌ Error fetching product stats:', err)
      setError(err.message || 'Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }, [search, categoryId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { stats, loading, error, refetch: fetchStats }
}