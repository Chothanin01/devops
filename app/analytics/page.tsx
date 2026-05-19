import { auth, signOut } from "@/auth";
import { DashboardService } from "@/lib/application/services/DashboardService";
import { FinancialChart } from "@/components/analytics/FinancialChart";
import { CategoryChart } from "@/components/analytics/CategoryChart";
import { ForecastChart } from "@/components/analytics/ForecastChart";
import { SpendingHeatmap } from "@/components/analytics/SpendingHeatmap";
import { DashboardNav } from "@/components/ui/DashboardNav";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const dashboardService = new DashboardService();
  const analytics = await dashboardService.getDashboardAnalytics(session.user.id);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-[var(--glassmorphism-text)] tracking-tight">FinTrack</h1>
              <p className="text-gray-500 font-medium">Deep insights into your habits</p>
            </div>
            <form action={async () => { "use server"; await signOut(); }}>
              <Button type="submit" variant="secondary" className="rounded-xl px-6 py-2">Sign Out</Button>
            </form>
          </div>
          <DashboardNav />
        </header>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-[var(--glassmorphism-text)]">Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Income vs Expenses (30D)" className="bg-white/80 backdrop-blur-sm border-[var(--glassmorphism-border)]">
              <FinancialChart data={analytics.dailyTrends} />
            </Card>
            <Card title="Spending by Category" className="bg-white/80 backdrop-blur-sm border-[var(--glassmorphism-border)]">
              <CategoryChart data={analytics.categoryData} />
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Card title="Future Forecast" className="bg-white/80 backdrop-blur-sm border-[var(--glassmorphism-border)]">
                <ForecastChart 
                  currentExpense={analytics.forecastData.currentExpense}
                  projectedAdditional={analytics.forecastData.projectedAdditional}
                  totalProjected={analytics.forecastData.totalProjected}
                />
             </Card>
             <Card title="Spending Intensity (Last 90 Days)" className="bg-white/80 backdrop-blur-sm border-[var(--glassmorphism-border)]">
                <div className="p-4 flex items-center justify-center h-full">
                  <SpendingHeatmap data={analytics.heatmapData} />
                </div>
             </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
