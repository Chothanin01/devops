"use server";

import { PrismaTransactionRepository } from "../infrastructure/repositories/PrismaTransactionRepository";
import { PrismaAccountRepository } from "../infrastructure/repositories/PrismaAccountRepository";
import { TransactionService } from "../application/services/TransactionService";
import { CreateTransactionInput } from "../domain/entities";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const transactionRepo = new PrismaTransactionRepository();
const accountRepo = new PrismaAccountRepository();
const transactionService = new TransactionService(transactionRepo, accountRepo);

export async function getTransactions(accountId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return await transactionService.getTransactions(session.user.id, { accountId });
}

export async function createTransaction(data: CreateTransactionInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const transaction = await transactionService.createTransaction(session.user.id, data);
  revalidatePath("/");
  return transaction;
}

export async function createTransfer(data: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await transactionService.createTransfer(session.user.id, data);
  revalidatePath("/");
}

export async function deleteTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  await transactionService.deleteTransaction(session.user.id, id);
  revalidatePath("/");
}
