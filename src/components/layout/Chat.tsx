'use client';

import { useChat } from '@ai-sdk/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';
import HeaderPart from '@/components/common/HeaderPart';

export default function Chat() {
  const { messages, setMessages, status, input, stop, reload, handleInputChange, handleSubmit, error } = useChat({
    onFinish: () => {
      // チャットが完了したら、画面の最下部にスクロール
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
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
    <div className='grid grid-cols-1 md:grid-cols-2 h-full w-full mx-auto mt-6'>

      {/* title */}
      <HeaderPart />
      {/* message */}
      <div className='flex flex-col w-full gap-6'>
        {/* chat area */}
        <MessagePart messages={messages} error={error} status={status} handleEdit={handleEdit} handleDelete={handleDelete} reload={reload} />
        {/* user input form */}
        <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} />
      </div>

    </div>
  );
}