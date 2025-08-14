import { NextResponse } from 'next/server'
import { list } from '@vercel/blob'

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      nodeEnv: process.env.NODE_ENV
    },
    blobStorage: {
      available: false,
      files: [],
      error: null
    }
  }

  try {
    const blobs = await list()
    debug.blobStorage.available = true
    debug.blobStorage.files = blobs.blobs.map(blob => ({
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: blob.uploadedAt
    }))
  } catch (error) {
    debug.blobStorage.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json(debug)
}