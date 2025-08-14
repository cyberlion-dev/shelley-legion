import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { put } from '@vercel/blob'
import { list } from '@vercel/blob'

function getJWTSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

// Verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  try {
    return jwt.verify(token, getJWTSecret())
  } catch (error) {
    return null
  }
}

// GET - Read schedule
export async function GET() {
  try {
    // Try to fetch from Vercel Blob
    const blobs = await list({ prefix: 'schedule.json' })

    if (blobs.blobs.length > 0) {
      const response = await fetch(blobs.blobs[0].url)
      if (response.ok) {
        const scheduleData = await response.json()
        const result = NextResponse.json(scheduleData)
        // Prevent caching
        result.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        result.headers.set('Pragma', 'no-cache')
        result.headers.set('Expires', '0')
        return result
      }
    }
  } catch (error) {
    console.log('Blob storage not available, using fallback:', error)
  }
  
  // Fallback to default data
  const defaultSchedule = {
    events: [
      {
        date: "January 15",
        title: "vs Twin Falls Tigers",
        type: "game",
        location: "Legion Field, Shelley",
        time: "7:00 PM",
        status: "upcoming",
        description: "Home game against Twin Falls Tigers"
      },
      {
        date: "January 22",
        title: "Winter Practice",
        type: "practice",
        location: "Indoor Facility, Shelley",
        time: "6:00 PM",
        status: "upcoming",
        description: "Indoor winter practice session"
      }
    ]
  }
  const result = NextResponse.json(defaultSchedule)
  // Prevent caching
  result.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  result.headers.set('Pragma', 'no-cache')
  result.headers.set('Expires', '0')
  return result
}

// PUT - Update schedule
export async function PUT(request: NextRequest) {
  // Verify authentication
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { events } = await request.json()
    
    // Validate data structure
    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Validate each event
    for (const event of events) {
      if (!event.date || !event.title || !event.type || !event.location || !event.time || !event.status || !event.description) {
        return NextResponse.json(
          { error: 'Missing required event fields' },
          { status: 400 }
        )
      }
    }

    const scheduleData = { events }
    
    try {
      // Save to Vercel Blob
      await put('schedule.json', JSON.stringify(scheduleData), {
        access: 'public',
        contentType: 'application/json'
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Schedule updated successfully' 
      })
    } catch (error) {
      console.error('Blob storage error:', error)
      return NextResponse.json(
        { error: 'Failed to save schedule data' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}