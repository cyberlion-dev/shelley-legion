export function getEventStatus(eventDate: string, currentStatus: string): string {
  // Don't override manually set completed/cancelled status
  if (currentStatus === 'completed' || currentStatus === 'cancelled') {
    return currentStatus
  }

  try {
    // Parse the event date (assuming format like "March 15")
    const currentYear = new Date().getFullYear()
    const eventDateStr = `${eventDate} ${currentYear}`
    const eventDateTime = new Date(eventDateStr)
    const today = new Date()
    
    // Set time to start of day for comparison
    today.setHours(0, 0, 0, 0)
    eventDateTime.setHours(0, 0, 0, 0)
    
    if (eventDateTime < today) {
      return 'completed'
    } else if (eventDateTime.getTime() === today.getTime()) {
      return 'today'
    } else {
      return 'upcoming'
    }
  } catch (error) {
    // If date parsing fails, return original status
    return currentStatus
  }
}

export function formatEventStatus(status: string): { text: string; color: string } {
  switch (status) {
    case 'completed':
      return { text: 'Completed', color: 'text-green-600 dark:text-green-400' }
    case 'today':
      return { text: 'Today', color: 'text-orange-600 dark:text-orange-400' }
    case 'upcoming':
      return { text: 'Upcoming', color: 'text-blue-600 dark:text-blue-400' }
    case 'cancelled':
      return { text: 'Cancelled', color: 'text-red-600 dark:text-red-400' }
    default:
      return { text: status, color: 'text-legion-gray-600 dark:text-legion-gray-400' }
  }
}