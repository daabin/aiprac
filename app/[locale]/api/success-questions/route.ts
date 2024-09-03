import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pid = searchParams.get('pid')

  console.log('get success questions req------->', pid);

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('pid', pid)
    .eq('gen_status', 1)

  console.log('get success questions res------->', data, error);

  return NextResponse.json({ data, error });
}

