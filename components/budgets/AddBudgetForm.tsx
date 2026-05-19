"use client";

import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface AddBudgetFormProps {
  onSuccess: () => void;
}

export function AddBudgetForm({ onSuccess }: AddBudgetFormProps) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setLoading(true);
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify({ category, amount: parseFloat(amount) }),
      });
      if (response.ok) {
        setCategory("");
        setAmount("");
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create budget", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--glassmorphism-border)] shadow-sm space-y-4">
      <Input
        label="Category"
        placeholder="e.g. Food"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <Input
        label="Monthly Limit"
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add Budget"}
      </Button>
    </form>
  );
}
