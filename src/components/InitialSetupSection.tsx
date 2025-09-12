import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

interface InitialSetupSectionProps {
  onUploadSuccess?: (jobId: string) => void;
  onUploadError?: (error: string) => void;
}

const InitialSetupSection: React.FC<InitialSetupSectionProps> = ({
  onUploadSuccess = () => {},
  onUploadError = () => {}
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Elegant Header with Icon */}
      <div className="bg-white border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Configuración Inicial</h3>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Importaciones de configuración (uso poco frecuente)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isExpanded ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isExpanded ? 'Ocultar' : 'Ver opciones'}
            </div>
            <div className={`p-2 rounded-lg transition-all duration-200 ${
              isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
              <svg 
                className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M19 9l-7 7-7-7" 
                />
              </svg>
            </div>
          </div>
        </button>
      </div>
      
      {/* Animated Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Products Import Card */}
            <div className="group">
              <div className="relative bg-white rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-xl">📦</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Importar Productos</h4>
                      <p className="text-sm text-gray-600">Catálogo y precios</p>
                    </div>
                  </div>
                  <FileUpload 
                    type="products"
                    onSuccess={onUploadSuccess}
                    onError={onUploadError}
                  />
                </div>
              </div>
            </div>
            
            {/* Stock Import Card */}
            <div className="group">
              <div className="relative bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-lg hover:border-emerald-200 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">Stock Inicial</h4>
                      <p className="text-sm text-gray-600">Solo una vez por tienda</p>
                    </div>
                  </div>
                  <FileUpload 
                    type="stock"
                    onSuccess={onUploadSuccess}
                    onError={onUploadError}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Footer */}
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center space-x-2 text-amber-800">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                Estas opciones se usan principalmente durante la configuración inicial del sistema
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetupSection;