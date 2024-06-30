import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { supabase } from '@/utils/supabase';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const req = await request.json();

  if (!req.audio_url || !req.qid) {
    return NextResponse.json({ error: '参数缺失' });
  }

  try {
    const file = await fetch(req.audio_url)
    const buffer = await file.arrayBuffer()
    const blob = new Blob([buffer], { type: 'audio/wav' });

    const { data, error } = await supabase
      .storage
      .from('resource')
      .upload(`aiprac/${req.qid}.wav`, blob)

    console.log('upload audio res------->', data);

    return NextResponse.json({ data, error });
  } catch (error) {
    console.log('upload audio error------->', error);
    return NextResponse.json({ error });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path: string = searchParams.get('path') || ''

  console.log('get audio req------->', path);

  const { data, error } = await supabase
    .storage
    .from('resource')
    .createSignedUrl(path, 60*60)

  console.log('get audio res------->', data, error);

  return NextResponse.json({ data, error });
}