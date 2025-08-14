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

// GET - Read team info
export async function GET() {
  // Fallback data first
  const defaultTeamInfo = {
    teamName: "Shelley Legion",
    tagline: "Honor, Pride, Victory",
    description: "Shelley's premier youth baseball team for players 18 and under, representing our community with honor and developing the next generation of baseball talent in Eastern Idaho.",
    contact: {
      phone: "(208) 555-LEGION",
      email: "info@shelleylegion.com",
      address: "Legion Field, Shelley, ID"
    },
    socialMedia: {
      facebook: "https://facebook.com/shelleylegion",
      twitter: "https://twitter.com/shelleylegion",
      instagram: "https://instagram.com/shelleylegion"
    }
  }

  try {
    // Only try Blob storage if token is available
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blobs = await list({ prefix: 'team-info.json' })

      if (blobs.blobs.length > 0) {
        const response = await fetch(blobs.blobs[0].url)
        if (response.ok) {
          const teamInfoData = await response.json()
          const result = NextResponse.json(teamInfoData)
          // Prevent caching
          result.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
          result.headers.set('Pragma', 'no-cache')
          result.headers.set('Expires', '0')
          return result
        }
      }
    }
  } catch (error) {
    console.log('Blob storage error, using fallback:', error)
  }

  // Return fallback data
  const result = NextResponse.json(defaultTeamInfo)
  // Prevent caching
  result.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  result.headers.set('Pragma', 'no-cache')
  result.headers.set('Expires', '0')
  return result
}

// PUT - Update team info
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
    const teamInfoData = await request.json()
    
    // Validate required fields
    if (!teamInfoData.teamName || !teamInfoData.tagline || !teamInfoData.description) {
      return NextResponse.json(
        { error: 'Missing required team info fields' },
        { status: 400 }
      )
    }

    if (!teamInfoData.contact || !teamInfoData.contact.phone || !teamInfoData.contact.email || !teamInfoData.contact.address) {
      return NextResponse.json(
        { error: 'Missing required contact fields' },
        { status: 400 }
      )
    }

    if (!teamInfoData.socialMedia) {
      return NextResponse.json(
        { error: 'Missing social media fields' },
        { status: 400 }
      )
    }
    
    try {
      // Save to Vercel Blob
      await put('team-info.json', JSON.stringify(teamInfoData), {
        access: 'public',
        contentType: 'application/json'
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Team info updated successfully' 
      })
    } catch (error) {
      console.error('Blob storage error:', error)
      return NextResponse.json(
        { error: 'Failed to save team info data' },
        { status: 500 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update team info' },
      { status: 500 }
    )
  }
}