import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return NextResponse.json({ user: null });
    }

    const rows = await query<any>(
      'SELECT id, name, email, title, avatar_url FROM users WHERE id = $1',
      [authUser.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    const user = rows[0];
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        title: user.title,
        avatarUrl: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json({ user: null });
  }
}
