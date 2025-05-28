import { Pencil, RotateCcw, Trash2, Copy, Volume2, Check } from "lucide-react";
import { UserMessageOptsProps, AssistantMessageOptsProps } from "@/lib/props";

export function UserMessageOpts({ messageId, handleEdit, handleDelete, reload, status, style, editingMessageId }: UserMessageOptsProps) {
  return (
    <div className="flex mt-1 opacity-40">
      {/* 編集ボタン */}
      <button
        title='Edit'
        type='button'
        onClick={() => handleEdit(messageId)}
        disabled={!(status === 'ready' || status === 'error')}
        className={`block aspect-square w-fit cursor-pointer p-2
        ${style === 'default'
        ? 'rounded-sm brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
        : 'rounded-lg hover:bg-stone-900/80'}`}
      >
        <Pencil className='size-4' />
      </button>
      {/* 再生成ボタン */}
      <button
        title='Regenerate'
        type='button'
        onClick={() => reload()}
        // 編集中には再生成不可
        disabled={!(status === 'ready' || status === 'error') || (editingMessageId === messageId)}
        className={`block aspect-square w-fit cursor-pointer p-2
        ${style === 'default'
        ? 'rounded-sm brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
        : 'rounded-lg hover:bg-stone-900/80'}`}
      >
        <RotateCcw className='size-4' />
      </button>
      {/* 削除ボタン */}
      <button
        title='Delete'
        type='button'
        onClick={() => handleDelete(messageId)}
        disabled={!(status === 'ready')}
        className={`block aspect-square w-fit cursor-pointer p-2
        ${style === 'default'
        ? 'rounded-sm brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
        : 'rounded-lg hover:bg-stone-900/80'}`}
      >
        <Trash2 className='size-4' />
      </button>
    </div>
  );
}

export function AssistantMessageOpts({ messageId, status, style, handleCopy, messageContent, isCopied }: AssistantMessageOptsProps) {
  return (
    <div className="flex mt-1 opacity-40">
      {/* コピーボタン */}
      <button
        title='Copy'
        type='button'
        onClick={() => handleCopy(messageContent)}
        disabled={!(status === 'ready' || status === 'error')}
        className={`block aspect-square w-fit cursor-pointer p-2
        ${style === 'default'
        ? 'rounded-sm brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
        : 'rounded-lg hover:bg-stone-900/80'}`}
      >
        {isCopied ? <Check className='size-4' /> : <Copy className='size-4' />}
      </button>
      {/* 音声再生ボタン */}
      <button
        title='Speak'
        type='button'
        // onClick={() => reload()}
        disabled={!(status === 'ready' || status === 'error')}
        className={`block aspect-square w-fit cursor-pointer p-2
        ${style === 'default'
        ? 'rounded-sm brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
        : 'rounded-lg hover:bg-stone-900/80'}`}
      >
        <Volume2 className='size-4' />
      </button>
    </div>
  );
}