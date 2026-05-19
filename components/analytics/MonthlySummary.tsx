import { Card } from "../ui/Card";

interface MonthlySummaryProps {
  income: number;
  expense: number;
}

export function MonthlySummary({ income, expense }: MonthlySummaryProps) {
  const savings = income - expense;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 border-l-4 border-l-[#10b981]">
        <p className="text-sm font-medium text-gray-500">Monthly Income</p>
        <p className="text-2xl font-bold text-[#10b981]">${income.toLocaleString()}</p>
      </Card>
      
      <Card className="p-4 border-l-4 border-l-[#ef4444]">
        <p className="text-sm font-medium text-gray-500">Monthly Expense</p>
        <p className="text-2xl font-bold text-[#ef4444]">${expense.toLocaleString()}</p>
      </Card>

      <Card className="p-4 border-l-4 border-l-indigo-500">
        <p className="text-sm font-medium text-gray-500">Net Savings</p>
        <p className={`text-2xl font-bold ${savings >= 0 ? 'text-indigo-600' : 'text-[#ef4444]'}`}>
          ${savings.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {savingsRate > 0 ? `${savingsRate.toFixed(1)}% savings rate` : '0% savings rate'}
        </p>
      </Card>
    </div>
  );
}
