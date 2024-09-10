'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Radio, RadioGroup, Toast, Modal } from '@douyinfe/semi-ui';
import { RadioChangeEvent } from '@douyinfe/semi-ui/lib/es/radio';
import { RoleCode } from '@/utils/constants';

export default function Authentication({ uid, email }: { uid: string, email?: string }) {
  const router = useRouter();
  const [saveLoading, setSaveLoading] = useState(false);
  const [role, setRole] = useState<string>(RoleCode.STUDENT);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleSubmit = async () => {
    setSaveLoading(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, role, email }),
    });
    const data = await res.json();
    setSaveLoading(false)

    if (data.error) {
      Toast.error('请求失败，请稍后再试');
    } else {
      if (role === RoleCode.STUDENT) {
        router.push('/learnplace/homework');
      } else if (role === RoleCode.TEACHER) {
        router.push('/teachplace/practice');
      }
    }
  };

  const doSth = (evt: RadioChangeEvent) => {
    setRole(evt?.target?.value);
  };

  const footer = (
    <div className='flex justify-center'>
      <Button
        theme="solid"
        type="warning"
        size="large"
        onClick={handleSubmit}
        loading={saveLoading}
      >
        立即进入
      </Button>
    </div>
  )

  return (
    <div>
      <Modal visible={showModal} centered hasCancel={false} header={null} closable={false} footer={footer}>
        <h2 className='text-3xl font-extrabold my-8 text-center text-[#ff9700]'>请选择您的角色</h2>
        <div className='flex justify-center items-center my-16'>
          <RadioGroup
            type="pureCard"
            direction="horizontal"
            defaultValue={RoleCode.STUDENT}
            value={role}
            name="role-verify"
            onChange={(e) => doSth(e)}
            className="flex-nowrap"
          >
            <Radio className='w-[190px] bg-slate-100' value={RoleCode.STUDENT} extra="我正在学中文">
              <h3 className='text-2xl'>我是学生</h3>
            </Radio>
            <Radio className='w-[190px]  bg-slate-100' value={RoleCode.TEACHER} extra="我正在教中文">
              <h3 className='text-2xl'>我是教师</h3>
            </Radio>
          </RadioGroup>
        </div>
      </Modal>
    </div>
  );
}
