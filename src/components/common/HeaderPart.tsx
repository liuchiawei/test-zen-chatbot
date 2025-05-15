'use client';

import { useState, useEffect } from 'react';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import { motion } from 'motion/react';
import VerticalTitle from './VerticalTitle';
import { cn } from '@/lib/utils';
import { HeaderPartProps } from '@/lib/props';
import content from '@/data/content.json';

export default function HeaderPart({ className, textScale, isCoverOpen, handleCoverOpen }: HeaderPartProps) {
  // 画像ファイル名リスト
  const images = ['/images/demo_1.jpg', '/images/demo_2.jpg', '/images/demo_3.jpg', '/images/demo_4.jpg'];

  const [index, setIndex] = useState(0);

  // 一定間隔で画像を切り替える
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 12000); // 12秒ごと
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('w-full relative', className)}>
      <AspectRatio ratio={isCoverOpen ? 16 / 9 : 5 / 8} className='border md:border-r-0 shadow-lg '>
        {/* 画像カルーセル */}
        <Image src={images[index]} alt="header" fill className='object-cover transition-all cursor-pointer' onClick={handleCoverOpen} />
      </AspectRatio>
      {isCoverOpen ? (
        <VerticalTitle text={content.header.title} className='top-24 md:top-[92px] md:[writing-mode:vertical-rl] left-1/2 md:left-20 -translate-x-1/2 md:translate-x-0 text-5xl md:text-7xl text-white text-shadow-lg' />
      ) : ''}
      {/* TODO: Smooth Image Carousel Animation*/}
      {isCoverOpen ? (
        <div className='flex flex-col gap-2 pt-4 pb-8 bg-linear-to-br from-black/0 to-black/20 backdrop-blur-xs'>
          <motion.h3
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className='hidden md:block mx-12 text-right text-accent font-roboto font-bold'
          >
            {content.header.title_eng}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`hidden md:block px-12 text-stone-200 tracking-wide text-justify
              ${textScale === 'md'
                ? 'text-sm leading-6'
                : 'text-xl leading-8'}
            `}>
            {content.header.description}
          </motion.p>
        </div>
      ) : ''}
    </div>
  );
}
