export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string | null;
  date: Date;
  accountId: string;
  fromAccountId?: string | null;
  receiptUrl?: string | null;
  isRecurring: boolean;
  recurringInterval?: string | null;
  budgetId?: string | null;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccountInput {
  name: string;
  balance?: number;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  description?: string;
  accountId: string;
  fromAccountId?: string;
  receiptUrl?: string;
  budgetId?: string;
  date?: Date;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  spent?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBudgetInput {
  category: string;
  amount: number;
}
