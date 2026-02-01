// PDF parsing utilities
// Note: pdf-parse is used server-side only

import type { FormattingCheckResult, DetectedSection } from '@/types/ats'

interface PDFParseResult {
  text: string
  numpages: number
  info: {
    Title?: string
    Author?: string
    Creator?: string
  }
}

// Dynamic import for pdf-parse (server-side only)
async function getPdfParse(): Promise<(buffer: Buffer) => Promise<PDFParseResult>> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse')
  return pdfParse
}

// ============================================
// Main PDF Parsing Functions
// ============================================

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = await getPdfParse()
    const data: PDFParseResult = await pdfParse(buffer)
    return data.text || ''
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

export async function parsePDF(buffer: Buffer): Promise<{
  text: string
  pageCount: number
  metadata: Record<string, string>
}> {
  try {
    const pdfParse = await getPdfParse()
    const data: PDFParseResult = await pdfParse(buffer)

    return {
      text: data.text || '',
      pageCount: data.numpages || 1,
      metadata: {
        title: data.info?.Title || '',
        author: data.info?.Author || '',
        creator: data.info?.Creator || '',
      },
    }
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF')
  }
}

// ============================================
// Text Analysis Functions
// ============================================

export function detectSections(text: string): DetectedSection[] {
  const sections: DetectedSection[] = []
  const lines = text.split('\n')

  // Common section header patterns
  const sectionPatterns = [
    /^(professional\s+)?experience$/i,
    /^work\s+experience$/i,
    /^employment(\s+history)?$/i,
    /^expérience(s)?(\s+professionnelle(s)?)?$/i,
    /^education$/i,
    /^formation(s)?$/i,
    /^études$/i,
    /^skills$/i,
    /^compétences$/i,
    /^technical\s+skills$/i,
    /^summary$/i,
    /^(professional\s+)?profile$/i,
    /^profil$/i,
    /^objective$/i,
    /^certifications?$/i,
    /^languages?$/i,
    /^langues$/i,
    /^projects?$/i,
    /^projets?$/i,
    /^achievements?$/i,
    /^awards?$/i,
    /^publications?$/i,
    /^interests?$/i,
    /^hobbies$/i,
    /^references?$/i,
  ]

  let currentSection: DetectedSection | null = null

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()

    // Check if line looks like a section header
    const isHeader =
      trimmedLine.length > 0 &&
      trimmedLine.length < 50 &&
      sectionPatterns.some((pattern) => pattern.test(trimmedLine))

    if (isHeader) {
      // Save previous section
      if (currentSection) {
        currentSection.endLine = index - 1
        sections.push(currentSection)
      }

      // Normalize the section name
      const normalizedName = normalizeSectionName(trimmedLine)

      currentSection = {
        name: trimmedLine,
        normalizedName,
        startLine: index,
        endLine: lines.length - 1, // Will be updated
        content: '',
        isStandard: isStandardSection(trimmedLine),
        suggestedName: getSuggestedSectionName(normalizedName),
      }
    } else if (currentSection) {
      currentSection.content += line + '\n'
    }
  })

  // Add last section
  if (currentSection) {
    sections.push(currentSection)
  }

  return sections
}

function normalizeSectionName(name: string): string {
  const normalized = name.toLowerCase().trim()

  // Map to standard names
  const mappings: Record<string, string> = {
    'professional experience': 'experience',
    'work experience': 'experience',
    'employment history': 'experience',
    'expérience professionnelle': 'experience',
    'expériences': 'experience',
    formation: 'education',
    formations: 'education',
    études: 'education',
    compétences: 'skills',
    'technical skills': 'skills',
    'core competencies': 'skills',
    profile: 'summary',
    'professional profile': 'summary',
    profil: 'summary',
    objective: 'summary',
    langues: 'languages',
    projets: 'projects',
  }

  return mappings[normalized] || normalized
}

function isStandardSection(name: string): boolean {
  const standardSections = [
    'experience',
    'education',
    'skills',
    'summary',
    'certifications',
    'languages',
    'projects',
  ]
  return standardSections.includes(normalizeSectionName(name))
}

function getSuggestedSectionName(normalizedName: string): string {
  const suggestions: Record<string, string> = {
    experience: 'Professional Experience',
    education: 'Education',
    skills: 'Skills',
    summary: 'Professional Summary',
    certifications: 'Certifications',
    languages: 'Languages',
    projects: 'Projects',
  }
  return suggestions[normalizedName] || normalizedName
}

// ============================================
// Date Detection
// ============================================

export function detectDateFormats(text: string): string[] {
  const datePatterns = [
    /\d{2}\/\d{4}/g, // MM/YYYY
    /\d{4}\/\d{2}/g, // YYYY/MM
    /\d{2}-\d{4}/g, // MM-YYYY
    /\d{4}-\d{2}/g, // YYYY-MM
    /\d{4}/g, // YYYY
    /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}/gi, // Month YYYY
    /(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4}/gi, // French months
  ]

  const formats: string[] = []

  for (const pattern of datePatterns) {
    const matches = text.match(pattern)
    if (matches) {
      formats.push(...matches)
    }
  }

  return [...new Set(formats)]
}

// ============================================
// Formatting Analysis (basic heuristics)
// ============================================

export function analyzeFormatting(
  text: string,
  fileSize: number,
  pageCount: number
): FormattingCheckResult {
  // Detect potential tables (multiple tabs or aligned columns)
  const hasTables =
    text.includes('\t\t') || /^\s{4,}\S+\s{4,}\S+/m.test(text)

  // Detect multiple columns (text with large gaps)
  const hasMultipleColumns = /\S\s{10,}\S/m.test(text)

  // Can't detect images from text extraction
  const hasImages = false

  // Detect headers/footers (repeated text patterns)
  const lines = text.split('\n')
  const firstLines = lines.slice(0, 3).join(' ')
  const lastLines = lines.slice(-3).join(' ')
  const middleContent = lines.slice(3, -3).join(' ')
  const hasHeadersFooters =
    (middleContent.includes(firstLines) && firstLines.length > 10) ||
    (middleContent.includes(lastLines) && lastLines.length > 10)

  // Can't detect text boxes from text extraction
  const hasTextBoxes = false

  // Check for unusual characters that might indicate special fonts
  const hasUnusualFonts = /[^\x00-\x7F\u00C0-\u024F\u1E00-\u1EFF]/.test(text)

  // Estimate font sizes (not accurate from text extraction)
  const fontSize = {
    min: 10,
    max: 12,
    average: 11,
  }

  // Estimate margins (not accurate from text extraction)
  const margins = {
    top: 1,
    bottom: 1,
    left: 1,
    right: 1,
  }

  // Detect fonts (can only detect if font names are in metadata)
  const fonts = ['Arial'] // Default assumption

  return {
    hasTables,
    hasMultipleColumns,
    hasImages,
    hasHeadersFooters,
    hasTextBoxes,
    hasUnusualFonts,
    fonts,
    fontSize,
    margins,
    pageCount,
    fileSize,
  }
}

// ============================================
// Keyword Extraction
// ============================================

export function extractKeywordsFromText(text: string): string[] {
  // Simple keyword extraction
  // In production, use the Claude API for better extraction
  const words = text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)

  // Count word frequencies
  const wordCounts: Record<string, number> = {}
  for (const word of words) {
    wordCounts[word] = (wordCounts[word] || 0) + 1
  }

  // Sort by frequency and return top keywords
  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .map(([word]) => word)
}

// ============================================
// Contact Information Extraction
// ============================================

export function extractContactInfo(text: string): {
  email?: string
  phone?: string
  linkedin?: string
  location?: string
} {
  const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0]

  // Phone patterns (various formats)
  const phonePatterns = [
    /\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
    /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
    /0\d{1}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}[-.\s]?\d{2}/, // French format
  ]

  let phone: string | undefined
  for (const pattern of phonePatterns) {
    const match = text.match(pattern)
    if (match) {
      phone = match[0]
      break
    }
  }

  // LinkedIn URL
  const linkedin = text.match(
    /(?:linkedin\.com\/in\/|linkedin:?\s*)([a-zA-Z0-9_-]+)/i
  )?.[0]

  // Location is harder to extract - would need NER
  const location = undefined

  return { email, phone, linkedin, location }
}

// ============================================
// Validation
// ============================================

export function validatePDF(
  buffer: Buffer
): { valid: boolean; error?: string } {
  // Check PDF signature
  const signature = buffer.slice(0, 5).toString()
  if (signature !== '%PDF-') {
    return { valid: false, error: 'Invalid PDF format' }
  }

  // Check file size
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (buffer.length > maxSize) {
    return { valid: false, error: 'File too large (max 10MB)' }
  }

  return { valid: true }
}

export function isPDFPasswordProtected(buffer: Buffer): boolean {
  const content = buffer.toString('binary')
  return content.includes('/Encrypt')
}
