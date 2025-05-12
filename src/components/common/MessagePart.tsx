'use client';

import { MessagePartProps } from "@/lib/props";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";
export default function MessagePart({ messages, error, status, handleEdit, handleDelete, reload }: MessagePartProps) {
  return (
    <div className='flex flex-col justify-center border w-full p-2 text-justify'>
        {messages && messages.length === 0 ? (
          <div className='p-2 border'>
            <p className='text-zinc-500'>Chat Area</p>
          </div>
        ) : (
          <>
            {error ? <div className='p-2 border bg-red-800'>{error.message}</div> : null}

            {messages && messages.map(message => (
              <div
                key={message.id}
                className={`p-2 flex flex-col justify-between gap-2 ${message.role === 'user' ? 'self-end' : 'self-start'}`}
              >
                {/* status indicator for latest response */}
                {message.role === 'assistant' ? (
                  <div className='text-sm text-zinc-700'>status: <span className='text-emerald-700'>{status}</span> - id: <span className='text-yellow-700'>{message.id}</span></div>
                ) : null}

                <div>
                  <span className='text-zinc-700'>
                    {message.role === 'user' ? 'Me > ' : 'AI > '}
                  </span>

                  <span className='text-justify leading-relaxed'>
                    {message.content}
                  </span>

                  {message.role === 'assistant' && status === 'ready' ? (
                    <span className='text-zinc-700 animate-pulse animate-duration-200'> _</span>
                  ) : null}
                </div>

                {/* button set after message is sent */}
                {status === 'ready' || status !== 'streaming' ? (
                  <div className={`flex justify-center gap-2 ${message.role === 'user' ? 'self-end' : 'self-start'}`}>
                    {/* edit button */}
                    <button
                      title='Edit'
                      type='button'
                      onClick={() => handleEdit(message.id)}
                      disabled={!(status === 'ready' || status === 'error')}
                      className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-zinc-700 p-1 rounded-md"
                    >
                      <Pencil className='size-4' />
                    </button>

                    {/* regenerate button */}
                    <button
                      title='Regenerate'
                      type='button'
                      onClick={() => reload()}
                      disabled={!(status === 'ready' || status === 'error')}
                      className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-zinc-700 p-1 rounded-md"
                    >
                      <RotateCcw className='size-4' />
                    </button>

                    {/* delete button */}
                    <button
                      title='Delete'
                      type='button'
                      onClick={() => handleDelete(message.id)}
                      disabled={!(status === 'ready')}
                      className="block aspect-square w-fit cursor-pointer brightness-50 hover:brightness-100 hover:bg-zinc-700 p-1 rounded-md"
                    >
                      <Trash2 className='size-4' />
                    </button>

                  </div>
                ) : null}
              </div>
            ))}

          </>
        )}
      </div>
  );
}
