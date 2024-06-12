'use client';

import React from 'react';

import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  IconBell,
  IconComment,
  IconFolderOpen,
  IconHome,
  IconSetting,
  IconSimilarity,
  IconStar,
  IconUserGroup,
  IconVerify,
} from '@douyinfe/semi-icons';
import { IconToken } from '@douyinfe/semi-icons-lab';
import { Button, Layout, Nav } from '@douyinfe/semi-ui';

export default function TeachplaceLayout({
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
                itemKey: 'course',
                text: '课程',
                icon: <IconStar size="large" />,
              },
              {
                itemKey: 'practice',
                text: '练习',
                icon: <IconFolderOpen size="large" />,
              },
              {
                itemKey: 'examination',
                text: '考试',
                icon: <IconVerify size="large" />,
              },
              {
                itemKey: 'sutdents',
                text: '学生',
                icon: <IconUserGroup size="large" />,
              },
              {
                itemKey: 'Setting',
                text: '设置',
                icon: <IconSetting size="large" />,
              },
            ]}
            header={{
              logo: (
                <IconToken
                  className="h-10"
                  style={{ height: '36px', fontSize: 36 }}
                />
              ),
              text: <span className="text-2xl font-bold">Aiprac</span>,
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
