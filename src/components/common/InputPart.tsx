'use client';

import { InputPartProps } from "@/lib/props";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Pause } from "lucide-react";
import content from '@/data/content.json';
import ModeTags from "./modeTags";
import TopKSelector from "./topKselector";

export default function InputPart({ handleSubmit, input, handleInputChange, status, stop, style, currentMode, setCurrentMode, currentTopK, setTopK, currentRange, setRange }: InputPartProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col w-full'
    >
      <TopKSelector currentTopK={currentTopK} setTopK={setTopK} currentRange={currentRange} setRange={setRange} />
      <div className='flex items-center justify-center w-full h-18'>
        <Input
          title={content.chat.input.title}
          type="text"
          name="prompt"
          placeholder={content.chat.input.placeholder}
          value={input}
          onChange={handleInputChange}
          className={`px-4 w-full h-full rounded-none
          ${style === 'default'
          ? ''
          : 'text-stone-100 placeholder:text-stone-300'}
          `}
        />
        <div className='h-full flex items-center justify-center'>
          {/* submit button */}
          {input.length > 0 ? (
            <Button
              title={content.chat.input.submit}
              type="submit"
              className={`h-full aspect-square rounded-none cursor-pointer
              ${style === 'default'
              ? ''
              : 'bg-stone-900/50 hover:bg-stone-950 text-stone-100'}
              `}
            >
              <Send className='size-4' />
            </Button>
          ) : null}
          {/* stop button */}
          {status === 'streaming' || status === 'submitted' ? (
            <Button
              title={content.chat.input.stop}
              type="reset"
              className={`h-full aspect-square rounded-none cursor-pointer
              ${style === 'default'
              ? ''
              : 'bg-stone-900/50 hover:bg-stone-950 text-stone-100'}
              `}
              onClick={stop}
              disabled={!(status === 'streaming' || status === 'submitted')}
            >
              <Pause />
            </Button>
          ) : null}
        </div>
      </div>
      <ModeTags currentMode={currentMode} setCurrentMode={setCurrentMode} />
    </form>
  );
}
