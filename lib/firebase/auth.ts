'use client'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from 'firebase/auth'
import { auth } from './config'
import { createUserSubscription, updateUserProfile } from './firestore'
import type { User as AppUser } from '@/types/user'

// Google Auth Provider
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  // Update profile with display name
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName })
  }

  // Send email verification
  if (userCredential.user) {
    await sendEmailVerification(userCredential.user)
  }

  // Create default subscription
  await createUserSubscription(userCredential.user.uid)

  // Create user profile in Firestore
  await updateUserProfile(userCredential.user.uid, {
    email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    provider: 'email',
  })

  return userCredential
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)

  // Update last login time
  await updateUserProfile(userCredential.user.uid, {
    lastLoginAt: new Date(),
  })

  return userCredential
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  const userCredential = await signInWithPopup(auth, googleProvider)

  // Check if new user and create subscription
  const isNewUser =
    userCredential.user.metadata.creationTime ===
    userCredential.user.metadata.lastSignInTime

  if (isNewUser) {
    await createUserSubscription(userCredential.user.uid)
  }

  // Update/create user profile
  await updateUserProfile(userCredential.user.uid, {
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || '',
    photoURL: userCredential.user.photoURL,
    lastLoginAt: new Date(),
    provider: 'google',
    ...(isNewUser && { createdAt: new Date() }),
  })

  return userCredential
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

// Resend verification email
export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser
  if (user) {
    await sendEmailVerification(user)
  } else {
    throw new Error('No user logged in')
  }
}

// Update user display name
export async function updateDisplayName(displayName: string): Promise<void> {
  const user = auth.currentUser
  if (user) {
    await updateProfile(user, { displayName })
    await updateUserProfile(user.uid, { displayName })
  } else {
    throw new Error('No user logged in')
  }
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

// Subscribe to auth state changes
export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback)
}

// Convert Firebase User to App User
export function toAppUser(firebaseUser: User): Partial<AppUser> {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
    emailVerified: firebaseUser.emailVerified,
  }
}

// Get ID token for API calls
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  const user = auth.currentUser
  if (user) {
    return await user.getIdToken(forceRefresh)
  }
  return null
}

export { auth }
export type { User, UserCredential }
