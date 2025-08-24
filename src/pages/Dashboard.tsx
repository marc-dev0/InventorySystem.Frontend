import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FileUpload } from '../components/FileUpload'
import { JobStatus } from '../components/JobStatus'
import { ImportHistory } from '../components/ImportHistory'
import { dashboardService } from '../services/api'

interface DashboardStats {
  totalProducts: number
  totalStores: number
  totalCategories: number
  totalCustomers: number
  totalBrands: number
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStores: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalBrands: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'stock' | 'sales' | 'reports' | 'import'>('overview')
  const [currentJobId, setCurrentJobId] = useState<string>('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await dashboardService.getStats()
        setStats(data)
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
        showNotification('error', 'Error al cargar estadísticas del dashboard')
      } finally {
        setStatsLoading(false)
      }
    }

    loadStats()
    
    // Auto-refresh stats every 10 seconds
    const statsInterval = setInterval(loadStats, 10000)
    return () => clearInterval(statsInterval)
  }, [])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const reloadStats = async () => {
    try {
      const data = await dashboardService.getStats()
      setStats(data)
      console.log('Dashboard stats reloaded:', data)
    } catch (error) {
      console.error('Error reloading stats:', error)
    }
  }

  const handleUploadSuccess = (jobId: string) => {
    setCurrentJobId(jobId)
    showNotification('success', 'Archivo subido exitosamente. Procesando datos...')
  }

  const handleJobCompleted = () => {
    showNotification('success', 'Importación completada exitosamente!')
    reloadStats()
  }

  const handleUploadError = (error: string) => {
    showNotification('error', error)
  }

  const navigationTabs = [
    { id: 'overview' as const, label: 'Resumen', icon: '📊', color: 'blue' },
    { id: 'products' as const, label: 'Productos', icon: '📦', color: 'green' },
    { id: 'stock' as const, label: 'Inventario', icon: '📈', color: 'purple' },
    { id: 'sales' as const, label: 'Ventas', icon: '💰', color: 'orange' },
    { id: 'reports' as const, label: 'Reportes', icon: '📋', color: 'indigo' },
    { id: 'import' as const, label: 'Importación', icon: '📤', color: 'cyan' },
  ]

  const statsCards = [
    { title: 'Productos', value: stats.totalProducts, icon: '📦', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Tiendas', value: stats.totalStores, icon: '🏪', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { title: 'Categorías', value: stats.totalCategories, icon: '🏷️', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Marcas', value: stats.totalBrands, icon: '🏆', color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-50' },
  ]

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Modern Header */}
      <header className="bg-white border-b border-gray-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Sistema de Inventarios</h1>
                <p className="text-sm text-gray-500">Panel de control empresarial</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.username?.[0]?.toUpperCase()}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.firstName || user?.username}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className={`rounded-xl border-l-4 p-4 shadow-sm ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-400' 
              : notification.type === 'error'
              ? 'bg-red-50 border-red-400'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : notification.type === 'error' ? (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm ${
                  notification.type === 'success' 
                    ? 'text-green-800' 
                    : notification.type === 'error'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}>
                  {notification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200/60 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-3 rounded-xl ${card.bgColor}`}>
                        <span className="text-2xl">{card.icon}</span>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-600">{card.title}</p>
                        {statsLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                            <p className="text-sm text-gray-500">Cargando...</p>
                          </div>
                        ) : (
                          <p className="text-2xl font-semibold text-gray-900">{card.value.toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Quick Actions */}
            <div className="bg-white shadow-sm rounded-2xl border border-gray-200/60">
              <div className="p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Acciones Rápidas</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Ver Productos', icon: '📦', action: () => setActiveTab('products') },
                    { label: 'Control Stock', icon: '📈', action: () => setActiveTab('stock') },
                    { label: 'Reportes', icon: '📋', action: () => setActiveTab('reports') },
                    { label: 'Configuración', icon: '⚙️', action: () => showNotification('info', 'Función en desarrollo') },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="flex items-center justify-center space-x-3 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-colors group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-8">
            {/* Import Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* File Upload */}
              <div className="bg-white shadow-sm rounded-2xl border border-gray-200/60">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Importar Datos</h3>
                      <p className="text-sm text-gray-500">Sube archivos Excel para procesar</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FileUpload
                      type="products"
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                    <FileUpload
                      type="stock"
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                    <FileUpload
                      type="sales"
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                  </div>
                </div>
              </div>

              {/* Job Status */}
              <div className="bg-white shadow-sm rounded-2xl border border-gray-200/60">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Estado de Procesos</h3>
                      <p className="text-sm text-gray-500">Monitoreo en tiempo real</p>
                    </div>
                  </div>
                  
                  {currentJobId ? (
                    <JobStatus jobId={currentJobId} onJobCompleted={handleJobCompleted} />
                  ) : (
                    <JobStatus showUserJobs={true} onJobCompleted={handleJobCompleted} />
                  )}
                </div>
              </div>
            </div>

            {/* Import History Table */}
            <ImportHistory />
          </div>
        )}

        {/* Other tabs content with modern design */}
        {activeTab !== 'overview' && activeTab !== 'import' && (
          <div className="bg-white shadow-sm rounded-2xl border border-gray-200/60">
            <div className="p-8">
              <div className="text-center py-12">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                  <span className="text-3xl">
                    {navigationTabs.find(tab => tab.id === activeTab)?.icon}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {navigationTabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Esta sección está en desarrollo. Próximamente tendrás acceso completo a todas las funcionalidades de gestión.
                </p>
                <div className="inline-flex items-center px-6 py-3 border border-blue-300 rounded-xl text-blue-700 bg-blue-50">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Funcionalidad próximamente disponible
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                🚀 Tecnología: <span className="font-medium">ClosedXML (.NET)</span> + React + PostgreSQL
              </div>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 Sistema de Inventarios - v2.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}