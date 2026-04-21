import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Shield } from 'lucide-react';

const tabs = [
  { path: '/', label: 'الإحصائيات', icon: BarChart3 },
  { path: '/admin', label: 'الإدارة', icon: Shield },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-slate-200 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-1 w-20 h-full relative"
            >
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              <span
                className={`font-arabic text-[11px] transition-colors ${
                  isActive ? 'text-emerald-600 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-2 w-1 h-1 rounded-full bg-emerald-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
