import { z } from 'zod'

// Personal Information Schema
export const CVPersonalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
  photoUrl: z.string().optional(),
})

// Experience Schema
export const CVExperienceSchema = z.object({
  id: z.string(),
  jobTitle: z.string(),
  company: z.string(),
  location: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
})

// Education Schema
export const CVEducationSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  location: z.string().optional().nullable(),
  graduationDate: z.string().optional().nullable(),
  gpa: z.string().optional().nullable(),
  honors: z.array(z.string()).optional(),
  relevantCourses: z.array(z.string()).optional(),
})

// Language Schema - accepts any proficiency string (EN/FR/other)
export const CVLanguageSchema = z.object({
  name: z.string(),
  proficiency: z.string(), // Flexible to accept any language proficiency format
})

// Skills Schema
export const CVSkillsSchema = z.object({
  technical: z.array(z.string()),
  soft: z.array(z.string()),
  languages: z.array(CVLanguageSchema),
  certifications: z.array(z.string()).optional(),
  tools: z.array(z.string()).optional(),
})

// CV Data Schema
export const CVDataSchema = z.object({
  personalInfo: CVPersonalInfoSchema,
  professionalSummary: z.string().optional(),
  experience: z.array(CVExperienceSchema),
  education: z.array(CVEducationSchema),
  skills: CVSkillsSchema,
  projects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
    url: z.string().optional(),
  })).optional(),
  awards: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
})

// ATS Issue Schema
export const ATSIssueSchema = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'warning', 'info']),
  category: z.enum(['formatting', 'structure', 'keywords', 'dates', 'sections', 'readability']),
  message: z.string(),
  suggestion: z.string().optional(),
  lineReference: z.number().optional(),
})

// ATS Compatibility Schema
export const ATSCompatibilitySchema = z.object({
  overall: z.number().min(0).max(100),
  breakdown: z.object({
    formatting: z.number().min(0).max(100),
    keywords: z.number().min(0).max(100),
    structure: z.number().min(0).max(100),
    readability: z.number().min(0).max(100),
  }),
  detectedIssues: z.array(ATSIssueSchema),
  supportedATS: z.array(z.string()),
  improvements: z.array(z.string()).default([]),
})

// Recommendation Schema
export const CVRecommendationSchema = z.object({
  id: z.string(),
  category: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  title: z.string(),
  suggestion: z.string(),
  impact: z.string(),
  beforeExample: z.string().optional(),
  afterExample: z.string().optional(),
  isApplied: z.boolean().optional(),
})

// Optimized Keyword Schema
export const OptimizedKeywordSchema = z.object({
  keyword: z.string(),
  category: z.string(),
  relevance: z.number().min(0).max(100),
  frequency: z.number(),
  isPresent: z.boolean(),
  suggestedUsage: z.string().optional(),
})

// Main Analysis Result Schema
export const CVAnalysisResultSchema = z.object({
  cvData: CVDataSchema,
  atsCompatibility: ATSCompatibilitySchema,
  recommendations: z.array(CVRecommendationSchema),
  optimizedKeywords: z.array(OptimizedKeywordSchema),
  detectedSector: z.string().optional(),
  originalScore: z.number().min(0).max(100),
  optimizedScore: z.number().min(0).max(100),
})

// Job Keyword Extraction Schema
export const JobKeywordsSchema = z.object({
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  tools: z.array(z.string()),
  softSkills: z.array(z.string()),
  keywords: z.array(z.string()),
  seniority: z.enum(['junior', 'mid', 'senior', 'lead']),
  sector: z.string(),
})

// Type exports
export type CVPersonalInfo = z.infer<typeof CVPersonalInfoSchema>
export type CVExperience = z.infer<typeof CVExperienceSchema>
export type CVEducation = z.infer<typeof CVEducationSchema>
export type CVLanguage = z.infer<typeof CVLanguageSchema>
export type CVSkills = z.infer<typeof CVSkillsSchema>
export type CVData = z.infer<typeof CVDataSchema>
export type ATSIssue = z.infer<typeof ATSIssueSchema>
export type ATSCompatibility = z.infer<typeof ATSCompatibilitySchema>
export type CVRecommendation = z.infer<typeof CVRecommendationSchema>
export type OptimizedKeyword = z.infer<typeof OptimizedKeywordSchema>
export type CVAnalysisResult = z.infer<typeof CVAnalysisResultSchema>
export type JobKeywords = z.infer<typeof JobKeywordsSchema>

// Validation helper
export function validateAnalysisResult(data: unknown): CVAnalysisResult {
  return CVAnalysisResultSchema.parse(data)
}

// Safe parse helper
export function safeParseAnalysisResult(data: unknown): {
  success: boolean
  data?: CVAnalysisResult
  error?: z.ZodError
} {
  const result = CVAnalysisResultSchema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}
