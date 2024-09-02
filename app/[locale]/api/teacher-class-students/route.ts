import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('classes')
    .select(`*,
    student_class(
      student_id,created_at, users(
        *
      )
    )`)
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })

  console.log('get teach classes student ------->', data, error);

  return NextResponse.json({ data, error });
}
