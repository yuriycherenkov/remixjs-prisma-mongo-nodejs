import type { LoaderFunction } from '@remix-run/node';
import { requiredUserSession } from '~/data/auth.server';
import { getExpenses } from '~/data/expenses.server';

export const loader: LoaderFunction = async ({ request }) => {
  // guard routes, due to nested loaders run in parallel we have to use route guard for all child routes
  const userId = await requiredUserSession(request);
    
  const expenses = await getExpenses(userId);
  return expenses;
};
