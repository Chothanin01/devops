import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/infrastructure/prisma";
import { DashboardNav } from "@/components/ui/DashboardNav";
import { AccountSection } from "@/components/accounts/AccountSection";
import { Button } from "@/components/ui/Button";
import { Prisma } from "@prisma/client";

export default async function AccountsPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const accounts = await prisma.appAccount.findMany({
    where: { userId: session.user.id },
    include: { transactions: { orderBy: { date: 'desc' } } }
  });

  type AccountWithTransactions = Prisma.AppAccountGetPayload<{
    include: { transactions: true }
  }>;

  // Prepare serializable data for Client Component
  const serializableAccounts = accounts.map((a: AccountWithTransactions) => ({
    ...a,
    balance: Number(a.balance),
    transactions: a.transactions.map((tx) => ({
      ...tx,
      amount: Number(tx.amount)
    }))
  }));

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--glassmorphism-text)] tracking-tight">FinTrack</h1>
              <p className="text-gray-500 font-medium">Manage your financial accounts</p>
            </div>
            <form action={async () => { "use server"; await signOut(); }}>
              <Button type="submit" variant="secondary" className="rounded-xl px-6 py-2">Sign Out</Button>
            </form>
          </div>
          <DashboardNav />
        </header>

        <AccountSection accounts={serializableAccounts} />
      </div>
    </main>
  );
}
