'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Edit2, Save, X } from 'lucide-react'

interface TeamStat {
  label: string
  value: string
  description: string
  icon: string
}

export default function StatsManager() {
  const [stats, setStats] = useState<TeamStat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data.teamStats || [])
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveStats = async (updatedStats: TeamStat[]) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teamStats: updatedStats })
      })

      if (response.ok) {
        setStats(updatedStats)
        setEditingIndex(null)
      } else {
        alert('Failed to save stats')
      }
    } catch (error) {
      alert('Error saving stats')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateStat = (updatedStat: TeamStat, index: number) => {
    const updatedStats = stats.map((s, i) => i === index ? updatedStat : s)
    saveStats(updatedStats)
  }

  const iconOptions = [
    { value: 'trophy', label: 'Trophy' },
    { value: 'target', label: 'Target' },
    { value: 'trending-up', label: 'Trending Up' },
    { value: 'award', label: 'Award' }
  ]

  if (isLoading) {
    return <div className="text-center py-8">Loading stats...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-legion-gray-900 dark:text-white">
          Team Statistics
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <StatForm
                stat={stat}
                iconOptions={iconOptions}
                onSave={(updatedStat) => handleUpdateStat(updatedStat, index)}
                onCancel={() => setEditingIndex(null)}
                isSaving={isSaving}
              />
            ) : (
              <StatCard
                stat={stat}
                onEdit={() => setEditingIndex(index)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

interface StatCardProps {
  stat: TeamStat
  onEdit: () => void
}

function StatCard({ stat, onEdit }: StatCardProps) {
  return (
    <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6 relative">
      <button
        onClick={onEdit}
        className="absolute top-4 right-4 p-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-legion-red-600 transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      
      <div className="text-center">
        <div className="w-16 h-16 bg-legion-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-legion-gray-900 dark:text-white mb-2">
          {stat.value}
        </div>
        <div className="text-lg font-semibold text-legion-red-600 mb-1">
          {stat.label}
        </div>
        <div className="text-sm text-legion-gray-600 dark:text-legion-gray-300">
          {stat.description}
        </div>
      </div>
    </div>
  )
}

interface StatFormProps {
  stat: TeamStat
  iconOptions: { value: string; label: string }[]
  onSave: (stat: TeamStat) => void
  onCancel: () => void
  isSaving: boolean
}

function StatForm({ stat, iconOptions, onSave, onCancel, isSaving }: StatFormProps) {
  const [formData, setFormData] = useState(stat)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Label
          </label>
          <input
            type="text"
            required
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Value
          </label>
          <input
            type="text"
            required
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Icon
          </label>
          <select
            required
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          >
            {iconOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-legion-red-600 hover:bg-legion-red-700 disabled:bg-legion-gray-400 text-white px-4 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-legion-gray-500 hover:bg-legion-gray-600 text-white px-4 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  )
}