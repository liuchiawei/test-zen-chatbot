import { SheetContent, SheetHeader, SheetTitle, Sheet, SheetTrigger } from "../ui/sheet";
import { SourceProps } from "@/lib/props";  
import content from "@/data/content.json";
import SourceArticle from "@/components/common/sourceArticle";

export default function SourcePart({ textScale, style, data, summary }: SourceProps) {
    return (
      <SheetContent>
        <SheetHeader
          className="h-24 bg-cover bg-center bg-[url(/images/demo_3.jpg)]"
        >
          <SheetTitle className="text-white">
            {content.source.title}
          </SheetTitle>
        </SheetHeader>
        {/* TODO: 実際のAPIから渡されるデータに合わせる必要があります */}
        <div className="flex flex-col gap-2 px-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Sheet key={index}>
              <SheetTrigger className="w-full p-4 rounded-lg border cursor-pointer hover:bg-foreground/10">
                デモタイトル
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    デモタイトル
                  </SheetTitle>
                </SheetHeader>
                <SourceArticle
                  key={index}
                  textScale={textScale}
                  style={style}
                  data={data}
                  summary={summary}
                />
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </SheetContent>
  )
}