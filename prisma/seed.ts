import { PrismaClient, TransactionType, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seeding...");

  // 1. Find or Create Demo User
  const demoEmail = "demo@example.com";
  let user = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: demoEmail,
      },
    });
    console.log("Created demo user");
  }

  // 2. Clear existing data for this user to have a clean start (optional but good for mocks)
  await prisma.transaction.deleteMany({
    where: { account: { userId: user.id } },
  });
  await prisma.budget.deleteMany({
    where: { userId: user.id },
  });
  await prisma.appAccount.deleteMany({
    where: { userId: user.id },
  });

  console.log("Cleared existing data for user");

  // 3. Create Accounts
  const accounts = await Promise.all([
    prisma.appAccount.create({
      data: {
        name: "Main Savings",
        balance: new Prisma.Decimal(50000),
        userId: user.id,
      },
    }),
    prisma.appAccount.create({
      data: {
        name: "Daily Expenses",
        balance: new Prisma.Decimal(5000),
        userId: user.id,
      },
    }),
    prisma.appAccount.create({
      data: {
        name: "Investment Account",
        balance: new Prisma.Decimal(100000),
        userId: user.id,
      },
    }),
  ]);

  const [savingsAcc, dailyAcc, investAcc] = accounts;
  console.log("Created accounts");

  // 4. Create Budgets
  const categories = [
    { name: "Food & Dining", amount: 10000 },
    { name: "Transportation", amount: 3000 },
    { name: "Rent & Utilities", amount: 15000 },
    { name: "Entertainment", amount: 5000 },
    { name: "Health & Fitness", amount: 2000 },
    { name: "Shopping", amount: 5000 },
  ];

  const budgets = await Promise.all(
    categories.map((cat) =>
      prisma.budget.create({
        data: {
          category: cat.name,
          amount: new Prisma.Decimal(cat.amount),
          userId: user.id,
        },
      })
    )
  );

  console.log("Created budgets");

  // 5. Generate 3 Months of Transactions
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const transactions = [];

  // Monthly Income (Salary)
  for (let i = 0; i < 3; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    date.setDate(1); // 1st of every month

    transactions.push({
      type: TransactionType.INCOME,
      amount: new Prisma.Decimal(60000),
      description: "Monthly Salary",
      date: date,
      accountId: savingsAcc.id,
    });

    // Monthly Transfer from Savings to Daily
    transactions.push({
      type: TransactionType.TRANSFER,
      amount: new Prisma.Decimal(20000),
      description: "Monthly Allowance Transfer",
      date: date,
      accountId: dailyAcc.id,
      fromAccountId: savingsAcc.id,
    });

    // Monthly Rent
    transactions.push({
      type: TransactionType.EXPENSE,
      amount: new Prisma.Decimal(12000),
      description: "Monthly Rent",
      date: date,
      accountId: dailyAcc.id,
      budgetId: budgets.find(b => b.category === "Rent & Utilities")?.id,
    });
  }

  // Random Daily Expenses
  const expenseDescriptions: Record<string, string[]> = {
    "Food & Dining": ["McDonald's", "Starbucks", "Sushi Dinner", "Grocery Store", "KFC", "Local Cafe"],
    "Transportation": ["Grab Taxi", "BTS Ticket", "Gasoline", "MRT Card Topup"],
    "Entertainment": ["Netflix Subscription", "Movie Ticket", "Video Game", "Spotify"],
    "Health & Fitness": ["Gym Membership", "Pharmacy", "Yoga Class"],
    "Shopping": ["Amazon", "Uniqlo", "Apple Store", "H&M"],
  };

  for (let d = new Date(threeMonthsAgo); d <= now; d.setDate(d.getDate() + 1)) {
    // 70% chance of a transaction each day
    if (Math.random() > 0.3) {
      const budget = budgets[Math.floor(Math.random() * budgets.length)];
      if (budget.category === "Rent & Utilities") continue; // Skip rent as we added it monthly

      const descs = expenseDescriptions[budget.category] || ["Misc Expense"];
      const desc = descs[Math.floor(Math.random() * descs.length)];
      const amount = Math.floor(Math.random() * 500) + 50;

      transactions.push({
        type: TransactionType.EXPENSE,
        amount: new Prisma.Decimal(amount),
        description: desc,
        date: new Date(d),
        accountId: dailyAcc.id,
        budgetId: budget.id,
      });
    }

    // Occasional small income
    if (Math.random() > 0.95) {
      transactions.push({
        type: TransactionType.INCOME,
        amount: new Prisma.Decimal(Math.floor(Math.random() * 1000) + 100),
        description: "Gift / Bonus",
        date: new Date(d),
        accountId: savingsAcc.id,
      });
    }
  }

  // Batch insert transactions
  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log(`Created ${transactions.length} transactions`);

  // 6. Recalculate Account Balances
  const allAccounts = await prisma.appAccount.findMany({ where: { userId: user.id } });
  
  for (const acc of allAccounts) {
    const incomes = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { accountId: acc.id, type: TransactionType.INCOME }
    });
    
    const expenses = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { accountId: acc.id, type: TransactionType.EXPENSE }
    });

    const transfersIn = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { accountId: acc.id, type: TransactionType.TRANSFER }
    });

    const transfersOut = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { fromAccountId: acc.id, type: TransactionType.TRANSFER }
    });

    const netBalance = 
      (incomes._sum.amount?.toNumber() || 0) - 
      (expenses._sum.amount?.toNumber() || 0) + 
      (transfersIn._sum.amount?.toNumber() || 0) - 
      (transfersOut._sum.amount?.toNumber() || 0);

    await prisma.appAccount.update({
      where: { id: acc.id },
      data: { balance: new Prisma.Decimal(netBalance) }
    });
  }

  console.log("Updated account balances");
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
