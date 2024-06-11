import Image from 'next/image';
import { redirect } from 'next/navigation'
import SiteHeader from '@/components/home/SiteHeader';
import { auth } from "@clerk/nextjs/server";
import { getUserInfo } from "./actions";
import darkBg from '@/public/dark-bg.avif';
import lightBg from '@/public/light-bg.avif';
import Authorization from "@/components/home/Authorization";
import Authentication from "@/components/home/Authentication";
import Banner from "@/components/home/Banner";
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('site');

  const { userId } = auth();
  let userinfo = null;

  if (userId) {
    const { code, user } = await getUserInfo(userId);
    if (code === 0 && user?.length) {
      userinfo = user?.[0];
      if (userinfo?.role === 1) {
        redirect('/learnplace')
      } else if (userinfo?.role === 10) {
        redirect('/teachplace')
      }
    }
  }

  return (
    <div>
      <SiteHeader />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center overflow-hidden">
        <div className="flex w-[108rem] flex-none justify-end">
          <Image
            src={lightBg}
            alt=""
            className="max-w-none flex-none dark:hidden"
            decoding="async"
            width={1148}
            height={334}
            priority
          />
          <Image
            src={darkBg}
            alt=""
            className="hidden max-w-none flex-none dark:block"
            decoding="async"
            width={1440}
            height={616}
            priority
          />
        </div>
      </div>
      <div className="flex w-10/12 mx-auto pt-20">
        <div className="w-1/2">
          <h1 className='text-5xl leading-normal font-bold mb-12' dangerouslySetInnerHTML={{ __html: t.raw('desc') }}></h1>
          {!userId && <Authorization />}
          {userId && !userinfo?.role && <Authentication uid={userId} />}
        </div>
        <div className="w-1/2">
          <Banner></Banner>
        </div>
      </div>
    </div>
  );
}
