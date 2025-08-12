import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const ROSTER_FILE_PATH = path.join(process.cwd(), 'data', 'roster.json')

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

// GET - Read roster
export async function GET() {
  try {
    const fileContent = await fs.readFile(ROSTER_FILE_PATH, 'utf8')
    const rosterData = JSON.parse(fileContent)
    
    return NextResponse.json(rosterData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read roster file' },
      { status: 500 }
    )
  }
}

// PUT - Update roster
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
    const { players } = await request.json()
    
    // Validate data structure
    if (!Array.isArray(players)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      )
    }

    // Validate each player
    for (const player of players) {
      if (!player.number || !player.name || !player.position || !player.stats) {
        return NextResponse.json(
          { error: 'Missing required player fields' },
          { status: 400 }
        )
      }
    }

    const rosterData = { players }
    
    // Write to file
    await fs.writeFile(ROSTER_FILE_PATH, JSON.stringify(rosterData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Roster updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update roster' },
      { status: 500 }
    )
  }
}