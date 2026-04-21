import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useTotals } from '@/hooks/useFinanceData';
import { formatAmountWithCurrency } from '@/data/storage';
import { useData } from '@/context/DataContext';
import type { Transaction } from '@/types';

interface BalanceHeroProps {
  transactions: Transaction[];
  prevYearTransactions: Transaction[];
}

export default function BalanceHero({ transactions, prevYearTransactions }: BalanceHeroProps) {
  const { balance } = useTotals(transactions);
  const { selectedYear } = useData();

  // Calculate comparison
  const currentIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const currentExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currentBalance = currentIncome - currentExpense;

  const prevIncome = prevYearTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const prevExpense = prevYearTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const prevBalance = prevIncome - prevExpense;

  let percent = 0;
  let isPositive = true;
  if (prevBalance !== 0) {
    percent = Math.round(((currentBalance - prevBalance) / Math.abs(prevBalance)) * 100);
    isPositive = percent >= 0;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-2xl p-7 md:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-arabic text-[13px] text-slate-400">الرصيد الحالي</p>
          <p className="font-latin font-bold text-5xl text-emerald-700 font-tabular mt-3">
            {formatAmountWithCurrency(balance)}
          </p>
          <p className="font-latin text-sm text-slate-500 mt-2">
            للسنة المالية {selectedYear}
          </p>
        </div>
        <div className="w-14 h-14 rounded-[14px] bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <Wallet className="w-7 h-7 text-emerald-600" />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`font-latin font-bold text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{percent}%
          </span>
          <span className="font-latin text-[13px] text-slate-400">مقارنة بالعام الماضي</span>
        </div>
      </div>
    </motion.div>
  );
}
