import { prisma } from "../../infrastructure/prisma";
import { Transaction } from "../../domain/entities";
import { Transaction as PrismaTransaction, Budget as PrismaBudget, AppAccount } from "@prisma/client";

export interface DailyTrend {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface ForecastData {
  currentExpense: number;
  projectedAdditional: number;
  totalProjected: number;
}

export interface HeatmapData {
  date: string;
  value: number;
}

export interface DashboardAnalytics {
  totalNetWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  dailyTrends: DailyTrend[];
  categoryData: CategoryData[];
  forecastData: ForecastData;
  heatmapData: HeatmapData[];
}

export class DashboardService {
  async getDashboardAnalytics(userId: string): Promise<DashboardAnalytics> {
    const accounts = await prisma.appAccount.findMany({
      where: { userId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { account: { userId } },
      include: { budget: true },
      orderBy: { date: 'desc' }
    });
    
    // Map to numbers for easier calculation
    const mappedTransactions = transactions.map((t: PrismaTransaction & { budget: PrismaBudget | null }) => ({
      ...t,
      amount: Number(t.amount),
      category: t.budget?.category || 'Uncategorized'
    }));

    // Aggregate by day (last 30 days)
    const dailyTrends = this.aggregateByDate(mappedTransactions, 30);

    // Category breakdown (Expenses only)
    const categoryData = this.aggregateByCategory(mappedTransactions.filter((t: { type: string }) => t.type === 'EXPENSE'));

    // Monthly Summary
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyTransactions = mappedTransactions.filter((t: { date: Date }) => 
      t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
    );

    const monthlyIncome = monthlyTransactions
      .filter((t: { type: string }) => t.type === 'INCOME')
      .reduce((s: number, t: { amount: number }) => s + t.amount, 0);
    const monthlyExpense = monthlyTransactions
      .filter((t: { type: string }) => t.type === 'EXPENSE')
      .reduce((s: number, t: { amount: number }) => s + t.amount, 0);

    // Advanced: Forecast & Heatmap
    const forecastData = this.calculateForecast(dailyTrends);
    const heatmapData = this.generateHeatmap(mappedTransactions, 90);

    return {
      totalNetWorth: accounts.reduce((sum: number, a: AppAccount) => sum + Number(a.balance), 0),
      monthlyIncome,
      monthlyExpense,
      dailyTrends,
      categoryData,
      forecastData,
      heatmapData
    };
  }

  private calculateForecast(dailyTrends: DailyTrend[]): ForecastData {
    // Simple linear projection based on 30-day average
    const totalExpense = dailyTrends.reduce((sum: number, d: DailyTrend) => sum + d.expense, 0);
    const avgDailyExpense = totalExpense / Math.max(dailyTrends.length, 1);
    
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const remainingDays = Math.max(daysInMonth - now.getDate(), 0);
    
    const projectedAdditional = avgDailyExpense * remainingDays;
    
    return {
      currentExpense: totalExpense,
      projectedAdditional,
      totalProjected: totalExpense + projectedAdditional
    };
  }

  private generateHeatmap(transactions: { type: string, amount: number, date: Date }[], days: number): HeatmapData[] {
    const data: HeatmapData[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayExpense = transactions
        .filter((t: { type: string, date: Date }) => t.type === 'EXPENSE' && t.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

      data.push({ date: dateStr, value: dayExpense });
    }
    return data;
  }

  private aggregateByCategory(transactions: { category: string, amount: number }[]): CategoryData[] {
    const categories: Record<string, number> = {};
    transactions.forEach((t: { category: string, amount: number }) => {
      const category = t.category;
      categories[category] = (categories[category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, value]: [string, number]) => ({ name, value }))
      .sort((a: CategoryData, b: CategoryData) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }

  private aggregateByDate(transactions: { type: string, amount: number, date: Date }[], days: number): DailyTrend[] {
    const data: DailyTrend[] = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter((t: { date: Date }) => t.date.toISOString().split('T')[0] === dateStr);
      const income = dayTransactions.filter((t: { type: string }) => t.type === 'INCOME').reduce((s: number, t: { amount: number }) => s + t.amount, 0);
      const expense = dayTransactions.filter((t: { type: string }) => t.type === 'EXPENSE').reduce((s: number, t: { amount: number }) => s + t.amount, 0);

      data.push({ date: dateStr, income, expense });
    }
    return data;
  }
}
