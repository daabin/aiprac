'use client';

import { SignInButton, SignedOut } from '@clerk/nextjs';
import { IconUser } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { useTranslations } from 'next-intl';

export default function Authorization() {
  const t = useTranslations('login');

  return (
    <div>
      <SignedOut>
        <SignInButton>
          <Button
            className="mt-6 !h-12 !w-32 !text-xl"
            theme="solid"
            type="warning"
            size="large"
            icon={<IconUser size="large" />}
          >
            {t('login')}
          </Button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
