import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })

  console.log('get classes ------->', data, error);

  return NextResponse.json({ data, error });
}


export async function POST(request: NextRequest) {
  const { userId } = auth();
  const req = await request.json();

  console.log('add class req------->', userId, req);

  const { data, error } = await supabase
    .from('classes')
    .insert([
      {
        teacher_id: userId,
        class_name: req.class_name,
        class_remark: req.class_remark,
      },
    ])
    .select()

  console.log('add classes------->', data, error);

  return NextResponse.json({ data, error });
}

export async function PUT(request: NextRequest) {
  const req = await request.json();

  console.log('update classes ------->', req);
  const { data, error } = await supabase
    .from('classes')
    .update({ 
      class_name: req.class_name,
      class_remark: req.class_remark, })
    .eq('class_id', req.class_id)
    .select()

    console.log('update classes ------->', data, error);
    return NextResponse.json({ data, error });
}