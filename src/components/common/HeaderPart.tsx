'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
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
    <div className={cn('w-full', className)}>
      <AspectRatio ratio={isCoverOpen ? 16 / 9 : 5 / 8} className='border md:border-r-0 shadow-lg'>
        {/* 画像カルーセル */}
        <Image src={images[index]} alt="header" fill className='object-cover transition-all cursor-pointer' onClick={handleCoverOpen} />
      </AspectRatio>
      {/* TODO: Carousel */}
      <p className={`hidden px-12 py-8 text-border tracking-wide
        ${textScale === 'md'
          ? 'text-sm leading-6'
          : 'text-xl leading-8'}
        ${isCoverOpen ? 'md:block' : ''}
      `}>
        {content.header.description}
      </p>
    </div>
  );
}
