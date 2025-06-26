import { Pencil, RotateCcw, Trash2, Copy, Volume2, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMessageOptsProps, AssistantMessageOptsProps } from "@/lib/props";
import { Button } from "@/components/ui/button";
import content from "@/data/content.json";

export function UserMessageOpts({ messageId, handleEdit, handleDelete, reload, status, style, editingMessageId }: UserMessageOptsProps) {
  return (
    <div className="flex mt-1 gap-1 opacity-40">
      {/* 編集ボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              onClick={() => handleEdit(messageId)}
              disabled={!(status === 'ready' || status === 'error')}
              className={`block aspect-square w-fit p-2 rounded-sm
              ${style === 'default'
              ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : 'hover:bg-stone-900/80'}`}
            >
              <Pencil className='size-4' />
            </Button>
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
            <Button
              variant='ghost'
              onClick={() => reload()}
              // 編集中には再生成不可
              disabled={!(status === 'ready' || status === 'error') || (editingMessageId === messageId)}
              className={`block aspect-square w-fit p-2 rounded-sm
              ${style === 'default'
              ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : 'hover:bg-stone-900/80'}`}
      >
              <RotateCcw className='size-4' />
            </Button>
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
            <Button
              variant='ghost'
              onClick={() => handleDelete(messageId)}
              disabled={!(status === 'ready')}
              className={`block aspect-square w-fit p-2 rounded-sm
              ${style === 'default'
              ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : 'hover:bg-stone-900/80'}`}
            >
              <Trash2 className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.delete}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export function AssistantMessageOpts({ messageId, status, style, handleCopy, messageContent, isCopied, handleSpeak, isSpeaking }: AssistantMessageOptsProps) {
  return (
    <div className="flex mt-1 gap-1 opacity-40">
      {/* コピーボタン */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              onClick={() => handleCopy(messageContent)}
              disabled={!(status === 'ready' || status === 'error')}
              className={`block aspect-square w-fit p-2 rounded-sm
              ${style === 'default'
              ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : 'hover:bg-stone-900/80'}`}
            >
              {isCopied ? <Check className='size-4' /> : <Copy className='size-4' />}
            </Button>
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
            <Button
              variant='ghost'
              onClick={() => handleSpeak(messageContent)}
              disabled={!(status === 'ready' || status === 'error')}
              className={`block aspect-square w-fit p-2 rounded-sm
              ${style === 'default'
              ? isSpeaking
                ? 'animate-pulse animate-duration-200 brightness-50 hover:brightness-100 bg-stone-100 dark:bg-stone-600 hover:bg-stone-300 dark:hover:bg-stone-600'
                : 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : isSpeaking
                ? 'animate-pulse animate-duration-200 bg-stone-900/80 hover:bg-stone-900/80'
                : 'hover:bg-stone-900/80'}`}
            >
              <Volume2 className='size-4' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{content.messageOption.speak}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}