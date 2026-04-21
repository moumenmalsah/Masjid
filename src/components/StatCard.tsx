import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatAmountWithCurrency } from '@/data/storage';

interface StatCardProps {
  label: string;
  value: number;
  subtitle?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
  compact?: boolean;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor = 'text-slate-900',
  compact = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-slate-200 rounded-2xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-arabic text-[13px] text-slate-400">{label}</p>
          <p className={`font-latin font-bold ${compact ? 'text-[28px]' : 'text-4xl'} ${valueColor} font-tabular mt-1`}>
            {formatAmountWithCurrency(value)}
          </p>
          {subtitle && (
            <p className="font-latin text-[13px] text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </motion.div>
  );
}
