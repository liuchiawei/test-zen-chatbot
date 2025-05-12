'use client';

import { useChat } from '@ai-sdk/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';

export default function Chat() {
  const { messages, setMessages, status, input, stop, reload, handleInputChange, handleSubmit, error } = useChat();

  const handleEdit = (id: string) => {
    setMessages(messages.map(message => message.id === id ? { ...message, content: input } : message));
    reload();
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 h-full w-full max-w-4xl mx-auto p-2'>

      {/* title */}
      <div className='flex flex-col items-center justify-center gap-2 w-full p-2 border'>
        <h1 className='text-2xl font-bold'>Chat</h1>
      </div>

      {/* chat area */}
      <MessagePart messages={messages} error={error} status={status} handleEdit={handleEdit} handleDelete={handleDelete} reload={reload} />

      {/* user input form */}
      <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} />

    </div>
  );
}