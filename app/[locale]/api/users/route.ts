export const runtime = 'nodejs'
import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server'

import { supabase } from "@/utils/supabase";

export async function POST(request: NextRequest) {

  const req = await request.json()

  console.log('req------->', req)

  const { data, error } = await supabase
    .from('users')
    .update({ role: req.role })
    .eq('user_id', req.uid)
    .select()  
 
  return NextResponse.json({ data, error })
}