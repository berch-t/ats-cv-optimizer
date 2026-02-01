import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  type UploadTaskSnapshot,
} from 'firebase/storage'
import { getFirebaseStorage } from './config'

// Storage paths
const STORAGE_PATHS = {
  ORIGINAL_CVS: 'cvs/original',
  OPTIMIZED_CVS: 'cvs/optimized',
  USER_AVATARS: 'avatars',
  TEMP: 'temp',
} as const

// ============================================
// Upload Functions
// ============================================

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File | Blob | ArrayBuffer | Uint8Array,
  path: string,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), path)

  const uploadMetadata = {
    contentType: metadata?.contentType || 'application/pdf',
    customMetadata: metadata?.customMetadata,
  }

  // Convert ArrayBuffer or Uint8Array to Blob for consistent handling
  let uploadData: Blob
  if (file instanceof File || file instanceof Blob) {
    uploadData = file
  } else if (file instanceof Uint8Array) {
    // Create a new ArrayBuffer from Uint8Array to ensure proper type
    const arrayBuffer = new ArrayBuffer(file.byteLength)
    new Uint8Array(arrayBuffer).set(file)
    uploadData = new Blob([arrayBuffer], { type: metadata?.contentType || 'application/pdf' })
  } else {
    uploadData = new Blob([file], { type: metadata?.contentType || 'application/pdf' })
  }

  await uploadBytes(storageRef, uploadData, uploadMetadata)
  const downloadURL = await getDownloadURL(storageRef)

  return downloadURL
}

/**
 * Upload a file with progress tracking
 */
export async function uploadFileWithProgress(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), path)

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  })

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress?.(progress)
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

/**
 * Upload original CV
 */
export async function uploadOriginalCV(
  userId: string,
  file: File | ArrayBuffer,
  fileName?: string
): Promise<string> {
  const timestamp = Date.now()
  const name = fileName || `cv_${timestamp}.pdf`
  const path = `${STORAGE_PATHS.ORIGINAL_CVS}/${userId}/${name}`

  return uploadFile(file, path, { contentType: 'application/pdf' })
}

/**
 * Upload optimized CV
 */
export async function uploadOptimizedCV(
  userId: string,
  pdfBuffer: ArrayBuffer | Uint8Array,
  fileName?: string
): Promise<string> {
  const timestamp = Date.now()
  const name = fileName || `cv_optimized_${timestamp}.pdf`
  const path = `${STORAGE_PATHS.OPTIMIZED_CVS}/${userId}/${name}`

  return uploadFile(pdfBuffer, path, { contentType: 'application/pdf' })
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${STORAGE_PATHS.USER_AVATARS}/${userId}/avatar.${extension}`

  return uploadFile(file, path, { contentType: file.type })
}

// ============================================
// Download Functions
// ============================================

/**
 * Get download URL for a file
 */
export async function getFileDownloadURL(path: string): Promise<string> {
  const storageRef = ref(getFirebaseStorage(), path)
  return getDownloadURL(storageRef)
}

/**
 * Download a file as blob
 */
export async function downloadFile(url: string): Promise<Blob> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to download file')
  }
  return response.blob()
}

// ============================================
// Delete Functions
// ============================================

/**
 * Delete a file from storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(getFirebaseStorage(), path)
  await deleteObject(storageRef)
}

/**
 * Delete all files in a directory
 */
export async function deleteDirectory(path: string): Promise<void> {
  const storageRef = ref(getFirebaseStorage(), path)
  const listResult = await listAll(storageRef)

  // Delete all files
  const deletePromises = listResult.items.map((item) => deleteObject(item))
  await Promise.all(deletePromises)

  // Recursively delete subdirectories
  const subdirPromises = listResult.prefixes.map((prefix) =>
    deleteDirectory(prefix.fullPath)
  )
  await Promise.all(subdirPromises)
}

/**
 * Delete all user CVs
 */
export async function deleteUserCVs(userId: string): Promise<void> {
  await Promise.all([
    deleteDirectory(`${STORAGE_PATHS.ORIGINAL_CVS}/${userId}`),
    deleteDirectory(`${STORAGE_PATHS.OPTIMIZED_CVS}/${userId}`),
  ])
}

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a unique file path
 */
export function generateFilePath(
  userId: string,
  type: 'original' | 'optimized',
  extension = 'pdf'
): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(7)
  const basePath =
    type === 'original'
      ? STORAGE_PATHS.ORIGINAL_CVS
      : STORAGE_PATHS.OPTIMIZED_CVS

  return `${basePath}/${userId}/${timestamp}_${randomId}.${extension}`
}

/**
 * Get file metadata from URL
 */
export function getFileMetadataFromURL(url: string): {
  userId?: string
  fileName?: string
  type?: 'original' | 'optimized'
} {
  try {
    const urlObj = new URL(url)
    const path = decodeURIComponent(urlObj.pathname)

    const isOriginal = path.includes('/original/')
    const isOptimized = path.includes('/optimized/')

    const parts = path.split('/')
    const fileName = parts[parts.length - 1]

    // Extract userId from path
    let userId: string | undefined
    if (isOriginal) {
      const originalIndex = parts.indexOf('original')
      userId = parts[originalIndex + 1]
    } else if (isOptimized) {
      const optimizedIndex = parts.indexOf('optimized')
      userId = parts[optimizedIndex + 1]
    }

    return {
      userId,
      fileName,
      type: isOriginal ? 'original' : isOptimized ? 'optimized' : undefined,
    }
  } catch {
    return {}
  }
}

/**
 * Check if file exists
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    const storageRef = ref(getFirebaseStorage(), path)
    await getDownloadURL(storageRef)
    return true
  } catch {
    return false
  }
}

// Export constants
export { STORAGE_PATHS }
