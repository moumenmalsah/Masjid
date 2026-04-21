import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useBarChartData, usePieChartData } from '@/hooks/useFinanceData';
import type { Transaction } from '@/types';
import { BarChart3 } from 'lucide-react';

interface ChartsProps {
  transactions: Transaction[];
}

// Custom tooltip for bar chart
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-slate-800 text-white rounded-xl px-4 py-3 shadow-lg text-right">
      <p className="font-arabic text-sm font-bold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="font-latin text-xs flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}:</span>
          <span className="font-bold">{entry.value.toLocaleString('fr-FR')} €</span>
        </p>
      ))}
    </div>
  );
}

// Custom tooltip for pie chart
function PieTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div className="bg-slate-800 text-white rounded-xl px-4 py-3 shadow-lg text-right">
      <p className="font-arabic text-sm font-bold">{data.name}</p>
      <p className="font-latin text-xs mt-1">
        {data.value.toLocaleString('fr-FR')} € ({Math.round(data.percent)}%)
      </p>
    </div>
  );
}

export default function Charts({ transactions }: ChartsProps) {
  const barData = useBarChartData(transactions);
  const pieData = usePieChartData(transactions);

  const hasData = transactions.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5"
      >
        <h3 className="font-arabic font-bold text-base text-slate-900 mb-4">الواردات والمصروفات</h3>
        {hasData && barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fontFamily: 'Amiri' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontFamily: 'Manrope' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}€`}
              />
              <Tooltip content={<BarTooltip />} />
              <Legend
                wrapperStyle={{ fontFamily: 'Amiri', fontSize: '12px' }}
                formatter={(value: string) => <span className="font-arabic">{value === 'واردات' ? 'واردات' : 'مصروفات'}</span>}
              />
              <Bar dataKey="واردات" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="مصروفات" fill="rgba(239, 68, 68, 0.7)" radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState />
        )}
      </motion.div>

      {/* Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-slate-200 rounded-2xl p-5"
      >
        <h3 className="font-arabic font-bold text-base text-slate-900 mb-4">توزيع المصروفات</h3>
        {hasData && pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ fontFamily: 'Amiri', fontSize: '12px', left: '10px' }}
                formatter={(value: string) => <span className="font-arabic">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChartState />
        )}
      </motion.div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="flex flex-col items-center justify-center h-[280px] text-center">
      <BarChart3 className="w-10 h-10 text-slate-300 mb-3" />
      <p className="font-arabic text-sm text-slate-500">لا توجد بيانات لهذه السنة</p>
    </div>
  );
}
