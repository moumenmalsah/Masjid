import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(false);

    // Small delay for UX
    setTimeout(() => {
      const success = login(password);
      if (success) {
        onClose();
      } else {
        setError(true);
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-[400px] mx-4"
          >
            <motion.div
              animate={error ? { x: [0, -6, 6, -6, 6, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[20px] shadow-modal p-8"
            >
              {/* Lock icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-emerald-600" />
                </div>
              </div>

              <h2 className="font-arabic font-bold text-[22px] text-slate-900 text-center">
                الوصول المؤمن
              </h2>
              <p className="font-latin text-sm text-slate-500 text-center mt-2">
                أدخل كلمة المرور للوصول إلى لوحة الإدارة
              </p>

              <form onSubmit={handleSubmit} className="mt-6">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                    }}
                    placeholder="كلمة المرور"
                    className={`w-full h-14 rounded-xl border-2 px-4 font-arabic text-[15px] transition-all outline-none ${
                      error
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-arabic text-[13px] text-red-500 text-center mt-2"
                    >
                      كلمة المرور غير صحيحة
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[52px] mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-arabic font-bold text-base rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'دخول'
                  )}
                </button>
              </form>

              <p className="font-latin text-xs text-slate-400 text-center mt-4">
                كلمة المرور الافتراضية: admin
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
