import ThemeToggle from "../common/ThemeToggle";
import AvatarButton from "../common/AvatarButton";
import TextScaleButton from "../common/TextScaleButton";
import StyleChangeButton from "../common/styleChangeButton";

export default function NavOptionBar({ textScale, onTextScaleChange, style, onStyleChange }: { textScale: string, onTextScaleChange: (scale: string) => void, style: string, onStyleChange: (style: string) => void }) {
  return (
    <div className='flex items-center justify-between gap-1 md:gap-2'>
      <StyleChangeButton style={style} onStyleChange={onStyleChange} className='rounded-full hover:text-white' />
      <TextScaleButton textScale={textScale} onTextScaleChange={onTextScaleChange} className='rounded-full hover:text-white' />
      <ThemeToggle className='rounded-full hover:text-white' />
      <AvatarButton className='rounded-full' />
    </div>
  );
}
