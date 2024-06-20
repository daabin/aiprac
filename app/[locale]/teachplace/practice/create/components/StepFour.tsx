'use client'
import { Typography, Button } from '@douyinfe/semi-ui';
import { Spin } from '@douyinfe/semi-ui';
import Link from 'next/link';
import { IconLoading } from '@douyinfe/semi-icons';
import { useState } from 'react';
import { PreviewStatus } from '@/utils/constants'

export default function StepOne({ questionInfo, pid }: { questionInfo: any, pid: string }) {
  const { Title } = Typography;
  const [completed, setCompleted] = useState<boolean>(false)
  const [genStatus, setGenStatus] = useState<string>('')


  const handleCancel = () => {
    // todo
  }

  return (
    <div className="h-full flex flex-col items-center mt-10">
      {
        !completed && <div className='text-center'>
          <Spin indicator={<IconLoading size="extra-large" />} />
          <Title heading={2} style={{ margin: "20px 0", color: '#ff7900' }}>正在为你生成第 {6} / 10 个题目......</Title>
          <Title heading={3} style={{ color: '#7f1d1d' }}>请勿离开当前页面！</Title>
        </div>
      }
      {
        completed && <div className='text-center'>
          <Title heading={2} style={{ margin: "20px 0", color: '#ff7900' }}>生成成功！</Title>
          <Title heading={3} style={{ color: '#7f1d1d' }}>生成的题目已经保存到题库中，你可以在练习主页查看</Title>
        </div>
      }
      <div className='mt-6'>
        {
          completed && <Link href={'/teachplace/practice'}><Button size="large" theme="light">返回练习主页</Button></Link>
        }
        {
          PreviewStatus.includes(genStatus) && <Link href={'/teachplace/practice/preview'}><Button size="large" theme="solid" className='ml-4'>预览题目</Button></Link>
        }
      </div>
    </div >
  )
}