import ThemeToggle from "../common/ThemeToggle";
import AvatarButton from "../common/AvatarButton";
import TextScaleButton from "../common/TextScaleButton";
import Link from "next/link";
import { TreePine } from "lucide-react";
import { Button } from "../ui/button";

export default function NavOptionBar({ textScale, onTextScaleChange }: { textScale: string, onTextScaleChange: (scale: string) => void }) {
  return (
    <div className='flex items-center justify-between gap-1 md:gap-2'>
      <Link href="/">
        <Button title="change style" variant="ghost" className="rounded-full cursor-pointer hover:text-white">
          <TreePine className="size-4" />
        </Button>
      </Link>
      <TextScaleButton textScale={textScale} onTextScaleChange={onTextScaleChange} className='rounded-full hover:text-white' />
      <ThemeToggle className='rounded-full hover:text-white' />
      <AvatarButton className='rounded-full' />
    </div>
  );
}
