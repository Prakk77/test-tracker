import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const environment = formData.get('environment') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!environment) {
      return NextResponse.json({ error: 'Missing environment' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 👉 Read workbook (works for csv, xlsx, xls)
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet);

    

    const results: { name: string; environment: string; status: string }[] = [];
    let nameColumn: string | null = null;

    if (jsonData.length === 0) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }



    // Detect column
    const headers = Object.keys(jsonData[0]);
    const normalized = headers.map(h => h.toLowerCase().trim());
    const possibleNames = ['name', 'title', 'test', 'test_name'];

    for (const key of possibleNames) {
      const index = normalized.indexOf(key);
      if (index !== -1) {
        nameColumn = headers[index];
        break;
      }
    }

    if (!nameColumn) {
      nameColumn = headers[0];
    }

    // Extract names
    for (const row of jsonData) {
      const name = row[nameColumn]?.toString().trim();

      if (!name) continue;

      if (results.some(r => r.name === name)) continue;

      results.push({
        name,
        environment,
        status: 'failed', // or whatever your default is
      });
    }

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: 'No valid rows found',
      });
    }

    const supabase = getSupabaseServerClient();

    const { error } = await supabase
      .from('test_cases')
      .upsert(results, {
        onConflict: 'name,environment',
        ignoreDuplicates: true,
      });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: 'DB insert failed' }, { status: 500 });
    }
    

    return NextResponse.json({
      success: true,
      count: results.length,
      columnUsed: nameColumn,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Import failed' }, { status: 500 });
  }
}