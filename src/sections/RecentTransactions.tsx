import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TransactionListCard from '@/components/TransactionListCard';
import type { Transaction } from '@/types';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-arabic font-bold text-lg text-slate-900">المعاملات الأخيرة</h2>
      </div>
      <TransactionListCard
        transactions={transactions}
        limit={5}
        showViewAll
        onViewAll={() => navigate('/admin')}
      />
    </motion.section>
  );
}
