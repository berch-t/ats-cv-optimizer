import { NextRequest, NextResponse } from 'next/server'
import { analyzeCVStream } from '@/lib/anthropic/analyzer'
import { validatePDF, analyzeFormatting, parsePDF, detectSections, detectDateFormats, extractKeywordsFromText } from '@/lib/pdf/parser'
import { generateOptimizedPDF } from '@/lib/pdf/generator'
import { calculateATSScore, type ScoringInput } from '@/lib/ats/scoring'
import type { CVAnalysisResult } from '@/types/cv'

export const runtime = 'nodejs' // Required for pdf-parse
export const maxDuration = 60 // Seconds

export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const jobDescription = formData.get('jobDescription') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Validate PDF
    const validation = validatePDF(buffer)
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial progress
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 10, content: 'Extracting text from PDF...\n' })}\n\n`)
          )

          // Parse PDF
          const { text, pageCount } = await parsePDF(buffer)

          if (!text || text.trim().length < 50) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Could not extract sufficient text from the PDF. Please ensure it is not image-based.' })}\n\n`)
            )
            controller.close()
            return
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 20, content: 'Analyzing formatting...\n' })}\n\n`)
          )

          // Analyze formatting
          const formattingResult = analyzeFormatting(text, file.size, pageCount)

          // Detect sections and extract keywords for scoring
          const detectedSections = detectSections(text).map(s => s.normalizedName)
          const dateFormats = detectDateFormats(text)
          const extractedKeywords = extractKeywordsFromText(text)

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 30, content: 'Starting AI analysis...\n' })}\n\n`)
          )

          // Stream AI analysis
          let analysisResult: CVAnalysisResult | null = null

          // Prepare options for analyzer
          const analyzerOptions = jobDescription ? { targetJob: jobDescription } : undefined

          for await (const chunk of analyzeCVStream(text, analyzerOptions)) {
            if (chunk.type === 'text' && chunk.content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'text', content: chunk.content })}\n\n`)
              )
            } else if (chunk.type === 'progress') {
              const progressValue = 30 + (chunk.progress || 0) * 0.4 // Scale to 30-70%
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: Math.round(progressValue), content: chunk.content })}\n\n`)
              )
            } else if (chunk.type === 'complete' && chunk.result) {
              analysisResult = chunk.result
            } else if (chunk.type === 'error') {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: 'error', error: chunk.error })}\n\n`)
              )
              controller.close()
              return
            }
          }

          if (!analysisResult) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Failed to analyze CV. Please try again.' })}\n\n`)
            )
            controller.close()
            return
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'analysis' })}\n\n`)
          )

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 75, content: '\n\nGenerating optimized CV...\n' })}\n\n`)
          )

          // Calculate ATS score with proper input
          const scoringInput: ScoringInput = {
            formattingCheck: formattingResult,
            detectedSections,
            keywords: extractedKeywords,
            targetKeywords: analysisResult.optimizedKeywords?.map(k => k.keyword) || [],
            dateFormats,
            textLength: text.length,
          }

          const atsScore = calculateATSScore(scoringInput)

          // Update analysis result with calculated scores
          // Map the detailed breakdown to simple percentages
          analysisResult.atsCompatibility = {
            overall: atsScore.overall,
            breakdown: {
              formatting: atsScore.breakdown.formatting.percentage,
              keywords: atsScore.breakdown.keywords.percentage,
              structure: atsScore.breakdown.structure.percentage,
              readability: atsScore.breakdown.readability.percentage,
            },
            detectedIssues: analysisResult.atsCompatibility.detectedIssues,
            supportedATS: analysisResult.atsCompatibility.supportedATS,
            improvements: analysisResult.atsCompatibility.improvements || [],
            foundKeywords: atsScore.breakdown.keywords.improvements,
            missingKeywords: analysisResult.atsCompatibility.missingKeywords,
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 85, content: 'Creating PDF...\n' })}\n\n`)
          )

          // Generate optimized PDF
          const optimizedPdfBytes = await generateOptimizedPDF(analysisResult)

          // Convert to base64 for response (in production, upload to cloud storage)
          const optimizedPdfBase64 = Buffer.from(optimizedPdfBytes).toString('base64')
          const optimizedPdfUrl = `data:application/pdf;base64,${optimizedPdfBase64}`

          // Original PDF as base64
          const originalPdfBase64 = buffer.toString('base64')
          const originalPdfUrl = `data:application/pdf;base64,${originalPdfBase64}`

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'progress', progress: 95, content: 'Finalizing...\n' })}\n\n`)
          )

          // Send final result
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'complete',
              result: analysisResult,
              originalPdfUrl,
              optimizedPdfUrl,
            })}\n\n`)
          )

          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Error in stream:', error)
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'An unexpected error occurred'
            })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error in convert API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
