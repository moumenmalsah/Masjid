import { TrendingUp, TrendingDown, Heart, Users } from 'lucide-react';
import { useTotals } from '@/hooks/useFinanceData';
import StatCard from '@/components/StatCard';
import type { Transaction } from '@/types';

interface StatsGridProps {
  transactions: Transaction[];
}

export default function StatsGrid({ transactions }: StatsGridProps) {
  const { income, expense, donationTotal, subscriptionTotal } = useTotals(transactions);

  const stats = [
    {
      label: 'إجمالي الواردات',
      value: income,
      subtitle: 'هذا العام',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'إجمالي المصروفات',
      value: expense,
      subtitle: 'هذا العام',
      icon: TrendingDown,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      label: 'التبرعات',
      value: donationTotal,
      subtitle: 'إجمالي التبرعات',
      icon: Heart,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'الاشتراكات',
      value: subscriptionTotal,
      subtitle: 'إجمالي الاشتراكات',
      icon: Users,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          {...stat}
        />
      ))}
    </div>
  );
}
