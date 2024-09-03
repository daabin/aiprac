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
    practice(
      title,description,users(*)
    )`)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  console.log('get student homework ------->', data, error);

  return NextResponse.json({ data, error });
}
