"use client";

interface ForecastProps {
  currentExpense: number;
  projectedAdditional: number;
  totalProjected: number;
}

export function ForecastChart({ currentExpense, projectedAdditional, totalProjected }: ForecastProps) {
  const percentage = (currentExpense / totalProjected) * 100;

  return (
    <div className="p-4 flex flex-col gap-6 h-full justify-center">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">End of Month Projection</p>
        <p className="text-5xl font-black text-[var(--glassmorphism-text)] tracking-tight">
          ${totalProjected.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
          <div 
            className="h-full bg-[var(--glassmorphism-primary)] transition-all duration-1000" 
            style={{ width: `${percentage}%` }}
          />
          <div 
            className="h-full bg-gray-300 opacity-50 animate-pulse" 
            style={{ width: `${100 - percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm font-medium">
          <div className="flex flex-col">
            <span className="text-gray-400">Current</span>
            <span className="text-[var(--glassmorphism-text)]">${currentExpense.toLocaleString()}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-400">Projected</span>
            <span className="text-gray-500">+${projectedAdditional.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Based on your spending speed over the last 30 days.
      </p>
    </div>
  );
}
