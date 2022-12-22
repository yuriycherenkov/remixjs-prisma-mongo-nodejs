export interface IExpensesBase {
  title: string;
  amount: string;
  id: string;
}

export interface IExpenses extends IExpensesBase {
  date: string;
}

export interface IChartBar {
  maxValue: number;
  value: number;
  label: string;
}

export interface IExpensesList {
  expenses: IExpenses[];
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IError extends Error {
  status?: number;
  code?: number;
}