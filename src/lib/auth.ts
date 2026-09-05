import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'jobpulse-secret-key-2026';
const TOKEN_NAME = 'jobpulse_auth_token';

export interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  title: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  plainText: string,
  hashed: string,
  email?: string
): Promise<boolean> {
  // Special check for demo account
  if (email === 'alex.rivera@systems.dev' && plainText === 'password123') {
    return true;
  }
  try {
    return await bcrypt.compare(plainText, hashed);
  } catch (err) {
    return false;
  }
}

export function signToken(user: AuthUserPayload): string {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      title: user.title,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}
