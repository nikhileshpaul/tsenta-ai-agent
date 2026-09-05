import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    const rows = await query<any>(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const formatted = rows.map((r) => ({
      id: r.id,
      jobId: r.job_id,
      jobTitle: r.job_title,
      company: r.company,
      companyLogo: r.company_logo,
      location: r.location,
      salaryRange: r.salary_range,
      stage: r.stage,
      appliedDate: r.applied_date,
      matchScore: r.match_score,
      tailoredDiffId: r.tailored_diff_id,
      interviewRound: r.interview_round,
      interviewDate: r.interview_date,
      offerAmount: r.offer_amount,
      notes: r.notes || '',
      timeline: r.timeline || [],
    }));

    return NextResponse.json({ applications: formatted });
  } catch (error: any) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';
    const app = await req.json();

    const id = app.id || `app-${Date.now()}`;
    await query(
      `INSERT INTO applications (
        id, user_id, job_id, job_title, company, company_logo, location,
        salary_range, stage, applied_date, match_score, tailored_diff_id,
        notes, timeline
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        stage = EXCLUDED.stage,
        notes = EXCLUDED.notes,
        timeline = EXCLUDED.timeline,
        updated_at = NOW()`,
      [
        id,
        userId,
        app.jobId,
        app.jobTitle,
        app.company,
        app.companyLogo || '',
        app.location || 'Remote',
        app.salaryRange || '$200,000+',
        app.stage || 'applied',
        app.appliedDate || new Date().toISOString().split('T')[0],
        app.matchScore || 85,
        app.tailoredDiffId || 'diff-default',
        app.notes || '',
        JSON.stringify(app.timeline || []),
      ]
    );

    // Also mark job status as applied
    if (app.jobId) {
      await query('UPDATE job_postings SET status = $1 WHERE id = $2', ['applied', app.jobId]);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Create application error:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, stage, notes, timeline } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    if (stage && timeline) {
      await query(
        'UPDATE applications SET stage = $1, timeline = $2, updated_at = NOW() WHERE id = $3',
        [stage, JSON.stringify(timeline), id]
      );
    } else if (stage) {
      await query(
        'UPDATE applications SET stage = $1, updated_at = NOW() WHERE id = $2',
        [stage, id]
      );
    }

    if (notes !== undefined) {
      await query(
        'UPDATE applications SET notes = $1, updated_at = NOW() WHERE id = $2',
        [notes, id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update application error:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
