'use client'

import { motion } from "motion/react";
import { QuoteProps } from "@/lib/props";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SourcePart from "@/components/common/sourcePart";
import MarkdownRenderer from "@/components/common/markdownRender";

export const QuotationReply = ({ textScale, style, data, summary }: QuoteProps) => {
  // 文字列を100文字で切り詰める関数
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative flex w-full mb-4 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300
            ${textScale === 'md'
              ? 'gap-2 p-8'
              : 'gap-4 p-12'}
            ${style === 'default'
              ? 'bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50'
              : 'bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'}
            `}
        >
          <h1 className={`font-bold text-gray-900 dark:text-gray-100 before:content-['”'] before:absolute before:right-2 before:-z-10 before:leading-6
            ${textScale === 'md'
              ? 'text-2xl leading-10 before:text-[144px] before:top-14'
              : 'text-4xl leading-16 before:text-[240px] before:top-24'
            }
            ${style === 'default'
              ? 'before:text-stone-400/40 dark:before:text-stone-700/50'
              : 'before:text-stone-100/20'}
            `}>{summary}</h1>
        </motion.div>
      </SheetTrigger>
      <SourcePart textScale={textScale} style={style} data={data} summary={summary} />
    </Sheet>
  )
}