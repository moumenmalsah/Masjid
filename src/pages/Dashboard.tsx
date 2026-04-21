import { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { getAvailableYears } from '@/data/storage';
import BalanceHero from '@/sections/BalanceHero';
import StatsGrid from '@/sections/StatsGrid';
import Charts from '@/sections/Charts';
import RecentTransactions from '@/sections/RecentTransactions';

export default function Dashboard() {
  const { data, selectedYear } = useData();

  const currentTransactions = data[selectedYear] || [];

  // Get previous year transactions for comparison
  const prevYearTransactions = useMemo(() => {
    const years = getAvailableYears(data);
    const currentIndex = years.indexOf(selectedYear);
    if (currentIndex >= 0 && currentIndex < years.length - 1) {
      return data[years[currentIndex + 1]] || [];
    }
    return [];
  }, [data, selectedYear]);

  return (
    <div className="space-y-6">
      <BalanceHero transactions={currentTransactions} prevYearTransactions={prevYearTransactions} />
      <StatsGrid transactions={currentTransactions} />
      <Charts transactions={currentTransactions} />
      <RecentTransactions transactions={currentTransactions} />
    </div>
  );
}
