'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import { Sparkles, UsersRound, BookOpenCheck } from 'lucide-react';
import Logo from '@/public/logo.svg';
import Image from 'next/image';
import { Layout, Nav } from '@douyinfe/semi-ui';
import AddUsername from '@/components/AddUsername';

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
  lastSegment = lastSegment === 'teachplace' || !lastSegment ? 'practice' : lastSegment;
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
                practice: `/teachplace/practice`,
                sutdents: `/teachplace/sutdents`,
                homework: `/teachplace/homework`,
              };
              return (
                <Link
                  style={{ textDecoration: "none" }}
                  href={`${routerMap[props.itemKey || 'practice']}`}
                  locale={locale}
                  prefetch={true}
                >
                  {itemElement}
                </Link>
              );
            }}
            items={[
              {
                itemKey: 'practice',
                text: 'AI 出题',
                icon: <Sparkles size={20} />,
              },
              {
                itemKey: 'homework',
                text: '作业批改',
                icon: <BookOpenCheck size={20} />,
              },
              {
                itemKey: 'sutdents',
                text: '班级与学生',
                icon: <UsersRound size={20} />,
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
      <AddUsername />
    </div>
  );
};
