import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    message: 'API routes should now be working',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN
    },
    testEndpoints: [
      '/api/health',
      '/api/roster-simple',
      '/api/admin/roster',
      '/api/admin/schedule',
      '/api/admin/stats',
      '/api/admin/team-info'
    ]
  })
}