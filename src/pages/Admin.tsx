import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import AdminLoginModal from '@/components/AdminLoginModal';
import TransactionForm from '@/components/TransactionForm';
import FAB from '@/components/FAB';
import AdminStatsBar from '@/sections/AdminStatsBar';
import FilterBar from '@/sections/FilterBar';
import TransactionTable from '@/sections/TransactionTable';
import BackupCard from '@/sections/BackupCard';
import type { Transaction } from '@/types';

export default function Admin() {
  const { isAuthenticated } = useAuth();
  const { data, adminFilters } = useData();

  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);

  // Show login modal if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, [isAuthenticated]);

  // Filter transactions based on admin filters
  const allTransactions = useMemo(() => {
    if (adminFilters.year === 'all') {
      return Object.values(data).flat();
    }
    return data[adminFilters.year] || [];
  }, [data, adminFilters.year]);

  const { type, category } = adminFilters;
  const displayTransactions = useMemo(() => {
    let filtered = [...allTransactions];
    if (type !== 'all') {
      filtered = filtered.filter((t) => t.type === type);
    }
    if (category !== 'all') {
      filtered = filtered.filter((t) => t.category === category);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allTransactions, type, category]);

  const handleNewTransaction = () => {
    setEditTransaction(null);
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTransaction(null);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  if (!isAuthenticated) {
    return (
      <>
        <AdminLoginModal isOpen={showLogin} onClose={handleLoginSuccess} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-arabic text-slate-400 text-lg">يرجى تسجيل الدخول للوصول إلى لوحة الإدارة</p>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-6">
      <AdminStatsBar transactions={displayTransactions} />
      <FilterBar onNewTransaction={handleNewTransaction} />
      <TransactionTable transactions={displayTransactions} onEdit={handleEdit} />
      <BackupCard />

      <FAB onClick={handleNewTransaction} />

      <TransactionForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editTransaction={editTransaction}
      />
    </div>
  );
}
