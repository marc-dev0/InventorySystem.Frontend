import React, { useMemo, useCallback } from 'react'
import { DataTable, TableColumn } from '../components/DataTable'
import { useDataTable } from '../hooks/useDataTable'
import { inventoryService, storesService } from '../services/api'
import { formatPrice, formatTotal } from '../utils/currency'
import type { InventoryItem, Store, PaginatedResponse } from '../types'

export const InventoryPage: React.FC = () => {
  // Fetch function for inventory - memoized to prevent unnecessary re-renders
  const fetchInventory = useCallback(async (
    page: number,
    pageSize: number,
    search: string,
    filters: Record<string, any>
  ): Promise<PaginatedResponse<InventoryItem>> => {
    const { storeCode = '', lowStock = false } = filters
    return await inventoryService.getAll(page, pageSize, search, storeCode, lowStock)
  }, [])

  const {
    data: inventory,
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
  } = useDataTable<InventoryItem>(fetchInventory)

  // Store filter state
  const [stores, setStores] = React.useState<Store[]>([])
  const [loadingStores, setLoadingStores] = React.useState(false)

  // Load stores for filter
  React.useEffect(() => {
    const loadStores = async () => {
      try {
        setLoadingStores(true)
        const storesData = await storesService.getAll()
        setStores(storesData)
      } catch (error) {
        console.error('Error loading stores:', error)
      } finally {
        setLoadingStores(false)
      }
    }
    loadStores()
  }, [])

  // Table columns configuration
  const columns: TableColumn<InventoryItem>[] = useMemo(() => [
    {
      key: 'productCode',
      label: 'Código',
      className: 'w-32',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'productName',
      label: 'Producto',
      render: (value) => (
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{value}</div>
        </div>
      )
    },
    {
      key: 'storeName',
      label: 'Tienda',
      className: 'w-40',
      render: (value, item) => (
        <div className="text-sm">
          <div className="font-medium">{value}</div>
          <div className="text-gray-500 font-mono text-xs">{item.storeCode}</div>
        </div>
      )
    },
    {
      key: 'currentStock',
      label: 'Stock Actual',
      className: 'w-28 text-center',
      render: (value, item) => {
        const stock = Number(value)
        const isLowStock = item.isLowStock
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
          </div>
        )
      }
    },
    {
      key: 'minimumStock',
      label: 'Stock Mínimo',
      className: 'w-28 text-center',
      render: (value) => (
        <div className="text-center text-gray-600">
          {Number(value).toLocaleString('es-ES', { maximumFractionDigits: 2 })}
        </div>
      )
    },
    {
      key: 'maximumStock',
      label: 'Stock Máximo',
      className: 'w-28 text-center',
      render: (value) => (
        <div className="text-center text-gray-600">
          {Number(value).toLocaleString('es-ES', { maximumFractionDigits: 2 })}
        </div>
      )
    },
    {
      key: 'averageCost',
      label: 'Costo Promedio',
      className: 'w-32 text-right',
      render: (value) => (
        <div className="text-right">
          <span className="text-gray-600">
            {formatPrice(value)}
          </span>
        </div>
      )
    },
    {
      key: 'totalValue',
      label: 'Valor Total',
      className: 'w-32 text-right',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-blue-600">
            {formatPrice(value)}
          </span>
        </div>
      )
    },
    {
      key: 'isLowStock',
      label: 'Estado',
      className: 'w-24 text-center',
      render: (value, item) => {
        const stock = Number(item.currentStock)
        const isOutOfStock = stock <= 0
        
        if (isOutOfStock) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Sin Stock
            </span>
          )
        }
        
        if (value) {
          return (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Stock Bajo
            </span>
          )
        }
        
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Normal
          </span>
        )
      }
    }
  ], [])

  // Use backend statistics that consider all filters properly
  console.log('🔍 Stats from useDataTable (Inventory):', stats)
  const displayStats = stats ? {
    TotalItems: stats.TotalItems || stats.totalItems || 0,
    LowStockItems: stats.LowStockItems || stats.lowStockItems || 0,
    OutOfStockItems: stats.OutOfStockItems || stats.outOfStockItems || 0,
    TotalValue: stats.TotalValue || stats.totalValue || 0
  } : {
    TotalItems: 0,
    LowStockItems: 0,
    OutOfStockItems: 0,
    TotalValue: 0
  }

  // Filter components
  const filters_component = (
    <div className="flex items-center gap-4">
      <select
        value={filters.storeCode || ''}
        onChange={(e) => setFilter('storeCode', e.target.value)}
        className="input-professional px-3 py-2 text-sm"
        disabled={loadingStores}
      >
        <option value="">Todas las tiendas</option>
        {stores.map((store) => (
          <option key={store.id} value={store.code}>
            {store.name}
          </option>
        ))}
      </select>
      
      <select
        value={filters.lowStock ? 'true' : ''}
        onChange={(e) => setFilter('lowStock', e.target.value === 'true')}
        className="input-professional px-3 py-2 text-sm"
      >
        <option value="">Todos los productos</option>
        <option value="true">Solo stock bajo</option>
      </select>
      
      {(filters.storeCode || filters.lowStock) && (
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
            <h3 className="text-sm font-medium text-red-800">Error al cargar inventario</h3>
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
              <h1 className="text-2xl font-bold text-white">Inventario</h1>
              <p className="text-sm text-green-100 mt-1">
                Control detallado de stock por tienda y alertas de reposición
              </p>
            </div>
            
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-700">{displayStats.TotalItems.toLocaleString()}</div>
                <div className="text-xs text-green-700">Items Inventario</div>
              </div>
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-800">
                  {formatTotal(displayStats.TotalValue)}
                </div>
                <div className="text-xs text-green-800">Valor Total</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-yellow-600">{displayStats.LowStockItems.toLocaleString()}</div>
                <div className="text-xs text-yellow-600">Stock Bajo</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-red-600">{displayStats.OutOfStockItems.toLocaleString()}</div>
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
          data={inventory}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          loading={loading}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar por código, producto, tienda..."
          filters={filters_component}
          actions={actions}
          emptyMessage="No se encontraron productos en inventario con los filtros aplicados"
        />
      </div>
    </div>
  )
}