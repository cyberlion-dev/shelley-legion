import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '../../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    console.log('Login attempt:', { username, passwordLength: password?.length });
    console.log('Expected username:', process.env.ADMIN_USERNAME);
    console.log('Password exists:', !!process.env.ADMIN_PASSWORD);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const token = await authenticateAdmin(username, password);

    if (!token) {
      console.log('Authentication failed for:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Authentication successful for:', username);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}