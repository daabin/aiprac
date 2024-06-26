import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const req = await request.json();

  console.log('add questions req------->', req);

  const { data, error } = await supabase
    .from('questions')
    .insert(req)
    .select()


  console.log('add questions res------->', data, error);

  return NextResponse.json({ data, error });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pid = searchParams.get('pid')

  console.log('get questions req------->', pid);

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('pid', pid)

  console.log('get questions res------->', data, error);

  return NextResponse.json({ data, error });
}