
'use client'

import styles from '@/styles/styles.module.css';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { isClassInviteCodeExpired } from '@/utils/tools';
import { Toast, Spin, Empty, Button } from '@douyinfe/semi-ui';
import { IllustrationSuccess, IllustrationNoAccess } from '@douyinfe/semi-illustrations';
import { useUser } from '@clerk/nextjs'

export default function InvitePage() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("code");
  const [loading, setLoading] = useState<boolean>(true);
  const [classInfo, setClassInfo] = useState<any>({});
  const [expired, setExpired] = useState<boolean>(false);
  const curUser = useUser();

  useEffect(() => {
    if (inviteCode) {
      getClassInfo(inviteCode)
    }
  }, [inviteCode]);

  const getClassInfo = async (code: string) => {
    const res = await fetch(`/api/invite-code?code=${code}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    setLoading(false);
    if (data?.error) {
      Toast.error('查询班级信息失败，请稍后重试');
    }

    if (data?.data) {
      const classInfo = data.data[0];
      setClassInfo(classInfo);

      if (isClassInviteCodeExpired(classInfo.created_at)) {
        setExpired(true);
      }
    }
  }

  const handleAccept = async () => {
    console.log('curUser:', curUser)
  }

  return (
    <div className={`flex w-screen h-screen justify-center items-center ${styles.pagebg}`}>
      <div className="min-w-[600px] min-h-[400px] p-20 shadow-md rounded-md bg-white flex justify-center">
        <Spin spinning={loading} size="large">
          {!loading && !expired && <Empty
            title={<p>你有一个来自<span className='text-[#ff9700] font-black'> Aiprac </span>平台老师的邀请待确认</p>}
            image={<IllustrationSuccess style={{ width: 150, height: 150 }} />}
            description={`邀请您加入【 ${classInfo?.classes?.class_name}班级 】`}
          >
            <div className='flex justify-center'>
              <Button size='large' type="primary" theme="solid" onClick={handleAccept}>
                同意加入
              </Button>
            </div>
          </Empty>
          }
          {
            !loading && expired && <Empty
              title={'邀请已过期'}
              image={<IllustrationNoAccess style={{ width: 150, height: 150 }} />}
              description={'邀请已过期，请联系邀请您的老师重新发送邀请'}
            />
          }
        </Spin>
      </div>
    </div>
  );
}