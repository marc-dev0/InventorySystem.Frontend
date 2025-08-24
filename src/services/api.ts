import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5194/api'

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

export default api