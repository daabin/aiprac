'use client'

import { Breadcrumb, Card, Progress, Typography, Toast, Spin } from '@douyinfe/semi-ui';
import { IconBadge } from '@douyinfe/semi-icons-lab';
import { IconLoading } from '@douyinfe/semi-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const { Title } = Typography

export default function DoHomeworkPage() {
  const searchParams = useSearchParams();
  const hid = searchParams.get('hid');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取题目列表
    fetchQuestions();
  }, [hid]);

  const fetchQuestions = async () => {
    const qids = await fetchQids()
    console.log('qids------->', qids);

    if (qids?.length > 0) {

      const res = await fetch('/api/do-homework', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          qids,
        })
      });

      setLoading(false);
      const data = await res.json();

      console.log('fetchQuestions------->', data);

      if (data?.error) {
        Toast.error('查询题目列表失败，请刷新重试');
      }
      setQuestions(data?.data || []);

    } else {
      setLoading(false);
      Toast.warning('当前作业没有题目');
    }
  }

  const fetchQids = async () => {
    const res = await fetch(`/api/do-homework?hid=${hid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();

    console.log('fetchQids------->', data);
    let qids = []
    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      qids = data?.data[0]?.qid_list || []
    }

    return qids
  }

  return (
    <div className="max-w-[1168px] mx-auto">
      <Breadcrumb compact={false} className="mb-4">
        <Breadcrumb.Item icon={<IconBadge />}>
          <Link href="/learnplace/homework">
            我的作业
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>作业详情</Breadcrumb.Item>
      </Breadcrumb>
      {loading && <div className='mt-40 flex justify-center items-center'>
        <Spin spinning={loading} indicator={<IconLoading />} size='large' />
      </div>}

      {!loading && <div className='flex gap-6'>
        <div className='flex-1'>
          <Card>123</Card>
        </div>
        <Card className='w-[300px]'>
          <div className='flex items-center gap-4'>
            <Title heading={6}>进度</Title>
            <Progress percent={80} style={{ height: '8px', width: '120px' }} />
            <p>{1}/{questions?.length}</p>
          </div>
          <div className='my-5 py-5 border-y border-dotted'>
            <Title heading={6}>答题卡</Title>
            <div className='flex gap-4 mt-2'>
              <div className='flex items-center gap-2'><div className='w-4 h-4 border'></div>未做</div>
              <div className='flex items-center gap-2'><div className='w-4 h-4 bg-blue-600'></div>已做</div>
              <div className='flex items-center gap-2'><div className='w-4 h-4 border-2 border-blue-600'></div>当前</div>
            </div>
          </div>
        </Card>
      </div>}
    </div>
  );
}