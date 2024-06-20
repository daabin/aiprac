'use client'

import { Typography, Row, Col, Card, Table, Button, Toast, Tag, SideSheet, Breadcrumb } from '@douyinfe/semi-ui';
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

  const Color = {
    '成功': 'green',
    '失败': 'red',
    '部分成功': 'light-blue',
  }

  const PreviewStatus = ['成功', '部分成功']

  return (
    <section className='h-full'>
      <div className='flex justify-between items-center mb-4'>
        <Breadcrumb compact={false}>
          <Breadcrumb.Item><Title heading={4}>练习</Title></Breadcrumb.Item>
        </Breadcrumb>
        <Link href={'/teachplace/practice/create'}><Button className='mb-[1rem]' theme='solid' size='default' icon={<WandSparkles />}>AI一键出题</Button></Link>
      </div>
      <div
        style={{
          backgroundColor: 'var(--semi-color-fill-0)',
          padding: 20
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card title='创建练习' bordered={false} >
              <Title heading={2}> {practices.length}</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='累计出题' bordered={false} >
              <Title heading={2}> {68}</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='消耗 Token' bordered={false} >
              <Title heading={2}> {360}</Title>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title='创建记录' bordered={false} >
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
                  return PreviewStatus.includes(record.gen_status) ? <Link href={`/teachplace/practice/preview?pid=${record.pid}`}><Button theme='light' size='small' >预览</Button> </Link> : ''
                }} />
              </Table>
            </Card>
          </Col>
        </Row>
      </div>

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