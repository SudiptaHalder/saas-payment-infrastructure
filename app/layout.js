import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SaaS Billing - Production-ready Subscription Management',
  description: 'A production-style SaaS billing system built with Next.js 14, Stripe, and Supabase. Perfect for your developer portfolio.',
  keywords: 'saas, billing, stripe, supabase, nextjs, subscriptions',
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'SaaS Billing Demo',
    description: 'Production-ready subscription management system',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
}
