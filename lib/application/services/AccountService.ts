import { IAccountRepository } from "../../domain/repositories/IAccountRepository";
import { CreateAccountInput, Account } from "../../domain/entities";

export class AccountService {
  constructor(private accountRepo: IAccountRepository) {}

  async getAllAccounts(userId: string): Promise<Account[]> {
    return this.accountRepo.findAll(userId);
  }

  async getAccount(userId: string, id: string): Promise<Account | null> {
    return this.accountRepo.findById(userId, id);
  }

  async createAccount(userId: string, data: CreateAccountInput): Promise<Account> {
    return this.accountRepo.create(userId, data);
  }

  async updateAccount(userId: string, id: string, data: Partial<CreateAccountInput>): Promise<Account> {
    return this.accountRepo.update(userId, id, data);
  }

  async deleteAccount(userId: string, id: string): Promise<void> {
    return this.accountRepo.delete(userId, id);
  }
}
