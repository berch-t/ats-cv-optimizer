// CV Data Types
export interface CVPersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  linkedIn?: string
  portfolio?: string
  photoUrl?: string
}

export interface CVExperience {
  id: string
  jobTitle: string
  company: string
  location?: string | null
  startDate?: string | null // Format: MM/YYYY
  endDate?: string | null // null if current position
  isCurrent: boolean
  description: string[]
  achievements?: string[]
  keywords?: string[]
}

export interface CVEducation {
  id: string
  degree: string
  institution: string
  location?: string | null
  graduationDate?: string | null // Format: MM/YYYY
  gpa?: string | null
  honors?: string[]
  relevantCourses?: string[]
}

export interface CVLanguage {
  name: string
  proficiency: string // Flexible to accept any language proficiency format (EN/FR/other)
}

export interface CVSkills {
  technical: string[]
  soft: string[]
  languages: CVLanguage[]
  certifications?: string[]
  tools?: string[]
}

export interface CVProject {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface CVVolunteer {
  id: string
  organization: string
  role: string
  description: string
  startDate: string
  endDate?: string
}

export interface CVData {
  personalInfo: CVPersonalInfo
  professionalSummary?: string
  experience: CVExperience[]
  education: CVEducation[]
  skills: CVSkills
  projects?: CVProject[]
  volunteer?: CVVolunteer[]
  awards?: string[]
  publications?: string[]
  interests?: string[]
}

// Conversion related types
export interface ConversionResult {
  id: string
  userId: string
  originalUrl: string
  optimizedUrl: string
  originalFileName: string
  originalFileSize: number
  analysisResult: CVAnalysisResult
  targetSector?: string
  targetJobTitle?: string
  createdAt: Date
  processingTime: number // in milliseconds
}

export interface CVAnalysisResult {
  cvData: CVData
  atsCompatibility: ATSCompatibilityResult
  recommendations: CVRecommendation[]
  optimizedKeywords: OptimizedKeyword[]
  detectedSector?: string
  originalScore: number
  optimizedScore: number
}

export interface ATSCompatibilityResult {
  overall: number
  breakdown: {
    formatting: number
    keywords: number
    structure: number
    readability: number
  }
  detectedIssues: ATSIssue[]
  supportedATS: string[]
  improvements: string[]
  foundKeywords?: string[]
  missingKeywords?: string[]
}

export interface ATSIssue {
  id: string
  severity: 'critical' | 'warning' | 'info'
  category: 'formatting' | 'structure' | 'keywords' | 'dates' | 'sections' | 'readability'
  message: string
  suggestion?: string
  lineReference?: number
}

export interface CVRecommendation {
  id: string
  category: string
  priority: 'high' | 'medium' | 'low'
  title: string
  suggestion: string
  impact: string
  beforeExample?: string
  afterExample?: string
  isApplied?: boolean
}

export interface OptimizedKeyword {
  keyword: string
  category: string
  relevance: number
  frequency: number
  isPresent: boolean
  suggestedUsage?: string
}

// Chat/Streaming types
export interface ConversionMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  type: 'text' | 'file' | 'analysis' | 'progress' | 'result' | 'error'
  metadata?: {
    fileName?: string
    fileSize?: number
    progress?: number
    step?: string
    analysisResult?: CVAnalysisResult
  }
}

export interface ConversionProgress {
  step: ConversionStep
  progress: number
  message: string
  startedAt: Date
  estimatedCompletion?: Date
}

export type ConversionStep =
  | 'uploading'
  | 'extracting'
  | 'analyzing'
  | 'scoring'
  | 'optimizing'
  | 'generating'
  | 'complete'
  | 'error'

export interface StreamChunk {
  type: 'text' | 'progress' | 'analysis' | 'complete' | 'error'
  content?: string
  progress?: ConversionProgress
  result?: CVAnalysisResult
  error?: string
}

// Export types
export type ExportFormat = 'pdf' | 'docx' | 'json' | 'txt'

export interface ExportOptions {
  format: ExportFormat
  includeAnalysis: boolean
  template?: string
  customization?: {
    primaryColor?: string
    fontFamily?: string
    fontSize?: number
  }
}
