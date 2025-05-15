import { QuoteProps } from "@/lib/props";

export const QuotationReply = ({ quote, author, source }: QuoteProps) => {
  return (
    <div className="relative flex flex-col w-full p-6 mb-4 bg-linear-to-b from-stone-50/50 to-stone-200/70 dark:from-stone-700/50 dark:to-stone-800/50 rounded-lg shadow-md overflow-hidden">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 before:content-['“'] before:absolute before:left-0 before:top-10 before:-z-10 before:text-[144px] before:leading-6 before:text-stone-400/50 dark:before:text-stone-700/50">{quote}</h3>
      <div className="self-end flex justify-center items-center gap-2">
        {/* TODO: Link to source */}
        <p className="text-sm">『 {source} 』</p>
        <p className="text-sm font-bold">{author}</p>
      </div>
    </div>
  )
}