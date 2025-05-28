'use client'

import { motion } from "motion/react";
import { QuoteProps } from "@/lib/props";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SourcePart from "@/components/common/sourcePart";

export const QuotationReply = ({ textScale, style, data }: QuoteProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative flex flex-col w-full p-6 mb-4 rounded-lg shadow-md overflow-hidden cursor-pointer
            ${textScale === 'md'
              ? 'gap-2'
              : 'gap-4'}
            ${style === 'default'
              ? 'bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50'
              : 'bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'}
            `}
        >
          <h3 className={`font-semibold text-gray-900 dark:text-gray-100 before:content-['“'] before:absolute before:left-0 before:top-10 before:-z-10 before:text-[144px] before:leading-6
            ${textScale === 'md'
              ? 'text-lg'
              : 'text-5xl leading-16'
            }
            ${style === 'default'
              ? 'before:text-stone-400/50 dark:before:text-stone-700/50'
              : 'before:text-stone-100/20'}
            `}
          >{data.answer}</h3>
          <div className="self-end flex justify-center items-center gap-2">
            {/* TODO: Link to source */}
            {/* 引用ソース */}
            <p className=
              {`${textScale === 'md'
                ? 'text-sm'
                : 'text-xl'
              }`}
            >『 {data.conversation_id} 』</p>
            {/* 作者 */}
            <p className={`font-bold
              ${textScale === 'md'
                ? 'text-sm'
                : 'text-xl'
              }`}
            >{data.conversation_id}</p>
          </div>
        </motion.div>
      </SheetTrigger>
      <SourcePart />
    </Sheet>
  )
}