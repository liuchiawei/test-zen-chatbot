import { Pencil, RotateCcw, Trash2, Copy, Volume2, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMessageOptsProps, AssistantMessageOptsProps } from "@/lib/props";
import content from "@/data/content.json";

export function UserMessageOpts({ messageId, handleEdit, handleDelete, reload, status, style, editingMessageId }: UserMessageOptsProps) {
  return (
    <div className="flex mt-1 opacity-40">
      {/* 編集ボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title={content.messageOption.edit}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.edit}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* 再生成ボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title={content.messageOption.regenerate}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.regenerate}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* 削除ボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title={content.messageOption.delete}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.delete}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function AssistantMessageOpts({ messageId, status, style, handleCopy, messageContent, isCopied }: AssistantMessageOptsProps) {
  return (
    <div className="flex mt-1 opacity-40">
      {/* コピーボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title={content.messageOption.copy}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.copy}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* 音声再生ボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              title={content.messageOption.speak}
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.speak}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}