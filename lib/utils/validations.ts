import { z } from 'zod'

// ============================================
// Authentication Schemas
// ============================================

export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>

// ============================================
// File Upload Schemas
// ============================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_FILE_SIZE_PREMIUM = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPES = ['application/pdf']

export const fileUploadSchema = z.object({
  file: z
    .custom<File>((file) => file instanceof File, 'Please select a file')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only PDF files are accepted'
    ),
})

export const fileUploadSchemaPremium = z.object({
  file: z
    .custom<File>((file) => file instanceof File, 'Please select a file')
    .refine(
      (file) => file.size <= MAX_FILE_SIZE_PREMIUM,
      `File size must be less than ${MAX_FILE_SIZE_PREMIUM / 1024 / 1024}MB`
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      'Only PDF files are accepted'
    ),
})

export type FileUploadFormData = z.infer<typeof fileUploadSchema>

// ============================================
// Job Description Schema
// ============================================

export const jobDescriptionSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().optional(),
  description: z
    .string()
    .min(50, 'Job description must be at least 50 characters')
    .max(10000, 'Job description is too long'),
  industry: z.string().optional(),
})

export type JobDescriptionFormData = z.infer<typeof jobDescriptionSchema>

// ============================================
// Profile Schema
// ============================================

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: emailSchema,
  photoURL: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// ============================================
// Feedback Schema
// ============================================

export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
  email: emailSchema.optional(),
})

export type FeedbackFormData = z.infer<typeof feedbackSchema>

// ============================================
// Validation Helpers
// ============================================

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const result = passwordSchema.safeParse(password)
  if (result.success) {
    return { valid: true, errors: [] }
  }
  return {
    valid: false,
    errors: result.error.errors.map((e) => e.message),
  }
}

export function validateFile(
  file: File,
  isPremium = false
): { valid: boolean; error?: string } {
  const maxSize = isPremium ? MAX_FILE_SIZE_PREMIUM : MAX_FILE_SIZE

  if (!file) {
    return { valid: false, error: 'Please select a file' }
  }

  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF files are accepted' }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}
