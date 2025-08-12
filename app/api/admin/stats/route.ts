import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const STATS_FILE_PATH = path.join(process.cwd(), 'data', 'stats.json')

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

// GET - Read stats
export async function GET() {
  try {
    const fileContent = await fs.readFile(STATS_FILE_PATH, 'utf8')
    const statsData = JSON.parse(fileContent)
    
    return NextResponse.json(statsData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read stats file' },
      { status: 500 }
    )
  }
}

// PUT - Update stats
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
    const { teamStats } = await request.json()
    
    // Validate data structure
    if (!Array.isArray(teamStats)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Validate each stat
    for (const stat of teamStats) {
      if (!stat.label || !stat.value || !stat.description || !stat.icon) {
        return NextResponse.json(
          { error: 'Missing required stat fields' },
          { status: 400 }
        )
      }
    }

    const statsData = { teamStats }
    
    // Write to file
    await fs.writeFile(STATS_FILE_PATH, JSON.stringify(statsData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Stats updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}