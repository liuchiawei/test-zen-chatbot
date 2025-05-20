'use client';

import Image from "next/image"
import { motion } from "motion/react"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import content from '@/data/content.json';

export default function Cover() {
  return (
    <AspectRatio ratio={5 / 7}>
      <motion.div
        className="w-full bg-stone-50 dark:bg-stone-100 shadow-lg dark:shadow-none px-12 grid grid-rows-12"
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '-100%' }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        <div className="row-start-1 row-span-3 text-center flex flex-col items-center justify-center">
          <h1
            className="text-[72px] font-bold tracking-widest text-stone-900"
          >
            {content.header.title}
          </h1>
          <h3 className="text-lg text-accent">
            {content.header.title_eng}
          </h3>
        </div>
        <motion.div
          className="row-start-5 row-span-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn"}}
        >
          <AspectRatio ratio={16 / 9}>
            <Image src="/images/demo_1.jpg" alt="cover" fill />
          </AspectRatio>
        </motion.div>
        <h3 className="text-xl text-center tracking-[1rem] row-start-12 text-stone-900">
            {content.header.credit}
          </h3>
      </motion.div>
    </AspectRatio>
  )
}