'use client'

import Link from 'next/link'
import { XCircleIcon } from '@heroicons/react/24/solid'

export default function CancelPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-2xl py-32 text-center">
        <div className="flex justify-center">
          <XCircleIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Payment Cancelled
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Your payment was cancelled. No charges were made. You can try again anytime.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/pricing"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Go to Dashboard <span aria-hidden="true">→</span>
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Need help? Contact our support team.
        </p>
      </div>
    </div>
  )
}
