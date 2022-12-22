import ExpenseListItem from './ExpenseListItem';
import type { IExpensesList } from './interfaces';

function ExpensesList({ expenses }: IExpensesList) {
  return (
    <ol id="expenses-list">
      {expenses?.map((expense) => (
        <li key={expense.id}>
          <ExpenseListItem
            id={expense.id}
            title={expense.title}
            amount={expense.amount}
          />
        </li>
      ))}
    </ol>
  );
}

export default ExpensesList;
