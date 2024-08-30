'use client';

import { useEffect, useState } from "react";
import { Typography, Skeleton, Toast, Empty } from "@douyinfe/semi-ui"
import { IllustrationNoContent } from '@douyinfe/semi-illustrations';
import { BookOpenText } from 'lucide-react';

export default function ClassroomPage() {
  const { Title } = Typography
  const [classList, setClassList] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState<boolean>(true)

  useEffect(() => {
    getClassList()
  }, [])

  const getClassList = async () => {
    setInitialLoading(true);
    const res = await fetch('/api/student-class', {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();
    setInitialLoading(false);

    if (data?.error) {
      Toast.error('查询失败，请刷新重试');
    } else {
      // 去重
      const result: any[] = []
      Array.isArray(data?.data) && data?.data.forEach((item: any) => {
        if (!result.find(i => i.class_id === item.class_id)) {
          result.push(item)
        }
      })
      console.log('classList------->', result);
      setClassList(result)
    }
  }


  const placeholder = (
    <div>
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
      <Skeleton.Title style={{ height: 100, marginTop: 10 }} />
    </div>
  );


  return <div className="max-w-[1168px] mx-auto">
    <Title heading={1}>我的班级</Title>
    <div
        style={{
          backgroundColor: 'var(--semi-color-fill-0)',
          padding: 20,
          marginTop: 20,
        }}
      >
        <Skeleton active={true} placeholder={placeholder} loading={initialLoading}>
          {classList.map((item) => (
            <div key={item.class_id} className='flex justify-between items-center p-4 bg-white rounded-lg mb-4 shadow-sm hover:cursor-pointer hover:shadow-md'>
              <div className='flex items-center'>
                <div className='bg-orange-300 h-16 w-16 flex justify-center items-center rounded-md mr-4'>
                  <BookOpenText size={40} fill='#ff7900'></BookOpenText>
                </div>
                <div>
                  <Title heading={5}>{item?.classes?.class_name}</Title>
                  <p>{item?.classes?.class_remark}</p>
                </div>
              </div>
              <Title heading={5}>
                授课教师：{item?.classes?.users?.user_name}({item?.classes?.users?.scientific_name})
              </Title>
            </div>
          ))}
          {
            !initialLoading && classList?.length === 0 && (
              <Empty
                image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
                title="暂无班级"
                description="请联系您的老师获取邀请链接"
              >
              </Empty>
            )
          }
        </Skeleton>
      </div>
  </div>
}