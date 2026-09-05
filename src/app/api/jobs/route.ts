import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const rows = await query<any>(
      'SELECT * FROM job_postings ORDER BY match_score DESC'
    );

    const formatted = rows.map((r) => ({
      id: r.id,
      title: r.title,
      company: r.company,
      companyLogo: r.company_logo,
      location: r.location,
      workplaceType: r.workplace_type,
      salaryRange: r.salary_range,
      minSalary: r.min_salary,
      maxSalary: r.max_salary,
      postedDate: r.posted_date,
      matchScore: r.match_score,
      description: r.description,
      requiredSkills: r.required_skills || [],
      matchedSkills: r.matched_skills || [],
      missingSkills: r.missing_skills || [],
      sourceUrl: r.source_url,
      status: r.status,
    }));

    return NextResponse.json({ jobs: formatted });
  } catch (error: any) {
    console.error('Fetch jobs error:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    await query('UPDATE job_postings SET status = $1 WHERE id = $2', [status, id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Update job status error:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}
