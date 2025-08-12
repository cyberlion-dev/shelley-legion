'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, BarChart3, Settings, Eye, EyeOff } from 'lucide-react'
import {
  AdminLogin,
  RosterManager,
  ScheduleManager,
  StatsManager,
  TeamInfoManager
} from './components'

type AdminSection = 'roster' | 'schedule' | 'stats' | 'team-info'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminSection>('roster')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('admin-token')
    if (token) {
      // Verify token with server
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? setIsAuthenticated(true) : localStorage.removeItem('admin-token'))
      .catch(() => localStorage.removeItem('admin-token'))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (token: string) => {
    localStorage.setItem('admin-token', token)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-legion-gray-50 dark:bg-legion-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legion-red-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  const sections = [
    { id: 'roster' as AdminSection, name: 'Team Roster', icon: Users },
    { id: 'schedule' as AdminSection, name: 'Event Schedule', icon: Calendar },
    { id: 'stats' as AdminSection, name: 'Team Stats', icon: BarChart3 },
    { id: 'team-info' as AdminSection, name: 'Team Info', icon: Settings },
  ]

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'roster':
        return <RosterManager />
      case 'schedule':
        return <ScheduleManager />
      case 'stats':
        return <StatsManager />
      case 'team-info':
        return <TeamInfoManager />
      default:
        return <RosterManager />
    }
  }

  return (
    <div className="min-h-screen bg-legion-gray-50 dark:bg-legion-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-legion-gray-800 shadow-sm border-b border-legion-gray-200 dark:border-legion-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-legion-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">SL</span>
              </div>
              <h1 className="text-xl font-bold text-legion-gray-900 dark:text-white">
                Shelley Legion Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                className="flex items-center space-x-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-legion-red-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </a>
              <button
                onClick={handleLogout}
                className="bg-legion-red-600 hover:bg-legion-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-legion-red-600 text-white'
                        : 'text-legion-gray-700 dark:text-legion-gray-300 hover:bg-legion-gray-100 dark:hover:bg-legion-gray-700'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{section.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-legion-gray-800 rounded-xl shadow-sm border border-legion-gray-200 dark:border-legion-gray-700 p-6">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}