import React, { useState, useEffect } from 'react'
import { importService } from '../services/imports'
import { Pagination } from './Pagination'
import type { BackgroundJob } from '../types'

interface DetailedViewModalProps {
  job: BackgroundJob
  onClose: () => void
}

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

const DetailedViewModal: React.FC<DetailedViewModalProps> = ({ job, onClose }) => {
  const [activeTab, setActiveTab] = useState<'warnings' | 'errors'>('warnings')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Detalles Completos - {job.fileName}</h3>
              <p className="text-sm text-gray-600">ID: {job.jobId}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'warnings' 
                  ? 'border-yellow-500 text-yellow-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('warnings')}
            >
              Advertencias ({job.detailedWarnings?.length || 0})
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'errors' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('errors')}
            >
              Errores ({job.detailedErrors?.length || 0})
            </button>
          </nav>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'warnings' && (
            <div>
              {job.detailedWarnings && job.detailedWarnings.length > 0 ? (
                <ul className="space-y-3">
                  {job.detailedWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{warning}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No hay advertencias registradas.</p>
              )}
            </div>
          )}

          {activeTab === 'errors' && (
            <div>
              {job.detailedErrors && job.detailedErrors.length > 0 ? (
                <ul className="space-y-3">
                  {job.detailedErrors.map((error, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 flex-1">{error}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No hay errores registrados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
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
  const [showDetailedView, setShowDetailedView] = useState<BackgroundJob | null>(null)

  useEffect(() => {
    fetchHistory()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchHistory, 10000)
    return () => clearInterval(interval)
  }, [currentPage, pageSize, jobTypeFilter, statusFilter])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const jobs = await importService.getUserJobs()
      const data = {
        data: jobs,
        pagination: {
          currentPage: 1,
          pageSize: jobs.length,
          totalItems: jobs.length,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false
        },
        filters: {}
      }
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

  // Calculate pagination
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedJobs = historyData?.data.slice(startIndex, endIndex) || []

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
                      #
                    </th>
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
                  {paginatedJobs.map((job, index) => (
                    <React.Fragment key={job.jobId}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {startIndex + index + 1}
                          </div>
                        </td>
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
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
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
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-red-700">Errores ({job.detailedErrors.length})</h4>
                                    <button
                                      onClick={() => setShowDetailedView(job)}
                                      className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                                    >
                                      Ver todas
                                    </button>
                                  </div>
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
                                  <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-yellow-700">Advertencias ({job.detailedWarnings.length})</h4>
                                    <button
                                      onClick={() => setShowDetailedView(job)}
                                      className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                                    >
                                      Ver todas
                                    </button>
                                  </div>
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
            <Pagination
              currentPage={currentPage}
              totalItems={historyData.data.length}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>
      
      {showDetailedView && (
        <DetailedViewModal 
          job={showDetailedView} 
          onClose={() => setShowDetailedView(null)} 
        />
      )}
    </div>
  )
}