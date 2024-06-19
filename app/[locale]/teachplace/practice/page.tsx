'use client'

import { Typography, Divider, Table, Button, Toast, Descriptions } from '@douyinfe/semi-ui';
import { WandSparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Column } = Table;

export default function PracticePage() {
  const { Title } = Typography;
  const [practices, setPractices] = useState<any[]>([]);

  useEffect(() => {
    getPractice();
  }, []);

  const getPractice = async () => {
    const res = await fetch('/api/practice', {
      method: 'GET',
    });
    const data = await res.json();

    if (data?.error) {
      Toast.error('提交失败，请稍后再试');
    } else {
      setPractices(data.data)
    }
  }

  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <Title heading={2}>练习</Title>
        <Link href={'/teachplace/practice/create'}><Button theme='solid' size='large' icon={<WandSparkles />}>AI一键出题</Button></Link>
      </div>
      <Divider />
      <Table dataSource={practices} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 5 }} bordered={true}>
        <Column title='ID' width={120} dataIndex="id" />
        <Column title='标题' width={150} dataIndex="title" />
        <Column title='描述' width={200} dataIndex="description" />
        {/* <Column title='题目设置' dataIndex="settings" render={(value, record, index) => (
          <Descriptions align="justify" data={record.settings} ></Descriptions>
        )} /> */}
        <Column title='状态' width={120} render={(value, record, index) => (
          <Button theme='borderless' type='secondary' size='small'>{'生成中'}</Button>
        )} />
        <Column title='操作' width={120} render={(value, record, index) => (
          <Button theme='light' size='small' >布置</Button>
        )} />
      </Table>
    </section>
  )
}