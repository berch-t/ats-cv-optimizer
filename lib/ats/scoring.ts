import type {
  ATSScoreWeights,
  ATSScoreBreakdown,
  ATSCategoryScore,
  FormattingCheckResult,
  ATSCompatibilityMatrix,
  ATSOptimization,
} from '@/types/ats'
import { ATS_STANDARDS, normalizeSectionHeader } from './standards'

// Default scoring weights
export const DEFAULT_WEIGHTS: ATSScoreWeights = {
  formatting: 0.4,
  keywords: 0.3,
  structure: 0.2,
  readability: 0.1,
}

// ============================================
// Main Scoring Function
// ============================================

export interface ScoringInput {
  formattingCheck: FormattingCheckResult
  detectedSections: string[]
  keywords: string[]
  targetKeywords?: string[]
  dateFormats: string[]
  textLength: number
}

export function calculateATSScore(
  input: ScoringInput,
  weights: ATSScoreWeights = DEFAULT_WEIGHTS
): {
  overall: number
  breakdown: ATSScoreBreakdown
  compatibilityMatrix: ATSCompatibilityMatrix
  optimizations: ATSOptimization[]
} {
  const formattingScore = calculateFormattingScore(input.formattingCheck)
  const keywordsScore = calculateKeywordsScore(
    input.keywords,
    input.targetKeywords
  )
  const structureScore = calculateStructureScore(
    input.detectedSections,
    input.dateFormats
  )
  const readabilityScore = calculateReadabilityScore(
    input.textLength,
    input.formattingCheck
  )

  // Calculate weighted overall score
  const overall = Math.round(
    formattingScore.percentage * weights.formatting +
      keywordsScore.percentage * weights.keywords +
      structureScore.percentage * weights.structure +
      readabilityScore.percentage * weights.readability
  )

  // Calculate compatibility with each ATS
  const compatibilityMatrix = calculateCompatibilityMatrix(input)

  // Generate optimizations
  const optimizations = generateOptimizations(
    formattingScore,
    keywordsScore,
    structureScore,
    readabilityScore
  )

  return {
    overall,
    breakdown: {
      formatting: formattingScore,
      keywords: keywordsScore,
      structure: structureScore,
      readability: readabilityScore,
    },
    compatibilityMatrix,
    optimizations,
  }
}

// ============================================
// Category Scoring Functions
// ============================================

function calculateFormattingScore(
  check: FormattingCheckResult
): ATSCategoryScore {
  let score = 100
  const issues: string[] = []
  const improvements: string[] = []

  // Penalize tables
  if (check.hasTables) {
    score -= 30
    issues.push('Tables detected - many ATS cannot parse tables correctly')
    improvements.push('Convert tables to simple bullet-point lists')
  }

  // Penalize multiple columns
  if (check.hasMultipleColumns) {
    score -= 25
    issues.push('Multiple columns detected - disrupts reading order')
    improvements.push('Use a single-column layout')
  }

  // Penalize images
  if (check.hasImages) {
    score -= 20
    issues.push('Images detected - ATS cannot read image content')
    improvements.push('Remove images or replace with text')
  }

  // Penalize headers/footers
  if (check.hasHeadersFooters) {
    score -= 15
    issues.push('Headers/footers may not be parsed correctly')
    improvements.push('Move important info to main content area')
  }

  // Penalize text boxes
  if (check.hasTextBoxes) {
    score -= 20
    issues.push('Text boxes detected - content may be skipped')
    improvements.push('Remove text boxes and use normal paragraphs')
  }

  // Font checks
  if (check.hasUnusualFonts) {
    score -= 10
    issues.push('Unusual fonts may not render correctly')
    improvements.push('Use standard fonts: Arial, Calibri, or Times New Roman')
  }

  // Font size checks
  if (check.fontSize.min < 10) {
    score -= 5
    issues.push('Font size too small (< 10pt) - hard to read')
    improvements.push('Use minimum 10pt font size')
  }

  if (check.fontSize.max > 16) {
    score -= 5
    issues.push('Excessive font size variation')
    improvements.push('Keep font sizes between 10-14pt for body text')
  }

  // Page count
  if (check.pageCount > 3) {
    score -= 10
    issues.push('CV too long - ideally 1-2 pages')
    improvements.push('Condense content to 2 pages maximum')
  }

  // File size
  if (check.fileSize > 5 * 1024 * 1024) {
    score -= 10
    issues.push('File too large (> 5MB)')
    improvements.push('Optimize PDF to reduce file size')
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    improvements,
  }
}

function calculateKeywordsScore(
  cvKeywords: string[],
  targetKeywords?: string[]
): ATSCategoryScore {
  const issues: string[] = []
  const improvements: string[] = []

  if (!targetKeywords || targetKeywords.length === 0) {
    // No target keywords - score based on keyword density
    const uniqueKeywords = new Set(cvKeywords.map((k) => k.toLowerCase()))
    const score = Math.min(100, uniqueKeywords.size * 5)

    if (uniqueKeywords.size < 10) {
      issues.push('Low keyword density')
      improvements.push('Add more relevant industry keywords')
    }

    return {
      score,
      maxScore: 100,
      percentage: score,
      issues,
      improvements,
    }
  }

  // Calculate match rate with target keywords
  const cvKeywordsLower = new Set(cvKeywords.map((k) => k.toLowerCase()))
  const targetKeywordsLower = targetKeywords.map((k) => k.toLowerCase())

  let matchedCount = 0
  const missingKeywords: string[] = []

  for (const keyword of targetKeywordsLower) {
    if (cvKeywordsLower.has(keyword)) {
      matchedCount++
    } else {
      missingKeywords.push(keyword)
    }
  }

  const matchRate = matchedCount / targetKeywords.length
  const score = Math.round(matchRate * 100)

  if (missingKeywords.length > 0) {
    issues.push(
      `Missing ${missingKeywords.length} target keywords`
    )
    improvements.push(
      `Consider adding: ${missingKeywords.slice(0, 5).join(', ')}`
    )
  }

  return {
    score,
    maxScore: 100,
    percentage: score,
    issues,
    improvements,
  }
}

function calculateStructureScore(
  detectedSections: string[],
  dateFormats: string[]
): ATSCategoryScore {
  let score = 100
  const issues: string[] = []
  const improvements: string[] = []

  // Check for standard sections
  const normalizedSections = detectedSections
    .map((s) => normalizeSectionHeader(s))
    .filter((s): s is string => s !== null)

  const requiredSections = ['experience', 'education', 'skills']
  const missingSections = requiredSections.filter(
    (s) => !normalizedSections.includes(s)
  )

  if (missingSections.length > 0) {
    score -= missingSections.length * 15
    issues.push(`Missing sections: ${missingSections.join(', ')}`)
    improvements.push(
      `Add clear section headers: ${missingSections
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(', ')}`
    )
  }

  // Check for non-standard section names
  const nonStandardSections = detectedSections.filter(
    (s) => normalizeSectionHeader(s) === null
  )
  if (nonStandardSections.length > 0) {
    score -= nonStandardSections.length * 5
    issues.push(`Non-standard section headers: ${nonStandardSections.join(', ')}`)
    improvements.push('Use standard section headers like "Experience", "Education"')
  }

  // Check date format consistency
  const hasInconsistentDates =
    dateFormats.length > 0 && new Set(dateFormats).size > 1
  if (hasInconsistentDates) {
    score -= 10
    issues.push('Inconsistent date formats')
    improvements.push('Use consistent date format: MM/YYYY')
  }

  // Check for proper date format
  const hasProperDateFormat = dateFormats.some((d) =>
    /\d{2}\/\d{4}/.test(d)
  )
  if (!hasProperDateFormat && dateFormats.length > 0) {
    score -= 10
    issues.push('Date format not optimal for ATS')
    improvements.push('Use MM/YYYY format (e.g., 01/2020 - 06/2023)')
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    improvements,
  }
}

function calculateReadabilityScore(
  textLength: number,
  formattingCheck: FormattingCheckResult
): ATSCategoryScore {
  let score = 100
  const issues: string[] = []
  const improvements: string[] = []

  // Check text length
  if (textLength < 500) {
    score -= 30
    issues.push('CV content too short')
    improvements.push('Add more detail about your experience and skills')
  } else if (textLength > 5000) {
    score -= 15
    issues.push('CV content may be too long')
    improvements.push('Be more concise - focus on relevant experience')
  }

  // Multiple fonts affect readability
  if (formattingCheck.fonts.length > 3) {
    score -= 10
    issues.push('Too many different fonts')
    improvements.push('Use maximum 2 fonts for consistency')
  }

  // Margin checks
  const { margins } = formattingCheck
  if (margins.left < 0.5 || margins.right < 0.5) {
    score -= 5
    issues.push('Margins too narrow')
    improvements.push('Use at least 0.5 inch margins')
  }

  return {
    score: Math.max(0, score),
    maxScore: 100,
    percentage: Math.max(0, score),
    issues,
    improvements,
  }
}

// ============================================
// ATS Compatibility Matrix
// ============================================

function calculateCompatibilityMatrix(
  input: ScoringInput
): ATSCompatibilityMatrix {
  const matrix: ATSCompatibilityMatrix = {}

  for (const [atsId, ats] of Object.entries(ATS_STANDARDS)) {
    let score = 100
    const issues: string[] = []
    const optimizations: string[] = []

    // Check formatting against ATS capabilities
    if (
      input.formattingCheck.hasTables &&
      !ats.parsingCapabilities.parsesTables
    ) {
      score -= 30
      issues.push(`${ats.name} cannot parse tables`)
      optimizations.push('Remove tables for better compatibility')
    }

    if (
      input.formattingCheck.hasMultipleColumns &&
      !ats.parsingCapabilities.parsesColumns
    ) {
      score -= 25
      issues.push(`${ats.name} cannot parse multiple columns`)
      optimizations.push('Use single-column layout')
    }

    if (
      input.formattingCheck.hasImages &&
      !ats.parsingCapabilities.parsesImages
    ) {
      score -= 20
      issues.push(`${ats.name} ignores images`)
    }

    // Check file size
    if (input.formattingCheck.fileSize > ats.preferences.maxFileSize) {
      score -= 15
      issues.push(`File exceeds ${ats.name} size limit`)
      optimizations.push(
        `Reduce file size to under ${Math.round(ats.preferences.maxFileSize / 1024 / 1024)}MB`
      )
    }

    // Check page count
    if (
      ats.preferences.maxPages &&
      input.formattingCheck.pageCount > ats.preferences.maxPages
    ) {
      score -= 10
      issues.push(`${ats.name} prefers max ${ats.preferences.maxPages} pages`)
    }

    matrix[atsId] = {
      score: Math.max(0, score),
      compatible: score >= 70,
      issues,
      optimizations,
    }
  }

  return matrix
}

// ============================================
// Optimization Suggestions
// ============================================

function generateOptimizations(
  formatting: ATSCategoryScore,
  keywords: ATSCategoryScore,
  structure: ATSCategoryScore,
  readability: ATSCategoryScore
): ATSOptimization[] {
  const optimizations: ATSOptimization[] = []
  let priority = 1

  // Add formatting optimizations
  formatting.improvements.forEach((improvement) => {
    optimizations.push({
      id: `opt-format-${priority}`,
      type: 'formatting',
      priority: priority++,
      title: 'Format Optimization',
      description: improvement,
      impact: formatting.percentage < 50 ? 'high' : 'medium',
      effort: 'easy',
      autoFixable: false,
    })
  })

  // Add keyword optimizations
  keywords.improvements.forEach((improvement) => {
    optimizations.push({
      id: `opt-keyword-${priority}`,
      type: 'keywords',
      priority: priority++,
      title: 'Keyword Optimization',
      description: improvement,
      impact: keywords.percentage < 50 ? 'high' : 'medium',
      effort: 'medium',
      autoFixable: false,
    })
  })

  // Add structure optimizations
  structure.improvements.forEach((improvement) => {
    optimizations.push({
      id: `opt-structure-${priority}`,
      type: 'structure',
      priority: priority++,
      title: 'Structure Optimization',
      description: improvement,
      impact: structure.percentage < 50 ? 'high' : 'medium',
      effort: 'easy',
      autoFixable: true,
    })
  })

  // Add readability optimizations
  readability.improvements.forEach((improvement) => {
    optimizations.push({
      id: `opt-read-${priority}`,
      type: 'content',
      priority: priority++,
      title: 'Readability Improvement',
      description: improvement,
      impact: readability.percentage < 50 ? 'high' : 'low',
      effort: 'medium',
      autoFixable: false,
    })
  })

  return optimizations.sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 }
    return impactOrder[a.impact] - impactOrder[b.impact]
  })
}

// ============================================
// Utility Functions
// ============================================

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 75) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 40) return 'Needs Improvement'
  return 'Poor'
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'success'
  if (score >= 75) return 'success'
  if (score >= 60) return 'warning'
  if (score >= 40) return 'warning'
  return 'danger'
}

export function getSupportedATSList(
  compatibilityMatrix: ATSCompatibilityMatrix
): string[] {
  return Object.entries(compatibilityMatrix)
    .filter(([_, data]) => data.compatible)
    .map(([atsId]) => ATS_STANDARDS[atsId]?.name || atsId)
}
