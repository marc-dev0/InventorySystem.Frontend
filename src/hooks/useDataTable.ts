import { useState, useEffect, useCallback } from 'react'
import type { PaginatedResponse } from '../types'

interface UseDataTableOptions {
  initialPage?: number
  initialPageSize?: number
  initialSearch?: string
}

interface UseDataTableReturn<T> {
  // Data state
  data: T[]
  totalCount: number
  totalPages: number
  loading: boolean
  error: string | null

  // Pagination state
  page: number
  pageSize: number

  // Search state
  search: string

  // Statistics (from API response)
  stats?: {
    TotalProducts?: number
    ActiveProducts?: number
    LowStockProducts?: number
    OutOfStockProducts?: number
    TotalValue?: number
    totalProducts?: number
    activeProducts?: number
    lowStockProducts?: number
    outOfStockProducts?: number
    totalValue?: number
  }

  // Actions
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  refetch: () => Promise<void>

  // Additional filters (can be extended)
  filters: Record<string, any>
  setFilter: (key: string, value: any) => void
  clearFilters: () => void
}

export function useDataTable<T>(
  fetchFn: (page: number, pageSize: number, search: string, filters: Record<string, any>) => Promise<PaginatedResponse<T>>,
  options: UseDataTableOptions = {}
): UseDataTableReturn<T> {
  const {
    initialPage = 1,
    initialPageSize = 20,
    initialSearch = ''
  } = options

  // State
  const [data, setData] = useState<T[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<{ TotalProducts?: number; ActiveProducts?: number; LowStockProducts?: number; OutOfStockProducts?: number; TotalValue?: number; totalProducts?: number; activeProducts?: number; lowStockProducts?: number; outOfStockProducts?: number; totalValue?: number } | undefined>(undefined)
  
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState(initialSearch)
  const [filters, setFilters] = useState<Record<string, any>>({})

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 useDataTable: Starting fetch...', { page, pageSize, search, filters })
      setLoading(true)
      setError(null)

      const response = await fetchFn(page, pageSize, search, filters)
      console.log('📊 useDataTable: Response received:', response)

      setData(response.data)
      setTotalCount(response.totalCount)
      setTotalPages(response.totalPages)
      setStats(response.stats)
      console.log('✅ useDataTable: State updated successfully')
    } catch (err: any) {
      console.error('❌ useDataTable: Error fetching data:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, filters])

  // Effects - Only trigger on actual parameter changes, not fetchFn changes
  useEffect(() => {
    fetchData()
  }, [page, pageSize, search, filters])

  // Reset page when search or filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1)
    }
  }, [search, filters])

  // Handlers
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1) // Reset to first page when changing page size
  }, [])

  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch)
  }, [])

  const setFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
    setSearch('')
  }, [])

  const refetch = useCallback(async () => {
    try {
      console.log('🔄 useDataTable: Manual refetch...', { page, pageSize, search, filters })
      setLoading(true)
      setError(null)

      const response = await fetchFn(page, pageSize, search, filters)
      console.log('📊 useDataTable: Manual refetch response:', response)

      setData(response.data)
      setTotalCount(response.totalCount)
      setTotalPages(response.totalPages)
      setStats(response.stats)
    } catch (err: any) {
      console.error('❌ useDataTable: Error in manual refetch:', err)
      setError(err.message || 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }, [fetchFn, page, pageSize, search, filters])

  return {
    // Data state
    data,
    totalCount,
    totalPages,
    loading,
    error,

    // Pagination state
    page,
    pageSize,

    // Search state
    search,

    // Statistics
    stats,

    // Actions
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    setSearch: handleSearchChange,
    refetch,

    // Filters
    filters,
    setFilter,
    clearFilters
  }
}