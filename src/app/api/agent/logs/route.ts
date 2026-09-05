import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    const rows = await query<any>(
      'SELECT id, timestamp, level, message, job_id, action_type FROM agent_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
      [userId]
    );

    const logs = rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      level: r.level,
      message: r.message,
      jobId: r.job_id,
      actionType: r.action_type,
    }));

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Fetch logs error:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const authUser = await getCurrentUser();
    const userId = authUser?.id || 'usr-001';

    await query('DELETE FROM agent_logs WHERE user_id = $1', [userId]);
    return NextResponse.json({ success: true, message: 'Logs cleared.' });
  } catch (error: any) {
    console.error('Clear logs error:', error);
    return NextResponse.json({ error: 'Failed to clear logs' }, { status: 500 });
  }
}
