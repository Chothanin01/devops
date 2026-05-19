import { prisma } from "../prisma";
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { Transaction, CreateTransactionInput } from "../../domain/entities";

export class PrismaTransactionRepository implements ITransactionRepository {
  private mapToEntity(prismaTransaction: any): Transaction {
    return {
      ...prismaTransaction,
      amount: Number(prismaTransaction.amount),
      category: prismaTransaction.budget?.category,
    };
  }

  async findAll(userId: string, filters?: { accountId?: string }): Promise<Transaction[]> {
    const transactions = await prisma.transaction.findMany({
      where: {
        account: { userId },
        ...(filters?.accountId ? { accountId: filters.accountId } : {})
      },
      include: {
        budget: true
      },
      orderBy: { date: 'desc' }
    });
    return transactions.map(this.mapToEntity);
  }

  async findById(userId: string, id: string): Promise<Transaction | null> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, account: { userId } },
      include: {
        budget: true
      }
    });
    return transaction ? this.mapToEntity(transaction) : null;
  }

  async create(userId: string, data: CreateTransactionInput): Promise<Transaction> {
    // Verify account ownership
    const account = await prisma.appAccount.findFirst({
      where: { id: data.accountId, userId }
    });
    if (!account) throw new Error("Account not found or access denied");

    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        description: data.description,
        accountId: data.accountId,
        fromAccountId: data.fromAccountId,
        receiptUrl: data.receiptUrl,
        budgetId: data.budgetId,
        date: data.date || new Date(),
      }
    });
    return this.mapToEntity(transaction);
  }

  async delete(userId: string, id: string): Promise<void> {
    const transaction = await prisma.transaction.findFirst({
      where: { id, account: { userId } }
    });
    if (!transaction) throw new Error("Transaction not found or access denied");

    await prisma.transaction.delete({
      where: { id }
    });
  }
}
