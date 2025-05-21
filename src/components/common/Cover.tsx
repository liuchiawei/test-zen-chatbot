'use client';

import Image from "next/image"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import content from '@/data/content.json';

export default function Cover() {
  return (
    <AspectRatio ratio={5 / 7}>
      <div
        className="w-full h-full bg-stone-50 dark:bg-stone-200 shadow-lg dark:shadow-none px-10 py-4 grid grid-rows-12 cursor-pointer"
      >
        <div className="row-start-1 row-span-3 text-center flex flex-col items-center justify-center gap-2">
          <h1
            className="text-5xl font-bold tracking-widest text-stone-900"
          >
            {content.header.title}
          </h1>
          <h3 className="text-lg text-accent">
            {content.header.title_eng}
          </h3>
        </div>
        <div className="row-start-5 row-span-4">
          <AspectRatio ratio={16 / 9}>
            <Image src="/images/demo_1.jpg" alt="cover" fill />
          </AspectRatio>
        </div>
        <h3 className="text-xl text-center tracking-[1rem] row-start-12 text-stone-900">
          {content.header.credit}
        </h3>
      </div>
    </AspectRatio>
  )
}