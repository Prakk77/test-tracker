import { supabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { data, error } = await supabase
    .from('test_cases')
    .select('*');

  console.log('DASHBOARD RAW:', data);

  if (error) {
    console.error(error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const rows = data || [];

  const overall = {
    total: rows.length,
    passed: rows.filter(d => d.status === 'passed').length,
    failed: rows.filter(d => d.status === 'failed').length,
    not_tested: rows.filter(d => d.status === 'not_tested').length,
  };

  const environments = ['dev', 'staging', 'production'];

  const byEnv = environments.map(env => {
    const envData = rows.filter(d => d.environment === env);

    return {
      environment: env,
      total: envData.length,
      passed: envData.filter(d => d.status === 'passed').length,
      failed: envData.filter(d => d.status === 'failed').length,
      not_tested: envData.filter(d => d.status === 'not_tested').length,
    };
  });

  return Response.json({
    overall,
    byEnv,
    recent: rows.slice(0, 10),
  }, {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}