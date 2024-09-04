'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import {IconBadge , IconTreeSelect } from '@douyinfe/semi-icons-lab';
import Logo from '@/public/logo.svg';
import Image from 'next/image';
import { Layout, Nav } from '@douyinfe/semi-ui';
import { isClassInviteCodeExpired } from '@/utils/tools';
import AddUsername from '@/components/AddUsername';

export default function LearnplaceLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/');
  let lastSegment = pathSegments[3];
  lastSegment = lastSegment === 'learnplace' || !lastSegment ? 'homework' : lastSegment;
  console.log('lastSegment', lastSegment);

  useEffect(() => {
    // 处理未登录用户的邀请码
    const inviteCode = localStorage.getItem('__aiprac_invite_code');
    if (inviteCode && inviteCode.length === 21) {
      handleAccessInvite(inviteCode)
    }
  }, []);

  const handleAccessInvite = async (inviteCode: string) => {
    const res = await fetch(`/api/invite-code?code=${inviteCode}`, {
      method: 'GET',
      cache: 'no-store'
    });
    const data = await res.json();

    if (data?.data) {
      const classInfo = data?.data[0];

      // 邀请码已过期
      if (isClassInviteCodeExpired(classInfo?.updated_at)) {
        localStorage.removeItem('__aiprac_invite_code');
        return
      }

      // 执行加入班级操作
      const req = {
        class_id: classInfo?.class_id
      }

      const result = await fetch(`/api/student-class`, {
        method: 'POST',
        body: JSON.stringify(req),
      });

      const resultData = await result.json();

      if (!resultData?.error) {
        localStorage.removeItem('__aiprac_invite_code');
      }
    }
  }

  const { Header, Content } = Layout;
  return (
    <div className="h-screen w-screen overflow-hidden p-2 bg-indigo-100">
      <Layout className="border rounded-lg h-full overflow-hidden">
        <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            mode="horizontal"
            defaultSelectedKeys={[lastSegment]}
          >
            <Nav.Header>
              <Image alt="" src={Logo} width={40} height={40}></Image>
              <span className='text-[28px] font-extrabold !ml-0'>Aiprac</span>
            </Nav.Header>
            <Nav.Item itemKey="homework" text={
              <Link href={`/learnplace/homework`} locale={locale}  prefetch={true}>
                作业
              </Link>
            } icon={<IconBadge size="large" />} />
            <Nav.Item itemKey="classroom" text={
              <Link href={`/learnplace/classroom`} locale={locale}  prefetch={true}>
                班级
              </Link>
            } icon={<IconTreeSelect size="large" />} />
            <Nav.Footer>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Nav.Footer>
          </Nav>
        </Header>
        <Content
          style={{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)',
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
      <AddUsername />
    </div >
  );
};
