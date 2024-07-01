import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";
import { generateUniqueID } from '@/utils/tools'

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const req = await request.json();

  console.log('add pratice req------->', userId, req);

  const { data, error } = await supabase
    .from('practice')
    .insert([
      {
        pid: generateUniqueID(),
        teacher_id: userId,
        class_id: 'class01',
        course_id: 'course01',
        chapter_id: 'chapter01',
        ...req,
        request_time: Date.now(),
      },
    ])
    .select()

  console.log('add pratice ------->', data, error);

  return NextResponse.json({ data, error });
}

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('practice')
    .select('*')
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })

  console.log('get practice ------->', data, error);

  return NextResponse.json({ data, error });
}

export async function PUT(request: NextRequest) {
  const req = await request.json();

  console.log('update pratice gen_status ------->', req);
  const { data, error } = await supabase
    .from('practice')
    .update({ gen_status: req.gen_status })
    .eq('pid', req.pid)
    .select()

    console.log('update pratice gen_status------->', data, error);
    return NextResponse.json({ data, error });
}