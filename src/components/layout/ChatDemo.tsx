'use client';

import { useChat, Message } from '@ai-sdk/react';
import { motion } from 'motion/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';
import MessageTitle from '@/components/common/MessageTitle';
import { ChatMode } from '@/lib/props';

// TODO: モード選択の型定義
export default function Chat({ textScale, style, mode, setMode, topK, setTopK, range, setRange }: { chatId?: string | undefined, initialMessages?: Message[], textScale: string, style: string, mode: ChatMode, setMode: (mode: ChatMode) => void, topK: number, setTopK: (topK: number) => void, range: string, setRange: (range: string) => void }) {
  const { messages, setMessages, status, input, stop, reload, handleInputChange, handleSubmit, error } = useChat({
    // experimental_prepareRequestBody({ messages }) {
    //   return { messages, mode: mode, topK: topK };
    // },
  });

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  // メッセージ更新ハンドラーを追加
  const handleUpdateMessage = (messageId: string, newContent: string) => {
    setMessages(messages.map(message => 
      message.id === messageId 
        ? { ...message, content: newContent }
        : message
    ));
  }

  return (
    <motion.div
      className={`grow flex flex-col justify-center w-full max-w-5xl h-full mx-auto shadow-md border transition-all
        ${style === 'default'
        ? 'bg-background dark:bg-stone-900'
        : 'bg-transparent rounded-xl border-white/50 backdrop-blur-sm backdrop-brightness-80 overflow-hidden **:text-stone-50'}
      `}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        duration: 0.3,
      }}
    >
      {/* メッセージタイトル */}
      <MessageTitle className='col-start-1 md:col-start-2 row-start-1' />
      {/* チャットエリア */}
      <MessagePart
        messages={messages}
        error={error}
        status={status}
        handleDelete={handleDelete}
        reload={reload}
        textScale={textScale}
        style={style}
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleUpdateMessage={handleUpdateMessage}
      />
      {/* ユーザー入力フォーム */}
      <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} style={style} currentMode={mode} setCurrentMode={setMode} currentTopK={topK} setTopK={setTopK} currentRange={range} setRange={setRange} />
    </motion.div>
  );
}