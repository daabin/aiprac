import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const uuid = formData.get('uuid')
  const file: any = formData.get('file')

  try {
    const { data, error } = await supabase
      .storage
      .from('resource')
      .upload(`aiprac/${uuid}.wav`, file)

    console.log('upload homework audio res------->', data);

    return NextResponse.json({ data, error });
  } catch (error) {
    console.log('upload homework audio error------->', error);
    return NextResponse.json({ error });
  }
}