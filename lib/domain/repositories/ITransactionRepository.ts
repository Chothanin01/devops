import { Transaction, CreateTransactionInput } from "../entities";

export interface ITransactionRepository {
  findAll(userId: string, filters?: { accountId?: string }): Promise<Transaction[]>;
  findById(userId: string, id: string): Promise<Transaction | null>;
  create(userId: string, data: CreateTransactionInput): Promise<Transaction>;
  delete(userId: string, id: string): Promise<void>;
}
