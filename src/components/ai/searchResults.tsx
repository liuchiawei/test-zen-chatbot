'use client'

import { motion } from "motion/react";
import { SearchResultsProps } from "@/lib/props";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import SourcePart from "@/components/common/sourcePart";
import MarkdownRenderer from "@/components/common/markdownRender";
import { LibraryBig } from "lucide-react";

export const SearchResults = ({ textScale, style, extracted_chunks, responseData }: SearchResultsProps) => {
  // もしextracted_chunksが存在しない場合はresponseDataを代わりに使用する
  if (!extracted_chunks || !Array.isArray(extracted_chunks)) {
    console.error("Invalid data structure in SearchResults:", extracted_chunks);
    return (
          <div className="flex flex-col gap-2">
            {responseData.all_search_results.search_results.map((searchResult: any, index: number) => (
              <Sheet key={index}>
                <SheetTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative w-full flex flex-col gap-2 mb-4 rounded-lg shadow-md overflow-hidden cursor-pointer bg-cover bg-center hover:bg-[url(/images/demo_3.jpg)] hover:**:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                      ${textScale === 'md'
                        ? 'gap-2 p-6'
                        : 'gap-4 p-8'}
                      ${style === 'default'
                        ? 'bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50'
                        : 'bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'}
                      `}
                  >
                    {/* <div className="flex justify-between text-sm text-foreground/50">
                        <h2 className="w-48 md:w-120 max-w-full truncate">
                          {item.query}
                        </h2>
                        <h2>
                          // 関連スコアを小数点第3位まで表示
                          関連スコア：{Math.round(item.search_results[0]['@search.score'] * 1000) / 1000}
                        </h2>
                    </div> */}
                    <h1 className={`font-bold text-gray-900 dark:text-gray-100 before:content-['"] before:absolute before:right-2 before:-z-10 before:leading-6 before:text-stone-100/20
                      ${textScale === 'md'
                        ? 'text-2xl before:text-[144px] before:top-14'
                        : 'text-4xl leading-10 before:text-[240px] before:top-24'
                      }
                      `}>『 {searchResult.filename.replace('.md', '').split('　')[1]} 』</h1>
                    {/* チャンクの内容を表示 */}
                    <div className={`w-full min-w-0 max-w-3xl mt-2 text-foreground line-clamp-2 overflow-hidden
                      ${textScale === 'md'
                      ? 'text-sm'
                      : 'text-lg'}`}>
                      <MarkdownRenderer content={searchResult.text} />
                    </div>
                    {/* ファイル名を表示 */}
                    <div className="flex items-center gap-2 text-foreground/40">
                      <LibraryBig className="size-4" />
                      <h2 className="text-sm">
                        {searchResult.filename.split('　')[0]}
                      </h2>
                    </div>
                  </motion.div>
                </SheetTrigger>
                <SourcePart textScale={textScale} style={style} chunk={searchResult.chunk} />
              </Sheet>
          ))}
        </div>
    );
  } else {
  return (
    <div className="flex flex-col gap-2">
      {extracted_chunks.map((chunk: any, index: number) => (
        <Sheet key={index}>
          <SheetTrigger asChild>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative w-full flex flex-col gap-2 mb-4 rounded-lg shadow-md overflow-hidden cursor-pointer bg-cover bg-center hover:bg-[url(/images/demo_3.jpg)] hover:**:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                ${textScale === 'md'
                  ? 'gap-2 p-6'
                  : 'gap-4 p-8'}
                ${style === 'default'
                  ? 'bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50'
                  : 'bg-black/30 text-stone-100 border border-stone-300 dark:border-stone-400'}
                `}
            >
              {/* <div className="flex justify-between text-sm text-foreground/50">
                  <h2 className="w-48 md:w-120 max-w-full truncate">
                    {item.query}
                  </h2>
                  <h2>
                    // 関連スコアを小数点第3位まで表示
                    関連スコア：{Math.round(item.search_results[0]['@search.score'] * 1000) / 1000}
                  </h2>
              </div> */}
              <h1 className={`font-bold text-gray-900 dark:text-gray-100 before:content-['"] before:absolute before:right-2 before:-z-10 before:leading-6 before:text-stone-100/20
                ${textScale === 'md'
                  ? 'text-2xl before:text-[144px] before:top-14'
                  : 'text-4xl leading-10 before:text-[240px] before:top-24'
                }
                `}>『 {chunk.filename.replace('.md', '').split('　')[1]} 』</h1>
              {/* チャンクの内容を表示 */}
              <div className={`w-full min-w-0 max-w-3xl mt-2 text-foreground line-clamp-2 overflow-hidden
                ${textScale === 'md'
                ? 'text-sm'
                : 'text-lg'}`}>
                <MarkdownRenderer content={chunk.text} />
              </div>
              {/* ファイル名を表示 */}
              <div className="flex items-center gap-2 text-foreground/40">
                <LibraryBig className="size-4" />
                <h2 className="text-sm">
                  {chunk.filename.split('　')[0]}
                </h2>
              </div>
            </motion.div>
          </SheetTrigger>
          <SourcePart textScale={textScale} style={style} chunk={chunk} />
        </Sheet>
    ))}
    </div>
  )
  }
}
