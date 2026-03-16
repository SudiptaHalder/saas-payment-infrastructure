'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import { CheckIcon } from '@heroicons/react/24/outline'
import toast, { Toaster } from 'react-hot-toast'

const plans = [
  {
    name: 'Free',
    price: 0,
    features: [
      '3 projects',
      'Basic analytics',
      'Community support',
      '100 API calls/day',
    ],
  },
  {
    name: 'Pro',
    price: 10,
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '10,000 API calls/day',
      '5 team members',
      'Custom integrations',
    ],
  },
]

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubscribe = async (planName) => {
    if (planName === 'Free') {
      router.push('/signup')
      return
    }

    setLoading(true)
    
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      sessionStorage.setItem('pendingSubscribe', 'true')
      toast.success('Please login to subscribe')
      router.push('/login?redirect=home')
      setLoading(false)
      return
    }

    // Go to checkout
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            SaaS Billing Demo
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            A production-ready subscription management system built with Next.js, Stripe, and Supabase
          </p>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            No hidden fees. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.name === 'Pro' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.name === 'Pro' && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                
                <button
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    plan.name === 'Pro'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Loading...' : plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </button>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Test Card Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            💳 Test Mode — Use card: <span className="font-mono bg-gray-100 px-2 py-1 rounded">4242 4242 4242 4242</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Any future expiry, any CVC
          </p>
        </div>
      </div>
    </div>
  )
}
