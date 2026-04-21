import type { Transaction } from '@/types';

const STORAGE_KEY = 'masjid_finance_data';
const AUTH_KEY = 'masjid_finance_auth';

export interface FinanceData {
  [fiscalYear: string]: Transaction[];
}

function getCurrentFiscalYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  // Fiscal year starts in September
  if (month >= 8) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

function generateId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getSampleData(): FinanceData {
  const currentYear = getCurrentFiscalYear();
  const [startYear] = currentYear.split('-').map(Number);
  const prevYear = `${startYear - 1}-${startYear}`;

  return {
    [currentYear]: [
      { id: generateId(), type: 'income', category: 'تبرع', description: 'تبرع أخ أحمد لشهر رمضان', amount: 200, date: `${startYear}-09-15` },
      { id: generateId(), type: 'income', category: 'تبرع', description: 'تبرع أخت فاطمة', amount: 100, date: `${startYear}-09-20` },
      { id: generateId(), type: 'income', category: 'اشتراك / رسوم', description: 'اشتراكات سنوية — 5 أشخاص', amount: 250, date: `${startYear}-10-01` },
      { id: generateId(), type: 'income', category: 'تبرع', description: 'تبرع جماعي يوم الجمعة', amount: 350, date: `${startYear}-10-06` },
      { id: generateId(), type: 'income', category: 'اشتراك / رسوم', description: 'اشتراكات شهري أكتوبر', amount: 150, date: `${startYear}-10-15` },
      { id: generateId(), type: 'income', category: 'تبرع', description: 'صدقة من أخ يوسف', amount: 75, date: `${startYear}-11-03` },
      { id: generateId(), type: 'expense', category: 'كهرباء', description: 'فاتورة كهرباء شهري أكتوبر', amount: 120, date: `${startYear}-10-10` },
      { id: generateId(), type: 'expense', category: 'ماء', description: 'فاتورة ماء الربع الثالث', amount: 85, date: `${startYear}-10-15` },
      { id: generateId(), type: 'expense', category: 'إنترنت', description: 'اشتراك إنترنت — 3 أشهر', amount: 120, date: `${startYear}-10-20` },
      { id: generateId(), type: 'expense', category: 'تنظيف', description: 'خدمات تنظيف شهر أكتوبر', amount: 200, date: `${startYear}-10-25` },
      { id: generateId(), type: 'expense', category: 'صيانة', description: 'إصلاح سخان الماء', amount: 150, date: `${startYear}-11-05` },
      { id: generateId(), type: 'expense', category: 'أخرى', description: 'شراء سجاد جديد للمصلى', amount: 300, date: `${startYear}-11-10` },
    ],
    [prevYear]: [
      { id: generateId(), type: 'income', category: 'تبرع', description: 'تبرعات شهر رمضان المبارك', amount: 1200, date: `${startYear - 1}-09-20` },
      { id: generateId(), type: 'income', category: 'اشتراك / رسوم', description: 'اشتراكات سنوية', amount: 800, date: `${startYear - 1}-10-05` },
      { id: generateId(), type: 'expense', category: 'كهرباء', description: 'فواتير كهرباء السنة', amount: 900, date: `${startYear - 1}-11-15` },
      { id: generateId(), type: 'expense', category: 'صيانة', description: 'صيانة عامة للمسجد', amount: 650, date: `${startYear - 1}-12-10` },
    ],
  };
}

export function loadData(): FinanceData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  const sample = getSampleData();
  saveData(sample);
  return sample;
}

export function saveData(data: FinanceData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAvailableYears(data: FinanceData): string[] {
  return Object.keys(data).sort().reverse();
}

export function getTransactionsForYear(data: FinanceData, year: string): Transaction[] {
  return data[year] || [];
}

export function addTransaction(data: FinanceData, year: string, transaction: Omit<Transaction, 'id'>): FinanceData {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId(),
  };
  const updated = {
    ...data,
    [year]: [...(data[year] || []), newTransaction],
  };
  saveData(updated);
  return updated;
}

export function updateTransaction(
  data: FinanceData,
  year: string,
  id: string,
  updates: Partial<Omit<Transaction, 'id'>>
): FinanceData {
  const updated = {
    ...data,
    [year]: (data[year] || []).map((t) => (t.id === id ? { ...t, ...updates } : t)),
  };
  saveData(updated);
  return updated;
}

export function deleteTransaction(data: FinanceData, year: string, id: string): FinanceData {
  const updated = {
    ...data,
    [year]: (data[year] || []).filter((t) => t.id !== id),
  };
  saveData(updated);
  return updated;
}

export function getCurrentFiscalYearLabel(): string {
  return getCurrentFiscalYear();
}

// Auth
export function isAuthenticated(): boolean {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return false;
    const auth = JSON.parse(stored);
    if (!auth.isAdmin) return false;
    // Session expires after 30 minutes
    const thirtyMinutes = 30 * 60 * 1000;
    return Date.now() - auth.timestamp < thirtyMinutes;
  } catch {
    return false;
  }
}

export function login(password: string): boolean {
  if (password === 'admin') {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isAdmin: true, timestamp: Date.now() }));
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function refreshSession(): void {
  if (isAuthenticated()) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ isAdmin: true, timestamp: Date.now() }));
  }
}

// Backup / Export
export function exportToJSON(data: FinanceData): string {
  return JSON.stringify(data, null, 2);
}

export function importFromJSON(jsonString: string): FinanceData {
  const parsed = JSON.parse(jsonString);
  // Basic validation
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid data format');
  }
  saveData(parsed);
  return parsed;
}

export function exportToCSV(transactions: Transaction[]): string {
  const headers = ['النوع', 'الفئة', 'الوصف', 'المبلغ (€)', 'التاريخ'];
  const rows = transactions.map((t) => [
    t.type === 'income' ? 'وارد' : 'صادر',
    t.category,
    t.description,
    t.amount.toFixed(2),
    formatDateForDisplay(t.date),
  ]);
  // BOM for Excel UTF-8
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '\\"')}"`).join(','))
    .join('\n');
  return '\uFEFF' + csvContent;
}

// Date utilities
export function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatAmountWithCurrency(amount: number): string {
  return `${formatAmount(amount)} €`;
}

export function getMonthName(monthIndex: number): string {
  const months = [
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
  ];
  return months[monthIndex] || '';
}

export function getArabicMonthOrder(): string[] {
  // Fiscal year starts in September
  return [
    'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
    'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس',
  ];
}

export function getMonthIndexFromFiscal(monthName: string): number {
  const order = getArabicMonthOrder();
  return order.indexOf(monthName);
}

export function getMonthFromDate(dateStr: string): string {
  const month = parseInt(dateStr.split('-')[1], 10) - 1;
  return getMonthName(month);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
