import api from './api'
import type { BackgroundJob } from '../types'

export const importService = {
  async uploadProducts(file: File): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/backgroundjobs/products/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadStock(file: File, storeCode: string): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('storeCode', storeCode)
    
    const response = await api.post('/backgroundjobs/stock/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadSales(file: File, storeCode: string): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('storeCode', storeCode)

    const response = await api.post('/backgroundjobs/sales/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadCreditNotes(file: File, storeCode: string): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('storeCode', storeCode)

    const response = await api.post('/backgroundjobs/credit-notes/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadPurchases(file: File, storeCode: string): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('storeCode', storeCode)

    const response = await api.post('/backgroundjobs/purchases/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async uploadTransfers(file: File, originStoreCode: string, destinationStoreCode: string): Promise<{ jobId: string }> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('originStoreCode', originStoreCode)
    formData.append('destinationStoreCode', destinationStoreCode)

    const response = await api.post('/backgroundjobs/transfers/queue', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async getJobStatus(jobId: string): Promise<BackgroundJob> {
    const response = await api.get(`/backgroundjobs/${jobId}/status`)
    return response.data
  },

  async getUserJobs(): Promise<BackgroundJob[]> {
    const response = await api.get('/backgroundjobs/my-jobs')
    return response.data
  },

  async getRecentJobs(): Promise<BackgroundJob[]> {
    const response = await api.get('/backgroundjobs/recent')
    return response.data
  }
}