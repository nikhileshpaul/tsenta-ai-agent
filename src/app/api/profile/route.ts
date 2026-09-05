import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    const rows = await query<any>(
      'SELECT * FROM master_profiles WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ profile: null });
    }

    const r = rows[0];
    const profile = {
      name: r.name,
      headline: r.headline,
      summary: r.summary,
      email: r.email,
      phone: r.phone || '',
      location: r.location || '',
      githubUrl: r.github_url || '',
      linkedinUrl: r.linkedin_url || '',
      portfolioUrl: r.portfolio_url || '',
      minBaseSalary: r.min_base_salary,
      remotePreference: r.remote_preference,
      workAuthorization: r.work_authorization,
      targetRoles: r.target_roles || [],
      skills: r.skills || [],
      experiences: r.experiences || [],
    };

    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';
    const body = await req.json();

    await query(
      `UPDATE master_profiles SET
        name = COALESCE($1, name),
        headline = COALESCE($2, headline),
        summary = COALESCE($3, summary),
        email = COALESCE($4, email),
        phone = COALESCE($5, phone),
        location = COALESCE($6, location),
        github_url = COALESCE($7, github_url),
        linkedin_url = COALESCE($8, linkedin_url),
        portfolio_url = COALESCE($9, portfolio_url),
        min_base_salary = COALESCE($10, min_base_salary),
        remote_preference = COALESCE($11, remote_preference),
        work_authorization = COALESCE($12, work_authorization),
        target_roles = COALESCE($13, target_roles),
        skills = COALESCE($14, skills),
        experiences = COALESCE($15, experiences),
        updated_at = NOW()
      WHERE user_id = $16`,
      [
        body.name,
        body.headline,
        body.summary,
        body.email,
        body.phone,
        body.location,
        body.githubUrl,
        body.linkedinUrl,
        body.portfolioUrl,
        body.minBaseSalary,
        body.remotePreference,
        body.workAuthorization,
        body.targetRoles ? JSON.stringify(body.targetRoles) : null,
        body.skills ? JSON.stringify(body.skills) : null,
        body.experiences ? JSON.stringify(body.experiences) : null,
        userId,
      ]
    );

    return NextResponse.json({ success: true, message: 'Profile updated in database.' });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
