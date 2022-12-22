import { redirect } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';
import ExpenseForm from '~/components/expenses/ExpenseForm';
import Modal from '~/components/util/Modal';
import { addExpense } from '~/data/expenses.server';
import type { IExpenses } from '~/components/expenses/interfaces';
import { validateExpenseInput } from '~/data/validation.server';
import { requiredUserSession } from '~/data/auth.server';

export default function AddExpensesPage() {
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

export const action: ActionFunction = async ({ request }) => {
  const userId = await requiredUserSession(request);

  const formData = await request.formData();
  const expenseData = Object.fromEntries(formData) as unknown as IExpenses;

  try {
    validateExpenseInput(expenseData);
  } catch (error) {
    return error;
  }

  await addExpense(expenseData, userId);
  return redirect('/expenses');
};
