import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const body = await request.json();
  const { status, name } = body;

  const db = getDb();
  const existing = db.prepare('SELECT * FROM test_cases WHERE id = ?').get(id);
  if (!existing) {
    return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
  }

  if (status && !['passed', 'failed', 'not_tested'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (status) { updates.push('status = ?'); values.push(status); }
  if (name) { updates.push('name = ?'); values.push(name.trim()); }
  updates.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE test_cases SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const updated = db.prepare('SELECT * FROM test_cases WHERE id = ?').get(id);
  return NextResponse.json({ test: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const db = getDb();
  const result = db.prepare('DELETE FROM test_cases WHERE id = ?').run(id);

  if (result.changes === 0) {
    return NextResponse.json({ error: 'Test case not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
