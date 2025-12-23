"use client"

import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface AccountTypeCardProps {
  value: 'personal' | 'business';
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export function AccountTypeCard({ value, label, icon, isSelected, onClick }: AccountTypeCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-all duration-300',
        isSelected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-primary/50'
      )}
      whileTap={{ scale: 0.95 }}
    >
      <div className="mb-2 flex justify-center">{icon}</div>
      <p className="font-semibold">{label}</p>
      {isSelected && (
        <motion.div
          className="absolute -right-2 -top-2 h-5 w-5 rounded-full border-2 border-white bg-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.div>
  );
}
