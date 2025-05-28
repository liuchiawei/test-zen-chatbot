'use client';

import { useState } from 'react';
import Chat from '@/components/layout/Chat';
import Nav from '@/components/ui/navigation';
import AppSubTitle from '@/components/common/AppSubTitle';
export default function Page() {
  const [textScale, setTextScale] = useState('md');
  const [style, setStyle] = useState('default');

  const handleTextScale = (scale: string) => {
    setTextScale(scale);
  };

  const handleStyle = (style: string) => {
    setStyle(style);
  };

  return (
    <main
      className={`relative h-full min-h-screen w-full **:transition-all
      ${style === 'forest' && 'bg-[url("/images/demo_4.jpg")] dark:bg-[url("/images/demo_1.jpg")] bg-fixed bg-cover bg-center'}`
    }>
      <Nav textScale={textScale} onTextScaleChange={handleTextScale} style={style} onStyleChange={handleStyle} />
      <Chat textScale={textScale} style={style} />
      <AppSubTitle className='hidden md:block absolute top-1/2 right-6 -translate-y-1/2' />
    </main>
  );
}