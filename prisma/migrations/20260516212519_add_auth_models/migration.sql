-- Rename existing Account table to AppAccount
ALTER TABLE "Account" RENAME TO "AppAccount";

-- Create Auth-specific tables
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE("provider", "providerAccountId")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    UNIQUE("identifier", "token")
);

-- Alter AppAccount to link to User (need a default for existing records)
-- Assuming we'll link all existing AppAccounts to a dummy admin user or just update later
ALTER TABLE "AppAccount" ADD COLUMN "userId" TEXT;
-- Set a default user ID for existing app accounts if necessary
-- For this migration, we will handle the data link later in the app logic or via seed.
-- ALTER TABLE "AppAccount" ALTER COLUMN "userId" SET NOT NULL; 
-- (Commented out to prevent migration failure if table has data without a user)

-- Re-point transactions
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "AppAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
