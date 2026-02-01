// API Request/Response Types
import type { CVAnalysisResult, ConversionResult, ExportFormat, ExportOptions } from './cv'
import type { UserSubscription, PlanDetails, Invoice, PaymentMethod } from './user'

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ApiMeta
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  stack?: string // Only in development
}

export interface ApiMeta {
  requestId: string
  timestamp: string
  processingTime?: number
  rateLimit?: RateLimitInfo
}

export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: Date
}

// Conversion API
export interface ConvertRequest {
  file: File
  targetSector?: string
  targetJobTitle?: string
  targetATS?: string[]
  options?: ConversionOptions
}

export interface ConversionOptions {
  includeDetailedAnalysis?: boolean
  generateOptimizedPDF?: boolean
  preserveFormatting?: boolean
  language?: string
}

export interface ConvertResponse {
  conversionId: string
  analysisResult: CVAnalysisResult
  originalUrl: string
  optimizedUrl: string
  processingTime: number
  tokensUsed?: number
}

// Analysis API
export interface AnalyzeRequest {
  text: string
  targetSector?: string
  targetJobTitle?: string
  includeKeywords?: boolean
}

export interface AnalyzeResponse {
  analysisResult: CVAnalysisResult
  processingTime: number
}

// Suggestions API
export interface SuggestRequest {
  cvData: string
  jobDescription?: string
  targetSector?: string
}

export interface SuggestResponse {
  suggestions: CVSuggestion[]
  matchScore?: number
  missingKeywords?: string[]
}

export interface CVSuggestion {
  id: string
  section: string
  type: 'add' | 'remove' | 'modify' | 'reorder'
  priority: 'high' | 'medium' | 'low'
  original?: string
  suggested: string
  reason: string
  impact: string
}

// Export API
export interface ExportRequest {
  conversionId: string
  options: ExportOptions
}

export interface ExportResponse {
  downloadUrl: string
  format: ExportFormat
  fileSize: number
  expiresAt: Date
}

// Checkout API
export interface CreateCheckoutRequest {
  priceId: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutResponse {
  sessionId: string
  url: string
}

// Subscription API
export interface SubscriptionResponse {
  subscription: UserSubscription
  usage: {
    conversionsUsed: number
    conversionsLimit: number
    percentageUsed: number
  }
}

export interface UpdateSubscriptionRequest {
  priceId: string
}

export interface CancelSubscriptionRequest {
  immediately?: boolean
  reason?: string
}

// Billing API
export interface BillingPortalResponse {
  url: string
}

export interface InvoicesResponse {
  invoices: Invoice[]
  hasMore: boolean
  cursor?: string
}

export interface PaymentMethodsResponse {
  paymentMethods: PaymentMethod[]
  defaultPaymentMethodId?: string
}

// Webhook Types
export interface StripeWebhookEvent {
  id: string
  type: string
  data: {
    object: Record<string, unknown>
  }
  created: number
}

// User API
export interface UpdateUserRequest {
  displayName?: string
  settings?: Partial<import('./user').UserSettings>
}

export interface UserResponse {
  user: import('./user').User
  subscription: UserSubscription
}

// Conversion History API
export interface ConversionHistoryRequest {
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'score'
  sortOrder?: 'asc' | 'desc'
}

export interface ConversionHistoryResponse {
  conversions: ConversionResult[]
  pagination: PaginationInfo
}

// Conversion Document (stored in Firestore)
export interface ConversionDocument {
  id: string
  userId: string
  fileName?: string
  originalPdfUrl?: string
  optimizedPdfUrl?: string
  score?: number
  breakdown?: {
    formatting?: number
    keywords?: number
    structure?: number
    readability?: number
  }
  targetSector?: string
  targetJobTitle?: string
  recommendations?: string[]
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Plans API
export interface PlansResponse {
  plans: PlanDetails[]
}

// Health Check
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  timestamp: string
  services: {
    database: ServiceStatus
    storage: ServiceStatus
    ai: ServiceStatus
    payments: ServiceStatus
  }
}

export interface ServiceStatus {
  status: 'up' | 'down' | 'degraded'
  latency?: number
  message?: string
}

// Streaming Types
export interface StreamEvent {
  event: 'start' | 'progress' | 'text' | 'analysis' | 'complete' | 'error'
  data: StreamEventData
}

export type StreamEventData =
  | { type: 'start'; message: string }
  | { type: 'progress'; step: string; progress: number; message: string }
  | { type: 'text'; content: string }
  | { type: 'analysis'; result: Partial<CVAnalysisResult> }
  | { type: 'complete'; result: ConvertResponse }
  | { type: 'error'; error: ApiError }

// File Upload
export interface FileUploadConfig {
  maxSize: number
  allowedTypes: string[]
  maxFiles: number
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
}

// Rate Limiting
export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  message: string
}

// Error Codes
export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',

  // Subscription
  SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',
  LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  // Processing
  CONVERSION_FAILED = 'CONVERSION_FAILED',
  PDF_PARSE_ERROR = 'PDF_PARSE_ERROR',
  AI_ERROR = 'AI_ERROR',
  EXPORT_FAILED = 'EXPORT_FAILED',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMITED = 'RATE_LIMITED',

  // Not Found
  NOT_FOUND = 'NOT_FOUND',
  CONVERSION_NOT_FOUND = 'CONVERSION_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}
