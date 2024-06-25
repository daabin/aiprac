import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { timeoutConf } from '@/utils/constants'

export async function POST(request: NextRequest) {
  const req = await request.json();

  console.log('req ----', req)

  try {
    const res = await fetch('http://mock.test.xiaopeng.local/mock/23/v1/questions', {
      method: 'POST',
      body: req,
      signal: AbortSignal.timeout(timeoutConf)
    })
  
    const data = await res.json()
  
    console.log('res data ----', data)
   
    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('api error ----', error?.message ,error)
    return NextResponse.json({ error: error?.message}, {status: 500})
  }
}