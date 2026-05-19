interface NetWorthSummaryProps {
  total: number;
}

export function NetWorthSummary({ total }: NetWorthSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
  };

  return (
    <div className="bg-blue-600 dark:bg-blue-700 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
      <h2 className="text-blue-100 text-sm font-medium uppercase tracking-wider mb-2">
        Total Net Worth
      </h2>
      <p className="text-4xl md:text-5xl font-bold">
        {formatCurrency(total)}
      </p>
    </div>
  );
}
