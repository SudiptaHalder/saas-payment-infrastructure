'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid'

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setLoading(false)
        return
      }

      // In a real app, you'd have an API endpoint that uses Prisma
      // For now, we'll simulate with a fetch
      try {
        const response = await fetch(`/api/subscriptions?userId=${user.id}`)
        const data = await response.json()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [supabase])

  if (loading) {
    return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'
  const plan = subscription?.priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ? 'Pro' : 'Free'

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          {isActive ? (
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          ) : (
            <XCircleIcon className="h-10 w-10 text-gray-400" />
          )}
          <div className="ml-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isActive ? 'Active Subscription' : 'No Active Subscription'}
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                {isActive
                  ? `You are currently on the ${plan} plan.`
                  : 'You are on the free plan. Upgrade to Pro for more features.'}
              </p>
              {subscription?.currentPeriodEnd && (
                <p className="mt-1">
                  Next billing date:{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
