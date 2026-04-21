import { useMemo } from 'react';
import type { Transaction, TransactionType, ExpenseColorMap } from '@/types';
import {
  getMonthName,
} from '@/data/storage';

export function useTotals(transactions: Transaction[]) {
  return useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
      donationTotal: transactions
        .filter((t) => t.type === 'income' && t.category === 'تبرع')
        .reduce((sum, t) => sum + t.amount, 0),
      subscriptionTotal: transactions
        .filter((t) => t.type === 'income' && t.category === 'اشتراك / رسوم')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  }, [transactions]);
}

export function useFilteredTransactions(
  transactions: Transaction[],
  type: 'all' | TransactionType,
  category: string
) {
  return useMemo(() => {
    let filtered = [...transactions];
    if (type !== 'all') {
      filtered = filtered.filter((t) => t.type === type);
    }
    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, type, category]);
}

export function useBarChartData(transactions: Transaction[]) {
  return useMemo(() => {
    const monthData: { [month: string]: { income: number; expense: number } } = {};

    transactions.forEach((t) => {
      const monthIndex = parseInt(t.date.split('-')[1], 10) - 1;
      const monthName = getMonthName(monthIndex);
      if (!monthData[monthName]) {
        monthData[monthName] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthData[monthName].income += t.amount;
      } else {
        monthData[monthName].expense += t.amount;
      }
    });

    // Order months for fiscal year display (Sep-Aug)
    const fiscalMonths = [
      'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
      'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس',
    ];

    return fiscalMonths
      .filter((m) => monthData[m])
      .map((month) => ({
        month,
        واردات: monthData[month]?.income || 0,
        مصروفات: monthData[month]?.expense || 0,
      }));
  }, [transactions]);
}

export function usePieChartData(transactions: Transaction[]) {
  return useMemo(() => {
    const expenseByCategory: { [category: string]: number } = {};

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      });

    const colors: ExpenseColorMap = {
      'كهرباء': '#94a3b8',
      'ماء': '#6ee7b7',
      'إنترنت': '#10b981',
      'تنظيف': '#475569',
      'صيانة': '#047857',
      'أخرى': '#cbd5e1',
    };

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
      fill: colors[name] || '#94a3b8',
    }));
  }, [transactions]);
}

export function useYearComparison(
  currentTransactions: Transaction[],
  prevYearTransactions: Transaction[]
) {
  return useMemo(() => {
    const currentIncome = currentTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentExpense = currentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentBalance = currentIncome - currentExpense;

    const prevIncome = prevYearTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = prevYearTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const prevBalance = prevIncome - prevExpense;

    if (prevBalance === 0) return { percent: 0, isPositive: true };
    const percent = ((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100;
    return { percent: Math.round(percent), isPositive: percent >= 0 };
  }, [currentTransactions, prevYearTransactions]);
}

export function useAllCategories(transactions: Transaction[], type: 'all' | TransactionType): string[] {
  return useMemo(() => {
    let filtered = transactions;
    if (type !== 'all') {
      filtered = transactions.filter((t) => t.type === type);
    }
    const cats = [...new Set(filtered.map((t) => t.category))];
    return cats.sort();
  }, [transactions, type]);
}
