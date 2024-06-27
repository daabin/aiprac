import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();

  console.log('get token account uid------->', userId);

  const { data, error } = await supabase
    .from('practice')
    .select('pid')
    .eq('teacher_id', userId)

  if (error) {
    return NextResponse.json({ error });
  }

  const pids = data.map((item: any) => item.pid);

  console.log('get token account pids------->', pids);

  const { data: tokens, error: tokensError } = await supabase
    .from('questions')
    .select('token')
    .in('pid', pids)


  console.log('get token account------->', tokens, tokensError);

  return NextResponse.json({ data: tokens, error: tokensError });
}