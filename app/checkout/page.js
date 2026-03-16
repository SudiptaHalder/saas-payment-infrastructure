'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@/utils/supabase-client'
import { 
  CreditCardIcon, 
  LockClosedIcon, 
  ShieldCheckIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  SparklesIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!stripe || !elements) return

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Payment Details</h3>
        </div>
        <PaymentElement />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <LockClosedIcon className="w-5 h-5" />
            <span>Pay $10 securely</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <ShieldCheckIcon className="w-4 h-4" />
          <span>256-bit SSL</span>
        </div>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center gap-1">
          <CheckBadgeIcon className="w-4 h-4" />
          <span>PCI Compliant</span>
        </div>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const initCheckout = async () => {
      // Check if user is logged in
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login?redirect=checkout')
        return
      }

      try {
        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: session.user.id,
            priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID 
          }),
        })

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        toast.error('Failed to initialize checkout')
      } finally {
        setLoading(false)
      }
    }

    initCheckout()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <CreditCardIcon className="w-8 h-8 text-blue-600 absolute inset-0 m-auto opacity-50" />
          </div>
          <p className="text-gray-600 font-medium">Preparing secure checkout...</p>
          <p className="text-sm text-gray-400 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <Toaster position="top-center" />
      
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 shadow-lg"
                >
                  <CreditCardIcon className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h2>
                <p className="text-gray-600">You're just one step away from upgrading to Pro</p>
              </div>

              {/* Test Mode Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-600 text-sm font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-yellow-800 mb-1">🔧 Test Mode</p>
                    <p className="text-xs text-yellow-700">
                      Use test card: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">4242 4242 4242 4242</span>
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">Any future expiry (12/34), any CVC (123)</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 mb-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-blue-600" />
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pro Plan - Monthly</span>
                    <span className="font-medium text-gray-900">$10.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-500">$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 my-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        $10.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Form */}
              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              )}

              {/* Money-back guarantee */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                <span>14-day money-back guarantee</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Plan Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
                What's included in Pro
              </h3>
              
              <div className="space-y-4">
                {[
                  { icon: ChartBarIcon, text: 'Advanced analytics dashboard' },
                  { icon: UserGroupIcon, text: 'Up to 5 team members' },
                  { icon: DocumentTextIcon, text: 'Unlimited projects' },
                  { icon: ClockIcon, text: 'Priority 24/7 support' },
                ].map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-gray-700">{benefit.text}</span>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500 text-white">
                    <CheckBadgeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">14-day free trial</p>
                    <p className="text-sm text-gray-600">Cancel anytime, no questions asked</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
              <p className="text-sm text-gray-500 text-center mb-4">Trusted by thousands of businesses</p>
              <div className="flex justify-center gap-8">
                {[
                  { name: 'VISA', color: 'text-blue-800' },
                  { name: 'Mastercard', color: 'text-red-600' },
                  { name: 'AMEX', color: 'text-blue-500' },
                ].map((brand) => (
                  <span key={brand.name} className={`font-bold text-sm ${brand.color} opacity-50`}>
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20">
              <h4 className="font-semibold text-gray-900 mb-4">Quick Questions</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Can I cancel anytime?</p>
                  <p className="text-xs text-gray-500">Yes, you can cancel with one click</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">How does billing work?</p>
                  <p className="text-xs text-gray-500">Monthly billing, cancel anytime</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
