'use client';

import { useState, useEffect, useMemo } from "react";
import { Typography, RadioGroup, Radio, Table, Spin, Button, Tag } from "@douyinfe/semi-ui"
import { IconLoading, IconCalendar, IconUserCircle } from '@douyinfe/semi-icons';
import { formatUTCTimeToBeijinTime } from '@/utils/tools'
import Link from 'next/link';

const { Column } = Table;

export default function HomeworkPage() {
  const { Title } = Typography
  const [filterType, setFilterType] = useState('ASSIGNED')
  const [homeworkList, setHomeworkList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    getHomeworkList()
  }, [filterType])

  const filterHomeworkList = useMemo(() => {
    if (homeworkList?.length > 0) {
      return homeworkList.filter(homework => {
        if (filterType === 'ALL') {
          return true
        } else if (filterType === 'ASSIGNED') {
          return homework.status === 'ASSIGNED'
        } else if (filterType === 'SUBMMITED') {
          return homework.status !== 'ASSIGNED'
        }
      })
    } else {
      return []
    }
  }, [homeworkList, filterType])

  const getHomeworkList = async () => {
    setLoading(true)
    const res = await fetch('/api/student-homework', {
      method: 'GET',
      cache: 'no-store'
    })
    const data = await res.json()

    if (data?.error) {
      console.log('获取作业列表失败，请刷新重试')
    } else {
      console.log('data------->', data.data)
      setHomeworkList(data.data)
    }
    setLoading(false)
  }

  return <div className="max-w-[1168px] mx-auto">
    <Title heading={1}>我的作业</Title>
    <RadioGroup
      onChange={e => setFilterType(e.target.value)}
      value={filterType}
      type="button"
      buttonSize='large'
      style={{
        marginTop: 20,
        display: 'flex',
        width: 300,
        justifyContent: 'space-between',
      }}
    >
      <Radio value={'ASSIGNED'}>待完成</Radio>
      <Radio value={'SUBMMITED'}>已完成</Radio>
      <Radio value={'ALL'}>全部</Radio>
    </RadioGroup>

    <Spin indicator={<IconLoading />} wrapperClassName='aiprac-spin' size="large" spinning={loading}>
      <Table className="mt-4" dataSource={filterHomeworkList} rowKey='id'>
        <Column title='练习名称与备注' dataIndex="title" render={(_, record, idx) => (
          <div>
            <Title heading={4}>{record?.practice?.title}</Title>
            <p>{record?.practice?.description}</p>
          </div>
        )} />
        <Column title='教师信息' width={300} dataIndex="teacher" render={(_, record, idx) => (
          <div className="flex items-center gap-1">
            <IconUserCircle />
            <span>{record?.practice?.users?.scientific_name}({record?.practice?.users?.email})</span>
          </div>
        )} />
        <Column title='布置时间' width={150} dataIndex="ctime" render={(_, record, idx) => (
          <div className="flex items-center gap-1">
            <IconCalendar />
            <span>{formatUTCTimeToBeijinTime(record?.created_at)?.split(' ')[0]}</span>
          </div>
        )} />
        <Column title='得分' width={100} dataIndex="point" render={(_, record, idx) => (
          <Tag color='blue'>{record?.status === 'GRADED' ? record?.total_score || '/' : '待批改'}</Tag>
        )} />
        <Column align='center' title='操作' width={80} dataIndex="option" render={(value, record, index) => (
          <div className="flex items-center gap-1">
            {record?.status === 'ASSIGNED' &&  <Link href={`/learnplace/homework/do?hid=${record?.id}`}><Button theme='light' size='small'>去完成</Button></Link>}
            {record?.status === 'GRADED' && <Button theme='light' size='small' onClick={() => console.log(record)}>查看详情</Button>}
          </div>
        )} />
      </Table>
    </Spin>
  </div>
}