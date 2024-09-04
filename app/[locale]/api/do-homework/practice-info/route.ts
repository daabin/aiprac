import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hid = searchParams.get('hid')

  const { data, error } = await supabase
    .from('homework')
    .select(`*,
    practice(
      title,description,users(*)
    )`)
    .eq('id', hid)

  console.log('get student homework ------->', data, error);

  return NextResponse.json({ data, error });
}
