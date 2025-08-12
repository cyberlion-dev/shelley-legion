'use client'

import { useState } from 'react'
import { Lock, User } from 'lucide-react'

interface AdminLoginProps {
  onLogin: (token: string) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.token)
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-legion-gray-50 dark:bg-legion-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-legion-gray-800 rounded-xl shadow-lg p-8 border border-legion-gray-200 dark:border-legion-gray-700">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-legion-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legion-gray-900 dark:text-white mb-2">
              Admin Login
            </h1>
            <p className="text-legion-gray-600 dark:text-legion-gray-300">
              Sign in to manage Shelley Legion
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Username
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-legion-gray-400 cursor-not-allowed'
                  : 'bg-legion-red-600 hover:bg-legion-red-700 transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}