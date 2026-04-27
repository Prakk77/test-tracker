// import { supabase } from '@/lib/db';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const environment = searchParams.get('environment');

//   let query = supabase.from('test_cases').select('*');

//   if (environment) {
//     query = query.eq('environment', environment);
//   }

//   const { data, error } = await query;

//   if (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }

//   return Response.json(data);
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const { data, error } = await supabase
//     .from('test_cases')
//     .insert([{
//       name: body.name,
//       environment: body.environment,
//       status: body.status || 'not_tested'
//     }])
//     .select();

//   if (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }

//   return Response.json(data[0]);
// }

// import { supabase } from '@/lib/db';

// export const runtime = 'nodejs';
// export const dynamic = 'force-dynamic';

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const environment = searchParams.get('environment');

//   let query = supabase
//     .from('test_cases')
//     .select('*')
//     .order('updated_at', { ascending: false });

//   if (environment) {
//     query = query.eq('environment', environment);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.error('Supabase GET error:', error);
//     return Response.json({ error: error.message }, { status: 500 });
//   }

//   return Response.json(data || [], {
//     headers: {
//       'Cache-Control': 'no-store'
//     }
//   });
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.name || !body.environment) {
//       return Response.json(
//         { error: 'Missing name or environment' },
//         { status: 400 }
//       );
//     }

//     const { data, error } = await supabase
//       .from('test_cases')
//       .insert([
//         {
//           name: body.name,
//           environment: body.environment.toLowerCase().trim(),
//           status: body.status || 'not_tested'
//         }
//       ])
//       .select()
//       .single(); // ensures single object return

//     if (error) {
//       console.error('Supabase POST error:', error);
//       return Response.json({ error: error.message }, { status: 500 });
//     }

//     return Response.json(data, {
//       headers: {
//         'Cache-Control': 'no-store'
//       }
//     });
//   } catch (err) {
//     console.error('POST parse error:', err);
//     return Response.json({ error: 'Invalid request body' }, { status: 400 });
//   }
// }

import { getSupabaseServerClient } from '@/lib/supabaseServer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const supabase = getSupabaseServerClient();

  // 🔐 AUTH CHECK (added)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const environment = searchParams.get('environment');

  let query = supabase
    .from('test_cases')
    .select('*')
    .order('updated_at', { ascending: false });

  // ✅ SAFE filtering (normalized)
  if (environment) {
    query = query.eq('environment', environment.toLowerCase().trim());
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase GET error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data || [], {
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  // 🔐 AUTH CHECK (added)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name || !body.environment) {
      return Response.json(
        { error: 'Missing name or environment' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('test_cases')
      .insert([
        {
          name: body.name,
          environment: body.environment.toLowerCase().trim(), // ✅ normalized
          status: body.status || 'not_tested'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (err) {
    console.error('POST parse error:', err);
    return Response.json({ error: 'Invalid request body' }, { status: 400 });
  }
}