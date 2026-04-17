import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  const db = getDb();

  const overall = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status = 'not_tested' THEN 1 ELSE 0 END) as not_tested
    FROM test_cases
  `).get() as { total: number; passed: number; failed: number; not_tested: number };

  const byEnv = db.prepare(`
    SELECT
      environment,
      COUNT(*) as total,
      SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as passed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
      SUM(CASE WHEN status = 'not_tested' THEN 1 ELSE 0 END) as not_tested
    FROM test_cases
    GROUP BY environment
  `).all() as Array<{ environment: string; total: number; passed: number; failed: number; not_tested: number }>;

  const recent = db.prepare(`
    SELECT * FROM test_cases
    ORDER BY updated_at DESC
    LIMIT 5
  `).all();

  return NextResponse.json({ overall, byEnv, recent });
}
