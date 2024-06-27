import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import axiosIns from '@/utils/axios';

export async function POST(request: NextRequest) {
  const req = await request.json();

  console.log('req ----', req)

  try {
    const res = await axiosIns({
      method: 'post',
      url: '/v1/questions',
      data: JSON.stringify({...req}),
    });

    console.log('res ----', res)
  
    return NextResponse.json(res.data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message}, {status: 500})
  }
}