import React, { useMemo, useCallback } from 'react'
import { DataTable, TableColumn } from '../components/DataTable'
import { useDataTable } from '../hooks/useDataTable'
import { useCurrency } from '../hooks/useCurrency'
import { productsService } from '../services/api'
import type { Product, PaginatedResponse } from '../types'

export const ProductsPage: React.FC = () => {
  console.log('📦 ProductsPage component rendering...')

  // Currency formatting hook (similar to Angular pipes)
  const { price } = useCurrency()
  
  // Fetch function for products - memoized to prevent unnecessary re-renders
  const fetchProducts = useCallback(async (
    page: number,
    pageSize: number,
    search: string,
    filters: Record<string, any>
  ): Promise<PaginatedResponse<Product>> => {
    console.log('📋 Fetching products:', { page, pageSize, search, filters })
    const {
      categoryId = '',
      lowStock = false,
      status = ''
    } = filters
    try {
      const result = await productsService.getAll(page, pageSize, search, categoryId, lowStock, status)
      console.log('✅ Products data received:', result)
      return result
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      throw error
    }
  }, [])

  const {
    data: products,
    totalCount,
    totalPages,
    loading,
    error,
    page,
    pageSize,
    search,
    stats,
    setPage,
    setPageSize,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    refetch
  } = useDataTable<Product>(fetchProducts)

  // Table columns configuration
  const columns: TableColumn<Product>[] = useMemo(() => [
    {
      key: 'code',
      label: 'Código',
      className: 'w-32',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Producto',
      render: (value, item) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{value}</div>
          {item.categoryName && (
            <div className="text-sm text-gray-500">{item.categoryName}</div>
          )}
          {item.brandName && (
            <div className="text-xs text-gray-400">{item.brandName}</div>
          )}
        </div>
      )
    },
    {
      key: 'currentStock',
      label: 'Stock Actual',
      className: 'w-28 text-center',
      render: (value, item) => {
        const stock = Number(value)
        const globalMinimumStock = 5
        const effectiveMinimumStock = item.minimumStock > 0 ? item.minimumStock : globalMinimumStock
        const isLowStock = stock <= effectiveMinimumStock
        const isOutOfStock = stock <= 0

        return (
          <div className="text-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
              isOutOfStock
                ? 'bg-red-100 text-red-800'
                : isLowStock
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {stock.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Min: {effectiveMinimumStock.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
              {item.minimumStock <= 0 && <span className="text-blue-500"> (global)</span>}
            </div>
          </div>
        )
      }
    },
    {
      key: 'purchasePrice',
      label: 'P. Compra',
      className: 'w-28 text-right',
      render: (value) => (
        <div className="text-right">
          <span className="text-gray-600">
            {price(value)}
          </span>
        </div>
      )
    },
    {
      key: 'salePrice',
      label: 'P. Venta',
      className: 'w-28 text-right',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-blue-600">
            {price(value)}
          </span>
        </div>
      )
    },
    {
      key: 'active',
      label: 'Estado',
      className: 'w-24 text-center',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      )
    }
  ], [])

  // Use backend statistics that consider all filters properly
  console.log('🔍 Stats from useDataTable:', stats)
  const displayStats = stats ? {
    TotalProducts: stats.totalProducts || stats.TotalProducts || 0,
    ActiveProducts: stats.activeProducts || stats.ActiveProducts || 0,
    LowStockProducts: stats.lowStockProducts || stats.LowStockProducts || 0,
    OutOfStockProducts: stats.outOfStockProducts || stats.OutOfStockProducts || 0,
    TotalValue: stats.totalValue || stats.TotalValue || 0
  } : {
    TotalProducts: 0,
    ActiveProducts: 0,
    LowStockProducts: 0,
    OutOfStockProducts: 0,
    TotalValue: 0
  }

  // Filter components
  const filters_component = (
    <div className="flex items-center gap-4">
      <select
        value={filters.lowStock ? 'true' : ''}
        onChange={(e) => setFilter('lowStock', e.target.value === 'true')}
        className="input-professional px-3 py-2 text-sm"
      >
        <option value="">Todos los productos</option>
        <option value="true">Solo stock bajo</option>
      </select>
      
      <select
        value={filters.status || ''}
        onChange={(e) => setFilter('status', e.target.value)}
        className="input-professional px-3 py-2 text-sm"
      >
        <option value="">Todos los estados</option>
        <option value="active">Solo activos</option>
        <option value="inactive">Solo inactivos</option>
      </select>
      
      {(filters.lowStock || filters.status) && (
        <button
          onClick={clearFilters}
          className="btn-secondary px-3 py-2 text-sm"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )

  // Actions
  const actions = (
    <div className="flex items-center gap-2">
      <button
        onClick={refetch}
        disabled={loading}
        className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
      >
        <svg className={`h-4 w-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-medium text-red-800">Error al cargar productos</h3>
          </div>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="header-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Productos</h1>
              <p className="text-sm text-green-100 mt-1">
                Catálogo completo de productos y control de inventario
              </p>
            </div>

            {/* Summary cards - Simple and clean */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-700">{displayStats.TotalProducts.toLocaleString()}</div>
                <div className="text-xs text-green-700">Total Productos</div>
              </div>
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-800">{displayStats.ActiveProducts.toLocaleString()}</div>
                <div className="text-xs text-green-800">Activos</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-yellow-600">{displayStats.LowStockProducts.toLocaleString()}</div>
                <div className="text-xs text-yellow-600">Stock Bajo</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-red-600">{displayStats.OutOfStockProducts.toLocaleString()}</div>
                <div className="text-xs text-red-600">Sin Stock</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTable
          columns={columns}
          data={products}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          loading={loading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por código, nombre, categoría..."
          filters={filters_component}
          actions={actions}
          emptyMessage="No se encontraron productos con los filtros aplicados"
        />
      </div>
    </div>
  )
}