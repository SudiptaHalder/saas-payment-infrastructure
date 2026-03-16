'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import PricingCard from '@/components/PricingCard'
import { Toaster } from 'react-hot-toast'
import { SparklesIcon } from '@heroicons/react/24/outline'

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    features: [
      '3 projects',
      'Basic analytics',
      'Community support',
      '100 API calls/day',
    ],
    priceId: null,
  },
  {
    name: 'Pro',
    description: 'For professionals and teams',
    monthlyPrice: 10,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '10,000 API calls/day',
      'Team members (5)',
      'Custom integrations',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start free. Upgrade anytime. Cancel when you want.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        {/* Test Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>💳 Test Mode - Use card: 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  )
}
