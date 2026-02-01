// Re-export all Firebase modules
export * from './config'
export * from './auth'
export * from './firestore'
export * from './storage'

// Admin exports (server-side only)
export {
  adminApp,
  adminAuth,
  adminDb,
  adminStorage,
  verifyIdToken,
  getUser,
  deleteUser,
} from './admin'
