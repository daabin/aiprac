import { Fragment } from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ClerkProvider } from '@clerk/nextjs';
import { zhCN } from "@clerk/localizations";
import { enUS } from '@clerk/localizations';
import { getTranslations } from 'next-intl/server';
import { defaultLocale } from '@/i18n';

import LocaleProvider from '@/components/LocaleProvider';
import '@/styles/globals.css';
import Script from 'next/script';

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
    <ClerkProvider localization={locale === defaultLocale ? zhCN : enUS}>
      <html lang={locale} suppressHydrationWarning={true}>
        <head>
          <Script id="clarity-script" strategy="afterInteractive">
            {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
          </Script>
        </head>
        <body suppressHydrationWarning={true}>
          <LocaleProvider locale={locale} messages={messages}>
            <Fragment>{children}</Fragment>
          </LocaleProvider>
        </body>
      </html>
    </ClerkProvider>
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
      icon: '/favicon.svg',
    },
  };
}
