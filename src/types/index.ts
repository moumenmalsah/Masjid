export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
}

export type IncomeCategory = 'تبرع' | 'اشتراك / رسوم';
export type ExpenseCategory = 'كهرباء' | 'ماء' | 'إنترنت' | 'تنظيف' | 'صيانة' | 'أخرى';

export const INCOME_CATEGORIES: IncomeCategory[] = ['تبرع', 'اشتراك / رسوم'];
export const EXPENSE_CATEGORIES: ExpenseCategory[] = ['كهرباء', 'ماء', 'إنترنت', 'تنظيف', 'صيانة', 'أخرى'];

export type TransactionType = 'income' | 'expense';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

export interface AdminFilters {
  year: string; // "all" or "YYYY-YYYY"
  category: string; // "all" or specific category
  type: 'all' | TransactionType;
}

export type ExpenseColorMap = Record<string, string>;

export const EXPENSE_COLORS: ExpenseColorMap = {
  'كهرباء': '#94a3b8',
  'ماء': '#6ee7b7',
  'إنترنت': '#10b981',
  'تنظيف': '#475569',
  'صيانة': '#047857',
  'أخرى': '#cbd5e1',
};
