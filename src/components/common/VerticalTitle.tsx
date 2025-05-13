'use client'

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function SectionTitle({ text, className }: { text: string, className?: string }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={cn('absolute z-50 font-black tracking-widest select-none', className)}
    >
      {text}
    </motion.h2>
  )
}


