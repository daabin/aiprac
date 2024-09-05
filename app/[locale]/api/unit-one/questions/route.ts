import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

// 获取题目列表
export async function POST(request: NextRequest) {
  const req = await request.json();
  const qids = req.qids

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .in('qid', qids)

  console.log('get homework questions res------->', data, error);

  return NextResponse.json({ data, error });
}
