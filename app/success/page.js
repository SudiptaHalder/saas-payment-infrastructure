'use client'

import Link from 'next/link'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 mb-6 shadow-lg"
        >
          <CheckCircleIcon className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          Your Pro subscription is now active. Welcome to the club! 🎉
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-8 border border-green-100"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-2">
            <SparklesIcon className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">What's next?</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-2">
            <li>✨ Access all Pro features</li>
            <li>🚀 Create unlimited projects</li>
            <li>👥 Invite team members</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <Link
            href="/dashboard"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02] transition-all duration-200"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-4 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-xs text-gray-400"
        >
          ✨ Test Mode - This was a test transaction
        </motion.p>
      </motion.div>
    </div>
  )
}
