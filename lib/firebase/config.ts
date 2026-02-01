import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validate configuration
function validateConfig() {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ] as const

  const missingFields = requiredFields.filter(
    (field) => !firebaseConfig[field]
  )

  if (missingFields.length > 0) {
    console.warn(
      `Missing Firebase configuration fields: ${missingFields.join(', ')}`
    )
  }

  return missingFields.length === 0
}

// Lazy initialization cache
let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null
let firebaseDb: Firestore | null = null
let firebaseStorage: FirebaseStorage | null = null

// Lazy getter for Firebase app
function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    if (getApps().length === 0) {
      if (typeof window !== 'undefined') {
        validateConfig()
      }
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApp()
    }
  }
  return firebaseApp
}

// Lazy getters for Firebase services
export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    firebaseAuth = getAuth(getFirebaseApp())
  }
  return firebaseAuth
}

export function getFirebaseDb(): Firestore {
  if (!firebaseDb) {
    firebaseDb = getFirestore(getFirebaseApp())
  }
  return firebaseDb
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    firebaseStorage = getStorage(getFirebaseApp())
  }
  return firebaseStorage
}

// Export config for reference
export { firebaseConfig }

// Legacy exports - these use getters for lazy initialization
// Use getFirebaseAuth(), getFirebaseDb(), getFirebaseStorage() for new code
export const app = {
  get instance() {
    return getFirebaseApp()
  },
}

export const auth = {
  get instance() {
    return getFirebaseAuth()
  },
}

export const db = {
  get instance() {
    return getFirebaseDb()
  },
}

export const storage = {
  get instance() {
    return getFirebaseStorage()
  },
}

// Type exports for convenience
export type { FirebaseApp, Auth, Firestore, FirebaseStorage }
