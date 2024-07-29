import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const genStatus = searchParams.get('genStatus')

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

  let status = [0, 1]
  if (genStatus === '1') {
    status = [1]
  } else if (genStatus === '0') {
    status = [0]
  }

  const { error: getQuestionCountError, data: qData } = await supabase
    .from('questions')
    .select('*')
    .in('gen_status', status)
  .in('pid', pids)

  console.log('get question account------->', qData?.length, getQuestionCountError);

  return NextResponse.json({ data: qData?.length, error: getQuestionCountError });
}