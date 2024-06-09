'use client'
import React from 'react';
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive, IconSetting, IconSemiLogo } from '@douyinfe/semi-icons';

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
            { itemKey: 'Histogram', text: '基础数据', icon: <IconHistogram size="large" /> },
            { itemKey: 'Live', text: '测试功能', icon: <IconLive size="large" /> },
            { itemKey: 'Setting', text: '设置', icon: <IconSetting size="large" /> },
          ]}
          header={{
            logo: <IconSemiLogo style={{ fontSize: 36 }} />,
            text: 'Semi Design',
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
                <Button
                  theme="borderless"
                  icon={<IconHelpCircle size="large" />}
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
