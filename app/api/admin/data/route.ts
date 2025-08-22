import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '../../../utils/auth';
import { githubManager } from '../../../utils/github';

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

  return null; // No error, user is authenticated
}

// GET /api/admin/data - List all data files
export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;

  try {
    const files = await githubManager.listDataFiles();
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list data files' },
      { status: 500 }
    );
  }
}