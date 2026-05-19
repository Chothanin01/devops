import { Transaction } from "@/lib/domain/entities";
import { Card } from "../ui/Card";

interface TransactionListProps {
  transactions: Transaction[];
  accounts: { id: string, name: string }[];
}

export function TransactionList({ transactions, accounts }: TransactionListProps) {
  const getAccountName = (id: string) => {
    return accounts.find(a => a.id === id)?.name || "Unknown Account";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <Card title="Recent Transactions">
      <div className="flex flex-col gap-0 divide-y divide-zinc-100 dark:divide-zinc-800">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="py-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {transaction.description || "No description"}
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  {transaction.category || "Uncategorized"}
                </span>
                <span>•</span>
                <span>{getAccountName(transaction.accountId)}</span>
                <span>•</span>
                <span>{formatDate(transaction.date)}</span>
              </div>
            </div>
            <span className={`font-bold ${
              transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'INCOME' ? '+' : '-'} {formatCurrency(transaction.amount)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center text-zinc-500 py-8">
            No transactions yet. Start by adding one below.
          </p>
        )}
      </div>
    </Card>
  );
}
