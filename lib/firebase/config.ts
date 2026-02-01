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

// Initialize Firebase (singleton pattern)
function initializeFirebase(): { app: FirebaseApp; auth: Auth; db: Firestore; storage: FirebaseStorage } {
  let firebaseApp: FirebaseApp

  if (typeof window === 'undefined') {
    // Server-side: Check if already initialized
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApp()
    }
  } else {
    // Client-side: Use singleton pattern
    if (getApps().length === 0) {
      validateConfig()
      firebaseApp = initializeApp(firebaseConfig)
    } else {
      firebaseApp = getApp()
    }
  }

  const firebaseAuth = getAuth(firebaseApp)
  const firebaseDb = getFirestore(firebaseApp)
  const firebaseStorage = getStorage(firebaseApp)

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage }
}

// Initialize on module load
const firebase = initializeFirebase()

export { firebase, firebaseConfig }
export const app = firebase.app
export const auth = firebase.auth
export const db = firebase.db
export const storage = firebase.storage

// Type exports for convenience
export type { FirebaseApp, Auth, Firestore, FirebaseStorage }
