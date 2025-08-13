import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getJWTSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  return secret
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, getJWTSecret())
      return NextResponse.json({ 
        success: true, 
        user: decoded 
      })
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
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