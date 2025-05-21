'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FaqCarousel from '@/components/common/faqCarousel';
import { QuotationReply } from '@/components/ai/QuotationReply';
import { MessagePartProps } from "@/lib/props";
import content from '@/data/content.json';

export default function MessagePart({ messages, error, status, handleEdit, handleDelete, reload, textScale }: MessagePartProps) {
  // メッセージの最下部を参照する
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // メッセージが追加されたらメッセージの最下部にスクロール
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status]);

  // メッセージリストのレンダリングをメモ化してパフォーマンス最適化
  const renderedMessages = useMemo(() => {
    if (!messages || messages.length === 0) return null;
    return (
      <>
        {/* TODO: Error Area Style */}
        {error ? <div className='p-6 bg-red-800'>{error.message}</div> : null}

        {messages.map(message => (
          <div
            key={message.id}
            className="grid grid-cols-[56px_1fr_12px] md:grid-cols-[60px_1fr_12px] justify-center w-full mt-3"
          >
            {/* キャラクター表示 */}
            <div
              className={`w-full h-full flex justify-center
              ${message.role === 'user' ? 'col-start-3' : 'col-start-1'}
              `}>
              {message.role === 'user'
              ? ''
              : <Avatar>
                  <AvatarImage src={content.chat.role.answerImage} />
                  <AvatarFallback>
                    {content.chat.role.answer.charAt(0)}
                  </AvatarFallback>
                </Avatar>}
            </div>
            {/* メッセージエリア */}
            <div className={`w-full flex flex-col gap-1 col-start-2 row-start-1
              ${message.role === 'user' ? 'items-end' : 'items-start'}
              `}>

              {/* ツール呼び出しUI */}
              {message.role === 'assistant' && message.toolInvocations?.map(toolInvocation => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state !== 'result' && (toolName === 'displayQuotation')) {
                  return (
                    <div key={toolCallId} className="mt-2 max-w-[85%] w-full flex justify-start">
                      <div className="bg-card text-card-foreground shadow-sm rounded-2xl p-4 animate-pulse">
                        Loading
                      </div>
                    </div>
                  )
                }
                
                if (state === 'result') {
                    if (toolName === 'replyWithQuotation') {
                        const { result } = toolInvocation;
                        return (
                            <div key={toolCallId} className="mt-2 max-w-[85%] w-full flex justify-start">
                                <QuotationReply {...result} />
                            </div>
                        );
                    }
                }

                return null;
              })}

              {/* チャット内容 */}
              {message.role === 'user' ? (
                // ユーザーの場合
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg text-stone-700 dark:text-stone-400 text-justify tracking-wide bg-stone-50/50 dark:bg-stone-800/50 px-4 py-2 shadow-sm
                    ${textScale === 'md'
                      ? 'text-sm leading-6'
                      : 'text-2xl leading-10'
                    }`}
                >
                  {message.content}
                </motion.div>
              ) : (
                // アシスタントの場合
                <p className={`text-stone-700 dark:text-stone-400 text-justify tracking-wide
                  ${textScale === 'md'
                    ? 'text-sm leading-6'
                    : 'text-2xl leading-10'
                  }`}>
                  {message.content}
                </p>
              )}

              {/* ボタンセット */}
              {status === 'ready' || status !== 'streaming' ? (
                <div className="flex mt-1 opacity-40">
                  {/* 編集ボタン */}
                  <button
                    title='Edit'
                    type='button'
                    onClick={() => handleEdit(message.id)}
                    disabled={!(status === 'ready' || status === 'error')}
                    className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-full"
                  >
                    <Pencil className='size-4' />
                  </button>

                  {/* 再生成ボタン */}
                  <button
                    title='Regenerate'
                    type='button'
                    onClick={() => reload()}
                    disabled={!(status === 'ready' || status === 'error')}
                    className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-full"
                  >
                    <RotateCcw className='size-4' />
                  </button>

                  {/* 削除ボタン */}
                  <button
                    title='Delete'
                    type='button'
                    onClick={() => handleDelete(message.id)}
                    disabled={!(status === 'ready')}
                    className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-full"
                  >
                    <Trash2 className='size-4' />
                  </button>

                </div>
              ) : null}
            </div>
          </div>
        ))}
      </>
    );
  }, [messages, status, error, textScale, handleEdit, handleDelete, reload]);

  return (
    <div className='flex flex-col border w-full h-full text-justify pb-4 overflow-hidden'>
        {messages && messages.length === 0 ? (
          // TODO: Default Question Area
          <div className='p-6 border border-red-500'>
            <p className={`text-stone-500
              ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl'}`}
            >
              {content.chat.defaultContent}
            </p>
            <FaqCarousel />
          </div>
        ) : (
          renderedMessages
        )}
        <div ref={messagesEndRef} />
      </div>
  );
}
