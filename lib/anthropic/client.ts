import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Model configuration
export const CLAUDE_MODEL = 'claude-sonnet-4-20250514'
export const CLAUDE_MODEL_FAST = 'claude-3-5-haiku-20241022'

// Default configuration
export const DEFAULT_CONFIG = {
  maxTokens: 8000,
  temperature: 0.3,
}

// Token limits
export const TOKEN_LIMITS = {
  maxInputTokens: 200000,
  maxOutputTokens: 8192,
  estimatedTokensPerChar: 0.25,
}

// Estimate tokens for a text
export function estimateTokens(text: string): number {
  return Math.ceil(text.length * TOKEN_LIMITS.estimatedTokensPerChar)
}

// Check if text fits within token limits
export function checkTokenLimit(text: string): boolean {
  return estimateTokens(text) < TOKEN_LIMITS.maxInputTokens
}

export { anthropic }
export default anthropic
