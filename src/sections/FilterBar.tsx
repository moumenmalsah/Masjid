import { Plus, Calendar } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useAllCategories } from '@/hooks/useFinanceData';
import { getAvailableYears } from '@/data/storage';
import type { TransactionType } from '@/types';
import type { AdminFilters } from '@/types';

interface FilterBarProps {
  onNewTransaction: () => void;
}

export default function FilterBar({ onNewTransaction }: FilterBarProps) {
  const { data, adminFilters, setAdminFilters } = useData();
  const years = getAvailableYears(data);
  const categories = useAllCategories(
    Object.values(data).flat(),
    adminFilters.type as 'all' | TransactionType
  );

  const handleFilterChange = (key: keyof AdminFilters, value: string) => {
    setAdminFilters({ ...adminFilters, [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* Year Filter */}
        <div className="relative flex-shrink-0">
          <select
            value={adminFilters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="appearance-none h-11 pl-9 pr-4 rounded-full border border-slate-200 bg-slate-50 font-latin text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:border-emerald-500"
          >
            <option value="all">جميع السنوات</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Type Filter */}
        <select
          value={adminFilters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="h-11 px-4 rounded-full border border-slate-200 bg-slate-50 font-arabic text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:border-emerald-500 flex-shrink-0"
        >
          <option value="all">الكل</option>
          <option value="income">وارد</option>
          <option value="expense">صادر</option>
        </select>

        {/* Category Filter */}
        <select
          value={adminFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="h-11 px-4 rounded-full border border-slate-200 bg-slate-50 font-arabic text-[13px] font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none focus:border-emerald-500 flex-shrink-0"
        >
          <option value="all">جميع الفئات</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="flex-1" />

      {/* New Transaction Button */}
      <button
        onClick={onNewTransaction}
        className="h-11 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-arabic text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
      >
        <Plus className="w-[18px] h-[18px]" />
        معاملة جديدة
      </button>
    </div>
  );
}
