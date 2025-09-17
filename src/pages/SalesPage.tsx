import React, { useMemo, useCallback, useState } from 'react'
import { DataTable, TableColumn } from '../components/DataTable'
import { useDataTable } from '../hooks/useDataTable'
import { salesService, storesService } from '../services/api'
import { formatPrice } from '../utils/currency'
import { SaleDetailsComponent } from '../components/SaleDetails'
import type { Sale, Store, PaginatedResponse } from '../types'

export const SalesPage: React.FC = () => {
  console.log('🏪 SalesPage component rendering...')
  
  // Fetch function for sales - memoized to prevent unnecessary re-renders
  const fetchSales = useCallback(async (
    page: number,
    pageSize: number,
    search: string,
    filters: Record<string, any>
  ): Promise<PaginatedResponse<Sale>> => {
    console.log('📊 Fetching sales:', { page, pageSize, search, filters })
    const { storeCode = '' } = filters
    try {
      const result = await salesService.getAll(page, pageSize, search, storeCode)
      console.log('✅ Sales data received:', result)
      return result
    } catch (error) {
      console.error('❌ Error fetching sales:', error)
      throw error
    }
  }, [])

  const {
    data: sales,
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
  } = useDataTable<Sale>(fetchSales)

  // Store filter state
  const [stores, setStores] = React.useState<Store[]>([])
  const [loadingStores, setLoadingStores] = React.useState(false)

  // Expanded rows state
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  // Toggle expanded row
  const toggleExpandedRow = useCallback((saleId: number) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(saleId)) {
        newSet.delete(saleId)
      } else {
        newSet.add(saleId)
      }
      return newSet
    })
  }, [])

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
  const columns: TableColumn<Sale>[] = useMemo(() => [
    {
      key: 'saleNumber',
      label: 'N° Venta',
      className: 'w-32',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'saleDate',
      label: 'Fecha',
      className: 'w-32',
      render: (value) => {
        const date = new Date(value)
        return (
          <div className="text-sm">
            <div className="font-medium">{date.toLocaleDateString('es-ES')}</div>
            <div className="text-gray-500">{date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        )
      }
    },
    {
      key: 'customerName',
      label: 'Cliente',
      render: (value) => (
        <span className="text-sm">
          {value || 'Cliente Genérico'}
        </span>
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
      key: 'itemCount',
      label: 'Items',
      className: 'w-20 text-center',
      render: (value) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'total',
      label: 'Total',
      className: 'w-28 text-right',
      render: (value) => (
        <div className="text-right">
          <span className="font-semibold text-green-600">
            {formatPrice(value)}
          </span>
        </div>
      )
    },
    {
      key: 'importSource',
      label: 'Origen',
      className: 'w-32',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Importado' : 'Manual'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'w-20 text-center',
      render: (value, item) => (
        <button
          onClick={() => toggleExpandedRow(item.id)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          title={expandedRows.has(item.id) ? 'Ocultar detalle' : 'Ver detalle'}
        >
          <svg
            className={`w-3 h-3 transition-transform ${expandedRows.has(item.id) ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )
    }
  ], [expandedRows, toggleExpandedRow])

  // Use backend statistics that consider all filters properly
  console.log('🔍 Stats from useDataTable (Sales):', stats)
  const displayStats = stats ? {
    TotalSales: stats.TotalSales || stats.totalSales || 0,
    TotalValue: stats.TotalValue || stats.totalValue || 0,
    TotalItems: stats.TotalItems || stats.totalItems || 0,
    AverageTicket: stats.AverageTicket || stats.averageTicket || 0
  } : {
    TotalSales: 0,
    TotalValue: 0,
    TotalItems: 0,
    AverageTicket: 0
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
      
      {(search || filters.storeCode) && (
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
            <h3 className="text-sm font-medium text-red-800">Error al cargar ventas</h3>
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
              <h1 className="text-2xl font-bold text-white">Ventas</h1>
              <p className="text-sm text-green-100 mt-1">
                Gestión y consulta de todas las ventas registradas
              </p>
            </div>
            
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-700">{displayStats.TotalSales.toLocaleString()}</div>
                <div className="text-xs text-green-700">Total Ventas</div>
              </div>
              <div className="stats-card-green">
                <div className="text-xl font-bold text-green-800">
                  {formatPrice(displayStats.TotalValue)}
                </div>
                <div className="text-xs text-green-800">Valor Total</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-blue-600">{displayStats.TotalItems.toLocaleString()}</div>
                <div className="text-xs text-blue-600">Items Vendidos</div>
              </div>
              <div className="stats-card-secondary">
                <div className="text-xl font-bold text-orange-600">
                  {formatPrice(displayStats.AverageTicket)}
                </div>
                <div className="text-xs text-orange-600">Ticket Promedio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-professional">
          {/* Header with search and filters */}
          <div className="px-4 py-4 border-b border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Buscar por número de venta, cliente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-professional w-full px-3 py-2"
                />
              </div>

              {filters_component && (
                <div className="ml-4">
                  {filters_component}
                </div>
              )}

              {actions && (
                <div className="ml-4 flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header-professional">
                <tr>
                  {/* Row number column */}
                  <th className="px-4 py-4 text-center text-xs font-semibold text-green-700 uppercase tracking-wider w-16">
                    #
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider ${column.className || ''}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-green-100">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center">
                      <div className="animate-pulse text-gray-500">Cargando...</div>
                    </td>
                  </tr>
                ) : sales.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                      No se encontraron ventas con los filtros aplicados
                    </td>
                  </tr>
                ) : (
                  sales.map((sale, index) => (
                    <React.Fragment key={sale.id}>
                      {/* Main row */}
                      <tr className="hover:bg-gray-50">
                        {/* Row number */}
                        <td className="px-4 py-4 text-center text-sm text-gray-500">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        {columns.map((column) => (
                          <td key={column.key} className={`px-4 py-4 ${column.className || ''}`}>
                            {column.render
                              ? column.render(sale[column.key as keyof Sale], sale)
                              : sale[column.key as keyof Sale]
                            }
                          </td>
                        ))}
                      </tr>
                      {/* Expanded detail row */}
                      {expandedRows.has(sale.id) && (
                        <tr>
                          <td colSpan={columns.length + 1} className="p-0">
                            <SaleDetailsComponent saleId={sale.id} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, totalCount)} de {totalCount.toLocaleString()} resultados
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>

                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>

                  <span className="px-3 py-1 text-sm">
                    {page} de {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}