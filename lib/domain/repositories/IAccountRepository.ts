import { Account, CreateAccountInput } from "../entities";

export interface IAccountRepository {
  findAll(userId: string): Promise<Account[]>;
  findById(userId: string, id: string): Promise<Account | null>;
  create(userId: string, data: CreateAccountInput): Promise<Account>;
  update(userId: string, id: string, data: Partial<CreateAccountInput>): Promise<Account>;
  delete(userId: string, id: string): Promise<void>;
  updateBalance(userId: string, id: string, amount: number): Promise<Account>;
}
