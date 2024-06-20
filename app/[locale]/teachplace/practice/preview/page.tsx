'use client'

import { Breadcrumb, Card } from '@douyinfe/semi-ui';
import Link from 'next/link';

export default async function PracticePreviewPage() {

  return (
    <section className='h-full flex flex-col'>
      <div className='mb-4'>
        <Breadcrumb compact={false} className="mb-4">
          <Breadcrumb.Item><Link href={'/teachplace/practice'}> 练习</Link></Breadcrumb.Item>
          <Breadcrumb.Item>题目预览</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card className='flex-1 flex' bodyStyle={{height: '100%', width: '100%', display: 'flex'}}>
        <div className='w-[300px] h-full bg-slate-50'></div>
        <div className='flex-1 h-full  bg-slate-100'></div>
      </Card>
    </section>
  );
}