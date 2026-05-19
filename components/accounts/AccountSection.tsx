"use client";

import { useState } from "react";
import { AddAccountForm } from "./AddAccountForm";
import { Button } from "../ui/Button";
import { deleteAccount } from "@/lib/actions/accounts";

export function AccountSection({ accounts: initialAccounts }: { accounts: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await deleteAccount(id);
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  return (
    <section className="space-y-8">
      {/* Top Action Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[var(--glassmorphism-text)]">My Accounts</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="rounded-xl px-6 py-2">
            + Add Account
          </Button>
        )}
      </div>

      {showForm && (
        <div className="max-w-md bg-white p-6 rounded-2xl border border-[var(--glassmorphism-border)] shadow-sm">
          <AddAccountForm onSuccess={() => {
            setShowForm(false);
            window.location.reload();
          }} />
          <Button variant="secondary" className="w-full mt-4" onClick={() => setShowForm(false)}>Cancel</Button>
        </div>
      )}

      {/* Account Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {accounts.map((account) => (
          <div key={account.id} className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--glassmorphism-border)] shadow-sm">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm font-bold text-gray-800">{account.name}</p>
                <p className="text-sm text-gray-500">Current Balance</p>
                <p className="text-4xl font-bold text-[var(--glassmorphism-text)] tracking-tight">
                  ${Number(account.balance).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-sm">Edit</Button>
                <Button variant="danger" className="text-sm" onClick={() => handleDelete(account.id)}>Delete</Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Recent Activity</h4>
              <div className="space-y-2">
                {account.transactions.slice(0, 5).map((tx: any) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{tx.description || "Transaction"}</span>
                    <span className={`text-sm font-bold ${tx.type === 'INCOME' ? 'text-[var(--glassmorphism-success)]' : 'text-[var(--glassmorphism-danger)]'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
