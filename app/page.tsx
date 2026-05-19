import { auth, signOut } from "@/auth";
import { getAccounts } from "@/lib/actions/accounts";
import { getTransactions } from "@/lib/actions/transactions";
import { DashboardService } from "@/lib/application/services/DashboardService";
import { prisma } from "@/lib/infrastructure/prisma";
import { NetWorthSummary } from "@/components/accounts/NetWorthSummary";
import { AccountList } from "@/components/accounts/AccountList";
import { TransactionList } from "@/components/transactions/TransactionList";
import { AddTransactionForm } from "@/components/transactions/AddTransactionForm";
import { DashboardNav } from "@/components/ui/DashboardNav";
import { MonthlySummary } from "@/components/analytics/MonthlySummary";
import { Button } from "@/components/ui/Button";
import { Account, Transaction, Budget } from "@/lib/domain/entities";

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const dashboardService = new DashboardService();
  const analytics = await dashboardService.getDashboardAnalytics(session.user.id);
  const accounts = await getAccounts();
  const transactions = await getTransactions();
  const budgets = await prisma.budget.findMany({ where: { userId: session.user.id } });
  
  const serializableBudgets = budgets.map((b) => ({
    ...b,
    amount: Number(b.amount)
  }));

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--glassmorphism-text)] tracking-tight">FinTrack</h1>
              <p className="text-gray-500 font-medium">Welcome back, {session.user.name}</p>
            </div>
            <form action={async () => { "use server"; await signOut(); }}>
              <Button type="submit" variant="secondary" className="rounded-xl px-6 py-2">Sign Out</Button>
            </form>
          </div>
          <DashboardNav />
        </header>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-[var(--glassmorphism-text)]">Overview</h2>
            <MonthlySummary income={analytics.monthlyIncome} expense={analytics.monthlyExpense} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <NetWorthSummary total={analytics.totalNetWorth} />
              
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold px-1 text-[var(--glassmorphism-text)]">Your Accounts</h2>
                <AccountList accounts={accounts} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <AddTransactionForm accounts={accounts} budgets={serializableBudgets} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TransactionList 
              transactions={transactions} 
              accounts={accounts.map((a: Account) => ({ id: a.id, name: a.name }))} 
            />
          </div>
        </div>
      </div>
    </main>
  );
}
