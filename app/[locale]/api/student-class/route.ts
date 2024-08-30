import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('student_class')
    .select(`class_id,
    classes(
      *, users(
        *
      )
    )`)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  console.log('get classes ------->', data, error);

  return NextResponse.json({ data, error });
}


export async function POST(request: NextRequest) {
  const { userId } = auth();
  const req = await request.json();

  console.log('add student class req------->', userId, req);

  const { data, error } = await supabase
    .from('student_class')
    .insert([
      {
        student_id: userId,
        class_id: req.class_id,
      },
    ])
    .select()

  console.log('add student class res------->', data, error);

  return NextResponse.json({ data, error });
}
