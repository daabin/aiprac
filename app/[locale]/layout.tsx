import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getLocale, getTranslations } from 'next-intl/server';

import LocaleProvider from '@/components/LocaleProvider';
import SiteHeader from '@/components/SiteHeader';
import '@/styles/globals.scss';

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
    <html lang={locale} suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <LocaleProvider locale={locale} messages={messages}>
          <SiteHeader />
          <main>{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('site');
  const locale = getLocale();
  const title = t('title');
  const description = t('desc');

  return {
    title,
    description,
    icons: {
      icon: '/favicon.ico',
    }
  };
}
