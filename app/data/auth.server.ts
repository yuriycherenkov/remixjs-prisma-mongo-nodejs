import { prisma } from './database.server';
import { hash, compare } from 'bcryptjs';
import type { ICredentials, IError } from '~/components/expenses/interfaces';
import { createCookieSessionStorage, redirect } from '@remix-run/node';

const SESSION_SECRET = process.env.SESSION_SECRET || '';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    secrets: [SESSION_SECRET],
    sameSite: 'lax',
    maxAge: 20 * 24 * 60 * 60, // 30 days,
    httpOnly: true,
  },
});

async function createUserSession(userId: string, redirectPath: string) {
  const session = await sessionStorage.getSession();

  session.set('userId', userId);

  const sessionSetCookie = await sessionStorage.commitSession(session);
  
  return redirect(redirectPath, {
    headers: {
      'Set-Cookie': sessionSetCookie,
    },
  });
}

export async function getUserFromSession(request: Request): Promise<string | null> {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));
  const userId = session.get('userId');

  if (!userId) {
    return null;
  }

  return userId;
}

export async function destroyUserSession(request: Request) {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'));

  return redirect('/', {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}

export async function requiredUserSession(request: Request) {
  const userId = await getUserFromSession(request);

  if (!userId) {
    throw redirect('/auth?mode=login');
  }

  return userId;
}

export async function signup({ email, password }: ICredentials) {
  const existingUser = await prisma.users.findFirst({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('A user with the provided email address exists already.') as IError;
    error.status = 422;
    throw error;
  }

  const passwordHash = await hash(password, 12);

  const user = await prisma.users.create({ data: { email, password: passwordHash } });

  return createUserSession(user.id, '/expenses');
}

export async function login({ email, password }: ICredentials) {
  const existingUser = await prisma.users.findFirst({
    where: { email },
  });

  if (!existingUser) {
    // TODO: move into a separate function
    const error = new Error('Could not log you in, please check the provided credentials.') as IError;
    error.status = 401;
    throw error;
  }

  const passwordCorrect = await compare(password, existingUser.password);

  if (!passwordCorrect) {
    const error = new Error('Could not log you in, please check the provided credentials.') as IError;
    error.status = 401;
    throw error;
  }

  return createUserSession(existingUser.id, '/expenses');
}