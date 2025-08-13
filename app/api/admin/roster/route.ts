import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { put, list } from '@vercel/blob'

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required')
})()

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
    // Try to fetch from Vercel Blob
    const blobs = await list({ prefix: 'roster.json' })

    if (blobs.blobs.length > 0) {
      const response = await fetch(blobs.blobs[0].url)
      if (response.ok) {
        const rosterData = await response.json()
        return NextResponse.json(rosterData)
      }
    }
  } catch (error) {
    console.log('Blob storage not available, using fallback:', error)
  }

  // Fallback to default data
  const defaultRoster = {
    players: [
      { number: 23, name: 'Jake Morrison', position: 'Pitcher', stats: '2.45 ERA' },
      { number: 15, name: 'Mike Rodriguez', position: 'Catcher', stats: '.285 AVG' },
      { number: 7, name: 'Sam Johnson', position: 'Shortstop', stats: '.312 AVG' },
      { number: 42, name: 'Tyler Davis', position: 'First Base', stats: '18 HRs' },
      { number: 9, name: 'Alex Chen', position: 'Center Field', stats: '25 SBs' },
      { number: 31, name: 'Ryan Miller', position: 'Third Base', stats: '.298 AVG' }
    ]
  }
  return NextResponse.json(defaultRoster)
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

    try {
      // Save to Vercel Blob
      await put('roster.json', JSON.stringify(rosterData), {
        access: 'public',
        contentType: 'application/json'
      })

      return NextResponse.json({
        success: true,
        message: 'Roster updated successfully'
      })
    } catch (error) {
      console.error('Blob storage error:', error)
      return NextResponse.json(
        { error: 'Failed to save roster data' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update roster' },
      { status: 500 }
    )
  }
}