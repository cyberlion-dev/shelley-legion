import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

export interface AdminUser {
  username: string;
  isAdmin: boolean;
}

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD;
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AdminUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminUser;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export async function authenticateAdmin(username: string, password: string): Promise<string | null> {
  if (username !== ADMIN_USERNAME) {
    return null;
  }

  const isValid = await verifyPassword(password);
  if (!isValid) {
    return null;
  }

  const user: AdminUser = {
    username,
    isAdmin: true,
  };

  return generateToken(user);
}

// Helper to generate password hash (run this once to get your hash)
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}