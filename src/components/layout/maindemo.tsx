'use client';

import { Message } from 'ai';
import { useState } from 'react';
import Chat from '@/components/layout/ChatDemo';
import Nav from '@/components/layout/navigation';
import AppSubTitle from '@/components/common/AppSubTitle';
import Footer from '@/components/layout/footer';
import { ChatMode } from '@/lib/props';

export default function Main() {
  const [textScale, setTextScale] = useState('md');
  const [style, setStyle] = useState('default');
  const [mode, setMode] = useState<ChatMode>('free');

  const handleTextScale = (scale: string) => {
    setTextScale(scale);
  };

  const handleStyle = (style: string) => {
    setStyle(style);
  };

  return (
    <div
      className={`relative h-full min-h-screen w-full flex flex-col justify-between items-center gap-0 md:gap-4 **:transition-all
      ${style === 'forest' && 'bg-[url("/images/demo_4.jpg")] dark:bg-[url("/images/demo_1.jpg")] bg-fixed bg-cover bg-center'}`
    }>
      <Nav textScale={textScale} onTextScaleChange={handleTextScale} style={style} onStyleChange={handleStyle} />
      <Chat textScale={textScale} style={style} mode={mode} setMode={setMode} />
      <AppSubTitle className='hidden md:block absolute top-1/2 right-6 -translate-y-1/2' />
      <Footer />
    </div>
  );
}