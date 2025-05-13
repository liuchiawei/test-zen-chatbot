'use client';

import { motion } from 'motion/react';
import content from '@/data/content.json';
import { cn } from '@/lib/utils';

export default function AppSubTitle({ className }: { className?: string }) {
  return (
    <motion.h2
      className={cn(
        "text-sm tracking-widest [writing-mode:vertical-rl] select-none",
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {content.header.subTitle}
    </motion.h2>
  );
}

