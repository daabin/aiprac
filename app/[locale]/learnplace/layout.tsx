'use client';

import React from 'react';

import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  IconBell,
  IconComment,
  IconDisc,
  IconHome,
  IconQingyan,
  IconSetting,
  IconStar,
  IconVerify,
} from '@douyinfe/semi-icons';
import Logo from '@/public/logo.svg';
import Image from 'next/image';
import { Button, Layout, Nav } from '@douyinfe/semi-ui';

export default function LearnplaceLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) {
  const { Header, Sider, Content } = Layout;
  return (
    <div className="h-screen w-screen overflow-hidden p-2 bg-indigo-100">
      <Layout className="border rounded-lg h-full overflow-hidden">
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            defaultSelectedKeys={['Home']}
            style={{ maxWidth: 220, height: '100%' }}
            items={[
              {
                itemKey: 'Home',
                text: '首页',
                icon: <IconHome size="large" />,
              },
              {
                itemKey: 'learn',
                text: '我的学习',
                icon: <IconStar size="large" />,
              },
              {
                itemKey: 'achievement',
                text: '我的成就',
                icon: <IconVerify size="large" />,
              },
              {
                itemKey: 'discovery',
                text: '发现',
                icon: <IconDisc size="large" />,
              },
              {
                itemKey: 'Setting',
                text: '设置',
                icon: <IconSetting size="large" />,
              },
            ]}
            header={{
              logo: (
                <Image alt="" src={Logo} width={40} height={40}></Image>
              ),
              text:  <span className='text-[28px] font-extrabold !ml-0'>Aiprac</span>,
            }}
            footer={{
              collapseButton: true,
            }}
          />
        </Sider>
        <Layout>
          <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
            <Nav
              mode="horizontal"
              footer={
                <>
                  <Button
                    theme="borderless"
                    icon={<IconComment size="large" />}
                    style={{
                      color: 'var(--semi-color-text-2)',
                      marginRight: '12px',
                    }}
                  />
                  <Button
                    theme="borderless"
                    icon={<IconBell size="large" />}
                    style={{
                      color: 'var(--semi-color-text-2)',
                      marginRight: '12px',
                    }}
                  />
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </>
              }
            ></Nav>
          </Header>
          <Content
            style={{
              padding: '24px',
              backgroundColor: 'var(--semi-color-bg-0)',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
