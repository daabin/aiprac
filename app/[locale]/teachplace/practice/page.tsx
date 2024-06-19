'use client'

import { Typography, Divider, Table, Button, Toast, Tag, SideSheet } from '@douyinfe/semi-ui';
import { WandSparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Column } = Table;

export default function PracticePage() {
  const { Title } = Typography;
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [curSetting, setCurSetting] = useState<any>({});

  useEffect(() => {
    getPractice();
  }, []);

  const getPractice = async () => {
    setLoading(true);
    const res = await fetch('/api/practice', {
      method: 'GET',
    });
    const data = await res.json();
    setLoading(false);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setPractices(data.data)
    }
  }

  const handleReview = (record: any) => {
    setVisible(true);
    setCurSetting(record.settings);
  }

  const handleCloseReview = () => {
    setVisible(false);
  }

  const tagProps = (status: string)  => {
    switch (status) {
      case '成功':
        return {
          color: 'green',
          size: 'large',
          shape: 'circle'
        }
      case '失败':
        return {
          color: 'red',
          size: 'large',
          shape: 'circle'
        }
      case '部分成功':
        return {
          color: 'light-blue',
          size: 'large',
          shape: 'circle'
        }
      default:
        return {
          color: 'light-blue',
          size: 'large',
          shape: 'circle'
        }
    }
  }

  const Color = {
    '成功': 'green',
    '失败': 'red',
    '部分成功': 'light-blue',
  }

  const PreviewStatus = ['成功', '部分成功']

  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <Title heading={4}>已创建的练习</Title>
        <Link href={'/teachplace/practice/create'}><Button theme='solid' size='default' icon={<WandSparkles />}>AI一键出题</Button></Link>
      </div>
      <Divider />
      <Table size='small' loading={loading} dataSource={practices} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 5 }} bordered={true}>
        <Column title='ID' width={60} dataIndex="id" />
        <Column title='标题' width={150} dataIndex="title" />
        <Column title='描述' width={200} dataIndex="description" />
        <Column align='center' title='题目设置' width={80} dataIndex="settings" render={(value, record, index) => (
          <Button theme='borderless' type='secondary' onClick={() => handleReview(record)}>查看</Button>
        )} />
        <Column align='center' title='AI出题状态' width={80} dataIndex="gen_status" render={(value, record, index) => (
          <Tag
            color={Color[record.gen_status]}
            size='large'
            shape='circle'
            type='solid'
          >
            {record.gen_status}
          </Tag>
        )} />
        <Column align='center' title='操作' width={120} render={(value, record, index) => {
          return PreviewStatus.includes(record.gen_status) ? <Link href={`/teachplace/practice/preview?pid=${record.id}`}><Button theme='light' size='small' >预览</Button> </Link>: ''
        }} />
      </Table>
      <SideSheet size='medium' title="题目设置" visible={visible} onCancel={handleCloseReview}>
        <Table dataSource={curSetting} size="small" rowKey='id' bordered={true}>
          <Column title='题号' width={80} dataIndex="question_id" />
          <Column title='难度' dataIndex="question_level" />
          <Column title='能力项' dataIndex="question_ability" />
          <Column title='题型' dataIndex="question_type" />
          <Column title='考察语言点' width={200} dataIndex="language_point" />
        </Table>
      </SideSheet>
    </section>
  )
}