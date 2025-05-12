'use client';

import { MessagePartProps } from "@/lib/props";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import content from '@/data/content.json';
export default function MessagePart({ messages, error, status, handleEdit, handleDelete, reload, textScale }: MessagePartProps) {
  return (
    <div className='flex flex-col border w-full h-full text-justify'>
      <div className='border-b p-8'>
        <h1 className='text-xl text-center font-bold tracking-widest'>
          {content.chat.title}
        </h1>
      </div>
        {messages && messages.length === 0 ? (
          // TODO: Default Question Area
          <div className='p-6'>
            <p className={`text-stone-500
              ${textScale === 'md'
              ? 'text-sm'
              : 'text-xl'}`}
            >
              {content.chat.defaultContent}
            </p>
          </div>
        ) : (
          <>
            {/* TODO: Error Area Style */}
            {error ? <div className='p-6 bg-red-800'>{error.message}</div> : null}

            {messages && messages.map(message => (
              <div
                key={message.id}
                className="grid grid-cols-[24px_1fr_24px] justify-center w-full"
              >
                {/* キャラクター表示 */}
                <div
                  className={`h-10 w-full flex items-center justify-center bg-stone-100 dark:bg-stone-800
                  ${message.role === 'user' ? 'col-start-3' : 'col-start-1'}
                  `} />
                {/* テキストエリア */}
                <div className={`w-full px-6 pt-2 flex flex-col gap-1 col-start-2 row-start-1
                  ${message.role === 'user' ? 'items-end' : 'items-start'}
                  `}>
                    {/* キャラクター名 */}
                  <h3 className='font-bold tracking-wider text-stone-800 dark:text-stone-300'>
                    {message.role === 'user' ? content.chat.role.user : content.chat.role.assistant}
                  </h3>

                  {/* チャット内容 */}
                  <p className={`text-stone-700 dark:text-stone-400 text-justify tracking-wide
                    ${textScale === 'md'
                      ? 'mt-1 text-sm leading-6'
                      : 'mt-3 text-lg leading-8'
                    }`}
                  >
                    {message.content}
                  </p>

                  {/* ボタンセット */}
                  {status === 'ready' || status !== 'streaming' ? (
                    <div className="flex gap-2 mt-4 opacity-40">
                      {/* 編集ボタン */}
                      <button
                        title='Edit'
                        type='button'
                        onClick={() => handleEdit(message.id)}
                        disabled={!(status === 'ready' || status === 'error')}
                        className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-xs"
                      >
                        <Pencil className='size-4' />
                      </button>

                      {/* 再生成ボタン */}
                      <button
                        title='Regenerate'
                        type='button'
                        onClick={() => reload()}
                        disabled={!(status === 'ready' || status === 'error')}
                        className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-xs"
                      >
                        <RotateCcw className='size-4' />
                      </button>

                      {/* 削除ボタン */}
                      <button
                        title='Delete'
                        type='button'
                        onClick={() => handleDelete(message.id)}
                        disabled={!(status === 'ready')}
                        className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-stone-500 p-2 rounded-xs"
                      >
                        <Trash2 className='size-4' />
                      </button>

                    </div>
                  ) : null}
                </div>
              </div>
            ))}

          </>
        )}
      </div>
  );
}
