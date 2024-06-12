'use client'
import React from 'react';
import { SignedIn, UserButton } from '@clerk/nextjs'
import { Layout, Nav, Button } from '@douyinfe/semi-ui';
import { IconBell, IconVerify, IconHome, IconStar, IconDisc, IconSetting, IconComment, IconQingyan } from '@douyinfe/semi-icons';
import { IconToken } from '@douyinfe/semi-icons-lab';

export default ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) => {
  const { Header, Sider, Content } = Layout;
  return (
    <div className="h-screen w-screen overflow-hidden p-2 bg-indigo-100">
      <Layout className='border rounded-lg h-full overflow-hidden'>
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            defaultSelectedKeys={['Home']}
            style={{ maxWidth: 220, height: '100%' }}
            items={[
              { itemKey: 'Home', text: '首页', icon: <IconHome size="large" /> },
              { itemKey: 'learn', text: '我的学习', icon: <IconStar size="large" /> },
              { itemKey: 'achievement', text: '我的成就', icon: <IconVerify size="large" /> },
              { itemKey: 'discovery', text: '发现', icon: <IconDisc size="large" /> },
              { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> },
            ]}
            header={{
              logo: <IconToken className='h-10' style={{ height: '36px', fontSize: 36 }} />,
              text: <span className='text-2xl font-bold'>Aiprac</span>
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
