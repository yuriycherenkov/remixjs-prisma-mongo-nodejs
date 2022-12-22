import { redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import ExpenseForm from '~/components/expenses/ExpenseForm';
import type { IExpenses } from '~/components/expenses/interfaces';
import Modal from '~/components/util/Modal';
import { deleteExpense, updateExpanse } from '~/data/expenses.server';
import { validateExpenseInput } from '~/data/validation.server';
// import { getExpense } from '~/data/expenses.server';

export default function UpdateExpensesPage() {
  const navigate = useNavigate();

  function closeHandler() {
    // navigate programmatically
    navigate('..');
  }

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

// export const loader: LoaderFunction = async ({ params }) => {
//   const expenseId = params.id;
//   const expense = await getExpense(expenseId!);

//   return expense;
// }

export const action: ActionFunction = async ({ params, request }) => {
  const expenseId = params.id || '';

  if (request.method === 'PATCH') {
    const formData = await request.formData();
    const expenseData = Object.fromEntries(formData) as unknown as IExpenses;

    try {
      validateExpenseInput(expenseData);
    } catch (error) {
      return error;
    }

    await updateExpanse(expenseId, expenseData);
    return redirect('/expenses');
  }

  if (request.method === 'DELETE') {
    await deleteExpense(expenseId);
    // return redirect('/expenses');
    return { deletedId: expenseId };
  }
};

export function meta({ params, location, data, parentsData }) {
  const expense = parentsData['routes/__app/expenses'].find((expenseItem: IExpenses) => expenseItem.id === params.id);

  return {
    title: expense.title || 'New Remix App',
    description: 'Update expense.',
  };
}

