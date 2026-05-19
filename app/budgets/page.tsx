import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/infrastructure/prisma";
import { DashboardNav } from "@/components/ui/DashboardNav";
import { BudgetList } from "@/components/budgets/BudgetList";
import { Button } from "@/components/ui/Button";
import { Budget, Transaction } from "@prisma/client";

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  // Fetch budgets and their current spending
  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id }
  });

  const transactions = await prisma.transaction.findMany({
    where: { account: { userId: session.user.id }, type: 'EXPENSE' }
  });

  const budgetData = budgets.map((b: Budget) => ({
      id: b.id,
      userId: b.userId,
      category: b.category,
      amount: Number(b.amount),
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      spent: transactions
        .filter((t: Transaction) => t.budgetId === b.id)
        .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)
  }));

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--glassmorphism-text)] tracking-tight">FinTrack</h1>
              <p className="text-gray-500 font-medium">Keep your spending in check</p>
            </div>
            <form action={async () => { "use server"; await signOut(); }}>
              <Button type="submit" variant="secondary" className="rounded-xl px-6 py-2">Sign Out</Button>
            </form>
          </div>
          <DashboardNav />
        </header>

        <BudgetList initialBudgets={budgetData} />
      </div>
    </main>
  );
}
