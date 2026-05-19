"use client";

interface HeatmapProps {
  data: { date: string; value: number }[];
}

export function SpendingHeatmap({ data }: HeatmapProps) {
  // Max value to determine intensity
  const maxVal = Math.max(...data.map(d => d.value), 1);

  const getIntensity = (val: number) => {
    if (val === 0) return "bg-gray-100";
    const intensity = val / maxVal;
    if (intensity < 0.25) return "bg-red-100";
    if (intensity < 0.5) return "bg-red-300";
    if (intensity < 0.75) return "bg-red-500";
    return "bg-red-700";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {data.map((day, i) => (
          <div
            key={day.date}
            className={`w-4 h-4 rounded-sm sm:w-6 sm:h-6 ${getIntensity(day.value)} transition-all hover:ring-2 hover:ring-offset-1 hover:ring-gray-300 cursor-default`}
            title={`${day.date}: $${day.value.toLocaleString()}`}
          />
        ))}
      </div>
      
      <div className="flex justify-center items-center gap-4 text-[10px] text-gray-400 font-medium uppercase tracking-widest">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm" />
          <div className="w-3 h-3 bg-red-100 rounded-sm" />
          <div className="w-3 h-3 bg-red-300 rounded-sm" />
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <div className="w-3 h-3 bg-red-700 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
