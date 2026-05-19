/*
  Warnings:

  - Made the column `userId` on table `AppAccount` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'TRANSFER';

-- AlterTable
ALTER TABLE "Account" RENAME CONSTRAINT "Account_pkey1" TO "Account_pkey";

-- AlterTable
ALTER TABLE "AppAccount" RENAME CONSTRAINT "Account_pkey" TO "AppAccount_pkey",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fromAccountId" TEXT,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiptUrl" TEXT,
ADD COLUMN     "recurringInterval" TEXT;

-- AddForeignKey
ALTER TABLE "AppAccount" ADD CONSTRAINT "AppAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
