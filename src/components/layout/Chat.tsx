'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';
import HeaderPart from '@/components/common/HeaderPart';
import MessageTitle from '@/components/common/MessageTitle';
import { useIsMobile } from '@/lib/isMobile';

export default function Chat({ textScale }: { textScale: string }) {
  const { messages, setMessages, status, input, stop, reload, handleInputChange, handleSubmit, error } = useChat({
    onFinish: () => {
      // チャットが完了したら、画面の最下部にスクロール
      // ウィンドウサイズを再計算してからスクロール
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      });
    },
  });

  const isMobile = useIsMobile();
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  
  // 表紙を開く/閉じる
  const handleCoverOpen = () => {
    if (!isMobile) setIsCoverOpen(!isCoverOpen);
  }

  const handleEdit = (id: string) => {
    setMessages(messages.map(message => message.id === id ? { ...message, content: input } : message));
    reload();
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  return (
    <div className={`grid grid-cols-1 grid-rows-[92px_1fr_64px] w-full max-w-5xl 2xl:max-w-7xl h-full mx-auto mt-6 px-4 pb-8 transition-all
      ${!isMobile && isCoverOpen ? 'md:grid-cols-2' : 'md:grid-cols-[96px_1fr]'}
    `}>
      {/* ヘッダー画像 */}
      <HeaderPart textScale={textScale} isCoverOpen={isCoverOpen} handleCoverOpen={handleCoverOpen} className='row-span-3' />
      {/* メッセージタイトル */}
      <MessageTitle className='col-start-1 md:col-start-2 row-start-1' />
      {/* チャットエリア */}
      <MessagePart messages={messages} error={error} status={status} handleEdit={handleEdit} handleDelete={handleDelete} reload={reload} textScale={textScale} />
      {/* ユーザー入力フォーム */}
      <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} />
    </div>
  );
}