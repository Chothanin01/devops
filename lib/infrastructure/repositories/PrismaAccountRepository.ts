import { prisma } from "../prisma";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { Account, CreateAccountInput } from "../../domain/entities";

export class PrismaAccountRepository implements IAccountRepository {
  private mapToEntity(prismaAccount: any): Account {
    return {
      ...prismaAccount,
      balance: Number(prismaAccount.balance),
    };
  }

  async findAll(userId: string): Promise<Account[]> {
    const accounts = await prisma.appAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return accounts.map(this.mapToEntity);
  }

  async findById(userId: string, id: string): Promise<Account | null> {
    const account = await prisma.appAccount.findUnique({
      where: { id, userId }
    });
    return account ? this.mapToEntity(account) : null;
  }

  async create(userId: string, data: CreateAccountInput): Promise<Account> {
    const account = await prisma.appAccount.create({
      data: {
        userId,
        name: data.name,
        balance: data.balance ?? 0,
      }
    });
    return this.mapToEntity(account);
  }

  async update(userId: string, id: string, data: Partial<CreateAccountInput>): Promise<Account> {
    const account = await prisma.appAccount.update({
      where: { id, userId },
      data: {
        name: data.name,
        balance: data.balance,
      }
    });
    return this.mapToEntity(account);
  }

  async delete(userId: string, id: string): Promise<void> {
    await prisma.appAccount.delete({
      where: { id, userId }
    });
  }

  async updateBalance(userId: string, id: string, amount: number): Promise<Account> {
    const account = await prisma.appAccount.update({
      where: { id, userId },
      data: {
        balance: {
          increment: amount
        }
      }
    });
    return this.mapToEntity(account);
  }
}
