import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { FaPlus, FaDownload } from 'react-icons/fa';
import ExpensesList from '~/components/expenses/ExpensesList';
import type { IExpenses } from '~/components/expenses/interfaces';
import { requiredUserSession } from '~/data/auth.server';
import { getExpenses } from '~/data/expenses.server';

export default function ExpensesLayout() {
  const expenses = useLoaderData<IExpenses[]>();

  const hasExpenses = expenses && expenses.length > 0;

  return (
    <>
      <Outlet />
      <main>
        <section id="expenses-actions">
          <Link to="add">
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href="expenses/raw">
            <FaDownload />
            <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses ? (
          <ExpensesList expenses={expenses} />
        ) : (
          <section id="no-expenses">
            <h1>No expenses found</h1>
            <p>
              Start{' '}
              <Link to="add">
                <span>adding some</span>
              </Link>{' '}
              today.
            </p>
          </section>
        )}
      </main>
    </>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  // guard routes, due to nested loaders run in parallel we have to use route guard for all child routes
  const userId = await requiredUserSession(request);

  const expenses = await getExpenses(userId);

  // if(!expenses || expenses.length === 0) {
  //   throw json({
  //     message: 'Could not find any expenses',
  //   },
  //   {
  //     status: 404, statusText: 'No expenses found'
  //   })
  // }

  // return expenses;
  return json(expenses, {
    headers: {
      'Cache-Control': 'max-age=3',
    },
  });
};

export function headers({
  loaderHeaders,
}) {
  return {
    'Cache-Control': loaderHeaders.get('Cache-Control'), // 3 sec
  };
}