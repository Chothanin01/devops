"use client";

import { useState } from "react";
import { createTransaction, createTransfer } from "@/lib/actions/transactions";
import { Account, TransactionType } from "@/lib/domain/entities";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Card } from "../ui/Card";

interface AddTransactionFormProps {
  accounts: Account[];
  budgets: { id: string; category: string }[];
}

export function AddTransactionForm({ accounts, budgets }: AddTransactionFormProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType | "TRANSFER">("EXPENSE");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || "");
  const [budgetId, setBudgetId] = useState(budgets[0]?.id || "");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !type) return;

    setLoading(true);
    try {
      if (type === "TRANSFER") {
        if (!fromAccountId || !accountId || fromAccountId === accountId) {
          alert("Please select two different accounts for transfer.");
          setLoading(false);
          return;
        }
        await createTransfer({
          fromAccountId,
          toAccountId: accountId,
          amount: parseFloat(amount),
          description,
        });
      } else {
        if (!accountId) {
          alert("Please select an account.");
          setLoading(false);
          return;
        }
        await createTransaction({
          description,
          amount: parseFloat(amount),
          type: type as TransactionType,
          accountId,
          budgetId: type === 'EXPENSE' ? budgetId : undefined,
          receiptUrl,
        });
      }
      setDescription("");
      setAmount("");
      setReceiptUrl("");
    } catch (error) {
      console.error("Failed to create transaction", error);
      alert("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: "EXPENSE", label: "Expense" },
    { value: "INCOME", label: "Income" },
    { value: "TRANSFER", label: "Transfer" },
  ];

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: a.name,
  }));

  const budgetOptions = budgets.map((b) => ({
    value: b.id,
    label: b.category,
  }));

  return (
    <Card title="Record Transaction">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select
          label="Type"
          options={typeOptions}
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        />
        
        {type === "TRANSFER" ? (
          <>
            <Select
              label="From Account"
              options={accountOptions}
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
            />
            <Select
              label="To Account"
              options={accountOptions}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </>
        ) : (
          <>
            <Select
              label="Account"
              options={accountOptions}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            />
            {type === "EXPENSE" && (
              <Select
                label="Budget Category"
                options={budgetOptions}
                value={budgetId}
                onChange={(e) => setBudgetId(e.target.value)}
              />
            )}
          </>
        )}

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <Input
          label="Description"
          placeholder="e.g. Lunch"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        
        {type !== "TRANSFER" && (
          <Input
            label="Receipt URL"
            placeholder="https://..."
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
          />
        )}

        <Button type="submit" disabled={loading || accounts.length < (type === "TRANSFER" ? 2 : 1)}>
          {loading ? "Recording..." : "Record Transaction"}
        </Button>
      </form>
    </Card>
  );
}
