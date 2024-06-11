'use client'
import React from 'react';
import Image from 'next/image';
import { Layout, Nav, Button, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconHome, IconHistogram, IconLive, IconSetting, IconSemiLogo } from '@douyinfe/semi-icons';
import Logo from '@/public/logo.svg';

export default ({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) => {
  const { Header, Sider, Content } = Layout;
  return (
    <Layout  className='border rounded-lg h-full overflow-hidden'>
      <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
        <Nav
          defaultSelectedKeys={['Home']}
          style={{ maxWidth: 220, height: '100%' }}
          items={[
            { itemKey: 'Home', text: '首页', icon: <IconHome size="large" /> },
            { itemKey: 'Histogram', text: '我的学习', icon: <IconHistogram size="large" /> },
            { itemKey: 'Live', text: '测试功能', icon: <IconLive size="large" /> },
            { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> },
          ]}
          header={{
            logo:  <Image alt='' src={Logo} width={150} height={50}></Image>,
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
                  icon={<IconBell size="large" />}
                  style={{
                    color: 'var(--semi-color-text-2)',
                    marginRight: '12px',
                  }}
                />
                <Avatar color="orange" size="small">
                  YJ
                </Avatar>
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
  );
};
