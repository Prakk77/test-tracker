import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const environment = searchParams.get('environment');

  const db = getDb();
  let tests;

  if (environment && ['dev', 'staging', 'production'].includes(environment)) {
    tests = db.prepare('SELECT * FROM test_cases WHERE environment = ? ORDER BY created_at DESC').all(environment);
  } else {
    tests = db.prepare('SELECT * FROM test_cases ORDER BY environment, created_at DESC').all();
  }

  return NextResponse.json({ tests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, environment, status = 'not_tested' } = body;

  if (!name || !environment) {
    return NextResponse.json({ error: 'name and environment are required' }, { status: 400 });
  }

  if (!['dev', 'staging', 'production'].includes(environment)) {
    return NextResponse.json({ error: 'Invalid environment' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO test_cases (name, environment, status) VALUES (?, ?, ?)'
  ).run(name.trim(), environment, status);

  const newTest = db.prepare('SELECT * FROM test_cases WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json({ test: newTest }, { status: 201 });
}
