import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

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
