import { Account } from "@/lib/domain/entities";
import { Card } from "../ui/Card";

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts.map((account) => (
        <Card key={account.id} className="hover:border-blue-500 transition-colors">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {account.name}
            </span>
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(account.balance)}
            </span>
          </div>
        </Card>
      ))}
      {accounts.length === 0 && (
        <p className="col-span-full text-center text-zinc-500 py-8">
          No accounts found. Add your first bank account or wallet.
        </p>
      )}
    </div>
  );
}
