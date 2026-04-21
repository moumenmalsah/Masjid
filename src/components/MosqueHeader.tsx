import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown } from 'lucide-react';
import MosqueLogo from './MosqueLogo';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useState, useRef, useEffect } from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

export default function MosqueHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { selectedYear, setSelectedYear, availableYears } = useData();
  const isAdminPage = location.pathname === '/admin';
  const [showYearSelector, setShowYearSelector] = useState(false);
  const isDesktop = useBreakpoint(768);
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setShowYearSelector(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-sm">
      <div className="h-16 flex items-center justify-between px-5 md:px-8 max-w-[1200px] mx-auto">
        {/* Logo + Name (right side in RTL) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <MosqueLogo className="text-emerald-700 flex-shrink-0" size={32} />
          <h1 className="font-arabic font-bold text-lg text-slate-900 leading-tight">
            مسجد منتدى الإسلام
          </h1>
        </button>

        {/* Actions (left side in RTL) */}
        <div className="flex items-center gap-3">
          {!isAdminPage && (
            <div ref={selectorRef} className="relative">
              <button
                onClick={() => setShowYearSelector(!showYearSelector)}
                className="flex items-center gap-2 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-latin font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span>{selectedYear}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showYearSelector ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showYearSelector && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                      onClick={() => setShowYearSelector(false)}
                    />
                    {/* Panel - Desktop: dropdown, Mobile: bottom sheet */}
                    <motion.div
                      initial={isDesktop ? { opacity: 0, y: -8, scale: 0.95 } : { y: '100%' }}
                      animate={isDesktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
                      exit={isDesktop ? { opacity: 0, y: -8, scale: 0.95 } : { y: '100%' }}
                      transition={isDesktop
                        ? { type: 'spring', stiffness: 300, damping: 25 }
                        : { type: 'spring', stiffness: 300, damping: 30 }
                      }
                      className={`z-50 bg-white overflow-hidden ${
                        isDesktop
                          ? 'absolute top-full left-0 mt-2 rounded-xl shadow-lg border border-slate-100 w-48'
                          : 'fixed bottom-0 left-0 right-0 rounded-t-[20px] shadow-modal'
                      }`}
                    >
                      {!isDesktop && (
                        <div className="flex justify-center pt-3 pb-1">
                          <div className="w-9 h-1 bg-slate-300 rounded-full" />
                        </div>
                      )}
                      <div className={`font-arabic text-base font-bold px-5 pt-4 pb-2 ${isDesktop ? '' : ''}`}>
                        اختر السنة
                      </div>
                      <div className={`pb-4 ${isDesktop ? '' : 'max-h-60 overflow-y-auto'}`}>
                        {availableYears.map((year) => (
                          <button
                            key={year}
                            onClick={() => {
                              setSelectedYear(year);
                              setShowYearSelector(false);
                            }}
                            className={`w-full text-right px-5 py-3 font-latin text-sm transition-colors ${
                              selectedYear === year
                                ? 'bg-emerald-50 text-emerald-800 border-r-[3px] border-emerald-600'
                                : 'text-slate-900 hover:bg-slate-50'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {isAdminPage && isAuthenticated && (
            <button
              onClick={logout}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-5 h-5 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
