import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('homework')
    .select(`*,
      practice:practice!homework_pid_fkey(*),
      student:users!homework_student_id_fkey(*)
    `)
    .eq('teacher_id', userId)
    .order('created_at', { ascending: false })

  console.log('get teacher homework ------->', data, error);

  return NextResponse.json({ data, error });
}
