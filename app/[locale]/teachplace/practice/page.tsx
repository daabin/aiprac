'use client'

import { Typography, Row, Col, Card, Table, Button, Toast, Tag, SideSheet, Breadcrumb } from '@douyinfe/semi-ui';
import { set } from 'lodash';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Column } = Table;

export default function PracticePage() {
  const { Title } = Typography;
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [curSetting, setCurSetting] = useState<any[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);


  useEffect(() => {
    getPractice();
    getQuestionsCount()
  }, []);

  const getPractice = async () => {
    setLoading(true);
    const res = await fetch('/api/practice', {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();
    setLoading(false);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setPractices(data.data)
    }
  }

  const getQuestionsCount = async () => {
    const res = await fetch(`/api/question-account?genStatus=1`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setQuestionsCount(data.data);
      console.log('getQuestionsCount------->', data.data);
    }
  }

  const handleReview = async (record: any) => {
    console.log('handleReview------->', record);
    setVisible(true);
    setLoadingQuestions(true);
    const res = await fetch(`/api/questions?pid=${record?.pid}`, {
      method: 'GET',
      cache: 'no-store',
    });
    const data = await res.json();
    setLoadingQuestions(false);
    console.log('fetchQuestions------->', data);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      setCurSetting(data.data);
    }
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
        <Link href={'/teachplace/practice/create'}><Button className='mb-[1rem]' theme='solid' size='default' icon={<Sparkles />}>AI一键出题</Button></Link>
      </div>
      <div
        style={{
          backgroundColor: 'var(--semi-color-fill-0)',
          padding: 20
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card title='创建练习' bordered={false} >
              <Title heading={1}> {practices.length || '-'}</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='待批改练习' bordered={false} >
              <Title heading={1}>-</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='免费出题数量' bordered={false} >
              <Title heading={1}>200</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='可用出题数量' bordered={false} >
              <Title heading={1}> {200 - questionsCount || '-'} </Title>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title='创建记录' bordered={false} >
              <Table size='small' loading={loading} dataSource={practices} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 10 }} bordered={true}>
                <Column title='编号' width={60} render={(value, record, index) => (
                  index + 1
                )} />
                <Column title='练习名称' width={250} dataIndex="title" />
                <Column title='练习描述' width={200} dataIndex="description" />
                <Column title='创建时间' width={180} dataIndex="created_at" render={(value, record, index) => (
                  new Date(value).toLocaleString()
                )} />
                <Column align='center' title='题目设置' width={100} dataIndex="settings" render={(value, record, index) => (
                  <Button theme='borderless' type='secondary' size='small' onClick={() => handleReview(record)}>查看</Button>
                )} />
                <Column align='center' title='出题结果' width={100} dataIndex="gen_status" render={(value, record, index) => (
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

      <SideSheet size='large' title="练习" visible={visible} onCancel={handleCloseReview}>
        <Table dataSource={curSetting} loading={loadingQuestions} rowKey='qid' size="small" bordered={true}>
          <Column title='练习难度' width={100} dataIndex="question_level" />
          <Column title='考查能力' width={100} dataIndex="question_ability" />
          <Column title='考查题型' width={150} dataIndex="question_type" />
          <Column title='考查语言点' width={200} dataIndex="language_point" />
          <Column align='center' title='出题结果' width={80} dataIndex="gen_status" render={(value, record, index) => (
            <Tag
              color={record.gen_status === 1 ? 'green' : 'red'}
              size='large'
              shape='circle'
              type='solid'
            >
              {record.gen_status === 1 ? '成功' : '失败'}
            </Tag>
          )} />
        </Table>
      </SideSheet>
    </section>
  )
}