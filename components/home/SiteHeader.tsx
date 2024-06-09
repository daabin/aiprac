'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@douyinfe/semi-ui';
import { IconUser } from '@douyinfe/semi-icons';

import { useTranslations } from 'next-intl';

import useScroll from '@/hooks/use-scroll';

import LocaleSwitcher from '../LocaleSwitcher';
import Logo from '@/public/logo.svg';

export default function SiteHeader() {
  const t = useTranslations('login');

  const scroll = useScroll(
    (typeof window === 'object' ? document : undefined) as any,
  );

  const classNames1 =
    'bg-white/60 sticky top-0 z-[1031] w-full flex-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-transparent lg:border-b lg:border-slate-900/10';
  const classNames2 =
    'bg-white/95 sticky top-0 z-[1031] w-full flex-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-slate-900/75 lg:border-b lg:border-slate-900/10';

  return (
    <header className={!!scroll && scroll.top > 60 ? classNames2 : classNames1}>
      <div className='flex h-16 justify-between items-center  px-6'>
        <div className="flex  justify-center space-x-4">
          <Link
            className="cursor-pointer justify-start"
            href="/"
          >
            <Image alt='' src={Logo} width={150} height={50}></Image>
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
          <LocaleSwitcher />
          <SignedOut>
            <SignInButton>
              <Button size='large' theme='solid' type='warning' icon={<IconUser />}>{t('login')}</Button>
            </SignInButton >
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>

    </header>
  );
}
