'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase-client'
import toast from 'react-hot-toast'

export default function PricingCard({ plan }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubscribe = async () => {
    if (!plan.priceId) {
      router.push('/signup')
      return
    }

    setIsLoading(true)
    
    try {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        // Save the intent to subscribe in sessionStorage
        sessionStorage.setItem('pendingSubscription', 'true')
        sessionStorage.setItem('pendingPriceId', plan.priceId)
        
        toast.success('Please login to continue')
        router.push('/login?redirectTo=checkout')
        setIsLoading(false)
        return
      }

      // User is logged in, go directly to checkout
      router.push(`/checkout?price_id=${plan.priceId}`)
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
      plan.name === 'Pro' ? 'ring-2 ring-blue-500' : ''
    }`}>
      {plan.name === 'Pro' && (
        <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600 mb-6">{plan.description}</p>
        
        <div className="mb-6">
          <span className="text-5xl font-bold text-gray-900">${plan.monthlyPrice}</span>
          <span className="text-gray-600">/month</span>
        </div>
        
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            plan.name === 'Pro'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          } disabled:opacity-50`}
        >
          {isLoading ? 'Loading...' : plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
        </button>

        <ul className="mt-8 space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
