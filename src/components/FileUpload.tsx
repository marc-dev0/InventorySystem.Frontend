import React, { useState } from 'react'
import { importService } from '../services/imports'

interface FileUploadProps {
  type: 'products' | 'stock' | 'sales'
  onSuccess: (jobId: string) => void
  onError: (error: string) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ type, onSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null)
  const [storeCode, setStoreCode] = useState('')
  const [uploading, setUploading] = useState(false)

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
      onError('Por favor ingresa el código de la tienda')
      return
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
              Código de Tienda
            </label>
            <input
              type="text"
              value={storeCode}
              onChange={(e) => setStoreCode(e.target.value)}
              placeholder="Ej: STORE01"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={uploading}
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading || ((type === 'stock' || type === 'sales') && !storeCode)}
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