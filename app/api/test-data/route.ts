import { NextResponse } from 'next/server'

export async function GET() {
  // Test all API endpoints
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  const endpoints = [
    '/api/admin/roster',
    '/api/admin/schedule', 
    '/api/admin/stats',
    '/api/admin/team-info'
  ]

  const results = {}

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: { 'Cache-Control': 'no-cache' }
      })
      const data = await response.json()
      results[endpoint] = {
        status: response.status,
        hasData: !!data,
        dataKeys: Object.keys(data)
      }
    } catch (error) {
      results[endpoint] = {
        status: 'error',
        error: error.message
      }
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results
  })
}