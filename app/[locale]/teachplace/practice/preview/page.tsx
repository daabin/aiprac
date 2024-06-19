'use client'

import { Breadcrumb } from '@douyinfe/semi-ui';
import Link from 'next/link';

export default function PracticePreviewPage() {
  return (
    <section className='h-full flex flex-col'>
      <div className='mb-8'>
        <Breadcrumb compact={false} className="mb-4">
          <Breadcrumb.Item><Link href={'/teachplace/practice'}> 练习</Link></Breadcrumb.Item>
          <Breadcrumb.Item>题目预览</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </section>
  );
}