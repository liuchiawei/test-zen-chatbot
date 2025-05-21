'use client';

import Image from "next/image"
import { motion } from "motion/react";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import content from '@/data/content.json';

export default function Cover() {
  return (
    <AspectRatio ratio={5 / 7}>
      <motion.div
        className="w-full h-full bg-stone-50 dark:bg-stone-200 shadow-lg dark:shadow-none px-10 py-4 grid grid-rows-12 cursor-pointer border"
      >
        <div className="row-start-1 row-span-3 text-center flex flex-col items-center justify-center gap-2">
          <motion.h1
            className="text-5xl font-bold tracking-widest text-stone-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {content.header.title}
          </motion.h1>
          <motion.h3
            className="text-lg text-accent"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {content.header.title_eng}
          </motion.h3>
        </div>
        <motion.div
          className="row-start-5 row-span-4"
          initial={{ opacity: 0, filter: 'blur(5px)', scale: 0.9 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AspectRatio ratio={16 / 9}>
            <Image src="/images/demo_1.jpg" alt="cover" fill />
          </AspectRatio>
        </motion.div>
        <motion.h3 className="text-xl text-center tracking-[1rem] row-start-12 text-stone-900"
          initial={{ opacity: 0, filter: 'blur(5px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
        >
          {content.header.credit}
        </motion.h3>
      </motion.div>
    </AspectRatio>
  )
}