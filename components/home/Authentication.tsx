'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Radio, RadioGroup, Toast } from '@douyinfe/semi-ui';
import { IconForward } from '@douyinfe/semi-icons';
import { RadioChangeEvent } from '@douyinfe/semi-ui/lib/es/radio';

export default function Authentication({ uid, email }: { uid: string, email?: string}) {
  const router = useRouter();
  const [saveLoading, setSaveLoading] = useState(false);
  const [role, setRole] = useState<number>(1);

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
      Toast.error('提交失败，请稍后再试');
    } else {
      if (role === 1) {
        router.push('/learnplace');
      } else {
        router.push('/teachplace');
      }
    }
  };

  const doSth = (evt: RadioChangeEvent) => {
    setRole(evt?.target?.value);
  };

  return (
    <section className="">
      <div>
        <RadioGroup
          type="pureCard"
          defaultValue={1}
          value={role}
          aria-label="角色认证"
          name="role-verify"
          onChange={(e) => doSth(e)}
        >
          <Radio value={1} extra="我正在学习中文">
            我是学生
          </Radio>
          <Radio value={10} extra="我有丰富的中文教学经验">
            我是教师
          </Radio>
        </RadioGroup>
      </div>
      <Button
        className="mt-6 !h-12 !w-32"
        theme="solid"
        type="warning"
        size="large"
        icon={<IconForward  size="large" />}
        onClick={handleSubmit}
        loading={saveLoading}
      >
        立即进入
      </Button>
    </section>
  );
}
