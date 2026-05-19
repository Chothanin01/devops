import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { CreateTransactionInput, Transaction } from "../../domain/entities";
import { prisma } from "../../infrastructure/prisma";

export class TransactionService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private accountRepo: IAccountRepository
  ) {}

  async getTransactions(userId: string, filters?: { accountId?: string }): Promise<Transaction[]> {
    return this.transactionRepo.findAll(userId, filters);
  }

  async createTransaction(userId: string, data: CreateTransactionInput): Promise<Transaction> {
    return await prisma.$transaction(async (tx) => {
      // 1. Create Transaction
      const transaction = await this.transactionRepo.create(userId, data);

      // 2. Update Account Balance
      const balanceChange = data.type === 'INCOME' ? data.amount : -data.amount;
      await this.accountRepo.updateBalance(userId, data.accountId, balanceChange);

      return transaction;
    });
  }

  async createTransfer(userId: string, data: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description?: string;
  }): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // 1. Create Transfer Record
      await this.transactionRepo.create(userId, {
        type: 'TRANSFER',
        amount: data.amount,
        accountId: data.toAccountId,
        fromAccountId: data.fromAccountId,
        description: data.description || 'Transfer',
        date: new Date()
      });

      // 2. Update Balances
      await this.accountRepo.updateBalance(userId, data.fromAccountId, -data.amount);
      await this.accountRepo.updateBalance(userId, data.toAccountId, data.amount);
    });
  }

  async deleteTransaction(userId: string, id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const transaction = await this.transactionRepo.findById(userId, id);
      if (!transaction) throw new Error("Transaction not found");

      // 1. Revert Account Balance
      const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
      await this.accountRepo.updateBalance(userId, transaction.accountId, balanceChange);

      // 2. Delete Transaction
      await this.transactionRepo.delete(userId, id);
    });
  }
}
