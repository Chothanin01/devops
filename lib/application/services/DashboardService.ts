import { prisma } from "../../infrastructure/prisma";
import { Transaction } from "../../domain/entities";

export class DashboardService {
  async getDashboardAnalytics(userId: string) {
    const accounts = await prisma.appAccount.findMany({
      where: { userId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { account: { userId } },
      include: { budget: true },
      orderBy: { date: 'desc' }
    });
    
    // Map to numbers for easier calculation
    const mappedTransactions = transactions.map(t => ({
      ...t,
      amount: Number(t.amount),
      category: t.budget?.category || 'Uncategorized'
    }));

    // Aggregate by day (last 30 days)
    const dailyTrends = this.aggregateByDate(mappedTransactions, 30);

    // Category breakdown (Expenses only)
    const categoryData = this.aggregateByCategory(mappedTransactions.filter(t => t.type === 'EXPENSE'));

    // Monthly Summary
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyTransactions = mappedTransactions.filter(t => 
      t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear
    );

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((s, t) => s + t.amount, 0);

    // Advanced: Forecast & Heatmap
    const forecastData = this.calculateForecast(dailyTrends);
    const heatmapData = this.generateHeatmap(mappedTransactions, 90);

    return {
      totalNetWorth: accounts.reduce((sum, a) => sum + Number(a.balance), 0),
      monthlyIncome,
      monthlyExpense,
      dailyTrends,
      categoryData,
      forecastData,
      heatmapData
    };
  }

  private calculateForecast(dailyTrends: any[]) {
    // Simple linear projection based on 30-day average
    const totalExpense = dailyTrends.reduce((sum, d) => sum + d.expense, 0);
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

  private generateHeatmap(transactions: any[], days: number) {
    const data = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayExpense = transactions
        .filter(t => t.type === 'EXPENSE' && t.date.toISOString().split('T')[0] === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({ date: dateStr, value: dayExpense });
    }
    return data;
  }

  private aggregateByCategory(transactions: any[]) {
    const categories: Record<string, number> = {};
    transactions.forEach(t => {
      const category = t.category;
      categories[category] = (categories[category] || 0) + t.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }

  private aggregateByDate(transactions: any[], days: number) {
    const data = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => t.date.toISOString().split('T')[0] === dateStr);
      const income = dayTransactions.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

      data.push({ date: dateStr, income, expense });
    }
    return data;
  }
}
