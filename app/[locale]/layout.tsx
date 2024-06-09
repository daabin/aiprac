import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getTranslations } from 'next-intl/server';

import LocaleProvider from '@/components/LocaleProvider';
import { ClerkProvider } from '@clerk/nextjs'
import '@/styles/globals.scss';
import { Fragment } from 'react';

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: Record<string, any>;
}) {
  let messages;
  try {
    messages = (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning={true}>
        <body suppressHydrationWarning={true}>
          <LocaleProvider locale={locale} messages={messages}>
            <Fragment>{children}</Fragment>
          </LocaleProvider>
        </body>
      </html>
    </ClerkProvider >
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('site');
  const title = t('title');
  const description = t('desc');

  return {
    title,
    description,
    icons: {
      icon: '/logo.webp',
      shortcut: '/logo.webp',
      apple: '/logo.webp',
    }
  };
}
