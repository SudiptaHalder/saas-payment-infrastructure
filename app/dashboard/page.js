'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CreditCardIcon,
  ArrowPathIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CheckBadgeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid'
import toast, { Toaster } from 'react-hot-toast'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [stats, setStats] = useState({
    apiCalls: 1243,
    projects: 3,
    teamMembers: 1,
    storage: 2.4
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      
      // Fetch user's subscription from our API
      try {
        const response = await fetch(`/api/subscriptions?userId=${user.id}`)
        const data = await response.json()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
      
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error('Failed to open billing portal')
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing'
  const plan = subscription?.priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ? 'Pro' : 'Free'
  const planColor = plan === 'Pro' ? 'from-purple-600 to-pink-600' : 'from-gray-600 to-gray-700'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Breadcrumb */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">Overview</span>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Help button */}
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <QuestionMarkCircleIcon className="w-5 h-5" />
              </button>
              
              {/* Profile dropdown - simplified for now */}
              <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.email?.split('@')[0]}! 👋
                </h2>
                <p className="text-blue-100">
                  Here's what's happening with your account today.
                </p>
              </div>
              <div className="hidden md:block">
                <SparklesIcon className="w-16 h-16 text-white/30" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total API Calls', value: stats.apiCalls.toLocaleString(), icon: ChartBarIcon, change: '+12%', color: 'blue' },
            { label: 'Active Projects', value: stats.projects, icon: DocumentTextIcon, change: '+2', color: 'green' },
            { label: 'Team Members', value: stats.teamMembers, icon: UserCircleIcon, change: '0', color: 'purple' },
            { label: 'Storage Used', value: `${stats.storage} GB`, icon: Cog6ToothIcon, change: '+0.3 GB', color: 'orange' },
          ].map((stat, index) => {
            const Icon = stat.icon
            const colors = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              orange: 'bg-orange-50 text-orange-600',
            }
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colors[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Subscription Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Current Plan */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${planColor} text-white`}>
                        {plan === 'Pro' ? <CheckBadgeIcon className="w-5 h-5" /> : <ClockIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Plan</p>
                        <p className="font-semibold text-gray-900">{plan} Plan</p>
                      </div>
                    </div>
                    {plan === 'Free' ? (
                      <button
                        onClick={() => router.push('/pricing')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:scale-105 transition-all"
                      >
                        Upgrade
                      </button>
                    ) : (
                      <button
                        onClick={handleManageBilling}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Manage
                      </button>
                    )}
                  </div>

                  {/* Next Billing */}
                  {subscription?.currentPeriodEnd && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Next Billing Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.ceil((new Date(subscription.currentPeriodEnd) - new Date()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                        <CreditCardIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { action: 'Payment successful', amount: '$10.00', time: '2 hours ago', status: 'success' },
                  { action: 'Subscription updated', amount: null, time: '2 days ago', status: 'info' },
                  { action: 'API key generated', amount: null, time: '5 days ago', status: 'info' },
                ].map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      {activity.status === 'success' ? (
                        <CheckCircleSolid className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowPathIcon className="w-5 h-5 text-blue-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <span className="text-sm font-semibold text-gray-900">{activity.amount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Usage */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <DocumentTextIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Create new project</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-50 text-green-600">
                    <UserCircleIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Invite team member</span>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                    <Cog6ToothIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">API settings</span>
                </button>
                <button 
                  onClick={handleManageBilling}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
                >
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <CurrencyDollarIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Billing portal</span>
                </button>
              </div>
            </motion.div>

            {/* Usage Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Usage Summary</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">API Calls</span>
                    <span className="font-medium text-gray-900">1,243 / 10,000</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '12.43%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Storage</span>
                    <span className="font-medium text-gray-900">2.4 GB / 5 GB</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Team Members</span>
                    <span className="font-medium text-gray-900">1 / {plan === 'Pro' ? '5' : '1'}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${plan === 'Pro' ? 'bg-purple-600' : 'bg-gray-400'}`} 
                         style={{ width: plan === 'Pro' ? '20%' : '100%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sign Out Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onClick={handleSignOut}
              className="w-full p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all group"
            >
              <div className="flex items-center justify-center space-x-2">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-red-600 transition-colors">
                  Sign Out
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
