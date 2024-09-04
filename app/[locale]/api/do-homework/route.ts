import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hid = searchParams.get('hid')

  const { data, error } = await supabase
    .from('homework')
    .select(`qid_list`)
    .eq('id', hid)
    .order('created_at', { ascending: false })

  console.log('get homework qid_list ------->', data, error);

  return NextResponse.json({ data, error });
}

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

// 提交作业
export async function PUT(request: NextRequest) {
  const req = await request.json();

  const { data, error } = await supabase
    .from('homework')
    .update({ 
      student_answer: req.student_answer,
      status: req.status,
    })
    .eq('id', req.hid)
    .select()

  console.log('get homework questions res------->', data, error);

  return NextResponse.json({ data, error });
}