import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { getStorage, type Storage } from 'firebase-admin/storage'

// Firebase Admin configuration
const adminConfig = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Validate admin configuration
function validateAdminConfig() {
  if (!adminConfig.projectId || !adminConfig.clientEmail || !adminConfig.privateKey) {
    console.warn('Firebase Admin SDK not configured. Server-side auth will be unavailable.')
    return false
  }
  return true
}

// Result type for admin initialization
interface AdminResult {
  adminApp: App | null
  adminAuth: Auth | null
  adminDb: Firestore | null
  adminStorage: Storage | null
}

function initializeAdmin(): AdminResult {
  // Only initialize on server side
  if (typeof window !== 'undefined') {
    return { adminApp: null, adminAuth: null, adminDb: null, adminStorage: null }
  }

  if (!validateAdminConfig()) {
    return { adminApp: null, adminAuth: null, adminDb: null, adminStorage: null }
  }

  try {
    let firebaseAdminApp: App

    if (getApps().length === 0) {
      firebaseAdminApp = initializeApp({
        credential: cert({
          projectId: adminConfig.projectId,
          clientEmail: adminConfig.clientEmail,
          privateKey: adminConfig.privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    } else {
      firebaseAdminApp = getApps()[0]
    }

    const firebaseAdminAuth = getAuth(firebaseAdminApp)
    const firebaseAdminDb = getFirestore(firebaseAdminApp)
    const firebaseAdminStorage = getStorage(firebaseAdminApp)

    return {
      adminApp: firebaseAdminApp,
      adminAuth: firebaseAdminAuth,
      adminDb: firebaseAdminDb,
      adminStorage: firebaseAdminStorage,
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    return { adminApp: null, adminAuth: null, adminDb: null, adminStorage: null }
  }
}

// Initialize on module load
const admin = initializeAdmin()

export { admin }
export const adminApp = admin.adminApp
export const adminAuth = admin.adminAuth
export const adminDb = admin.adminDb
export const adminStorage = admin.adminStorage

// Helper function to verify ID token
export async function verifyIdToken(token: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth not initialized')
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    throw error
  }
}

// Helper function to get user by ID
export async function getUser(uid: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth not initialized')
  }

  try {
    const userRecord = await adminAuth.getUser(uid)
    return userRecord
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

// Helper function to delete user
export async function deleteUser(uid: string) {
  if (!adminAuth) {
    throw new Error('Firebase Admin Auth not initialized')
  }

  try {
    await adminAuth.deleteUser(uid)
    return true
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Export types
export type { App, Auth, Firestore, Storage }
