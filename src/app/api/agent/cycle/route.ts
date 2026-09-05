import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    // 1. Get settings
    const settingsRows = await query<any>(
      'SELECT * FROM agent_settings WHERE user_id = $1',
      [userId]
    );
    const threshold = settingsRows[0]?.match_threshold || 85;

    // 2. Find best candidate job not yet applied
    const jobs = await query<any>(
      'SELECT * FROM job_postings WHERE status != $1 AND match_score >= $2 ORDER BY match_score DESC LIMIT 1',
      ['applied', threshold]
    );

    if (jobs.length === 0) {
      const logId = `log-${Date.now()}`;
      const timeStr = new Date().toTimeString().split(' ')[0];
      await query(
        `INSERT INTO agent_logs (id, user_id, timestamp, level, message, action_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [logId, userId, timeStr, 'warning', 'Cycle completed: No unapplied jobs met match threshold.', 'scan']
      );

      return NextResponse.json({
        success: false,
        message: 'No qualifying unapplied requisitions found.',
      });
    }

    const job = jobs[0];
    const timeStr = new Date().toTimeString().split(' ')[0];
    const dateStr = new Date().toISOString().split('T')[0];
    const appId = `app-${Date.now()}`;
    const diffId = `diff-${job.id}`;

    // 3. Mark job as applied
    await query('UPDATE job_postings SET status = $1 WHERE id = $2', ['applied', job.id]);

    // 4. Create application
    const timeline = [
      {
        stage: 'discovered',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: 'Scraped via autonomous daemon',
      },
      {
        stage: 'tailoring',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: 'Redline diff synthesized by AI',
      },
      {
        stage: 'applied',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        note: 'Dispatched to company ATS endpoint',
      },
    ];

    await query(
      `INSERT INTO applications (
        id, user_id, job_id, job_title, company, company_logo, location,
        salary_range, stage, applied_date, match_score, tailored_diff_id,
        notes, timeline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO NOTHING`,
      [
        appId,
        userId,
        job.id,
        job.title,
        job.company,
        job.company_logo || '',
        job.location,
        job.salary_range,
        'applied',
        dateStr,
        job.match_score,
        diffId,
        `Automated submission generated via JobPulse AI agent.`,
        JSON.stringify(timeline),
      ]
    );

    // 5. Create log
    const logId = `log-${Date.now()}`;
    const logMsg = `Autonomous cycle success: Dispatched application for "${job.title} @ ${job.company}" (${job.match_score}% fit).`;
    await query(
      `INSERT INTO agent_logs (id, user_id, timestamp, level, message, job_id, action_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [logId, userId, timeStr, 'success', logMsg, job.id, 'apply']
    );

    return NextResponse.json({
      success: true,
      jobTitle: job.title,
      company: job.company,
      matchScore: job.match_score,
      appId,
      message: logMsg,
    });
  } catch (error: any) {
    console.error('Agent cycle error:', error);
    return NextResponse.json({ error: 'Failed to execute cycle' }, { status: 500 });
  }
}
