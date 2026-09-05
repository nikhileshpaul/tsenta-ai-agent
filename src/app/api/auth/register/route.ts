import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, title } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [
      normalizedEmail,
    ]);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const userId = `usr-${Date.now()}`;
    const passwordHash = await hashPassword(password);
    const userTitle = title || 'Full-Stack Software Engineer';
    const avatarUrl = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

    // 1. Insert user
    await query(
      `INSERT INTO users (id, name, email, password_hash, title, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, name, normalizedEmail, passwordHash, userTitle, avatarUrl]
    );

    // 2. Initialize master profile
    const profileId = `prof-${Date.now()}`;
    await query(
      `INSERT INTO master_profiles (
        id, user_id, name, headline, summary, email, min_base_salary,
        remote_preference, work_authorization, target_roles, skills, experiences
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        profileId,
        userId,
        name,
        `${userTitle} | Cloud & Modern Web Platforms`,
        `Experienced engineering professional specializing in high-velocity web development, distributed cloud systems, and scalable full-stack applications.`,
        normalizedEmail,
        180000,
        'remote',
        'Authorized to work in US',
        JSON.stringify([userTitle, 'Staff Engineer', 'Lead Architect']),
        JSON.stringify([
          { category: 'Languages', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL'] },
          { category: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'WebSockets'] },
          { category: 'Backend & Cloud', items: ['Node.js', 'PostgreSQL', 'Docker', 'AWS'] },
        ]),
        JSON.stringify([]),
      ]
    );

    // 3. Initialize agent settings
    await query(
      `INSERT INTO agent_settings (
        user_id, autonomous_mode, match_threshold, max_daily_applications,
        auto_apply_interval_minutes, ai_model, ai_tone, blacklisted_companies,
        blacklisted_keywords, dry_run_mode
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        userId,
        true,
        85,
        12,
        15,
        'Gemini 1.5 Pro / Claude 3.5 Sonnet (Tailoring Engine v4)',
        'technical',
        JSON.stringify(['Meta', 'Amazon', 'ByteDance']),
        JSON.stringify(['Wordpress', 'Gambling']),
        false,
      ]
    );

    const userPayload = {
      id: userId,
      name,
      email: normalizedEmail,
      title: userTitle,
      avatarUrl,
    };

    const token = signToken(userPayload);

    const response = NextResponse.json({
      success: true,
      user: userPayload,
      message: 'Registration successful. Welcome to JobPulse AI!',
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
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}
