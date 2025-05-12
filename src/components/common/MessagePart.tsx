'use client';

import { MessagePartProps } from "@/lib/props";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
import content from '@/data/content.json';
export default function MessagePart({ messages, error, status, handleEdit, handleDelete, reload, textScale }: MessagePartProps) {
  return (
    <div className='flex flex-col border w-full h-full text-justify pb-4'>
        {messages && messages.length === 0 ? (
          // TODO: Default Question Area
          <div className='p-6'>
            <p className={`text-stone-500
              ${textScale === 'md'
              ? 'text-sm'
              : 'text-2xl'}`}
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
                className="grid grid-cols-[56px_1fr_12px] md:grid-cols-[60px_1fr_12px] justify-center w-full mt-3"
              >
                {/* キャラクター表示 */}
                <div
                  className={`w-full h-full flex justify-center
                  ${message.role === 'user' ? 'col-start-3' : 'col-start-1'}
                  `}>
                  {message.role === 'user'
                  ? ''
                  : <div className="size-10 bg-stone-500 dark:bg-stone-200 rounded-full"></div>}
                </div>
                {/* テキストエリア */}
                <div className={`w-full flex flex-col gap-1 col-start-2 row-start-1
                  ${message.role === 'user' ? 'items-end' : 'items-start'}
                  `}>
                  {/* チャット内容 */}
                  <p className={`text-stone-700 dark:text-stone-400 text-justify tracking-wide
                    ${message.role === 'user' ? 'bg-stone-50/50 dark:bg-stone-800/50 px-4 py-2 rounded-lg' : ''}
                    ${textScale === 'md'
                      ? 'text-sm leading-6'
                      : 'text-2xl leading-10'
                    }`}
                  >
                    {message.content}
                  </p>

                  {/* ボタンセット */}
                  {status === 'ready' || status !== 'streaming' ? (
                    <div className="flex mt-1 opacity-40">
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
