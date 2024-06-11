import createIntlMiddleware from 'next-intl/middleware';
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { defaultLocale, locales } from './i18n';

const isProtectedRoute = createRouteMatcher(['/:locale/teachplace(.*)', '/:locale/learnplace(.*)']);

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default clerkMiddleware((auth, request) => {
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  return intlMiddleware(request);
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
