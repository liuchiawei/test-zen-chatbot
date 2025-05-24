'use client';

import { useIsMobile } from "@/lib/isMobile";
import { motion } from "motion/react";
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import content from '@/data/content.json';

export default function SourcePart() {
  const isMobile = useIsMobile();

  // モバイルの場合
  if (isMobile) {
    return (
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Quotation Area</DrawerTitle>
          <DrawerDescription>
            This is the quotation area.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    )
  }

  // デスクトップの場合
  return (
    <AspectRatio ratio={5 / 7}>
      <motion.div
        className="w-full h-full bg-stone-200 dark:bg-stone-800 shadow-lg dark:shadow-none px-10 pt-8 cursor-pointer border overflow-x-hidden overflow-y-auto"
      >
        <motion.h1
          className="text-xl font-bold tracking-widest"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.3 }}
        >
          勝利とは、最後まで屈しないことである。
        </motion.h1>
        <motion.h3
          className="text-lg text-accent text-right my-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', duration: 0.3, delay: 0.1 }}
        >
          『 人間革命 』池田大作
        </motion.h3>
        <motion.p
          className="my-8"
          initial={{ opacity: 0, filter: 'blur(5px)', scale: 0.95 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          「勝利とは、最後まで屈しないことである。」この言葉は、池田大作先生の著作『人間革命』や『新・人間革命』に深く通じる理念を表しています。池田先生は、人生における真の勝利とは、外的な成功や他者との競争に勝つことではなく、困難や苦悩に直面しても決して諦めず、自らの信念を貫き通すことにあると説かれています。<br />

          『新・人間革命』第28巻では、「人生は、永遠に苦悩との戦いなんです。悩みは常にあります。要は、それに勝つか、負けるかなんです。何があっても負けない自分自身になる以外に、幸福はない」と述べられています。 <br />


          また、聖教新聞の記事では、池田先生が「何があっても絶対に負けない。あきらめない。屈しない。この人こそ、生命の勝利者である」と語られています。 <br />

          これらの教えは、どんな困難にも屈せず、信念を持って生き抜くことの大切さを示しています。あなたが今、どんな状況にあっても、諦めずに前を向いて歩んでいくことが、真の勝利への道なのです。<br />

          どうか、自分自身を信じて、一歩一歩進んでいってください。あなたのその姿勢が、やがて大きな成果となって実を結ぶことでしょう。
        </motion.p>
      </motion.div>
    </AspectRatio>
  )
}