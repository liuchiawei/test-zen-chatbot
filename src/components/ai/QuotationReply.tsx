'use client'

import { motion } from "motion/react";
import { QuoteProps } from "@/lib/props";

export const QuotationReply = ({ textScale, quote, author, source, handleSourceOpen, handleCoverOpen }: QuoteProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => {
        handleSourceOpen();
        handleCoverOpen();
      }}
      className={`relative flex flex-col w-full p-6 mb-4 bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50 rounded-lg shadow-md overflow-hidden cursor-pointer
        ${textScale === 'md'
          ? 'gap-2'
          : 'gap-4'
        }`}
    >
      <h3 className={`font-semibold text-gray-900 dark:text-gray-100 before:content-['“'] before:absolute before:left-0 before:top-10 before:-z-10 before:text-[144px] before:leading-6 before:text-stone-400/50 dark:before:text-stone-700/50
        ${textScale === 'md'
          ? 'text-lg'
          : 'text-5xl leading-16'
        }`}
      >{quote}</h3>
      <div className="self-end flex justify-center items-center gap-2">
        {/* TODO: Link to source */}
        <p className=
          {`${textScale === 'md'
            ? 'text-sm'
            : 'text-xl'
          }`}
        >『 {source} 』</p>
        <p className={`font-bold
          ${textScale === 'md'
            ? 'text-sm'
            : 'text-xl'
          }`}
        >{author}</p>
      </div>
    </motion.div>
  )
}