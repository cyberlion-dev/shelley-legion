import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { put } from '@vercel/blob'

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

// GET - Read stats
export async function GET() {
  try {
    // Try to fetch from Vercel Blob
    const response = await fetch(`${process.env.BLOB_READ_WRITE_TOKEN ? 'https://blob.vercel-storage.com' : ''}/stats.json`, {
      headers: process.env.BLOB_READ_WRITE_TOKEN ? {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`
      } : {}
    })
    
    if (response.ok) {
      const statsData = await response.json()
      return NextResponse.json(statsData)
    }
  } catch (error) {
    console.log('Blob storage not available, using fallback')
  }
  
  // Fallback to default data
  const defaultStats = {
    teamStats: [
      {
        label: "Wins This Season",
        value: "18",
        description: "Out of 25 games",
        icon: "trophy"
      },
      {
        label: "Team Batting Average",
        value: ".289",
        description: "League leading",
        icon: "target"
      },
      {
        label: "Home Runs",
        value: "47",
        description: "Team total",
        icon: "trending-up"
      },
      {
        label: "League Ranking",
        value: "#2",
        description: "In division",
        icon: "award"
      }
    ]
  }
  return NextResponse.json(defaultStats)
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
    
    try {
      // Save to Vercel Blob
      await put('stats.json', JSON.stringify(statsData), {
        access: 'public',
        contentType: 'application/json'
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Stats updated successfully' 
      })
    } catch (error) {
      console.error('Blob storage error:', error)
      return NextResponse.json(
        { error: 'Failed to save stats data' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stats' },
      { status: 500 }
    )
  }
}