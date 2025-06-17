import { SourceProps } from "@/lib/props";
import MarkdownRenderer from "@/components/common/markdownRender";

export default function SourceArticle({ textScale, style, data, summary }: SourceProps) {
  return (
    <div className={`py-4 flex flex-col gap-4 relative
      ${textScale === 'md'
        ? 'px-8'
        : 'px-12'
      }
    `}>
      <h1 className={`font-semibold text-gray-900 dark:text-gray-100 before:content-['『'] after:content-['』']
        ${textScale === 'md'
          ? 'text-xl md:text-2xl leading-8 md:leading-10'
          : 'text-2xl md:text-4xl leading-10 md:leading-16'
        }`}
      >
        {summary}
      </h1>
      <div className={`text-justify tracking-wide
        ${textScale === 'md'
          ? 'text-sm leading-6'
          : 'text-xl leading-10'
        }`}
      >
        <MarkdownRenderer content={data.answer} />
      </div>
    </div>
  )
}