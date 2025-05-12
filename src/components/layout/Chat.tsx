'use client';

import { useChat } from '@ai-sdk/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';
import HeaderPart from '@/components/common/HeaderPart';

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

  const handleEdit = (id: string) => {
    setMessages(messages.map(message => message.id === id ? { ...message, content: input } : message));
    reload();
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl 2xl:max-w-7xl h-full mx-auto mt-6 px-4 pb-8'>
      {/* title */}
      <HeaderPart textScale={textScale} className='row-[span_1_/_span_2_]' />
      {/* message */}
      <div className='flex flex-col w-full'>
        {/* chat area */}
        <MessagePart messages={messages} error={error} status={status} handleEdit={handleEdit} handleDelete={handleDelete} reload={reload} textScale={textScale} />
        {/* user input form */}
        <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} />
      </div>

    </div>
  );
}