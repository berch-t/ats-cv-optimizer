'use client'

import { useState, useCallback, useRef } from 'react'
import type { CVAnalysisResult, ConversionMessage, StreamChunk } from '@/types/cv'
import { saveConversion, incrementConversionUsage } from '@/lib/firebase/firestore'
import { getAuth } from 'firebase/auth'

interface ConversionState {
  status: 'idle' | 'uploading' | 'analyzing' | 'generating' | 'completed' | 'error'
  progress: number
  messages: ConversionMessage[]
  result: CVAnalysisResult | null
  originalPdfUrl: string | null
  optimizedPdfUrl: string | null
  error: string | null
}

const initialState: ConversionState = {
  status: 'idle',
  progress: 0,
  messages: [],
  result: null,
  originalPdfUrl: null,
  optimizedPdfUrl: null,
  error: null,
}

// Extended stream chunk type for complete data
interface ExtendedStreamChunk extends StreamChunk {
  text?: string
  message?: string
  originalPdfUrl?: string
  optimizedPdfUrl?: string
}

export function useConversion() {
  const [state, setState] = useState<ConversionState>(initialState)
  const abortControllerRef = useRef<AbortController | null>(null)

  const addMessage = useCallback((message: Omit<ConversionMessage, 'id' | 'timestamp'>) => {
    setState((prev) => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          timestamp: new Date(),
        },
      ],
    }))
  }, [])

  const updateLastMessage = useCallback((content: string) => {
    setState((prev) => {
      const messages = [...prev.messages]
      const lastIndex = messages.length - 1
      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: messages[lastIndex].content + content,
        }
      }
      return { ...prev, messages }
    })
  }, [])

  const startConversion = useCallback(
    async (file: File, jobDescription?: string) => {
      const startTime = Date.now()

      // Reset state
      setState({
        ...initialState,
        status: 'uploading',
        progress: 5,
      })

      // Abort any existing conversion
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      try {
        // Add initial system message
        addMessage({
          role: 'system',
          type: 'text',
          content: 'Starting CV analysis...',
        })

        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        if (jobDescription) {
          formData.append('jobDescription', jobDescription)
        }

        setState((prev) => ({
          ...prev,
          status: 'analyzing',
          progress: 15,
        }))

        addMessage({
          role: 'assistant',
          type: 'text',
          content: 'Analyzing your CV for ATS compatibility...\n\n',
        })

        // Send to API with streaming
        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Conversion failed')
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body')
        }

        const decoder = new TextDecoder()
        let buffer = ''
        let analysisResult: CVAnalysisResult | null = null

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const chunk = JSON.parse(data) as ExtendedStreamChunk

                switch (chunk.type) {
                  case 'progress':
                    setState((prev) => ({
                      ...prev,
                      // API sends progress directly as number, not nested
                      progress: typeof chunk.progress === 'number' ? chunk.progress : (chunk.progress?.progress || prev.progress),
                    }))
                    if (chunk.message || chunk.content) {
                      updateLastMessage(chunk.message || chunk.content || '')
                    }
                    break

                  case 'analysis':
                    setState((prev) => ({
                      ...prev,
                      status: 'generating',
                      progress: 70,
                    }))
                    addMessage({
                      role: 'assistant',
                      type: 'progress',
                      content: '\n\nGenerating optimized CV...',
                    })
                    break

                  case 'text':
                    updateLastMessage(chunk.text || chunk.content || '')
                    break

                  case 'complete':
                    if (chunk.result) {
                      analysisResult = chunk.result
                    }
                    setState((prev) => ({
                      ...prev,
                      status: 'completed',
                      progress: 100,
                      result: analysisResult,
                      originalPdfUrl: chunk.originalPdfUrl || null,
                      optimizedPdfUrl: chunk.optimizedPdfUrl || null,
                    }))
                    addMessage({
                      role: 'system',
                      type: 'result',
                      content: 'CV optimization complete! Download your optimized CV below.',
                    })

                    // Save conversion to Firestore
                    try {
                      const currentUser = getAuth().currentUser
                      if (currentUser && analysisResult) {
                        await saveConversion({
                          userId: currentUser.uid,
                          originalUrl: chunk.originalPdfUrl || '',
                          optimizedUrl: chunk.optimizedPdfUrl || '',
                          originalFileName: file.name,
                          originalFileSize: file.size,
                          analysisResult,
                          createdAt: new Date(),
                          processingTime: Date.now() - startTime,
                        })
                        await incrementConversionUsage(currentUser.uid)
                      }
                    } catch (saveError) {
                      console.error('Failed to save conversion:', saveError)
                    }
                    break

                  case 'error':
                    throw new Error(chunk.error || 'Unknown error')
                }
              } catch (parseError) {
                // Only ignore actual JSON parse errors, not other errors
                if (parseError instanceof SyntaxError) {
                  // Ignore JSON parse errors for incomplete chunks
                  console.warn('Incomplete JSON chunk:', data)
                } else {
                  // Re-throw other errors (like the error case above)
                  throw parseError
                }
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          setState((prev) => ({
            ...prev,
            status: 'idle',
            error: null,
          }))
          return
        }

        const errorMessage =
          error instanceof Error ? error.message : 'An unexpected error occurred'
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: errorMessage,
        }))
        addMessage({
          role: 'system',
          type: 'error',
          content: errorMessage,
        })
      }
    },
    [addMessage, updateLastMessage]
  )

  const cancelConversion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setState((prev) => ({
      ...prev,
      status: 'idle',
    }))
  }, [])

  const resetConversion = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setState(initialState)
  }, [])

  return {
    ...state,
    isConverting: ['uploading', 'analyzing', 'generating'].includes(state.status),
    isComplete: state.status === 'completed',
    hasError: state.status === 'error',
    startConversion,
    cancelConversion,
    resetConversion,
  }
}
