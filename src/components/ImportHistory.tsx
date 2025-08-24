import React, { useState, useEffect } from 'react'
import { importHistoryService } from '../services/api'
import type { BackgroundJob } from '../types'

interface ImportHistoryData {
  data: BackgroundJob[]
  pagination: {
    currentPage: number
    pageSize: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  filters: {
    jobType?: string
    status?: string
  }
}

export const ImportHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<ImportHistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchHistory()
  }, [currentPage, pageSize, jobTypeFilter, statusFilter])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const data = await importHistoryService.getHistory(currentPage, pageSize, jobTypeFilter, statusFilter)
      setHistoryData(data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al cargar el historial de importaciones')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'queued': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'completed_with_warnings': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'PRODUCTS_IMPORT': return 'Productos'
      case 'STOCK_IMPORT': return 'Stock'
      case 'SALES_IMPORT': return 'Ventas'
      default: return jobType
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-ES')
  }

  const toggleRowExpansion = (jobId: string) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(jobId)) {
      newExpandedRows.delete(jobId)
    } else {
      newExpandedRows.add(jobId)
    }
    setExpandedRows(newExpandedRows)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl border border-gray-200/60">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Historial de Importaciones</h3>
            <p className="text-sm text-gray-500">Registro completo de todas las cargas realizadas</p>
          </div>
          
          {/* Page Size Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
                Mostrar:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">por página</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Importación
            </label>
            <select
              id="jobType"
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="PRODUCTS">Productos</option>
              <option value="STOCK">Stock</option>
              <option value="SALES">Ventas</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos</option>
              <option value="COMPLETED">Completado</option>
              <option value="COMPLETED_WITH_WARNINGS">Completado con advertencias</option>
              <option value="FAILED">Fallido</option>
              <option value="PROCESSING">Procesando</option>
              <option value="QUEUED">En cola</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-500">Cargando historial...</p>
          </div>
        ) : !historyData?.data?.length ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron importaciones</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo / Archivo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registros
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {historyData.data.map((job) => (
                    <React.Fragment key={job.jobId}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getJobTypeLabel(job.jobType)}
                            </div>
                            <div className="text-sm text-gray-500">{job.fileName}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Total: {job.totalRecords}
                          </div>
                          <div className="text-xs text-gray-500">
                            ✅ {job.successRecords} | 
                            ⚠️ {job.warningRecords} | 
                            ❌ {job.errorRecords}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(job.startedAt)}
                          </div>
                          {job.completedAt && (
                            <div className="text-xs text-gray-500">
                              Fin: {formatDate(job.completedAt)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {job.startedBy}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleRowExpansion(job.jobId)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {expandedRows.has(job.jobId) ? 'Ocultar' : 'Ver detalles'}
                          </button>
                        </td>
                      </tr>
                      
                      {expandedRows.has(job.jobId) && (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 bg-gray-50">
                            <div className="space-y-4">
                              {/* Job Details */}
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Detalles del Trabajo</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-700">ID:</span>
                                    <p className="text-gray-600 break-all">{job.jobId}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700">Progreso:</span>
                                    <p className="text-gray-600">{job.progressPercentage}%</p>
                                  </div>
                                  {job.storeCode && (
                                    <div>
                                      <span className="font-medium text-gray-700">Tienda:</span>
                                      <p className="text-gray-600">{job.storeCode}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Errors */}
                              {job.detailedErrors && job.detailedErrors.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-red-700 mb-2">Errores ({job.detailedErrors.length})</h4>
                                  <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <ul className="text-red-600 text-sm space-y-1">
                                      {job.detailedErrors.slice(0, 5).map((error, index) => (
                                        <li key={index}>• {error}</li>
                                      ))}
                                      {job.detailedErrors.length > 5 && (
                                        <li className="text-red-500">• Y {job.detailedErrors.length - 5} errores más...</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                              
                              {/* Warnings */}
                              {job.detailedWarnings && job.detailedWarnings.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-yellow-700 mb-2">Advertencias ({job.detailedWarnings.length})</h4>
                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                    <ul className="text-yellow-600 text-sm space-y-1">
                                      {job.detailedWarnings.slice(0, 5).map((warning, index) => (
                                        <li key={index}>• {warning}</li>
                                      ))}
                                      {job.detailedWarnings.length > 5 && (
                                        <li className="text-yellow-500">• Y {job.detailedWarnings.length - 5} advertencias más...</li>
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              )}
                              
                              {/* Error Message */}
                              {job.errorMessage && (
                                <div>
                                  <h4 className="font-medium text-red-700 mb-2">Mensaje de Error</h4>
                                  <div className="bg-red-50 border border-red-200 rounded p-3">
                                    <p className="text-red-600 text-sm">{job.errorMessage}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {historyData.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Mostrando {((historyData.pagination.currentPage - 1) * historyData.pagination.pageSize) + 1} a{' '}
                  {Math.min(historyData.pagination.currentPage * historyData.pagination.pageSize, historyData.pagination.totalItems)} de{' '}
                  {historyData.pagination.totalItems} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(historyData.pagination.currentPage - 1)}
                    disabled={!historyData.pagination.hasPreviousPage}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(historyData.pagination.totalPages, 5) }, (_, i) => {
                    const startPage = Math.max(1, historyData.pagination.currentPage - 2)
                    const pageNum = startPage + i
                    
                    if (pageNum > historyData.pagination.totalPages) return null
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          pageNum === historyData.pagination.currentPage
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  
                  <button
                    onClick={() => handlePageChange(historyData.pagination.currentPage + 1)}
                    disabled={!historyData.pagination.hasNextPage}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}