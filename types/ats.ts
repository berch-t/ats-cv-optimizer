// ATS (Applicant Tracking System) Types

export interface ATSStandard {
  id: string
  name: string
  vendor: string
  marketShare: number
  strictness: 'low' | 'medium' | 'high'
  preferences: ATSPreferences
  commonIn: string[]
  parsingCapabilities: ATSParsingCapabilities
  tips: string[]
}

export interface ATSPreferences {
  dateFormat: string
  sectionHeaders: string[]
  avoidElements: string[]
  maxFileSize: number // in bytes
  supportedFonts: string[]
  preferredFileTypes: string[]
  maxPages?: number
}

export interface ATSParsingCapabilities {
  parsesTables: boolean
  parsesColumns: boolean
  parsesImages: boolean
  parsesHeaders: boolean
  parsesFooters: boolean
  parsesLinks: boolean
  parsesCustomFonts: boolean
}

export interface ATSScoreWeights {
  formatting: number
  keywords: number
  structure: number
  readability: number
}

export interface ATSScoreBreakdown {
  formatting: ATSCategoryScore
  keywords: ATSCategoryScore
  structure: ATSCategoryScore
  readability: ATSCategoryScore
}

export interface ATSCategoryScore {
  score: number
  maxScore: number
  percentage: number
  issues: string[]
  improvements: string[]
}

export interface ATSAnalysisConfig {
  targetATS?: string[] // Specific ATS systems to optimize for
  targetSector?: string
  targetJobTitle?: string
  strictMode?: boolean
  includeKeywordSuggestions?: boolean
}

// Industry Keywords
export interface IndustryKeywords {
  sector: string
  categories: KeywordCategory[]
  commonTools: string[]
  softSkills: string[]
  certifications: string[]
}

export interface KeywordCategory {
  name: string
  keywords: KeywordEntry[]
}

export interface KeywordEntry {
  term: string
  variants: string[]
  importance: 'required' | 'preferred' | 'nice-to-have'
  context?: string
}

// Job Board Mapping
export interface JobBoardATSMapping {
  jobBoard: string
  commonATS: string[]
  recommendedFormat: string
  tips: string[]
}

// Formatting Check Results
export interface FormattingCheckResult {
  hasTables: boolean
  hasMultipleColumns: boolean
  hasImages: boolean
  hasHeadersFooters: boolean
  hasTextBoxes: boolean
  hasUnusualFonts: boolean
  fonts: string[]
  fontSize: {
    min: number
    max: number
    average: number
  }
  margins: {
    top: number
    bottom: number
    left: number
    right: number
  }
  pageCount: number
  fileSize: number
}

// Section Detection
export interface DetectedSection {
  name: string
  normalizedName: string
  startLine: number
  endLine: number
  content: string
  isStandard: boolean
  suggestedName?: string
}

// Date Format Detection
export interface DateFormatAnalysis {
  detectedFormats: string[]
  isConsistent: boolean
  recommendedFormat: string
  issues: DateFormatIssue[]
}

export interface DateFormatIssue {
  original: string
  line: number
  suggestion: string
  reason: string
}

// Keyword Analysis
export interface KeywordAnalysis {
  totalKeywords: number
  uniqueKeywords: number
  sectorKeywords: KeywordMatch[]
  missingKeywords: string[]
  overusedKeywords: KeywordUsage[]
  density: number
}

export interface KeywordMatch {
  keyword: string
  count: number
  locations: string[]
  relevance: number
}

export interface KeywordUsage {
  keyword: string
  count: number
  recommendation: string
}

// ATS Compatibility Matrix
export interface ATSCompatibilityMatrix {
  [atsName: string]: {
    score: number
    compatible: boolean
    issues: string[]
    optimizations: string[]
  }
}

// Optimization Suggestions
export interface ATSOptimization {
  id: string
  type: 'formatting' | 'content' | 'structure' | 'keywords'
  priority: number
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  effort: 'easy' | 'medium' | 'hard'
  before?: string
  after?: string
  autoFixable: boolean
}
