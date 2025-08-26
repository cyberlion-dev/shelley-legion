import { Calendar, MapPin, Clock, Plus } from 'lucide-react'
import React from 'react'
import BaseballBackground from './BaseballBackground'
import { getEventStatus, formatEventStatus } from '../utils/dateUtils'
import scheduleData from '../../data/schedule.json'

interface Event {
  date: string
  title: string
  type: 'game' | 'tryout' | 'practice' | 'other'
  location: string
  time: string
  status: string
  description: string
}

export default function ScheduleSection() {
  const events = scheduleData.events as Event[]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'game':
        return '⚾'
      case 'tryout':
        return '🎯'
      case 'practice':
        return '🏃'
      default:
        return '📅'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'game':
        return 'bg-legion-red-600'
      case 'tryout':
        return 'bg-legion-gray-600'
      case 'practice':
        return 'bg-legion-red-400'
      default:
        return 'bg-legion-gray-500'
    }
  }

  const addToCalendar = (event: any) => {
    const startDate = new Date(`${event.date} 2025 ${event.time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours later
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`
    
    window.open(calendarUrl, '_blank')
  }

  return (
    <section id="schedule" className="section-padding bg-white dark:bg-legion-gray-800 relative overflow-hidden">
      <BaseballBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-legion-red-600 mr-3" />
            <h2 className="text-4xl font-bold text-legion-gray-900 dark:text-white">Upcoming Events</h2>
          </div>
          <p className="text-xl text-legion-gray-600 dark:text-legion-gray-300 max-w-2xl mx-auto">
            Stay up to date with games, tryouts, practices, and team events
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {events.map((event, index) => {
          const currentStatus = getEventStatus(event.date, event.status)
          const statusDisplay = formatEventStatus(currentStatus)
          
          return (
            <div
              key={index}
              className="bg-gradient-to-r from-legion-red-50 to-white dark:from-legion-gray-800 dark:to-legion-gray-700 rounded-xl shadow-md p-6 card-hover border-l-4 border-legion-red-600"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <div className={`${getEventColor(event.type)} text-white rounded-lg p-3 text-center min-w-[80px] flex flex-col items-center`}>
                    <span className="text-2xl mb-1">{getEventIcon(event.type)}</span>
                    <div className="font-bold text-xs">{event.date}</div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-xl font-bold text-legion-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <span className={`text-sm font-semibold px-2 py-1 rounded-full ${statusDisplay.color} bg-opacity-10`}>
                        {statusDisplay.text}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-legion-gray-600 dark:text-legion-gray-300 mb-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <p className="text-sm text-legion-gray-600 dark:text-legion-gray-300">
                      {event.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  {currentStatus !== 'completed' && currentStatus !== 'cancelled' && (
                    <button
                      onClick={() => addToCalendar(event)}
                      className="bg-legion-red-600 hover:bg-legion-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Calendar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}