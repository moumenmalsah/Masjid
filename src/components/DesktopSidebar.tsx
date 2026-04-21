import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Shield, LogOut } from 'lucide-react';
import MosqueLogo from './MosqueLogo';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { path: '/', label: 'الإحصائيات', icon: BarChart3 },
  { path: '/admin', label: 'الإدارة', icon: Shield },
];

export default function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const currentPath = location.pathname;

  return (
    <aside className="hidden md:flex fixed top-0 right-0 h-full w-[260px] bg-white border-l border-slate-200 flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-4">
        <MosqueLogo className="text-emerald-700 flex-shrink-0" size={32} />
        <h2 className="font-arabic font-bold text-lg text-slate-900 leading-tight">
          مسجد منتدى الإسلام
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                <span className={`font-arabic text-sm ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {isAuthenticated && (
          <>
            <div className="my-4 border-t border-slate-100" />
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="w-5 h-5 text-slate-400" />
              <span className="font-arabic text-sm">تسجيل الخروج</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}
