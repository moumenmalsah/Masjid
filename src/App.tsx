import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import MosqueHeader from '@/components/MosqueHeader';
import BottomNav from '@/components/BottomNav';
import DesktopSidebar from '@/components/DesktopSidebar';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <DesktopSidebar />

            {/* Mobile Header */}
            <MosqueHeader />

            {/* Main Content */}
            <main className="pt-16 pb-20 md:pr-[260px] md:pb-0">
              <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-6">
                <AnimatedRoutes />
              </div>
            </main>

            {/* Mobile Bottom Nav */}
            <BottomNav />
          </div>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
