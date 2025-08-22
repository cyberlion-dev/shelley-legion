import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../../utils/auth';
import { githubManager } from '../../../../utils/github';

// Middleware to check admin authentication
function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user || !user.isAdmin) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  return null;
}

// GET /api/admin/data/[filename] - Get specific data file
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

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

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/data/[filename] - Update specific data file
export async function PUT(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const filename = params.filename;
    const filePath = `shelley-legion/data/${filename}`;
    const { content, message, sha } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const commitMessage = message || `Update ${filename} via admin panel`;
    const success = await githubManager.updateFile(filePath, content, commitMessage, sha);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update file' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'File updated successfully' });
  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}