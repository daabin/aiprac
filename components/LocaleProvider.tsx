'use client';

import { PropsWithChildren } from 'react';

import { LocaleProvider as SemiLocaleProvider } from '@douyinfe/semi-ui';
import { AbstractIntlMessages, NextIntlClientProvider } from 'next-intl';

import { defaultLocale, languages } from '@/i18n';

export default function LocaleProvider({
  children,
  locale,
  messages,
}: PropsWithChildren<{
  locale: string;
  messages: AbstractIntlMessages;
}>) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={'Asia/Shanghai'}
    >
      <SemiLocaleProvider locale={languages[locale ?? defaultLocale].semi}>
        {children}
      </SemiLocaleProvider>
    </NextIntlClientProvider>
  );
}
