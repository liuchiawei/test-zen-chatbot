import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, Volume2, Forward } from "lucide-react";

export default function SourcePartBtns({
  text,
  style,
  isCopied,
  handleCopy,
  isSpeaking,
  handleSpeak
}: {
  text: string;
  style: string;
  isCopied: boolean;
  handleCopy: (content: string) => void;
  isSpeaking: boolean;
  handleSpeak: (content: string) => void;
}) {
  return (
    <div className={`flex gap-2 ${style === 'default' ? 'text-foreground' : 'text-stone-100 hover:text-stone-100'}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon"
              onClick={() => handleCopy(text)}
              className={`${style === 'default'
                ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
                : 'hover:bg-stone-900/80'}`} 
            >
              {isCopied ? <Check className='size-4' /> : <Copy className='size-4' />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>コピー</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon"
              onClick={() => handleSpeak(text)}
              className={`${style === 'default'
              ? isSpeaking
                ? 'animate-pulse animate-duration-200 brightness-50 hover:brightness-100 bg-stone-100 dark:bg-stone-600 hover:bg-stone-300 dark:hover:bg-stone-600'
                : 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
              : isSpeaking
                ? 'animate-pulse animate-duration-200 bg-stone-900/80 hover:bg-stone-900/80'
                : 'hover:bg-stone-900/80'}`}
            >
              <Volume2 />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>音声再生</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon"
              className={`${style === 'default'
                ? 'brightness-50 hover:brightness-100 hover:bg-stone-300 dark:hover:bg-stone-600'
                : 'hover:bg-stone-900/80'}`}
            >
              <Forward />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>共有</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}