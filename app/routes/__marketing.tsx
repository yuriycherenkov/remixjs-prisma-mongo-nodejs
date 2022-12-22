import type { LoaderFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import MainHeader from '~/components/navigation/MainHeader';
import { getUserFromSession } from '~/data/auth.server';
import marketingStyles from '~/styles/marketing.css';

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  return getUserFromSession(request);
};

export function links() {
  return [{ rel: 'stylesheet', href: marketingStyles }];
}

// we may want to cache this page, it is not going to be updated frequently
export function headers() {
  return {
    'Cache-Control': 'max-age=3600', // 60 minutes
  };
}