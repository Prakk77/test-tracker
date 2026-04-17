import { supabase } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return Response.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();

    const { data, error } = await supabase
      .from('test_cases')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PATCH error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data);
  } catch (err) {
    console.error('PATCH parse error:', err);
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return Response.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('test_cases')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('DELETE error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ success: true });
}