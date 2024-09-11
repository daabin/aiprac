import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const class_id = searchParams.get('class_id')
  const code = searchParams.get('code')

  console.log('get class_invitecode ------->','class_id:', class_id, 'code: ',code);

  let query = supabase.from('class_invitecode')
    .select(`*,
    classes(
      *, users(
        *
      )
    )`)

  if (class_id && class_id.length === 36) { 
    query = query.eq('class_id', class_id) 
  } else if (code && code.length === 21) { 
    query = query.eq('code', code)
  }

  const { data, error } = await query
  console.log('get class_invitecode ------->', data, error);

  return NextResponse.json({ data, error });
}

export async function POST(request: NextRequest) {
  const req = await request.json();

  console.log('add class_invitecode req------->', req);

  const { data, error } = await supabase
    .from('class_invitecode')
    .insert(req)
    .select()


  console.log('add class_invitecode res------->', data, error);

  return NextResponse.json({ data, error });
}

export async function PUT(request: NextRequest) {
  const req = await request.json();

  console.log('update class_invitecode ------->', req);
  const { data, error } = await supabase
    .from('class_invitecode')
    .update({
      code: req.code
    })
    .eq('class_id', req.class_id)
    .select()

  console.log('update class_invitecode code------->', data, error);
  return NextResponse.json({ data, error });
}
