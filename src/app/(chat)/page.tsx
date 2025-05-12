'use client';

import { useState } from 'react';
import Chat from '@/components/layout/Chat';
import Nav from '@/components/ui/navigation';
export default function Page() {
  const [textScale, setTextScale] = useState('md');

  const handleTextScale = (scale: string) => {
    setTextScale(scale);
  };

  return (
    <main className='h-full min-h-screen w-full **:transition-all'>
      <Nav textScale={textScale} onTextScaleChange={handleTextScale} />
      <Chat textScale={textScale} />
    </main>
  );
}