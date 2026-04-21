import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Transaction } from '@/types';
import {
  loadData,
  getAvailableYears,
  getCurrentFiscalYearLabel,
  addTransaction as storageAdd,
  updateTransaction as storageUpdate,
  deleteTransaction as storageDelete,
} from '@/data/storage';
import type { AdminFilters } from '@/types';

interface DataContextValue {
  data: ReturnType<typeof loadData>;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: string[];
  currentYearTransactions: Transaction[];
  adminFilters: AdminFilters;
  setAdminFilters: (filters: AdminFilters) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  reloadData: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(() => loadData());
  const [selectedYear, setSelectedYear] = useState(getCurrentFiscalYearLabel());
  const [adminFilters, setAdminFilters] = useState<AdminFilters>({
    year: 'all',
    category: 'all',
    type: 'all',
  });

  const availableYears = getAvailableYears(data);

  const currentYearTransactions = data[selectedYear] || [];

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const year = selectedYear;
    const updated = storageAdd(data, year, transaction);
    setData(updated);
  }, [data, selectedYear]);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id'>>) => {
    const year = selectedYear;
    const updated = storageUpdate(data, year, id, updates);
    setData(updated);
  }, [data, selectedYear]);

  const deleteTransaction = useCallback((id: string) => {
    const year = selectedYear;
    const updated = storageDelete(data, year, id);
    setData(updated);
  }, [data, selectedYear]);

  const reloadData = useCallback(() => {
    setData(loadData());
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        selectedYear,
        setSelectedYear,
        availableYears,
        currentYearTransactions,
        adminFilters,
        setAdminFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        reloadData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
