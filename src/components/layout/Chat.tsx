'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'motion/react';
import MessagePart from '@/components/common/MessagePart';
import InputPart from '@/components/common/InputPart';
import MessageTitle from '@/components/common/MessageTitle';
import Cover from '@/components/common/Cover';
import SourcePart from '@/components/common/sourcePart';
import { useIsMobile } from '@/lib/isMobile';

export default function Chat({ textScale, style }: { textScale: string, style: string }) {
  const { messages, setMessages, status, input, stop, reload, handleInputChange, handleSubmit, error } = useChat();
  // ページが開いた判断変数
  const [isMounted, setIsMounted] = useState(false);
  // モバイル判断変数
  const isMobile = useIsMobile();
  // 表紙を開く/閉じる判断変数
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  // チャットエリアを開く/閉じる判断変数
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ページが開いたら判断変数をtrueにする
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  /**
   * 表紙を開く/閉じる
   */
  const handleCoverOpen = () => {
    if (!isMobile) setIsCoverOpen(!isCoverOpen);
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id))
  }

  return (
    <div className="flex flex-col-reverse md:flex-row justify-center items-center md:items-start w-full max-w-5xl 2xl:max-w-7xl h-full min-h-screen mx-auto mt-6 px-4 pb-8 transition-all">
      <motion.div
        className={`block flex flex-col w-full h-full relative z-10 shadow-md border transition-all
          ${isChatOpen ? '' : 'md:hidden'}
          ${style === 'default'
          ? 'bg-stone-100 dark:bg-stone-900'
          : 'bg-transparent rounded-xl border-white/50 backdrop-blur-sm backdrop-brightness-80 overflow-hidden **:text-stone-50'}
        `}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          x: { type: 'spring', duration: 0.3 },
          opacity: { duration: 0.2, delay: 0.1}
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
        />
        {/* ユーザー入力フォーム */}
        <InputPart handleSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} status={status} stop={stop} style={style} />
        {/* 表紙を開くボタン */}
        { style === 'default' && !isMobile && !isCoverOpen && (
          <motion.div>
            <motion.button
              title='表紙を開く'
              // TODO: handle source open
              onClick={handleCoverOpen}
              className='hidden md:block absolute top-0 right-0 translate-x-full w-8 h-12 bg-accent shadow-md cursor-pointer'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ y: 4 }}
              transition={{ type: 'spring', duration: 0.2 }}
            />
          </motion.div>
        )}
      </motion.div>
      {/* 表紙画像 */}
      {!isMobile && (
        <AnimatePresence initial={true}>
          {isCoverOpen && (
            <motion.div
              className='hidden md:block w-full md:max-w-[360px] origin-top-left'
              onClick={() => {
                setIsChatOpen(true);
                handleCoverOpen()}}
              initial={isChatOpen
                ? { opacity: 0, x: '-100%', y: 0 }
                : { opacity: 0, x: 0, y: 100 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={isChatOpen
                ? { opacity: 0, x: '-100%', y: 0 }
                : { opacity: 0, x: 0, y: 0 }}
              transition={{
                x: { type: 'spring', duration: 0.25 },
                y: { type: 'spring', duration: 0.3 },
                opacity: isChatOpen
                ? { duration: 0.2, delay: 0.1 }
                : { duration: 0.3 },
              }}
            >
              <Cover />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}