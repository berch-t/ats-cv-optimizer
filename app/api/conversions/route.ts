import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

interface ConversionData {
  id: string
  userId: string
  originalUrl: string
  optimizedUrl: string
  originalFileName: string
  originalFileSize: number
  analysisResult?: {
    originalScore?: number
    optimizedScore?: number
    atsCompatibility?: {
      overall: number
    }
  }
  createdAt: Date | string
  processingTime: number
}

export async function GET(_request: NextRequest) {
  try {
    // Check Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get session token
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify session
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true)
    const userId = decodedToken.uid

    // Get conversions from Firestore
    const conversionsRef = adminDb.collection('conversions')
    const snapshot = await conversionsRef
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const conversions: ConversionData[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        originalUrl: data.originalUrl,
        optimizedUrl: data.optimizedUrl,
        originalFileName: data.originalFileName,
        originalFileSize: data.originalFileSize,
        analysisResult: data.analysisResult,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        processingTime: data.processingTime,
      }
    })

    // Calculate stats
    const scores = conversions
      .map((c) => c.analysisResult?.atsCompatibility?.overall || c.analysisResult?.optimizedScore)
      .filter((s): s is number => typeof s === 'number')

    const stats = {
      totalConversions: conversions.length,
      averageScore: scores.length > 0
        ? Math.round(scores.reduce((acc, s) => acc + s, 0) / scores.length)
        : 0,
      bestScore: scores.length > 0
        ? Math.max(...scores)
        : 0,
      scoreImprovement: 15, // Placeholder - calculate from before/after scores
    }

    return NextResponse.json({ conversions, stats })
  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversions' },
      { status: 500 }
    )
  }
}
