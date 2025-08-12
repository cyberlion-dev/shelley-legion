'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, X } from 'lucide-react'

interface TeamInfo {
  teamName: string
  tagline: string
  description: string
  contact: {
    phone: string
    email: string
    address: string
  }
  socialMedia: {
    facebook: string
    twitter: string
    instagram: string
  }
}

export default function TeamInfoManager() {
  const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTeamInfo()
  }, [])

  const fetchTeamInfo = async () => {
    try {
      const response = await fetch('/api/admin/team-info')
      const data = await response.json()
      setTeamInfo(data)
    } catch (error) {
      console.error('Failed to fetch team info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTeamInfo = async (updatedInfo: TeamInfo) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/team-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedInfo)
      })

      if (response.ok) {
        setTeamInfo(updatedInfo)
        setIsEditing(false)
      } else {
        alert('Failed to save team info')
      }
    } catch (error) {
      alert('Error saving team info')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading team info...</div>
  }

  if (!teamInfo) {
    return <div className="text-center py-8">Failed to load team info</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-legion-gray-900 dark:text-white">
          Team Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-legion-red-600 hover:bg-legion-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Info</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <TeamInfoForm
          teamInfo={teamInfo}
          onSave={saveTeamInfo}
          onCancel={() => setIsEditing(false)}
          isSaving={isSaving}
        />
      ) : (
        <TeamInfoDisplay teamInfo={teamInfo} />
      )}
    </div>
  )
}

interface TeamInfoDisplayProps {
  teamInfo: TeamInfo
}

function TeamInfoDisplay({ teamInfo }: TeamInfoDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Team Name
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium">
              {teamInfo.teamName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Tagline
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium">
              {teamInfo.tagline}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Description
            </label>
            <p className="text-legion-gray-900 dark:text-white">
              {teamInfo.description}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Phone
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium">
              {teamInfo.contact.phone}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Email
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium">
              {teamInfo.contact.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Address
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium">
              {teamInfo.contact.address}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Facebook
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium break-all">
              {teamInfo.socialMedia.facebook}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Twitter
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium break-all">
              {teamInfo.socialMedia.twitter}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-600 dark:text-legion-gray-300">
              Instagram
            </label>
            <p className="text-legion-gray-900 dark:text-white font-medium break-all">
              {teamInfo.socialMedia.instagram}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TeamInfoFormProps {
  teamInfo: TeamInfo
  onSave: (teamInfo: TeamInfo) => void
  onCancel: () => void
  isSaving: boolean
}

function TeamInfoForm({ teamInfo, onSave, onCancel, isSaving }: TeamInfoFormProps) {
  const [formData, setFormData] = useState(teamInfo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Team Name
            </label>
            <input
              type="text"
              required
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Tagline
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Phone
            </label>
            <input
              type="text"
              required
              value={formData.contact.phone}
              onChange={(e) => setFormData({ 
                ...formData, 
                contact: { ...formData.contact, phone: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.contact.email}
              onChange={(e) => setFormData({ 
                ...formData, 
                contact: { ...formData.contact, email: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Address
            </label>
            <input
              type="text"
              required
              value={formData.contact.address}
              onChange={(e) => setFormData({ 
                ...formData, 
                contact: { ...formData.contact, address: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-legion-gray-900 dark:text-white mb-4">
          Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Facebook URL
            </label>
            <input
              type="url"
              value={formData.socialMedia.facebook}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialMedia: { ...formData.socialMedia, facebook: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Twitter URL
            </label>
            <input
              type="url"
              value={formData.socialMedia.twitter}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialMedia: { ...formData.socialMedia, twitter: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              value={formData.socialMedia.instagram}
              onChange={(e) => setFormData({ 
                ...formData, 
                socialMedia: { ...formData.socialMedia, instagram: e.target.value }
              })}
              className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-legion-red-600 hover:bg-legion-red-700 disabled:bg-legion-gray-400 text-white px-6 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-legion-gray-500 hover:bg-legion-gray-600 text-white px-6 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>
    </form>
  )
}