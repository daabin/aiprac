import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('practice')
    .select('pid')
    .eq('teacher_id', userId)

  if (error) {
    return NextResponse.json({ error });
  }

  const pids = data.map((item: any) => item.pid);

  console.log('get question account pids------->', pids);

  const { error: getQuestionCountError, count } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .in('pid', pids)


  console.log('get question account------->', count, getQuestionCountError);

  return NextResponse.json({ data: count, error: getQuestionCountError });
}