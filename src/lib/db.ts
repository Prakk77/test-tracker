import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type TestCase = {
  id: number;
  name: string;
  environment: 'dev' | 'staging' | 'production';
  status: 'passed' | 'failed' | 'not_tested';
  created_at: string;
  updated_at: string;
};

export type Environment = 'dev' | 'staging' | 'production';
export type Status = 'passed' | 'failed' | 'not_tested';