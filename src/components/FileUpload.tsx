import React, { useState, useEffect } from 'react'
import { importService } from '../services/imports'
import { storesService } from '../services/api'
import type { Store } from '../types'

interface FileUploadProps {
  type: 'products' | 'stock' | 'sales'
  onSuccess: (jobId: string) => void
  onError: (error: string) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ type, onSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null)
  const [storeCode, setStoreCode] = useState('')
  const [uploading, setUploading] = useState(false)
  const [stores, setStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(false)

  // Load stores when component mounts
  useEffect(() => {
    if (type === 'stock' || type === 'sales') {
      loadStores()
    }
  }, [type])

  const loadStores = async () => {
    try {
      setLoadingStores(true)
      const storesData = await storesService.getAll()
      setStores(storesData)
    } catch (error) {
      console.error('Error loading stores:', error)
      onError('Error al cargar las tiendas')
    } finally {
      setLoadingStores(false)
    }
  }

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

    if ((type === 'stock' || type === 'sales') && !storeCode) {
      onError('Por favor selecciona una tienda')
      return
    }

    // Special validation for stock upload
    if (type === 'stock') {
      const selectedStore = stores.find(store => store.code === storeCode)
      if (selectedStore && selectedStore.hasInitialStock) {
        onError('Esta tienda ya tiene stock inicial cargado. Solo se permite una carga de stock inicial por tienda.')
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
      }
      onSuccess(result.jobId)
    } catch (error: any) {
      onError(error.response?.data?.message || 'Error al subir el archivo')
    } finally {
      setUploading(false)
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'products': return 'Cargar Productos'
      case 'stock': return 'Cargar Stock'
      case 'sales': return 'Cargar Ventas'
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

        {(type === 'stock' || type === 'sales') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tienda
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
              <div>
                <select
                  value={storeCode}
                  onChange={(e) => setStoreCode(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={uploading}
                >
                  <option value="">Selecciona una tienda</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.code} disabled={type === 'stock' && store.hasInitialStock}>
                      {store.name} {type === 'stock' && store.hasInitialStock ? '(Stock inicial ya cargado)' : ''}
                    </option>
                  ))}
                </select>
                {type === 'stock' && storeCode && (() => {
                  const selectedStore = stores.find(store => store.code === storeCode)
                  return selectedStore && selectedStore.hasInitialStock ? (
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Stock inicial ya cargado
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>Esta tienda ya tiene stock inicial cargado. Solo se permite una carga de stock inicial por tienda.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={
            !file || 
            uploading || 
            ((type === 'stock' || type === 'sales') && !storeCode) ||
            (type === 'stock' && storeCode && stores.find(store => store.code === storeCode)?.hasInitialStock)
          }
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subiendo...
            </>
          ) : (
            'Subir Archivo'
          )}
        </button>
      </div>
    </div>
  )
}