import anthropic, { CLAUDE_MODEL, DEFAULT_CONFIG } from './client'
import {
  CV_ANALYSIS_SYSTEM_PROMPT,
  CV_OPTIMIZATION_PROMPT,
  KEYWORD_EXTRACTION_PROMPT,
} from './prompts'
import {
  CVAnalysisResultSchema,
  JobKeywordsSchema,
  type CVAnalysisResult,
  type JobKeywords,
} from './schemas'

// ============================================
// Main Analysis Function
// ============================================

export async function analyzeCV(
  cvText: string,
  options?: {
    targetSector?: string
    targetJob?: string
    stream?: boolean
  }
): Promise<CVAnalysisResult> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: DEFAULT_CONFIG.maxTokens,
    temperature: DEFAULT_CONFIG.temperature,
    system: CV_ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: CV_OPTIMIZATION_PROMPT(
          cvText,
          options?.targetSector,
          options?.targetJob
        ),
      },
    ],
  })

  const assistantMessage = response.content[0]
  if (assistantMessage.type !== 'text') {
    throw new Error('Unexpected response format from Claude')
  }

  // Parse JSON from response
  const jsonMatch = assistantMessage.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }

  const parsedJSON = JSON.parse(jsonMatch[0])
  return CVAnalysisResultSchema.parse(parsedJSON)
}

// ============================================
// Streaming Analysis Function
// ============================================

export async function* analyzeCVStream(
  cvText: string,
  options?: {
    targetSector?: string
    targetJob?: string
  }
): AsyncGenerator<{
  type: 'text' | 'progress' | 'complete' | 'error'
  content?: string
  progress?: number
  result?: CVAnalysisResult
  error?: string
}> {
  try {
    yield { type: 'progress', progress: 0, content: 'Initialisation de l\'analyse...' }

    const stream = anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: DEFAULT_CONFIG.maxTokens,
      temperature: DEFAULT_CONFIG.temperature,
      system: CV_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: CV_OPTIMIZATION_PROMPT(
            cvText,
            options?.targetSector,
            options?.targetJob
          ),
        },
      ],
    })

    let fullText = ''
    let progressStage = 0
    const stages = [
      'Extraction des informations personnelles...',
      'Analyse de l\'expérience professionnelle...',
      'Vérification de la formation...',
      'Identification des compétences...',
      'Calcul du score ATS...',
      'Génération des recommandations...',
    ]

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        const delta = event.delta as { type: string; text?: string }
        if (delta.type === 'text_delta' && delta.text) {
          fullText += delta.text
          yield { type: 'text', content: delta.text }

          // Update progress based on content
          if (fullText.includes('"personalInfo"') && progressStage < 1) {
            progressStage = 1
            yield { type: 'progress', progress: 15, content: stages[0] }
          }
          if (fullText.includes('"experience"') && progressStage < 2) {
            progressStage = 2
            yield { type: 'progress', progress: 30, content: stages[1] }
          }
          if (fullText.includes('"education"') && progressStage < 3) {
            progressStage = 3
            yield { type: 'progress', progress: 45, content: stages[2] }
          }
          if (fullText.includes('"skills"') && progressStage < 4) {
            progressStage = 4
            yield { type: 'progress', progress: 60, content: stages[3] }
          }
          if (fullText.includes('"atsCompatibility"') && progressStage < 5) {
            progressStage = 5
            yield { type: 'progress', progress: 75, content: stages[4] }
          }
          if (fullText.includes('"recommendations"') && progressStage < 6) {
            progressStage = 6
            yield { type: 'progress', progress: 90, content: stages[5] }
          }
        }
      }
    }

    yield { type: 'progress', progress: 95, content: 'Validation des résultats...' }

    // Parse final result
    const jsonMatch = fullText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.error('No JSON found in Claude response. Full text:', fullText.substring(0, 500))
      throw new Error('No JSON found in response')
    }

    let parsedJSON
    try {
      parsedJSON = JSON.parse(jsonMatch[0])
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError)
      console.error('JSON string (first 500 chars):', jsonMatch[0].substring(0, 500))
      throw new Error('Invalid JSON in response')
    }

    // Use safeParse for better error messages
    const parseResult = CVAnalysisResultSchema.safeParse(parsedJSON)
    if (!parseResult.success) {
      console.error('Zod validation failed:', parseResult.error.issues)
      // Provide detailed error message
      const issues = parseResult.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ')
      throw new Error(`Validation failed: ${issues}`)
    }

    const result = parseResult.data

    yield { type: 'progress', progress: 100, content: 'Analyse terminée!' }
    yield { type: 'complete', result }

  } catch (error) {
    console.error('CV analysis error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    yield { type: 'error', error: errorMessage }
  }
}

// ============================================
// Job Keywords Extraction
// ============================================

export async function extractJobKeywords(
  jobDescription: string
): Promise<JobKeywords> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2000,
    temperature: 0.2,
    messages: [
      {
        role: 'user',
        content: KEYWORD_EXTRACTION_PROMPT(jobDescription),
      },
    ],
  })

  const assistantMessage = response.content[0]
  if (assistantMessage.type !== 'text') {
    throw new Error('Unexpected response format')
  }

  const jsonMatch = assistantMessage.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('No JSON found in response')
  }

  const parsedJSON = JSON.parse(jsonMatch[0])
  return JobKeywordsSchema.parse(parsedJSON)
}

// ============================================
// Match CV to Job Description
// ============================================

export async function matchCVToJob(
  cvAnalysis: CVAnalysisResult,
  jobKeywords: JobKeywords
): Promise<{
  matchScore: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}> {
  // Extract all CV keywords
  const cvKeywords = new Set<string>()

  // Add technical skills
  cvAnalysis.cvData.skills.technical.forEach((skill) =>
    cvKeywords.add(skill.toLowerCase())
  )

  // Add soft skills
  cvAnalysis.cvData.skills.soft.forEach((skill) =>
    cvKeywords.add(skill.toLowerCase())
  )

  // Add keywords from optimized keywords
  cvAnalysis.optimizedKeywords.forEach((kw) => {
    if (kw.isPresent) {
      cvKeywords.add(kw.keyword.toLowerCase())
    }
  })

  // Combine all job keywords
  const allJobKeywords = [
    ...jobKeywords.requiredSkills,
    ...jobKeywords.preferredSkills,
    ...jobKeywords.tools,
    ...jobKeywords.keywords,
  ].map((k) => k.toLowerCase())

  // Calculate matches
  const matchedKeywords: string[] = []
  const missingKeywords: string[] = []

  allJobKeywords.forEach((keyword) => {
    if (cvKeywords.has(keyword)) {
      matchedKeywords.push(keyword)
    } else {
      missingKeywords.push(keyword)
    }
  })

  // Calculate match score (weighted)
  const requiredMatches = jobKeywords.requiredSkills.filter((skill) =>
    cvKeywords.has(skill.toLowerCase())
  ).length
  const preferredMatches = jobKeywords.preferredSkills.filter((skill) =>
    cvKeywords.has(skill.toLowerCase())
  ).length

  const requiredScore =
    (requiredMatches / Math.max(jobKeywords.requiredSkills.length, 1)) * 60
  const preferredScore =
    (preferredMatches / Math.max(jobKeywords.preferredSkills.length, 1)) * 40

  const matchScore = Math.round(requiredScore + preferredScore)

  // Generate suggestions
  const suggestions: string[] = []
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5)
    suggestions.push(
      `Ajoutez ces compétences clés si vous les possédez: ${topMissing.join(', ')}`
    )
  }

  if (matchScore < 50) {
    suggestions.push(
      'Votre CV ne correspond pas bien à cette offre. Considérez de personnaliser votre CV pour ce poste.'
    )
  }

  return {
    matchScore,
    matchedKeywords,
    missingKeywords,
    suggestions,
  }
}

// Export types
export type { CVAnalysisResult, JobKeywords }
