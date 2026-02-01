import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  serverTimestamp,
  increment,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore'
import { getFirebaseDb } from './config'
import type {
  CVAnalysisResult,
  ConversionResult,
} from '@/types/cv'
import type {
  UserSubscription,
  SubscriptionPlan,
  ConversionHistoryItem,
} from '@/types/user'

// Collection names
const COLLECTIONS = {
  USERS: 'users',
  SUBSCRIPTIONS: 'subscriptions',
  CONVERSIONS: 'conversions',
  USAGE: 'usage',
} as const

// ============================================
// User Profile Operations
// ============================================

export async function getUserProfile(userId: string) {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.USERS, userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() }
  }
  return null
}

export async function updateUserProfile(
  userId: string,
  data: Partial<DocumentData>
) {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.USERS, userId)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
  } else {
    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function deleteUserProfile(userId: string) {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.USERS, userId)
  await deleteDoc(docRef)
}

// ============================================
// Subscription Operations
// ============================================

export async function createUserSubscription(userId: string): Promise<void> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.SUBSCRIPTIONS, userId)
  const now = new Date()
  const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

  const subscription: Omit<UserSubscription, 'userId'> = {
    plan: 'free',
    status: 'active',
    conversionsUsed: 0,
    conversionsLimit: 3,
    periodStart: now,
    periodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    createdAt: now,
    updatedAt: now,
  }

  await setDoc(docRef, {
    ...subscription,
    periodStart: Timestamp.fromDate(subscription.periodStart),
    periodEnd: Timestamp.fromDate(subscription.periodEnd),
    createdAt: Timestamp.fromDate(subscription.createdAt),
    updatedAt: serverTimestamp(),
  })
}

export async function getUserSubscription(
  userId: string
): Promise<UserSubscription | null> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.SUBSCRIPTIONS, userId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    // Create default subscription if doesn't exist
    await createUserSubscription(userId)
    return getUserSubscription(userId)
  }

  const data = docSnap.data()
  return {
    userId,
    plan: data.plan,
    status: data.status,
    conversionsUsed: data.conversionsUsed,
    conversionsLimit: data.conversionsLimit,
    periodStart: data.periodStart.toDate(),
    periodEnd: data.periodEnd.toDate(),
    cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
    stripeCustomerId: data.stripeCustomerId,
    stripeSubscriptionId: data.stripeSubscriptionId,
    stripePriceId: data.stripePriceId,
    trialEnd: data.trialEnd?.toDate(),
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

export async function updateUserSubscription(
  userId: string,
  data: Partial<UserSubscription>
): Promise<void> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.SUBSCRIPTIONS, userId)

  const updateData: Record<string, unknown> = { ...data }

  // Convert dates to Timestamps
  if (data.periodStart) {
    updateData.periodStart = Timestamp.fromDate(data.periodStart)
  }
  if (data.periodEnd) {
    updateData.periodEnd = Timestamp.fromDate(data.periodEnd)
  }
  if (data.trialEnd) {
    updateData.trialEnd = Timestamp.fromDate(data.trialEnd)
  }

  updateData.updatedAt = serverTimestamp()

  await updateDoc(docRef, updateData)
}

export async function incrementConversionUsage(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    throw new Error('Subscription not found')
  }

  // Check if limit reached (ignore for unlimited plans)
  if (
    subscription.conversionsLimit !== -1 &&
    subscription.conversionsUsed >= subscription.conversionsLimit
  ) {
    throw new Error('Conversion limit reached')
  }

  const docRef = doc(getFirebaseDb(), COLLECTIONS.SUBSCRIPTIONS, userId)
  await updateDoc(docRef, {
    conversionsUsed: increment(1),
    updatedAt: serverTimestamp(),
  })
}

export async function resetMonthlyUsage(userId: string): Promise<void> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.SUBSCRIPTIONS, userId)
  const now = new Date()

  await updateDoc(docRef, {
    conversionsUsed: 0,
    periodStart: Timestamp.fromDate(now),
    periodEnd: Timestamp.fromDate(
      new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    ),
    updatedAt: serverTimestamp(),
  })
}

export async function upgradeToPremium(
  userId: string,
  stripeData: {
    customerId: string
    subscriptionId: string
    priceId: string
  }
): Promise<void> {
  await updateUserSubscription(userId, {
    plan: 'premium',
    status: 'active',
    conversionsLimit: -1, // Unlimited
    stripeCustomerId: stripeData.customerId,
    stripeSubscriptionId: stripeData.subscriptionId,
    stripePriceId: stripeData.priceId,
  })
}

export async function downgradeToFree(userId: string): Promise<void> {
  await updateUserSubscription(userId, {
    plan: 'free',
    status: 'active',
    conversionsLimit: 3,
    stripeCustomerId: undefined,
    stripeSubscriptionId: undefined,
    stripePriceId: undefined,
  })
}

// ============================================
// Conversion Operations
// ============================================

export async function saveConversion(
  data: Omit<ConversionResult, 'id'>
): Promise<string> {
  const docRef = doc(collection(getFirebaseDb(), COLLECTIONS.CONVERSIONS))

  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.fromDate(data.createdAt),
  })

  return docRef.id
}

export async function getConversion(
  conversionId: string
): Promise<ConversionResult | null> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.CONVERSIONS, conversionId)
  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  return {
    id: docSnap.id,
    userId: data.userId,
    originalUrl: data.originalUrl,
    optimizedUrl: data.optimizedUrl,
    originalFileName: data.originalFileName,
    originalFileSize: data.originalFileSize,
    analysisResult: data.analysisResult as CVAnalysisResult,
    targetSector: data.targetSector,
    targetJobTitle: data.targetJobTitle,
    createdAt: data.createdAt.toDate(),
    processingTime: data.processingTime,
  }
}

export async function getUserConversions(
  userId: string,
  limitCount = 10,
  offset = 0
): Promise<ConversionHistoryItem[]> {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  ]

  const q = query(collection(getFirebaseDb(), COLLECTIONS.CONVERSIONS), ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      userId: data.userId,
      originalFileName: data.originalFileName,
      originalFileSize: data.originalFileSize,
      originalUrl: data.originalUrl,
      optimizedUrl: data.optimizedUrl,
      targetSector: data.targetSector,
      targetJobTitle: data.targetJobTitle,
      originalScore: data.analysisResult?.originalScore || 0,
      optimizedScore: data.analysisResult?.optimizedScore || 0,
      scoreImprovement:
        (data.analysisResult?.optimizedScore || 0) -
        (data.analysisResult?.originalScore || 0),
      createdAt: data.createdAt.toDate(),
    }
  })
}

export async function deleteConversion(conversionId: string): Promise<void> {
  const docRef = doc(getFirebaseDb(), COLLECTIONS.CONVERSIONS, conversionId)
  await deleteDoc(docRef)
}

export async function countUserConversions(userId: string): Promise<number> {
  const q = query(
    collection(getFirebaseDb(), COLLECTIONS.CONVERSIONS),
    where('userId', '==', userId)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

// ============================================
// Utility Functions
// ============================================

export function getConversionsLimit(plan: SubscriptionPlan): number {
  switch (plan) {
    case 'free':
      return 3
    case 'premium':
      return -1 // Unlimited
    case 'enterprise':
      return -1 // Unlimited
    default:
      return 3
  }
}

export function canConvert(subscription: UserSubscription): boolean {
  if (subscription.status !== 'active') {
    return false
  }

  if (subscription.conversionsLimit === -1) {
    return true // Unlimited
  }

  return subscription.conversionsUsed < subscription.conversionsLimit
}
