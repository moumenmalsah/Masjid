import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FABProps {
  onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.3 }}
      className="fixed bottom-24 left-5 z-40 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-colors md:hidden"
    >
      <Plus className="w-6 h-6" />
    </motion.button>
  );
}
