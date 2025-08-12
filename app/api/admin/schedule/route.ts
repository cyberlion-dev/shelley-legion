import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const SCHEDULE_FILE_PATH = path.join(process.cwd(), 'data', 'schedule.json')

// Verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// GET - Read schedule
export async function GET() {
  try {
    const fileContent = await fs.readFile(SCHEDULE_FILE_PATH, 'utf8')
    const scheduleData = JSON.parse(fileContent)
    
    return NextResponse.json(scheduleData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read schedule file' },
      { status: 500 }
    )
  }
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
    
    // Write to file
    await fs.writeFile(SCHEDULE_FILE_PATH, JSON.stringify(scheduleData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Schedule updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    )
  }
}