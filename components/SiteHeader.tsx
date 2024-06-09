'use client';

import Link from 'next/link';
import Image from 'next/image';

import { useTranslations } from 'next-intl';

import useScroll from '@/hooks/use-scroll';

import LocaleSwitcher from './LocaleSwitcher';
import Logo from '@/public/logo.svg';

export default function SiteHeader() {
  const t = useTranslations('header');

  const scroll = useScroll(
    (typeof window === 'object' ? document : undefined) as any,
  );

  const classNames1 =
    'bg-white/60 sticky top-0 z-[1031] w-full flex-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-transparent lg:border-b lg:border-slate-900/10';
  const classNames2 =
    'bg-white/95 sticky top-0 z-[1031] w-full flex-none backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-slate-900/75 lg:border-b lg:border-slate-900/10';

  return (
    <header className={!!scroll && scroll.top > 60 ? classNames2 : classNames1}>
      <div className="container mx-auto flex h-16 items-center justify-center space-x-4 sm:justify-between sm:space-x-0">
        <Link
          className="cursor-pointer justify-start"
          title={t('gohome')}
          href="/"
        >
        <Image alt='' src={Logo} width={163} height={50}></Image>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <LocaleSwitcher />
          </nav>
        </div>
      </div>
    </header>
  );
}
