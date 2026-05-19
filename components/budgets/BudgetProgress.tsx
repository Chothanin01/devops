"use client";

interface BudgetProgressProps {
  category: string;
  spent: number;
  limit: number;
}

export function BudgetProgress({ category, spent, limit }: BudgetProgressProps) {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--glassmorphism-border)] shadow-sm space-y-3">
      <div className="flex justify-between items-baseline">
        <h3 className="font-semibold text-gray-800">{category}</h3>
        <p className="text-sm font-medium text-gray-500">
          <span className={isOver ? "text-[var(--glassmorphism-danger)] font-bold" : "text-gray-800"}>
            ${spent.toLocaleString()}
          </span> / ${limit.toLocaleString()}
        </p>
      </div>
      
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-700 ${isOver ? 'bg-[var(--glassmorphism-danger)]' : 'bg-[var(--glassmorphism-primary)]'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
