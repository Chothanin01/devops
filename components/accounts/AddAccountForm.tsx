"use client";

import { useState } from "react";
import { createAccount } from "@/lib/actions/accounts";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";

interface AddAccountFormProps {
  onSuccess: () => void;
}

export function AddAccountForm({ onSuccess }: AddAccountFormProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      await createAccount({
        name,
        balance: balance ? parseFloat(balance) : 0,
      });
      setName("");
      setBalance("");
      onSuccess();
    } catch (error) {
      console.error("Failed to create account", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Add New Account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Account Name"
          placeholder="e.g. KBank, SCB, Cash"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Initial Balance"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Add Account"}
        </Button>
      </form>
    </Card>
  );
}
