import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, ChevronUp, ChevronDown, SearchX } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import ConfirmDialog from '@/components/ConfirmDialog';
import { formatAmountWithCurrency, formatDateForDisplay } from '@/data/storage';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import type { Transaction } from '@/types';

type SortField = 'date' | 'amount' | 'category' | 'type' | 'description';
type SortDir = 'asc' | 'desc' | null;

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onEdit }: TransactionTableProps) {
  const { deleteTransaction } = useData();
  const { showToast } = useToast();
  const isDesktop = useBreakpoint(640);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : sortDir === 'desc' ? null : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedTransactions = useMemo(() => {
    let sorted = [...transactions];
    if (sortDir && sortField) {
      sorted.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
          case 'description':
            comparison = a.description.localeCompare(b.description);
            break;
        }
        return sortDir === 'asc' ? comparison : -comparison;
      });
    }
    return sorted;
  }, [transactions, sortField, sortDir]);

  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const paginatedTransactions = isDesktop
    ? sortedTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedTransactions;

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    showToast('تم حذف المعاملة بنجاح', 'success');
    setConfirmDelete(null);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 text-slate-300" />;
    if (sortDir === 'asc') return <ChevronUp className="w-3 h-3 text-emerald-600" />;
    if (sortDir === 'desc') return <ChevronDown className="w-3 h-3 text-emerald-600" />;
    return <ChevronUp className="w-3 h-3 text-slate-300" />;
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <SearchX className="w-12 h-12 text-slate-300 mb-3" />
        <p className="font-arabic text-base text-slate-500">لا توجد معاملات مطابقة</p>
        <p className="font-latin text-[13px] text-slate-400 mt-1">جرب تغيير عوامل التصفية</p>
      </div>
    );
  }

  return (
    <>
      {isDesktop ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-slate-50 border-b border-slate-100 grid grid-cols-[80px_110px_120px_1fr_120px_100px] gap-0">
            {[
              { field: 'date' as SortField, label: 'التاريخ' },
              { field: 'amount' as SortField, label: 'المبلغ' },
              { field: 'description' as SortField, label: 'الوصف' },
              { field: 'category' as SortField, label: 'الفئة' },
              { field: 'type' as SortField, label: 'النوع' },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className="flex items-center gap-1 px-5 py-3.5 font-arabic text-[13px] font-bold text-slate-500 text-right hover:text-emerald-600 transition-colors"
              >
                {label}
                <SortIcon field={field} />
              </button>
            ))}
            <div className="px-5 py-3.5 font-arabic text-[13px] font-bold text-slate-500 text-right">الإجراءات</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {paginatedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
                className={`grid grid-cols-[80px_110px_120px_1fr_120px_100px] gap-0 items-center hover:bg-emerald-50/50 transition-colors ${
                  index % 2 === 1 ? 'bg-slate-50/50' : ''
                }`}
              >
                <div className="px-5 py-3.5 font-latin text-[13px] text-slate-400">
                  {formatDateForDisplay(transaction.date)}
                </div>
                <div className={`px-5 py-3.5 font-latin text-sm font-bold font-tabular ${
                  transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatAmountWithCurrency(transaction.amount)}
                </div>
                <div className="px-5 py-3.5 font-arabic text-sm text-slate-900 truncate">
                  {transaction.description}
                </div>
                <div className="px-5 py-3.5">
                  <CategoryBadge type={transaction.type} category={transaction.category} />
                </div>
                <div className="px-5 py-3.5">
                  <span className={`font-arabic text-xs px-2.5 py-0.5 rounded-full ${
                    transaction.type === 'income'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-500'
                  }`}>
                    {transaction.type === 'income' ? 'وارد' : 'صادر'}
                  </span>
                </div>
                <div className="px-5 py-3.5 flex items-center gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(transaction.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="font-arabic text-sm text-slate-500 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                السابق ←
              </button>
              <span className="font-latin text-[13px] text-slate-400">
                صفحة {currentPage} من {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="font-arabic text-sm text-slate-500 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                → التالي
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Mobile: Card List */
        <div className="space-y-3">
          {paginatedTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.3) }}
              className="bg-white border border-slate-200 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CategoryBadge type={transaction.type} category={transaction.category} />
                    <span className={`font-arabic text-xs ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? 'وارد' : 'صادر'}
                    </span>
                  </div>
                  <p className="font-arabic text-sm text-slate-900 mt-2">{transaction.description}</p>
                  <p className="font-latin text-xs text-slate-400 mt-1">{formatDateForDisplay(transaction.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`font-latin font-bold text-sm font-tabular ${
                    transaction.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatAmountWithCurrency(transaction.amount)}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(transaction.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="تأكيد الحذف"
        message="هل أنت متأكد من حذف هذه المعاملة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        confirmText="حذف"
        cancelText="إلغاء"
      />
    </>
  );
}
