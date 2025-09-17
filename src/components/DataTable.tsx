import React, { useState, useEffect, useMemo } from 'react'

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  loading?: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearchChange: (search: string) => void
  searchPlaceholder?: string
  filters?: React.ReactNode
  actions?: React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  totalCount,
  page,
  pageSize,
  totalPages,
  loading = false,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  actions,
  emptyMessage = "No hay datos disponibles",
  className = ""
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search)
      }
    }, 500) // Increased to 500ms for better UX

    return () => clearTimeout(timer)
  }, [search, debouncedSearch])

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  const pageSizeOptions = useMemo(() => [10, 20, 50, 100], [])

  const getPaginationInfo = () => {
    const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, totalCount)
    return { start, end }
  }

  const { start, end } = getPaginationInfo()

  return (
    <div className={`card-professional ${className}`}>
      {/* Header with Search and Actions */}
      <div className="p-6 border-b border-green-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-professional block w-full pl-10 pr-3 py-2 text-sm"
              />
            </div>
          </div>
          
          {filters && (
            <div className="flex items-center gap-4">
              {filters}
            </div>
          )}
          
          {actions && (
            <div className="flex items-center gap-2">
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
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-xs font-semibold text-green-700 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {loading ? (
              // Loading skeleton
              Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  {/* Row number column for loading */}
                  <td className="px-4 py-4 text-center">
                    <div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div>
                  </td>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m12 0h2m-8-4v4" />
                    </svg>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Sin datos</h3>
                    <p className="text-sm text-gray-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-green-50 transition-colors">
                  {/* Row number column */}
                  <td className="px-4 py-4 text-center text-sm text-gray-500 font-medium">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm text-gray-900">
                      {column.render
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '-')
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-professional">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Results info */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{start}</span> a{' '}
              <span className="font-medium">{end}</span> de{' '}
              <span className="font-medium">{totalCount.toLocaleString()}</span> resultados
            </p>
            
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-sm text-gray-700">
                Por página:
              </label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="input-professional px-2 py-1 text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i
                if (pageNum > totalPages) return null
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pageNum === page
                        ? 'text-white bg-green-700 border border-green-700'
                        : 'btn-secondary'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="btn-secondary px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}