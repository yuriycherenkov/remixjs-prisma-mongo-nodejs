import type { ActionFunction } from '@remix-run/node';
import AuthForm from '~/components/auth/AuthForm';
import type { ICredentials, IError } from '~/components/expenses/interfaces';
import { login, signup } from '~/data/auth.server';
import { validateCredentials } from '~/data/validation.server';
import authStyles from '~/styles/auth.css';

export default function AuthPage() {
  return <AuthForm />;
}

export const action: ActionFunction = async ({ request }) => {
  // add validation
  const searchParams = new URL(request.url).searchParams;
  const authMode = searchParams.get('mode') || 'login';

  const formData = await request.formData();
  const credentials = Object.fromEntries(formData) as unknown as ICredentials;

  try {
    validateCredentials(credentials);    
  } catch (error) {
    return error;
  }

  try {
    if (authMode === 'login') {
      // login logic
      return await login(credentials);
    } else {
      // signup logic
      return await signup(credentials);
    } 
  } catch (error) {
    console.log('error on login ', error);
    const errorTyped = error as IError;
    if ([422, 401].some(item => item === errorTyped.status)) {
      return { credentials: errorTyped.message };
    } 
  }
};

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: authStyles,
    },
  ];
}

// we may want to cache this page, it is not going to be updated frequently
export function headers({
  parentHeaders,
}) {
  return {
    'Cache-Control': parentHeaders.get('Cache-Control'), // 60 minutes
  };
}