'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Calendar, RefreshCw } from 'lucide-react'
import { getEventStatus, formatEventStatus } from '../../utils/dateUtils'

interface Event {
  date: string
  title: string
  type: 'game' | 'tryout' | 'practice' | 'other'
  location: string
  time: string
  status: string
  description: string
}

export default function ScheduleManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const newEventTemplate: Event = {
    date: '',
    title: '',
    type: 'game',
    location: '',
    time: '',
    status: 'upcoming',
    description: ''
  }

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/admin/schedule')
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSchedule = async (updatedEvents: Event[]) => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ events: updatedEvents })
      })

      if (response.ok) {
        setEvents(updatedEvents)
        setEditingIndex(null)
        setIsAddingNew(false)
      } else {
        alert('Failed to save schedule')
      }
    } catch (error) {
      alert('Error saving schedule')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddEvent = (newEvent: Event) => {
    const updatedEvents = [...events, newEvent]
    saveSchedule(updatedEvents)
  }

  const handleUpdateEvent = (updatedEvent: Event, index: number) => {
    const updatedEvents = events.map((e, i) => i === index ? updatedEvent : e)
    saveSchedule(updatedEvents)
  }

  const handleDeleteEvent = (index: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((_, i) => i !== index)
      saveSchedule(updatedEvents)
    }
  }

  const updateEventStatuses = () => {
    const updatedEvents = events.map(event => ({
      ...event,
      status: getEventStatus(event.date, event.status)
    }))
    
    // Check if any statuses actually changed
    const hasChanges = updatedEvents.some((event, index) => 
      event.status !== events[index].status
    )
    
    if (hasChanges) {
      saveSchedule(updatedEvents)
    } else {
      alert('All event statuses are already up to date!')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading schedule...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-legion-gray-900 dark:text-white">
          Event Schedule
        </h2>
        <div className="flex space-x-3">
          <button
            onClick={updateEventStatuses}
            className="bg-legion-gray-600 hover:bg-legion-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Update Statuses</span>
          </button>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-legion-red-600 hover:bg-legion-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Add New Event Form */}
        {isAddingNew && (
          <EventForm
            event={newEventTemplate}
            onSave={handleAddEvent}
            onCancel={() => setIsAddingNew(false)}
            isSaving={isSaving}
            isNew={true}
          />
        )}

        {/* Events List */}
        {events.map((event, index) => (
          <div key={index}>
            {editingIndex === index ? (
              <EventForm
                event={event}
                onSave={(updatedEvent) => handleUpdateEvent(updatedEvent, index)}
                onCancel={() => setEditingIndex(null)}
                isSaving={isSaving}
                isNew={false}
              />
            ) : (
              <EventCard
                event={event}
                onEdit={() => setEditingIndex(index)}
                onDelete={() => handleDeleteEvent(index)}
              />
            )}
          </div>
        ))}

        {events.length === 0 && !isAddingNew && (
          <div className="text-center py-12 text-legion-gray-500 dark:text-legion-gray-400">
            No events scheduled. Add your first event!
          </div>
        )}
      </div>
    </div>
  )
}

interface EventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'game': return '⚾'
      case 'tryout': return '🎯'
      case 'practice': return '🏃'
      default: return '📅'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'game': return 'bg-legion-red-600'
      case 'tryout': return 'bg-legion-gray-600'
      case 'practice': return 'bg-legion-red-400'
      default: return 'bg-legion-gray-500'
    }
  }

  const currentStatus = getEventStatus(event.date, event.status)
  const statusDisplay = formatEventStatus(currentStatus)

  return (
    <div className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-16 h-16 ${getEventColor(event.type)} text-white rounded-lg flex flex-col items-center justify-center`}>
          <span className="text-2xl mb-1">{getEventIcon(event.type)}</span>
          <span className="text-xs font-bold">{event.date}</span>
        </div>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-legion-gray-900 dark:text-white">
              {event.title}
            </h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusDisplay.color} bg-opacity-10`}>
              {statusDisplay.text}
            </span>
          </div>
          <p className="text-legion-red-600 font-medium capitalize">
            {event.type} • {event.time}
          </p>
          <p className="text-sm text-legion-gray-600 dark:text-legion-gray-300">
            {event.location}
          </p>
          <p className="text-xs text-legion-gray-500 dark:text-legion-gray-400 mt-1">
            {event.description}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="p-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-legion-red-600 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-legion-gray-600 dark:text-legion-gray-300 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

interface EventFormProps {
  event: Event
  onSave: (event: Event) => void
  onCancel: () => void
  isSaving: boolean
  isNew: boolean
}

function EventForm({ event, onSave, onCancel, isSaving, isNew }: EventFormProps) {
  const [formData, setFormData] = useState(event)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const eventTypes = [
    { value: 'game', label: 'Game' },
    { value: 'tryout', label: 'Tryout' },
    { value: 'practice', label: 'Practice' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <form onSubmit={handleSubmit} className="bg-legion-gray-50 dark:bg-legion-gray-700 rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Date
          </label>
          <input
            type="text"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="March 15"
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="vs Team Name or Event Title"
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Type
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Event['type'] })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Time
          </label>
          <input
            type="text"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            placeholder="7:00 PM"
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Legion Field, Shelley"
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
            Status
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent"
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-legion-gray-700 dark:text-legion-gray-300 mb-1">
          Description
        </label>
        <textarea
          required
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the event"
          className="w-full px-3 py-2 border border-legion-gray-300 dark:border-legion-gray-600 dark:bg-legion-gray-800 dark:text-white rounded focus:ring-2 focus:ring-legion-red-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-legion-red-600 hover:bg-legion-red-700 disabled:bg-legion-gray-400 text-white px-4 py-2 rounded font-medium flex items-center space-x-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : isNew ? 'Add Event' : 'Save Changes'}</span>
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