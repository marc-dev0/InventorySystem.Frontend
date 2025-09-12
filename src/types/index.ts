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