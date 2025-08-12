import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TEAM_INFO_FILE_PATH = path.join(process.cwd(), 'data', 'team-info.json')

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

// GET - Read team info
export async function GET() {
  try {
    const fileContent = await fs.readFile(TEAM_INFO_FILE_PATH, 'utf8')
    const teamInfoData = JSON.parse(fileContent)
    
    return NextResponse.json(teamInfoData)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to read team info file' },
      { status: 500 }
    )
  }
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
    
    // Write to file
    await fs.writeFile(TEAM_INFO_FILE_PATH, JSON.stringify(teamInfoData, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: 'Team info updated successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update team info' },
      { status: 500 }
    )
  }
}