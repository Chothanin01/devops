import { prisma } from "./lib/infrastructure/prisma";

async function testSystem() {
  console.log("Starting System Test...");

  try {
    // 1. Test User/Account Creation
    const user = await prisma.user.create({
      data: { email: "test@example.com", name: "Tester" }
    });
    const account = await prisma.appAccount.create({
      data: { userId: user.id, name: "Test Bank", balance: 1000 }
    });
    console.log("✅ User & Account created");

    // 2. Test Transaction (Expense with Receipt)
    await prisma.transaction.create({
      data: {
        type: 'EXPENSE',
        amount: 100,
        description: 'Test Item',
        accountId: account.id,
        receiptUrl: 'http://example.com/receipt.jpg'
      }
    });
    console.log("✅ Transaction (Expense) created");

    // 3. Test Transfer
    const account2 = await prisma.appAccount.create({
      data: { userId: user.id, name: "Test Savings", balance: 500 }
    });
    await prisma.transaction.create({
      data: {
        type: 'TRANSFER',
        amount: 50,
        accountId: account2.id,
        fromAccountId: account.id,
        description: 'Transfer Test'
      }
    });
    console.log("✅ Transfer created");

    console.log("All tests passed successfully!");
  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

testSystem();
