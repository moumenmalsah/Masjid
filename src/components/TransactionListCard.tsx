import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import type { Transaction } from '@/types';
import CategoryBadge from './CategoryBadge';
import { formatAmountWithCurrency, formatDateForDisplay } from '@/data/storage';

interface TransactionListCardProps {
  transactions: Transaction[];
  limit?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function TransactionListCard({
  transactions,
  limit,
  showViewAll = false,
  onViewAll,
}: TransactionListCardProps) {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Inbox className="w-12 h-12 text-slate-300 mb-3" />
        <p className="font-arabic text-[15px] text-slate-500">لا توجد معاملات</p>
        <p className="font-latin text-[13px] text-slate-400 mt-1">سجّل معاملتك الأولى</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="divide-y divide-slate-100">
        {displayTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
            className="flex items-start justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <CategoryBadge type={transaction.type} category={transaction.category} />
              </div>
              <p className="font-arabic text-sm text-slate-900 mt-1 truncate">{transaction.description}</p>
              <p className="font-latin text-xs text-slate-400 mt-0.5">{formatDateForDisplay(transaction.date)}</p>
            </div>
            <span
              className={`font-latin font-bold text-[15px] font-tabular flex-shrink-0 ${
                transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {transaction.type === 'income' ? '+' : '-'}{formatAmountWithCurrency(transaction.amount)}
            </span>
          </motion.div>
        ))}
      </div>

      {showViewAll && onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full py-3 text-center font-arabic text-sm text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-slate-100"
        >
          عرض جميع المعاملات
        </button>
      )}
    </div>
  );
}
