import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useTotals } from '@/hooks/useFinanceData';
import { formatAmountWithCurrency } from '@/data/storage';
import type { Transaction } from '@/types';

interface AdminStatsBarProps {
  transactions: Transaction[];
}

export default function AdminStatsBar({ transactions }: AdminStatsBarProps) {
  const { income, expense, balance } = useTotals(transactions);

  const stats = [
    {
      label: 'إجمالي الواردات',
      value: income,
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      valueColor: 'text-slate-900',
    },
    {
      label: 'إجمالي المصروفات',
      value: expense,
      icon: TrendingDown,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-slate-900',
    },
    {
      label: 'الرصيد',
      value: balance,
      icon: Wallet,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      valueColor: balance >= 0 ? 'text-emerald-700' : 'text-red-500',
    },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-3 scrollbar-hide">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.25, ease: 'easeOut' }}
          className="snap-start flex-shrink-0 w-[200px] md:w-auto bg-white border border-slate-200 rounded-2xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-arabic text-[13px] text-slate-400">{stat.label}</p>
              <p className={`font-latin font-bold text-[28px] ${stat.valueColor} font-tabular mt-1`}>
                {formatAmountWithCurrency(stat.value)}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
              <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
