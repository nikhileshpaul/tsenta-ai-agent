import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const rows = await query<any>(
      'SELECT id, name, email, password_hash, title, avatar_url FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const isValid = await verifyPassword(
      password,
      user.password_hash,
      normalizedEmail
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      title: user.title,
      avatarUrl: user.avatar_url,
    };

    const token = signToken(userPayload);

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      message: 'Logged in successfully.',
    });

    response.cookies.set('jobpulse_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign in. Please try again.' },
      { status: 500 }
    );
  }
}
