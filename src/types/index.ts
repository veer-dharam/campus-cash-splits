
export interface User {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  groupId: string;
  amount: number;
  description: string;
  paidBy: string; // userId
  participants: string[]; // userIds
  date: string;
  settled: boolean;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  expenses: Expense[];
  createdAt: string;
}

export interface Balance {
  from: string; // userId
  to: string; // userId
  amount: number;
}

export interface Settlement {
  id: string;
  groupId: string;
  from: string; // userId
  to: string; // userId
  amount: number;
  date: string;
  expenseIds: string[]; // Related expenses
}
