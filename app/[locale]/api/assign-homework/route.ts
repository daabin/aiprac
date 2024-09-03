import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const req = await request.json();

  console.log('add homework req------->', userId, req);

  const records: any[] = []
  if(Array.isArray(req.students) && req.students.length > 0) {
    req.students.forEach((student: any) => {
      records.push({
        teacher_id: userId,
        student_id: student.user_id,
        pid: req.pid,
        qid_list: req.questions,
        status: 'ASSIGNED',
      })
    })
  }

  const { data, error } = await supabase
    .from('homework')
    .insert([...records])
    .select()

  console.log('add homework res------->', data, error);

  return NextResponse.json({ data, error });
}
