import React, { useState, useCallback, useEffect } from 'react'
import { reportsService, storesService, api } from '../services/api'
import { formatPrice } from '../utils/currency'
import type { ReportFilters, StockCriticalReport, InventoryValuationReport, SalesPeriodReport } from '../types/reports'

export const ReportsPage: React.FC = () => {
  console.log('📊 ReportsPage component rendering...')

  // Helper function to get first day of current month
  const getFirstDayOfMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  }

  // Helper function to get today's date
  const getToday = () => {
    return new Date().toISOString().split('T')[0]
  }

  const [filters, setFilters] = useState<ReportFilters>({
    startDate: getFirstDayOfMonth(),
    endDate: getToday(),
    storeCode: '',
    categoryId: undefined,
    brandId: undefined
  })

  const [stores, setStores] = useState<any[]>([])
  const [loadingStores, setLoadingStores] = useState(true)

  // Load stores on component mount
  useEffect(() => {
    const loadStores = async () => {
      try {
        const storesData = await storesService.getAll()
        setStores(storesData || [])
      } catch (error) {
        console.error('Error loading stores:', error)
        setStores([])
      } finally {
        setLoadingStores(false)
      }
    }
    loadStores()
  }, [])

  const [stockCriticalReport, setStockCriticalReport] = useState<StockCriticalReport | null>(null)
  const [valuationReport, setValuationReport] = useState<InventoryValuationReport[] | null>(null)
  const [salesReport, setSalesReport] = useState<SalesPeriodReport | null>(null)
  const [topProductsReport, setTopProductsReport] = useState<TopProduct[] | null>(null)
  const [categoryReport, setCategoryReport] = useState<CategorySales[] | null>(null)
  const [customerReport, setCustomerReport] = useState<CustomerAnalysis[] | null>(null)
  const [storePerformanceReport, setStorePerformanceReport] = useState<StorePerformance[] | null>(null)
  const [productsWithoutMovementReport, setProductsWithoutMovementReport] = useState<InventoryReportItem[] | null>(null)
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleGenerateStockCriticalReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, stockCritical: true }))
      setErrors(prev => ({ ...prev, stockCritical: '' }))

      const report = await reportsService.getStockCriticalReport(filters)
      setStockCriticalReport(report)

      console.log('✅ Stock Critical Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Stock Critical Report:', error)
      setErrors(prev => ({ ...prev, stockCritical: 'Error al generar el reporte de stock crítico' }))
    } finally {
      setLoading(prev => ({ ...prev, stockCritical: false }))
    }
  }, [filters])

  const handleGenerateValuationReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, valuation: true }))
      setErrors(prev => ({ ...prev, valuation: '' }))

      const report = await reportsService.getInventoryValuationReport(filters)
      setValuationReport(report)

      console.log('✅ Inventory Valuation Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Inventory Valuation Report:', error)
      setErrors(prev => ({ ...prev, valuation: 'Error al generar el reporte de valorización' }))
    } finally {
      setLoading(prev => ({ ...prev, valuation: false }))
    }
  }, [filters])

  const handleGenerateSalesReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, sales: true }))
      setErrors(prev => ({ ...prev, sales: '' }))

      const report = await reportsService.getSalesPeriodReport(filters)
      setSalesReport(report)

      console.log('✅ Sales Period Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Sales Period Report:', error)
      setErrors(prev => ({ ...prev, sales: 'Error al generar el reporte de ventas' }))
    } finally {
      setLoading(prev => ({ ...prev, sales: false }))
    }
  }, [filters])

  const handleGenerateTopProductsReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, topProducts: true }))
      setErrors(prev => ({ ...prev, topProducts: '' }))

      const report = await reportsService.getTopProductsReport(filters, 10)
      setTopProductsReport(report)

      console.log('✅ Top Products Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Top Products Report:', error)
      setErrors(prev => ({ ...prev, topProducts: 'Error al generar el reporte de top productos' }))
    } finally {
      setLoading(prev => ({ ...prev, topProducts: false }))
    }
  }, [filters])

  const handleGenerateCategoryReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, category: true }))
      setErrors(prev => ({ ...prev, category: '' }))

      const report = await reportsService.getSalesByCategoryReport(filters)
      setCategoryReport(report)

      console.log('✅ Category Sales Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Category Sales Report:', error)
      setErrors(prev => ({ ...prev, category: 'Error al generar el reporte de ventas por categoría' }))
    } finally {
      setLoading(prev => ({ ...prev, category: false }))
    }
  }, [filters])

  const handleGenerateCustomerReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, customer: true }))
      setErrors(prev => ({ ...prev, customer: '' }))

      const report = await reportsService.getCustomerAnalysisReport(filters)
      setCustomerReport(report)

      console.log('✅ Customer Analysis Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Customer Analysis Report:', error)
      setErrors(prev => ({ ...prev, customer: 'Error al generar el reporte de análisis de clientes' }))
    } finally {
      setLoading(prev => ({ ...prev, customer: false }))
    }
  }, [filters])

  const handleGenerateStorePerformanceReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, storePerformance: true }))
      setErrors(prev => ({ ...prev, storePerformance: '' }))

      const report = await reportsService.getStorePerformanceReport(filters)
      setStorePerformanceReport(report)

      console.log('✅ Store Performance Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Store Performance Report:', error)
      setErrors(prev => ({ ...prev, storePerformance: 'Error al generar el reporte de performance por tienda' }))
    } finally {
      setLoading(prev => ({ ...prev, storePerformance: false }))
    }
  }, [filters])

  const handleGenerateProductsWithoutMovementReport = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, productsWithoutMovement: true }))
      setErrors(prev => ({ ...prev, productsWithoutMovement: '' }))

      // Add daysThreshold to filters for this specific report
      const filtersWithThreshold = { ...filters, daysThreshold: 30 }
      const report = await reportsService.getProductsWithoutMovementReport(filtersWithThreshold)
      setProductsWithoutMovementReport(report)

      console.log('✅ Products Without Movement Report generated:', report)
    } catch (error) {
      console.error('❌ Error generating Products Without Movement Report:', error)
      setErrors(prev => ({ ...prev, productsWithoutMovement: 'Error al generar el reporte de productos sin movimiento' }))
    } finally {
      setLoading(prev => ({ ...prev, productsWithoutMovement: false }))
    }
  }, [filters])

  // Using the standard currency formatting function from the system
  const formatCurrency = formatPrice

  const handleExportReport = async (reportType: string, format: 'PDF' | 'Excel') => {
    try {
      console.log(`Exporting ${reportType} report as ${format}...`)

      const response = await api.post(`/reports/export/${reportType}?format=${format}&includeCharts=true&includeDetails=true`, filters, {
        responseType: 'blob'
      })

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition']
      let filename = `${reportType}_${new Date().toISOString().split('T')[0]}`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      } else {
        // Fallback: determine extension based on format
        const extension = format.toLowerCase() === 'excel' ? 'xlsx' : format.toLowerCase()
        filename = `${filename}.${extension}`
      }

      const blob = response.data
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      console.log(`✅ ${reportType} report exported successfully as ${format}`)
    } catch (error) {
      console.error('❌ Error exporting report:', error)
    }
  }

  return (
    <div className="space-y-8">
        {/* Filters Section */}
        <div className="card-professional mb-8">
          <div className="p-6 border-b border-green-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Reportes</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="input-professional w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="input-professional w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tienda
                </label>
                <select
                  value={filters.storeCode}
                  onChange={(e) => setFilters(prev => ({ ...prev, storeCode: e.target.value }))}
                  className="input-professional w-full"
                  disabled={loadingStores}
                >
                  <option value="">Todas las tiendas</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.code}>
                      {store.code} - {store.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setFilters({
                      startDate: getFirstDayOfMonth(),
                      endDate: getToday(),
                      storeCode: '',
                      categoryId: undefined,
                      brandId: undefined
                    })
                    setStockCriticalReport(null)
                    setValuationReport(null)
                    setSalesReport(null)
                    setTopProductsReport(null)
                    setCategoryReport(null)
                    setCustomerReport(null)
                    setStorePerformanceReport(null)
                    setProductsWithoutMovementReport(null)
                    setErrors({})
                  }}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      startDate: getFirstDayOfMonth(),
                      endDate: getToday()
                    }))
                  }}
                  className="btn-outline-primary px-4 py-2 text-sm"
                >
                  Este Mes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stock Critical Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Stock Crítico</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateStockCriticalReport}
                    disabled={loading.stockCritical}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.stockCritical ? 'Generando...' : 'Generar'}
                  </button>
                  {stockCriticalReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('stock-critical', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('stock-critical', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.stockCritical && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.stockCritical}
                </div>
              )}

              {stockCriticalReport && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="stats-card-secondary">
                      <div className="text-2xl font-bold text-yellow-600">
                        {stockCriticalReport.totalLowStockItems}
                      </div>
                      <div className="text-xs text-yellow-600">Stock Bajo</div>
                    </div>
                    <div className="stats-card-secondary">
                      <div className="text-2xl font-bold text-red-600">
                        {stockCriticalReport.totalOutOfStockItems}
                      </div>
                      <div className="text-xs text-red-600">Sin Stock</div>
                    </div>
                  </div>

                  <div className="stats-card-green">
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(stockCriticalReport.totalLowStockValue)}
                    </div>
                    <div className="text-xs text-green-700">Valor en Riesgo</div>
                  </div>

                  {stockCriticalReport.lowStockItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Productos con Stock Bajo:</h4>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {stockCriticalReport.lowStockItems.slice(0, 5).map((item, index) => (
                          <div key={index} className="text-xs bg-yellow-50 p-2 rounded border">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-gray-600">{item.currentStock} / {item.minimumStock}</div>
                          </div>
                        ))}
                        {stockCriticalReport.lowStockItems.length > 5 && (
                          <div className="text-xs text-gray-500 text-center py-1">
                            +{stockCriticalReport.lowStockItems.length - 5} más...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Inventory Valuation Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Valorización de Inventario</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateValuationReport}
                    disabled={loading.valuation}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.valuation ? 'Generando...' : 'Generar'}
                  </button>
                  {valuationReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('inventory-valuation', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('inventory-valuation', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.valuation && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.valuation}
                </div>
              )}

              {valuationReport && valuationReport.length > 0 && (
                <div className="space-y-4">
                  <div className="stats-card-green">
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(valuationReport.reduce((sum, item) => sum + item.totalPurchaseValue, 0))}
                    </div>
                    <div className="text-xs text-green-700">Valor Total Inventario</div>
                  </div>

                  <div className="stats-card-secondary">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(valuationReport.reduce((sum, item) => sum + item.potentialProfit, 0))}
                    </div>
                    <div className="text-xs text-blue-600">Ganancia Potencial</div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Por Categoría:</h4>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {valuationReport.slice(0, 5).map((item, index) => (
                        <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                          <div className="font-medium">{item.categoryName}</div>
                          <div className="text-green-600">{formatCurrency(item.totalPurchaseValue)}</div>
                          <div className="text-blue-600">+{formatCurrency(item.potentialProfit)}</div>
                        </div>
                      ))}
                      {valuationReport.length > 5 && (
                        <div className="text-xs text-gray-500 text-center py-1">
                          +{valuationReport.length - 5} más...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sales Period Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ventas por Período</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateSalesReport}
                    disabled={loading.sales}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.sales ? 'Generando...' : 'Generar'}
                  </button>
                  {salesReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('sales-period', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('sales-period', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.sales && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.sales}
                </div>
              )}

              {salesReport && (
                <div className="space-y-4">
                  <div className="stats-card-green">
                    <div className="text-lg font-bold text-green-700">
                      {formatCurrency(salesReport.totalSales)}
                    </div>
                    <div className="text-xs text-green-700">Ventas Totales</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="stats-card-secondary">
                      <div className="text-sm font-bold text-blue-600">
                        {salesReport.totalTransactions}
                      </div>
                      <div className="text-xs text-blue-600">Transacciones</div>
                    </div>
                    <div className="stats-card-secondary">
                      <div className="text-sm font-bold text-purple-600">
                        {formatCurrency(salesReport.averageTicket)}
                      </div>
                      <div className="text-xs text-purple-600">Ticket Promedio</div>
                    </div>
                  </div>

                  <div className="stats-card-secondary">
                    <div className="text-lg font-bold text-emerald-600">
                      {formatCurrency(salesReport.totalProfit)}
                    </div>
                    <div className="text-xs text-emerald-600">Ganancia Total</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Top Products Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Productos</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateTopProductsReport}
                    disabled={loading.topProducts}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.topProducts ? 'Generando...' : 'Generar'}
                  </button>
                  {topProductsReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('top-products', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('top-products', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.topProducts && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.topProducts}
                </div>
              )}

              {topProductsReport && topProductsReport.length > 0 && (
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {topProductsReport.slice(0, 5).map((product, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-green-600">{formatCurrency(product.totalRevenue)}</div>
                        <div className="text-gray-600">{product.quantitySold} vendidos</div>
                      </div>
                    ))}
                    {topProductsReport.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{topProductsReport.length - 5} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Sales Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ventas por Categoría</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateCategoryReport}
                    disabled={loading.category}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.category ? 'Generando...' : 'Generar'}
                  </button>
                  {categoryReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('sales-by-category', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('sales-by-category', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.category && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.category}
                </div>
              )}

              {categoryReport && categoryReport.length > 0 && (
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {categoryReport.slice(0, 5).map((category, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                        <div className="font-medium">{category.categoryName}</div>
                        <div className="text-green-600">{formatCurrency(category.totalSales)}</div>
                        <div className="text-blue-600">+{formatCurrency(category.totalProfit)}</div>
                      </div>
                    ))}
                    {categoryReport.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{categoryReport.length - 5} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Analysis Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Análisis de Clientes</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateCustomerReport}
                    disabled={loading.customer}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.customer ? 'Generando...' : 'Generar'}
                  </button>
                  {customerReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('customer-analysis', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('customer-analysis', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.customer && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.customer}
                </div>
              )}

              {customerReport && customerReport.length > 0 && (
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {customerReport.slice(0, 5).map((customer, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                        <div className="font-medium">{customer.customerName}</div>
                        <div className="text-green-600">{formatCurrency(customer.totalPurchases)}</div>
                        <div className="text-gray-600">{customer.transactionCount} compras</div>
                      </div>
                    ))}
                    {customerReport.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{customerReport.length - 5} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Store Performance Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance por Tienda</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateStorePerformanceReport}
                    disabled={loading.storePerformance}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.storePerformance ? 'Generando...' : 'Generar'}
                  </button>
                  {storePerformanceReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('store-performance', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('store-performance', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.storePerformance && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.storePerformance}
                </div>
              )}

              {storePerformanceReport && storePerformanceReport.length > 0 && (
                <div className="space-y-2">
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {storePerformanceReport.slice(0, 3).map((store, index) => (
                      <div key={index} className="text-xs bg-gray-50 p-2 rounded border">
                        <div className="font-medium">{store.storeName}</div>
                        <div className="text-green-600">{formatCurrency(store.totalSales)}</div>
                        <div className="text-blue-600">{store.profitMargin.toFixed(1)}% margen</div>
                      </div>
                    ))}
                    {storePerformanceReport.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{storePerformanceReport.length - 3} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Without Movement Report */}
          <div className="card-professional">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Productos sin Movimiento</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleGenerateProductsWithoutMovementReport}
                    disabled={loading.productsWithoutMovement}
                    className="btn-primary px-4 py-2 text-sm disabled:opacity-50"
                  >
                    {loading.productsWithoutMovement ? 'Generando...' : 'Generar'}
                  </button>
                  {productsWithoutMovementReport && (
                    <>
                      <button
                        onClick={() => handleExportReport('products-without-movement', 'PDF')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como PDF"
                      >
                        📄 PDF
                      </button>
                      <button
                        onClick={() => handleExportReport('products-without-movement', 'Excel')}
                        className="btn-outline-secondary px-3 py-2 text-xs"
                        title="Exportar como Excel"
                      >
                        📊 Excel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {errors.productsWithoutMovement && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.productsWithoutMovement}
                </div>
              )}

              {productsWithoutMovementReport && productsWithoutMovementReport.length > 0 && (
                <div className="space-y-2">
                  <div className="stats-card-secondary mb-3">
                    <div className="text-lg font-bold text-orange-600">
                      {productsWithoutMovementReport.length}
                    </div>
                    <div className="text-xs text-orange-600">Productos sin movimiento (30 días)</div>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {productsWithoutMovementReport.slice(0, 5).map((product, index) => (
                      <div key={index} className="text-xs bg-orange-50 p-2 rounded border">
                        <div className="font-medium">{product.productName}</div>
                        <div className="text-orange-600">{formatCurrency(product.totalValue)} en inventario</div>
                      </div>
                    ))}
                    {productsWithoutMovementReport.length > 5 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{productsWithoutMovementReport.length - 5} más...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}