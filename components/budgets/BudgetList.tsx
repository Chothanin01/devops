"use client";

import { useState } from "react";
import { BudgetProgress } from "@/components/budgets/BudgetProgress";
import { AddBudgetForm } from "@/components/budgets/AddBudgetForm";
import { Button } from "@/components/ui/Button";
import { Budget } from "@/lib/domain/entities";

export function BudgetList({ initialBudgets }: { initialBudgets: Budget[] }) {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {budgets.map((b: Budget) => (
        <BudgetProgress 
          key={b.id} 
          category={b.category} 
          spent={Number(b.spent)} 
          limit={Number(b.amount)} 
        />
      ))}
      
      {showForm ? (
        <AddBudgetForm onSuccess={() => {
            setShowForm(false);
            window.location.reload(); // Simple refresh to fetch new data
        }} />
      ) : (
        <div 
          onClick={() => setShowForm(true)}
          className="p-6 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-[var(--glassmorphism-primary)] transition-colors cursor-pointer"
        >
          + Add New Budget
        </div>
      )}
    </section>
  );
}
