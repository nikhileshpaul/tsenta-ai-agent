import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    const rows = await query<any>(
      'SELECT * FROM agent_settings WHERE user_id = $1',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ settings: null });
    }

    const r = rows[0];
    const settings = {
      autonomousMode: r.autonomous_mode,
      matchThreshold: r.match_threshold,
      maxDailyApplications: r.max_daily_applications,
      autoApplyIntervalMinutes: r.auto_apply_interval_minutes,
      aiModel: r.ai_model,
      aiTone: r.ai_tone,
      blacklistedCompanies: r.blacklisted_companies || [],
      blacklistedKeywords: r.blacklisted_keywords || [],
      dryRunMode: r.dry_run_mode,
    };

    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Fetch settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';
    const body = await req.json();

    await query(
      `UPDATE agent_settings SET
        autonomous_mode = COALESCE($1, autonomous_mode),
        match_threshold = COALESCE($2, match_threshold),
        max_daily_applications = COALESCE($3, max_daily_applications),
        auto_apply_interval_minutes = COALESCE($4, auto_apply_interval_minutes),
        ai_model = COALESCE($5, ai_model),
        ai_tone = COALESCE($6, ai_tone),
        blacklisted_companies = COALESCE($7, blacklisted_companies),
        blacklisted_keywords = COALESCE($8, blacklisted_keywords),
        dry_run_mode = COALESCE($9, dry_run_mode),
        updated_at = NOW()
      WHERE user_id = $10`,
      [
        body.autonomousMode,
        body.matchThreshold,
        body.maxDailyApplications,
        body.autoApplyIntervalMinutes,
        body.aiModel,
        body.aiTone,
        body.blacklistedCompanies ? JSON.stringify(body.blacklistedCompanies) : null,
        body.blacklistedKeywords ? JSON.stringify(body.blacklistedKeywords) : null,
        body.dryRunMode,
        userId,
      ]
    );

    return NextResponse.json({ success: true, message: 'Settings saved in database.' });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
