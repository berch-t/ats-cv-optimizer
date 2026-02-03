'use client'

import Link from 'next/link'
import { FileText, Github, Twitter, Linkedin } from 'lucide-react'

const navigation = {
  product: [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'How it works', href: '/#how-it-works' },
    { name: 'FAQ', href: '/#faq' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
  social: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/atsoptimizer',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/atsoptimizer',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/atsoptimizer',
      icon: Linkedin,
    },
  ],
}

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-emerald-500">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">
                  ATS Optimizer
                </span>
              </Link>
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 max-w-xs">
                Optimize your CV for Applicant Tracking Systems and land more
                interviews with AI-powered analysis.
              </p>
              <div className="mt-6 flex gap-4">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.product.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              &copy; {new Date().getFullYear()} ATS CV Optimizer. All rights
              reserved.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Made with ❤️ by{' '}
              <a
                href="https://www.linkedin.com/in/thomas-berchet-107043300"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500 hover:text-sky-600 transition-colors"
              >
                Thomas Berchet
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
