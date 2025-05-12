'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AspectRatio } from '../ui/aspect-ratio';
import { cn } from '@/lib/utils';
import content from '@/data/content.json';

export default function HeaderPart({ className }: { className?: string }) {
  // 画像ファイル名リスト
  const images = ['/images/demo_1.jpg', '/images/demo_2.jpg', '/images/demo_3.jpg', '/images/demo_4.jpg'];
  const [index, setIndex] = useState(0);

  // 一定間隔で画像を切り替える
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % images.length);
    }, 12000); // 12秒ごと
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn('w-full', className)}>
      <AspectRatio ratio={16 / 9} className='border shadow-lg'>
        {/* 画像カルーセル */}
        <Image src={images[index]} alt="header" fill className='object-cover transition' />
      </AspectRatio>
      {/* TODO: Carousel */}
      <p className='hidden md:block px-12 py-8 leading-6 text-sm text-stone-400 dark:text-stone-600'>
        {content.header.description}
       </p>
    </div>
  );
}
