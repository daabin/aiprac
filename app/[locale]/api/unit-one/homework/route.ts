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
      practice:practice!homework_pid_fkey(*),
      student:users!homework_student_id_fkey(*),
      teacher:users!homework_teacher_id_fkey(*)
    `)
    .eq('id', hid)
    .limit(1)

  console.log('get unit homework ------->', data, error);

  return NextResponse.json({ data, error });
}

// 提交作业
export async function PUT(request: NextRequest) {
  const req = await request.json();
  const { hid, ...params } = req;

  const { data, error } = await supabase
    .from('homework')
    .update({
      params
    })
    .eq('id', hid)
    .select()

  console.log('update homework questions res------->', data, error);

  return NextResponse.json({ data, error });
}