'use client';

import { useState } from 'react';
import Chat from '@/components/layout/Chat';
import Nav from '@/components/ui/navigation';
import AppSubTitle from '@/components/common/AppSubTitle';
export default function Page() {
  const [textScale, setTextScale] = useState('md');

  const handleTextScale = (scale: string) => {
    setTextScale(scale);
  };

  return (
    <main className='relative h-full min-h-screen w-full **:transition-all'>
      <Nav textScale={textScale} onTextScaleChange={handleTextScale} />
      <Chat textScale={textScale} />
      <AppSubTitle className='hidden md:block absolute top-1/2 right-6 -translate-y-1/2' />
    </main>
  );
}