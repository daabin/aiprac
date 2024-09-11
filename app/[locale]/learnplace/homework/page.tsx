'use client';

import { useState, useEffect, useMemo } from "react";
import { Typography, RadioGroup, Radio, Table, Spin, Button, Tag, Toast } from "@douyinfe/semi-ui"
import { IconLoading, IconCalendar, IconUserCircle, IconMail } from '@douyinfe/semi-icons';
import { formatToBeijinTime } from '@/utils/tools'
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
        } else if (filterType === 'SUBMITTED') {
          return homework.status === 'SUBMITTED'
        } else if (filterType === 'GRADED') {
          return homework.status === 'GRADED'
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
      Toast.error('获取作业列表失败，请刷新重试')
      setHomeworkList([])
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
        width: 400,
        justifyContent: 'space-between',
      }}
    >
      <Radio value={'ASSIGNED'}>待完成</Radio>
      <Radio value={'SUBMITTED'}>已提交</Radio>
      <Radio value={'GRADED'}>已批改</Radio>
      <Radio value={'ALL'}>全部</Radio>
    </RadioGroup>

    <Spin indicator={<IconLoading />} wrapperClassName='aiprac-spin' size="large" spinning={loading}>
      <Table className="mt-4" dataSource={filterHomeworkList} rowKey='id'>
        <Column title='标题' dataIndex="title" render={(_, record, idx) => (
          <Title heading={4}>{record?.practice?.title}</Title>
        )} />
        <Column title='教师信息' width={240} dataIndex="teacher" render={(_, record, idx) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <IconUserCircle />
              <span>{record?.practice?.users?.scientific_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <IconMail />
              <span>{record?.practice?.users?.email}</span>
            </div>
          </div>
        )} />
        <Column title='状态' width={100} dataIndex="status" render={(_, record, idx) => (
            <>
              {record?.status === 'ASSIGNED' && <Tag color='blue'>待完成</Tag>}
              {record?.status === 'SUBMITTED' && <Tag color='green'>待批改</Tag>}
              {record?.status === 'GRADED' && <Tag color='red'>已批改</Tag>}
            </>
          )} />
        <Column title='时间' width={260} dataIndex="ctime" render={(_, record, idx) => (
          <div className="flex flex-col ">
            <div className="flex items-center gap-1">
              <IconCalendar />
              <span>布置时间：{formatToBeijinTime(record?.created_at)}</span>
            </div>
            {
              record?.submit_time && <div className="flex items-center gap-1">
                <IconCalendar />
                <span>提交时间：{formatToBeijinTime(record?.submit_time)}</span>
              </div>
            }
            {
              record?.grade_time && <div className="flex items-center gap-1">
                <IconCalendar />
                <span>批改时间：{formatToBeijinTime(record?.grade_time)}</span>
              </div>
            }
          </div>
        )} />
        <Column title='得分' width={100} dataIndex="point" render={(_, record, idx) => (
          <>
            {record?.status === 'GRADED' && <Tag color='red' size="large" style={{ fontSize: '24px' }}>{record?.total_score || '-'}</Tag>}
          </>
        )} />
        <Column align='center' title='操作' width={80} dataIndex="option" render={(value, record, index) => (
          <div className="flex items-center gap-1">
            {record?.status === 'ASSIGNED' && <Link href={`/learnplace/homework/do?hid=${record?.id}`}><Button theme='light' size='small'>去完成</Button></Link>}
            {record?.status === 'GRADED' && <Link href={`/learnplace/homework/do?hid=${record?.id}`}><Button theme='light' size='small'>查看详情</Button></Link>}
          </div>
        )} />
      </Table>
    </Spin>
  </div>
}