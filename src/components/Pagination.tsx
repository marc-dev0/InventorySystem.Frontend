import React from 'react'

interface PaginationProps {
  currentPage: number
  totalItems: number
  pageSize: number
  pageSizeOptions?: number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  showInfo?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showInfo = true
}) => {
  const totalPages = Math.ceil(totalItems / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)
  
  const hasPrevious = currentPage > 1
  const hasNext = currentPage < totalPages

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1)
    }
  }

  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return showInfo ? (
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
            Mostrar:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">por página</span>
        </div>
        
        <div className="text-sm text-gray-700">
          Mostrando {Math.min(pageSize, totalItems)} de {totalItems} registros
        </div>
      </div>
    ) : null
  }

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2">
        <label htmlFor="pageSize" className="text-sm font-medium text-gray-700">
          Mostrar:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">por página</span>
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-4">
        {showInfo && (
          <div className="text-sm text-gray-700">
            Mostrando {startItem} a {endItem} de {totalItems} registros
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}