import { NextRequest, NextResponse } from 'next/server';
import { githubManager } from '../../../utils/github';

// GET /api/data/[filename] - Public endpoint to get data files
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = `shelley-legion/data/${filename}`;
    
    const file = await githubManager.getFile(filePath);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Return just the content with no-cache headers
    const response = NextResponse.json(file.content);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}