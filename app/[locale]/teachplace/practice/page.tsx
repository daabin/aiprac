'use client'

import { Typography, Row, Col, Card, Table, Button, Toast, Tag, SideSheet, Breadcrumb, Skeleton, Spin } from '@douyinfe/semi-ui';
import { Sparkles } from 'lucide-react';
import { IconLoading } from '@douyinfe/semi-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import VocabularyConfData from '@/utils/vocabularyConfData';
import './styles.css';
const { Column } = Table;

export default function PracticePage() {
  const { Title } = Typography;
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(true);
  const [visible, setVisible] = useState(false);
  const [curSetting, setCurSetting] = useState<any[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingReGen, setLoadingReGen] = useState(false);

  useEffect(() => {
    getPractice();
    getQuestionsCount()
  }, []);

  const getPractice = async () => {
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

    setLoadingCount(false);
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

  const handleReGen = async (record: any) => {
    console.log('handleReGen------->', record);

    setLoadingReGen(true);

    const req = {
      question_type: record.question_type,
      question_ability: record.question_ability,
      language_point: record.language_point,
      question_level: record.question_level,
    }
    try {
      const res = await fetch('/api/gen', {
        method: 'POST',
        body: JSON.stringify(req),
      })

      const result = await res.json();

      console.log('reGen result------->', result);

      if (!result?.error && result?.content) {
        const newRecord: any = {}
        newRecord.content = result?.content || {}
        newRecord.token = result?.token || 0
        newRecord.gen_status = 1

        if (record?.question_type === '看图认字') {
          const target = VocabularyConfData.find((item: any) => item.vocabulary === record?.language_point)
          newRecord.content.img_url = target?.img_url || ''
        } else if (record?.question_type === '听力选择') {
          newRecord.content.audio_url = result?.audio_url || ''

          const res = await fetch('/api/storage', {
            method: 'POST',
            body: JSON.stringify({ audio_url: result?.audio_url, qid: record?.qid }),
          })
          const resData = await res.json()

          console.log('upload audio res------->', resData?.data?.path);

          if (resData?.data?.path) {
            newRecord.content.supabase_path = resData?.data?.path
          } else {
            newRecord.gen_status = 0
          }
        } else if (record?.question_type === '口语发音') {
          newRecord.content = {
            question: result?.content || {},
            question_text: {
              "pinyin": "qǐng yòng zhōng wén pīn dú xià liè jù zi",
              "text": "请用中文拼读下列句子"
            }
          }
        }

        await handleUpdate(record?.qid, newRecord)

        setLoadingReGen(false);
        getPractice();
        getQuestionsCount();
        handleReview(record);
      } else {
        setLoadingReGen(false);
        Toast.error('重新出题失败，请稍后重试');
      }
    } catch (error: any) {
      setLoadingReGen(false);
      Toast.error('重新出题失败，请稍后重试');
    }
  }

  const handleUpdate = async (qid: string, record: any) => {
    console.log('do save ----->', qid, record)

    const updateQuestion = await fetch('/api/questions', {
      method: 'PUT',
      body: JSON.stringify({ qid, record }),
    })

    const updateQuestionRes = await updateQuestion.json()

    if (updateQuestionRes.error) {
      Toast.error('重新出题失败2，请稍后重试');
    }
  }

  const handleClean = () => {
    setVisible(false);
    setCurSetting([]);
    setLoadingReGen(false);
    setLoadingQuestions(false);
  }

  const formatTime = (time: any) => {
    const date = new Date(time);
    date.setHours(date.getHours() + 8);
    return date.toLocaleString();
  }

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
            <Card title='已创建练习' bordered={false}>
              <Skeleton loading={loading} placeholder={<Skeleton.Title style={{ height: '44px' }} />}>
                <Title heading={1}> {practices.length || '-'}</Title>
              </Skeleton>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='待批改作业' bordered={false} >
              <Title heading={1}>-</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='免费出题数量' bordered={false} >
              <Title heading={1}>200</Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card title='可用出题数量' bordered={false}>
              <Skeleton loading={loadingCount} placeholder={<Skeleton.Title style={{ height: '44px' }} />}>
                <Title heading={1}> {200 - questionsCount || '-'} </Title>
              </Skeleton>
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title='创建记录' bordered={false} >
              <Table size='small' loading={loading} dataSource={practices} rowKey='id' sticky className='mt-6' pagination={{ pageSize: 10 }} bordered={true}>
                <Column title='编号' width={100} render={(value, record, index) => (
                  index + 1
                )} />
                <Column title='练习名称' width={250} dataIndex="title" />
                <Column title='练习描述' width={200} dataIndex="description" />
                <Column title='创建时间' width={180} dataIndex="created_at" render={(value, record, index) => (
                  formatTime(value)
                )} />
                <Column align='center' title='题目设置及出题结果' width={160} dataIndex="settings" render={(value, record, index) => (
                  <Button theme='borderless' type='secondary' size='small' onClick={() => handleReview(record)}>查看</Button>
                )} />
                <Column align='center' title='操作' width={120} render={(value, record, index) => (
                  <Link href={`/teachplace/practice/preview?pid=${record.pid}`}><Button theme='light' size='small' >预览</Button> </Link>
                )} />
              </Table>
            </Card>
          </Col>
        </Row>
      </div>

      <SideSheet maskClosable={false} onCancel={handleClean} size='large' title="练习" visible={visible}>
        <Spin indicator={<IconLoading />} wrapperClassName='aiprac-spin' size="large" tip="AI 出题中..." spinning={loadingReGen}>
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
            <Column align='center' title='操作' width={80} dataIndex="option" render={(value, record, index) => (
              <Button disabled={record.gen_status === 1 || loadingReGen} theme='light' size='small' onClick={() => handleReGen(record)}>重新出题</Button>
            )} />
          </Table>
        </Spin>
      </SideSheet>
    </section>
  )
}