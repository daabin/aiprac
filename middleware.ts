import createIntlMiddleware from 'next-intl/middleware';

import { defaultLocale, locales } from './i18n';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from 'next/server';

const publicPages = ['/sign-in', '/sign-up', '/'];

const isPublicRoute = createRouteMatcher(publicPages);
const authMiddleware = clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    auth().protect();
  }
})

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap((p) => (p === '/' ? ['', '/'] : p))
      .join('|')})/?$`,
    'i'
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);
 
  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    return (authMiddleware as any)(req);
  }
}

export const config = {
  // Skip all paths that aren't pages that you'd like to internationalize
  matcher: ['/((?!api|_next|favicon.ico|assets).*)'],
};
