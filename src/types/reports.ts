// Report Filters
export interface ReportFilters {
  startDate?: string
  endDate?: string
  storeCode?: string
  categoryId?: number
  brandId?: number
  customerId?: number
  employeeId?: number
  productCode?: string
  includeInactive?: boolean
  daysThreshold?: number
  minimumAmount?: number
  maximumAmount?: number
}

// Inventory Reports
export interface InventoryReportItem {
  productId: number
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  storeCode: string
  storeName: string
  currentStock: number
  minimumStock: number
  purchasePrice: number
  salePrice: number
  totalValue: number
  isLowStock: boolean
  isOutOfStock: boolean
  lastMovementDate?: string
  daysWithoutMovement?: number
}

export interface StockCriticalReport {
  lowStockItems: InventoryReportItem[]
  outOfStockItems: InventoryReportItem[]
  totalLowStockValue: number
  totalLowStockItems: number
  totalOutOfStockItems: number
}

export interface InventoryValuationReport {
  categoryName: string
  brandName: string
  storeName: string
  totalUnits: number
  totalPurchaseValue: number
  totalSaleValue: number
  potentialProfit: number
  productCount: number
}

export interface ProductMovementReport {
  productId: number
  productCode: string
  productName: string
  movementType: string
  quantity: number
  previousStock: number
  newStock: number
  movementDate: string
  storeName: string
  reason: string
}

// Sales Reports
export interface SaleReportItem {
  saleId: number
  saleNumber: string
  saleDate: string
  customerName: string
  storeName: string
  employeeName: string
  totalAmount: number
  totalCost: number
  profit: number
  profitMargin: number
  itemsCount: number
  details: SaleDetailReportItem[]
}

export interface SaleDetailReportItem {
  productCode: string
  productName: string
  categoryName: string
  quantity: number
  unitPrice: number
  unitCost: number
  totalAmount: number
  totalCost: number
  profit: number
  profitMargin: number
}

export interface DailySales {
  date: string
  totalSales: number
  totalProfit: number
  transactionCount: number
}

export interface TopProduct {
  productCode: string
  productName: string
  quantitySold: number
  totalRevenue: number
  totalProfit: number
  transactionCount: number
}

export interface CategorySales {
  categoryName: string
  totalSales: number
  totalProfit: number
  quantitySold: number
  productCount: number
}

export interface SalesPeriodReport {
  startDate: string
  endDate: string
  totalSales: number
  totalCost: number
  totalProfit: number
  averageTicket: number
  totalTransactions: number
  totalItems: number
  dailySales: DailySales[]
  topProducts: TopProduct[]
  salesByCategory: CategorySales[]
}

export interface CustomerAnalysis {
  customerId: number
  customerName: string
  email: string
  totalPurchases: number
  transactionCount: number
  averageTicket: number
  firstPurchase: string
  lastPurchase: string
  daysSinceLastPurchase: number
}

// Store Performance Reports
export interface StorePerformance {
  storeCode: string
  storeName: string
  totalSales: number
  totalCost: number
  totalProfit: number
  profitMargin: number
  transactionCount: number
  averageTicket: number
  productCount: number
  inventoryValue: number
  employeeCount: number
  salesPerEmployee: number
}

// Export Options
export interface ReportExportOptions {
  format: 'PDF' | 'Excel' | 'CSV'
  includeCharts: boolean
  includeDetails: boolean
  template?: string
  companyInfo?: string
  reportTitle?: string
}

// Report Metadata
export interface ReportMetadata {
  reportName: string
  generatedDate: string
  generatedBy: string
  filters: ReportFilters
  totalRecords: number
  processingTime: string
}