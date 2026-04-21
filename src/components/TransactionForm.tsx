import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Transaction, TransactionType } from '@/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import { useData } from '@/context/DataContext';
import { useToast } from '@/context/ToastContext';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export default function TransactionForm({ isOpen, onClose, editTransaction }: TransactionFormProps) {
  const { addTransaction, updateTransaction } = useData();
  const { showToast } = useToast();
  const isDesktop = useBreakpoint(768);

  const [type, setType] = useState<TransactionType>('income');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editTransaction;

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setCategory(editTransaction.category);
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setDate(editTransaction.date);
    } else {
      resetForm();
    }
  }, [editTransaction]);

  useEffect(() => {
    if (isOpen && !editTransaction) {
      resetForm();
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  // Reset category when type changes (unless editing)
  useEffect(() => {
    if (!isEditMode) {
      const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
      setCategory(categories[0]);
    }
  }, [type, isEditMode]);

  function resetForm() {
    setType('income');
    setCategory(INCOME_CATEGORIES[0]);
    setDescription('');
    setAmount('');
    setDate('');
    setErrors({});
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!amount || parseFloat(amount) <= 0) newErrors.amount = 'المبلغ يجب أن يكون أكبر من صفر';
    if (!date) newErrors.date = 'التاريخ مطلوب';
    if (!category) newErrors.category = 'الفئة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const transactionData = {
      type,
      category,
      description: description.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      date,
    };

    if (editTransaction) {
      updateTransaction(editTransaction.id, transactionData);
      showToast('تم تعديل المعاملة بنجاح', 'success');
    } else {
      addTransaction(transactionData);
      showToast('تمت إضافة المعاملة بنجاح', 'success');
    }

    onClose();
  };

  const modalContent = (
    <div className="bg-white w-full max-w-[520px] max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <h2 className="font-arabic font-bold text-xl text-slate-900">
          {isEditMode ? 'تعديل المعاملة' : 'معاملة جديدة'}
        </h2>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
        {/* Type Toggle */}
        <div>
          <label className="font-arabic text-[13px] font-bold text-slate-600 block mb-2">النوع</label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 h-12 font-arabic text-sm font-bold transition-colors ${
                type === 'income'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              وارد
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 h-12 font-arabic text-sm font-bold transition-colors ${
                type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-red-500 hover:bg-red-50'
              }`}
            >
              صادر
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="font-arabic text-[13px] font-bold text-slate-600 block mb-2">الفئة</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full h-12 rounded-xl border-2 px-4 font-arabic text-sm outline-none transition-colors bg-white ${
              errors.category ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
            }`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="font-arabic text-[13px] font-bold text-slate-600 block mb-2">الوصف</label>
          <input
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder="وصف المعاملة..."
            className={`w-full h-12 rounded-xl border-2 px-4 font-arabic text-sm outline-none transition-colors ${
              errors.description ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {errors.description && (
            <p className="font-arabic text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="font-arabic text-[13px] font-bold text-slate-600 block mb-2">المبلغ (€)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setErrors((prev) => ({ ...prev, amount: '' }));
            }}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full h-12 rounded-xl border-2 px-4 font-latin text-sm outline-none transition-colors ${
              errors.amount ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {errors.amount && (
            <p className="font-arabic text-xs text-red-500 mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="font-arabic text-[13px] font-bold text-slate-600 block mb-2">التاريخ</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setErrors((prev) => ({ ...prev, date: '' }));
            }}
            className={`w-full h-12 rounded-xl border-2 px-4 font-latin text-sm outline-none transition-colors ${
              errors.date ? 'border-red-400' : 'border-slate-200 focus:border-emerald-500'
            }`}
          />
          {errors.date && (
            <p className="font-arabic text-xs text-red-500 mt-1">{errors.date}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-700 text-white font-arabic font-bold text-base rounded-xl transition-colors mt-2"
        >
          {isEditMode ? 'حفظ التغييرات' : 'إضافة'}
        </button>
      </form>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />

          {/* Modal / Bottom Sheet */}
          {isDesktop ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-[520px]"
            >
              <div className="bg-white rounded-[20px] shadow-modal overflow-hidden">
                {modalContent}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[90] rounded-t-[20px] shadow-modal overflow-hidden max-h-[90vh]"
            >
              <div className="flex justify-center pt-3 pb-1 bg-white">
                <div className="w-9 h-1 bg-slate-300 rounded-full" />
              </div>
              {modalContent}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
