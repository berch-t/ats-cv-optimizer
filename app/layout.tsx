import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Navbar } from '@/components/shared/navbar'
import { Footer } from '@/components/shared/footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ATS CV Optimizer - Land More Interviews',
    template: '%s | ATS CV Optimizer',
  },
  description:
    'Optimize your CV for Applicant Tracking Systems with AI-powered analysis. Get past the robots and land more interviews.',
  keywords: [
    'ATS',
    'CV',
    'resume',
    'optimizer',
    'applicant tracking system',
    'job search',
    'career',
    'AI',
  ],
  authors: [{ name: 'ATS CV Optimizer' }],
  creator: 'ATS CV Optimizer',
  publisher: 'ATS CV Optimizer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ats-cv-optimizer.com',
    siteName: 'ATS CV Optimizer',
    title: 'ATS CV Optimizer - Land More Interviews',
    description:
      'Optimize your CV for Applicant Tracking Systems with AI-powered analysis.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ATS CV Optimizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATS CV Optimizer - Land More Interviews',
    description:
      'Optimize your CV for Applicant Tracking Systems with AI-powered analysis.',
    images: ['/og-image.png'],
    creator: '@atsoptimizer',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 pt-16">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
