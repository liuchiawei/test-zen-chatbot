'use client';

import { InputPartProps } from "@/lib/props";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Pause } from "lucide-react";
import content from '@/data/content.json';

export default function InputPart({ handleSubmit, input, handleInputChange, status, stop }: InputPartProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-center justify-center w-full border'
    >
        <Input
          title={content.chat.input.title}
          name="prompt"
          placeholder={content.chat.input.placeholder}
          value={input}
          onChange={handleInputChange}
          className='px-4 py-8 w-full rounded-none'
        />
        <div className='h-full flex items-center justify-center'>
          {/* submit button */}
          {input.length > 0 ? (
            <Button
              title={content.chat.input.submit}
              type="submit"
              className='h-full aspect-square rounded-none cursor-pointer'
            >
              <Send className='size-4' />
            </Button>
          ) : null}
          {/* stop button */}
          {status === 'streaming' || status === 'submitted' ? (
            <Button
              title={content.chat.input.stop}
              type="reset"
              className='h-full aspect-square rounded-none cursor-pointer'
              onClick={stop}
              disabled={!(status === 'streaming' || status === 'submitted')}
            >
              <Pause />
            </Button>
          ) : null}
        </div>
      </form>
  );
}
