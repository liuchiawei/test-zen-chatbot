'use client';

import { InputPartProps } from "@/lib/props";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

export default function InputPart({ handleSubmit, input, handleInputChange, status, stop }: InputPartProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-center justify-center gap-2 w-full p-2 border'
    >
        <Input
          title='入力'
          name="prompt"
          placeholder='質問を入力してください'
          value={input}
          onChange={handleInputChange}
          className='p-2 w-full'
        />
        <div className='flex items-center justify-center gap-2'>
          {/* submit button */}
          {input.length > 0 ? (
            <Button
              title='送信'
              type="submit"
              size='icon'
              className='cursor-pointer'
            >
              <Send className='size-4' />
            </Button>
          ) : null}
          {/* stop button */}
          {status === 'streaming' || status === 'submitted' ? (
            <Button
              title='Stop'
              type="reset"
              className='py-2 px-4 border cursor-pointer hover:bg-zinc-700' onClick={stop} disabled={!(status === 'streaming' || status === 'submitted')}
            >
              Stop
            </Button>
          ) : null}
        </div>
      </form>
  );
}
