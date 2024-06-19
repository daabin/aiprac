import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const req = await request.json();

  console.log(req, userId);

  const { data, error } = await supabase
    .from('practice')
    .insert([
      {
        teacher_id: userId,
        class_id: 'class01',
        course_id: 'course01',
        chapter_id: 'chapter01',
        ...req,
        request_time: Date.now(),
      },
    ])
    .select()

  console.log('add proatice ------->', data, error);

  return NextResponse.json({ data, error });
}


export async function GET(request: NextRequest) {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('practice')
    .select('*')
    .eq('teacher_id', userId)

  console.log('get practice ------->', data, error);

  return NextResponse.json({ data, error });
}