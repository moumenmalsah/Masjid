import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'حذف',
  cancelText = 'إلغاء',
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[80]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-[360px] mx-4"
          >
            <div className="bg-white rounded-[20px] p-6 text-center">
              <div className="flex justify-center mb-4">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="font-arabic font-bold text-lg text-slate-900">{title}</h3>
              <p className="font-arabic text-sm text-slate-500 mt-2">{message}</p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onCancel}
                  className="flex-1 h-11 border border-slate-200 rounded-xl font-arabic text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-xl font-arabic text-sm transition-colors"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
