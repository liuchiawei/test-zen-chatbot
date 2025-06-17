import ThemeToggle from "@/components/common/ThemeToggle";
import AvatarButton from "@/components/common/AvatarButton";
import TextScaleButton from "@/components/common/TextScaleButton";
import StyleChangeButton from "@/components/common/styleChangeButton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function NavOptionBar({ textScale, onTextScaleChange, style, onStyleChange }: { textScale: string, onTextScaleChange: (scale: string) => void, style: string, onStyleChange: (style: string) => void }) {
  return (
    <div className='flex items-center justify-between gap-1 md:gap-2'>
      <StyleChangeButton style={style} onStyleChange={onStyleChange} className='rounded hover:text-white' />
      <TextScaleButton textScale={textScale} onTextScaleChange={onTextScaleChange} className='rounded hover:text-white' />
      <ThemeToggle className='rounded hover:text-white' />
      <Sheet>
        <SheetTrigger asChild>
          <AvatarButton className='rounded-full' />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Page</SheetTitle>
          </SheetHeader>
          <AvatarButton className='rounded' />
        </SheetContent>
      </Sheet>
    </div>
  );
}
