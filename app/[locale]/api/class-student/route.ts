import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const class_id = searchParams.get('class_id')

  const { data, error } = await supabase
    .from('student_class')
    .select(`student_id,
    users(
      *
    )`)
    .eq('class_id', class_id)
    .order('created_at', { ascending: false })

  console.log('get class students ------->', data, error);

  return NextResponse.json({ data, error });
}

export async function DELETE(request: NextRequest) {
  const req = await request.json();

  const { error } = await supabase
    .from('student_class')
    .delete()
    .eq('class_id', req.class_id)
    .eq('student_id', req.student_id)

  return NextResponse.json({ error });
}