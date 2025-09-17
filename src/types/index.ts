export interface User {
  id: string
  username: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role?: string
}

export interface AuthResponse {
  token: string
  username: string
  email: string
  role: string
  firstName: string
  lastName: string
  expiresAt: string
}

export interface BackgroundJob {
  jobId: string
  jobType: string
  status: string
  fileName?: string
  storeCode?: string
  totalRecords: number
  processedRecords: number
  successRecords: number
  errorRecords: number
  warningRecords: number
  progressPercentage: number
  startedAt: string
  completedAt?: string
  startedBy: string
  errorMessage?: string
  detailedErrors?: string[]
  detailedWarnings?: string[]
}

export interface Store {
  id: number
  code: string
  name: string
  address?: string
  phone?: string
  hasInitialStock?: boolean
}

export interface Sale {
  id: number
  saleNumber: string
  saleDate: string
  customerName?: string
  storeName: string
  storeCode: string
  subTotal: number
  taxes: number
  total: number
  itemCount: number
  importSource?: string
}

export interface SaleDetail {
  id: number
  productId: number
  productName: string
  productCode: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface SaleDetailsResponse extends Sale {
  details: SaleDetail[]
}

export interface Product {
  id: number
  code: string
  name: string
  categoryName?: string
  brandName?: string
  purchasePrice: number
  salePrice: number
  stock: number // Original stock from Products table
  currentStock: number // Real-time stock from ProductStocks
  minimumStock: number
  active: boolean
}

export interface InventoryItem {
  id: number
  productCode: string
  productName: string
  storeName: string
  storeCode: string
  currentStock: number
  minimumStock: number
  maximumStock: number
  averageCost: number
  totalValue: number
  isLowStock: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  stats?: {
    TotalProducts?: number
    ActiveProducts?: number
    LowStockProducts?: number
    OutOfStockProducts?: number
    TotalValue?: number
    totalProducts?: number
    activeProducts?: number
    lowStockProducts?: number
    outOfStockProducts?: number
    totalValue?: number
  }
}