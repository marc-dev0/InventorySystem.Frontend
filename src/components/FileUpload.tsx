import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { importService } from '../services/imports'
import { storesService } from '../services/api'
import { useStockInitialValidation } from '../hooks/useStockInitialValidation'
import type { Store } from '../types'

interface FileUploadProps {
  type: 'products' | 'stock' | 'sales' | 'credit-notes' | 'purchases' | 'transfers'
  onSuccess: (jobId: string) => void
  onError: (error: string) => void
  // Optional props for store management (products type doesn't need stores)
  stores?: Store[]
  loadingStores?: boolean
  onRefreshStores?: () => Promise<void>
  // For transfers, we need origin and destination stores
  originStoreCode?: string
  destinationStoreCode?: string
  onOriginStoreChange?: (storeCode: string) => void
  onDestinationStoreChange?: (storeCode: string) => void
}

export interface FileUploadRef {
  refreshStores: () => Promise<void>
}

export const FileUpload = forwardRef<FileUploadRef, FileUploadProps>(({
  type,
  onSuccess,
  onError,
  stores: propStores,
  loadingStores: propLoadingStores,
  onRefreshStores,
  originStoreCode,
  destinationStoreCode,
  onOriginStoreChange,
  onDestinationStoreChange
}, ref) => {
  const [file, setFile] = useState<File | null>(null)
  const [storeCode, setStoreCode] = useState('')
  const [uploading, setUploading] = useState(false)

  // Use props if provided, otherwise fallback to local state (for backwards compatibility)
  const [localStores, setLocalStores] = useState<Store[]>([])
  const [localLoadingStores, setLocalLoadingStores] = useState(false)

  const stores = propStores || localStores
  const loadingStores = propLoadingStores || localLoadingStores


  // Hook para validar si se puede hacer carga de stock inicial (solo para tipo stock)
  const { canPerformStockInitial, validationMessage, isLoading: isValidatingStock } = useStockInitialValidation(
    type === 'stock' ? storeCode : null,
    type === 'stock'
  )

  // Load stores when component mounts (only if not provided via props)
  useEffect(() => {
    if ((type === 'stock' || type === 'sales' || type === 'credit-notes' || type === 'purchases' || type === 'transfers') && !propStores) {
      console.log(`🚀 FileUpload ${type} component mounted, loading stores locally...`)
      loadStoresLocal()
    }
  }, [type, propStores])

  const loadStoresLocal = async () => {
    try {
      console.log(`📡 Starting local loadStores for ${type}...`)
      setLocalLoadingStores(true)
      const storesData = await storesService.getAll()
      console.log(`✅ Got ${storesData.length} stores locally for ${type}:`, storesData.map((s: Store) => `${s.code}-${s.name}`))
      setLocalStores(storesData)
    } catch (error) {
      console.error(`❌ Error loading stores locally for ${type}:`, error)
      onError('Error al cargar las tiendas')
    } finally {
      setLocalLoadingStores(false)
    }
  }

  // Function to refresh stores (either via props or locally)
  const refreshStores = async () => {
    if (onRefreshStores) {
      console.log(`🔄 Refreshing stores via props for ${type}...`)
      await onRefreshStores()
    } else {
      console.log(`🔄 Refreshing stores locally for ${type}...`)
      await loadStoresLocal()
    }
  }

  // Expose the refresh function to parent components
  useImperativeHandle(ref, () => ({
    refreshStores: refreshStores
  }), [refreshStores])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      const validExtensions = ['.xlsx', '.xls']
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'))
      
      if (!validExtensions.includes(fileExtension)) {
        onError('Por favor selecciona un archivo Excel (.xlsx o .xls)')
        return
      }
      
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      onError('Por favor selecciona un archivo')
      return
    }

    if ((type === 'stock' || type === 'sales' || type === 'credit-notes' || type === 'purchases') && !storeCode) {
      onError('Por favor selecciona una tienda')
      return
    }

    if (type === 'transfers' && (!originStoreCode || !destinationStoreCode)) {
      onError('Por favor selecciona tienda de origen y destino')
      return
    }

    // Special validation for stock upload
    if (type === 'stock') {
      if (!canPerformStockInitial) {
        onError(validationMessage || 'No se puede realizar la carga de stock inicial en este momento.')
        return
      }
    }

    setUploading(true)
    try {
      let result
      switch (type) {
        case 'products':
          result = await importService.uploadProducts(file)
          break
        case 'stock':
          result = await importService.uploadStock(file, storeCode)
          break
        case 'sales':
          result = await importService.uploadSales(file, storeCode)
          break
        case 'credit-notes':
          result = await importService.uploadCreditNotes(file, storeCode)
          break
        case 'purchases':
          result = await importService.uploadPurchases(file, storeCode)
          break
        case 'transfers':
          result = await importService.uploadTransfers(file, originStoreCode!, destinationStoreCode!)
          break
      }
      onSuccess(result.jobId)
    } catch (error: any) {
      // Capture full error details for better user feedback
      const errorData = error.response?.data
      let errorMessage = 'Error al subir el archivo'
      
      if (errorData) {
        if (errorData.error) {
          errorMessage = errorData.error
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
        
        // Include additional details if available
        if (errorData.reason) {
          errorMessage += `\n\nDetalle: ${errorData.reason}`
        }
        if (errorData.suggestion) {
          errorMessage += `\n\nSugerencia: ${errorData.suggestion}`
        }
      }
      
      onError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'products': return 'Cargar Productos'
      case 'stock': return 'Cargar Stock'
      case 'sales': return 'Cargar Ventas'
      case 'credit-notes': return 'Cargar Notas de Crédito'
      case 'purchases': return 'Cargar Compras'
      case 'transfers': return 'Cargar Transferencias'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{getTitle()}</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Archivo Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={uploading}
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Archivo seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
            </p>
          )}
        </div>

        {(type === 'stock' || type === 'sales' || type === 'credit-notes' || type === 'purchases') && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tienda
              </label>
              <button
                onClick={refreshStores}
                disabled={loadingStores}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                title="Actualizar lista de tiendas"
              >
                <svg className={`h-3 w-3 ${loadingStores ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Actualizar</span>
              </button>
            </div>
            {loadingStores ? (
              <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                <svg className="animate-spin h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando tiendas...
              </div>
            ) : (
              <div>
                <select
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={uploading}
                >
                  <option value="">Selecciona una tienda</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.code}>
                      {store.name}
                    </option>
                  ))}
                </select>
                {type === 'stock' && storeCode && validationMessage && (
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Carga de stock inicial no disponible
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>{validationMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Special case for transfers - need origin and destination stores */}
        {type === 'transfers' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tienda de Origen
              </label>
              {loadingStores ? (
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                  <svg className="animate-spin h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando tiendas...
                </div>
              ) : (
                <select
                  value={originStoreCode || ''}
                  onChange={(e) => onOriginStoreChange?.(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={uploading}
                >
                  <option value="">Selecciona tienda de origen</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.code}>
                      {store.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tienda de Destino
              </label>
              {loadingStores ? (
                <div className="flex items-center px-3 py-2 border border-gray-300 rounded-md">
                  <svg className="animate-spin h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando tiendas...
                </div>
              ) : (
                <select
                  value={destinationStoreCode || ''}
                  onChange={(e) => onDestinationStoreChange?.(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={uploading}
                >
                  <option value="">Selecciona tienda de destino</option>
                  {stores.filter(store => store.code !== originStoreCode).map((store) => (
                    <option key={store.id} value={store.code}>
                      {store.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={
            !file ||
            uploading ||
            isValidatingStock ||
            ((type === 'stock' || type === 'sales' || type === 'credit-notes' || type === 'purchases') && !storeCode) ||
            (type === 'transfers' && (!originStoreCode || !destinationStoreCode)) ||
            (type === 'stock' && storeCode !== '' && !canPerformStockInitial)
          }
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </>
          ) : isValidatingStock ? (
            'Validando...'
          ) : (type === 'stock' && storeCode && !canPerformStockInitial) ? (
            '❌ No disponible'
          ) : (
            'Subir Archivo'
          )}
        </button>
      </div>
    </div>
  )
})