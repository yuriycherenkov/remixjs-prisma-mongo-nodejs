import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch, useLoaderData } from '@remix-run/react';
import Chart from '~/components/expenses/Chart';
import ExpenseStatistics from '~/components/expenses/ExpenseStatistics';
import type { IExpenses } from '~/components/expenses/interfaces';
import { getExpenses } from '~/data/expenses.server';
import Error from '~/components/util/Error';
import { requiredUserSession } from '~/data/auth.server';

export default function ExpensesAnalysisPage() {
  const expenses = useLoaderData<IExpenses[]>();
  
  return (
    <main>
      <Chart expenses={expenses} />
      <ExpenseStatistics expenses={expenses} />
    </main>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  // guard routes, due to nested loaders run in parallel we have to use route guard for all child routes
  const userId = await requiredUserSession(request);
    
  const expenses = await getExpenses(userId);

  if (!expenses || expenses.length === 0) {
    throw json(
      {
        message: 'Could not load expenses for the requested analysis.',
      },
      {
        status: 404,
        statusText: 'Expenses not found',
      },
    );
  }

  return expenses;
};

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <main>
      <Error title={caughtResponse.statusText}>
      <p>{caughtResponse.data?.message || 'Something went wrong.'}</p>
      </Error>
    </main>
  );
}
