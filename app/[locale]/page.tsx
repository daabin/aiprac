import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth, currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import styles from '@/styles/styles.module.css';

import Authentication from '@/components/home/Authentication';
import SiteHeader from '@/components/home/SiteHeader';
import aiprac from '@/public/aiprac.png';

import { getUserInfo } from './actions';
import { RoleCode } from '@/utils/constants';

export default async function Page() {
  const t = await getTranslations('site');

  const { userId } = auth();
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress
  let userinfo = null;
  console.log('cur user info:', userId, email)

  if (userId) {
    const { code, user } = await getUserInfo(userId);
    console.log('getuserinfo res:', code, user)
    if (code === 0 && user?.length) {
      userinfo = user?.[0];
      console.log('userinfo:', userinfo)
      if (userinfo?.role === RoleCode.STUDENT) {
        redirect('/learnplace');
      } else if (userinfo?.role === RoleCode.TEACHER) {
        redirect('/teachplace');
      }
    }
  }

  return (
    <div className={`h-screen overflow-hidden ${styles.pagebg}`}>
      <SiteHeader />
      <div className="flex flex-col" >
        <h1
          className="text-6xl text-center leading-normal font-bold my-16"
        >
          <span className='relative z-10'>{t.raw('desc')}
            <svg className='absolute top-[-6px] w-[31%] h-[70px] left-[54%] z-1 origin-bottom -rotate-2' xmlns="http://www.w3.org/2000/svg" width="298" height="84" viewBox="0 0 326 70" fill="none"><g><path opacity="0.3" d="M0 12L320 11L320 72L0 71L0 12Z" fill="#FF46C0"></path></g></svg>
          </span>
        </h1>
        <div className='w-9/12 mx-auto'>
          <Image src={aiprac} alt="aiprac"></Image>
        </div>
      </div>
      {userId && !userinfo?.role && <Authentication uid={userId} email={email} />}
    </div>
  );
}
