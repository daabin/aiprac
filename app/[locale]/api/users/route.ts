import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';
import { auth } from "@clerk/nextjs/server";
export const runtime = 'nodejs';

export async function GET() {
  const { userId } = auth();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('user_id', userId)

  console.log('get user ------->', data, error);

  return NextResponse.json({ data, error });
}

export async function POST(request: NextRequest) {
  const req = await request.json();

  console.log('req------->', req);

  const { data, error } = await supabase
    .from('users')
    .insert([
      { user_id: req.uid, role: req.role, email: req.email},
    ])
    .select()


  console.log('update user role res------->', data, error);

  return NextResponse.json({ data, error });
}
