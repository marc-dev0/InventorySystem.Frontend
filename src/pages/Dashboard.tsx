import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { FileUpload, FileUploadRef } from '../components/FileUpload'
import { JobStatus } from '../components/JobStatus'
import { ImportHistory } from '../components/ImportHistory'
import InitialSetupSection from '../components/InitialSetupSection'
import { SalesPage } from './SalesPage'
import { ProductsPage } from './ProductsPage'
import { InventoryPage } from './InventoryPage'
import { ReportsPage } from './ReportsPage'
import { dashboardService, storesService } from '../services/api'
import type { Store } from '../types'

interface DashboardStats {
  totalProducts: number
  totalStores: number
  totalCategories: number
  totalCustomers: number
  totalBrands: number
}

interface SystemHealth {
  api: 'checking' | 'healthy' | 'error'
  database: 'checking' | 'healthy' | 'error'
  lastCheck: string | null
  apiResponse?: any
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
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    api: 'checking',
    database: 'checking',
    lastCheck: null
  })
  
  // Global stores state - shared by all FileUpload components
  const [stores, setStores] = useState<Store[]>([])
  const [loadingStores, setLoadingStores] = useState(false)
  
  // Refs to access FileUpload components (keeping for compatibility)
  const salesFileUploadRef = useRef<FileUploadRef>(null)
  const productsFileUploadRef = useRef<FileUploadRef>(null)
  const stockFileUploadRef = useRef<FileUploadRef>(null)

  // New import types states
  const [originStoreCode, setOriginStoreCode] = useState('')
  const [destinationStoreCode, setDestinationStoreCode] = useState('')

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

    const checkSystemHealth = async () => {
      try {
        setSystemHealth(prev => ({
          ...prev,
          api: 'checking',
          database: 'checking'
        }))

        const response = await fetch('/api/test/health')
        if (response.ok) {
          const data = await response.json()
          setSystemHealth({
            api: data.checks.api === 'healthy' ? 'healthy' : 'error',
            database: data.checks.database === 'healthy' ? 'healthy' : 'error',
            lastCheck: new Date().toLocaleString('es-PE'),
            apiResponse: data
          })
        } else {
          throw new Error('API response not ok')
        }
      } catch (error) {
        console.error('Health check failed:', error)
        setSystemHealth({
          api: 'error',
          database: 'error',
          lastCheck: new Date().toLocaleString('es-PE')
        })
      }
    }

    loadStats()
    checkSystemHealth() // Solo en carga inicial

    // Auto-refresh solo stats cada 10 segundos (NO health check)
    const statsInterval = setInterval(loadStats, 10000)
    return () => clearInterval(statsInterval)
  }, [])

  // Load stores on component mount
  useEffect(() => {
    loadStores()
  }, [])

  const loadStores = async () => {
    try {
      setLoadingStores(true)
      const storesData = await storesService.getAll()
      console.log(`✅ Dashboard loaded ${storesData.length} stores:`, storesData.map((s: Store) => `${s.code}-${s.name}`))
      setStores(storesData)
    } catch (error) {
      console.error('❌ Error loading stores in Dashboard:', error)
      showNotification('error', 'Error al cargar las tiendas')
    } finally {
      setLoadingStores(false)
    }
  }

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const checkSystemHealthManually = async () => {
    try {
      setSystemHealth(prev => ({
        ...prev,
        api: 'checking',
        database: 'checking'
      }))

      const response = await fetch('/api/test/health')
      if (response.ok) {
        const data = await response.json()
        setSystemHealth({
          api: data.checks.api === 'healthy' ? 'healthy' : 'error',
          database: data.checks.database === 'healthy' ? 'healthy' : 'error',
          lastCheck: new Date().toLocaleString('es-PE'),
          apiResponse: data
        })
        showNotification('success', 'Verificación del sistema completada')
      } else {
        throw new Error('API response not ok')
      }
    } catch (error) {
      console.error('Manual health check failed:', error)
      setSystemHealth({
        api: 'error',
        database: 'error',
        lastCheck: new Date().toLocaleString('es-PE')
      })
      showNotification('error', 'Error en la verificación del sistema')
    }
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

  // Debug function to test store refresh manually
  const testStoreRefresh = async () => {
    console.log('🧪 Testing manual store refresh...')
    await loadStores()
    console.log('✅ Manual refresh completed - all components updated automatically!')
  }

  const handleUploadSuccess = (jobId: string) => {
    setCurrentJobId(jobId)
    showNotification('success', 'Archivo subido exitosamente. Procesando datos...')
  }

  const handleJobCompleted = async (jobType?: string) => {
    console.log('🔄 Job completed with type:', jobType)
    showNotification('success', 'Importación completada exitosamente!')
    reloadStats()
    
    // Refresh stores if it was a product import (which can create new stores)
    if (jobType === 'PRODUCTS_IMPORT') {
      console.log('🏪 Product import detected, refreshing stores automatically...')
      await loadStores() // This will automatically update all FileUpload components
      console.log('✅ Stores refreshed automatically - all combos updated!')
    }
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
    { title: 'Productos', value: stats.totalProducts, icon: '📦', color: 'from-green-600 to-green-700', bgColor: 'bg-green-50' },
    { title: 'Tiendas', value: stats.totalStores, icon: '🏪', color: 'from-green-700 to-green-800', bgColor: 'bg-green-100' },
    { title: 'Categorías', value: stats.totalCategories, icon: '🏷️', color: 'from-slate-600 to-slate-700', bgColor: 'bg-slate-50' },
    { title: 'Marcas', value: stats.totalBrands, icon: '🏆', color: 'from-slate-700 to-slate-800', bgColor: 'bg-slate-100' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Professional Header */}
      <header className="header-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 flex items-center justify-center bg-green-700 rounded-xl shadow-sm">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Sistema de Inventarios</h1>
                <p className="text-sm text-green-100">Panel de control empresarial</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-700 border-2 border-green-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{user?.username?.[0]?.toUpperCase()}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.firstName || user?.username}</p>
                  <p className="text-xs text-green-100">Administrador</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-green-600 shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
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
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-green-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Business Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Business Metrics */}
              <div className="card-professional">
                <div className="p-6 border-b border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Métricas del Negocio</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Total Productos</p>
                          <p className="text-2xl font-bold text-green-700">{stats.totalProducts.toLocaleString()}</p>
                        </div>
                        <span className="text-2xl">📦</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Tiendas Activas</p>
                          <p className="text-2xl font-bold text-blue-700">{stats.totalStores.toLocaleString()}</p>
                        </div>
                        <span className="text-2xl">🏪</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>🏷️ {stats.totalCategories} Categorías</span>
                      <span>🏆 {stats.totalBrands} Marcas</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Health */}
              <div className="card-professional">
                <div className="p-6 border-b border-green-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">🔧 Estado del Sistema</h3>
                    <button
                      onClick={checkSystemHealthManually}
                      disabled={systemHealth.api === 'checking' || systemHealth.database === 'checking'}
                      className="btn-outline-secondary px-3 py-1 text-xs disabled:opacity-50"
                      title="Verificar sistema manualmente"
                    >
                      {systemHealth.api === 'checking' || systemHealth.database === 'checking' ? '⟳' : '🔄'} Verificar
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    systemHealth.database === 'healthy'
                      ? 'bg-green-50 border-green-100'
                      : systemHealth.database === 'error'
                      ? 'bg-red-50 border-red-100'
                      : 'bg-yellow-50 border-yellow-100'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        systemHealth.database === 'healthy'
                          ? 'bg-green-500 animate-pulse'
                          : systemHealth.database === 'error'
                          ? 'bg-red-500'
                          : 'bg-yellow-500 animate-spin'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        systemHealth.database === 'healthy'
                          ? 'text-green-800'
                          : systemHealth.database === 'error'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}>Base de Datos</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      systemHealth.database === 'healthy'
                        ? 'text-green-600 bg-green-100'
                        : systemHealth.database === 'error'
                        ? 'text-red-600 bg-red-100'
                        : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {systemHealth.database === 'healthy'
                        ? 'Activa'
                        : systemHealth.database === 'error'
                        ? 'Error'
                        : 'Verificando...'}
                    </span>
                  </div>

                  <div className={`flex items-center justify-between p-3 rounded-lg border ${
                    systemHealth.api === 'healthy'
                      ? 'bg-blue-50 border-blue-100'
                      : systemHealth.api === 'error'
                      ? 'bg-red-50 border-red-100'
                      : 'bg-yellow-50 border-yellow-100'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        systemHealth.api === 'healthy'
                          ? 'bg-blue-500 animate-pulse'
                          : systemHealth.api === 'error'
                          ? 'bg-red-500'
                          : 'bg-yellow-500 animate-spin'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        systemHealth.api === 'healthy'
                          ? 'text-blue-800'
                          : systemHealth.api === 'error'
                          ? 'text-red-800'
                          : 'text-yellow-800'
                      }`}>API Backend</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      systemHealth.api === 'healthy'
                        ? 'text-blue-600 bg-blue-100'
                        : systemHealth.api === 'error'
                        ? 'text-red-600 bg-red-100'
                        : 'text-yellow-600 bg-yellow-100'
                    }`}>
                      {systemHealth.api === 'healthy'
                        ? 'Operativo'
                        : systemHealth.api === 'error'
                        ? 'Error'
                        : 'Verificando...'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      {systemHealth.lastCheck
                        ? `Última verificación: ${systemHealth.lastCheck}`
                        : 'Verificando por primera vez...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 card-professional">
                <div className="p-6 border-b border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex-shrink-0 h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">💰</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Ventas - Importación diaria</p>
                        <p className="text-xs text-gray-500">Proceso más utilizado del sistema</p>
                        <button
                          onClick={() => setActiveTab('import')}
                          className="mt-2 text-xs text-orange-600 hover:text-orange-800 font-medium"
                        >
                          Ir a importar ventas →
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex-shrink-0 h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Reportes Empresariales</p>
                        <p className="text-xs text-gray-500">Stock crítico, ventas, valorización, etc.</p>
                        <button
                          onClick={() => setActiveTab('reports')}
                          className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Ver reportes disponibles →
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📦</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Control de Inventario</p>
                        <p className="text-xs text-gray-500">Gestión de stock por tienda</p>
                        <button
                          onClick={() => setActiveTab('stock')}
                          className="mt-2 text-xs text-green-600 hover:text-green-800 font-medium"
                        >
                          Gestionar inventario →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-professional">
                <div className="p-6 border-b border-green-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 Acciones Rápidas</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {[
                      { label: 'Ver Productos', icon: '📦', action: () => setActiveTab('products'), color: 'green' },
                      { label: 'Control Stock', icon: '📈', action: () => setActiveTab('stock'), color: 'purple' },
                      { label: 'Generar Reportes', icon: '📋', action: () => setActiveTab('reports'), color: 'indigo' },
                      { label: 'Importar Ventas', icon: '💰', action: () => setActiveTab('import'), color: 'orange' },
                    ].map((item, index) => (
                      <button
                        key={index}
                        onClick={item.action}
                        className={`w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-${item.color}-50 hover:border-${item.color}-300 transition-colors group text-left`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="font-medium text-gray-700 group-hover:text-gray-900 text-sm">{item.label}</span>
                        <span className="ml-auto text-gray-400 group-hover:text-gray-600">→</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-8">
            {/* Primary: Sales Import - Most Frequently Used */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Carga de Ventas</h2>
                    <p className="text-orange-100">Importación diaria desde Tandia - Uso frecuente</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6">
                  <FileUpload
                    ref={salesFileUploadRef}
                    type="sales"
                    stores={stores}
                    loadingStores={loadingStores}
                    onRefreshStores={loadStores}
                    onSuccess={handleUploadSuccess}
                    onError={handleUploadError}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Job Status */}
              <div className="card-professional">
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

              {/* Secondary: Initial Setup - Rarely Used */}
              <InitialSetupSection
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                productsRef={productsFileUploadRef}
                stockRef={stockFileUploadRef}
                stores={stores}
                loadingStores={loadingStores}
                onRefreshStores={loadStores}
              />
            </div>

            {/* New Tandia Import Types */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Credit Notes Import */}
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl">🧾</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Notas de Crédito</h3>
                      <p className="text-yellow-100 text-sm">Devoluciones y cancelaciones</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <FileUpload
                      type="credit-notes"
                      stores={stores}
                      loadingStores={loadingStores}
                      onRefreshStores={loadStores}
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                  </div>
                </div>
              </div>

              {/* Purchases Import */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl">🛒</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Compras</h3>
                      <p className="text-green-100 text-sm">Ingreso de mercadería</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <FileUpload
                      type="purchases"
                      stores={stores}
                      loadingStores={loadingStores}
                      onRefreshStores={loadStores}
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                  </div>
                </div>
              </div>

              {/* Transfers Import */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl">🔄</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Transferencias</h3>
                      <p className="text-blue-100 text-sm">Entre tiendas</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4">
                    <FileUpload
                      type="transfers"
                      stores={stores}
                      loadingStores={loadingStores}
                      onRefreshStores={loadStores}
                      originStoreCode={originStoreCode}
                      destinationStoreCode={destinationStoreCode}
                      onOriginStoreChange={setOriginStoreCode}
                      onDestinationStoreChange={setDestinationStoreCode}
                      onSuccess={handleUploadSuccess}
                      onError={handleUploadError}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Import History Table */}
            <ImportHistory />
          </div>
        )}

        {/* Sales Tab */}
        {activeTab === 'sales' && <SalesPage />}

        {/* Products Tab */}
        {activeTab === 'products' && <ProductsPage />}

        {/* Stock/Inventory Tab */}
        {activeTab === 'stock' && <InventoryPage />}

        {/* Reports Tab - Still in development */}
        {activeTab === 'reports' && (
          <ReportsPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        {/* Notification in Footer */}
        {notification && (
          <div className="border-b border-gray-200">
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${
              notification.type === 'success' 
                ? 'bg-green-50' 
                : notification.type === 'error'
                ? 'bg-red-50'
                : 'bg-green-50'
            }`}>
              <div className="flex items-start">
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
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className={`text-sm ${
                    notification.type === 'success' 
                      ? 'text-green-800' 
                      : notification.type === 'error'
                      ? 'text-red-800'
                      : 'text-green-800'
                  }`}>
                    {notification.message.split('\n').map((line, index) => (
                      <div key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-3 inline-flex text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Cerrar notificación</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              
            </div>
            <div className="text-sm text-gray-500">
              © 2025 Sistema de Inventarios - v1.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}