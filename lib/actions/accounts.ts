"use server";

import { PrismaAccountRepository } from "../infrastructure/repositories/PrismaAccountRepository";
import { AccountService } from "../application/services/AccountService";
import { CreateAccountInput } from "../domain/entities";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const accountRepo = new PrismaAccountRepository();
const accountService = new AccountService(accountRepo);

export async function getAccounts() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return await accountService.getAllAccounts(session.user.id);
}

export async function getAccount(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return await accountService.getAccount(session.user.id, id);
}

export async function createAccount(data: CreateAccountInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const account = await accountService.createAccount(session.user.id, data);
  revalidatePath("/");
  return account;
}

export async function updateAccount(id: string, data: Partial<CreateAccountInput>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const account = await accountService.updateAccount(session.user.id, id, data);
  revalidatePath("/");
  return account;
}

export async function deleteAccount(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await accountService.deleteAccount(session.user.id, id);
  revalidatePath("/");
}
