'use client';

import { useState, useRef } from "react";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components//ui/sheet";
import SourcePartBtns from "@/components/common/sourcePartBtns";
import MarkdownRenderer from "@/components/common/markdownRender";
import { SourceProps } from "@/lib/props";  

export default function SourcePart({ textScale, style, chunk }: SourceProps) {
  // コピー状態管理
  const [isCopied, setIsCopied] = useState(false);

  // コピーハンドラー
  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      // (0.6秒後に)コピー状態を解除
      setTimeout(() => {
        setIsCopied(false);
      }, 600);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
      // フォールバック: 古いブラウザ対応
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  // 音声再生状態管理
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 音頻緩存管理
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  // 音頻再生ハンドラー
  const handleSpeak = async (content: string) => {
    // キャッシュから既存の音頻を確認
    const cachedAudio = audioCache.current.get(content);
    
    if (cachedAudio) {
      // 既存の音頻を再生
      setIsSpeaking(true);
      cachedAudio.currentTime = 0; // 最初から再生
      cachedAudio.play();
      
      // 音頻再生終了時にisSpeakingをfalseにする
      cachedAudio.onended = () => {
        setIsSpeaking(false);
      };
      return;
    }

    try {
      // 新しい音頻をAPIから取得
      const audio = await fetch('/api/speech', {
        method: 'POST',
        body: JSON.stringify({ text: content }),
      });
      const audioBlob = await audio.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      // キャッシュに保存
      audioCache.current.set(content, audioElement);
      
      // 音頻を再生
      if (!isSpeaking) {
        setIsSpeaking(true);
        audioElement.play();
      }
      
      // 音頻再生終了時にisSpeakingをfalseにする
      audioElement.onended = () => {
        setIsSpeaking(false);
      };
    } catch (error) {
      console.error('音頻生成に失敗しました:', error);
      setIsSpeaking(false); // エラー時もfalseにする
    }
  }

  return (
      <SheetContent className={`${style === 'default' ? 'bg-background' : 'bg-black/[0.2] backdrop-blur-sm'}`}>
        <SheetHeader
          className="p-8 text-white bg-cover bg-center bg-[url(/images/demo_3.jpg)]"
        >
          <SheetTitle className="text-white">
            {chunk.filename.split('　')[0]}
          </SheetTitle>
          <h1 className={`font-semibold
            ${textScale === 'md'
              ? 'text-xl md:text-3xl leading-8 md:leading-10'
              : 'text-2xl md:text-5xl leading-10 md:leading-16'
            }`}
          >
            {chunk.filename.replace('.md', '').split('　')[1]}
          </h1>
        </SheetHeader>
        <div className={`py-4 flex flex-col gap-5
          ${textScale === 'md'
            ? 'px-8'
            : 'px-12'
          }
        `}>
          <TextSkeleton />
          <div className={`text-justify tracking-wide relative before:content-['”'] before:absolute before:right-2 before:top-15 before:-z-10 before:text-[270px] before:leading-6 before:select-none
            ${textScale === 'md'
              ? 'text-sm leading-6'
              : 'text-xl leading-10'
            }
            ${style === 'default'
              ? 'text-foreground before:text-foreground/[0.1]'
              : 'text-stone-100 before:text-stone-100/[0.2]'}
          `}
          >
            <MarkdownRenderer content={chunk.text} />
          </div>
          <TextSkeleton />
        </div>
        <SheetFooter>
          <SourcePartBtns text={chunk.text} style={style} handleCopy={handleCopy} isCopied={isCopied} isSpeaking={isSpeaking} handleSpeak={handleSpeak} />
        </SheetFooter>
      </SheetContent>
  )
}

function TextSkeleton() {
  return (
    <div className="flex flex-col gap-3 *:h-3 *:rounded-full *:bg-stone-300 *:dark:bg-stone-700 *:opacity-70">
      <div className="w-full" />
      <div className="w-full" />
      <div className="w-1/2" />
    </div>
  )
}