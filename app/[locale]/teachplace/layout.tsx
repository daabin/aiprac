'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import {
  IconBell,
  IconComment,
  IconBolt,
  IconHome,
  IconSetting,
  IconStar,
  IconUserGroup,
  IconVerify,
} from '@douyinfe/semi-icons';
import Logo from '@/public/logo.svg';
import Image from 'next/image';
import { Button, Layout, Nav } from '@douyinfe/semi-ui';

interface RouterMap {
  [key: string]: string;
}

export default function TeachplaceLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) {
  const pathname = usePathname()
  const pathSegments = pathname.split('/');
  let lastSegment = pathSegments[3];
  lastSegment = lastSegment === 'teachplace' || !lastSegment ? 'home' : lastSegment;
  console.log('lastSegment', lastSegment);

  const { Header, Sider, Content } = Layout;
  return (
    <div className="h-screen w-screen overflow-hidden p-2 bg-indigo-100">
      <Layout className="border rounded-lg h-full overflow-hidden">
        <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
          <Nav
            defaultSelectedKeys={[lastSegment]}
            style={{ maxWidth: 220, height: '100%' }}
            renderWrapper={({ itemElement, props }) => {
              const routerMap: RouterMap = {
                home: `/teachplace`,
                practice: `/teachplace/practice`,
                course: `/teachplace/course`,
                examination: `/teachplace/examination`,
                sutdents: `/teachplace/sutdents`,
                setting: `/teachplace/setting`,
              };
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  href={`${routerMap[props.itemKey || 'home']}`}
                  locale={locale}
                  prefetch={true}
                >
                  {itemElement}
                </Link>
              );
            }}
            items={[
              {
                itemKey: 'home',
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
                icon: <IconBolt size="large" />,
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
                itemKey: 'setting',
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
