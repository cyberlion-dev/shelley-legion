import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// In production, use environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'coach'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'legion2025'
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  throw new Error('JWT_SECRET environment variable is required')
})()

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Simple authentication check
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      )

      return NextResponse.json({ 
        success: true, 
        token,
        message: 'Login successful' 
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}