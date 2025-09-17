import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5195/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url)
  console.log('API Base URL:', config.baseURL)
  
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('API Request: Using auth token')
  } else {
    console.log('API Request: No auth token')
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    console.log('API Response data length:', response.data?.length || 'N/A')
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url)
    console.error('API Error details:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.reload()
      }
    }
    return Promise.reject(error)
  }
)

// Dashboard services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  }
}

// Import history services
export const importHistoryService = {
  getHistory: async (page = 1, pageSize = 10, jobType = '', status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })
    
    if (jobType) params.append('jobType', jobType)
    if (status) params.append('status', status)
    
    const response = await api.get(`/backgroundjobs/history?${params}`)
    return response.data
  }
}

// Stores service
export const storesService = {
  getAll: async () => {
    const response = await api.get('/stores')
    return response.data
  }
}

// Sales service
export const salesService = {
  getAll: async (page = 1, pageSize = 20, search = '', storeCode = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) params.append('search', search)
    if (storeCode) params.append('storeCode', storeCode)

    const response = await api.get(`/sales?${params}`)
    return response.data
  },

  getDetails: async (saleId: number) => {
    const response = await api.get(`/sales/${saleId}/details`)
    return response.data
  }
}

// Products service
export const productsService = {
  getAll: async (page = 1, pageSize = 20, search = '', categoryId = '', lowStock = false, status = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId)
    if (lowStock) params.append('lowStock', 'true')
    if (status) params.append('status', status)

    const response = await api.get(`/products?${params}`)
    return response.data
  },

  getStats: async (search = '', categoryId = '') => {
    const params = new URLSearchParams({
      page: '1',
      pageSize: '1', // We only need stats, not actual products
    })

    if (search) params.append('search', search)
    if (categoryId) params.append('categoryId', categoryId)

    const response = await api.get(`/products?${params}`)
    return response.data.Stats // Note: uppercase 'S' to match backend response
  }
}

// Inventory service  
export const inventoryService = {
  getAll: async (page = 1, pageSize = 20, search = '', storeCode = '', lowStock = false) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    })

    if (search) params.append('search', search)
    if (storeCode) params.append('storeCode', storeCode)
    if (lowStock) params.append('lowStock', 'true')

    const response = await api.get(`/inventory?${params}`)
    return response.data
  }
}

// Reports service
export const reportsService = {
  async getStockCriticalReport(filters: any) {
    const response = await api.post('/reports/stock-critical', filters)
    return response.data
  },

  async getInventoryValuationReport(filters: any) {
    const response = await api.post('/reports/inventory-valuation', filters)
    return response.data
  },

  async getSalesPeriodReport(filters: any) {
    const response = await api.post('/reports/sales-period', filters)
    return response.data
  },

  async getProductMovementReport(filters: any) {
    const response = await api.post('/reports/product-movements', filters)
    return response.data
  },

  async getProductsWithoutMovementReport(filters: any) {
    const response = await api.post('/reports/products-without-movement', filters)
    return response.data
  },

  async getTopProductsReport(filters: any, topCount: number = 10) {
    const response = await api.post(`/reports/top-products?topCount=${topCount}`, filters)
    return response.data
  },

  async getSalesByCategoryReport(filters: any) {
    const response = await api.post('/reports/sales-by-category', filters)
    return response.data
  },

  async getCustomerAnalysisReport(filters: any) {
    const response = await api.post('/reports/customer-analysis', filters)
    return response.data
  },

  async getStorePerformanceReport(filters: any) {
    const response = await api.post('/reports/store-performance', filters)
    return response.data
  },

  async exportReport(reportType: string, filters: any, exportOptions: any) {
    const response = await api.post(`/reports/export/${reportType}`, filters, {
      params: exportOptions,
      responseType: 'blob'
    })
    return response.data
  }
}

export default api